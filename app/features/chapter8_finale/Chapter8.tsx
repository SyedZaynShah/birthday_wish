"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { finaleMeta, finalePhases } from "@/src/data/finale";
import { useSectionVisible } from "@/src/hooks/useSectionVisible";
import EndScreen from "./EndScreen";
import FinaleCanvas from "./FinaleCanvas";
import FinaleLine from "./FinaleLine";
import MusicToggle from "./MusicToggle";
import SecretFinale from "./SecretFinale";

function PhaseBlock({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 ${className}`}
    >
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-7 sm:gap-9">
        {children}
      </div>
    </div>
  );
}

function ShootingStars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="finale-shooting-star absolute h-px w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent"
          style={{
            top: `${18 + i * 22}%`,
            left: "-10%",
            animationDelay: `${i * 4 + 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Chapter8() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const burstRef = useRef(0);
  const { setRef: setVisibleRef, visible } = useSectionVisible();
  const [secretOpen, setSecretOpen] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      setVisibleRef(node);
    },
    [setVisibleRef],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  const handleBurst = useCallback(() => {
    burstRef.current = 1;
  }, []);

  const handleSecretComplete = useCallback(() => {
    setSecretOpen(false);
    setShowEndScreen(true);
  }, []);

  if (showEndScreen) {
    return (
      <>
        <EndScreen />
        <MusicToggle />
      </>
    );
  }

  return (
    <section
      ref={mergedRef}
      id="chapter-8"
      className="relative bg-[#020617] text-white"
      style={{ height: "680vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <FinaleCanvas
          active={visible}
          progressRef={progressRef}
          burstRef={burstRef}
        />
        <ShootingStars />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,transparent_40%,#020617_100%)]" />
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <PhaseBlock>
          <motion.header
            className="mb-4 text-center"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 sm:text-sm">
              {finaleMeta.chapter}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
              {finaleMeta.title}
            </h2>
          </motion.header>
          {finalePhases.phase1.lines.map((line, i) => (
            <FinaleLine key={line} delay={i * 0.06}>
              {line}
            </FinaleLine>
          ))}
        </PhaseBlock>

        <PhaseBlock>
          <FinaleLine large>Watch the stars.</FinaleLine>
          <FinaleLine delay={0.1}>They remember everything.</FinaleLine>
        </PhaseBlock>

        <PhaseBlock>
          <FinaleLine hero>{finalePhases.phase3.line1}</FinaleLine>
          <FinaleLine hero delay={0.15} className="text-[#38BDF8]">
            {finalePhases.phase3.line2}
          </FinaleLine>
        </PhaseBlock>

        <PhaseBlock>
          {finalePhases.phase4.lines.map((line, i) => (
            <FinaleLine
              key={line}
              delay={i * 0.07}
              large={i < 4}
              className={line === "❤️" ? "text-3xl sm:text-4xl" : ""}
            >
              {line}
            </FinaleLine>
          ))}
        </PhaseBlock>

        <PhaseBlock>
          <FinaleLine>A gift from the universe.</FinaleLine>
        </PhaseBlock>

        <PhaseBlock>
          {finalePhases.phase6.lines.map((line, i) => (
            <FinaleLine
              key={line}
              delay={i * 0.08}
              large={i === 2}
              className={line === "❤️" ? "text-3xl sm:text-4xl" : ""}
            >
              {line}
            </FinaleLine>
          ))}
        </PhaseBlock>

        <PhaseBlock className="pointer-events-auto">
          <motion.button
            type="button"
            className="rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-10 py-4 text-sm font-medium uppercase tracking-[0.3em] text-white shadow-[0_0_32px_rgba(56,189,248,0.15)] backdrop-blur-md transition hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={() => setSecretOpen(true)}
          >
            {finalePhases.phase7.buttonLabel}
          </motion.button>
        </PhaseBlock>
      </div>

      <SecretFinale
        open={secretOpen}
        onBurst={handleBurst}
        onComplete={handleSecretComplete}
      />

      <MusicToggle />
    </section>
  );
}
