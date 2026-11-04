"use client";

import { useState, useTransition } from "react";
import { ImageDown, Loader2 } from "lucide-react";
import { optimizeStoredImages, type OptimizeResult } from "./optimize-actions";

/** Button that re-compresses large images uploaded before automatic compression. */
export default function OptimizeImages() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<OptimizeResult | null>(null);

  return (
    <div className="max-w-xl space-y-4 rounded-[2rem] bg-surface-elevated p-6 sm:p-8">
      <div>
        <h2 className="font-serif text-xl text-cream">Optimize images</h2>
        <p className="mt-1 text-sm text-muted">
          New uploads are resized and compressed automatically. Run this once to shrink large images uploaded
          earlier (over 400 KB) — it makes the website load faster. Safe to run again any time.
        </p>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setResult(null);
            try {
              setResult(await optimizeStoredImages());
            } catch {
              setResult({ error: "Something went wrong. Please try again." });
            }
          })
        }
        className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <ImageDown size={16} />}
        {pending ? "Optimizing… this can take a minute" : "Optimize images"}
      </button>

      {result?.error ? <p className="text-sm text-danger">{result.error}</p> : null}
      {result && !result.error ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-cream">
          {result.optimized
            ? `Optimized ${result.optimized} image${result.optimized === 1 ? "" : "s"}, saving ${
                result.savedKb && result.savedKb > 1024
                  ? `${(result.savedKb / 1024).toFixed(1)} MB`
                  : `${result.savedKb} KB`
              }.`
            : `All ${result.checked} images are already optimized.`}
          {result.failed ? ` ${result.failed} could not be processed (see server log).` : ""}
        </p>
      ) : null}
    </div>
  );
}
