"use client";

import { useState } from "react";
import { useFormAction } from "@/lib/use-form-action";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ReviewRow } from "@elak/db";
import ImageUpload from "@/components/admin/ImageUpload";
import FormError from "@/components/admin/FormError";
import type { ReviewActionState } from "./actions";

const initialState: ReviewActionState = {};

type Props = {
  review?: ReviewRow;
  action: (prev: ReviewActionState, formData: FormData) => Promise<ReviewActionState>;
  submitLabel: string;
};

export default function ReviewForm({ review, action, submitLabel }: Props) {
  const [state, formAction, pending] = useFormAction(action, initialState);
  const [rating, setRating] = useState(review?.rating ?? 5);

  return (
    <form
      onSubmit={formAction}
      className="max-w-4xl space-y-8 rounded-[2rem] bg-surface-elevated p-6 sm:p-8 lg:p-10"
    >
      <FormError message={state.error} />

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="admin-label">Customer name</span>
            <input name="name" required maxLength={120} defaultValue={review?.name ?? ""} className="admin-input" />
          </label>
          <label className="block">
            <span className="admin-label">
              Subtitle <span className="ml-2 normal-case tracking-normal opacity-70">optional, e.g. “Regular client”</span>
            </span>
            <input name="role" maxLength={120} defaultValue={review?.role ?? ""} className="admin-input" />
          </label>

          <div>
            <span className="admin-label">Rating</span>
            <input type="hidden" name="rating" value={rating} />
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className="rounded-full p-1 transition hover:scale-110"
                >
                  <Star size={24} className={n <= rating ? "fill-gold text-gold" : "text-muted"} />
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="admin-label">Review</span>
            <textarea
              name="comment"
              required
              rows={5}
              maxLength={1000}
              defaultValue={review?.comment ?? ""}
              className="admin-input resize-y"
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-cream">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={review?.is_published ?? true}
              className="h-4 w-4 accent-[var(--color-gold,#c9a45c)]"
            />
            Show on website
          </label>
        </div>

        <div>
          <ImageUpload name="image_url" folder="reviews" defaultValue={review?.image_url ?? ""} />
          <p className="mt-2 text-xs text-muted">Optional customer photo. Initials are shown if empty.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/reviews"
          className="rounded-full border border-border px-6 py-3 text-sm text-muted transition hover:border-gold/40 hover:text-cream"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
