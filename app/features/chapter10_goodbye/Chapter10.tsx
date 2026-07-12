"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function TextMoment({
  children,
  delay = 0,
  large = false,
  tiny = false,
}: {
  children: React.ReactNode;
  delay?: number;
  large?: boolean;
  tiny?: boolean;
}) {
  return (
    <motion.p
      className={`max-w-[700px] text-center text-pretty break-words px-4 ${
        tiny
          ? "text-sm leading-relaxed text-white/45 sm:text-base"
          : large
          ? "text-3xl font-medium leading-relaxed text-white sm:text-4xl md:text-5xl"
          : "text-xl leading-relaxed text-white/88 sm:text-2xl md:text-3xl"
      }`}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.p>
  );
}

function Spacer({ height = "200px" }: { height?: string }) {
  return <div style={{ height }} aria-hidden />;
}

function TinyCursor() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.span
        className="block h-10 w-[2px] rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.25)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.15, 1, 0.15] }}
        transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    </div>
  );
}

export default function Chapter10() {
  const reducedMotion = useReducedMotion();
  
  const decorativeStars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        id: index + 1,
        left: `${(index * 19) % 100}%`,
        top: `${(index * 31) % 100}%`,
        size: index % 7 === 0 ? 2 : index % 4 === 0 ? 1.4 : 1,
        delay: index * 0.15,
      })),
    [],
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617] text-white" id="chapter-10">
      {/* Background - almost black, barely visible stars */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#020617_0%,#030b1f_50%,#020617_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        {decorativeStars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            animate={reducedMotion ? undefined : { opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 20 + star.delay, repeat: Infinity, ease: "easeInOut", delay: star.delay }}
          />
        ))}
      </div>

      {/* Content - Normal document flow */}
      <div className="relative z-10 mx-auto flex w-full flex-col items-center px-4 sm:px-6">
        
        {/* Silence - black screen */}
        <Spacer height="100vh" />

        {/* Title */}
        <div className="flex min-h-[100vh] flex-col items-center justify-center">
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.45em] text-white/35 sm:text-sm">Chapter 10</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Goodbye.
            </h2>
          </motion.div>
        </div>

        <Spacer height="180px" />

        {/* Content begins */}
        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>I don&apos;t know</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>whether you&apos;ll ever see this again.</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>Maybe...</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>one day...</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>years from now...</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>you&apos;ll accidentally find this website again.</TextMoment>
        </div>

        <Spacer height="120vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>Maybe you&apos;ll smile.</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>Maybe you&apos;ll laugh</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>at how dramatic I was.</TextMoment>
        </div>

        <Spacer height="120vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>Maybe you&apos;ll remember</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>that once...</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>someone loved you enough</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>to build an entire universe</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>just to celebrate your birthday.</TextMoment>
        </div>

        <Spacer height="150vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment large>I hope life is kind to you.</TextMoment>
        </div>

        <Spacer height="120vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>I hope</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>you become everything</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>you ever dreamed of becoming.</TextMoment>
        </div>

        <Spacer height="120vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>I hope</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>someone always reminds you</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>how special you are.</TextMoment>
        </div>

        <Spacer height="150vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment large>Thank you</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>for every memory.</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>For every laugh.</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>For every late-night conversation.</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>For every dream</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>we built together.</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>Even the ones</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>that never happened.</TextMoment>
        </div>

        <Spacer height="150vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>You&apos;ll always be</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>a beautiful chapter</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>of my life.</TextMoment>
        </div>

        <Spacer height="120vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>And I don&apos;t regret</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment>a single page.</TextMoment>
        </div>

        <Spacer height="180vh" />

        <div className="flex min-h-[120vh] items-center justify-center">
          <TextMoment large>Goodbye,</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[120vh] items-center justify-center">
          <TextMoment large>Humaima.</TextMoment>
        </div>

        <Spacer height="200vh" />

        {/* Hidden message */}
        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment tiny>If another universe exists...</TextMoment>
        </div>

        <Spacer height="100vh" />

        <div className="flex min-h-[100vh] items-center justify-center">
          <TextMoment tiny>I hope we get our little restaurant.</TextMoment>
        </div>

        <Spacer height="250vh" />

        {/* Final cursor */}
        <TinyCursor />

        <Spacer height="100vh" />
      </div>
    </section>
  );
}
