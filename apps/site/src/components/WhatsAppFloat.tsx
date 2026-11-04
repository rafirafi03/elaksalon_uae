import { getCompanySettings } from "@/lib/company";
import { SOCIAL_PLATFORMS } from "@/lib/social";

const WHATSAPP_ICON = SOCIAL_PLATFORMS.find((p) => p.key === "whatsapp")!.path;

/** Floating WhatsApp chat button, fixed to the bottom-right of every page. */
export default async function WhatsAppFloat() {
  const company = await getCompanySettings();
  const number = company.whatsapp_number?.replace(/\D/g, "");
  if (!number) return null;

  const message = `Hello ${company.company_name || "ELAK"} Men's Salon 👋 I'd like to know more.`;
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition hover:scale-110 hover:bg-[#1ebe5b] focus-visible:ring-4 focus-visible:ring-[#25D366]/40 focus-visible:outline-none sm:right-6 sm:bottom-6 lg:h-16 lg:w-16"
    >
      {/* Soft pulse ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping [animation-duration:2.2s]"
      />
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="relative h-7 w-7 lg:h-8 lg:w-8">
        <path d={WHATSAPP_ICON} />
      </svg>
      {/* Tooltip on larger screens */}
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-background/95 px-3 py-1.5 text-xs whitespace-nowrap text-cream opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
        Chat with us
      </span>
    </a>
  );
}
