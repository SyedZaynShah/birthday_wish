"use client";



import {

  AnimatePresence,

  motion,

  useMotionValueEvent,

  useScroll,

  useTransform,

} from "framer-motion";

import { useRef, useState, useCallback } from "react";

import type { Reason } from "@/src/data/reasons";

import { useSectionVisible } from "@/src/hooks/useSectionVisible";

import ReasonDetailModal from "./ReasonDetailModal";

import ReasonsScene from "./ReasonsScene";



const theme = {

  background: "#020617",

  accent: "#38BDF8",

  text: "#FFFFFF",

};



const pathParticles = Array.from({ length: 12 }, (_, i) => ({

  id: i + 1,

  delay: i * 0.1,

}));



export default function Chapter5() {

  const sectionRef = useRef<HTMLElement | null>(null);

  const { setRef: setVisibleRef, visible } = useSectionVisible();

  const [selected, setSelected] = useState<Reason | null>(null);

  const [secretRevealed, setSecretRevealed] = useState(false);



  const mergedRef = useCallback(

    (node: HTMLElement | null) => {

      sectionRef.current = node;

      setVisibleRef(node);

    },

    [setVisibleRef],

  );



  const { scrollYProgress } = useScroll({

    target: sectionRef,

    offset: ["start start", "end end"],

  });



  const exitLine1 = useTransform(scrollYProgress, [0.88, 0.91, 0.94], [0, 1, 0]);

  const exitLine2 = useTransform(scrollYProgress, [0.92, 0.95, 0.97], [0, 1, 0]);

  const exitLine3 = useTransform(scrollYProgress, [0.94, 0.97, 0.99], [0, 1, 1]);

  const exitLine4 = useTransform(scrollYProgress, [0.96, 0.99, 1], [0, 1, 1]);

  const pathOpacity = useTransform(scrollYProgress, [0.97, 1], [0, 1]);



  const [pathProgress, setPathProgress] = useState(0);

  useMotionValueEvent(pathOpacity, "change", setPathProgress);



  const handleSelect = (reason: Reason) => {

    if (reason.isSecret) {

      setSecretRevealed(true);

    }

    setSelected(reason);

  };



  const handleClose = () => {

    setSelected(null);

  };



  return (

    <section

      ref={mergedRef}

      id="chapter-5"

      className="relative w-full"

      style={{

        height: "580vh",

        background: theme.background,

        color: theme.text,

      }}

    >

      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">

        <motion.div

          className="pointer-events-none relative z-20 shrink-0 px-6 pt-12 text-center sm:pt-14"

          initial={{ opacity: 0, y: 16 }}

          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}

          transition={{ duration: 0.75, ease: "easeOut" }}

        >

          <p className="text-xs uppercase tracking-[0.42em] text-white/50 sm:text-sm">

            Chapter 5

          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:mt-3 sm:text-4xl md:text-[2.4rem]">

            Things I Love About You{" "}

            <span className="inline-block text-[#F472B6]">❤️</span>

          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:mt-4 sm:text-base">

            Some things can&apos;t be photographed.

            <br />

            Some things can only be felt.

          </p>

          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#38BDF8]/50 to-transparent sm:mt-5 sm:w-24" />

        </motion.div>



        <div className="relative min-h-0 flex-1">

          <ReasonsScene

            active={visible}

            scrollYProgress={scrollYProgress}

            selectedReason={selected}

            secretRevealed={secretRevealed}

            onSelectReason={handleSelect}

          />

        </div>



        <AnimatePresence>

          {selected && (

            <ReasonDetailModal

              key={selected.id}

              reason={selected}

              secretRevealed={secretRevealed}

              onClose={handleClose}

            />

          )}

        </AnimatePresence>



        <motion.p

          className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.38em] text-white/40 sm:bottom-10 sm:text-xs"

          initial={{ opacity: 0 }}

          animate={visible ? { opacity: 1 } : { opacity: 0 }}

          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}

        >

          Scroll to discover · Tap a card to read

        </motion.p>

      </div>



      <div className="relative z-20 -mt-[28vh] flex min-h-[72vh] flex-col items-center justify-end px-6 pb-28 pt-[28vh]">

        <motion.p

          className="text-center text-base text-white/75 sm:text-lg"

          style={{ opacity: exitLine1 }}

        >

          The more I know you...

        </motion.p>



        <motion.p

          className="mt-10 text-center text-base text-white/75 sm:text-lg"

          style={{ opacity: exitLine2 }}

        >

          The more reasons I find.

        </motion.p>



        <motion.p

          className="mt-10 text-center text-sm text-white/55 sm:text-base"

          style={{ opacity: exitLine3 }}

        >

          And somehow...

        </motion.p>



        <motion.p

          className="mt-4 text-center text-lg font-medium text-white sm:text-xl"

          style={{ opacity: exitLine4 }}

        >

          I still haven&apos;t reached the end.

        </motion.p>



        <motion.div

          className="relative mt-20 flex h-40 w-full max-w-xs flex-col items-center"

          style={{ opacity: pathOpacity }}

        >

          <div className="absolute top-0 h-px w-20 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent" />



          {pathParticles.map((particle) => (

            <motion.span

              key={particle.id}

              className="absolute h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.9)]"

              style={{

                top: `${particle.id * 7}%`,

                opacity: Math.max(0, pathProgress - particle.delay * 0.07),

              }}

              animate={{

                y: [0, 6, 0],

                scale: [1, 1.2, 1],

                opacity: [0.4, 1, 0.4],

              }}

              transition={{

                duration: 2.2 + particle.id * 0.12,

                repeat: Infinity,

                ease: "easeInOut",

                delay: particle.delay,

              }}

            />

          ))}



          <motion.div

            className="absolute bottom-0 h-20 w-px bg-gradient-to-b from-[#38BDF8]/80 via-[#38BDF8]/30 to-transparent"

            initial={{ scaleY: 0 }}

            whileInView={{ scaleY: 1 }}

            viewport={{ once: true, amount: 0.5 }}

            transition={{ duration: 1.2, ease: "easeOut" }}

            style={{ transformOrigin: "top" }}

          />



          <motion.p

            className="absolute -bottom-2 text-[10px] uppercase tracking-[0.45em] text-[#38BDF8]/60"

            initial={{ opacity: 0 }}

            whileInView={{ opacity: 1 }}

            viewport={{ once: true }}

            transition={{ delay: 0.5 }}

          >

            Continue

          </motion.p>

        </motion.div>

      </div>

    </section>

  );

}


