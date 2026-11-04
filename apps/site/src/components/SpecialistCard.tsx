import Image from "next/image";
import Link from "next/link";
import type { Specialist } from "@/lib/specialists";
import SpecialistAvatar from "@/components/SpecialistAvatar";

export default function SpecialistCard({
  person,
  showSpecialty = true,
}: {
  person: Specialist;
  /** Hide the specialty/description line (e.g. compact home page carousel). */
  showSpecialty?: boolean;
}) {
  return (
    <Link
      href={`/specialists/${person.slug}`}
      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] bg-surface-elevated transition hover:bg-surface sm:rounded-[1.75rem] lg:rounded-[2rem]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {person.image ? (
          <Image
            src={person.image}
            alt={person.name}
            fill
            className="object-cover object-top transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <SpecialistAvatar name={person.name} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className="absolute top-3 right-3 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-background uppercase sm:text-xs">
          {person.experience}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">
          <h3 className="font-serif text-base text-cream sm:text-lg lg:text-xl">{person.name}</h3>
          <p className="mt-0.5 text-xs text-gold sm:text-sm">{person.role}</p>
          {showSpecialty && person.specialty ? (
            <p className="mt-1 text-[11px] text-cream/70 sm:text-xs">{person.specialty}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
