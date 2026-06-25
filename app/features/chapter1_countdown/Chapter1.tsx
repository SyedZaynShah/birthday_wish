"use client";

import Confetti from "react-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { birthdayDate } from "@/src/lib/date";

const theme = {
  background: "#020617",
  primary: "#0F172A",
  accent: "#38BDF8",
  text: "#FFFFFF",
};

const particles = [
  { id: 1, top: "18%", left: "12%" },
  { id: 2, top: "32%", left: "80%" },
  { id: 3, top: "66%", left: "18%" },
  { id: 4, top: "72%", left: "72%" },
  { id: 5, top: "44%", left: "52%" },
  { id: 6, top: "24%", left: "62%" },
  { id: 7, top: "58%", left: "34%" },
  { id: 8, top: "12%", left: "48%" },
];

function getCountdown(now: Date) {
  const diff = Math.max(0, birthdayDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function Chapter1() {
  const [now, setNow] = useState<Date | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleResize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isBirthdayUnlocked = now !== null && now >= birthdayDate;
  const countdown = useMemo(
    () => (now ? getCountdown(now) : { days: 0, hours: 0, minutes: 0, seconds: 0 }),
    [now],
  );

  useEffect(() => {
    if (isBirthdayUnlocked) {
      audioRef.current?.play();
    }
  }, [isBirthdayUnlocked]);

  return (
    <section
      id="chapter-1"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-20"
      style={{
        background: `radial-gradient(circle at 80% 10%, ${theme.primary} 0%, ${theme.background} 60%)`,
        color: theme.text,
      }}
    >
      <AnimatePresence>{isBirthdayUnlocked && (
        <motion.div
          key="confetti"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <Confetti
            width={viewport.width}
            height={viewport.height}
            numberOfPieces={240}
            recycle={false}
            colors={[theme.accent, "#FFFFFF"]}
          />
        </motion.div>
      )}</AnimatePresence>
      <audio
        ref={audioRef}
        src="/audio/birthday-theme.mp3"
        preload="none"
        onError={() => {}}
      />
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute h-2 w-2 rounded-full bg-white/60 shadow-[0_0_12px_rgba(56,189,248,0.7)]"
            style={{ top: particle.top, left: particle.left }}
            animate={{ y: [0, -18, 0], opacity: [0.5, 1, 0.6] }}
            transition={{ duration: 6 + particle.id, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <motion.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">
            Chapter 1 · Countdown Portal
          </p>
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
            Every star has a story.
          </h2>
          <p className="text-base text-white/80 sm:text-lg">
            But this journey unlocks on July 1st.
          </p>
        </div>
        <motion.div
          className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-[#0F172A]/70 shadow-[0_0_60px_rgba(56,189,248,0.4)] sm:h-80 sm:w-80"
          animate={isBirthdayUnlocked ? { scale: [1, 1.2, 1.6], opacity: [1, 0.9, 0] } : { scale: 1, opacity: 1 }}
          transition={{ duration: isBirthdayUnlocked ? 1.4 : 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-6 rounded-full border border-white/20" />
          <div className="absolute inset-10 rounded-full border border-white/20" />
          {!isBirthdayUnlocked && (
            <div className="grid grid-cols-2 gap-6 text-center">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-2xl font-semibold sm:text-3xl tabular-nums">
                    {now === null ? "--" : String(item.value).padStart(2, "0")}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        {isBirthdayUnlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-2xl font-semibold sm:text-3xl">
              Happy Birthday Humaima ❤️
            </p>
            <button
              type="button"
              onClick={() =>
                document.getElementById("chapter-2")?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full border border-transparent bg-[#38BDF8]/20 px-7 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_0_25px_rgba(56,189,248,0.5)] transition"
            >
              Begin Your Journey
            </button>
          </motion.div>
        ) : (
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            The portal is waiting to open
          </p>
        )}
      </motion.div>
    </section>
  );
}
