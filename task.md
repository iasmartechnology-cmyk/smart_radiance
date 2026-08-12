Quiero que trabajes sobre el proyecto que acabo de importar desde Google Stitch mediante MCP.

IMPORTANTE:
El proyecto de Stitch es la REFERENCIA VISUAL Y DE FRONTEND inicial, pero NO quiero que simplemente copies o mantengas su implementación.

Quiero que conviertas este diseño en una web profesional, dinámica, 3D y preparada para producción para mi agencia:

SMART RADIANCE

Dominio:
https://iaradiance.com

Email:
iasmartechnology@gmail.com

Teléfono:
627297958

==================================================
OBJETIVO
==================================================

Analiza primero TODO el proyecto importado desde Stitch.

Quiero transformar el frontend generado por Stitch en una experiencia web profesional utilizando:

- Next.js
- React
- TypeScript
- GSAP
- GSAP ScrollTrigger
- Three.js / React Three Fiber cuando aporte valor
- CSS/Tailwind según el stack existente
- SEO técnico
- responsive design
- accesibilidad
- optimización de rendimiento

El resultado debe ser una web de producción, no un prototipo.

==================================================
1. RESPETA EL DISEÑO DE STITCH
==================================================

Utiliza el proyecto importado como referencia principal para:

- layout
- composición
- colores
- tipografía
- jerarquía visual
- secciones
- componentes
- estilo
- branding
- espaciado
- dirección artística

NO cambies radicalmente el diseño sin una razón.

Sin embargo, si detectas partes del diseño que pueden mejorarse técnicamente o visualmente, puedes hacerlo.

La prioridad es:

DISEÑO DE STITCH
+
IMPLEMENTACIÓN PROFESIONAL
+
MEJOR UX
+
ANIMACIONES
+
3D
+
PERFORMANCE

==================================================
2. NO HAGAS UNA COPIA LITERAL
==================================================

No quiero simplemente:

"convertir el código de Stitch a Next.js".

Quiero que entiendas el diseño y lo reconstruyas correctamente.

Elimina:

- código innecesario
- componentes duplicados
- estilos redundantes
- código generado de forma poco mantenible
- dependencias innecesarias

Crea una arquitectura limpia y escalable.

==================================================
3. EXPERIENCIA 3D
==================================================

Quiero que la web sea realmente dinámica y tenga una experiencia 3D.

NO quiero simplemente poner un objeto 3D en el Hero.

El 3D debe formar parte del recorrido de la página.

La sensación debe ser:

SCROLL
↓
MOVIMIENTO
↓
CAMBIO DE ESCENA
↓
PROFUNDIDAD
↓
TRANSICIÓN
↓
NUEVA SECCIÓN

El usuario debe sentir que está recorriendo una experiencia digital.

Puedes utilizar:

- Three.js
- React Three Fiber
- Drei
- WebGL
- geometrías generativas
- partículas
- iluminación
- materiales
- profundidad
- cámara

No es obligatorio utilizar 3D en absolutamente todas las secciones.

Utilízalo donde tenga sentido.

==================================================
4. GSAP
==================================================

UTILIZA GSAP COMO SISTEMA PRINCIPAL DE ANIMACIÓN.

Si las GSAP skills están disponibles en el entorno, DEBES buscarlas, leerlas y seguir sus patrones recomendados antes de implementar las animaciones.

Utiliza cuando corresponda:

- useGSAP
- gsap.context
- timelines
- ScrollTrigger
- scrub
- stagger
- pin
- matchMedia
- parallax
- reveal animations

Las animaciones deben estar coordinadas.

NO quiero cientos de animaciones independientes.

Quiero un sistema de movimiento coherente.

==================================================
5. SCROLL EXPERIENCE
==================================================

El scroll debe controlar la narrativa visual.

Ejemplos:

Hero:

El objeto 3D aparece.

↓

El usuario comienza a hacer scroll.

↓

La cámara se acerca.

↓

El objeto cambia de posición/rotación.

↓

El contenido aparece.

↓

La escena transiciona.

↓

Aparecen los servicios.

↓

La cámara cambia de perspectiva.

↓

El usuario continúa el recorrido.

No hace falta implementar exactamente esta secuencia.

Utiliza criterio creativo.

==================================================
6. HERO
==================================================

Haz que el Hero sea el elemento más impactante.

Debe contener:

- headline
- descripción
- CTA principal
- CTA secundario si encaja
- elemento 3D
- profundidad
- iluminación
- animación de entrada

El Hero debe cargar rápido.

Si el 3D es pesado, utiliza carga diferida.

==================================================
7. SERVICIOS
==================================================

Smart Radiance ofrece:

1. Diseño y desarrollo web
2. Mejoras y optimización de webs existentes
3. Posicionamiento SEO
4. Indexación y mejora de presencia en buscadores

NO añadir como servicios:

- automatizaciones
- integraciones
- agentes
- chatbots
- servicios de IA

No quiero que la palabra "IA" domine la web.

La agencia debe posicionarse como una agencia especializada en:

