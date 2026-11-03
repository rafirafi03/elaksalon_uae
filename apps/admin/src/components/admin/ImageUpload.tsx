"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Link2 } from "lucide-react";
import { uploadMedia } from "@/lib/upload";

type Props = {
  name?: string;
  folder?: string;
  defaultValue?: string;
  required?: boolean;
};

export default function ImageUpload({
  name = "image_url",
  folder = "uploads",
  defaultValue = "",
  required,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [pending, startTransition] = useTransition();

  function onFileChange(file: File | undefined) {
    if (!file) return;
    setError(null);
    const body = new FormData();
    body.set("file", file);
    body.set("folder", folder);

    startTransition(async () => {
      const result = await uploadMedia(body);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) setUrl(result.url);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="admin-label mb-0">Image</p>
        <div className="flex rounded-full border border-border p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-full px-3 py-1.5 transition ${
              mode === "upload" ? "bg-gold text-background" : "text-muted hover:text-cream"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-full px-3 py-1.5 transition ${
              mode === "url" ? "bg-gold text-background" : "text-muted hover:text-cream"
            }`}
          >
            URL
          </button>
        </div>
      </div>

      <input type="hidden" name={name} value={url} required={required} />

      {mode === "upload" ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.75rem] bg-surface px-4 py-10 text-center transition hover:bg-background"
        >
          {pending ? (
            <Loader2 className="animate-spin text-gold" size={28} />
          ) : url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Preview" className="max-h-52 rounded-2xl object-contain" />
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-background">
                <ImagePlus size={20} />
              </span>
              <div>
                <p className="font-serif text-xl text-cream">Upload image</p>
                <p className="mt-1 text-xs text-muted">JPG, PNG, WEBP, GIF · max 5MB</p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
        </div>
      ) : (
        <label className="block">
          <span className="sr-only">Image URL</span>
          <div className="relative">
            <Link2 size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="admin-input pl-10"
            />
          </div>
        </label>
      )}

      {url && mode === "upload" ? (
        <button
          type="button"
          onClick={() => {
            setUrl("");
            setError(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="text-xs tracking-wide text-muted uppercase transition hover:text-danger"
        >
          Remove image
        </button>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
