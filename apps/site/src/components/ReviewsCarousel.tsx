"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GoogleReviewCard from "@/components/GoogleReviewCard";
import type { Review } from "@/lib/reviews";

const AUTOPLAY_MS = 5000;

/**
 * Scroll-snap carousel: 1 card (with peek) on phones, 2 on tablets, 4 on large screens.
 * Supports swipe, arrows, dots and autoplay (paused on hover/focus/touch and for reduced motion).
 */
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);

  /** Width of one card + gap, and how many positions the track can scroll to. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return null;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const step = card.offsetWidth + gap;
    const perView = Math.max(1, Math.round((track.clientWidth + gap) / step));
    return { track, step, positions: Math.max(1, reviews.length - perView + 1) };
  }, [reviews.length]);

  const goTo = useCallback(
    (i: number) => {
      const m = measure();
      if (!m) return;
      const target = ((i % m.positions) + m.positions) % m.positions; // wrap around
      m.track.scrollTo({ left: target * m.step, behavior: "smooth" });
    },
    [measure],
  );

  // Keep index/pages in sync with scrolling (swipe, arrows, resize).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const m = measure();
      if (!m) return;
      setPages(m.positions);
      setIndex(Math.min(m.positions - 1, Math.round(track.scrollLeft / m.step)));
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [measure]);

  // Autoplay.
  useEffect(() => {
    if (paused || pages <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, pages, index, goTo]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      aria-roledescription="carousel"
      aria-label="Customer reviews"
    >
      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 lg:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, i) => (
          <div
            key={review.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
            className="flex shrink-0 basis-[85%] snap-start sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-4.5rem)/4)]"
          >
            <GoogleReviewCard review={review} />
          </div>
        ))}
      </div>

      {pages > 1 ? (
        <div className="mt-6 flex items-center justify-between gap-4 lg:mt-8">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-2 bg-border hover:bg-gold/50"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-gold transition hover:border-gold hover:bg-gold hover:text-background"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-gold transition hover:border-gold hover:bg-gold hover:text-background"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
