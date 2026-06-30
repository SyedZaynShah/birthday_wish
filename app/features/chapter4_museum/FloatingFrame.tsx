"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import type { GalleryImage } from "@/src/data/gallery";

const FRAME_WIDTHS = {
  small: "max-w-[18rem] lg:max-w-[19rem]",
  medium: "max-w-[20rem] lg:max-w-[22rem]",
  large: "max-w-[22rem] lg:max-w-[25rem]",
  centerpiece: "max-w-[24rem] lg:max-w-[31rem]",
} as const;

const FRAME_ASPECTS = {
  small: "aspect-[4/5]",
  medium: "aspect-[4/5]",
  large: "aspect-[3/4]",
  centerpiece: "aspect-[4/5]",
} as const;

const IMAGE_SIZES = {
  small: "(max-width: 1024px) 88vw, 24rem",
  medium: "(max-width: 1024px) 88vw, 26rem",
  large: "(max-width: 1024px) 88vw, 30rem",
  centerpiece: "(max-width: 1024px) 90vw, 34rem",
} as const;

export type ExhibitSide = "left" | "right" | "center";

type Props = {
  image: GalleryImage;
  side: ExhibitSide;
  onSelect: (image: GalleryImage) => void;
};

function PlaceholderArt({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(180deg,#08101d_0%,#111827_58%,#020617_100%)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-lg font-semibold text-[#7DD3FC] sm:h-20 sm:w-20 sm:text-2xl">
        H
      </div>
      <p className="mt-5 px-4 text-center text-[10px] uppercase tracking-[0.3em] text-white/35 sm:text-xs">
        {title}
      </p>
    </div>
  );
}

function FloatingFrame({
  image,
  side,
  onSelect,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const isLeft = side === "left";
  const isCenter = side === "center";
  const entryX = isCenter ? 0 : isLeft ? -32 : 32;
  const exhibitLabel = `Exhibit ${String(image.id).padStart(2, "0")}`;
  const textColumnClass = isCenter
    ? "mx-auto mt-6 max-w-2xl text-center"
    : isLeft
      ? "lg:order-3 lg:pl-4 xl:pl-10"
      : "lg:order-1 lg:pr-4 xl:pr-10";
  const frameColumnClass = isCenter
    ? "mx-auto w-full"
    : isLeft
      ? "lg:order-1"
      : "lg:order-3";

  return (
    <motion.article
      className="relative"
      initial={{ opacity: 0, y: 32, x: entryX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={
          isCenter
            ? "mx-auto max-w-5xl"
            : "grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] lg:gap-10"
        }
      >
        <div className={frameColumnClass}>
          <div className={`relative mx-auto w-full ${FRAME_WIDTHS[image.size]}`}>
            <div className="pointer-events-none absolute left-1/2 top-[-4.5rem] h-14 w-px -translate-x-1/2 bg-gradient-to-b from-[#dbeafe] via-[#7dd3fc]/70 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-[-2.25rem] h-24 w-[72%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(125,211,252,0.2),rgba(56,189,248,0.06)_32%,rgba(2,6,23,0)_100%)] blur-2xl" />

            <motion.button
              type="button"
              aria-label={`Open ${image.title}`}
              className="group relative block w-full text-left"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() => onSelect(image)}
            >
              <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
              <div className="absolute inset-0 rounded-[2rem] border border-white/12 shadow-[0_32px_70px_rgba(1,4,10,0.55)]" />
              <div className="relative rounded-[2rem] border border-[#7DD3FC]/10 bg-[linear-gradient(180deg,rgba(8,17,31,0.96),rgba(5,10,20,0.98))] p-3 sm:p-4">
                <div className="rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-3 sm:p-4">
                  <div
                    className={`relative ${FRAME_ASPECTS[image.size]} overflow-hidden rounded-[1.15rem] border border-white/8 bg-[#010615]`}
                  >
                    {imgFailed ? (
                      <PlaceholderArt title={image.title} />
                    ) : (
                      <Image
                        src={image.image}
                        alt={image.title}
                        fill
                        loading="lazy"
                        quality={75}
                        sizes={IMAGE_SIZES[image.size]}
                        className="object-contain p-2 sm:p-3"
                        onError={() => setImgFailed(true)}
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_18%,rgba(2,6,23,0)_34%,rgba(2,6,23,0.16)_100%)]" />
                    <div className="pointer-events-none absolute inset-y-0 left-[-14%] w-[42%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] opacity-70" />
                  </div>
                </div>
              </div>
            </motion.button>

            <div className="pointer-events-none absolute bottom-[-1.15rem] left-1/2 h-8 w-[72%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-2xl" />
          </div>
        </div>

        {!isCenter ? (
          <div className="pointer-events-none hidden h-full items-center justify-center lg:flex lg:order-2">
            <div className="flex h-full flex-col items-center">
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-[#7DD3FC]/55" />
              <div className="mt-2 h-3 w-3 rounded-full border border-[#7DD3FC]/40 bg-[#020617] shadow-[0_0_20px_rgba(56,189,248,0.45)]" />
            </div>
          </div>
        ) : null}

        <div className={textColumnClass}>
          <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_20px_45px_rgba(2,6,23,0.28)] backdrop-blur-[2px] sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#7DD3FC]/78">
              {exhibitLabel}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white sm:text-[2rem]">
              {image.title}
            </h3>
            <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/45">
              Description
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/72 sm:text-base">
              {image.caption}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default memo(FloatingFrame);
