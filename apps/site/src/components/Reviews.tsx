import { ArrowUpRight } from "lucide-react";
import Container from "@/components/Container";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { getReviews } from "@/lib/reviews";
import { getCompanySettings } from "@/lib/company";

const GOOGLE_G =
  "M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.07-1.06-.15-1.51z";

/** Customer reviews carousel + "View more on Google". Hidden when there is neither. */
export default async function Reviews() {
  const [reviews, company] = await Promise.all([getReviews(), getCompanySettings()]);
  const googleUrl = company.google_reviews_url?.trim();
  if (reviews.length === 0 && !googleUrl) return null;

  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <section id="reviews" className="py-8 lg:py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-3 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Testimonials</p>
            <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">What Our Clients Say</h2>
          </div>
          {reviews.length ? (
            <p className="text-sm text-muted lg:text-right">
              <span className="font-serif text-2xl text-gold">{average.toFixed(1)}</span> / 5 from {reviews.length}{" "}
              review{reviews.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        {reviews.length ? <ReviewsCarousel reviews={reviews} /> : null}

        {googleUrl ? (
          <div className={`flex justify-center ${reviews.length ? "mt-8 lg:mt-10" : ""}`}>
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 text-sm text-cream transition hover:border-gold hover:bg-gold hover:text-background"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={GOOGLE_G} />
              </svg>
              View more on Google
              <ArrowUpRight size={16} />
            </a>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
