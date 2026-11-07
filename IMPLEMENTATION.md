# IMPLEMENTATION.md — Documentación Técnica de Implementación

Este documento detalla la arquitectura técnica, flujo de datos y decisiones de diseño implementadas para el funnel comercial de **TurnoFlow AI**.

---

## 1. ARQUITECTURA GENERAL

```
landing/
├── app/                          # Enrutamiento basado en archivos (Expo Router)
│   ├── _layout.tsx               # Root layout con Provider, Analytics, Navbar, Chat y Footer
│   ├── index.tsx                 # Landing Principal (12 secciones)
│   ├── free-guide.tsx            # Lead Magnet (Captación y descarga directa)
│   ├── sales.tsx                 # Carta de ventas detallada y comparativa
│   ├── checkout.tsx              # Checkout seguro y selector de pasarela
│   ├── thank-you.tsx             # Verificación de pago por token
│   ├── download.tsx              # Descarga de archivos protegida
│   ├── privacy.tsx               # Política de privacidad
│   └── terms.tsx                 # Términos y condiciones
├── src/
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, Container responsivo
│   │   ├── landing/              # Secciones modulares de la landing
│   │   ├── ai-agent/             # Chat flotante, burbujas y chips
│   │   ├── ui/                   # Button, Input, Card, Badge, Accordion
│   │   └── analytics/            # CookieConsentBanner
│   ├── services/
│   │   ├── ai/                   # Multi-proveedor de IA, herramientas y asistente
│   │   ├── payments/             # Pasarelas (Stripe, MP, LemonSqueezy, Sandbox) y verificación
│   │   ├── leads/                # Registro y deduplicación de leads
│   │   └── analytics/            # Despacho de eventos y cargadores de píxeles
│   ├── config/                   # Precios, textos, FAQ y variables de entorno
│   ├── validations/              # Esquemas de validación Zod
│   └── styles/                   # Tokens de diseño (Colores, espaciados, sombras)
├── AGENTS.md                     # Guía multi-agente
├── CLAUDE.md                     # Guía para Claude Code
├── GEMINI.md                     # Guía para Google Antigravity / Gemini
├── README.md                     # Inicio rápido y comandos
├── ENV.example                   # Variables de entorno modelo
├── IMPLEMENTATION.md             # Esta documentación
└── DEPLOYMENT.md                 # Guía de despliegue en producción
```

---

## 2. FLUJO DE CONVERSIÓN Y DATOS

### 2.1 Lead Magnet (`/free-guide`)
1. El usuario ingresa a `/free-guide`. Se dispara el evento `lead_magnet_view`.
2. Completa nombre, email, WhatsApp opcional y acepta términos.
3. Validación estricta en el cliente mediante `LeadCaptureSchema` (Zod).
4. `leadStorage.registerLead`:
   - Verifica si el email ya existe en memoria/almacenamiento local.
   - Si no existe, genera un `leadId` único con timestamp.
   - Dispara `lead_captured`.
5. Se muestra inmediatamente el botón de descarga directa del PDF y la oferta especial del producto principal ($49 USD).

### 2.2 Proceso de Compra & Verificación (`/checkout` -> `/thank-you` -> `/download`)
1. El usuario selecciona el plan en `/checkout` ($49 USD) y opta opcionalmente por la implementación personalizada ($249 USD).
2. Se selecciona la pasarela de pago (Stripe, Mercado Pago, Lemon Squeezy o Sandbox).
3. Se invoca `paymentRegistry.getProvider().createCheckoutSession()`:
   - Se crea una orden con estado `pending` y un `verificationToken` criptográficamente seguro (`vtok_...`).
4. Cuando el pago se procesa o se aprueba en el webhook / simulador:
   - El estado de la orden cambia a `verified`.
   - Se redirecciona a `/thank-you?token=vtok_...`.
5. La vista `/thank-you` ejecuta `paymentVerification.verifyToken(token)`:
   - Si el token no existe o la orden está `pending`/`failed`, bloquea el acceso con un mensaje de alerta.
   - Si el token está `verified`, muestra el resumen del pedido y el botón hacia `/download?token=vtok_...`.
6. En `/download`, se vuelve a verificar el token antes de exponer los paquetes de descarga.

---

## 3. ARQUITECTURA DEL ASISTENTE COMERCIAL IA

### 3.1 Interfaz Común (`AiModelProvider`)
Permite cambiar el motor de IA en caliente sin tocar la interfaz gráfica:
- `complete(request: AiCompletionRequest): Promise<AiCompletionResponse>`

### 3.2 Registro y Fallback Transparente
Si `AI_PROVIDER=anthropic` o `AI_MODEL=openai` no tienen las claves API del servidor cargadas en el entorno, `aiRegistry.getActiveProvider()` cae automáticamente en `MockSalesAssistantProvider`.
El mock se identifica abiertamente con el prefijo `[Modo Simulación / Asistente TurnoFlow]` y ejecuta las 8 herramientas comerciales para responder fielmente a los precios, dudas y demostraciones.

### 3.3 Herramientas Estructuradas (`AgentToolsExecutor`)
- `get_product_information`: Responde con el catálogo y entregables oficiales de `siteConfig`.
- `get_pricing`: Devuelve el precio oficial de lanzamiento ($49 USD) y el upsell ($249 USD).
- `get_faq`: Busca en la lista de preguntas frecuentes curadas en `faqData.ts`.
- `qualify_lead`: Evalúa el perfil de estética y responde si aplica a TurnoFlow.
- `capture_lead`: Almacena el lead directamente en `leadStorage`.
- `recommend_resource`: Recomienda el recetario gratuito cuando el usuario no está listo para comprar.
- `create_checkout_session`: Genera la orden pendiente y provee el enlace seguro.
- `handoff_to_human`: Deriva la conversación con un enlace directo a WhatsApp.

---

## 4. MEDIDAS DE SEGURIDAD

- **Aislamiento de credenciales:** Ninguna clave privada de Stripe, Mercado Pago, Anthropic u OpenAI utiliza el prefijo `EXPO_PUBLIC_`.
- **Filtros contra Prompt Injections:** Sanitización con patrones regex para comandos de jailbreak o intentos de eludir instrucciones comerciales.
- **Idempotencia de Webhooks:** El servicio de pagos registra los IDs de eventos procesados para prevenir procesamientos duplicados.
- **Consentimiento de Cookies:** El banner de analítica almacena la preferencia del usuario y desactiva el rastreo de Google Analytics y Meta Pixel si el usuario lo rechaza.
