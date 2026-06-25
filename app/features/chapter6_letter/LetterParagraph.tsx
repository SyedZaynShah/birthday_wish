"use client";

import { motion } from "framer-motion";
import type { LetterParagraph as LetterParagraphType } from "@/src/data/letter";

type Props = {
  paragraph: LetterParagraphType;
};

function variantClasses(variant: LetterParagraphType["variant"]) {
  switch (variant) {
    case "salutation":
      return "text-[17px] font-medium leading-relaxed text-white/95 sm:text-lg";
    case "signature":
      return "text-[17px] font-medium italic leading-relaxed text-[#38BDF8]/90 sm:text-lg";
    default:
      return "text-[16px] leading-[1.85] text-white/82 sm:text-[17px] sm:leading-[1.9]";
  }
}

export default function LetterParagraph({ paragraph }: Props) {
  return (
    <motion.p
      className={`max-w-prose whitespace-pre-line break-words ${variantClasses(paragraph.variant)}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.65 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      {paragraph.text}
    </motion.p>
  );
}
