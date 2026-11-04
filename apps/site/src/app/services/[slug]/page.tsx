import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { OfferBanner, OfferPrice } from "@/components/OfferTags";
import ServiceCard from "@/components/ServiceCard";
import { getServiceBySlug, getServices } from "@/lib/services";
import { getCompanySettings } from "@/lib/company";
import WhatsAppLink from "@/components/WhatsAppLink";

export async function generateStaticParams() {
  const params = (await getServices()).map((item) => ({ slug: item.slug }));
  // Cache Components requires at least one param; the placeholder simply 404s.
  return params.length ? params : [{ slug: "__none" }];
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service | ELAK" };
  return {
    title: `${service.title} | ELAK Services`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const company = await getCompanySettings();
  const related = (await getServices()).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
          >
            <ArrowLeft size={16} />
            Back to services
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-gold uppercase">{service.category}</p>
              <h1 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">{service.title}</h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted lg:text-base">
                {service.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-cream">
                  <Clock3 size={16} className="text-gold" />
                  {service.duration}
                </span>
                <span className="inline-flex items-center rounded-full border border-gold/40 px-4 py-2 text-gold">
                  <OfferPrice price={service.priceFrom} offers={service.offers} className="text-gold" />
                </span>
              </div>
              <OfferBanner offers={service.offers} />

              <ul className="mt-8 space-y-3">
                {service.details.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-cream/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>

              <WhatsAppLink
                service={service}
                whatsappNumber={company.whatsapp_number}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-background transition hover:bg-gold-soft"
              >
                <MessageCircle size={16} />
                Book on WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16 lg:mt-20">
              <h2 className="font-serif text-2xl text-cream lg:text-3xl">Related services</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {related.map((item) => (
                  <ServiceCard key={item.slug} service={item} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
