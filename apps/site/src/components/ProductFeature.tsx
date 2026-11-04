import Image from "next/image";
import Container from "@/components/Container";
import { images } from "@/lib/images";

export default function ProductFeature() {
  return (
    <section className="py-8 lg:py-12">
      <Container>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] rounded-tr-[3rem] sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-[2.5rem] lg:rounded-tr-[4rem]">
          <Image
            src={images.productFeature}
            alt="Premium men's grooming products"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 lg:inset-y-0 lg:left-0 lg:flex lg:max-w-lg lg:flex-col lg:justify-center lg:p-12">
            <h3 className="font-serif text-2xl text-cream sm:text-3xl lg:text-5xl">
              Premium Beauty Products
            </h3>
            <p className="mt-2 max-w-xs text-sm text-cream/70 lg:mt-4 lg:max-w-sm lg:text-base">
              Curated global brands for hair, beard, and skin — available in salon and for home.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
