/** Centered card used by the login / forgot / reset password pages. */
export default function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] bg-surface-elevated p-8 sm:p-10">
        <p className="font-serif text-3xl tracking-[0.2em] text-gold">ELAK</p>
        <p className="mt-1 text-[10px] tracking-[0.28em] text-muted uppercase">Admin</p>
        <h1 className="mt-8 font-serif text-2xl text-cream">{title}</h1>
        {description ? <p className="mt-1 mb-6 text-sm text-muted">{description}</p> : <div className="mb-6" />}
        {children}
      </div>
    </main>
  );
}
