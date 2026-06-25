"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { GalleryImage } from "@/src/data/gallery";

type Props = {
  image: GalleryImage | null;
  onClose: () => void;
};

function PlaceholderArt() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
        <span className="font-serif text-5xl text-[#38BDF8]">H</span>
      </div>
      <p className="mt-6 text-sm tracking-wide text-white/40">Photo Coming Soon</p>
    </div>
  );
}

export default function GalleryModal({ image, onClose }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [image?.id, image?.image]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-2xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(56,189,248,0.15)] backdrop-blur-2xl"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/60 transition hover:border-white/30 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0F172A] sm:aspect-[4/5]">
              {imgFailed ? (
                <PlaceholderArt />
              ) : (
                <img
                  key={image.image}
                  src={image.image}
                  alt={image.title}
                  className="h-full w-full object-cover"
                  onError={() => setImgFailed(true)}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent" />
            </div>

            <div className="space-y-3 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#38BDF8]/80">
                Museum
              </p>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                {image.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                {image.caption}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
