import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getProducts } from "@/lib/products";
import { getCompanySettings } from "@/lib/company";
import WhatsAppLink from "@/components/WhatsAppLink";
import { OfferBanner, OfferPrice } from "@/components/OfferTags";

export async function generateStaticParams() {
  const params = (await getProducts()).map((item) => ({ slug: item.slug }));
  // Cache Components requires at least one param; the placeholder simply 404s.
  return params.length ? params : [{ slug: "__none" }];
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product | ELAK" };
  return {
    title: `${product.name} | ELAK Products`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const company = await getCompanySettings();
  const related = (await getProducts()).filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-surface-elevated lg:rounded-[2.5rem]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <p className="text-xs tracking-[0.25em] text-gold uppercase">{product.category}</p>
              <p className="mt-3 text-sm tracking-wide text-muted uppercase">{product.brand}</p>
              <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">{product.name}</h1>
              <p className="mt-4">
                <OfferPrice price={product.price} offers={product.offers} className="text-2xl text-gold" />
              </p>
              <OfferBanner offers={product.offers} />
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted lg:text-base">
                {product.description}
              </p>

              <ul className="mt-6 space-y-2">
                {product.details.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-cream/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>

              <WhatsAppLink
                product={product}
                whatsappNumber={company.whatsapp_number}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-background transition hover:bg-gold-soft"
              >
                <ShoppingBag size={16} />
                Buy on WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16 lg:mt-20">
              <h2 className="font-serif text-2xl text-cream lg:text-3xl">You may also like</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {related.map((item) => (
                  <ProductCard key={item.slug} product={item} whatsappNumber={company.whatsapp_number} />
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
