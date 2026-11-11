import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Container from "@/components/Container";
import { getCompanySettings } from "@/lib/company";
import { detectSocial } from "@/lib/social";

type ContactItem = { icon: typeof Phone; label: string; href?: string; external?: boolean };

export default async function Footer() {
  const company = await getCompanySettings();
  const socials = (company.social_links ?? [])
    .map(detectSocial)
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // "Street, Dubai, United Arab Emirates" without empty or repeated parts (e.g. address = city).
  const address = [company.address, company.city, company.country]
    .map((part) => part?.trim())
    .filter((part, i, all): part is string => Boolean(part) && all.indexOf(part) === i)
    .join(", ");
  const whatsapp = company.whatsapp_number?.replace(/\D/g, "");

  const contacts: ContactItem[] = [];
  if (company.phone) {
    contacts.push({ icon: Phone, label: company.phone, href: `tel:${company.phone.replace(/[^\d+]/g, "")}` });
  }
  if (whatsapp) {
    contacts.push({ icon: MessageCircle, label: "WhatsApp us", href: `https://wa.me/${whatsapp}`, external: true });
  }
  if (company.email) {
    contacts.push({ icon: Mail, label: company.email, href: `mailto:${company.email}` });
  }
  if (address) {
    contacts.push({
      icon: MapPin,
      label: address,
      href: company.map_link_url || "/contact#map",
      external: Boolean(company.map_link_url),
    });
  }
  if (company.opening_hours) {
    contacts.push({ icon: Clock3, label: company.opening_hours });
  }

  return (
    <footer className="border-t border-border/70 bg-surface py-14 lg:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div>
            <Link href="/" aria-label={`${company.company_name || "ELAK"} — Home`} className="inline-block">
              <Image
                src="/logo.png"
                alt={`${company.company_name || "ELAK"} Salon & Spa`}
                width={1232}
                height={1277}
                sizes="112px"
                className="h-24 w-auto lg:h-28"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted lg:mt-4 lg:max-w-sm lg:text-base">
              Style, Care, Confidence — Always. Premium men&apos;s grooming across the UAE.
            </p>

            {socials.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {socials.map(({ url, platform }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.label}
                    title={platform.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-gold transition hover:border-gold hover:bg-gold hover:text-background"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={platform.path} />
                    </svg>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {contacts.length > 0 ? (
            <address className="not-italic">
              <p className="text-xs tracking-[0.25em] text-gold uppercase">Contact</p>
              <ul className="mt-4 space-y-3">
                {contacts.map(({ icon: Icon, label, href, external }) => {
                  const content = (
                    <>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-gold transition group-hover:border-gold">
                        <Icon size={14} />
                      </span>
                      <span className="min-w-0 pt-1.5 break-words">{label}</span>
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex items-start gap-3 text-sm text-cream/85 transition hover:text-gold"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="group flex items-start gap-3 text-sm text-cream/85">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </address>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border/50 pt-6 text-center text-xs text-muted sm:flex-row sm:justify-between lg:mt-14">
          <p>© 2026 {company.company_name || "ELAK"} Salon UAE. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://www.instagram.com/by_rafiii/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold transition hover:text-gold-soft"
            >
              Ahamad Rafi
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
