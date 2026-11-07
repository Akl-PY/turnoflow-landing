import { PaymentGatewayId, PaymentGatewayProvider } from './types';
import { StripePaymentProvider } from './stripeProvider';
import { MercadoPagoPaymentProvider } from './mercadoPagoProvider';
import { LemonSqueezyPaymentProvider } from './lemonSqueezyProvider';
import { TestSandboxPaymentProvider } from './testSandboxProvider';
import { clientEnv } from '../../config/env';

class PaymentGatewayRegistry {
  private providers: Map<PaymentGatewayId, PaymentGatewayProvider> = new Map();

  constructor() {
    this.register(new StripePaymentProvider());
    this.register(new MercadoPagoPaymentProvider());
    this.register(new LemonSqueezyPaymentProvider());
    this.register(new TestSandboxPaymentProvider());
  }

  public register(provider: PaymentGatewayProvider) {
    this.providers.set(provider.id, provider);
  }

  public getProvider(id?: PaymentGatewayId): PaymentGatewayProvider {
    const targetId = id || clientEnv.paymentGateway;
    const provider = this.providers.get(targetId);
    if (!provider) {
      console.warn(`Payment provider "${targetId}" no encontrado. Usando Sandbox.`);
      return this.providers.get('sandbox')!;
    }
    return provider;
  }

  public getAvailableGateways(): { id: PaymentGatewayId; name: string; isConfigured: boolean }[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
      isConfigured: p.isConfigured(),
    }));
  }
}

export const paymentRegistry = new PaymentGatewayRegistry();
