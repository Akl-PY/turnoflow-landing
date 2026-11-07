# CLAUDE.md — Directrices de Desarrollo para Claude Code

Este archivo contiene la guía de trabajo y comandos esenciales para operar en el proyecto **TurnoFlow AI — Landing & Sales Funnel** dentro de `/landing`.

---

## 1. COMANDOS CLAVE

```bash
# Navegar a la carpeta del proyecto
cd landing

# Iniciar servidor web de desarrollo
npm run web

# Iniciar Expo general
npx expo start

# Comprobación de tipos TypeScript
npx tsc --noEmit

# Ejecución de auditoría de paquetes
npm audit
```

---

## 2. REGLAS PRINCIPALES DE DESARROLLO

1. **Directorio de Trabajo:**
   - Trabaja exclusivamente en `/landing`.
   - No toques archivos fuera de este directorio.

2. **Stack Tecnológico:**
   - Expo SDK 58 (React Native Web + Expo Router).
   - TypeScript en modo estricto.
   - Lucide Icons (`lucide-react-native`).
   - TanStack React Query.
   - Zod para validaciones de formularios y API.

3. **Seguridad de Credenciales:**
   - NUNCA expongas claves de API (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, etc.) en variables `EXPO_PUBLIC_*`.
   - Las claves pertenecen exclusivamente al entorno de servidor (`getServerEnv()` en `src/config/env.ts`).
   - Ante la ausencia de claves, el sistema debe caer elegantemente en los adaptadores Mock y Sandbox claramente identificados.

4. **Integridad del Asistente Comercial IA (`TurnoFlow Sales Assistant`):**
   - El asistente comercial de los visitantes opera bajo reglas de veracidad estrictas: jamás inventar funciones ni precios.
   - No permitir que el modelo confirme compras por su cuenta; las compras se validan por webhook o servicio de verificación con token.

5. **Diseño Visual:**
   - Estilo premium SaaS inspirado en Linear, Stripe y Framer.
   - Usar tokens de `src/styles/theme.ts`.
   - Soporte responsive fluido para web desktop y mobile.
