"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import {
  galleryZones,
  getZoneImages,
  type GalleryImage,
} from "@/src/data/gallery";
import GalleryModal from "./GalleryModal";
import FloatingFrame, { type ExhibitSide } from "./FloatingFrame";
import MuseumScene from "./MuseumScene";

function ZonePlaque({
  index,
  title,
  subtitle,
}: {
  index: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      className="mx-auto flex max-w-xl justify-center px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-6 py-4 shadow-[0_22px_50px_rgba(2,6,23,0.32)]">
        <p className="text-[10px] uppercase tracking-[0.45em] text-[#38BDF8]/70">
          {index < 3 ? `Wing 0${index + 1}` : "Featured Piece"}
        </p>
        <h3 className="mt-2 text-xl font-medium text-white sm:text-2xl">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-white/50">{subtitle}</p>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function Chapter4() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 30,
    mass: 0.35,
  });
  const headerY = useTransform(smoothProgress, [0, 1], [0, -20]);
  const museumY = useTransform(smoothProgress, [0, 1], [0, -28]);
  const ambienceOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.4, 0.75, 0.55]);
  const exitOpacity = useTransform(smoothProgress, [0.55, 0.78, 1], [0.6, 1, 1]);

  let alternatingIndex = 0;

  return (
    <section
      ref={sectionRef}
      id="chapter-4"
      className="relative overflow-hidden bg-[#020617] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14)_0%,transparent_38%),linear-gradient(180deg,#030712_0%,#020617_100%)]" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.84)_100%)]"
        style={{ opacity: ambienceOpacity }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-4 pt-24 text-center sm:pt-28 md:pt-32">
        <motion.div style={{ y: headerY, willChange: "transform" }}>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            Chapter 4
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            The Museum of Humaima
          </h2>
          <p className="mt-5 max-w-2xl text-base text-white/70 sm:mx-auto sm:text-lg">
            A collection of evidence proving that this girl somehow manages to
            look different in every picture and beautiful in every one of them.
          </p>
        </motion.div>
      </div>

      <div className="h-[8.5rem] sm:h-[9.5rem] md:h-[11rem]" />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8"
        style={{ y: museumY, willChange: "transform" }}
      >
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 py-5 text-center shadow-[0_22px_60px_rgba(2,6,23,0.32)]">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Scroll to walk through · Tap a frame to explore
            </p>
          </div>
        </div>

        <div className="relative mt-14 overflow-hidden rounded-[2.5rem] border border-white/10 px-4 py-10 shadow-[0_32px_90px_rgba(2,6,23,0.38)] sm:mt-16 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <MuseumScene scrollProgress={smoothProgress} />

          <div className="pointer-events-none absolute bottom-12 left-1/2 top-12 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/18 to-transparent lg:block" />

          <div className="relative z-10 space-y-[4.5rem] sm:space-y-20 lg:space-y-24">
            {galleryZones.map((zone, index) => {
              const zoneImages = getZoneImages(zone.id);

              return (
                <section key={zone.id} className="relative">
                  <ZonePlaque
                    index={index}
                    title={zone.title}
                    subtitle={zone.subtitle}
                  />

                  <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-[4.5rem] lg:space-y-20">
                    {zoneImages.map((image) => {
                      const side: ExhibitSide =
                        zone.id === "zone-4"
                          ? "center"
                          : alternatingIndex++ % 2 === 0
                            ? "left"
                            : "right";

                      return (
                        <FloatingFrame
                          key={image.id}
                          image={image}
                          side={side}
                          onSelect={setSelected}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 mt-20 flex min-h-[60vh] flex-col items-center justify-end px-6 pb-8 pt-10 sm:mt-24 sm:pb-12">
          <motion.div style={{ opacity: exitOpacity }}>
            <motion.p
              className="text-center text-base text-white/80 sm:text-lg"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              You are more than my favorite memories.
            </motion.p>
            <motion.p
              className="mt-10 text-center text-lg font-medium text-white sm:text-xl"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.08, ease: "easeOut" }}
            >
              You are my favorite person.
            </motion.p>
            <motion.p
              className="mt-10 max-w-md text-center text-sm leading-relaxed text-white/60 sm:text-base"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            >
              And there are things I love about you that no photo could ever capture.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative mt-16 flex h-24 w-full max-w-sm items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute top-1/2 h-px w-24 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#38BDF8]/80 to-transparent sm:w-36" />
            <div className="absolute top-1/2 h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#38BDF8]/65 to-transparent" />
            <p className="absolute -bottom-1 text-[10px] uppercase tracking-[0.45em] text-[#38BDF8]/60">
              Continue
            </p>
          </motion.div>
        </div>
      </motion.div>

      <GalleryModal image={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
