import {
  Bot,
  Blocks,
  Code2,
  MessageSquareText,
  Palette,
  Radar,
  Search,
  Workflow,
} from "lucide-react";
import type { Service } from "@/types";

export const SERVICES: Service[] = [
  {
    title: "Desarrollo Web Profesional",
    description:
      "Diseño premium y arquitectura escalable para una presencia digital que convierte.",
    icon: Code2,
  },
  {
    title: "Optimización SEO",
    description:
      "Posicionamiento estratégico para captar tráfico de alto valor y máxima relevancia.",
    icon: Search,
  },
  {
    title: "Indexación en Google",
    description:
      "Aseguramos la máxima visibilidad en los motores de búsqueda desde el primer día.",
    icon: Radar,
  },
  {
    title: "Rediseño y mejora web",
    description:
      "Modernizamos tu interfaz para mejorar la conversión, la retención y la experiencia.",
    icon: Palette,
  },
  {
    title: "Automatización de procesos",
    description:
      "Eliminamos tareas repetitivas y conectamos tus operaciones para trabajar más rápido.",
    icon: Workflow,
  },
  {
    title: "Agentes inteligentes",
    description:
      "Asistentes impulsados por IA que analizan, deciden y actúan por tu negocio.",
    icon: Bot,
  },
  {
    title: "Integraciones entre aplicaciones",
    description:
      "Unificamos tu ecosistema de herramientas en un flujo de trabajo sin fricciones.",
    icon: Blocks,
  },
  {
    title: "Chatbots empresariales",
    description:
      "Atención al cliente automatizada, inteligente y disponible las 24 horas del día.",
    icon: MessageSquareText,
  },
] as const;
