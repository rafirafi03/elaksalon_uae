import Link from "next/link";

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[1.75rem] bg-surface-elevated px-6 py-16 text-center">
      <p className="font-serif text-2xl text-cream sm:text-3xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background transition hover:bg-gold-soft"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
