"use server";

import { Resend } from "resend";
import { getCompanySettings } from "@/lib/company";

export type ContactState = { error?: string; success?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FAILED = "We couldn't send your message right now. Please try again later or contact us on WhatsApp.";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Sends the contact form to the salon inbox via Resend (server-only; API key never reaches the browser). */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("website") ?? "")) return { success: "Thanks! We'll get back to you soon." };

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const message = String(formData.get("message") ?? "").trim().slice(0, 4000);

  if (!name || !email || !message) return { error: "Please fill in your name, email and message." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };

  const apiKey = process.env.RESEND_API_KEY;
  const company = await getCompanySettings();
  const to = process.env.CONTACT_TO_EMAIL || company.email;
  const from = process.env.CONTACT_FROM_EMAIL || `${company.company_name} Website <onboarding@resend.dev>`;

  if (!apiKey || !to) {
    console.error("[site] contact: RESEND_API_KEY or recipient email is not configured");
    return { error: FAILED };
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;color:#111">
      <h2 style="margin:0 0 16px">New message from the ${escapeHtml(company.company_name)} website</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:0 0 6px;color:#666">Message</p>
      <div style="white-space:pre-wrap;padding:12px;background:#f5f5f5;border-radius:8px">${escapeHtml(message)}</div>
      <p style="margin-top:16px;font-size:12px;color:#888">Reply to this email to answer ${escapeHtml(name)} directly.</p>
    </div>`;

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Message:", message].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `New contact message from ${name}`,
      html,
      text,
    });
    if (error) {
      console.error("[site] contact: Resend error", error);
      return { error: FAILED };
    }
  } catch (error) {
    console.error("[site] contact: send failed", error);
    return { error: FAILED };
  }

  return { success: "Thanks! Your message has been sent. We'll get back to you soon." };
}
