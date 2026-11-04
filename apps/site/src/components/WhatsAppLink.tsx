"use client";

import type { Product } from "@/lib/products";
import type { Service } from "@/lib/services";
import { productWhatsAppUrl, serviceWhatsAppUrl } from "@/lib/whatsapp";
import { useLiveOffer } from "@/components/OfferTags";

type Props = {
  whatsappNumber?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
} & ({ product: Product; service?: never } | { service: Service; product?: never });

/** WhatsApp order/booking link. Includes the live offer (if any) in the prefilled message. */
export default function WhatsAppLink({ product, service, whatsappNumber, className, children, ...rest }: Props) {
  const { offer } = useLiveOffer(product?.offers ?? service?.offers);
  const href = product
    ? productWhatsAppUrl(product, whatsappNumber || undefined, offer)
    : serviceWhatsAppUrl(service!, whatsappNumber || undefined, offer);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={rest["aria-label"]}>
      {children}
    </a>
  );
}
