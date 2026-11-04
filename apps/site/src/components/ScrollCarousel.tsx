"use client";

import { Children, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Horizontal, swipeable scroll-snap carousel with prev/next arrows.
 * `itemClassName` sets each slide's width per breakpoint (flex-basis).
 */
export default function ScrollCarousel({
  children,
  itemClassName,
  label,
}: {
  children: React.ReactNode;
  itemClassName: string;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanPrev(track.scrollLeft > 4);
      setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;
    const step = slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    // Move by one "page" of whole slides.
    const perView = Math.max(1, Math.floor((track.clientWidth + 1) / step));
    track.scrollBy({ left: direction * step * perView, behavior: "smooth" });
  }

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border text-gold transition hover:border-gold hover:bg-gold hover:text-background disabled:pointer-events-none disabled:opacity-30";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:gap-4 sm:px-0 lg:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className={cn("flex shrink-0 snap-start", itemClassName)}>{child}</div>
        ))}
      </div>

      {canPrev || canNext ? (
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => scroll(-1)} disabled={!canPrev} aria-label="Previous" className={arrow}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={!canNext} aria-label="Next" className={arrow}>
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
