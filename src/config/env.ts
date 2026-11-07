/**
 * Configuración de entorno de la aplicación.
 * Las claves secretas (ANTHROPIC_API_KEY, OPENAI_API_KEY, STRIPE_SECRET_KEY, MERCADOPAGO_ACCESS_TOKEN)
 * NUNCA se exponen al cliente móvil/web.
 */

export interface AppEnv {
  // Public client flags
  appName: string;
  appUrl: string;
  apiUrl: string;
  dashboardUrl: string;
  isProduction: boolean;

  // AI Configuration
  aiProvider: 'anthropic' | 'openai' | 'mock';
  aiModel: string;
  hasServerAiConfigured: boolean;

  // Payment Configuration
  paymentGateway: 'stripe' | 'mercadopago' | 'lemonsqueezy' | 'sandbox';
  isSandboxMode: boolean;

  // Analytics Configuration (Public IDs)
  metaPixelId?: string;
  googleAnalyticsId?: string;
}

const DEFAULT_PRODUCTION_DASHBOARD_URL = 'https://turnoflow-product-clientturnoflow-p.vercel.app';
const DEFAULT_PRODUCTION_API_URL =
  process.env.EXPO_PUBLIC_PRODUCTION_API_URL ||
  'https://turnoflowapi-production.up.railway.app';

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
}

function isProductionBrowserHost(): boolean {
  if (typeof window === 'undefined' || !window.location?.hostname) {
    return false;
  }
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
}

function resolveApiUrl(): string {
  const rawEnvUrl = process.env.EXPO_PUBLIC_API_URL || '';
  const configured = normalizeBaseUrl(rawEnvUrl);

  if (isProductionBrowserHost()) {
    // En navegador sobre un dominio productivo (*.vercel.app o distinto de localhost),
    // si la variable no está definida o apunta a localhost, usar la URL productiva del backend
    if (!configured || configured.includes('localhost') || configured.includes('127.0.0.1')) {
      return normalizeBaseUrl(DEFAULT_PRODUCTION_API_URL);
    }
    return configured;
  }

  return configured || 'http://localhost:3000';
}

function resolveDashboardUrl(): string {
  const configured = (process.env.EXPO_PUBLIC_DASHBOARD_URL || '').trim().replace(/\/+$/, '');
  if (isProductionBrowserHost()) {
    if (!configured || configured.includes('localhost') || configured.includes('127.0.0.1')) {
      return DEFAULT_PRODUCTION_DASHBOARD_URL;
    }
  }
  return configured || DEFAULT_PRODUCTION_DASHBOARD_URL;
}

// Client-safe configuration read from EXPO_PUBLIC_*
export const clientEnv: AppEnv = {
  appName: 'TurnoFlow AI',
  appUrl: process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081',
  apiUrl: resolveApiUrl(),
  dashboardUrl: resolveDashboardUrl(),
  isProduction: process.env.NODE_ENV === 'production' || isProductionBrowserHost(),

  aiProvider: (process.env.EXPO_PUBLIC_AI_PROVIDER as 'anthropic' | 'openai' | 'mock') || 'mock',
  aiModel: process.env.EXPO_PUBLIC_AI_MODEL || 'claude-3-5-sonnet-20241022',
  hasServerAiConfigured: false,

  paymentGateway: (process.env.EXPO_PUBLIC_PAYMENT_GATEWAY as 'stripe' | 'mercadopago' | 'lemonsqueezy' | 'sandbox') || 'sandbox',
  isSandboxMode: process.env.EXPO_PUBLIC_PAYMENT_SANDBOX !== 'false',

  metaPixelId: process.env.EXPO_PUBLIC_META_PIXEL_ID,
  googleAnalyticsId: process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID,
};

// Helper for server-only environment checking
export const getServerEnv = () => {
  return {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    mercadoPagoAccessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    lemonSqueezyApiKey: process.env.LEMON_SQUEEZY_API_KEY,
    lemonSqueezyWebhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
  };
};
