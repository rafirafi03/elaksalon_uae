"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Building2, LayoutGrid, LayoutDashboard, LogOut, Package, Scissors, Star, Tag, UserRound, Users, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { signOut } from "@/app/login/actions";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/services", label: "Services", icon: Scissors },
  { href: "/packages", label: "Packages", icon: Boxes },
  { href: "/specialists", label: "Specialists", icon: Users },
  { href: "/offers", label: "Offers", icon: Tag },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/account", label: "Account", icon: UserRound },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r border-border/60 bg-background transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/" onClick={onClose}>
            <p className="font-serif text-2xl tracking-[0.2em] text-gold">ELAK</p>
            <p className="mt-1 text-[10px] tracking-[0.28em] text-muted uppercase">Admin</p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gold transition hover:bg-white/5 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
          <p className="mb-2 px-3 text-[10px] tracking-[0.25em] text-gold uppercase">Menu</p>
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-3 text-sm tracking-wide transition",
                  active
                    ? "bg-gold text-background"
                    : "text-cream/75 hover:bg-surface-elevated hover:text-cream",
                )}
              >
                <Icon size={17} strokeWidth={1.6} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/60 px-6 py-5">
          <p className="font-serif text-lg text-cream">Salon CMS</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Content for the public ELAK experience.
          </p>
          <form action={signOut} className="mt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-xs tracking-wide text-muted uppercase transition hover:text-danger"
            >
              <LogOut size={14} strokeWidth={1.6} />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
