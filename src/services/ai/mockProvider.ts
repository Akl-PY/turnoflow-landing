import { AiCompletionRequest, AiCompletionResponse, AiModelProvider, ToolCall } from './types';
import { AgentToolsExecutor } from './tools';

export class MockSalesAssistantProvider implements AiModelProvider {
  public id = 'mock';
  public name = 'Simulador de Ventas (Mock Asistente)';

  public isAvailable(): boolean {
    return true;
  }

  public async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';

    // Simulamos una latencia realista
    await new Promise((resolve) => setTimeout(resolve, 600));

    const toolCalls: ToolCall[] = [];
    let content = '';

    // Detección de intenciones y disparo de herramientas
    if (lastUserMessage.includes('precio') || lastUserMessage.includes('cuanto sale') || lastUserMessage.includes('costo') || lastUserMessage.includes('valor')) {
      const toolCallId = `tc_pricing_${Date.now()}`;
      toolCalls.push({
        id: toolCallId,
        name: 'get_pricing',
        parameters: { includeUpsell: true },
      });
      const pricingData = await AgentToolsExecutor.execute('get_pricing', { includeUpsell: true });
      content = `[Modo Simulación / Asistente TurnoFlow]\nEl producto principal **${pricingData.mainProduct.name}** tiene un valor promocional de lanzamiento de **${pricingData.mainProduct.launchPrice}** (pago único de por vida, sin mensualidades obligatorias).\n\nTambién podés optar por nuestro servicio opcional de **${pricingData.upsell.name}** por **${pricingData.upsell.price}** donde nuestro equipo deja todo calibrado y funcionando en 72 hs.\n\n¿Te gustaría que te prepare el enlace directo para asegurar la oferta de lanzamiento de USD 49?`;
    } else if (lastUserMessage.includes('gratis') || lastUserMessage.includes('guia') || lastUserMessage.includes('recurso') || lastUserMessage.includes('15 respuestas') || lastUserMessage.includes('plantilla')) {
      const toolCallId = `tc_resource_${Date.now()}`;
      toolCalls.push({
        id: toolCallId,
        name: 'recommend_resource',
        parameters: { reason: 'El usuario consultó por material gratuito o plantillas.' },
      });
      content = `[Modo Simulación / Asistente TurnoFlow]\n¡Claro que sí! Tenemos una guía gratuita pensada para salones de belleza y estética: **"15 respuestas de WhatsApp para convertir consultas en turnos"**.\n\nIncluye los mensajes exactos para responder "¿cuánto sale?" sin ahuyentar a la clienta y cómo cobrar la seña.\n\nPodés acceder directamente desde la sección **/free-guide** en el menú superior o haciendo clic en el banner de la página. ¿Querés que te cuente más sobre el sistema automatizado?`;
    } else if (lastUserMessage.includes('humano') || lastUserMessage.includes('asesor') || lastUserMessage.includes('persona') || lastUserMessage.includes('hablar con alguien')) {
      toolCalls.push({
        id: `tc_handoff_${Date.now()}`,
        name: 'handoff_to_human',
        parameters: {
          customerName: 'Visitante Web',
          contactNumber: 'Solicitado en chat',
          reason: 'Desea conversar directamente con un asesor humano.',
        },
      });
      content = `[Modo Simulación / Asistente TurnoFlow]\nEntendido. Podés contactar directamente con nuestro equipo de atención humana por WhatsApp. Ellos pueden resolver casos especiales de tu negocio o coordinar una videollamada corta.\n\nHacé clic en el botón de WhatsApp en la barra inferior o escribinos a contacto@turnoflow.ai.`;
    } else if (lastUserMessage.includes('que incluye') || lastUserMessage.includes('funciona') || lastUserMessage.includes('whatsapp') || lastUserMessage.includes('como es')) {
      toolCalls.push({
        id: `tc_info_${Date.now()}`,
        name: 'get_product_information',
        parameters: { topic: 'deliverables' },
      });
      content = `[Modo Simulación / Asistente TurnoFlow]\nTurnoFlow AI es un sistema integral de **Recepción Inteligente 24/7** diseñado para centros de estética, peluquerías, salones y estudios de uñas.\n\nIncluye:\n• Conexión documentada con WhatsApp Cloud API (la API oficial de Meta sin riesgos de bloqueo).\n• Clasificador de consultas (separa clientas listas para reservar de consultas frías).\n• Solicitud automática de datos y seña bancaria para congelar el turno.\n• 15 plantillas comerciales probadas para responder rápido.\n• Video-tutoriales paso a paso para dejarlo listo en 2 horas.\n\n¿Qué tipo de salón o servicio tenés actualmente?`;
    } else if (lastUserMessage.includes('comprar') || lastUserMessage.includes('quiero') || lastUserMessage.includes('checkout') || lastUserMessage.includes('adquirir')) {
      content = `[Modo Simulación / Asistente TurnoFlow]\n¡Excelente decisión! Podés iniciar el proceso seguro de compra visitando **/checkout** o haciendo clic en los botones de "Quiero automatizar mi negocio".\n\nEl acceso digital se entrega inmediatamente después de verificar el pago. ¿Querés agregar también la implementación personalizada o preferís instalarlo por tu cuenta con los videos guiados?`;
    } else {
      content = `[Modo Simulación / Asistente TurnoFlow]\n¡Hola! Soy el asistente de TurnoFlow AI. Estoy aquí para explicarte cómo automatizar la atención de tu centro de estética o salón de belleza para no perder más clientas por responder tarde.\n\nPodés preguntarme sobre:\n1. Precios y formas de pago (Lanzamiento USD 49).\n2. Cómo se conecta con WhatsApp oficial.\n3. Nuestra guía gratuita de 15 respuestas comerciales.\n4. Si sirve para tu tipo específico de negocio.\n\n¿En qué te puedo asesorar hoy?`;
    }

    return {
      content,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        promptTokens: 45,
        completionTokens: 85,
        totalTokens: 130,
      },
      isMock: true,
    };
  }
}
