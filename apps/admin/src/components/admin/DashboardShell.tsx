"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(22,184,170,0.08),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(232,223,208,0.04),transparent_40%)]" />

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="relative lg:pl-[var(--sidebar-width)]">
        <header className="sticky top-0 z-30 border-b border-border/40 bg-background/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-full p-2 text-gold transition hover:bg-white/5 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gold uppercase">ELAK Men&apos;s Salon</p>
                <p className="mt-0.5 text-sm text-cream/80">Content management</p>
              </div>
            </div>
            <span className="hidden rounded-full border border-border px-3 py-1.5 text-[11px] tracking-wide text-muted uppercase sm:inline-flex">
              UAE
            </span>
          </div>
        </header>

        <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
