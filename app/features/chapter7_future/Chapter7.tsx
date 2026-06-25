"use client";

import { motion } from "framer-motion";
import { futureMeta, futureScenes } from "@/src/data/futureDream";
import CountrysideBackground from "./CountrysideBackground";
import DreamLine from "./DreamLine";
import DreamScene from "./DreamScene";
import LifeMoments from "./LifeMoments";
import VillageVisual from "./VillageVisual";

function DescendingStars() {
  return (
    <div className="relative mx-auto h-28 w-full max-w-md" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]"
          style={{ left: `${8 + i * 9}%` }}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{
            opacity: [0, 1, 0.7, 0],
            y: [-10, 40, 90, 110],
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 2.8,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ChapterHeader() {
  return (
    <motion.header
      className="relative z-10 w-full max-w-2xl text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-white/50 sm:text-sm">
        {futureMeta.chapter}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
        {futureMeta.title}
      </h2>
      <p className="mx-auto mt-4 max-w-md whitespace-pre-line text-sm leading-relaxed text-white/60 sm:text-base">
        {futureMeta.subtitle}
      </p>
    </motion.header>
  );
}

export default function Chapter7() {
  return (
    <section id="chapter-7" className="relative bg-[#020617] text-white">
      {/* Opening — still in the stars */}
      <DreamScene phase="space" visual={<ChapterHeader />}>
        <DreamLine large>{futureScenes.scene1.lines[0]}</DreamLine>
      </DreamScene>

      {/* Through the clouds */}
      <DreamScene
        phase="clouds"
        visual={<VillageVisual variant="distant" />}
      >
        <DreamLine>{futureScenes.scene1.lines[1]}</DreamLine>
        <DreamLine delay={0.1}>{futureScenes.scene1.lines[2]}</DreamLine>
      </DreamScene>

      {/* Ireland */}
      <DreamScene
        phase="countryside"
        visual={<VillageVisual variant="close" />}
      >
        <DreamLine>{futureScenes.scene2.lines[0]}</DreamLine>
        <DreamLine delay={0.1} large>
          {futureScenes.scene2.lines[1]}
        </DreamLine>
      </DreamScene>

      {/* The restaurant */}
      <DreamScene
        phase="village"
        visual={<VillageVisual variant="restaurant" />}
      >
        {futureScenes.scene3.lines.map((line, i) => (
          <DreamLine key={line} delay={i * 0.08}>
            {line}
          </DreamLine>
        ))}
      </DreamScene>

      {/* Slow life */}
      <DreamScene phase="evening" visual={<LifeMoments />}>
        {futureScenes.scene4.lines.map((line, i) => (
          <DreamLine key={line} delay={i * 0.08} large={i === 2}>
            {line}
          </DreamLine>
        ))}
      </DreamScene>

      {/* Emotional centerpiece */}
      <DreamScene
        phase="evening"
        visual={<DescendingStars />}
      >
        {futureScenes.scene5.lines.map((line, i) => (
          <DreamLine
            key={line}
            delay={i * 0.1}
            large={i >= 2}
            className={line === "❤️" ? "text-3xl sm:text-4xl" : ""}
          >
            {line}
          </DreamLine>
        ))}
      </DreamScene>

      {/* Ending reflection */}
      <DreamScene phase="evening">
        {futureScenes.ending.lines.map((line, i) => (
          <DreamLine
            key={line}
            delay={i * 0.08}
            large={i === futureScenes.ending.lines.length - 2}
            className={line === "❤️" ? "text-3xl sm:text-4xl" : ""}
          >
            {line}
          </DreamLine>
        ))}
      </DreamScene>

      {/* Finale — back to night, moon, chapter 8 bridge */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6">
        <CountrysideBackground phase="night-return" />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[18%] z-[1] -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          aria-hidden
        >
          <div className="relative h-28 w-28 sm:h-36 sm:w-36">
            <div className="absolute inset-0 rounded-full bg-[#38BDF8]/15 blur-3xl" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/90 to-slate-200/80 shadow-[0_0_48px_rgba(56,189,248,0.25)]" />
            <div className="absolute right-3 top-3 h-24 w-24 rounded-full bg-[#020617]/80 sm:right-4 sm:top-4 sm:h-28 sm:w-28" />
          </div>
        </motion.div>

        <motion.p
          className="relative z-10 max-w-xl text-center text-xl font-medium leading-relaxed text-white sm:text-2xl md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.3 }}
        >
          {futureScenes.finale.line}
        </motion.p>

        <motion.div
          className="relative z-10 mt-12 flex h-20 flex-col items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="h-full w-px bg-gradient-to-b from-[#38BDF8]/40 to-transparent" />
        </motion.div>
      </div>

      <div id="chapter-8" className="h-px w-full" aria-hidden />
    </section>
  );
}
