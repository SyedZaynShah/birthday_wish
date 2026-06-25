"use client";

type Props = {
  variant?: "distant" | "close" | "restaurant";
};

export default function VillageVisual({ variant = "distant" }: Props) {
  const scale = variant === "distant" ? "scale-75 opacity-70" : variant === "close" ? "scale-90" : "scale-100";

  return (
    <div
      className={`pointer-events-none relative mx-auto w-full max-w-md transition-all duration-700 ${scale}`}
      aria-hidden
    >
      {/* Path */}
      <div className="absolute bottom-[12%] left-1/2 h-[2px] w-[40%] -translate-x-1/2 rounded-full bg-[#8b7355]/50 sm:w-[50%]" />
      <div className="absolute bottom-[10%] left-1/2 h-8 w-[25%] -translate-x-1/2 bg-gradient-to-t from-[#6b5344]/30 to-transparent blur-sm" />

      {/* Village houses */}
      <div className="relative flex items-end justify-center gap-2 sm:gap-4">
        <House windows={1} warm={variant !== "distant"} small />
        <House windows={2} warm={variant !== "distant"} />
        {variant === "restaurant" ? (
          <Restaurant />
        ) : (
          <House windows={1} warm={variant === "close"} small />
        )}
        <House windows={2} warm={variant === "close"} />
      </div>
    </div>
  );
}

function House({
  windows,
  warm,
  small,
}: {
  windows: number;
  warm: boolean;
  small?: boolean;
}) {
  const w = small ? "w-10 sm:w-12" : "w-14 sm:w-20";
  const h = small ? "h-12 sm:h-14" : "h-16 sm:h-20";

  return (
    <div className={`flex flex-col items-center ${w}`}>
      <div
        className={`${small ? "h-5 w-[110%]" : "h-7 w-[120%]"} rounded-t-sm bg-[#4a3728]`}
        style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
      />
      <div className={`relative ${w} ${h} rounded-sm bg-[#6b5344]`}>
        {Array.from({ length: windows }, (_, i) => (
          <span
            key={i}
            className={`absolute h-2 w-2 rounded-[1px] sm:h-2.5 sm:w-2.5 ${
              warm ? "bg-[#fcd34d] shadow-[0_0_8px_#fbbf24]" : "bg-[#4a4035]"
            }`}
            style={{
              left: windows === 1 ? "50%" : i === 0 ? "20%" : "60%",
              top: "40%",
              transform: windows === 1 ? "translateX(-50%)" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Restaurant() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="mb-[-1px] h-6 w-24 rounded-t-full bg-[#3d2e22] sm:h-8 sm:w-28"
        style={{ clipPath: "polygon(10% 100%, 50% 0, 90% 100%)" }}
      />
      <div className="relative w-24 rounded-md border border-[#5c4a3a]/50 bg-[#7a6352] px-2 py-3 shadow-lg sm:w-28">
        <div className="mb-1 text-center text-[7px] font-medium tracking-wider text-[#fcd34d]/90 sm:text-[8px]">
          OUR PLACE
        </div>
        <div className="flex justify-center gap-2">
          <span className="h-3 w-3 rounded-[1px] bg-[#fcd34d] shadow-[0_0_10px_#fbbf24]" />
          <span className="h-3 w-3 rounded-[1px] bg-[#fcd34d] shadow-[0_0_10px_#fbbf24]" />
        </div>
        <div className="mt-2 flex justify-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#f472b6]/80" />
          <span className="h-2 w-2 rounded-full bg-[#fde68a]/80" />
          <span className="h-2 w-2 rounded-full bg-[#86efac]/80" />
        </div>
      </div>
      <div className="mt-1 h-4 w-3 rounded-full bg-[#9ca3af]/40 blur-[2px]" />
    </div>
  );
}
