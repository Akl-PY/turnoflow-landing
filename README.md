# TurnoFlow AI — Landing Page & Sales Funnel

> **Recepción Inteligente 24/7 para Salones de Belleza, Centros de Estética, Estudios de Uñas y Depilación.**

TurnoFlow AI es un funnel comercial completo de alta conversión desarrollado con **Expo**, **React Native Web**, **Expo Router** y **TypeScript**. Incluye un asistente de ventas de IA conversacional integrado, simulación interactiva de WhatsApp, captación de leads con recurso gratuito, abstracción de pasarelas de pago (Stripe, Mercado Pago, Lemon Squeezy, Sandbox) y verificación de compras protegida por tokens.

---

## 🚀 Inicio Rápido (Web)

### 1. Requisitos Previos
- Node.js v18 o superior (probado en Node.js v24).
- npm o yarn.

### 2. Instalación de Dependencias
```bash
cd landing
npm install
```

### 3. Ejecutar en Modo Web
```bash
npm run web
```
La aplicación estará disponible en `http://localhost:8081`.

---

## 📱 Preparación para Android e iOS

El proyecto está construido 100% sobre componentes compatibles de React Native y Expo Router, lo que permite generar versiones nativas sin reescribir la aplicación.

### Ejecutar en Simulador / Dispositivo Móvil
```bash
# Iniciar servidor Metro con lector QR para Expo Go
npx expo start

# Ejecutar directamente en emulador Android
npm run android

# Ejecutar directamente en simulador iOS (requiere macOS y Xcode)
npm run ios
```

### Compilar para Producción Móvil (EAS Build)
```bash
# Instalar EAS CLI si aún no está instalado
npm install -g eas-cli

# Iniciar sesión en Expo
eas login

# Configurar el proyecto para compilaciones en la nube
eas build:configure

# Compilar para Android (APK o AAB)
eas build --platform android --profile production

# Compilar para iOS (IPA)
eas build --platform ios --profile production
```

---

## 🗺️ Estructura del Funnel y Rutas

| Ruta | Descripción | Propósito |
| :--- | :--- | :--- |
| `/` | Landing Principal | 12 secciones: Hero, Problemas, Costo de demora, Presentación, Demo interactiva, 3 pasos, Features, Qué incluye, Para quién es, Precio ($49 USD), FAQ y CTA final. |
| `/free-guide` | Lead Magnet | Captación del recurso gratuito: *"15 respuestas de WhatsApp para convertir consultas en turnos"*. Validación Zod, entrega inmediata en navegador y oferta especial (OTO). |
| `/sales` | Carta de Venta Completa | Argumentación comercial detallada, comparativa exhaustiva (Atención manual vs Bot genérico vs TurnoFlow AI) y llamado a la acción. |
| `/checkout` | Checkout Seguro | Selector de plan ($49 USD), upsell opcional de Implementación Personalizada (+$249 USD), selector de pasarela (Stripe, Mercado Pago, Lemon Squeezy, Sandbox) y validación de orden. |
| `/thank-you` | Confirmación Verificada | Verificación del token de compra en el servidor. Nunca concede acceso a usuarios que solo visiten la URL sin haber pagado. |
| `/download` | Área de Descargas | Entrega de archivos (Blueprints JSON, prompts del agente, manual de WhatsApp Cloud API, matriz CRM y tutoriales en video). |
| `/privacy` | Política de Privacidad | Cumplimiento de normas internacionales y GDPR. |
| `/terms` | Términos y Condiciones | Licencia de uso comercial y términos del servicio. |

---

## 🤖 Agente IA Comercial del Funnel (`TurnoFlow Sales Assistant`)

Ubicado en el chat flotante en la esquina inferior derecha.

### Características:
- **8 Herramientas Estructuradas:**
  1. `get_product_information`: Consulta de características y entregables.
  2. `get_pricing`: Consulta de valores de lanzamiento ($49 USD) y upsell ($249 USD).
  3. `get_faq`: Respuestas oficiales a dudas de instalación y WhatsApp.
  4. `qualify_lead`: Calificación de necesidades según el tipo de salón.
  5. `capture_lead`: Registro consentido de interesados.
  6. `recommend_resource`: Derivación al lead magnet gratuito.
  7. `create_checkout_session`: Generación de orden y enlace verificado.
  8. `handoff_to_human`: Transferencia directa a asesor por WhatsApp.
- **Multi-Proveedor de IA:**
  - `AnthropicClaudeProvider` (Claude 3.5 Sonnet / Haiku).
  - `OpenAiModelProvider` (GPT-4o / GPT-4o-mini).
  - `MockSalesAssistantProvider` (Simulador de alta fidelidad que funciona sin necesidad de claves externas).
- **Protección de Seguridad:**
  - Filtros contra inyección de prompts ("ignore previous instructions").
  - Límites de mensajes por sesión.
  - Claves privadas resguardadas en el servidor.

---

## 💳 Pasarelas de Pago y Entorno de Pruebas (Sandbox)

El sistema cuenta con una interfaz común de pasarelas (`PaymentGatewayProvider`):
- **Stripe:** Sesiones de Stripe Checkout y webhooks firmados.
- **Mercado Pago:** Preferencias de checkout y webhooks IPN.
- **Lemon Squeezy:** Checkouts oficiales y webhooks v1.
- **Sandbox Test Mode:** Permite probar el flujo de compra de principio a fin, emitiendo tokens de verificación reales para auditar `/thank-you` y `/download` sin cobrar cargos reales.

---

## 📊 Analítica y Privacidad

- Eventos estandarizados: `page_view`, `lead_magnet_view`, `lead_captured`, `sales_page_view`, `cta_clicked`, `checkout_started`, `purchase_completed`, `agent_opened`, `agent_conversation_started`, `agent_lead_captured`.
- Banner de consentimiento de cookies configurable.
- Conectores opcionales para **Google Analytics 4** y **Meta Pixel**.

---

## 🛠️ Comprobación y Calidad

```bash
# Comprobación de tipos TypeScript
npx tsc --noEmit
```
