/**
 * Central site configuration — single source of truth for brand,
 * contact and SEO metadata used across the app.
 */
export const site = {
  name: "Smart Radiance",
  shortName: "Smart Radiance",
  /**
   * Canonical origin. Read from NEXT_PUBLIC_SITE_URL so the deployment decides
   * (Vercel already sets it to the www host); falls back to the bare domain
   * for local development.
   */
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://iaradiance.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://iaradiance.com",
  locale: "es_ES",
  lang: "es",
  email: "iasmartechnology@gmail.com",
  phone: "+34627297958",
  phoneDisplay: "627 297 958",
  whatsapp: "https://wa.me/34627297958",
  /**
   * Gmail's compose window, pre-addressed to the agency. Opens in a new tab so
   * the visitor never loses the page. Falls back gracefully: users not signed
   * into Gmail land on the sign-in screen with the draft preserved.
   */
  gmailCompose:
    "https://mail.google.com/mail/?view=cm&fs=1&tf=1" +
    "&to=iasmartechnology@gmail.com" +
    "&su=" +
    encodeURIComponent("Consulta desde iaradiance.com") +
    "&body=" +
    encodeURIComponent(
      "Hola Smart Radiance,\n\nMe gustaría hablar sobre mi proyecto web.\n\n",
    ),
  tagline: "Diseño web y SEO para negocios que escalan",
  description:
    "Smart Radiance es la agencia digital que ayuda a los negocios a escalar: diseño y desarrollo web, optimización de rendimiento y posicionamiento SEO. Webs rápidas, elegantes y preparadas para destacar en buscadores.",
} as const;

export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
] as const;

export type NavLink = (typeof navLinks)[number];
