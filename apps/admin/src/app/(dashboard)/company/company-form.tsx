"use client";

import { useActionState } from "react";
import type { CompanySettingsRow } from "@elak/db";
import FormError from "@/components/admin/FormError";
import { saveCompanySettings, type CompanyActionState } from "./actions";

const initialState: CompanyActionState = {};

export default function CompanyForm({ settings }: { settings?: CompanySettingsRow | null }) {
  const [state, formAction, pending] = useActionState(saveCompanySettings, initialState);

  return (
    <form
      action={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />
      {state.success ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cream">
          {state.success}
        </p>
      ) : null}

      <section className="space-y-5">
        <h2 className="font-serif text-xl text-cream">Brand</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company name" name="company_name" defaultValue={settings?.company_name} required />
          <Field label="Tagline" name="tagline" defaultValue={settings?.tagline} placeholder="Premium Men's Salon UAE" />
        </div>
      </section>

      <section className="space-y-5 border-t border-border/60 pt-8">
        <h2 className="font-serif text-xl text-cream">Contact</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" defaultValue={settings?.email} placeholder="hello@elaksalon.ae" />
          <Field label="Phone" name="phone" defaultValue={settings?.phone} placeholder="+971 55 870 5679" />
        </div>
        <Field
          label="WhatsApp number"
          name="whatsapp_number"
          defaultValue={settings?.whatsapp_number}
          placeholder="971558705679"
          hint="Digits only, with country code"
        />
      </section>

      <section className="space-y-5 border-t border-border/60 pt-8">
        <h2 className="font-serif text-xl text-cream">Location</h2>
        <Field label="Address" name="address" defaultValue={settings?.address} placeholder="Street / area" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="City" name="city" defaultValue={settings?.city} placeholder="Dubai" />
          <Field label="Country" name="country" defaultValue={settings?.country} placeholder="United Arab Emirates" />
        </div>
        <Field
          label="Opening hours"
          name="opening_hours"
          defaultValue={settings?.opening_hours}
          placeholder="Open daily · 10:00 AM – 10:00 PM"
        />
      </section>

      <section className="space-y-5 border-t border-border/60 pt-8">
        <h2 className="font-serif text-xl text-cream">Map</h2>
        <label className="block">
          <span className="admin-label">Google Maps embed URL</span>
          <textarea
            name="map_embed_url"
            rows={3}
            defaultValue={settings?.map_embed_url ?? ""}
            className="admin-input resize-y"
            placeholder="https://www.google.com/maps/embed?..."
          />
        </label>
        <Field
          label="Open in Maps link"
          name="map_link_url"
          defaultValue={settings?.map_link_url}
          placeholder="https://maps.google.com/?q=..."
        />
      </section>

      <div className="border-t border-border/60 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save company details"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="admin-label">
        {label}
        {hint ? <span className="ml-2 normal-case tracking-normal opacity-70">{hint}</span> : null}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="admin-input"
      />
    </label>
  );
}
