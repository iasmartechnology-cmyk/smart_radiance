import Link from "next/link";
import { site, navLinks } from "@/lib/site";
import { services } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 bg-onyx/80 backdrop-blur-sm">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-16">
          <div className="max-w-[34ch]">
            <p className="text-subheading text-ivory">{site.name}</p>
            <p className="text-body-sm mt-2 text-ash">{site.tagline}</p>
          </div>

          {/* Site-wide links to every service page — the strongest internal
              linking signal available on a small site. */}
          <nav aria-label="Servicios">
            <p className="text-caption text-slate">Servicios</p>
            <ul className="mt-4 flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.href}
                    className="text-body-sm text-ash transition-colors hover:text-ivory"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pie de página">
            <p className="text-caption text-slate">Navegación</p>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={`/${l.href}`}
                    className="text-body-sm text-ash transition-colors hover:text-ivory"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="my-10 border-0 border-t border-obsidian" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-slate">
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={`tel:${site.phone}`}
              className="text-body-sm text-ash transition-colors hover:text-ivory"
            >
              {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-body-sm text-ash transition-colors hover:text-ivory"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
