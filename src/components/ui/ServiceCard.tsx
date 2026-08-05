"use client";

import { motion } from "framer-motion";
import type { Service } from "@/types";
import { fadeUp } from "@/lib/motion";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.article variants={fadeUp} className="h-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="surface-card group relative h-full overflow-hidden p-8 transition-shadow duration-300 hover:shadow-ambient"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-container/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/20 transition-transform duration-300 group-hover:scale-110">
          <Icon className="text-primary" size={22} strokeWidth={1.5} aria-hidden />
        </div>
        <h3 className="mb-3 font-display text-headline-sm text-on-surface">{service.title}</h3>
        <p className="font-inter text-body-md text-on-surface-variant">{service.description}</p>
      </motion.div>
    </motion.article>
  );
}
