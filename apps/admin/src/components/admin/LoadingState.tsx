export default function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse rounded-full bg-surface-elevated" />
        <div className="h-10 w-56 max-w-full animate-pulse rounded-full bg-surface-elevated" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-surface-elevated" />
      </div>

      <div className="overflow-hidden rounded-[1.75rem] bg-surface-elevated">
        <div className="space-y-0">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-t border-border/40 px-5 py-4 first:border-t-0"
            >
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-surface" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 max-w-full animate-pulse rounded-full bg-surface" />
                <div className="h-3 w-24 max-w-full animate-pulse rounded-full bg-surface" />
              </div>
              <div className="hidden h-3 w-16 animate-pulse rounded-full bg-surface sm:block" />
              <div className="hidden h-3 w-14 animate-pulse rounded-full bg-surface md:block" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
