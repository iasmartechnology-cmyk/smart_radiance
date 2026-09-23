/**
 * Editorial copy for Smart Radiance — kept out of the components.
 * The ascent metaphor runs through the page: every section is a stage of the
 * climb, ending at the summit. "Escalar" carries both meanings in Spanish —
 * to climb and to scale a business.
 */

// Services live in services.ts, which also drives the four service pages,
// the sitemap and the structured data. Re-exported here so the homepage
// sections keep a single import for their copy.
export { services } from "./services";

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

/**
 * Homepage "automatizaciones a medida" block. Each entry is a business type
 * with the automations that actually pay off for it — concrete examples rank
 * and convert better than a generic "automatizamos procesos".
 */
export const automationUseCases = [
  {
    sector: "Clínicas y centros de salud",
    body: "Citas y recordatorios automáticos por WhatsApp, confirmación de asistencia y respuestas a las dudas frecuentes de los pacientes.",
  },
  {
    sector: "Inmobiliarias",
    body: "Captación de leads desde portales y web, cualificación automática y alta en el CRM con seguimiento programado.",
  },
  {
    sector: "Restaurantes y hostelería",
    body: "Reservas conectadas a tu agenda, confirmaciones, gestión de reseñas y avisos al equipo sin llamadas ni libretas.",
  },
  {
    sector: "Comercios y e-commerce",
    body: "Pedidos, stock, facturas y seguimiento postventa sincronizados entre la tienda, el email y tu gestión interna.",
  },
  {
    sector: "Despachos y servicios profesionales",
    body: "Presupuestos, contratos y documentación generados a partir de un formulario, con recordatorios de cobro y seguimiento.",
  },
  {
    sector: "Academias y formación",
    body: "Inscripciones, pagos, accesos y comunicaciones con alumnos automatizados de principio a fin.",
  },
] as const;

export const automationSteps = [
  "Analizamos cómo trabaja tu negocio hoy",
  "Detectamos las tareas repetitivas que más tiempo cuestan",
  "Diseñamos y conectamos la automatización con tus herramientas",
  "Medimos las horas ahorradas y la ampliamos",
] as const;
