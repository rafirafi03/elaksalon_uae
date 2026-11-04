import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { getCompanySettings } from "@/lib/company";

export default async function Products() {
  const [products, company] = await Promise.all([getProducts(), getCompanySettings()]);
  const preview = products.slice(0, 4);

  return (
    <section id="products" className="py-8 lg:py-12">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Professional Care At Home</p>
            <h2 className="mt-2 font-serif text-3xl text-cream lg:text-4xl">Take the Look Home</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 self-start text-sm text-gold transition hover:text-gold-soft sm:self-auto"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-5 lg:mt-10 lg:grid-cols-4 lg:gap-6">
          {preview.map((product) => (
            <ProductCard key={product.slug} product={product} whatsappNumber={company.whatsapp_number} />
          ))}
        </div>
      </Container>
    </section>
  );
}
