import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "About | ELAK Men's Salon UAE",
  description:
    "Learn about ELAK — a premium men's salon in the UAE blending classic barbering with modern grooming.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <Header />
      <main className="pt-24 pb-14 lg:pt-28 lg:pb-20">
        <Container>
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Our Story</p>
          <h1 className="mt-2 max-w-3xl font-serif text-4xl text-cream sm:text-5xl lg:text-6xl">
            Confidence Looks <span className="italic text-gold">Good On You.</span>
          </h1>
        </Container>

        <Container className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] lg:mx-0 lg:max-w-none">
            <Image
              src={images.about}
              alt="Inside the ELAK salon"
              fill
              className="object-cover object-[30%_center]"
              sizes="(max-width: 1024px) 90vw, 600px"
              priority
            />
          </div>

          <div>
            <p className="text-sm leading-relaxed text-muted lg:text-base">
              At ELAK, classic barbering meets modern grooming. Every cut, fade, and shave is crafted
              for the man who cares about the details — in a calm space built for focus and finish.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted lg:text-base">
              Our specialists bring years of experience with premium products and techniques trusted
              across the UAE. Whether you need a sharp fade, a sculpted beard, or a traditional hot
              towel shave, we treat every visit with precision and care.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted lg:text-base">
              Style, care, confidence — always. That is the ELAK standard.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background transition hover:bg-gold-soft"
              >
                Explore Services
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-3 text-sm text-gold transition hover:bg-gold hover:text-background"
              >
                Book a Visit
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>

        <Container className="mt-16 grid gap-4 sm:grid-cols-3 lg:mt-20 lg:gap-6">
          {[
            { label: "Years of craft", value: "28+" },
            { label: "Happy clients", value: "1000+" },
            { label: "Grooming experts", value: "7+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.5rem] bg-surface-elevated px-5 py-8 text-center lg:rounded-[2rem]"
            >
              <p className="font-serif text-3xl text-gold lg:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </Container>
      </main>
      <Footer />
    </PageShell>
  );
}
