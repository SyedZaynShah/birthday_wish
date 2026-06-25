import dynamic from "next/dynamic";
import Chapter0 from "./features/chapter0_intro/Chapter0";
import Chapter1 from "./features/chapter1_countdown/Chapter1";
import Chapter2 from "./features/chapter2_instagram_story/Chapter2";

const Chapter3 = dynamic(
  () => import("./features/chapter3_constellation/Chapter3"),
);
const Chapter4 = dynamic(() => import("./features/chapter4_museum/Chapter4"));
const Chapter5 = dynamic(() => import("./features/chapter5_reasons/Chapter5"));
const Chapter6 = dynamic(() => import("./features/chapter6_letter/Chapter6"));
const Chapter7 = dynamic(() => import("./features/chapter7_future/Chapter7"));
const Chapter8 = dynamic(() => import("./features/chapter8_finale/Chapter8"));

export default function Home() {
  return (
    <main className="flex flex-col">
      <Chapter0 />
      <Chapter1 />
      <Chapter2 />
      <Chapter3 />
      <Chapter4 />
      <Chapter5 />
      <Chapter6 />
      <Chapter7 />
      <Chapter8 />
    </main>
  );
}
