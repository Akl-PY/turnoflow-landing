import { CreatePaymentSessionRequest, PaymentGatewayProvider, PaymentSessionResponse, WebhookPayload, WebhookVerificationResult } from './types';
import { getServerEnv } from '../../config/env';
import { paymentVerification } from './paymentVerificationService';

export class MercadoPagoPaymentProvider implements PaymentGatewayProvider {
  public id = 'mercadopago' as const;
  public name = 'Mercado Pago';

  public isConfigured(): boolean {
    const { mercadoPagoAccessToken } = getServerEnv();
    return Boolean(mercadoPagoAccessToken && mercadoPagoAccessToken.startsWith('APP_USR-'));
  }

  public async createCheckoutSession(request: CreatePaymentSessionRequest): Promise<PaymentSessionResponse> {
    const { order, verificationToken } = paymentVerification.createOrderRecord({
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      includeUpsell: request.includeUpsell,
      gateway: 'mercadopago',
    });

    const { mercadoPagoAccessToken } = getServerEnv();

    if (!this.isConfigured() || !mercadoPagoAccessToken) {
      return {
        sessionId: `mp_pref_mock_${Date.now()}`,
        checkoutUrl: `${request.successUrl}?token=${verificationToken}&simulated=true`,
        gateway: 'mercadopago',
        orderId: order.orderId,
        verificationToken,
        isSandbox: true,
      };
    }

    try {
      const items = order.items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: 1,
        unit_price: item.price,
        currency_id: 'USD',
      }));

      const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mercadoPagoAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          payer: {
            name: request.customerName,
            email: request.customerEmail,
          },
          external_reference: order.orderId,
          back_urls: {
            success: `${request.successUrl}?token=${verificationToken}`,
            failure: request.cancelUrl,
            pending: request.cancelUrl,
          },
          auto_return: 'approved',
        }),
      });

      const preference = await res.json();
      if (!res.ok) {
        throw new Error(preference.message || 'Error en preferencia de Mercado Pago.');
      }

      return {
        sessionId: preference.id,
        checkoutUrl: preference.init_point,
        gateway: 'mercadopago',
        orderId: order.orderId,
        verificationToken,
        isSandbox: false,
      };
    } catch (error: any) {
      console.error('[MercadoPagoProvider Error]', error);
      throw error;
    }
  }

  public async verifyWebhook(payload: WebhookPayload): Promise<WebhookVerificationResult> {
    if (paymentVerification.isWebhookProcessed(payload.eventId)) {
      return { isValid: true, isDuplicate: true };
    }

    try {
      const body = JSON.parse(payload.rawBody);
      if (body.type === 'payment' && body.data?.id) {
        // En un entorno de backend real se consulta /v1/payments/{id}
        const paymentId = body.data.id;
        paymentVerification.markWebhookProcessed(payload.eventId);
        return {
          isValid: true,
          transactionId: String(paymentId),
          status: 'verified',
        };
      }
      return { isValid: true, status: 'pending' };
    } catch (err: any) {
      return { isValid: false, errorMessage: err.message };
    }
  }
}
