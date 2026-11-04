import type { Product } from "@/lib/products";
import type { Service } from "@/lib/services";
import { defaultCompany } from "@/lib/company-defaults";
import type { ItemOffer } from "@/lib/offers";
import type { ServicePackage } from "@/lib/packages";

/** Clear offer block for the WhatsApp message (empty when no live offer). */
function offerLines(offer: ItemOffer | null | undefined, price: string) {
  if (!offer) return [];
  const until = new Date(offer.endsAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  });
  return [
    "",
    "🎉 *OFFER APPLIED*",
    `*Offer:* ${offer.title} (${offer.label})`,
    ...(offer.offerPrice ? [`*Offer price:* ${offer.offerPrice} (was ${price})`] : []),
    `*Offer valid until:* ${until} (UAE time)`,
  ];
}

function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "") || defaultCompany.whatsapp_number;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppUrl(
  product: Product,
  whatsappNumber = defaultCompany.whatsapp_number,
  offer?: ItemOffer | null,
) {
  const details = product.details.map((item) => `• ${item}`).join("\n");

  const message = [
    `Hello ${defaultCompany.company_name} Men's Salon 👋`,
    "",
    "I'd like to buy this product:",
    "",
    `*Product:* ${product.name}`,
    `*Brand:* ${product.brand}`,
    `*Category:* ${product.category}`,
    `*Price:* ${product.price}`,
    ...offerLines(offer, product.price),
    "",
    `*Description:* ${product.description}`,
    "",
    "*Highlights:*",
    details,
    "",
    "Please confirm availability. Thank you!",
  ].join("\n");

  return buildWhatsAppUrl(whatsappNumber, message);
}

export function serviceWhatsAppUrl(
  service: Service,
  whatsappNumber = defaultCompany.whatsapp_number,
  offer?: ItemOffer | null,
) {
  const details = service.details.map((item) => `• ${item}`).join("\n");

  const message = [
    `Hello ${defaultCompany.company_name} Men's Salon 👋`,
    "",
    "I'd like to book this service:",
    "",
    `*Service:* ${service.title}`,
    `*Category:* ${service.category}`,
    `*Duration:* ${service.duration}`,
    `*Price:* ${service.priceFrom}`,
    ...offerLines(offer, service.priceFrom),
    "",
    `*About:* ${service.description}`,
    "",
    "*Includes:*",
    details,
    "",
    "Please share available slots. Thank you!",
  ].join("\n");

  return buildWhatsAppUrl(whatsappNumber, message);
}

export function packageWhatsAppUrl(
  pkg: ServicePackage,
  whatsappNumber = defaultCompany.whatsapp_number,
) {
  const message = [
    `Hello ${defaultCompany.company_name} Men's Salon 👋`,
    "",
    "I'd like to book this package:",
    "",
    `*Package:* ${pkg.title}`,
    `*Price:* ${pkg.price}`,
    ...(pkg.saving && pkg.separateTotal ? [`*You save:* ${pkg.saving} (separately ${pkg.separateTotal})`] : []),
    ...(pkg.duration ? [`*Duration:* ${pkg.duration}`] : []),
    "",
    "*Includes:*",
    ...pkg.services.map((s) => `• ${s.title}`),
    ...(pkg.details.length ? ["", "*Extras:*", ...pkg.details.map((d) => `• ${d}`)] : []),
    "",
    "Please share available slots. Thank you!",
  ].join("\n");

  return buildWhatsAppUrl(whatsappNumber, message);
}
