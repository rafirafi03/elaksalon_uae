import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { images } from "@/lib/images";

export default function About() {
  return (
    <section id="about" className="py-8 lg:py-12">
      <Container className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden blob-mask-u lg:mx-0 lg:max-w-none">
          <Image
            src={images.about}
            alt="Inside the ELAK salon"
            fill
            className="object-cover object-[30%_center]"
            sizes="(max-width: 1024px) 90vw, 600px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent lg:from-transparent" />
        </div>

        <div className="relative z-10 text-center lg:text-left">
          <h2 className="font-serif text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl xl:text-6xl">
            Confidence Looks{" "}
            <span className="block italic text-gold">Good On You.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted lg:mx-0 lg:mt-6 lg:max-w-md lg:text-base">
            At ELAK, classic barbering meets modern grooming. Every cut, fade, and shave is crafted
            for the man who cares about the details.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-3 text-sm text-gold transition hover:bg-gold hover:text-background lg:mt-8"
          >
            Our Story
            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
