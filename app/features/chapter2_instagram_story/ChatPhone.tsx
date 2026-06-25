"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import type { FirstChatMessage } from "@/src/data/firstChat";

const theme = {
  background: "#020617",
  primary: "#0F172A",
  accent: "#38BDF8",
  text: "#FFFFFF",
};

type ChatPhoneProps = {
  progress: number;
  messages: FirstChatMessage[];
  username: string;
  dateLabel: string;
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-[#2a2f36] px-3 py-2">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80" />
    </div>
  );
}

function IconBack() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2c-8.28 0-15-6.72-15-15a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 10l6-3v10l-6-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" strokeLinecap="round" />
      <path d="M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z" />
      <path d="M5 11a7 7 0 0014 0" strokeLinecap="round" />
      <path d="M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 15l4-4 4 4 4-5 4 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSticker() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h9l7 7v9H4z" />
      <path d="M13 4v7h7" />
    </svg>
  );
}

export default function ChatPhone({ progress, messages, username, dateLabel }: ChatPhoneProps) {
  const visibleMessages = useMemo(
    () => messages.filter((message) => progress >= message.revealAt),
    [messages, progress]
  );
  const showNotification = progress >= 1;
  const showCaption = progress >= 6;
  const showTyping = progress >= 9;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [visibleMessages.length, showTyping]);

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -8, 0], rotateY: [0, 4, 0], rotateX: [0, 2, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 rounded-[44px] bg-[#38BDF8]/10 blur-3xl" />
      <div className="absolute -inset-8 rounded-[56px] bg-[radial-gradient(circle_at_top,#38BDF8_0%,transparent_70%)] opacity-50" />
      <div className="relative h-[540px] w-[300px] overflow-hidden rounded-[44px] border border-white/10 bg-[#0a0c10] shadow-[0_20px_60px_rgba(2,6,23,0.65)] sm:h-[600px] sm:w-[340px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14)_0%,transparent_55%)]" />
        <div className="relative z-10 flex items-center justify-center pt-3">
          <div className="h-6 w-24 rounded-full bg-[#0b0f14]" />
        </div>
        <div className="relative z-10 mt-2 flex items-center justify-between px-4 text-white">
          <button type="button" className="text-white/80">
            <IconBack />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[linear-gradient(140deg,#1f2430,#2a2f36)]">
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0c10] bg-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{username}</p>
              <p className="text-[11px] text-emerald-300/80">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
              <IconPhone />
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
              <IconVideo />
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
              <IconInfo />
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-3 flex flex-col gap-3 px-3">
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/50">
            <span className="h-px w-16 bg-white/10" />
            <span>{dateLabel}</span>
            <span className="h-px w-16 bg-white/10" />
          </div>
        </div>
        <div
          ref={scrollRef}
          className="relative z-10 mt-2 flex h-[320px] flex-col gap-2 overflow-y-auto px-3 [scrollbar-width:none] [-ms-overflow-style:none] sm:h-[380px] [&::-webkit-scrollbar]:hidden"
        >
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-[#12161c] px-3 py-2 text-[11px] text-white/70"
            >
              New message from {username}
            </motion.div>
          )}
          <div className="flex flex-1 flex-col gap-1">
            {visibleMessages.map((message, index) => {
              const isMe = message.sender === "me";
              const prev = visibleMessages[index - 1];
              const next = visibleMessages[index + 1];
              const isGroupedTop = prev?.sender === message.sender;
              const isGroupedBottom = next?.sender === message.sender;
              const bubbleRadius = isMe
                ? `${isGroupedTop ? "10px" : "18px"} ${isGroupedTop ? "10px" : "18px"} ${
                    isGroupedBottom ? "10px" : "18px"
                  } 18px`
                : `${isGroupedTop ? "10px" : "18px"} ${isGroupedBottom ? "10px" : "18px"} 18px ${
                    isGroupedTop ? "10px" : "18px"
                  }`;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} ${
                    isGroupedTop ? "-mt-0.5" : "mt-2"
                  }`}
                >
                  <div
                    style={{ borderRadius: bubbleRadius }}
                    className={`max-w-[82%] px-3 py-2 text-[12px] leading-4 shadow-[0_0_18px_rgba(56,189,248,0.12)] sm:text-[13px] sm:leading-5 ${
                      isMe
                        ? "bg-[linear-gradient(135deg,#4c8dff_0%,#2f6bff_100%)] text-white"
                        : "bg-[#2a2f36] text-white"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/50">
                      {message.date}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {showTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-start"
              >
                <TypingIndicator />
              </motion.div>
            )}
          </div>
        </div>
        <div className="relative z-10 mt-2 px-3 pb-4">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#10141a] px-3 py-2 text-[11px] text-white/50">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2f36] text-white/70">
              <IconMic />
            </span>
            <span className="flex-1">Message...</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-white/70">
              <IconImage />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-white/70">
              <IconSticker />
            </span>
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 h-1.5 w-24 -translate-x-1/2 rounded-full bg-white/20" />
      </div>
      <div
        className="pointer-events-none absolute -left-12 -right-12 -top-12 -bottom-6 rounded-[48px] opacity-40"
        style={{
          background: `radial-gradient(circle at top, ${theme.accent} 0%, transparent 65%)`,
        }}
      />
      {showCaption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute -right-6 top-40 rounded-full bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70"
        >
          Priorities 😂
        </motion.div>
      )}
    </motion.div>
  );
}
