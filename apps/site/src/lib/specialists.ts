import { images } from "@/lib/images";
import { slugify } from "@/lib/slug";

export type Specialist = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
  skills: string[];
};

export const specialists: Specialist[] = [
  {
    slug: slugify("Omar Hassan"),
    name: "Omar Hassan",
    role: "Master Barber",
    specialty: "Fades & classic cuts",
    experience: "12 yrs",
    image: images.specialist1,
    bio: "Omar leads the chair with calm precision. Known for clean fades and timeless cuts that hold their shape weeks later.",
    skills: ["Skin fades", "Classic cuts", "Consultation", "Finish styling"],
  },
  {
    slug: slugify("Ahmed Khalid"),
    name: "Ahmed Khalid",
    role: "Beard Specialist",
    specialty: "Sculpting & grooming",
    experience: "8 yrs",
    image: images.specialist2,
    bio: "Ahmed shapes beards with balance and detail — from soft natural growth to sharp executive lines.",
    skills: ["Beard sculpting", "Line-ups", "Density balancing", "Beard care"],
  },
  {
    slug: slugify("Youssef Ali"),
    name: "Youssef Ali",
    role: "Shave Expert",
    specialty: "Hot towel shaves",
    experience: "10 yrs",
    image: images.specialist3,
    bio: "Youssef brings the classic hot towel ritual to life — smooth, careful, and always focused on skin comfort.",
    skills: ["Straight razor", "Hot towel prep", "Aftercare", "Neck shaves"],
  },
  {
    slug: slugify("Karim Nasser"),
    name: "Karim Nasser",
    role: "Style Director",
    specialty: "Texture & finish",
    experience: "9 yrs",
    image: images.specialist4,
    bio: "Karim finishes every look with intention — texture, product choice, and polish for day or night.",
    skills: ["Event styling", "Texture work", "Product finish", "Restyles"],
  },
  {
    slug: slugify("Hassan Malik"),
    name: "Hassan Malik",
    role: "Senior Barber",
    specialty: "Skin fades & designs",
    experience: "7 yrs",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80",
    bio: "Hassan is detail-driven — crisp edges, modern fades, and subtle designs when you want something extra.",
    skills: ["Skin fades", "Hair designs", "Tapers", "Sharp line-ups"],
  },
  {
    slug: slugify("Rami Farouk"),
    name: "Rami Farouk",
    role: "Grooming Artist",
    specialty: "Beard line & detail",
    experience: "6 yrs",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    bio: "Rami focuses on the details that change a look — cheek lines, necklines, and polished grooming finishes.",
    skills: ["Beard detailing", "Cheek lines", "Neckline cleanup", "Grooming sets"],
  },
];

export function getSpecialistBySlug(slug: string) {
  return specialists.find((s) => s.slug === slug);
}

export function getAllSpecialistSlugs() {
  return specialists.map((s) => s.slug);
}
