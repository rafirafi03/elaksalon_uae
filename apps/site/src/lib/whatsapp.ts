import type { Product } from "@/lib/products";
import type { Service } from "@/lib/services";
import { defaultCompany } from "@/lib/company";

function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "") || defaultCompany.whatsapp_number;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppUrl(product: Product, whatsappNumber = defaultCompany.whatsapp_number) {
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

export function serviceWhatsAppUrl(service: Service, whatsappNumber = defaultCompany.whatsapp_number) {
  const details = service.details.map((item) => `• ${item}`).join("\n");

  const message = [
    `Hello ${defaultCompany.company_name} Men's Salon 👋`,
    "",
    "I'd like to book this service:",
    "",
    `*Service:* ${service.title}`,
    `*Category:* ${service.category}`,
    `*Duration:* ${service.duration}`,
    `*Starting from:* ${service.priceFrom}`,
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
