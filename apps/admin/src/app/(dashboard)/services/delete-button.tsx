"use client";

import { useState, useTransition } from "react";
import { deleteService } from "./actions";

export default function DeleteServiceButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteService(id);
            if (result.error) setError(result.error);
          });
        }}
        className="text-sm text-danger transition hover:text-danger/80 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </div>
  );
}
