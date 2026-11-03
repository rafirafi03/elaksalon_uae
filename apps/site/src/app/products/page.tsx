import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata: Metadata = {
  title: "Products | ELAK Men's Salon UAE",
  description: "Shop premium men's grooming products — pomades, beard oils, and more at ELAK.",
};

export default function ProductsPage() {
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Shop</p>
          <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl lg:text-6xl">
            Our Products
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted lg:text-base">
            Professional grooming essentials for hair, beard, and skin — curated for gentlemen.
          </p>
          <div className="mt-10">
            <ProductsCatalog />
          </div>
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
