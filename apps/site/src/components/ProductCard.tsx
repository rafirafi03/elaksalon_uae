import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import WhatsAppLink from "@/components/WhatsAppLink";
import { OfferBadge, OfferPrice } from "@/components/OfferTags";

export default function ProductCard({ product, whatsappNumber }: { product: Product; whatsappNumber?: string }) {
  return (
    <article className="group relative flex min-w-0 flex-col rounded-[1.5rem] bg-surface-elevated p-4 transition hover:bg-surface sm:p-5 lg:p-6">
      <Link
        href={`/products/${product.slug}`}
        className="block after:absolute after:inset-0 after:rounded-[1.5rem] after:content-['']"
      >
        <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          />
          <OfferBadge offers={product.offers} className="absolute top-2 left-2" />
        </div>

        <p className="text-[10px] tracking-wider text-muted uppercase lg:text-xs">{product.brand}</p>
        <h3 className="mt-1 font-serif text-base leading-snug text-cream sm:text-lg lg:text-xl">
          {product.name}
        </h3>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <OfferPrice price={product.price} offers={product.offers} />
        <WhatsAppLink
          product={product}
          whatsappNumber={whatsappNumber}
          aria-label={`Buy ${product.name} on WhatsApp`}
          className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-background transition hover:bg-gold-soft lg:h-9 lg:w-9"
        >
          <ShoppingBag size={15} />
        </WhatsAppLink>
      </div>
    </article>
  );
}
