import Image from "next/image";
import Link from "next/link";
import ScrollCarousel from "@/components/ScrollCarousel";
import type { ServiceCategory } from "@/lib/categories";

/** Horizontal carousel of arched service-category cards. */
export default function CategoryCarousel({ categories }: { categories: ServiceCategory[] }) {
  return (
    <ScrollCarousel
      label="Service categories"
      itemClassName="basis-[42%] sm:basis-[calc((100%-2rem)/3)] md:basis-[calc((100%-3rem)/4)] lg:basis-[calc((100%-6rem)/5)]"
    >
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/services?category=${encodeURIComponent(category.slug)}`}
          className="group w-full text-center"
        >
          {/* Arch: outer gold outline, inner arched image */}
          <div className="rounded-t-[999px] rounded-b-[1.25rem] border border-gold/40 p-1.5 transition duration-500 group-hover:border-gold sm:p-2 lg:rounded-b-[1.5rem]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[1rem] bg-surface-elevated lg:rounded-b-[1.25rem]">
              <Image
                src={category.image}
                alt=""
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition group-hover:from-black/20" />
            </div>
          </div>
          <h3 className="mt-3 font-serif text-lg text-cream transition group-hover:text-gold sm:text-xl">
            {category.name}
          </h3>
          <p className="mt-0.5 text-xs tracking-wide text-muted">
            {category.serviceCount} service{category.serviceCount === 1 ? "" : "s"}
          </p>
        </Link>
      ))}
    </ScrollCarousel>
  );
}
