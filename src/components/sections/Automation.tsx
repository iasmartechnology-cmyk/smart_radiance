import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import HeadingReveal from "@/components/animations/HeadingReveal";
import { automationSteps, automationUseCases } from "@/lib/content";

/**
 * Custom automation — tailored to each type of business. Sits between the
 * service cards and the process so it reads as its own offer, and links to
 * the dedicated service page, which owns the search intent.
 */
export default function Automation() {
  return (
    <section
      id="automatizacion"
      aria-label="Automatizaciones a medida"
      className="relative z-10 py-[var(--section-gap)] md:py-28"
    >
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-caption text-cobalt">A tu medida</p>
            <HeadingReveal
              as="h2"
              onScroll
              lines={["Automatizaciones a medida", "según tu negocio."]}
              className="text-heading-lg mt-5 text-ivory"
            />
          </div>
          <Reveal as="div" className="md:justify-self-end md:max-w-[46ch]">
            <p className="text-body-lg text-ash">
              No vendemos automatizaciones genéricas. Estudiamos cómo trabaja tu
              negocio y diseñamos flujos a medida —con IA cuando aporta— que
              conectan tu web, tu CRM, el email y WhatsApp para que las tareas
              repetitivas se hagan solas.
            </p>
          </Reveal>
        </div>

        <Reveal
          as="ul"
          stagger
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {automationUseCases.map((u) => (
            <li key={u.sector} className="card h-full">
              <h3 className="text-heading-sm text-ivory">{u.sector}</h3>
              <p className="text-body mt-3 text-ash">{u.body}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <Reveal as="ol" stagger className="grid gap-4 sm:grid-cols-2">
            {automationSteps.map((step, i) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="text-caption text-slate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body text-ash">{step}</span>
              </li>
            ))}
          </Reveal>
          <Link
            href="/automatizacion-ia"
            className="text-body inline-flex self-start rounded-[var(--radius-nav)] border border-ivory/70 px-5 py-3 text-ivory transition-colors hover:border-ivory hover:bg-ivory/5 md:self-end"
          >
            Ver automatizaciones a medida →
          </Link>
        </div>
      </div>
    </section>
  );
}
