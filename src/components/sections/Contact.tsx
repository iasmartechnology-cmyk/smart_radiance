import HeadingReveal from "@/components/animations/HeadingReveal";
import Reveal from "@/components/animations/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { site } from "@/lib/site";

/**
 * The summit. Contact is direct — phone or email, no form, no friction.
 * The content sits on a graphite card so it stays legible against the fully
 * lit sky behind it at the end of the ascent.
 */
export default function Contact() {
  return (
    <section
      id="contacto"
      aria-label="Contacto"
      className="relative z-10 flex min-h-svh items-center py-[var(--section-gap)]"
    >
      <div className="shell">
        <div className="card md:p-12">
          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            <div>
              <p className="text-caption text-cobalt">La cima</p>
              <HeadingReveal
                as="h2"
                onScroll
                lines={["Hablemos."]}
                className="text-display mt-5 text-ivory"
              />
              <Reveal as="div">
                <p className="text-body-lg mt-6 max-w-[38ch] text-ash">
                  Cuéntanos a dónde quieres llegar, por teléfono o por correo.
                  Respondemos rápido y sin compromiso, con una propuesta clara.
                </p>
              </Reveal>
            </div>

            <Reveal as="div" stagger>
              <div className="border-b border-obsidian pb-7">
                <p className="text-caption text-slate">Teléfono</p>
                <a
                  href={`tel:${site.phone}`}
                  className="text-heading mt-3 block text-ivory transition-colors hover:text-cobalt"
                >
                  {site.phoneDisplay}
                </a>
                <p className="text-body-sm mt-3 text-ash">
                  Lunes a viernes, 9:00 – 19:00
                </p>
              </div>

              <div className="border-b border-obsidian py-7">
                <p className="text-caption text-slate">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-subheading mt-3 block break-all text-ivory transition-colors hover:text-cobalt"
                >
                  {site.email}
                </a>
                <p className="text-body-sm mt-3 text-ash">
                  Respuesta en menos de 24 h
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8">
                <MagneticButton
                  href={site.gmailCompose}
                  variant="pill"
                  external
                  ariaLabel={`Escribir un correo a ${site.email} desde Gmail`}
                >
                  Escríbenos
                </MagneticButton>
                <MagneticButton
                  href={site.whatsapp}
                  variant="ghost"
                  external
                  ariaLabel="Abrir conversación de WhatsApp"
                >
                  WhatsApp
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
