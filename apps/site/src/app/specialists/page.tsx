import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import SpecialistsCatalog from "@/components/SpecialistsCatalog";
import { getSpecialists } from "@/lib/specialists";

export const metadata: Metadata = {
  title: "Specialists | ELAK Men's Salon UAE",
  description:
    "Meet the ELAK team — expert barbers and grooming specialists for cuts, beards, and shaves.",
};

export default async function SpecialistsPage() {
  const specialists = await getSpecialists();
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <h1 className="font-serif text-2xl text-cream sm:text-3xl">
            Our Specialists
          </h1>
          <div className="mt-6">
            <SpecialistsCatalog specialists={specialists} />
          </div>
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
