"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AUDIO_SRC = "/audio/birthday-theme.mp3";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.preload = "metadata";
    const onCanPlay = () => setAvailable(true);
    const onError = () => setAvailable(false);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.load();
    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (!available || !audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, available]);

  if (!available) return null;

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />
      <button
        type="button"
        aria-label={playing ? "Mute music" : "Play music"}
        onClick={() => setPlaying((p) => !p)}
        className="fixed bottom-6 right-6 z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0F172A]/80 text-white/70 shadow-lg backdrop-blur-md transition hover:border-[#38BDF8]/40 hover:text-white"
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </>
  );
}
