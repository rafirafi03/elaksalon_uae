"use client";

import { useState, useTransition } from "react";
import { deleteSpecialist } from "./actions";

export default function DeleteSpecialistButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteSpecialist(id);
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
