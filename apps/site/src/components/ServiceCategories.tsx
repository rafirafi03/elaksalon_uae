import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import CategoryCarousel from "@/components/CategoryCarousel";
import { getServiceCategories } from "@/lib/categories";

/** Home page "Browse by category" carousel. Hidden when there are no categories. */
export default async function ServiceCategories() {
  const categories = await getServiceCategories();
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-8 lg:py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Categories</p>
            <h2 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">Browse by Category</h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 self-start text-sm text-gold transition hover:text-gold-soft sm:self-auto"
          >
            View all services
            <ArrowRight size={16} />
          </Link>
        </div>

        <CategoryCarousel categories={categories} />
      </Container>
    </section>
  );
}
