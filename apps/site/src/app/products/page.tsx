import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import ProductsCatalog from "@/components/ProductsCatalog";
import { getProducts } from "@/lib/products";
import { getCompanySettings } from "@/lib/company";

export const metadata: Metadata = {
  title: "Products | ELAK Men's Salon UAE",
  description: "Shop premium men's grooming products — pomades, beard oils, and more at ELAK.",
};

export default async function ProductsPage() {
  const [products, company] = await Promise.all([getProducts(), getCompanySettings()]);
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <h1 className="font-serif text-2xl text-cream sm:text-3xl">
            Our Products
          </h1>
          <div className="mt-6">
            <ProductsCatalog products={products} whatsappNumber={company.whatsapp_number} />
          </div>
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
