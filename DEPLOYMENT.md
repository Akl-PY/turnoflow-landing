# DEPLOYMENT.md — Guía de Despliegue en Producción

Instrucciones para desplegar **TurnoFlow AI — Landing & Sales Funnel** en entornos de producción web y móviles.

---

## 1. DESPLIEGUE WEB ESTÁTICO / SERVIDOR

### Opción A: Vercel / Netlify (Recomendado para Web)
1. Conectar el repositorio de Git.
2. Definir la raíz del proyecto en: `landing`.
3. Configurar el comando de compilación:
   ```bash
   npx expo export -p web
   ```
4. Configurar el directorio de salida (Output Directory):
   ```
   dist
   ```
5. Cargar las variables de entorno de producción desde el panel de Vercel/Netlify (ver `ENV.example`).

### Opción B: Exportación Estática Manual
```bash
cd landing
npx expo export -p web
```
Esto genera la carpeta `dist/` con todos los recursos estáticos HTML, JS y CSS optimizados para servir desde cualquier servidor Nginx, Apache o Cloudflare Pages.

---

## 2. CONFIGURACIÓN DE WEBHOOKS EN PRODUCCIÓN

Para procesar pagos reales y verificar compras automáticamente:

### Stripe Webhook
1. Ir al panel de Stripe -> Developers -> Webhooks.
2. Añadir endpoint: `https://tu-dominio.com/api/webhooks/stripe`.
3. Seleccionar evento: `checkout.session.completed`.
4. Copiar el `Signing secret` y pegarlo en `STRIPE_WEBHOOK_SECRET`.

### Mercado Pago Webhook (Notificaciones IPN)
1. Ir al panel de Mercado Pago Developers -> Webhooks.
2. Añadir URL: `https://tu-dominio.com/api/webhooks/mercadopago`.
3. Seleccionar evento: `Pagos (payment)`.
4. Configurar `MERCADOPAGO_ACCESS_TOKEN` con tu token de producción (`APP_USR-...`).

### Lemon Squeezy Webhook
1. Ir a Lemon Squeezy -> Settings -> Webhooks.
2. Añadir URL: `https://tu-dominio.com/api/webhooks/lemonsqueezy`.
3. Seleccionar evento: `order_created`.
4. Definir un secreto y pegarlo en `LEMON_SQUEEZY_WEBHOOK_SECRET`.

---

## 3. COMPILACIÓN DE APLICACIONES MÓVILES (EAS BUILD)

TurnoFlow AI utiliza componentes nativos y Expo Router compatibles con iOS y Android:

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Iniciar sesión
eas login

# 3. Compilar para Android (Genera archivo APK instalable o AAB para Google Play)
eas build --platform android --profile production

# 4. Compilar para iOS (Genera IPA para TestFlight o App Store)
eas build --platform ios --profile production
```

---

## 4. CHECKLIST PREVIO AL LANZAMIENTO

- [ ] Variables de entorno configuradas (`ENV.example`).
- [ ] Píxel de Meta y GA4 configurados con sus IDs reales.
- [ ] Modo Sandbox desactivado (`EXPO_PUBLIC_PAYMENT_SANDBOX=false`) en producción.
- [ ] Webhooks probados con transacciones de prueba de pasarela.
- [ ] Pruebas responsivas en dispositivos móviles reales y navegadores de escritorio.
- [ ] Verificación de enlaces a `/privacy` y `/terms`.
