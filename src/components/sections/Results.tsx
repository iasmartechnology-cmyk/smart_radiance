import Reveal from "@/components/animations/Reveal";
import HeadingReveal from "@/components/animations/HeadingReveal";
import { stats } from "@/lib/content";

export default function Results() {
  return (
    <section
      aria-label="Por qué Smart Radiance"
      className="relative z-10 py-[var(--section-gap)] md:py-28"
    >
      <div className="shell">
        <div className="max-w-[42ch]">
          <p className="text-caption text-cobalt">Vistas desde arriba</p>
          <HeadingReveal
            as="h2"
            onScroll
            lines={["Rendimiento", "que se nota."]}
            className="text-heading-lg mt-5 text-ivory"
          />
        </div>

        <Reveal
          as="dl"
          stagger
          className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="card">
              <dt className="text-heading text-ivory">{s.value}</dt>
              <dd className="text-body-sm mt-3 text-ash">{s.label}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
