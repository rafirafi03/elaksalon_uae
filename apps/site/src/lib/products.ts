import { images } from "@/lib/images";
import { slugify } from "@/lib/slug";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  category: string;
  description: string;
  details: string[];
};

export const products: Product[] = [
  {
    slug: slugify("Matte Pomade"),
    name: "Matte Pomade",
    brand: "Uppercut Deluxe",
    price: "AED 85",
    image: images.product1,
    category: "Hair",
    description:
      "A flexible matte finish pomade with strong hold — ideal for textured styles that still move.",
    details: ["Strong hold", "Matte finish", "Water-based", "All-day control"],
  },
  {
    slug: slugify("Beard Oil"),
    name: "Beard Oil",
    brand: "Beardbrand",
    price: "AED 95",
    image: images.product2,
    category: "Beard",
    description:
      "Lightweight beard oil that softens hair, calms the skin underneath, and adds a healthy sheen.",
    details: ["Softens beard", "Reduces itch", "Non-greasy", "Natural oils"],
  },
  {
    slug: slugify("Face Wash"),
    name: "Face Wash",
    brand: "Bulldog",
    price: "AED 55",
    image: images.product3,
    category: "Skin",
    description:
      "A clean, everyday face wash that removes oil and dirt without stripping your skin.",
    details: ["Daily cleanse", "Gentle formula", "Fresh finish", "For all skin types"],
  },
  {
    slug: slugify("Hair Serum"),
    name: "Hair Serum",
    brand: "American Crew",
    price: "AED 75",
    image: images.product4,
    category: "Hair",
    description:
      "Smoothing serum for shine and frizz control — perfect as a finishing touch after your cut.",
    details: ["Adds shine", "Tames frizz", "Lightweight", "Heat protection"],
  },
  {
    slug: slugify("Clay Wax"),
    name: "Clay Wax",
    brand: "Baxter of CA",
    price: "AED 90",
    image: images.product5,
    category: "Hair",
    description:
      "Workable clay wax with a natural finish for volume, definition, and restyle-ready hold.",
    details: ["Natural look", "Medium hold", "Adds texture", "Restylable"],
  },
  {
    slug: slugify("Beard Balm"),
    name: "Beard Balm",
    brand: "Beardbrand",
    price: "AED 88",
    image: images.product2,
    category: "Beard",
    description:
      "Shaping balm that tames flyaways and keeps your beard looking intentional all day.",
    details: ["Shapes beard", "Light hold", "Moisturizing", "Travel friendly"],
  },
  {
    slug: slugify("Styling Powder"),
    name: "Styling Powder",
    brand: "Uppercut Deluxe",
    price: "AED 70",
    image: images.product1,
    category: "Hair",
    description:
      "Invisible powder for instant volume and grip — great for short-to-medium styles.",
    details: ["Boosts volume", "Mattifying", "Easy to apply", "Buildable"],
  },
  {
    slug: slugify("Moisturizer"),
    name: "Moisturizer",
    brand: "Bulldog",
    price: "AED 65",
    image: images.product3,
    category: "Skin",
    description:
      "Daily moisturizer that hydrates without heaviness — a clean finish after every wash.",
    details: ["Hydrating", "Non-greasy", "Quick absorb", "Day & night"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs() {
  return products.map((p) => p.slug);
}
