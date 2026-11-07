# TURNOfLOW AI — AGENTS & MULTI-AGENT DEVELOPMENT ARCHITECTURE

Este documento define la arquitectura, normas operativas y especialización de agentes de IA para el desarrollo y mantenimiento continuo de **TurnoFlow AI — Landing & Sales Funnel** dentro de `/landing`.

---

## 1. EQUIPO DE AGENTES DE DESARROLLO

Los agentes de desarrollo colaboran de forma modular para expandir y perfeccionar el funnel comercial:

### 1.1 UI/UX Agent
- **Rol:** Diseñador y desarrollador de interfaces visuales de alta fidelidad.
- **Responsabilidades:**
  - Preservar el lenguaje visual minimalista y premium inspirado en Stripe, Linear y Framer.
  - Diseñar componentes reutilizables con soporte web nativo y adaptable a iOS/Android.
  - Asegurar tipografía clara, espaciado generoso, paleta coherente (`src/styles/theme.ts`) y jerarquía visual.
  - Validar responsiveness en resoluciones mobile (< 768px), tablet y desktop.

### 1.2 CRO & Copy Agent (Conversion Rate Optimization)
- **Rol:** Especialista en psicología de compra, respuesta directa y optimización de conversión.
- **Responsabilidades:**
  - Optimizar llamadas a la acción (CTAs), encabezados y microcopias comerciales.
  - Mejorar el lead magnet (`/free-guide`) y el ratio de conversión visitante-a-lead.
  - Reducir fricción en la página de checkout (`/checkout`) y optimizar el ticket medio con el upsell ($249 USD).
  - Prevenir afirmaciones falsas, estadísticas no fundamentadas o testimonios ficticios.

### 1.3 AI Integration Agent
- **Rol:** Arquitecto de integraciones de modelos de lenguaje e inferencia.
- **Responsabilidades:**
  - Mantener la abstracción multi-proveedor en `src/services/ai/` (Anthropic Claude, OpenAI, Mock).
  - Implementar streaming, control estricto de tokens, límites de tasa y sanitización anti-prompt-injection.
  - Garantizar que las claves API secretas permanezcan en el servidor y nunca se expongan en el cliente móvil/web.
  - Mantener actualizadas las 8 herramientas comerciales estructuradas del `TurnoFlow Sales Assistant`.

### 1.4 QA & Compliance Agent
- **Rol:** Ingeniero de calidad, pruebas y cumplimiento normativo.
- **Responsabilidades:**
  - Ejecutar verificación de tipos TypeScript (`npx tsc --noEmit`) y pruebas unitarias/E2E.
  - Validar que las rutas del funnel (`/`, `/free-guide`, `/sales`, `/checkout`, `/thank-you`, `/download`, `/privacy`, `/terms`) funcionen sin enlaces rotos ni desbordamientos visuales.
  - Verificar que ninguna página protegida (`/thank-you`, `/download`) sea accesible sin un token verificado legítimo.
  - Comprobar que el banner de cookies y consentimiento respete la privacidad del visitante.

---

## 2. REGLAS ARQUITECTURALES DEL PROYECTO

1. **Ubicación Exclusiva:** Todo el código del funnel reside exclusivamente dentro de `/landing`. No modificar `/product` ni rutas ajenas.
2. **Framework:** Expo SDK 58 + Expo Router (enrutamiento basado en archivos dentro de `app/`). No convertir a proyectos Vite o Next.js aislados.
3. **TypeScript Estricto:** Tipado riguroso, interfaces explícitas para modelos, proveedores y respuestas de API.
4. **Separación de Responsabilidades:**
   - `app/`: Enrutamiento y vistas principales del funnel.
   - `src/components/landing/`: Secciones de la landing principal y páginas de venta.
   - `src/components/ai-agent/`: Componentes del asistente de ventas flotante.
   - `src/components/ui/`: Componentes atómicos (Button, Input, Card, Badge, Accordion).
   - `src/services/ai/`: Proveedores, registro y ejecución de herramientas de IA.
   - `src/services/payments/`: Abstracción de pasarelas de pago y verificación por tokens.
   - `src/services/leads/`: Almacenamiento, deduplicación y captación de leads.
   - `src/services/analytics/`: Despacho de eventos (Pixel, GA4, locales) con consentimiento.
   - `src/validations/`: Esquemas de validación Zod.
   - `src/config/`: Constantes de oferta, precios, preguntas frecuentes y entorno.

---

## 3. CONVENCIONES DE CÓDIGO

- **Nomenclatura:** PascalCase para componentes (`HeroSection.tsx`), camelCase para utilidades y servicios (`leadStorageService.ts`).
- **Validaciones:** Toda entrada de usuario (leads, checkout, consultas) debe validarse con esquemas Zod en `src/validations/schemas.ts`.
- **Estilos:** Utilizar `StyleSheet.create` de React Native referenciando tokens desde `src/styles/theme.ts`.
- **Textos en Español:** Español neutro o rioplatense natural, empático y comercial ("Dejá de perder clientes...", "Implementá un sistema...").
- **Manejo de Errores:** Errores controlados con retroalimentación visual al usuario en lugar de alertas genéricas.
