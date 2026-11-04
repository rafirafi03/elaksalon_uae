import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import PackageCard from "@/components/PackageCard";
import ScrollCarousel from "@/components/ScrollCarousel";
import { getPackages } from "@/lib/packages";

/** Home page "Packages" section. Hidden when there are no published packages. */
export default async function Packages() {
  const packages = await getPackages();
  if (packages.length === 0) return null;

  return (
    <section id="packages" className="py-8 lg:py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-3 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Packages</p>
            <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">More Care, Better Value.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-end">
            <p className="max-w-sm text-sm text-muted lg:text-right">
              Our signature services, bundled together at a special price.
            </p>
            {packages.length > 3 ? (
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 self-start text-sm text-gold transition hover:text-gold-soft lg:self-end"
              >
                View all packages
                <ArrowRight size={16} />
              </Link>
            ) : null}
          </div>
        </div>

        <ScrollCarousel
          label="Packages"
          itemClassName="basis-[85%] sm:basis-[60%] md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
        >
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </ScrollCarousel>
      </Container>
    </section>
  );
}
