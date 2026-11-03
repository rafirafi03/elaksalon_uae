import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock3, Gem, Smile, Users } from "lucide-react";
import Container from "@/components/Container";
import { images } from "@/lib/images";

const stats = [
  { icon: Clock3, value: "5+", label: "Years of Experience" },
  { icon: Smile, value: "1000+", label: "Happy Clients" },
  { icon: Users, value: "20+", label: "Grooming Experts" },
  { icon: Gem, value: "Premium", label: "Global Brands" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <p className="text-center text-xs tracking-[0.25em] text-gold uppercase">Why Choose Us</p>
        <h2 className="mt-2 text-center font-serif text-3xl text-cream lg:text-5xl">
          Crafted For Gentlemen
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-[1.5rem] bg-surface-elevated px-4 py-6 text-center transition hover:bg-surface lg:rounded-[2rem] lg:px-6 lg:py-10"
            >
              <Icon className="mx-auto text-gold" size={24} strokeWidth={1.25} />
              <p className="mt-3 font-serif text-2xl text-cream lg:text-4xl">{value}</p>
              <p className="mt-1 text-xs text-muted lg:text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[1.75rem] bg-surface-elevated/80 p-5 lg:mx-auto lg:mt-14 lg:max-w-3xl lg:rounded-[2rem] lg:p-8">
          <div className="flex gap-4 lg:gap-6">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full lg:h-16 lg:w-16">
              <Image
                src={images.testimonial}
                alt="Client"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <p className="font-serif text-lg leading-snug text-cream lg:text-2xl">
                &ldquo;An amazing experience — sharp fade, perfect beard line, and a space that
                feels exclusive.&rdquo;
              </p>
              <p className="mt-2 text-xs tracking-wide text-gold lg:mt-3 lg:text-sm">
                — Ahmed R., Dubai
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted lg:h-10 lg:w-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 text-gold lg:h-10 lg:w-10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
