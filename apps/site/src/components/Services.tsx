import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/services";

export default async function Services() {
  const services = await getServices();
  const preview = services.slice(0, 4);

  return (
    <section id="services" className="py-8 lg:py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-3 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Our Services</p>
            <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">
              Grooming in Every Detail.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-end">
            <p className="max-w-sm text-sm text-muted lg:text-right">
              From classic cuts to hot towel shaves — tailored for the modern gentleman.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 self-start text-sm text-gold transition hover:text-gold-soft lg:self-end"
            >
              View all services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {preview.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
