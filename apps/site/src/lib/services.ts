import { images } from "@/lib/images";
import { slugify } from "@/lib/slug";

export type Service = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  priceFrom: string;
  details: string[];
};

export const services: Service[] = [
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

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs() {
  return services.map((s) => s.slug);
}
