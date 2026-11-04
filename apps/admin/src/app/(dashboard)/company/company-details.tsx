"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { CompanySettingsRow } from "@elak/db";
import CompanyForm from "./company-form";

export default function CompanyDetails({ settings }: { settings: CompanySettingsRow | null }) {
  // No saved settings yet → go straight to the form.
  const [editing, setEditing] = useState(!settings);
  const [message, setMessage] = useState<string | null>(null);

  if (editing) {
    return (
      <CompanyForm
        settings={settings}
        onCancel={settings ? () => setEditing(false) : undefined}
        onSaved={(msg) => {
          setMessage(msg);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {message ? (
          <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cream">{message}</p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => {
            setMessage(null);
            setEditing(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background transition hover:bg-gold-soft"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>

      <Section title="Brand" first>
        <Item label="Company name" value={settings?.company_name} />
        <Item label="Tagline" value={settings?.tagline} />
      </Section>

      <Section title="Contact">
        <Item label="Email" value={settings?.email} />
        <Item label="Phone" value={settings?.phone} />
        <Item label="WhatsApp number" value={settings?.whatsapp_number} />
      </Section>

      <Section title="Location">
        <Item label="Address" value={settings?.address} wide />
        <Item label="City" value={settings?.city} />
        <Item label="Country" value={settings?.country} />
        <Item label="Opening hours" value={settings?.opening_hours} wide />
      </Section>

      <Section title="Map">
        <Item label="Google Maps embed URL" value={settings?.map_embed_url} wide />
        <Item label="Open in Maps link" value={settings?.map_link_url} wide />
      </Section>

      <Section title="Social media">
        <Item
          label="Links"
          value={settings?.social_links?.length ? settings.social_links.join("\n") : null}
          wide
        />
      </Section>
    </div>
  );
}

function Section({ title, first, children }: { title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <section className={first ? "space-y-5" : "space-y-5 border-t border-border/60 pt-8"}>
      <h2 className="font-serif text-xl text-cream">{title}</h2>
      <dl className="grid gap-5 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Item({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="admin-label">{label}</dt>
      <dd className="mt-1 break-words whitespace-pre-line text-sm text-cream">
        {value ? value : <span className="opacity-50">Not set</span>}
      </dd>
    </div>
  );
}
