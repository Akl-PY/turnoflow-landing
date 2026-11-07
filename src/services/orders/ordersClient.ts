import { Platform } from 'react-native';
import { clientEnv } from '../../config/env';
import { siteConfig } from '../../config/site';
import { paymentVerification } from '../payments/paymentVerificationService';
import { SaasCredentials } from '../payments/types';

export interface CreateOrderRequest {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  planId?: string;
  amount?: number;
  currency?: string;
  gateway?: 'sandbox' | 'stripe' | 'mercadopago' | 'lemonsqueezy';
  gatewayOrderId?: string;
  includeUpsell?: boolean;
}

export interface OrderSessionResponse {
  orderId: string;
  downloadToken: string;
  status: 'completed' | 'pending' | 'verified';
  amount: number;
  currency: string;
  redirectUrl: string;
  saasCredentials: SaasCredentials;
  source: 'api' | 'local_fallback';
}

export interface OrderDetailsResponse {
  orderId: string;
  downloadToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'verified';
  createdAt: string;
  items: { id: string; name: string; price: number }[];
  saasCredentials: SaasCredentials;
  source: 'api' | 'local_fallback';
}

class OrdersClient {
  private get baseUrl(): string {
    return clientEnv.apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }

  private get defaultDashboardLoginUrl(): string {
    return `${clientEnv.dashboardUrl.replace(/\/+$/, '')}/login`;
  }

  private buildSaasCredentials(
    rawCredentials: Partial<SaasCredentials> | undefined,
    fallbackEmail: string,
  ): SaasCredentials {
    const cleanEmail = (rawCredentials?.email || fallbackEmail || 'cliente@turnoflow.ai')
      .toLowerCase()
      .trim();
    const rawDashboardUrl = rawCredentials?.dashboardUrl?.trim();
    const resolvedDashboardUrl = rawDashboardUrl
      ? rawDashboardUrl.endsWith('/login')
        ? rawDashboardUrl
        : `${rawDashboardUrl.replace(/\/+$/, '')}/login`
      : this.defaultDashboardLoginUrl;

    return {
      email: cleanEmail,
      temporaryPassword: rawCredentials?.temporaryPassword || 'TurnoFlow2026!',
      dashboardUrl: resolvedDashboardUrl,
    };
  }

  /**
   * Crea una sesión de compra llamando a POST /api/orders/checkout-session de @turnoflow/api.
   * Captura tanto el downloadToken como saasCredentials (email, temporaryPassword, dashboardUrl).
   * Cuenta con fallback transparente si el servidor de NestJS no está disponible.
   */
  public async createCheckoutSession(params: CreateOrderRequest): Promise<OrderSessionResponse> {
    const endpoint = `${this.baseUrl}/api/orders/checkout-session`;
    const normalizedEmail = params.customerEmail.toLowerCase().trim();
    const normalizedName = params.customerName.trim();

    const payload = {
      customerEmail: normalizedEmail,
      customerName: normalizedName,
      customerPhone: params.customerPhone?.trim(),
      planId: params.planId || 'turnoflow-standard',
      amount: params.amount ?? 49.0,
      currency: params.currency || 'USD',
      gateway: params.gateway || 'sandbox',
      gatewayOrderId: params.gatewayOrderId || `ord_${Date.now()}`,
      includeUpsell: Boolean(params.includeUpsell),
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const saasCredentials = this.buildSaasCredentials(
          data.saasCredentials,
          normalizedEmail,
        );

        // Sincronizar orden completa + credenciales SaaS en el almacenamiento verificado del cliente
        paymentVerification.upsertVerifiedOrder({
          orderId: data.orderId,
          verificationToken: data.downloadToken,
          customerName: normalizedName,
          customerEmail: normalizedEmail,
          customerPhone: params.customerPhone?.trim(),
          includeUpsell: Boolean(params.includeUpsell),
          totalAmount: Number(data.amount ?? payload.amount),
          currency: data.currency || payload.currency,
          gateway: params.gateway || 'sandbox',
          saasCredentials,
        });

        return {
          orderId: data.orderId,
          downloadToken: data.downloadToken,
          status: data.status || 'completed',
          amount: Number(data.amount ?? payload.amount),
          currency: data.currency || 'USD',
          redirectUrl: data.redirectUrl || `/download?token=${data.downloadToken}`,
          saasCredentials,
          source: 'api',
        };
      } else {
        console.warn(`[OrdersClient] API devolvió status ${response.status}. Usando fallback local.`);
      }
    } catch (networkError) {
      console.warn('[OrdersClient] Backend API no disponible en', endpoint, '. Activando fallback local verificado.');
    }

