export type PaymentGatewayId = 'stripe' | 'mercadopago' | 'lemonsqueezy' | 'sandbox';

export type OrderStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderRecord {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  status: OrderStatus;
  verificationToken: string;
  gateway: PaymentGatewayId;
  gatewayTransactionId?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface CreatePaymentSessionRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planId: string;
  includeUpsell: boolean;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  gateway: PaymentGatewayId;
  orderId: string;
  verificationToken: string;
  isSandbox: boolean;
}

export interface WebhookPayload {
  gateway: PaymentGatewayId;
  eventId: string;
  rawBody: string;
  signature?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderId?: string;
  transactionId?: string;
  status?: OrderStatus;
  isDuplicate?: boolean;
  errorMessage?: string;
}

export interface PaymentGatewayProvider {
  id: PaymentGatewayId;
  name: string;
  isConfigured(): boolean;
  createCheckoutSession(request: CreatePaymentSessionRequest): Promise<PaymentSessionResponse>;
  verifyWebhook(payload: WebhookPayload): Promise<WebhookVerificationResult>;
}
