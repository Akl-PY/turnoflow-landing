import { Platform } from 'react-native';
import { OrderRecord, OrderStatus, SaasCredentials, WebhookVerificationResult } from './types';
import { siteConfig } from '../../config/site';
import { clientEnv } from '../../config/env';

const ORDERS_KEY = 'turnoflow_orders_store';
const PROCESSED_WEBHOOKS_KEY = 'turnoflow_processed_webhooks';

class PaymentVerificationService {
  private orders: Map<string, OrderRecord> = new Map();
  private tokenToOrderId: Map<string, string> = new Map();
  private processedWebhookEvents: Set<string> = new Set();

  constructor() {
    this.hydrate();
  }

  private hydrate() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const rawOrders = localStorage.getItem(ORDERS_KEY);
        if (rawOrders) {
          const parsed: OrderRecord[] = JSON.parse(rawOrders);
          parsed.forEach((o) => {
            this.orders.set(o.orderId, o);
            this.tokenToOrderId.set(o.verificationToken, o.orderId);
          });
        }

        const rawWebhooks = localStorage.getItem(PROCESSED_WEBHOOKS_KEY);
        if (rawWebhooks) {
          const parsed: string[] = JSON.parse(rawWebhooks);
          parsed.forEach((id) => this.processedWebhookEvents.add(id));
        }
      } catch (err) {
        console.warn('Could not hydrate orders store:', err);
      }
    }
  }

  private persist() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(Array.from(this.orders.values())));
        localStorage.setItem(PROCESSED_WEBHOOKS_KEY, JSON.stringify(Array.from(this.processedWebhookEvents)));
      } catch (err) {
        console.warn('Could not persist orders:', err);
      }
    }
  }

  /**
   * Crea un registro de orden pendiente antes de redireccionar a la pasarela
   */
  public createOrderRecord(params: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    includeUpsell: boolean;
    gateway: any;
  }): { order: OrderRecord; verificationToken: string } {
    const orderId = `TF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationToken = `vtok_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

    const items = [
      {
        id: siteConfig.pricing.mainProduct.id,
        name: siteConfig.pricing.mainProduct.name,
        price: siteConfig.pricing.mainProduct.launchPrice,
      },
    ];

    if (params.includeUpsell) {
      items.push({
        id: siteConfig.pricing.upsell.id,
        name: siteConfig.pricing.upsell.name,
        price: siteConfig.pricing.upsell.price,
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    const normalizedEmail = params.customerEmail.toLowerCase().trim();
    const order: OrderRecord = {
      orderId,
      customerName: params.customerName,
      customerEmail: normalizedEmail,
      customerPhone: params.customerPhone,
      totalAmount,
      currency: 'USD',
      items,
      status: 'pending',
      verificationToken,
      gateway: params.gateway,
      saasCredentials: {
        email: normalizedEmail,
        temporaryPassword: 'TurnoFlow2026!',
        dashboardUrl: `${clientEnv.dashboardUrl}/login`,
      },
      createdAt: new Date().toISOString(),
    };

    this.orders.set(orderId, order);
    this.tokenToOrderId.set(verificationToken, orderId);
    this.persist();

    return { order, verificationToken };
  }

  /**
   * Sincroniza o inserta una orden verificada proveniente del backend API
   */
  public upsertVerifiedOrder(params: {
    orderId: string;
    verificationToken: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    includeUpsell?: boolean;
    totalAmount?: number;
    currency?: string;
    gateway?: any;
    saasCredentials?: SaasCredentials;
  }): OrderRecord {
    const items = [
      {
        id: siteConfig.pricing.mainProduct.id,
        name: siteConfig.pricing.mainProduct.name,
        price: siteConfig.pricing.mainProduct.launchPrice,
      },
    ];

    if (params.includeUpsell) {
      items.push({
        id: siteConfig.pricing.upsell.id,
        name: siteConfig.pricing.upsell.name,
        price: siteConfig.pricing.upsell.price,
      });
    }

    const computedAmount = params.totalAmount ?? items.reduce((sum, item) => sum + item.price, 0);
    const normalizedEmail = params.customerEmail.toLowerCase().trim();

    const record: OrderRecord = {
      orderId: params.orderId,
      customerName: params.customerName.trim() || 'Cliente TurnoFlow',
      customerEmail: normalizedEmail,
      customerPhone: params.customerPhone,
      totalAmount: computedAmount,
      currency: params.currency || 'USD',
      items,
      status: 'verified',
      verificationToken: params.verificationToken,
      gateway: params.gateway || 'sandbox',
      gatewayTransactionId: params.verificationToken,
      saasCredentials: params.saasCredentials || {
        email: normalizedEmail,
        temporaryPassword: 'TurnoFlow2026!',
        dashboardUrl: `${clientEnv.dashboardUrl}/login`,
      },
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };

    this.orders.set(record.orderId, record);
    this.tokenToOrderId.set(record.verificationToken, record.orderId);
    this.persist();
    return record;
  }

  /**
   * Verifica si un token corresponde a una compra real y verificada
   */
  public verifyToken(token?: string | null): {
    isValid: boolean;
    order?: OrderRecord;
    errorReason?: string;
  } {
    if (!token) {
      return { isValid: false, errorReason: 'Token no provisto.' };
    }

    const orderId = this.tokenToOrderId.get(token);
    if (!orderId) {
      return { isValid: false, errorReason: 'Token de compra no encontrado en el sistema.' };
    }

    const order = this.orders.get(orderId);
    if (!order) {
      return { isValid: false, errorReason: 'Orden asociada no existe.' };
    }

    if (order.status !== 'verified') {
      return {
        isValid: false,
        order,
        errorReason: `La orden aún se encuentra en estado: ${order.status}. El pago debe ser verificado por webhook.`,
      };
    }

    return {
      isValid: true,
      order,
    };
  }

  /**
   * Procesa la confirmación de un pago (ej. webhook verificado o confirmación en sandbox)
   */
  public confirmOrderPayment(orderId: string, transactionId?: string): boolean {
    const order = this.orders.get(orderId);
    if (!order) return false;

    order.status = 'verified';
    order.verifiedAt = new Date().toISOString();
    if (transactionId) {
      order.gatewayTransactionId = transactionId;
    }

    this.orders.set(orderId, order);
    this.persist();
    return true;
  }

  /**
   * Protección contra webhooks duplicados (Idempotencia)
   */
  public isWebhookProcessed(eventId: string): boolean {
    return this.processedWebhookEvents.has(eventId);
  }

  public markWebhookProcessed(eventId: string) {
    this.processedWebhookEvents.add(eventId);
    this.persist();
  }

  public getOrder(orderId: string): OrderRecord | undefined {
    return this.orders.get(orderId);
  }
}

export const paymentVerification = new PaymentVerificationService();
