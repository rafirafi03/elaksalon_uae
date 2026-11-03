import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import SpecialistsCatalog from "@/components/SpecialistsCatalog";

export const metadata: Metadata = {
  title: "Specialists | ELAK Men's Salon UAE",
  description:
    "Meet the ELAK team — expert barbers and grooming specialists for cuts, beards, and shaves.",
};

export default function SpecialistsPage() {
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Our Team</p>
          <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl lg:text-6xl">
            Specialists
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted lg:text-base">
            Find the right expert for your cut, beard, or shave — search by name, role, or specialty.
          </p>
          <div className="mt-10">
            <SpecialistsCatalog />
          </div>
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
