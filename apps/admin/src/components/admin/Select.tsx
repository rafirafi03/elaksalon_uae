"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type Props = {
  options: SelectOption[];
  /** Form field name (submits like a native select). */
  name?: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  "aria-label"?: string;
  className?: string;
  /** Classes for the trigger button (defaults to the admin input look). */
  buttonClassName?: string;
};

/**
 * Themed, accessible dropdown (listbox) replacing native <select>, whose option popup can't be styled.
 * Keyboard: ↑ ↓ Home End to move, Enter/Space to pick, Esc to close, letters to jump.
 */
export default function Select({
  options,
  name,
  value: controlled,
  defaultValue = "",
  onChange,
  placeholder = "Select…",
  required,
  disabled,
  icon,
  className,
  buttonClassName,
  ...rest
}: Props) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const id = useId();

  const selected = options.find((o) => o.value === value);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (controlled === undefined) setInternal(option.value);
    onChange?.(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function openList() {
    if (disabled) return;
    const current = options.findIndex((o) => o.value === value);
    setActive(current >= 0 && !options[current].disabled ? current : (enabled[0] ?? -1));
    setOpen(true);
  }

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the active option in view.
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function move(delta: number) {
    if (!enabled.length) return;
    const pos = enabled.indexOf(active);
    const next = pos < 0 ? enabled[0] : enabled[Math.min(enabled.length - 1, Math.max(0, pos + delta))];
    setActive(next);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else move(e.key === "ArrowDown" ? 1 : -1);
        return;
      case "Home":
      case "End":
        if (!open) return;
        e.preventDefault();
        setActive(e.key === "Home" ? enabled[0] : enabled[enabled.length - 1]);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    // Type-ahead: jump to the first option starting with the typed letters.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = Date.now();
      const t = typeahead.current;
      t.text = now - t.time > 600 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
      t.time = now;
      const match = enabled.find((i) => options[i].label.toLowerCase().startsWith(t.text));
      if (match !== undefined) {
        if (open) setActive(match);
        else choose(match);
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* Carries the value for form submission and native `required` validation. */}
      {name ? (
        <input
          name={name}
          value={value}
          required={required}
          onChange={() => {}}
          onInvalid={() => buttonRef.current?.focus()}
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full opacity-0"
        />
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
        aria-label={rest["aria-label"]}
        className={cn(
          buttonClassName ?? "admin-input",
          "flex w-full items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60",
          open && "border-gold",
        )}
      >
        {icon ? <span className="shrink-0 text-gold">{icon}</span> : null}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-muted")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-muted transition-transform duration-200", open && "rotate-180 text-gold")}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          className="absolute top-full right-0 left-0 z-50 mt-2 max-h-64 min-w-full overflow-auto rounded-2xl border border-border/80 bg-surface-elevated p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        >
          {options.length === 0 ? <li className="px-3 py-2.5 text-sm text-muted">No options</li> : null}
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onPointerMove={() => !option.disabled && setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  option.disabled && "cursor-not-allowed opacity-40",
                  i === active && !option.disabled ? "bg-gold/15 text-cream" : "text-cream/80",
                  isSelected && "text-gold",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isSelected ? <Check size={15} className="shrink-0 text-gold" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
