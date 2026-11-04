"use client";

import { useFormAction } from "@/lib/use-form-action";
import { ExternalLink } from "lucide-react";
import FormError from "@/components/admin/FormError";
import { saveGoogleReviewsUrl, type ReviewActionState } from "./actions";

const initialState: ReviewActionState = {};

export default function GoogleLinkForm({ defaultValue }: { defaultValue: string }) {
  const [state, formAction, pending] = useFormAction(saveGoogleReviewsUrl, initialState);

  return (
    <form onSubmit={formAction} className="mb-6 space-y-3 rounded-[1.75rem] bg-surface-elevated p-5 sm:p-6">
      <div>
        <h2 className="font-serif text-lg text-cream">Google reviews link</h2>
        <p className="mt-1 text-xs text-muted">
          Shown as “View more on Google” under the testimonials on the site. Leave empty to hide the button.
        </p>
      </div>
      <FormError message={state.error} />
      {state.success ? <p className="text-sm text-gold">{state.success}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          name="google_reviews_url"
          defaultValue={defaultValue}
          placeholder="https://g.page/r/your-business/review or Google Maps link"
          className="admin-input flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save link"}
        </button>
      </div>
      {defaultValue ? (
        <a
          href={defaultValue}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-soft"
        >
          Open current link <ExternalLink size={12} />
        </a>
      ) : null}
    </form>
  );
}
