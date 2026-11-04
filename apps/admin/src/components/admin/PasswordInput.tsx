"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Password field with show/hide toggle. */
export default function PasswordInput({
  label,
  name,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block">
      <span className="admin-label">
        {label}
        {hint ? <span className="ml-2 normal-case tracking-normal opacity-70">{hint}</span> : null}
      </span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          required
          autoComplete={autoComplete}
          className="admin-input pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted transition hover:text-gold"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
