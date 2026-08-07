"use client";

import { motion, useReducedMotion } from "framer-motion";

export function RadianceOrb() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,252,250,0.95),rgba(208,176,106,0.35)_42%,rgba(184,145,74,0.18)_68%,transparent_78%)] blur-[2px]"
      />
      <div
        aria-hidden
        className="absolute inset-[18%] rounded-full border border-gold/20 bg-[radial-gradient(circle_at_40%_35%,rgba(255,252,250,0.55),rgba(239,233,224,0.2)_55%,transparent_75%)] shadow-[inset_0_0_60px_rgba(184,145,74,0.12)]"
      />

      <svg
        viewBox="0 0 520 520"
        className="relative z-10 h-full w-full"
        role="img"
        aria-label="Composición visual abstracta de Smart Radiance"
      >
        <defs>
          <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d0b06a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#b8914a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8f6e2f" stopOpacity="0.45" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#fffcfa" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#d0b06a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b8914a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="260" r="168" fill="url(#coreGlow)" />

        {[210, 168, 126, 88].map((radius, index) => (
          <motion.circle
            key={radius}
            cx="260"
            cy="260"
            r={radius}
            fill="none"
            stroke="url(#goldStroke)"
            strokeWidth={index === 0 ? 1.4 : 1}
            strokeOpacity={0.55 - index * 0.08}
            initial={reduceMotion ? false : { rotate: 0 }}
            animate={
              reduceMotion
                ? undefined
                : { rotate: index % 2 === 0 ? 360 : -360 }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 48 + index * 10,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
            style={{ transformOrigin: "260px 260px" }}
          />
        ))}

        <motion.g
          initial={reduceMotion ? false : { rotate: 0 }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 70, repeat: Infinity, ease: "linear" }
          }
          style={{ transformOrigin: "260px 260px" }}
        >
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const x1 = 260 + Math.cos(angle) * 96;
            const y1 = 260 + Math.sin(angle) * 96;
            const x2 = 260 + Math.cos(angle) * 198;
            const y2 = 260 + Math.sin(angle) * 198;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#goldStroke)"
                strokeWidth="1"
                strokeOpacity="0.35"
              />
            );
          })}
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { rotate: 0 }}
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 55, repeat: Infinity, ease: "linear" }
          }
          style={{ transformOrigin: "260px 260px" }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const cx = 260 + Math.cos(angle) * 148;
            const cy = 260 + Math.sin(angle) * 148;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i % 3 === 0 ? 3.2 : 2.2}
                fill="#b8914a"
                fillOpacity={0.55}
              />
            );
          })}
        </motion.g>

        <circle
          cx="260"
          cy="260"
          r="42"
          fill="rgba(255,252,250,0.55)"
          stroke="#d0b06a"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />
        <circle cx="260" cy="260" r="14" fill="#b8914a" fillOpacity="0.85" />
      </svg>

      {!reduceMotion ? (
        <>
          <motion.span
            aria-hidden
            className="absolute left-[12%] top-[18%] h-2.5 w-2.5 rounded-full bg-gold/50"
            animate={{ y: [0, -10, 0], opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute bottom-[22%] right-[14%] h-2 w-2 rounded-full bg-gold-deep/40"
            animate={{ y: [0, 12, 0], opacity: [0.35, 0.75, 0.35] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />
          <motion.span
            aria-hidden
            className="absolute right-[22%] top-[30%] h-1.5 w-1.5 rounded-full bg-sand"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
        </>
      ) : null}
    </div>
  );
}
