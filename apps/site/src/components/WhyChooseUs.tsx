import { Clock3, Gem, Smile, Users } from "lucide-react";
import Container from "@/components/Container";

const stats = [
  { icon: Clock3, value: "28+", label: "Years of Experience" },
  { icon: Smile, value: "1000+", label: "Happy Clients" },
  { icon: Users, value: "7+", label: "Grooming Experts" },
  { icon: Gem, value: "Premium", label: "Services" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-8 lg:py-12">
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
      </Container>
    </section>
  );
}
