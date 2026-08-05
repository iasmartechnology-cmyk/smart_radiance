import type { MethodologyStep } from "@/types";

export const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    title: "Análisis y Diagnóstico",
    description:
      "Auditamos tus procesos actuales para identificar cuellos de botella y oportunidades de automatización.",
  },
  {
    title: "Estrategia Digital",
    description:
      "Diseñamos una arquitectura a medida, seleccionando las herramientas óptimas para tu ecosistema.",
  },
  {
    title: "Desarrollo e Implementación",
    description:
      "Construimos e integramos las soluciones con metodologías ágiles, asegurando calidad en cada fase.",
  },
  {
    title: "Optimización Continua",
    description:
      "Monitorizamos el rendimiento y ajustamos los sistemas para escalar junto con tu negocio.",
  },
] as const;
