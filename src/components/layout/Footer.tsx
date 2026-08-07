import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { COMPANY, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-cream-soft">
      <Container className="flex flex-col gap-10 py-12 sm:py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
            Smart <span className="text-gold">Radiance</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
            Desarrollo web, SEO y mejora de páginas. Presencia digital clara,
            elegante y orientada a resultados.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-14">
          <nav aria-label="Enlaces del pie de página">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Navegación
            </p>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Contacto
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={COMPANY.emailHref}
                  className="text-ink-muted transition-colors hover:text-gold-deep"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.phoneHref}
                  className="text-ink-muted transition-colors hover:text-gold-deep"
                >
                  {COMPANY.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-ink/6">
        <Container className="flex flex-col gap-2 py-5 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Smart Radiance. Todos los derechos reservados.</p>
          <p className="font-mono uppercase tracking-[0.16em]">
            Web · SEO · Mejora
          </p>
        </Container>
      </div>
    </footer>
  );
}
