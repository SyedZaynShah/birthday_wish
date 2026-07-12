"use client";

import dynamic from "next/dynamic";

const Chapter2 = dynamic(() => import("./Chapter2"), { ssr: false });

export default function Chapter2Client() {
  return <Chapter2 />;
}