WEB
SEO
OPTIMIZACIÓN
PRESENCIA DIGITAL

==================================================
8. IDENTIDAD
==================================================

La web puede tener una estética ligeramente oscura.

Pero debe mantenerse:

- elegante
- cálida
- sofisticada
- premium
- tecnológica

Evita:

- cyberpunk
- exceso de neón
- estética gamer
- robots
- cerebros
- circuitos
- clichés visuales de IA

==================================================
9. MICROINTERACCIONES
==================================================

Añade interacciones premium en:

- botones
- cards
- navegación
- enlaces
- elementos 3D
- CTA

Puedes utilizar:

- hover
- magnetic buttons
- subtle tilt
- cursor interaction
- parallax

Siempre de forma sutil.

==================================================
10. RESPONSIVE
==================================================

Debe funcionar perfectamente en:

- desktop
- laptop
- tablet
- móvil

En móvil:

- reduce partículas
- reduce complejidad 3D
- elimina mouse interaction
- simplifica parallax
- reduce movimientos de cámara
- utiliza versiones ligeras de las escenas

No fuerces los efectos de desktop en móvil.

Utiliza GSAP matchMedia cuando sea apropiado.

==================================================
11. REDUCED MOTION
==================================================

Respeta:

prefers-reduced-motion

Cuando esté activado:

- reduce animaciones
- elimina parallax innecesario
- reduce movimiento 3D
- mantiene la funcionalidad completa

==================================================
12. SEO
==================================================

Dominio:

https://iaradiance.com

Implementa correctamente:

- title
- description
- canonical
- Open Graph
- Twitter Cards
- sitemap.xml
- robots.txt
- structured data
- semantic HTML
- headings
- alt text
- internal linking

El contenido importante debe existir como HTML real.

NO dependas del canvas 3D para transmitir información importante.

==================================================
13. PERFORMANCE
==================================================

El 3D NO puede destruir el rendimiento.

Objetivos:

Performance >= 90
Accessibility >= 95
Best Practices >= 95
SEO = 100

Optimiza:

- LCP
- FCP
- CLS
- INP
- TBT

Utiliza:

- dynamic imports
- lazy loading
- Suspense
- code splitting
- next/image
- next/font

Limita:

- DPR
- partículas
- geometrías
- texturas

Evita render loops innecesarios.

==================================================
14. NEXT.JS
==================================================

Utiliza correctamente Server Components y Client Components.

NO conviertas toda la aplicación en:

"use client"

Aísla correctamente las partes que necesitan:

- GSAP
- ScrollTrigger
- WebGL
- Three.js
- interacción

==================================================
15. ARQUITECTURA
==================================================

Organiza el código de forma profesional.

Separar cuando corresponda:

components/
  3d/
  animations/
  sections/
  ui/

lib/
  animations/
  utils/

No crees componentes gigantes.

No dupliques lógica.

==================================================
16. GSAP CLEANUP
==================================================

Es obligatorio hacer cleanup correctamente.

No dejes:

- ScrollTriggers activos
- timelines sin destruir
- listeners sin cleanup
- memory leaks
- WebGL contexts innecesarios

Utiliza los patrones recomendados por las GSAP skills.

==================================================
17. VALIDACIÓN
==================================================

Después de implementar:

Ejecuta:

npm run lint

npm run build

Corrige todos los errores.

Comprueba:

- TypeScript
- hydration
- consola
- responsive
- GSAP
- ScrollTrigger
- Three.js
- WebGL
- SEO
- accesibilidad
- rendimiento

No consideres terminado el proyecto si el build falla.

==================================================
18. PROCESO
==================================================

Antes de escribir código:

1. Inspecciona completamente el proyecto importado.
2. Comprende la implementación actual de Stitch.
3. Analiza package.json.
4. Identifica el framework actual.
5. Identifica las dependencias.
6. Comprueba las GSAP skills disponibles.
7. Define la arquitectura final.
8. Define qué elementos serán 3D.
9. Define cómo se conectará el 3D con ScrollTrigger.
10. Define la estrategia de rendimiento.

Después implementa por fases.

FASE 1:
Limpieza y arquitectura.

FASE 2:
Adaptación del frontend de Stitch.

FASE 3:
Sistema GSAP.

FASE 4:
Experiencia 3D.

FASE 5:
Scroll-driven animations.

FASE 6:
Microinteracciones.

FASE 7:
Responsive.

FASE 8:
SEO y performance.

FASE 9:
Testing y limpieza final.

==================================================
REGLA FINAL
==================================================

No quiero una web que simplemente "tenga animaciones".

Quiero una experiencia.

El usuario debe sentir que al hacer scroll está recorriendo una historia visual.

El diseño de Stitch es la base.

Claude Code debe convertirlo en una implementación:

PROFESIONAL
+
ESCALABLE
+
3D
+
DINÁMICA
+
RÁPIDA
+
SEO FRIENDLY
+
PREPARADA PARA PRODUCCIÓN.

Empieza primero con el análisis completo del proyecto importado y las GSAP skills.

Después actualiza el plan y comienza la implementación.