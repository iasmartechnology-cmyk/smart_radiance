# Smart Radiance

Landing page de producción para **Smart Radiance** — desarrollo web, posicionamiento SEO y mejora de páginas.

Construida con **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4** y **Framer Motion**.

## Scripts

```bash
npm run dev     # Entorno de desarrollo
npm run build   # Build de producción
npm run start   # Servir el build de producción
npm run lint    # ESLint
```

## Estructura

- `src/app/` — Layout, metadata, `robots.ts`, `sitemap.ts`, `manifest.ts`, OG image e iconos.
- `src/components/` — Layout (Navbar, Footer), secciones y componentes UI.
- `src/lib/` — Constantes de marca, variantes de animación y schema.org.
- `public/` — Assets estáticos (favicon SVG).

## SEO y metadatos

- Dominio canónico: `https://iaradiance.com`
- `metadataBase` y canonical configurados en `src/app/layout.tsx`
- `robots.txt` y `sitemap.xml` generados automáticamente
- Imagen Open Graph generada en build (`opengraph-image.tsx`)
- Schema.org `ProfessionalService` / `LocalBusiness` inyectado en la home

## Despliegue

Proyecto listo para Vercel. Configura el dominio `iaradiance.com` en el panel del proyecto.
