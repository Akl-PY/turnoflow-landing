import { CreatePaymentSessionRequest, PaymentGatewayProvider, PaymentSessionResponse, WebhookPayload, WebhookVerificationResult } from './types';
import { getServerEnv } from '../../config/env';
import { paymentVerification } from './paymentVerificationService';

export class LemonSqueezyPaymentProvider implements PaymentGatewayProvider {
  public id = 'lemonsqueezy' as const;
  public name = 'Lemon Squeezy';

  public isConfigured(): boolean {
    const { lemonSqueezyApiKey } = getServerEnv();
    return Boolean(lemonSqueezyApiKey);
  }

  public async createCheckoutSession(request: CreatePaymentSessionRequest): Promise<PaymentSessionResponse> {
    const { order, verificationToken } = paymentVerification.createOrderRecord({
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      includeUpsell: request.includeUpsell,
      gateway: 'lemonsqueezy',
    });

    const { lemonSqueezyApiKey } = getServerEnv();

    if (!this.isConfigured() || !lemonSqueezyApiKey) {
      return {
        sessionId: `ls_mock_${Date.now()}`,
        checkoutUrl: `${request.successUrl}?token=${verificationToken}&simulated=true`,
        gateway: 'lemonsqueezy',
        orderId: order.orderId,
        verificationToken,
        isSandbox: true,
      };
    }

    try {
      // Lemon Squeezy API v1 checkouts
      const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${lemonSqueezyApiKey}`,
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: request.customerEmail,
                name: request.customerName,
                custom: {
                  order_id: order.orderId,
                  verification_token: verificationToken,
                },
              },
              product_options: {
                redirect_url: `${request.successUrl}?token=${verificationToken}`,
              },
            },
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.detail || 'Error en Lemon Squeezy API.');
      }

      return {
        sessionId: data.data.id,
        checkoutUrl: data.data.attributes.url,
        gateway: 'lemonsqueezy',
        orderId: order.orderId,
        verificationToken,
        isSandbox: false,
      };
    } catch (error: any) {
      console.error('[LemonSqueezy Error]', error);
      throw error;
    }
  }

  public async verifyWebhook(payload: WebhookPayload): Promise<WebhookVerificationResult> {
    if (paymentVerification.isWebhookProcessed(payload.eventId)) {
      return { isValid: true, isDuplicate: true };
    }

    try {
      const body = JSON.parse(payload.rawBody);
      const eventName = body.meta?.event_name;
      const customData = body.meta?.custom_data;

      if (eventName === 'order_created' && customData?.order_id) {
        paymentVerification.confirmOrderPayment(customData.order_id, String(body.data?.id));
        paymentVerification.markWebhookProcessed(payload.eventId);
        return {
          isValid: true,
          orderId: customData.order_id,
          status: 'verified',
        };
      }
      return { isValid: true, status: 'pending' };
    } catch (err: any) {
      return { isValid: false, errorMessage: err.message };
    }
  }
}
