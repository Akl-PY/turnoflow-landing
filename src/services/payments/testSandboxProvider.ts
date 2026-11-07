import { CreatePaymentSessionRequest, PaymentGatewayProvider, PaymentSessionResponse, WebhookPayload, WebhookVerificationResult } from './types';
import { paymentVerification } from './paymentVerificationService';

export class TestSandboxPaymentProvider implements PaymentGatewayProvider {
  public id = 'sandbox' as const;
  public name = 'Entorno de Pruebas (Sandbox)';

  public isConfigured(): boolean {
    return true;
  }

  public async createCheckoutSession(request: CreatePaymentSessionRequest): Promise<PaymentSessionResponse> {
    const { order, verificationToken } = paymentVerification.createOrderRecord({
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      includeUpsell: request.includeUpsell,
      gateway: 'sandbox',
    });

    // En sandbox, el pago se verifica para la simulación
    const transactionId = `txn_sim_${Date.now()}`;
    paymentVerification.confirmOrderPayment(order.orderId, transactionId);

    return {
      sessionId: `sess_sandbox_${Date.now()}`,
      checkoutUrl: `${request.successUrl}?token=${verificationToken}&sandbox=true`,
      gateway: 'sandbox',
      orderId: order.orderId,
      verificationToken,
      isSandbox: true,
    };
  }

  public async verifyWebhook(payload: WebhookPayload): Promise<WebhookVerificationResult> {
    if (paymentVerification.isWebhookProcessed(payload.eventId)) {
      return { isValid: true, isDuplicate: true };
    }

    try {
      const data = JSON.parse(payload.rawBody);
      if (data.orderId) {
        paymentVerification.confirmOrderPayment(data.orderId, `txn_sim_webhook_${Date.now()}`);
        paymentVerification.markWebhookProcessed(payload.eventId);
        return {
          isValid: true,
          orderId: data.orderId,
          status: 'verified',
        };
      }
      return { isValid: false, errorMessage: 'OrderId faltante en payload de simulación.' };
    } catch (err: any) {
      return { isValid: false, errorMessage: err.message };
    }
  }
}
