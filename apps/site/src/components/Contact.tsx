import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { images } from "@/lib/images";
import { getCompanySettings } from "@/lib/company";

export default async function Contact() {
  const company = await getCompanySettings();

  return (
    <section id="contact" className="py-14 lg:py-20">
      <Container className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gold-deep via-gold to-gold-soft p-1 lg:rounded-[3rem]">
          <div className="flex h-full flex-col justify-center rounded-[2.35rem] bg-background px-6 py-10 text-center lg:rounded-[2.85rem] lg:px-12 lg:py-16 lg:text-left">
            <h2 className="font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">Get in Touch</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm text-muted lg:mx-0 lg:mt-5 lg:max-w-sm lg:text-base">
              Book your next cut, beard sculpt, or hot towel shave. We&apos;re ready when you are.
            </p>
            {(company.phone || company.email) && (
              <div className="mx-auto mt-4 space-y-1 text-sm text-cream/80 lg:mx-0">
                {company.phone ? <p>{company.phone}</p> : null}
                {company.email ? <p>{company.email}</p> : null}
              </div>
            )}
            <a
              href="/contact#message"
              className="mt-6 inline-flex items-center justify-center gap-2 self-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:bg-gold-soft lg:mt-8 lg:self-start"
            >
              Contact Us
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] rounded-tr-[3rem] lg:aspect-auto lg:min-h-[360px] lg:rounded-[3rem] lg:rounded-tr-[4rem]">
          <Image
            src={images.contact}
            alt={`${company.company_name} salon reception`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 640px"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </Container>
    </section>
  );
}
