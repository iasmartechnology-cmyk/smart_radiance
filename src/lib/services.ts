/**
 * Service definitions — the single source of truth for the four service
 * landing pages, the homepage service cards, the navigation, the sitemap and
 * the structured data.
 *
 * Each page targets one clear search intent so the four don't compete with
 * each other for the same queries:
 *
 *   /diseno-web        → informational/commercial: building a new site
 *   /optimizacion-web  → commercial: improving a site that already exists
 *   /seo               → commercial: ranking and organic visibility
 *   /indexacion-google → problem-aware: "my site doesn't show up on Google"
 */

export type Faq = { q: string; a: string };

export type ServicePage = {
  /** URL segment — also the anchor id used on the homepage cards. */
  slug: string;
  index: string;
  /** Short label for navigation and cards. */
  title: string;
  /** Card copy on the homepage. */
  body: string;
  /** <title> — kept under ~60 chars so it isn't truncated in results. */
  metaTitle: string;
  /** Meta description — ~150-160 chars, written to earn the click. */
  metaDescription: string;
  /** Page H1 — carries the primary keyword in natural language. */
  h1: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** Body sections, each an H2 plus prose. */
  sections: { h2: string; paragraphs: string[] }[];
  /** Bulleted deliverables — scannable, and genuinely informative. */
  deliverables: { title: string; body: string }[];
  faqs: Faq[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "diseno-web",
    index: "01",
    title: "Diseño y desarrollo web",
    body: "Sitios a medida, rápidos y responsive. Del concepto al lanzamiento con código limpio y una experiencia cuidada en cada detalle.",
    metaTitle: "Diseño y desarrollo web profesional",
    metaDescription:
      "Agencia de diseño web profesional. Creamos páginas web para empresas a medida: rápidas, responsive y preparadas para posicionar en Google desde el primer día.",
    h1: "Diseño y desarrollo web profesional",
    intro:
      "Diseñamos y desarrollamos páginas web a medida para empresas que necesitan algo más que una plantilla: una web rápida, clara y construida para que la encuentren.",
    sections: [
      {
        h2: "Diseño web a medida, no plantillas",
        paragraphs: [
          "Cada negocio tiene una forma distinta de explicar lo que hace. Partimos de tu marca, tu público y tus objetivos para definir una dirección visual propia, en lugar de adaptar una plantilla que ya usan otros cientos de sitios.",
          "El resultado es una web que se reconoce como tuya y que guía al visitante hacia lo que de verdad importa: contactar, pedir presupuesto o comprar.",
        ],
      },
      {
        h2: "Desarrollo web con base técnica sólida",
        paragraphs: [
          "Desarrollamos con código limpio y mantenible sobre tecnologías modernas. Eso se traduce en páginas que cargan rápido, funcionan en cualquier dispositivo y no se rompen cuando quieres añadir una sección nueva dentro de seis meses.",
          "La estructura técnica se piensa desde el principio para el posicionamiento: encabezados con sentido, HTML semántico, datos estructurados y URLs limpias.",
        ],
      },
      {
        h2: "Páginas web para empresas que quieren captar clientes",
        paragraphs: [
          "Una web corporativa no es un folleto. Ordenamos el contenido según cómo busca y decide tu cliente, para que cada página tenga un propósito claro y una llamada a la acción evidente.",
        ],
      },
    ],
    deliverables: [
      {
        title: "Diseño responsive",
        body: "Una sola web que funciona igual de bien en móvil, tablet y escritorio.",
      },
      {
        title: "Rendimiento desde el diseño",
        body: "Optimización de imágenes, fuentes y carga para no sacrificar velocidad por estética.",
      },
      {
        title: "Accesibilidad",
        body: "Contraste, navegación por teclado y HTML semántico, que además ayuda al posicionamiento.",
      },
      {
        title: "Base SEO incluida",
        body: "Metadatos, sitemap, datos estructurados y una arquitectura pensada para indexar.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto tarda el desarrollo de una página web?",
        a: "Depende del alcance. Una web corporativa de pocas páginas suele llevar algunas semanas, mientras que un proyecto con más secciones o funcionalidades a medida necesita más tiempo. Te damos un plazo concreto tras la primera conversación, cuando sabemos qué necesitas exactamente.",
      },
      {
        q: "¿Puedo actualizar el contenido yo mismo?",
        a: "Sí. Adaptamos la solución a tu forma de trabajar: desde una web donde los cambios los hacemos nosotros hasta un gestor de contenidos para que edites textos e imágenes por tu cuenta.",
      },
      {
        q: "¿La web incluye posicionamiento SEO?",
        a: "Todo desarrollo incluye la base técnica de SEO: estructura de encabezados, metadatos, velocidad, datos estructurados y sitemap. El trabajo continuado de posicionamiento y contenidos es un servicio aparte.",
      },
    ],
  },
  {
    slug: "optimizacion-web",
    index: "02",
    title: "Optimización y mejoras",
    body: "Auditamos y afinamos tu web actual: velocidad, Core Web Vitals, accesibilidad y conversión. Más rendimiento, menos fricción.",
    metaTitle: "Optimización web: velocidad y rendimiento",
    metaDescription:
      "Optimización web y mejora de páginas existentes: velocidad de carga, Core Web Vitals, accesibilidad y conversión. Auditamos tu web y aplicamos las mejoras.",
    h1: "Optimización web y mejora de rendimiento",
    intro:
      "Si ya tienes una web pero va lenta, no convierte o ha ido acumulando parches, no siempre hace falta rehacerla. Auditamos qué falla y aplicamos las mejoras que más impacto tienen.",
    sections: [
      {
        h2: "Mejorar la velocidad de carga",
        paragraphs: [
          "La velocidad es de las pocas cosas que afectan a la vez a la experiencia del usuario y al posicionamiento. Analizamos qué está frenando tu web —imágenes sin optimizar, scripts que bloquean el renderizado, fuentes mal cargadas, exceso de plugins— y lo corregimos.",
        ],
      },
      {
        h2: "Core Web Vitals",
        paragraphs: [
          "Google mide la experiencia real de tus visitantes con las Core Web Vitals: LCP (cuánto tarda en verse el contenido principal), CLS (si los elementos bailan mientras carga) e INP (si responde rápido al interactuar).",
          "Trabajamos esas tres métricas sobre datos concretos, no a ojo, para que dejen de ser un aviso en Search Console.",
        ],
      },
      {
        h2: "Optimización SEO on-page de lo que ya tienes",
        paragraphs: [
          "Muchas webs tienen contenido válido mal aprovechado: títulos duplicados, encabezados sin jerarquía, páginas huérfanas o metadatos vacíos. Ordenar eso suele dar resultados antes que crear contenido nuevo.",
        ],
      },
    ],
    deliverables: [
      {
        title: "Auditoría de rendimiento",
        body: "Diagnóstico con los cuellos de botella reales y su impacto, priorizados.",
      },
      {
        title: "Optimización técnica",
        body: "Imágenes, caché, scripts, fuentes y todo lo que retrasa la primera carga.",
      },
      {
        title: "Revisión on-page",
        body: "Títulos, descripciones, encabezados y enlaces internos puestos en orden.",
      },
      {
        title: "Medición posterior",
        body: "Comparativa antes y después para ver qué ha cambiado de verdad.",
      },
    ],
    faqs: [
      {
        q: "¿Merece la pena optimizar o es mejor rehacer la web?",
        a: "Depende del estado de la base técnica. Si la estructura es razonable, optimizar es más rápido y más barato. Si arrastra problemas de fondo, rehacerla sale mejor a medio plazo. Te lo decimos con franqueza después de auditarla, aunque la respuesta sea que no necesitas contratarnos.",
      },
      {
        q: "¿Qué es una buena puntuación de PageSpeed?",
        a: "Por encima de 90 en móvil se considera bueno, pero la puntuación es solo un indicador. Lo que Google usa para posicionar son los datos de usuarios reales de las Core Web Vitals, así que trabajamos sobre esas métricas más que sobre el número del test.",
      },
      {
        q: "¿Trabajáis sobre WordPress u otras plataformas?",
        a: "Sí. La optimización parte de un diagnóstico, y buena parte de las mejoras —imágenes, caché, scripts, estructura y contenido— se aplican en cualquier plataforma.",
      },
    ],
  },
  {
    slug: "seo",
    index: "03",
    title: "Posicionamiento SEO",
    body: "Estrategia SEO técnica y de contenidos para escalar posiciones en Google y atraer tráfico que realmente importa a tu negocio.",
    metaTitle: "Posicionamiento SEO para empresas",
    metaDescription:
      "Agencia de posicionamiento SEO. Estrategia técnica y de contenidos para mejorar tu visibilidad en Google y atraer tráfico que se convierte en clientes.",
    h1: "Posicionamiento SEO y visibilidad en Google",
    intro:
      "El posicionamiento web no es magia ni un truco puntual: es ordenar lo técnico, responder a lo que busca tu cliente y sostenerlo en el tiempo. Trabajamos las tres cosas.",
    sections: [
      {
        h2: "SEO técnico",
        paragraphs: [
          "Antes de escribir una sola palabra, tu web tiene que poder rastrearse e indexarse sin obstáculos. Revisamos arquitectura, velocidad, datos estructurados, enlazado interno, canonicals y todo lo que impide que Google entienda tu sitio.",
          "Es la parte menos visible del posicionamiento y, con diferencia, la que más veces está rota.",
        ],
      },
      {
        h2: "Contenido que responde a una intención de búsqueda",
        paragraphs: [
          "Cada página debe existir por un motivo y responder a una búsqueda concreta. Estudiamos qué busca tu cliente y con qué palabras, y ordenamos el contenido para cubrir esas intenciones sin canibalizar una página con otra.",
        ],
      },
      {
        h2: "SEO para empresas, medido",
        paragraphs: [
          "El posicionamiento en Google se mide: posiciones, impresiones, clics y, sobre todo, si eso acaba en contactos. Trabajamos con Search Console y analítica para saber qué está funcionando en lugar de suponerlo.",
        ],
      },
    ],
    deliverables: [
      {
        title: "Auditoría SEO",
        body: "Estado técnico, contenido y visibilidad actual, con acciones priorizadas.",
      },
      {
        title: "Estudio de palabras clave",
        body: "Qué busca tu cliente, con qué intención y con qué competencia.",
      },
      {
        title: "Optimización on-page",
        body: "Títulos, encabezados, contenido, enlazado interno y datos estructurados.",
      },
      {
        title: "Seguimiento",
        body: "Search Console y analítica para medir la evolución mes a mes.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto tarda en verse el resultado del SEO?",
        a: "Las mejoras técnicas y de indexación pueden notarse en semanas. Ganar posiciones en búsquedas competidas suele llevar varios meses de trabajo sostenido. Cualquiera que te prometa el primer puesto en dos semanas te está vendiendo humo.",
      },
      {
        q: "¿Podéis garantizar la primera posición en Google?",
        a: "No, y desconfía de quien lo garantice: nadie controla el algoritmo de Google. Lo que sí podemos es trabajar todos los factores que dependen de tu web y medir la evolución con datos.",
      },
      {
        q: "¿Qué diferencia hay entre SEO y SEM?",
        a: "El SEO trabaja los resultados orgánicos, que no se pagan por clic y mantienen su efecto en el tiempo. El SEM son anuncios de pago: aparecen de inmediato, pero dejan de mostrarse cuando paras la inversión.",
      },
    ],
  },
  {
    slug: "indexacion-google",
    index: "04",
    title: "Indexación y presencia",
    body: "Nos aseguramos de que los buscadores te encuentren e indexen: datos estructurados, sitemaps y una visibilidad medible.",
    metaTitle: "Indexación en Google: si tu web no aparece",
    metaDescription:
      "¿Google no indexa tu web o no apareces al buscarte? Diagnosticamos y resolvemos los problemas de indexación para que tu página web aparezca en los resultados.",
    h1: "Indexación en Google: haz que tu web aparezca",
    intro:
      "Si tu web no aparece en Google, el problema casi nunca es el diseño: es que Google no la ha rastreado, no la ha indexado o no la considera relevante. Son tres cosas distintas y se resuelven de forma distinta.",
    sections: [
      {
        h2: "Por qué Google no indexa tu web",
        paragraphs: [
          "Las causas más habituales son concretas y tienen solución: una etiqueta noindex olvidada tras el lanzamiento, un robots.txt que bloquea el rastreo, canonicals mal apuntados, contenido que depende de JavaScript para existir, páginas huérfanas sin ningún enlace o, sencillamente, una web demasiado nueva.",
          "El primer paso siempre es el mismo: comprobar en Search Console qué dice Google exactamente sobre esa URL, en lugar de suponer.",
        ],
      },
      {
        h2: "Rastreo, indexación y posicionamiento no son lo mismo",
        paragraphs: [
          "Rastrear es que Google entre a leer la página. Indexar es que decida guardarla en su índice. Posicionar es que la muestre bien colocada para una búsqueda. Puedes estar indexado y aun así no aparecer, y confundir estas fases lleva a atacar el problema equivocado.",
        ],
      },
      {
        h2: "Qué hacemos para resolverlo",
        paragraphs: [
          "Revisamos la configuración de rastreo e indexación, corregimos lo que bloquea, generamos un sitemap correcto, arreglamos el enlazado interno para que no queden páginas aisladas y solicitamos la indexación de las URLs afectadas.",
        ],
      },
    ],
    deliverables: [
      {
        title: "Diagnóstico de indexación",
        body: "Qué páginas están indexadas, cuáles no y por qué motivo concreto.",
      },
      {
        title: "Corrección técnica",
        body: "robots.txt, etiquetas noindex, canonicals y redirecciones mal configuradas.",
      },
      {
        title: "Sitemap y datos estructurados",
        body: "Sitemap válido y marcado schema.org para que Google entienda el contenido.",
      },
      {
        title: "Search Console",
        body: "Configuración, verificación del dominio y seguimiento de la cobertura.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto tarda Google en indexar una web nueva?",
        a: "Puede ir de unos días a varias semanas. Con el sitio verificado en Search Console, un sitemap enviado y algún enlace entrante, el proceso suele acelerarse bastante.",
      },
      {
        q: "¿Por qué mi web no aparece si busco su nombre?",
        a: "Lo más habitual es que aún no esté indexada, que haya una etiqueta noindex activa o que el robots.txt bloquee el rastreo. Buscando site:tudominio.com puedes ver rápidamente si Google tiene alguna página tuya en su índice.",
      },
      {
        q: "¿Sirve de algo pedir la indexación manualmente?",
        a: "Ayuda a que Google revise antes esa URL, pero no garantiza que la indexe. Si hay un problema técnico de fondo o el contenido no aporta valor, seguirá sin indexarse por mucho que lo solicites.",
      },
    ],
  },
];

/** Card/nav view of the services used on the homepage. */
export const services = servicePages.map((s) => ({
  id: s.slug,
  href: `/${s.slug}`,
  index: s.index,
  title: s.title,
  body: s.body,
}));

export const getServiceBySlug = (slug: string) =>
  servicePages.find((s) => s.slug === slug);
