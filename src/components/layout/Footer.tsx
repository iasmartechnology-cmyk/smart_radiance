import Image from "next/image";
import { Mail, Phone, Share2, Users } from "lucide-react";
import { SITE } from "@/constants/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="border-t border-outline-variant/30 bg-surface-container-low">
      <Container className="py-section-gap">
        <div className="grid grid-cols-1 items-start gap-stack-lg md:grid-cols-3">
          <div className="space-y-stack-md">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.jpg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <span className="font-display text-headline-sm text-on-surface">{SITE.name}</span>
            </div>
            <p className="max-w-xs font-inter text-body-md text-on-surface-variant">
              Innovación tecnológica para la transformación digital avanzada.
            </p>
          </div>

          <div className="space-y-stack-md">
            <h4 className="font-display text-label-md uppercase tracking-widest text-on-surface-variant">
              Contacto
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 font-inter text-body-md text-on-surface transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" aria-hidden />
                {SITE.email}
              </a>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 font-inter text-body-md text-on-surface transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" aria-hidden />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="space-y-stack-md">
            <h4 className="font-display text-label-md uppercase tracking-widest text-on-surface-variant">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Compartir"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-primary hover:text-on-primary"
              >
                <Share2 className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#"
                aria-label="Comunidad"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-primary hover:text-on-primary"
              >
                <Users className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-stack-lg border-t border-outline-variant/20 pt-stack-lg text-center font-inter text-caption text-on-surface-variant">
          © {year} {SITE.name}. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}
