import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { productWhatsAppUrl } from "@/lib/whatsapp";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex min-w-0 flex-col rounded-[1.5rem] bg-surface-elevated p-4 transition hover:bg-surface sm:p-5 lg:p-6">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition duration-500 hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          />
        </div>

        <p className="text-[10px] tracking-wider text-muted uppercase lg:text-xs">{product.brand}</p>
        <h3 className="mt-1 font-serif text-base leading-snug text-cream sm:text-lg lg:text-xl">
          {product.name}
        </h3>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="text-sm text-gold lg:text-base">{product.price}</span>
        <a
          href={productWhatsAppUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buy ${product.name} on WhatsApp`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-background transition hover:bg-gold-soft lg:h-9 lg:w-9"
        >
          <ShoppingBag size={15} />
        </a>
      </div>
    </article>
  );
}
