import { CreatePaymentSessionRequest, PaymentGatewayProvider, PaymentSessionResponse, WebhookPayload, WebhookVerificationResult } from './types';
import { getServerEnv } from '../../config/env';
import { paymentVerification } from './paymentVerificationService';

export class StripePaymentProvider implements PaymentGatewayProvider {
  public id = 'stripe' as const;
  public name = 'Stripe';

  public isConfigured(): boolean {
    const { stripeSecretKey } = getServerEnv();
    return Boolean(stripeSecretKey && stripeSecretKey.startsWith('sk_'));
  }

  public async createCheckoutSession(request: CreatePaymentSessionRequest): Promise<PaymentSessionResponse> {
    const { order, verificationToken } = paymentVerification.createOrderRecord({
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      includeUpsell: request.includeUpsell,
      gateway: 'stripe',
    });

    const { stripeSecretKey } = getServerEnv();

    if (!this.isConfigured() || !stripeSecretKey) {
      // Si no están configuradas las credenciales del servidor, redirige a la simulación con token
      return {
        sessionId: `cs_mock_stripe_${Date.now()}`,
        checkoutUrl: `${request.successUrl}?token=${verificationToken}&simulated=true`,
        gateway: 'stripe',
        orderId: order.orderId,
        verificationToken,
        isSandbox: true,
      };
    }

    // Llamada oficial a Stripe Checkout API (ejecutable en servidor / backend)
    try {
      const line_items = order.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      }));

      const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          customer_email: request.customerEmail,
          client_reference_id: order.orderId,
          success_url: `${request.successUrl}?token=${verificationToken}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: request.cancelUrl,
          mode: 'payment',
          ...line_items.reduce((acc, item, idx) => {
            acc[`line_items[${idx}][price_data][currency]`] = 'usd';
            acc[`line_items[${idx}][price_data][product_data][name]`] = item.price_data.product_data.name;
            acc[`line_items[${idx}][price_data][unit_amount]`] = String(item.price_data.unit_amount);
            acc[`line_items[${idx}][quantity]`] = '1';
            return acc;
          }, {} as Record<string, string>),
        }),
      });

      const session = await res.json();
      if (!res.ok) {
        throw new Error(session.error?.message || 'Error comunicando con Stripe API.');
      }

      return {
        sessionId: session.id,
        checkoutUrl: session.url,
        gateway: 'stripe',
        orderId: order.orderId,
        verificationToken,
        isSandbox: false,
      };
    } catch (error: any) {
      console.error('[StripeProvider Error]', error);
      throw error;
    }
  }

  public async verifyWebhook(payload: WebhookPayload): Promise<WebhookVerificationResult> {
    if (paymentVerification.isWebhookProcessed(payload.eventId)) {
      return { isValid: true, isDuplicate: true };
    }

    const { stripeWebhookSecret } = getServerEnv();
    if (!stripeWebhookSecret) {
      return { isValid: false, errorMessage: 'STRIPE_WEBHOOK_SECRET no configurado en el servidor.' };
    }

    try {
      const event = JSON.parse(payload.rawBody);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.client_reference_id;
        if (orderId) {
          paymentVerification.confirmOrderPayment(orderId, session.payment_intent);
          paymentVerification.markWebhookProcessed(payload.eventId);
          return {
            isValid: true,
            orderId,
            transactionId: session.payment_intent,
            status: 'verified',
          };
        }
      }
      return { isValid: true, status: 'pending' };
    } catch (err: any) {
      return { isValid: false, errorMessage: err.message };
    }
  }
}
