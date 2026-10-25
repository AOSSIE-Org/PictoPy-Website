"use client";

import { motion } from "framer-motion";

const letters = ["P", "i", "c", "t", "o", "P", "y"];

export default function FooterWatermark() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 flex w-full select-none justify-center overflow-hidden"
    >
      <span className="flex cursor-default items-baseline text-[clamp(88px,18vw,320px)] font-bold leading-[1.1] tracking-tight">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block text-black/5 transition-colors duration-300 hover:text-black/25 dark:text-white/5 dark:hover:text-white/25 dark:hover:[text-shadow:0px_0px_40px_rgba(255,255,255,0.25)]"
            whileHover={{ y: -30, scale: 1.06, rotate: index % 2 === 0 ? -3 : 3 }}
            transition={{ type: "spring", stiffness: 350, damping: 16 }}
          >
            {letter}
          </motion.span>
        ))}
      </span>
    </div>
  );
}