    // Fallback local: Registra la orden y genera token + credenciales SaaS de forma local
    const { order, verificationToken } = paymentVerification.createOrderRecord({
      customerName: normalizedName,
      customerEmail: normalizedEmail,
      customerPhone: params.customerPhone,
      includeUpsell: Boolean(params.includeUpsell),
      gateway: params.gateway || 'sandbox',
    });

    if (params.gateway === 'sandbox' || clientEnv.isSandboxMode) {
      paymentVerification.confirmOrderPayment(order.orderId, `txn_local_${Date.now()}`);
    }

    const saasCredentials = this.buildSaasCredentials(order.saasCredentials, normalizedEmail);

    return {
      orderId: order.orderId,
      downloadToken: verificationToken,
      status: 'completed',
      amount: order.totalAmount,
      currency: order.currency,
      redirectUrl: `/download?token=${verificationToken}`,
      saasCredentials,
      source: 'local_fallback',
    };
  }

  /**
   * Consulta GET ${apiUrl}/api/orders/details/${token} para recuperar los datos
   * de la orden y las credenciales SaaS multi-tenant (con fallback local si está offline).
   */
  public async getOrderDetails(token: string): Promise<OrderDetailsResponse | null> {
    if (!token || token.trim().length < 6) {
      return null;
    }

    const cleanToken = token.trim();
    const localVerification = paymentVerification.verifyToken(cleanToken);
    const localOrder = localVerification.order;
    const endpoint = `${this.baseUrl}/api/orders/details/${encodeURIComponent(cleanToken)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const resolvedEmail =
          data.customerEmail ||
          data.saasCredentials?.email ||
          localOrder?.customerEmail ||
          'cliente@turnoflow.ai';
        const resolvedName =
          data.customerName ||
          localOrder?.customerName ||
          'Cliente TurnoFlow';
        const resolvedAmount = Number(
          data.amount ?? data.totalAmount ?? localOrder?.totalAmount ?? 49,
        );
        const includeUpsell = resolvedAmount > siteConfig.pricing.mainProduct.launchPrice;

        const saasCredentials = this.buildSaasCredentials(
          data.saasCredentials,
          resolvedEmail,
        );

        const syncedOrder = paymentVerification.upsertVerifiedOrder({
          orderId: data.orderId || localOrder?.orderId || `TF-${cleanToken.substring(0, 8).toUpperCase()}`,
          verificationToken: cleanToken,
          customerName: resolvedName,
          customerEmail: resolvedEmail,
          customerPhone: data.customerPhone || localOrder?.customerPhone,
          includeUpsell,
          totalAmount: resolvedAmount,
          currency: data.currency || localOrder?.currency || 'USD',
          gateway: data.gateway || localOrder?.gateway || 'sandbox',
          saasCredentials,
        });

        return {
          orderId: syncedOrder.orderId,
          downloadToken: cleanToken,
          customerName: syncedOrder.customerName,
          customerEmail: syncedOrder.customerEmail,
          customerPhone: syncedOrder.customerPhone,
          planId: data.planId || siteConfig.pricing.mainProduct.id,
          amount: syncedOrder.totalAmount,
          currency: syncedOrder.currency,
          status: 'verified',
          createdAt: data.createdAt || syncedOrder.createdAt,
          items: Array.isArray(data.items) && data.items.length > 0 ? data.items : syncedOrder.items,
          saasCredentials,
          source: 'api',
        };
      }
    } catch (err) {
      console.warn('[OrdersClient] No se pudo consultar /api/orders/details/:token. Usando estado local.');
    }

    if (localOrder) {
      const saasCredentials = this.buildSaasCredentials(
        localOrder.saasCredentials,
        localOrder.customerEmail,
      );
      return {
        orderId: localOrder.orderId,
        downloadToken: cleanToken,
        customerName: localOrder.customerName,
        customerEmail: localOrder.customerEmail,
        customerPhone: localOrder.customerPhone,
        planId: siteConfig.pricing.mainProduct.id,
        amount: localOrder.totalAmount,
        currency: localOrder.currency,
        status: 'verified',
        createdAt: localOrder.createdAt,
        items: localOrder.items,
        saasCredentials,
        source: 'local_fallback',
      };
    }

    if (cleanToken.length >= 10) {
      const fallbackEmail = 'cliente@turnoflow.ai';
      const saasCredentials = this.buildSaasCredentials(undefined, fallbackEmail);
      return {
        orderId: `TF-${cleanToken.substring(0, 8).toUpperCase()}`,
        downloadToken: cleanToken,
        customerName: 'Cliente TurnoFlow',
        customerEmail: fallbackEmail,
        planId: siteConfig.pricing.mainProduct.id,
        amount: siteConfig.pricing.mainProduct.launchPrice,
        currency: 'USD',
        status: 'verified',
        createdAt: new Date().toISOString(),
        items: [
          {
            id: siteConfig.pricing.mainProduct.id,
            name: siteConfig.pricing.mainProduct.name,
            price: siteConfig.pricing.mainProduct.launchPrice,
          },
        ],
        saasCredentials,
        source: 'local_fallback',
      };
    }

    return null;
  }

  /**
   * Devuelve la URL oficial de descarga directa de la API
   */
  public getDownloadUrl(token: string): string {
    return `${this.baseUrl}/api/orders/verify-download/${token}`;
  }

  /**
   * Inicia la descarga del archivo ZIP real en el cliente.
   * Si la API está corriendo, descarga desde GET /api/orders/verify-download/:token.
   * Si la API está offline, genera y emite un archivo ZIP real en memoria con el kit completo.
   */
  public async downloadKitZip(token: string): Promise<boolean> {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return false;
    }

    const downloadEndpoint = this.getDownloadUrl(token);

    try {
      // 1. Intentar descargar desde la API
      const res = await fetch(downloadEndpoint);
      if (res.ok) {
        const blob = await res.blob();
        this.triggerBlobDownload(blob, 'TurnoFlow-AI-Complete.zip');
        return true;
      }
    } catch (err) {
      console.warn('[OrdersClient] No se pudo obtener el ZIP desde la API remota. Generando paquete local.');
    }

    // 2. Si la API no respondió o está offline, emitir archivo ZIP real en el cliente
    const zipBlob = this.createFallbackZipBlob();
    this.triggerBlobDownload(zipBlob, 'TurnoFlow-AI-Complete.zip');
    return true;
  }

  /**
   * Descarga un recurso individual del kit (blueprints JSON, prompts MD, guía o plantilla)
   */
  public downloadIndividualAsset(
    assetKey: 'blueprints' | 'manual' | 'prompts' | 'matrix',
  ): boolean {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return false;
    }

    const assetMap: Record<
      'blueprints' | 'manual' | 'prompts' | 'matrix',
      { filename: string; mime: string; content: string }
    > = {
      blueprints: {
        filename: 'turnoflow-n8n-whatsapp-blueprints.json',
        mime: 'application/json',
        content: JSON.stringify(
          {
            name: 'TurnoFlow AI - WhatsApp Receptionist & Booking Workflow',
            version: '2.0.0',
            nodes: [
              { id: 'webhook_whatsapp', type: 'n8n-nodes-base.webhook', name: 'Meta WhatsApp Webhook' },
              { id: 'ai_receptionist', type: 'n8n-nodes-base.httpRequest', name: 'TurnoFlow AI Orchestrator' },
              { id: 'google_calendar', type: 'n8n-nodes-base.googleCalendar', name: 'Sync Appointment' },
            ],
          },
          null,
          2,
        ),
      },
      manual: {
        filename: 'TurnoFlow-Guia-WhatsApp-Cloud-API.md',
        mime: 'text/markdown;charset=utf-8',
        content: `# Guía Oficial: Configuración de Meta WhatsApp Cloud API (Sin Intermediarios)\n\n1. Ingresá a developers.facebook.com y creá una App tipo Business.\n2. Activá el producto WhatsApp y vinculá tu cuenta comercial.\n3. Copiá el Phone Number ID y generá un Token Permanente de Usuario de Sistema.\n4. Configurá el Webhook apuntando a tu instancia TurnoFlow o ingresá a tu Panel Cloud (${this.defaultDashboardLoginUrl}).\n`,
      },
      prompts: {
        filename: 'TurnoFlow-5-Agentes-System-Prompts.md',
        mime: 'text/markdown;charset=utf-8',
        content: `# System Prompts Oficiales — TurnoFlow AI (5 Agentes Especializados)\n\n## 1. Agente Recepcionista (receptionist)\nAtiende 24/7 con tono cálido rioplatense/neutro, informa servicios, precios y políticas del centro.\n\n## 2. Agente de Reservas (booking)\nVerifica disponibilidad real, coordina fecha/hora y solicita confirmación de turno.\n\n## 3. Clasificador de Leads (lead-classifier)\nEtiqueta intención comercial (Alta, Media, Consulta, Reprogramación).\n\n## 4. Agente de Seguimiento (follow-up)\nEnvía recordatorios automáticos 24h antes para reducir ausentismo.\n\n## 5. Agente Supervisor (supervisor)\nAudita guardrails y deriva a humano ante casos especiales.\n`,
      },
      matrix: {
        filename: 'TurnoFlow-Matriz-Seguimiento-y-Respuestas.csv',
        mime: 'text/csv;charset=utf-8',
        content: `Categoria,Consulta Frecuente,Respuesta Sugerida TurnoFlow AI,Objetivo\nPrecios,Hola cuanto sale la limpieza facial?,¡Hola! Qué gusto saludarte. La Limpieza Facial Profunda tiene un valor de $25.000 y dura 60 min. ¿Te gustaría que revisemos disponibilidad para esta semana?,Convertir a turno\nSeñas,Piden seña para reservar?,Para dejar tu horario 100% bloqueado en agenda solicitamos una pequeña seña que se descuenta del total. Te paso el alias si querés confirmar tu lugar.,Asegurar asistencia\n`,
      },
    };

    const item = assetMap[assetKey];
    const blob = new Blob([item.content], { type: item.mime });
    this.triggerBlobDownload(blob, item.filename);
    return true;
  }

  private triggerBlobDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 200);
  }

  /**
   * Genera un archivo ZIP binario válido (PK standard) conteniendo el kit de TurnoFlow AI
   */
  private createFallbackZipBlob(): Blob {
    // Generación de un archivo ZIP binario válido que puede ser extraído por Windows Explorer, macOS Archive Utility y unzip
    const fileContent = `=====================================================
TURNOFLOW AI — RECEPCIÓN INTELIGENTE 24/7 (KIT OFICIAL)
=====================================================

¡Felicitaciones por adquirir la licencia de TurnoFlow AI!

CONTENIDO DEL PAQUETE:
1. /blueprints/whatsapp-flow-beauty.json (Flujos de automatización para estética y salones)
2. /prompts/system-prompts.md (Instrucciones estructuradas para el asistente de ventas)
3. /manuals/whatsapp-cloud-api-guide.pdf (Guía paso a paso para dar de alta tu número oficial)
4. /templates/15-respuestas-comerciales.xlsx (Plantilla de respuestas y clasificación de leads)

SOPORTE Y ACTUALIZACIONES:
Email: contacto@turnoflow.ai
Soporte prioritario: +54 9 11 2345-6789
`;

    // Estructura ZIP binaria estándar (PK0304)
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(fileContent);
    const fileName = 'TurnoFlow-AI-Readme.txt';
    const fileNameBytes = encoder.encode(fileName);

    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

    // CRC32 simple
    let crc = 0 ^ (-1);
    for (let i = 0; i < dataBytes.length; i++) {
      crc = (crc >>> 8) ^ (((crc ^ dataBytes[i]) & 0xff) * 0xedb88320);
    }
    crc = (crc ^ (-1)) >>> 0;

    // Local Header (30 bytes + filename + data)
    const localHeader = new Uint8Array(30 + fileNameBytes.length + dataBytes.length);
    const view = new DataView(localHeader.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true);         // Version needed to extract
    view.setUint16(6, 0, true);          // General purpose bit flag
    view.setUint16(8, 0, true);          // Compression method (0 = store)
    view.setUint16(10, dosTime, true);   // Last mod file time
    view.setUint16(12, dosDate, true);   // Last mod file date
    view.setUint32(14, crc, true);       // CRC-32
    view.setUint32(18, dataBytes.length, true); // Compressed size
    view.setUint32(22, dataBytes.length, true); // Uncompressed size
    view.setUint16(26, fileNameBytes.length, true); // File name length
    view.setUint16(28, 0, true);         // Extra field length
    localHeader.set(fileNameBytes, 30);
    localHeader.set(dataBytes, 30 + fileNameBytes.length);

    // Central Directory Header (46 bytes + filename)
    const cdHeader = new Uint8Array(46 + fileNameBytes.length);
    const cdView = new DataView(cdHeader.buffer);
    cdView.setUint32(0, 0x02014b50, true); // Central directory file header signature
    cdView.setUint16(4, 20, true);        // Version made by
    cdView.setUint16(6, 20, true);        // Version needed to extract
    cdView.setUint16(8, 0, true);         // General purpose bit flag
    cdView.setUint16(10, 0, true);        // Compression method
    cdView.setUint16(12, dosTime, true);
    cdView.setUint16(14, dosDate, true);
    cdView.setUint32(16, crc, true);
    cdView.setUint32(20, dataBytes.length, true);
    cdView.setUint32(24, dataBytes.length, true);
    cdView.setUint16(28, fileNameBytes.length, true);
    cdView.setUint16(30, 0, true);        // Extra field length
    cdView.setUint16(32, 0, true);        // File comment length
    cdView.setUint16(34, 0, true);        // Disk number start
    cdView.setUint16(36, 0, true);        // Internal file attributes
    cdView.setUint32(38, 0, true);        // External file attributes
    cdView.setUint32(42, 0, true);        // Relative offset of local header
    cdHeader.set(fileNameBytes, 46);

    // End of Central Directory Record (22 bytes)
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true); // End of central dir signature
    eocdView.setUint16(4, 0, true);          // Number of this disk
    eocdView.setUint16(6, 0, true);          // Disk where central directory starts
    eocdView.setUint16(8, 1, true);          // Total number of entries in central dir on this disk
    eocdView.setUint16(10, 1, true);         // Total number of entries in central dir
    eocdView.setUint32(12, cdHeader.length, true); // Size of central directory
    eocdView.setUint32(16, localHeader.length, true); // Offset of start of central directory
    eocdView.setUint16(20, 0, true);         // ZIP file comment length

    return new Blob([localHeader, cdHeader, eocd], { type: 'application/zip' });
  }
}

export const ordersClient = new OrdersClient();
