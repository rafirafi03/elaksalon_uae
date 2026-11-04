"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

let nextKey = 0;
const row = (url = "") => ({ key: nextKey++, url });

/** Editable list of social media URLs. Submits as repeated `social_links` fields. */
export default function SocialLinksField({ defaultValue = [] }: { defaultValue?: string[] }) {
  const [links, setLinks] = useState(() => (defaultValue.length ? defaultValue.map((u) => row(u)) : [row()]));

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={link.key} className="flex items-center gap-2">
          <input
            type="url"
            name="social_links"
            value={link.url}
            onChange={(e) =>
              setLinks((prev) => prev.map((l) => (l.key === link.key ? { ...l, url: e.target.value } : l)))
            }
            placeholder="https://instagram.com/yoursalon"
            aria-label={`Social media link ${index + 1}`}
            className="admin-input"
          />
          <button
            type="button"
            onClick={() => setLinks((prev) => (prev.length > 1 ? prev.filter((l) => l.key !== link.key) : [row()]))}
            aria-label="Remove link"
            className="shrink-0 rounded-full p-2.5 text-muted transition hover:bg-surface hover:text-danger"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {links.length < 12 ? (
        <button
          type="button"
          onClick={() => setLinks((prev) => [...prev, row()])}
          className="inline-flex items-center gap-2 text-sm text-gold transition hover:text-gold-soft"
        >
          <Plus size={16} />
          Add link
        </button>
      ) : null}
      <p className="text-xs text-muted">
        Instagram, Facebook, TikTok, X, YouTube, Snapchat, WhatsApp, LinkedIn and Pinterest show their own icon on the
        site. Other links show a website icon.
      </p>
    </div>
  );
}
