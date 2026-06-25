"use client";

import { letterParagraphs } from "@/src/data/letter";
import LetterParagraph from "./LetterParagraph";

export default function CosmicLetter() {
  return (
    <article
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_48px_rgba(56,189,248,0.06)] backdrop-blur-xl sm:rounded-3xl sm:p-10 md:p-12"
      style={{ width: "min(90vw, 800px)", maxWidth: "800px" }}
    >
      <div className="space-y-8">
        {letterParagraphs.map((paragraph) => (
          <LetterParagraph key={paragraph.id} paragraph={paragraph} />
        ))}
      </div>
    </article>
  );
}
