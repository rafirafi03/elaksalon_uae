import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import ServicesCatalog from "@/components/ServicesCatalog";
import { getServices } from "@/lib/services";
import { getServiceCategories } from "@/lib/categories";
import ServiceCard from "@/components/ServiceCard";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Services | ELAK Men's Salon UAE",
  description: "Explore ELAK men's grooming services — cuts, beard care, hot towel shaves, and more.",
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([getServices(), getServiceCategories()]);
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <h1 className="font-serif text-2xl text-cream sm:text-3xl">
            Our Services
          </h1>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                  {services.map((service) => (
                    <ServiceCard key={service.slug} service={service} />
                  ))}
                </div>
              }
            >
              <ServicesCatalog services={services} categories={categories} />
            </Suspense>
          </div>
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
