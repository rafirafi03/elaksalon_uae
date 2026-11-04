import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import SpecialistCard from "@/components/SpecialistCard";
import ScrollCarousel from "@/components/ScrollCarousel";
import { getSpecialists } from "@/lib/specialists";

export default async function Specialists() {
  const specialists = await getSpecialists();
  if (specialists.length === 0) return null;

  return (
    <section id="specialists" className="py-8 lg:py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-3 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Our Specialists</p>
            <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">
              Meet The Team
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-end">
            <p className="max-w-sm text-sm text-muted lg:text-right">
              Skilled barbers and grooming experts dedicated to your look.
            </p>
            <Link
              href="/specialists"
              className="inline-flex items-center gap-2 self-start text-sm text-gold transition hover:text-gold-soft lg:self-end"
            >
              View all specialists
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <ScrollCarousel
          label="Our specialists"
          itemClassName="basis-[46%] sm:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-4.5rem)/4)]"
        >
          {specialists.map((person) => (
            <SpecialistCard key={person.slug} person={person} />
          ))}
        </ScrollCarousel>
      </Container>
    </section>
  );
}
