import { cacheLife } from "next/cache";
import type { ServiceRow } from "@elak/db";
import { getPublicSupabase } from "@/lib/supabase";
import { getOfferIndex, type ItemOffer } from "@/lib/offers";
import { images } from "@/lib/images";
import { slugify } from "@/lib/slug";

export type Service = {
  /** Current + upcoming offers (filter by time on the client). */
  offers?: ItemOffer[];
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  /** Slug of the service category (for filtering). */
  categorySlug: string;
  duration: string;
  priceFrom: string;
  details: string[];
};

const fallbackServiceData: Omit<Service, "categorySlug">[] = [
  {
    slug: slugify("Hair Care"),
    title: "Hair Care",
    description: "Precision cuts, fades, and styling for every look.",
    image: images.hairCare,
    category: "Hair",
    duration: "45–60 min",
    priceFrom: "AED 80",
    details: [
      "Consultation to match your face shape and lifestyle",
      "Precision cut with premium tools",
      "Wash, style, and finish products included",
    ],
  },
  {
    slug: slugify("Beard Grooming"),
    title: "Beard Grooming",
    description: "Sculpted trims and shaping for a sharp finish.",
    image: images.beardGrooming,
    category: "Beard",
    duration: "30–45 min",
    priceFrom: "AED 60",
    details: [
      "Line-up and shape tailored to your features",
      "Trim and density balancing",
      "Beard oil / balm finish",
    ],
  },
  {
    slug: slugify("Hot Towel Shave"),
    title: "Hot Towel Shave",
    description: "Classic straight-razor shave with hot towel care.",
    image: images.hotTowel,
    category: "Shave",
    duration: "40–50 min",
    priceFrom: "AED 90",
    details: [
      "Hot towel prep for a closer, smoother shave",
      "Straight-razor technique by specialists",
      "Aftercare balm to calm the skin",
    ],
  },
  {
    slug: slugify("Hair Styling"),
    title: "Hair Styling",
    description: "Finish and texture for meetings, nights, and events.",
    image: images.hairStyling,
    category: "Hair",
    duration: "20–30 min",
    priceFrom: "AED 50",
    details: [
      "Style consultation for the occasion",
      "Product selection for hold and finish",
      "Quick refinement for a polished look",
    ],
  },
  {
    slug: slugify("Kids Cut"),
    title: "Kids Cut",
    description: "Patient, precise cuts for young gentlemen.",
    image: images.hairCare,
    category: "Hair",
    duration: "30–40 min",
    priceFrom: "AED 55",
    details: [
      "Calm, patient approach for kids",
      "Age-appropriate styles",
      "Clean finish parents can trust",
    ],
  },
  {
    slug: slugify("Scalp Treatment"),
    title: "Scalp Treatment",
    description: "Deep cleanse and care for a healthier scalp.",
    image: images.hotTowel,
    category: "Care",
    duration: "35–45 min",
    priceFrom: "AED 70",
    details: [
      "Deep cleanse to remove buildup",
      "Soothing scalp massage",
      "Leave-in care recommendations",
    ],
  },
];

const fallbackServices: Service[] = fallbackServiceData.map((s) => ({ ...s, categorySlug: slugify(s.category) }));

function fromRow(row: ServiceRow & { service_categories?: { slug: string; name: string } | null }): Service {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image_url,
    category: row.service_categories?.name ?? row.category,
    categorySlug: row.service_categories?.slug ?? slugify(row.category),
    duration: row.duration,
    priceFrom: row.price_from,
    details: row.details ?? [],
  };
}

/** All services from Supabase (newest last). Falls back to built-in data if Supabase is unavailable. */
async function loadServices(): Promise<Service[]> {
  "use cache";
  cacheLife("minutes");

  const supabase = getPublicSupabase();
  if (!supabase) return fallbackServices;

  try {
    const { data, error } = await supabase.from("services").select("*, service_categories(slug, name)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) {
      console.error("[site] services load failed", error);
      return fallbackServices;
    }
    return data.map(fromRow);
  } catch (error) {
    console.error("[site] services load failed", error);
    return fallbackServices;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((item) => item.slug === slug);
}

/** Services with their offers attached. */
export async function getServices(): Promise<Service[]> {
  const [items, offers] = await Promise.all([loadServices(), getOfferIndex()]);
  return items.map((item) => ({ ...item, offers: offers[`service:${item.slug}`] ?? [] }));
}
