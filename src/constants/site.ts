const DEFAULT_URL = "https://www.iaradiance.com";

function normalizeSiteUrl(value: string | undefined): string {
  if (!value) return DEFAULT_URL;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_URL;
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_URL;
  }
}

export const SITE = {
  name: "Smart Radiance",
  legalName: "Smart Radiance",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  email: "iasmartechnology@gmail.com",
  phoneDisplay: "627 297 958",
  phoneHref: "tel:627297958",
  description:
    "Diseñamos soluciones digitales que optimizan procesos, eliminan tareas repetitivas y ayudan a tu empresa a trabajar de forma más eficiente.",
  tagline: "Automatización inteligente para tu empresa",
  themeColor: "#735c00",
  keywords: [
    "desarrollo web profesional",
    "optimización SEO",
    "indexación en Google",
    "rediseño web",
    "automatización de procesos",
    "agentes inteligentes",
    "integraciones entre aplicaciones",
    "chatbots empresariales",
    "transformación digital",
    "Smart Radiance",
  ],
} as const;
