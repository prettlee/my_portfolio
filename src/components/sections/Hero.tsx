"use client";

import { motion, useReducedMotion } from "motion/react";

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pointer-events-none relative z-20 flex min-h-dvh flex-col justify-end px-6 pb-14 md:px-10 md:pb-16">
      <motion.p
        className="font-mono text-xs tracking-[0.34em] text-cyan uppercase"
        variants={rise}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        A little further
      </motion.p>
      <motion.h1
        className="mt-4 max-w-4xl font-display text-5xl leading-[0.92] font-semibold tracking-tight text-paper md:text-7xl"
        variants={rise}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        Hi, I'm Pratyush
      </motion.h1>
      <motion.p
        className="mt-6 max-w-md text-base leading-7 text-mist"
        variants={rise}
        initial={reduceMotion ? "show" : "hidden"}
        animate="show"
        transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        I'm a sophomore studying Computer Science at Purdue University
      </motion.p>
    </section>
  );
}
