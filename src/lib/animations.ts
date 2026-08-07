import type { Transition, Variants } from "framer-motion";

export const easeOutExpo: Transition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOutExpo,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};
