import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import SpecialistCard from "@/components/SpecialistCard";
import { specialists } from "@/lib/specialists";

export default function Specialists() {
  const preview = specialists.slice(0, 4);

  return (
    <section id="specialists" className="py-14 lg:py-20">
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

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {preview.map((person) => (
            <SpecialistCard key={person.name} person={person} />
          ))}
        </div>
      </Container>
    </section>
  );
}
