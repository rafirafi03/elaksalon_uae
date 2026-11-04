import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import Container from "@/components/Container";
import { images } from "@/lib/images";

function SlideIn({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `elak-slide-left 0.95s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms both`,
      }}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-28 sm:items-center sm:pb-20 sm:pt-32 lg:min-h-screen"
    >
      <style>{`
        @keyframes elak-slide-left {
          from {
            opacity: 0;
            transform: translateX(-64px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt="Men's haircut at ELAK salon"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-xl lg:max-w-2xl">
          <h1 className="font-serif text-[2.75rem] leading-[1.05] text-cream sm:text-5xl lg:text-6xl xl:text-7xl">
            <SlideIn delayMs={80}>Your Style</SlideIn>
            <SlideIn delayMs={240}>
              Our <span className="text-gold italic">Expertise</span>
            </SlideIn>
          </h1>

          <SlideIn delayMs={400} className="mt-5 max-w-md">
            <p className="text-sm leading-relaxed text-cream/75 lg:text-base">
              Premium men&apos;s grooming in the UAE — precision cuts, beard sculpting, and a calm
              space built for gentlemen.
            </p>
          </SlideIn>

          <SlideIn delayMs={560} className="mt-8">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium text-background transition hover:bg-gold-soft"
            >
              Explore Services
              <ArrowRight size={16} />
            </a>
          </SlideIn>

          <SlideIn delayMs={720} className="mt-12">
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[images.avatar1, images.avatar2, images.avatar3].map((src) => (
                    <div
                      key={src}
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                  ))}
                </div>
                <p className="max-w-[130px] text-xs leading-snug text-cream/70 lg:text-sm">
                  Trusted by 1,000+ happy clients
                </p>
              </div>
            </div>
          </SlideIn>
        </div>
      </Container>
    </section>
  );
}
