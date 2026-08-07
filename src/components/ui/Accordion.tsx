"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: readonly AccordionItem[];
  className?: string;
};

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-ink/8 border-y border-ink/8", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question} className="py-1">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors sm:py-6"
            >
              <span className="font-display text-lg font-medium tracking-[-0.02em] text-ink transition-colors group-hover:text-gold-deep sm:text-xl">
                {item.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/60 text-ink transition-all duration-300",
                  isOpen && "border-gold/40 bg-gold text-white",
                )}
              >
                <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                <span
                  className={cn(
                    "absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-300",
                    isOpen && "scale-y-0",
                  )}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-muted sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
