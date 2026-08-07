export const COMPANY = {
  name: "Smart Radiance",
  email: "iasmartechnology@gmail.com",
  phone: "627297958",
  phoneHref: "tel:+34627297958",
  emailHref: "mailto:iasmartechnology@gmail.com",
} as const;

export const SITE_URL = "https://iaradiance.com";

export const SITE: {
  name: string;
  url: string;
  description: string;
  ogDescription: string;
  locale: string;
  keywords: string[];
} = {
  name: COMPANY.name,
  url: SITE_URL,
  description:
    "Smart Radiance crea y mejora webs con elegancia y foco en resultados. Desarrollo web, posicionamiento SEO y optimización de páginas para tu negocio.",
  ogDescription:
    "Presencia digital que transmite confianza y convierte. Desarrollo web, SEO y mejora de páginas.",
  locale: "es_ES",
  keywords: [
    "desarrollo web",
    "SEO",
    "posicionamiento web",
    "mejora de páginas web",
    "optimización web",
    "diseño web",
    "Smart Radiance",
  ],
};

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SERVICES = [
  {
    id: "desarrollo-web",
    number: "01",
    title: "Desarrollo Web",
    description:
      "Sitios y aplicaciones a medida, rápidas y preparadas para crecer. Diseño limpio, código sólido y una experiencia que convierte visitas en clientes.",
  },
  {
    id: "seo",
    number: "02",
    title: "Posicionamiento SEO",
    description:
      "Estrategia técnica y de contenidos para que te encuentren cuando busquen. Visibilidad real, medible y sostenida en el tiempo.",
  },
  {
    id: "mejora",
    number: "03",
    title: "Mejora de páginas web",
    description:
      "Optimizamos lo que ya tienes: velocidad, claridad, conversión y estética. Sin empezar de cero, con resultados que se notan.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Descubrimiento",
    description:
      "Entendemos tu negocio, tus objetivos y a tu audiencia. Definimos el alcance con claridad.",
  },
  {
    number: "02",
    title: "Diseño",
    description:
      "Propuesta visual y estructura centradas en la conversión, la marca y la usabilidad.",
  },
  {
    number: "03",
    title: "Desarrollo",
    description:
      "Construcción limpia, rendimiento alto y detalle en cada interacción.",
  },
  {
    number: "04",
    title: "Lanzamiento",
    description:
      "Publicación, medición y ajustes para que tu presencia digital rinda desde el primer día.",
  },
] as const;

export const BENEFITS = [
  {
    title: "Más clientes",
    description:
      "Una web clara y persuasiva que guía al visitante hacia el contacto.",
  },
  {
    title: "Mayor visibilidad",
    description:
      "SEO bien ejecutado para aparecer cuando tu cliente potencial busca.",
  },
  {
    title: "Imagen premium",
    description:
      "Una presencia digital que transmite confianza y profesionalidad.",
  },
  {
    title: "Velocidad real",
    description:
      "Páginas rápidas que retienen atención y mejoran la conversión.",
  },
  {
    title: "Claridad de mensaje",
    description:
      "Tu propuesta de valor, entendible en segundos, no en minutos.",
  },
  {
    title: "Resultados medibles",
    description:
      "Decisiones basadas en datos: tráfico, leads y rendimiento continuo.",
  },
] as const;

export const FAQS = [
  {
    question: "¿Qué incluye un proyecto con Smart Radiance?",
    answer:
      "Dependiendo del servicio: diseño y desarrollo web, optimización SEO o mejora de tu web actual. Siempre con un plan claro, plazos definidos y comunicación directa.",
  },
  {
    question: "¿Cuánto tarda un proyecto típico?",
    answer:
      "Una landing o mejora puede estar lista en pocas semanas. Un sitio completo suele requerir entre 4 y 8 semanas, según alcance y contenido disponible.",
  },
  {
    question: "¿Trabajáis con negocios que ya tienen web?",
    answer:
      "Sí. Gran parte de nuestro trabajo es mejorar webs existentes: rendimiento, diseño, mensaje y posicionamiento, sin necesidad de reconstruir todo.",
  },
  {
    question: "¿Cómo empezamos?",
    answer:
      "Escríbenos o llámanos. Revisamos tu caso, te proponemos un enfoque y un presupuesto transparente. Sin compromiso.",
  },
  {
    question: "¿El presupuesto es personalizado?",
    answer:
      "Sí. Cada proyecto tiene necesidades distintas. Te enviamos una propuesta ajustada a objetivos, alcance y plazos.",
  },
] as const;
