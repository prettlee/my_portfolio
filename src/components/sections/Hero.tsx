"use client";

import { motion, useReducedMotion } from "motion/react";

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pointer-events-none relative z-20 flex min-h-dvh flex-col justify-center px-6 md:px-10">
      <div className="mx-auto w-fit max-w-full sm:-translate-x-[3vw]">
        <motion.h1
          className="w-max max-w-full whitespace-normal font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-semibold tracking-tight text-paper sm:whitespace-nowrap"
          variants={rise}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Hi, I&apos;m Pratyush Ananth
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-base leading-7 text-mist md:text-lg"
          variants={rise}
          initial={reduceMotion ? "show" : "hidden"}
          animate="show"
          transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          I&apos;m a sophomore studying Computer Science at Purdue University.
        </motion.p>
      </div>
    </section>
  );
}
