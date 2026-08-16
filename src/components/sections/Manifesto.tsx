import HeadingReveal from "@/components/animations/HeadingReveal";
import Reveal from "@/components/animations/Reveal";

/**
 * First stage of the ascent — the "why". Text sits to one side so the range
 * stays visible in the frame as the camera starts to gain altitude.
 */
export default function Manifesto() {
  return (
    <section
      aria-label="Nuestro enfoque"
      className="relative z-10 flex min-h-svh items-center"
    >
      <div className="shell grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-caption text-cobalt">El ascenso</p>
          <HeadingReveal
            as="h2"
            onScroll
            lines={["Crecer no es", "cuestión de suerte."]}
            className="text-heading-lg mt-5 text-ivory"
          />
        </div>

        <Reveal as="div" className="md:max-w-[44ch] md:justify-self-end">
          <p className="text-body-lg text-ash">
            Es cuestión de ruta. Una web rápida, clara y bien posicionada
            convierte visitas en clientes de forma constante — no por un pico
            puntual, sino por una subida sostenida.
          </p>
          <p className="text-body mt-6 text-ash">
            Nos ocupamos del terreno técnico —velocidad, indexación y
            visibilidad en Google— para que tú te ocupes del negocio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
