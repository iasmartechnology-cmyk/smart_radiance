# Smart Radiance

Web de producción para **Smart Radiance** — agencia digital de diseño y
desarrollo web, optimización de rendimiento y posicionamiento SEO.

Construida a partir de la referencia visual importada desde Google Stitch
(sistema editorial *warm-dark* «ORYZO»: lienzo nogal, tipografía crema, acento
ámbar contenido) y reinterpretada como una experiencia scroll-driven con 3D.

- **Dominio:** https://iaradiance.com
- **Contacto:** smartradianc@gmail.com · 627 297 958

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (tokens de diseño en `@theme`)
- **GSAP + ScrollTrigger** (`@gsap/react` / `useGSAP`) — sistema de animación
- **Three.js + React Three Fiber + Drei** — escena WebGL scroll-driven
- **Lenis** — smooth scroll sincronizado con ScrollTrigger

## Arquitectura

```
src/
  app/            layout (SEO/metadata), page, sitemap, robots, opengraph-image
  components/
    3d/           SceneBackground → SceneCanvas → Scene → RadianceObject / Particles
    animations/   Reveal, HeadingReveal (reveals reutilizables con cleanup)
    layout/       Nav (scroll-spy + menú móvil), Footer
    providers/    SmoothScrollProvider (Lenis ↔ ScrollTrigger ↔ store 3D)
    sections/     Hero, Manifesto, Services, Process, Results, Contact
    seo/          JsonLd (datos estructurados schema.org)
    ui/           MagneticButton
  hooks/          useMediaQuery / useIsMobile / usePrefersReducedMotion
  lib/            site, content, gsap, utils, scroll-store, smooth-scroll
```

### Principios técnicos

- **Server / Client Components aislados**: solo lo que necesita interacción,
  GSAP o WebGL es `"use client"`. El contenido crítico es HTML real (SEO / sin JS).
- **3D scroll-driven desacoplado**: el scroll del DOM (GSAP/Lenis) escribe un
  progreso normalizado en un store; el bucle de render de R3F lo lee cada frame
  sin provocar re-renders de React.
- **Rendimiento**: la escena WebGL se carga con `dynamic(..., { ssr:false })`
  tras el primer paint; DPR, partículas y geometría se reducen en móvil.
- **Accesibilidad**: `prefers-reduced-motion` congela la escena y desactiva
  parallax/reveals; skip-link, foco visible, HTML semántico y ARIA.
- **Cleanup**: todas las animaciones usan `useGSAP`/`gsap.context` con revert
  automático; ScrollTriggers, Lenis y listeners se destruyen al desmontar.

## Contacto

La sección final no usa formulario: el contacto es directo por **teléfono**
(`tel:`), **email** (`mailto:`) y **WhatsApp**. No hay backend, ni credenciales,
ni dependencias de envío de correo — menos superficie y cero mantenimiento.

Los datos de contacto viven en un único sitio: `src/lib/site.ts`.

## Scripts

```bash
npm run dev     # desarrollo
npm run lint    # ESLint
npm run build   # build de producción
npm run start   # servir el build
```
