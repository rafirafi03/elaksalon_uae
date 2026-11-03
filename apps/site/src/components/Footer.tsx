import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "@/components/Container";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/specialists", label: "Specialists" },
  { href: "/contact", label: "Contact" },
  { href: "/contact#map", label: "Location" },
];

const socials = [
  {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-2.25.1-3.3 1.15-3.4 3.4-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.24 1.16 3.3 3.4 3.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.25-.1 3.3-1.16 3.4-3.4.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.25-1.16-3.3-3.4-3.4-1.24-.06-1.61-.07-4.76-.07zm0 3.07a5.16 5.16 0 1 1 0 10.32 5.16 5.16 0 0 1 0-10.32zm0 1.8a3.36 3.36 0 1 0 0 6.72 3.36 3.36 0 0 0 0-6.72zm5.34-2.08a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
  },
  {
    label: "Facebook",
    path: "M14 8.16h2.4V5.2H14c-2.2 0-3.6 1.34-3.6 3.68v1.68H8.4v2.96h2V20h3.2v-6.48h2.24l.56-2.96h-2.8V9.2c0-.72.32-1.04 1.04-1.04z",
  },
  {
    label: "YouTube",
    path: "M21.58 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.43A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.8zM10 15.2v-6.4l5.2 3.2-5.2 3.2z",
  },
  {
    label: "Pinterest",
    path: "M12 2C6.48 2 2 6.32 2 11.74c0 4.1 2.56 7.61 6.18 8.96-.09-.76-.16-1.93.03-2.76.17-.74 1.12-4.73 1.12-4.73s-.29-.57-.29-1.41c0-1.32.77-2.31 1.72-2.31.81 0 1.2.61 1.2 1.34 0 .82-.52 2.04-.79 3.17-.23.95.48 1.72 1.41 1.72 1.69 0 2.99-1.78 2.99-4.36 0-2.28-1.64-3.87-3.98-3.87-2.71 0-4.3 2.03-4.3 4.13 0 .82.31 1.7.71 2.18a.29.29 0 0 1 .07.28c-.07.3-.24.95-.27 1.08-.04.18-.14.22-.32.13-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.37 5.92 5.54 0 3.31-2.09 5.97-4.98 5.97-.97 0-1.89-.51-2.2-1.1l-.6 2.28c-.22.84-.81 1.9-1.2 2.54A10.1 10.1 0 0 0 12 21.48c5.52 0 10-4.32 10-9.74C22 6.32 17.52 2 12 2z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface py-14 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <Link
              href="/"
              className="font-serif text-3xl tracking-[0.18em] text-gold lg:text-4xl"
            >
              ELAK
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted lg:mt-4 lg:max-w-sm lg:text-base">
              Style, Care, Confidence — Always. Premium men&apos;s grooming across the UAE.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map(({ path, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-gold transition hover:border-gold hover:bg-gold hover:text-background"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between border-b border-border/50 py-3 text-sm text-cream transition hover:text-gold"
              >
                {link.label}
                <ChevronRight size={16} className="text-muted sm:hidden" />
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-10 text-center text-xs text-muted lg:mt-14">
          © 2026 ELAK Salon UAE. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
