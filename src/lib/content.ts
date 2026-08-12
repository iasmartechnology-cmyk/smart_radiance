/**
 * Editorial copy for Smart Radiance — kept out of the components.
 * The ascent metaphor runs through the page: every section is a stage of the
 * climb, ending at the summit. "Escalar" carries both meanings in Spanish —
 * to climb and to scale a business.
 */

export const services = [
  {
    id: "diseno-desarrollo",
    index: "01",
    title: "Diseño y desarrollo web",
    body: "Sitios a medida, rápidos y responsive. Del concepto al lanzamiento con código limpio y una experiencia cuidada en cada detalle.",
  },
  {
    id: "optimizacion",
    index: "02",
    title: "Optimización y mejoras",
    body: "Auditamos y afinamos tu web actual: velocidad, Core Web Vitals, accesibilidad y conversión. Más rendimiento, menos fricción.",
  },
  {
    id: "seo",
    index: "03",
    title: "Posicionamiento SEO",
    body: "Estrategia SEO técnica y de contenidos para escalar posiciones en Google y atraer tráfico que realmente importa a tu negocio.",
  },
  {
    id: "indexacion",
    index: "04",
    title: "Indexación y presencia",
    body: "Nos aseguramos de que los buscadores te encuentren e indexen: datos estructurados, sitemaps y una visibilidad medible.",
  },
] as const;

export const processSteps = [
  {
    index: "01",
    altitude: "Campo base",
    title: "Descubrimiento",
    body: "Estudiamos tu negocio, tus objetivos y a tu competencia para trazar la ruta de ascenso más directa.",
  },
  {
    index: "02",
    altitude: "Primer tramo",
    title: "Diseño",
    body: "Definimos la dirección artística y prototipamos una experiencia sobria, elegante y coherente con tu marca.",
  },
  {
    index: "03",
    altitude: "Pared",
    title: "Desarrollo",
    body: "Construimos con código rápido, accesible y mantenible, preparado para crecer al ritmo de tu negocio.",
  },
  {
    index: "04",
    altitude: "Cima",
    title: "Lanzamiento y SEO",
    body: "Publicamos, medimos y optimizamos para que tu visibilidad siga subiendo mes a mes.",
  },
] as const;

export const stats = [
  { value: "+90", label: "PageSpeed objetivo" },
  { value: "100%", label: "Responsive" },
  { value: "24 h", label: "Tiempo de respuesta" },
  { value: "1:1", label: "Trato directo" },
] as const;
