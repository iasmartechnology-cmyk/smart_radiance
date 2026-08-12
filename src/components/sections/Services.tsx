import Reveal from "@/components/animations/Reveal";
import HeadingReveal from "@/components/animations/HeadingReveal";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section
      id="servicios"
      aria-label="Servicios"
      className="relative z-10 py-[var(--section-gap)] md:py-28"
    >
      <div className="shell">
        <div className="max-w-[46ch]">
          <p className="text-caption text-cobalt">Equipo de ruta</p>
          <HeadingReveal
            as="h2"
            onScroll
            lines={["Todo lo que necesitas", "para subir."]}
            className="text-heading-lg mt-5 text-ivory"
          />
        </div>

        {/* Graphite cards — separation by value step, never by shadow */}
        <Reveal
          as="ul"
          stagger
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          {services.map((s) => (
            <li key={s.id}>
              <article className="card h-full transition-colors duration-500 hover:bg-obsidian">
                <span className="text-caption text-slate">{s.index}</span>
                <h3 className="text-heading-sm mt-4 text-ivory">{s.title}</h3>
                <p className="text-body mt-3 text-ash">{s.body}</p>
              </article>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
