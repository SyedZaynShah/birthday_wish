"use client";

type ChatMemoryCardProps = {
  src: string;
  alt: string;
  caption?: string;
};

export default function ChatMemoryCard({ src, alt, caption }: ChatMemoryCardProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_12px_30px_rgba(2,6,23,0.6)]">
        <img src={src} alt={alt} className="h-56 w-full object-cover" />
      </div>
      {caption ? <p className="text-xs uppercase tracking-[0.3em] text-white/60">{caption}</p> : null}
    </div>
  );
}
