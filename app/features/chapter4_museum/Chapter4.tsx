"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { galleryZones, type GalleryImage } from "@/src/data/gallery";
import { useSectionVisible } from "@/src/hooks/useSectionVisible";
import GalleryModal from "./GalleryModal";
import MuseumScene from "./MuseumScene";

const theme = {
  background: "#020617",
  accent: "#38BDF8",
  text: "#FFFFFF",
};

const pathParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  delay: i * 0.1,
}));

export default function Chapter4() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setRef: setVisibleRef, visible } = useSectionVisible();
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeZone, setActiveZone] = useState(0);

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

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrollProgress(value);
    const zoneIndex = Math.min(
      galleryZones.length - 1,
      Math.floor(value * 0.88 * galleryZones.length),
    );
    setActiveZone(zoneIndex);
  });

  const exitLine1 = useTransform(scrollYProgress, [0.86, 0.89, 0.92], [0, 1, 0]);
  const exitLine2 = useTransform(scrollYProgress, [0.9, 0.93, 0.96], [0, 1, 0]);
  const exitLine3 = useTransform(scrollYProgress, [0.94, 0.97, 1], [0, 1, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  const [pathProgress, setPathProgress] = useState(0);
  useMotionValueEvent(pathOpacity, "change", setPathProgress);

  const getZoneLabelStyle = (index: number) => {
    const segment = 0.88 / galleryZones.length;
    const start = 0.08 + index * segment;
    const end = start + segment * 0.85;
    const fadeIn = Math.min(1, Math.max(0, (scrollProgress - start) / 0.05));
    const fadeOut = Math.min(1, Math.max(0, (end - scrollProgress) / 0.04));
    return { opacity: fadeIn * fadeOut, y: (1 - fadeIn) * 14 };
  };

  return (
    <section
      ref={mergedRef}
      id="chapter-4"
      className="relative w-full"
      style={{
        height: "580vh",
        background: theme.background,
        color: theme.text,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {visible ? (
          <MuseumScene
            scrollProgress={scrollProgress}
            selectedImage={selected}
            onSelectImage={setSelected}
          />
        ) : (
          <div className="absolute inset-0 bg-[#020617]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(2,6,23,0.65)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(2,6,23,0.85)_100%)]" />

        {/* Header */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-16 text-center sm:pt-20"
          initial={{ opacity: 0, y: 18 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            Chapter 4
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            The Museum of Humaima 🖼️✨
          </h2>
          <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
            Some moments deserve more than a memory.
            <br />
            They deserve a place of their own.
          </p>
        </motion.div>

        <motion.p
          className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-white/50 sm:bottom-32"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          Scroll to walk through · Tap a frame to explore
        </motion.p>

        {/* Zone labels */}
        {galleryZones.map((zone, i) => {
          const labelStyle = getZoneLabelStyle(i);
          return (
            <motion.div
              key={zone.id}
              className="pointer-events-none absolute inset-x-0 bottom-20 z-10 flex flex-col items-center px-6 text-center sm:bottom-24"
              style={{ opacity: labelStyle.opacity, y: labelStyle.y }}
            >
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#38BDF8]/70">
                {i < 3 ? `Zone ${i + 1}` : "Centerpiece"}
              </p>
              <h3 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                {zone.title}
              </h3>
              {zone.subtitle && (
                <p className="mt-1 text-sm text-white/50">{zone.subtitle}</p>
              )}
            </motion.div>
          );
        })}

        {/* Zone progress dots */}
        <div className="pointer-events-none absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3 sm:right-6">
          {galleryZones.map((zone, i) => (
            <span
              key={zone.id}
              className="h-1.5 w-1.5 rounded-full transition-all duration-500"
              style={{
                backgroundColor:
                  activeZone === i ? theme.accent : "rgba(255,255,255,0.2)",
                boxShadow:
                  activeZone === i
                    ? "0 0 8px rgba(56,189,248,0.8)"
                    : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Exit transition — scroll past the sticky viewport */}
      <div className="relative z-20 -mt-[30vh] flex min-h-[70vh] flex-col items-center justify-end px-6 pb-28 pt-[30vh]">
        <motion.p
          className="text-center text-base text-white/80 sm:text-lg"
          style={{ opacity: exitLine1 }}
        >
          You are more than my favorite memories.
        </motion.p>

        <motion.p
          className="mt-10 text-center text-lg font-medium text-white sm:text-xl"
          style={{ opacity: exitLine2 }}
        >
          You are my favorite person.
        </motion.p>

        <motion.p
          className="mt-10 max-w-md text-center text-sm leading-relaxed text-white/60 sm:text-base"
          style={{ opacity: exitLine3 }}
        >
          And there are things I love about you that no photo could ever capture.
        </motion.p>

        <motion.div
          className="relative mt-20 flex h-40 w-full max-w-xs flex-col items-center"
          style={{ opacity: pathOpacity }}
        >
          <div className="absolute top-0 h-px w-20 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent" />

          {pathParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.9)]"
              style={{
                top: `${particle.id * 7}%`,
                opacity: Math.max(0, pathProgress - particle.delay * 0.07),
              }}
              animate={{
                y: [0, 6, 0],
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2.2 + particle.id * 0.12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}

          <motion.div
            className="absolute bottom-0 h-20 w-px bg-gradient-to-b from-[#38BDF8]/80 via-[#38BDF8]/30 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          <motion.p
            className="absolute -bottom-2 text-[10px] uppercase tracking-[0.45em] text-[#38BDF8]/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Continue
          </motion.p>
        </motion.div>
      </div>

      <GalleryModal image={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
