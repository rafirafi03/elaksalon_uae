import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Clock3, MessageCircle, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import PackageCard from "@/components/PackageCard";
import { getPackageBySlug, getPackages } from "@/lib/packages";
import { getCompanySettings } from "@/lib/company";
import { packageWhatsAppUrl } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const params = (await getPackages()).map((p) => ({ slug: p.slug }));
  // Cache Components requires at least one param; the placeholder simply 404s.
  return params.length ? params : [{ slug: "__none" }];
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Package | ELAK" };
  return {
    title: `${pkg.title} | ELAK Packages`,
    description: pkg.description || `${pkg.services.map((s) => s.title).join(", ")} — ${pkg.price}`,
  };
}

export default async function PackageDetailPage({ params }: Params) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const [company, all] = await Promise.all([getCompanySettings(), getPackages()]);
  const others = all.filter((p) => p.slug !== pkg.slug).slice(0, 3);

  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
          >
            <ArrowLeft size={16} />
            Back to packages
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-surface-elevated lg:sticky lg:top-28 lg:rounded-[2.5rem]">
              {pkg.image ? (
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : null}
              {pkg.saving ? (
                <span className="absolute top-4 right-4 rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-background shadow-lg">
                  Save {pkg.saving}
                </span>
              ) : null}
            </div>

            <div>
              <p className="inline-flex items-center gap-1.5 text-xs tracking-[0.25em] text-gold uppercase">
                <Sparkles size={13} />
                Package · {pkg.services.length} services
              </p>
              <h1 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">{pkg.title}</h1>
              {pkg.description ? (
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted lg:text-base">{pkg.description}</p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-gold">{pkg.price}</span>
                  {pkg.saving && pkg.separateTotal ? (
                    <span className="text-sm text-muted line-through">{pkg.separateTotal}</span>
                  ) : null}
                </p>
                {pkg.duration ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-cream">
                    <Clock3 size={16} className="text-gold" />
                    {pkg.duration}
                  </span>
                ) : null}
              </div>
              {pkg.saving && pkg.separateTotal ? (
                <p className="mt-2 text-sm text-muted">
                  You save <span className="text-gold">{pkg.saving}</span> compared to booking these services separately.
                </p>
              ) : null}

              <h2 className="mt-8 text-xs tracking-[0.25em] text-gold uppercase">What&apos;s included</h2>
              <ul className="mt-4 space-y-3">
                {pkg.services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center gap-3 rounded-2xl bg-surface-elevated p-3 transition hover:bg-surface"
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                        {s.image ? (
                          <Image src={s.image} alt="" fill className="object-cover" sizes="56px" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-lg text-cream">{s.title}</span>
                        <span className="block text-xs text-muted">
                          {[s.duration, s.priceFrom && `Regular price ${s.priceFrom}`].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <ArrowUpRight size={16} className="shrink-0 text-muted transition group-hover:text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>

              {pkg.details.length > 0 ? (
                <>
                  <h2 className="mt-8 text-xs tracking-[0.25em] text-gold uppercase">Extras</h2>
                  <ul className="mt-4 space-y-2">
                    {pkg.details.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-sm text-cream/80">
                        <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <a
                href={packageWhatsAppUrl(pkg, company.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-background transition hover:bg-gold-soft"
              >
                <MessageCircle size={16} />
                Book this package on WhatsApp
              </a>
            </div>
          </div>

          {others.length > 0 ? (
            <div className="mt-16 lg:mt-20">
              <h2 className="font-serif text-2xl text-cream lg:text-3xl">More packages</h2>
              <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {others.map((p) => (
                  <PackageCard key={p.slug} pkg={p} />
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
