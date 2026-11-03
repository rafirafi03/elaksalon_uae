export default function PageHeader({
  eyebrow = "ELAK Admin",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5 lg:mb-10">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.25em] text-gold uppercase">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted lg:text-base">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
