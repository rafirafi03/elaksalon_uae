"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/Container";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/products", label: "Products" },
  { href: "/specialists", label: "Specialists" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent only at the very top; solid as soon as the page scrolls.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close the mobile menu on Esc or when resizing to desktop width.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border/40 bg-background/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="relative z-50 flex items-center justify-between py-4 lg:py-5">
        <Link href="/" aria-label="ELAK Salon & Spa — Home" className="block shrink-0 transition-opacity hover:opacity-85">
          <Image
            src="/logo.png"
            alt="ELAK Salon & Spa"
            width={1232}
            height={1277}
            priority
            sizes="64px"
            className="h-12 w-auto lg:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-cream/80 transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-gold transition hover:bg-white/5 xl:hidden"
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
          <Link
            href="/contact"
            className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background transition hover:bg-gold-soft sm:inline-flex"
          >
            Book Now
          </Link>
        </div>
      </Container>

    </header>
      <div
        className={cn(
          "fixed inset-0 z-40 overflow-y-auto bg-background/97 backdrop-blur-md transition-opacity duration-300 xl:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav className="flex min-h-full flex-col items-center justify-center gap-5 px-6 pt-24 pb-10 sm:gap-6">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-serif text-2xl text-cream transition hover:text-gold sm:text-3xl"
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
