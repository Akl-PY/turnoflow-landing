# GEMINI.md — Directrices de Desarrollo para Google Antigravity & Gemini Agents

Guía técnica y estándares de implementación para agentes basados en modelos Gemini y Google Antigravity que operen sobre **TurnoFlow AI — Landing & Sales Funnel**.

---

## 1. MISIÓN Y CONTEXTO DEL PROYECTO

TurnoFlow AI es una solución de Recepción Inteligente 24/7 para centros de estética, salones de belleza, estudios de uñas y depilación. Su propuesta de valor es eliminar la pérdida de clientas por demoras en la respuesta de WhatsApp, clasificar interesadas y gestionar turnos con seña.

---

## 2. DIRECTRICES DE ARQUITECTURA

- **Ubicación:** Todo el trabajo debe confinarse a `/landing`.
- **Rutas Principales (Expo Router):**
  - `/` (Landing principal con 12 secciones estratégicas).
  - `/free-guide` (Lead Magnet: 15 respuestas de WhatsApp con validación Zod y entrega inmediata).
  - `/sales` (Carta de ventas y comparativa exhaustiva).
  - `/checkout` (Checkout con selección de pasarela: Stripe, Mercado Pago, Lemon Squeezy, Sandbox).
  - `/thank-you` (Confirmación protegida por token de verificación).
  - `/download` (Área de descarga de archivos con verificación de compra).
  - `/privacy` y `/terms` (Términos legales y privacidad conforme a estándares internacionales).

---

## 3. ABSTRACCIÓN DE MODELOS DE IA

- `src/services/ai/types.ts`: Interfaz común `AiModelProvider`.
- Proveedores soportados:
  - `AnthropicClaudeProvider` (`claude-3-5-sonnet-20241022`, `claude-3-haiku-20240307`).
  - `OpenAiModelProvider` (`gpt-4o`, `gpt-4o-mini`).
  - `MockSalesAssistantProvider` (Simulador de alta fidelidad claramente etiquetado como `[Modo Simulación / Mock Assistant]`).
- Selección configurable vía variables de entorno (`AI_PROVIDER`, `AI_MODEL`).

---

## 4. SISTEMA DE SEGURIDAD Y VERIFICACIÓN DE PAGOS

- Nunca desbloquear `/thank-you` ni `/download` sin un token de verificación emitido tras el webhook o validación del pago.
- Idempotencia: Los eventos de webhook se protegen contra llamadas duplicadas mediante el registro de `eventId`.

---

## 5. COMANDOS DE COMPROBACIÓN

```bash
cd landing
npx tsc --noEmit
npm run web
```
