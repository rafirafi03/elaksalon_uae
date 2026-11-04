import { cacheLife } from "next/cache";
import type { PackageRow, ServiceRow } from "@elak/db";
import { getPublicSupabase } from "@/lib/supabase";

export type PackageService = {
  slug: string;
  title: string;
  image: string;
  priceFrom: string;
  duration: string;
};

export type ServicePackage = {
  slug: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  details: string[];
  services: PackageService[];
  /** Sum of the services' prices, e.g. "AED 260" (null if any price has no number). */
  separateTotal: string | null;
  /** How much cheaper the package is, e.g. "AED 61" (null if not cheaper). */
  saving: string | null;
};

type PackageQueryRow = PackageRow & {
  package_services: { position: number; services: ServiceRow | null }[];
};

function amount(price: string): number | null {
  const match = price.match(/(\d+(?:[.,]\d+)?)/);
  return match ? Number(match[1].replace(",", ".")) : null;
}

function money(value: number) {
  return `AED ${Number.isInteger(value) ? value : value.toFixed(2)}`;
}

function fromRow(row: PackageQueryRow): ServicePackage {
  const services: PackageService[] = [...(row.package_services ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((link) => link.services)
    .filter((s): s is ServiceRow => Boolean(s))
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      image: s.image_url,
      priceFrom: s.price_from,
      duration: s.duration,
    }));

  const prices = services.map((s) => amount(s.priceFrom));
  const total = prices.length && prices.every((p) => p !== null) ? prices.reduce<number>((a, b) => a + (b ?? 0), 0) : null;
  const own = amount(row.price);
  const saving = total !== null && own !== null && total > own ? total - own : null;

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: row.price,
    duration: row.duration,
    image: row.image_url || services[0]?.image || "",
    details: row.details ?? [],
    services,
    separateTotal: total !== null ? money(total) : null,
    saving: saving !== null ? money(saving) : null,
  };
}

/** Published packages with their services, in admin order. */
export async function getPackages(): Promise<ServicePackage[]> {
  "use cache";
  cacheLife("minutes");

  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*, package_services(position, services(*))")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("[site] packages load failed", error);
      return [];
    }
    return (data as unknown as PackageQueryRow[]).map(fromRow).filter((p) => p.services.length > 0);
  } catch (error) {
    console.error("[site] packages load failed", error);
    return [];
  }
}

export async function getPackageBySlug(slug: string) {
  return (await getPackages()).find((p) => p.slug === slug);
}
