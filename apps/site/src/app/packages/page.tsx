import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import PackageCard from "@/components/PackageCard";
import { getPackages } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Packages | ELAK Men's Salon UAE",
  description: "Grooming packages at ELAK — signature services bundled together at a special price.",
};

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Packages</p>
          <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl lg:text-6xl">Grooming Packages</h1>
          <p className="mt-3 max-w-lg text-sm text-muted lg:text-base">
            Our signature services, bundled together — more care, better value.
          </p>

          {packages.length === 0 ? (
            <p className="mt-16 text-center text-muted">New packages are coming soon.</p>
          ) : (
            <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
