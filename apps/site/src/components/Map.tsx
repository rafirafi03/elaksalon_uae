import Container from "@/components/Container";
import { getCompanySettings } from "@/lib/company";

export default async function MapSection() {
  const company = await getCompanySettings();
  const locationLine = [company.city || company.address, company.country].filter(Boolean).join(", ");

  return (
    <section id="map" className="pb-14 lg:pb-20">
      <Container>
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Find Us</p>
            <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">
              Visit Our Salon
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted sm:text-right">
            {locationLine || "United Arab Emirates"} — drop in or book ahead for the best experience.
          </p>
        </div>

        {company.map_embed_url ? (
          <div className="overflow-hidden rounded-[2rem] border border-border/60 lg:rounded-[2.5rem]">
            <iframe
              title={`${company.company_name} location map`}
              src={company.map_embed_url}
              className="h-[280px] w-full border-0 grayscale-[30%] contrast-[1.05] sm:h-[360px] lg:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 text-sm text-muted sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>{company.opening_hours || "Open daily"}</p>
          {company.map_link_url ? (
            <a
              href={company.map_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gold transition hover:text-gold-soft"
            >
              Open in Google Maps →
            </a>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
