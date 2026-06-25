"use client";

import type { LandscapePhase } from "@/src/data/futureDream";

type Props = {
  phase: LandscapePhase;
  className?: string;
};

export default function CountrysideBackground({ phase, className = "" }: Props) {
  const isSpace = phase === "space" || phase === "night-return";
  const showClouds = phase === "clouds" || phase === "dawn";
  const showHills =
    phase === "dawn" ||
    phase === "countryside" ||
    phase === "village" ||
    phase === "evening";
  const isEvening = phase === "evening" || phase === "village";
  const isNightReturn = phase === "night-return";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Sky */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isNightReturn
            ? "linear-gradient(180deg, #020617 0%, #0F172A 55%, #1e293b 100%)"
            : isSpace
              ? "linear-gradient(180deg, #020617 0%, #0F172A 50%, #1a2744 100%)"
              : isEvening
                ? "linear-gradient(180deg, #4a5568 0%, #c4a574 35%, #f0c987 65%, #e8b86d 100%)"
                : showHills
                  ? "linear-gradient(180deg, #7eb8da 0%, #b8d4e8 40%, #d4e8c2 75%, #8fbc8f 100%)"
                  : "linear-gradient(180deg, #1e3a5f 0%, #4a6fa5 45%, #8ab4d4 100%)",
        }}
      />

      {/* Stars (space + night return) */}
      {(isSpace || isNightReturn) &&
        Array.from({ length: 20 }, (_, i) => (
          <span
            key={`star-${i}`}
            className="letter-star absolute rounded-full bg-white"
            style={{
              left: `${(i * 23 + 5) % 95}%`,
              top: `${(i * 17 + 8) % 45}%`,
              width: i % 3 === 0 ? 2 : 1.5,
              height: i % 3 === 0 ? 2 : 1.5,
              animationDelay: `${(i % 5) * 0.6}s`,
              opacity: isNightReturn ? 0.9 : 0.5,
            }}
          />
        ))}

      {/* Clouds */}
      {showClouds && (
        <>
          <div className="dream-cloud absolute -left-[10%] top-[18%] h-24 w-[55%] rounded-full bg-white/50 blur-2xl sm:h-32" />
          <div className="dream-cloud absolute right-[-5%] top-[28%] h-20 w-[45%] rounded-full bg-white/40 blur-2xl sm:h-28 [animation-delay:1.5s]" />
          <div className="dream-cloud absolute left-[20%] top-[8%] h-16 w-[40%] rounded-full bg-white/35 blur-xl [animation-delay:3s]" />
        </>
      )}

      {/* Sun / moon glow */}
      {showHills && !isEvening && !isNightReturn && (
        <div className="absolute right-[15%] top-[12%] h-16 w-16 rounded-full bg-[#fff4d6]/80 blur-sm sm:h-24 sm:w-24" />
      )}

      {/* Rolling hills */}
      {showHills && (
        <>
          <div
            className="absolute -left-[10%] bottom-[18%] h-[38%] w-[120%] rounded-[50%]"
            style={{ background: isEvening ? "#2d4a35" : "#4a7c59" }}
          />
          <div
            className="absolute -right-[5%] bottom-[10%] h-[32%] w-[110%] rounded-[50%]"
            style={{ background: isEvening ? "#3d6b4a" : "#6b9b6e" }}
          />
          <div
            className="absolute bottom-0 left-0 h-[28%] w-full"
            style={{
              background: isEvening
                ? "linear-gradient(180deg, #3d5c44 0%, #2a4030 100%)"
                : "linear-gradient(180deg, #7cb87c 0%, #5a9a5a 100%)",
            }}
          />
        </>
      )}

      {/* Wildflowers */}
      {showHills && !isSpace && (
        <div className="absolute inset-x-0 bottom-[8%] flex justify-around px-4 opacity-70">
          {["#f9a8d4", "#fde68a", "#c4b5fd", "#fca5a5", "#86efac"].map(
            (color, i) => (
              <span
                key={i}
                className="dream-petal h-2 w-2 rounded-full"
                style={{
                  backgroundColor: color,
                  animationDelay: `${i * 0.4}s`,
                  marginTop: `${(i % 3) * 6}px`,
                }}
              />
            ),
          )}
        </div>
      )}

      {/* Evening mist */}
      {isEvening && (
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#2a3530]/60 to-transparent" />
      )}
    </div>
  );
}
