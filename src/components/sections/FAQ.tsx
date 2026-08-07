"use client";

import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQS } from "@/lib/constants";

export function FAQ() {
  return (
    <Section id="faq" alt>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Preguntas frecuentes"
            description="Respuestas claras antes de empezar. Si necesitas más detalle, escríbenos."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion items={FAQS} />
        </Reveal>
      </div>
    </Section>
  );
}
