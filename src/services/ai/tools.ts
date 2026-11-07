import { ToolDefinition } from './types';
import { siteConfig } from '../../config/site';
import { faqList } from '../../config/faqData';
import { leadStorage } from '../leads/leadStorageService';
import { paymentVerification } from '../payments/paymentVerificationService';
import { analytics } from '../analytics/analyticsService';

export const agentToolDefinitions: ToolDefinition[] = [
  {
    name: 'get_product_information',
    description: 'Obtiene los detalles del producto TurnoFlow AI, funcionalidades, qué incluye y para quién está diseñado.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Tema específico: "general", "features", "deliverables", "audience", o "requirements".',
          enum: ['general', 'features', 'deliverables', 'audience', 'requirements'],
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'get_pricing',
    description: 'Obtiene los precios oficiales de lanzamiento de TurnoFlow AI y del servicio de implementación opcional.',
    parameters: {
      type: 'object',
      properties: {
        includeUpsell: {
          type: 'boolean',
          description: 'Si se debe incluir información sobre el servicio de implementación personalizada llave en mano.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_faq',
    description: 'Busca respuestas a preguntas frecuentes sobre tecnología, WhatsApp, integraciones, pagos o soporte.',
    parameters: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: 'Palabra clave o concepto a buscar en la base de preguntas frecuentes.',
        },
      },
      required: ['keyword'],
    },
  },
  {
    name: 'qualify_lead',
    description: 'Evalúa si el negocio del visitante se beneficiaría de TurnoFlow AI según su volumen y tipo de servicio.',
    parameters: {
      type: 'object',
      properties: {
        businessType: {
          type: 'string',
          description: 'Tipo de negocio (ej. estética, peluquería, manicura, depilación).',
        },
        inquiriesPerWeek: {
          type: 'string',
          description: 'Cantidad estimada de consultas semanales.',
        },
      },
      required: ['businessType'],
    },
  },
  {
    name: 'capture_lead',
    description: 'Registra los datos de contacto del interesado (nombre, email y WhatsApp) con su consentimiento explícito.',
    parameters: {
      type: 'object',
      properties: {
        fullName: { type: 'string', description: 'Nombre completo de la persona.' },
        email: { type: 'string', description: 'Correo electrónico válido.' },
        whatsapp: { type: 'string', description: 'Número de WhatsApp con código de país.' },
        businessType: { type: 'string', description: 'Rubro del negocio.' },
      },
      required: ['fullName', 'email'],
    },
  },
  {
    name: 'recommend_resource',
    description: 'Recomienda el recurso gratuito ("15 respuestas de WhatsApp") cuando el visitante aún no está listo para comprar.',
    parameters: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Motivo por el que se recomienda el recurso gratuito.',
        },
      },
      required: [],
    },
  },
  {
    name: 'create_checkout_session',
    description: 'Inicia el proceso de checkout y devuelve el enlace seguro de compra verificado. NO confirma compras por su cuenta.',
    parameters: {
      type: 'object',
      properties: {
        customerEmail: { type: 'string', description: 'Email del comprador.' },
        customerName: { type: 'string', description: 'Nombre del comprador.' },
        includeUpsell: { type: 'boolean', description: 'Si desea sumar la implementación llave en mano.' },
      },
      required: ['customerEmail', 'customerName'],
    },
  },
  {
    name: 'handoff_to_human',
    description: 'Deriva la conversación al equipo humano cuando la consulta requiere atención personalizada o soporte especial.',
    parameters: {
      type: 'object',
      properties: {
        customerName: { type: 'string', description: 'Nombre del cliente.' },
        contactNumber: { type: 'string', description: 'WhatsApp o teléfono de contacto.' },
        reason: { type: 'string', description: 'Motivo de la derivación.' },
      },
      required: ['customerName', 'contactNumber', 'reason'],
    },
  },
];

