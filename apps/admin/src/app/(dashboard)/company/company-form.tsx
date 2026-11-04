"use client";

import { useFormAction } from "@/lib/use-form-action";
import type { CompanySettingsRow } from "@elak/db";
import FormError from "@/components/admin/FormError";
import SocialLinksField from "./social-links-field";
import { saveCompanySettings, type CompanyActionState } from "./actions";

const initialState: CompanyActionState = {};

export default function CompanyForm({
  settings,
  onCancel,
  onSaved,
}: {
  settings?: CompanySettingsRow | null;
  onCancel?: () => void;
  onSaved?: (message: string) => void;
}) {
  const [state, formAction, pending] = useFormAction(
    async (prev: CompanyActionState, formData: FormData) => {
      const result = await saveCompanySettings(prev, formData);
      if (result.success) onSaved?.(result.success);
      return result;
    },
    initialState,
  );

  return (
    <form
      onSubmit={formAction}
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

      <section className="space-y-5 border-t border-border/60 pt-8">
        <h2 className="font-serif text-xl text-cream">Social media</h2>
        <SocialLinksField defaultValue={settings?.social_links ?? []} />
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save company details"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-cream transition hover:border-gold/60 disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
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
