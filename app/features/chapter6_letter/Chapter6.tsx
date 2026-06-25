"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { letterFinale, letterMeta } from "@/src/data/letter";
import CosmicLetter from "./CosmicLetter";

const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  left: `${(i * 19 + 7) % 96}%`,
  top: `${(i * 27 + 5) % 88}%`,
  size: i % 4 === 0 ? 2 : 1.5,
  delay: `${(i % 6) * 0.7}s`,
}));

function NightSky() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#0F172A_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(15,23,42,0.5)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.08)_0%,transparent_45%)]" />

      {STARS.map((star) => (
        <span
          key={star.id}
          className="letter-star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

function Moon() {
  return (
    <div
      className="pointer-events-none absolute right-[8%] top-[10%] z-[1] sm:right-[12%] sm:top-[12%]"
      aria-hidden
    >
      <div className="relative h-14 w-14 opacity-70 sm:h-20 sm:w-20">
        <div className="absolute inset-0 rounded-full bg-[#38BDF8]/10 blur-xl" />
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/85 to-slate-300/70 shadow-[0_0_24px_rgba(56,189,248,0.2)]" />
        <div className="absolute right-1 top-1 h-11 w-11 rounded-full bg-[#020617]/75 sm:right-1.5 sm:top-1.5 sm:h-16 sm:w-16" />
      </div>
    </div>
  );
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Chapter6() {
  return (
    <section id="chapter-6" className="relative bg-[#020617] text-white">
      {/* Letter section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
        <NightSky />
        <Moon />

        <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-10 sm:gap-12">
          <header className="w-full text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 sm:text-sm">
              {letterMeta.chapter}
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              {letterMeta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              {letterMeta.subtitle}
            </p>
          </header>

          <CosmicLetter />
        </div>
      </div>

      {/* Ending section — separate flow, no overlap */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
        <NightSky />
        <Moon />

        <div className="relative z-10 flex w-full max-w-[800px] flex-col items-center gap-8 text-center sm:gap-10">
          <FadeIn>
            <h3 className="text-3xl font-semibold leading-snug tracking-tight text-white sm:text-4xl md:text-5xl">
              {letterFinale.birthdayLine}
            </h3>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-lg text-white/75 sm:text-xl">
              {letterFinale.closingLine}
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="text-4xl sm:text-5xl">{letterFinale.heart}</p>
          </FadeIn>

          <FadeIn delay={0.35} className="mt-8 flex flex-col items-center gap-6">
            <div className="flex h-24 flex-col items-center">
              <div className="h-full w-px bg-gradient-to-b from-[#38BDF8]/50 via-[#38BDF8]/20 to-transparent" />
            </div>
            <p className="max-w-xs text-xs uppercase tracking-[0.32em] text-[#38BDF8]/65 sm:text-sm">
              {letterFinale.transitionLine}
            </p>
          </FadeIn>
        </div>
      </div>

      <div id="chapter-7" className="h-px w-full scroll-mt-0" aria-hidden />
    </section>
  );
}
