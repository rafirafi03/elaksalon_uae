import Link from "next/link";
import { Building2, Package, Scissors, Users, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const sections = [
  {
    href: "/products",
    label: "Products",
    blurb: "Retail products with image upload, pricing, and details.",
    icon: Package,
  },
  {
    href: "/services",
    label: "Services",
    blurb: "Grooming services, duration, pricing, and includes.",
    icon: Scissors,
  },
  {
    href: "/specialists",
    label: "Specialists",
    blurb: "Team profiles, roles, specialties, and skills.",
    icon: Users,
  },
  {
    href: "/company",
    label: "Company",
    blurb: "Name, contact, WhatsApp, address, and map details.",
    icon: Building2,
  },
];

export default function AdminHomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Manage catalog content and company details for the public ELAK experience."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group overflow-hidden rounded-[1.75rem] bg-surface-elevated p-6 transition hover:bg-surface"
            >
              <div className="mb-10 flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-background">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-muted transition group-hover:text-gold"
                />
              </div>
              <h2 className="font-serif text-2xl text-cream">{section.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{section.blurb}</p>
              <p className="mt-5 text-[10px] tracking-[0.22em] text-gold uppercase">Ready</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
