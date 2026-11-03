import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import ServicesCatalog from "@/components/ServicesCatalog";

export const metadata: Metadata = {
  title: "Services | ELAK Men's Salon UAE",
  description: "Explore ELAK men's grooming services — cuts, beard care, hot towel shaves, and more.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Menu</p>
          <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted lg:text-base">
            From precision fades to classic shaves — find the service that fits your style.
          </p>
          <div className="mt-10">
            <ServicesCatalog />
          </div>
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
