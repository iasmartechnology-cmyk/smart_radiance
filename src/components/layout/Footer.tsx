import { site, navLinks } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 bg-onyx/80 backdrop-blur-sm">
      <div className="shell py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-subheading text-ivory">{site.name}</p>
            <p className="text-body-sm mt-2 text-ash">{site.tagline}</p>
          </div>

          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-body-sm text-ash transition-colors hover:text-ivory"
                  >
                    {l.label}
                  </a>
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
