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

// Client-safe configuration read from EXPO_PUBLIC_*
export const clientEnv: AppEnv = {
  appName: 'TurnoFlow AI',
  appUrl: process.env.EXPO_PUBLIC_APP_URL || 'http://localhost:8081',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',

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