export class AgentToolsExecutor {
  public static async execute(toolName: string, params: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'get_product_information': {
        const topic = params.topic || 'general';
        if (topic === 'features') {
          return { features: siteConfig.pricing.mainProduct.features };
        }
        if (topic === 'deliverables') {
          return { deliverables: siteConfig.pricing.mainProduct.deliverables };
        }
        if (topic === 'audience') {
          return {
            target: siteConfig.targetAudiences,
            forWho: siteConfig.forWho,
            notForWho: siteConfig.notForWho,
          };
        }
        return {
          name: siteConfig.name,
          tagline: siteConfig.tagline,
          description: siteConfig.metaDescription,
          deliverables: siteConfig.pricing.mainProduct.deliverables,
        };
      }

      case 'get_pricing': {
        const result: any = {
          mainProduct: {
            name: siteConfig.pricing.mainProduct.name,
            launchPrice: `${siteConfig.pricing.mainProduct.launchPrice} ${siteConfig.pricing.mainProduct.currency}`,
            regularPrice: `${siteConfig.pricing.mainProduct.regularPrice} ${siteConfig.pricing.mainProduct.currency}`,
            paymentType: 'Pago único de por vida (sin abonos forzosos)',
          },
        };
        if (params.includeUpsell) {
          result.upsell = {
            name: siteConfig.pricing.upsell.name,
            price: `${siteConfig.pricing.upsell.price} ${siteConfig.pricing.upsell.currency}`,
            description: siteConfig.pricing.upsell.description,
          };
        }
        return result;
      }

      case 'get_faq': {
        const query = (params.keyword || '').toLowerCase();
        const matches = faqList.filter(
          (f) => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
        );
        return {
          matches: matches.length > 0 ? matches : faqList.slice(0, 3),
        };
      }

      case 'qualify_lead': {
        const { businessType, inquiriesPerWeek } = params;
        const isBeautySector = ['estetica', 'salon', 'unas', 'depilacion', 'peluqueria', 'spa', 'lash'].some((t) =>
          (businessType || '').toLowerCase().includes(t)
        );
        return {
          qualified: true,
          isHighFit: isBeautySector,
          recommendation: isBeautySector
            ? 'Perfil ideal para TurnoFlow AI. El sistema resuelve el 80% de las preguntas de precios y horarios al instante.'
            : 'TurnoFlow AI está especialmente calibrado para salones y centros de estética, aunque puede adaptarse a turnos de otros rubros de servicios.',
        };
      }

      case 'capture_lead': {
        const stored = await leadStorage.registerLead(
          {
            fullName: params.fullName,
            email: params.email,
            whatsapp: params.whatsapp || '',
            businessType: params.businessType || 'estetica',
            privacyConsent: true,
          },
          'ai-sales-assistant'
        );

        analytics.track('agent_lead_captured', {
          leadEmail: params.email,
          leadType: params.businessType,
        });

        return {
          success: true,
          leadId: stored.lead.id,
          message: 'Lead registrado de forma segura. Se ha concedido acceso a la guía comercial.',
        };
      }

      case 'recommend_resource': {
        return {
          resourceTitle: siteConfig.leadMagnet.title,
          badge: siteConfig.leadMagnet.badge,
          directLink: '/free-guide',
          description: siteConfig.leadMagnet.subtitle,
        };
      }

      case 'create_checkout_session': {
        const { order, verificationToken } = paymentVerification.createOrderRecord({
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          includeUpsell: Boolean(params.includeUpsell),
          gateway: 'sandbox',
        });

        return {
          success: true,
          orderId: order.orderId,
          totalAmount: order.totalAmount,
          currency: 'USD',
          checkoutUrl: `/checkout?plan=${siteConfig.pricing.mainProduct.id}&token=${verificationToken}`,
          warning: 'La compra no se considerará efectiva hasta que el pago sea verificado por pasarela/webhook.',
        };
      }

      case 'handoff_to_human': {
        analytics.track('cta_clicked', {
          ctaText: 'Handoff to Human',
          reason: params.reason,
        });

        return {
          handoffCompleted: true,
          supportWhatsApp: `https://wa.me/${siteConfig.whatsappDirect.replace(/\+/g, '')}?text=${encodeURIComponent(
            `Hola TurnoFlow, mi nombre es ${params.customerName}. Consulta: ${params.reason}`
          )}`,
          message: 'He transferido la consulta al equipo humano. Podés escribirles directamente por WhatsApp.',
        };
      }

      default:
        throw new Error(`Herramienta "${toolName}" no reconocida.`);
    }
  }
}
