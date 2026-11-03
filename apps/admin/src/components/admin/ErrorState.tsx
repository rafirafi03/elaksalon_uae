import Link from "next/link";
import { MSG } from "@/lib/messages";

export default function ErrorState({
  title = "Something went wrong",
  description = MSG.loadFailed,
  retryHref,
}: {
  title?: string;
  description?: string;
  retryHref?: string;
}) {
  return (
    <div className="rounded-[1.75rem] bg-surface-elevated px-6 py-16 text-center">
      <p className="font-serif text-2xl text-cream sm:text-3xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {retryHref ? (
        <Link
          href={retryHref}
          className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm text-cream transition hover:border-gold/40"
        >
          Try again
        </Link>
      ) : null}
    </div>
  );
}
