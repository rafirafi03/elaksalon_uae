"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  /** Name of the item, shown in bold in the message. */
  itemName: string;
  /** e.g. "product", "review". */
  itemType: string;
  onConfirm: () => Promise<{ error?: string }>;
  /** Overrides for bulk actions. */
  title?: string;
  message?: React.ReactNode;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  disabled?: boolean;
};

/** Delete button that asks for confirmation in a styled modal instead of window.confirm(). */
export default function ConfirmDeleteButton({
  itemName,
  itemType,
  onConfirm,
  title,
  message,
  triggerLabel = "Delete",
  triggerClassName = "text-sm text-danger transition hover:text-danger/80",
  disabled,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function close() {
    if (!pending) setOpen(false);
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await onConfirm();
      if (result.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        disabled={disabled}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault(); // Esc: close via state so React stays in sync
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close(); // click on backdrop
        }}
        aria-labelledby="confirm-delete-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[1.75rem] border border-border/70 bg-surface-elevated p-0 text-left text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {open ? (
          <div className="p-6 sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
              <Trash2 size={20} />
            </span>
            <h2 id="confirm-delete-title" className="mt-4 font-serif text-2xl text-cream">
              {title ?? `Delete ${itemType}?`}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {message ?? (
                <>
                  <span className="font-medium text-cream">“{itemName}”</span> will be permanently deleted. This cannot
                  be undone.
                </>
              )}
            </p>

            {error ? <p className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={close}
                disabled={pending}
                autoFocus
                className="rounded-full border border-border px-5 py-2.5 text-sm text-cream transition hover:border-gold/50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-danger px-5 py-2.5 text-sm font-medium text-white transition hover:bg-danger/85 disabled:opacity-60"
              >
                {pending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
