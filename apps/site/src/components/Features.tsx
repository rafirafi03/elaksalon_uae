import { Award, Leaf, Sparkles, Wind } from "lucide-react";
import Container from "@/components/Container";

const features = [
  { icon: Award, label: "Expert Barbers" },
  { icon: Leaf, label: "Premium Products" },
  { icon: Sparkles, label: "Personalized Care" },
  { icon: Wind, label: "Relaxing Ambiance" },
];

export default function Features() {
  return (
    <section className="border-y border-border/60 bg-surface/60 py-8 lg:py-10">
      <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 lg:gap-10">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2.5 text-center lg:flex-row lg:justify-center lg:gap-3"
          >
            <Icon className="shrink-0 text-gold" size={24} strokeWidth={1.25} />
            <span className="text-xs leading-tight text-muted sm:text-sm">{label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
