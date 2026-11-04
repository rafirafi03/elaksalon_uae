function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

/**
 * Placeholder portrait for specialists without a photo: gold monogram over a soft glow
 * and a subtle head-and-shoulders silhouette. Fills its (relative) parent.
 */
export default function SpecialistAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const lg = size === "lg";

  return (
    <div
      role="img"
      aria-label={name}
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,rgba(201,164,92,0.22),transparent_60%),linear-gradient(160deg,#1c1915_0%,#111010_100%)]"
    >
      {/* Fine diagonal texture */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(45deg,#c9a45c_0_1px,transparent_1px_14px)]" />

      {/* Silhouette */}
      <svg
        viewBox="0 0 200 240"
        className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-auto text-gold/[0.13]"
        aria-hidden
        preserveAspectRatio="xMidYMax meet"
      >
        <circle cx="100" cy="82" r="44" fill="currentColor" />
        <path d="M18 240c0-52 36-88 82-88s82 36 82 88z" fill="currentColor" />
      </svg>

      {/* Monogram */}
      <div className={`absolute inset-x-0 flex justify-center ${lg ? "top-[24%]" : "top-[20%]"}`}>
        <div
          className={`flex items-center justify-center rounded-full border border-gold/50 bg-background/40 shadow-[0_0_40px_rgba(201,164,92,0.15)] backdrop-blur-sm ${
            lg ? "h-32 w-32 sm:h-36 sm:w-36" : "h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full border border-gold/20 ${
              lg ? "h-[86%] w-[86%]" : "h-[84%] w-[84%]"
            }`}
          >
            <span
              className={`font-serif tracking-[0.08em] text-gold ${
                lg ? "text-5xl sm:text-6xl" : "text-xl sm:text-2xl lg:text-3xl"
              }`}
            >
              {initials(name)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
