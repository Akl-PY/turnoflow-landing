export interface ProductTier {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  regularPrice: number;
  launchPrice: number;
  currency: string;
  popular?: boolean;
  features: string[];
  deliverables: {
    title: string;
    description: string;
    format: string;
  }[];
}

export interface UpsellTier {
  id: string;
  name: string;
  badge: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
}

export const siteConfig = {
  name: 'TurnoFlow AI',
  tagline: 'Recepción Inteligente 24/7 para Salones y Centros de Estética',
  metaDescription:
    'Dejá de perder clientes por responder tarde. TurnoFlow AI automatiza la atención de WhatsApp, califica interesadas y organiza tus turnos en piloto automático.',
  domain: 'https://turnoflow.ai',
  supportEmail: 'contacto@turnoflow.ai',
  whatsappDirect: '+5491123456789',

  targetAudiences: [
    { title: 'Centros de Estética & Spa', desc: 'Atención inmediata de tratamientos corporales, faciales y aparatología sin frenar cabinas.' },
    { title: 'Salones de Belleza & Peluquerías', desc: 'Gestión de servicios combinados (color, corte, peinado) con agenda fluida.' },
    { title: 'Estudios de Uñas & Lash Artists', desc: 'Calificación rápida de servicios, tiempos requeridos y seña de turno.' },
    { title: 'Centros de Depilación Láser', desc: 'Respuestas automáticas de zonas, promociones por sesión y recordatorios.' },
    { title: 'Profesionales Independientes', desc: 'La tranquilidad de atender mientras estás trabajando con una clienta.' },
  ],

  forWho: [
    'Negocios de belleza y estética con al menos 10 consultas semanales por WhatsApp.',
    'Dueñas o profesionales que pasan horas respondiendo "¿cuánto sale?" sin cerrar turnos.',
    'Equipos que pierden reservas cuando la clienta escribe por la noche o fines de semana.',
    'Centros que buscan profesionalizar la comunicación sin contratar recepcionistas adicionales.',
  ],

  notForWho: [
    'Empresas sin canales de mensajería activos o sin volumen de consultas.',
    'Negocios que buscan un CRM gigante corporativo imposible de configurar en 1 tarde.',
    'Quienes no quieran estandarizar sus precios, horarios ni políticas de reserva.',
  ],

  pricing: {
    mainProduct: {
      id: 'turnoflow-standard',
      name: 'TurnoFlow AI — Recepción Inteligente 24/7',
      badge: 'Oferta Especial de Lanzamiento',
      tagline: 'Implementá el sistema en tu propio negocio y empezá a cerrar turnos hoy mismo.',
      regularPrice: 149,
      launchPrice: 49,
      currency: 'USD',
      popular: true,
      features: [
        'Sistema completo de automatización de recepción por WhatsApp',
        'Flujos de conversación validados para salón de belleza y estética',
        'Clasificador automático de consultas y filtrado de clientas tibias/calientes',
        'Módulo de derivación a agenda y solicitud de seña bancaria/pago',
        'Conector documentado para WhatsApp Cloud API oficial',
        '15 Plantillas comerciales listas para importar y personalizar',
        'Guía paso a paso de configuración sin conocimientos de programación',
        'Video-tutoriales de puesta en marcha en menos de 2 horas',
        'Licencia de uso comercial ilimitada para tu negocio',
        'Acceso de por vida con actualizaciones de mejoras de flujos',
      ],
      deliverables: [
        {
          title: 'Paquete de Automatizaciones Listas',
          description: 'Flujos JSON y diagramas listos para importar en plataformas no-code / webhook WhatsApp.',
          format: 'Blueprint JSON + Diagramas',
        },
        {
          title: 'Agente de Recepción TurnoFlow AI',
          description: 'Prompts estructurados del asistente, instrucciones de tono, reglas de negocio y políticas de cancelación.',
          format: 'Documentación técnica + System Prompts',
        },
        {
          title: 'Manual de Integración WhatsApp Cloud API',
          description: 'Guía paso a paso para dar de alta el número oficial de Meta sin pagar intermediarios abusivos.',
          format: 'PDF Interactivo + Checklist de verificación',
        },
        {
          title: 'Matriz de Clasificación & Seguimiento',
          description: 'Plantilla de gestión de leads para saber exactamente quién consultó, qué servicio busca y si agendó.',
          format: 'Plantilla de cálculo / CRM liviano',
        },
      ],
    } as ProductTier,

    upsell: {
      id: 'turnoflow-custom-setup',
      name: 'Implementación Personalizada Llave en Mano',
      badge: 'Cupos Limitados por Mes',
      price: 249,
      currency: 'USD',
      description: 'Nuestro equipo técnico configura todo por vos en 72 horas para que solo te preocupes por atender clientas.',
      features: [
        'Configuración completa de tu número de WhatsApp Cloud API oficial',
        'Carga de tu menú de servicios, precios, horarios y políticas de reserva',
        'Personalización del tono del agente al estilo de tu marca',
        'Pruebas y calibración de respuestas con simulación en vivo',
        'Sesión 1 a 1 de 45 minutos por videollamada para capacitar a tu equipo',
        'Soporte prioritario directo vía WhatsApp durante 30 días',
      ],
    } as UpsellTier,
  },

  leadMagnet: {
    title: '15 Respuestas de WhatsApp para Convertir Consultas en Turnos',
    subtitle: 'El recetario comercial exacto para responder "¿cuánto cuesta?", resolver dudas y evitar que te claven el visto.',
    badge: 'Recurso 100% Gratuito',
    highlights: [
      'Cómo responder el temido "¿cuánto sale?" sin ahuyentar a la clienta con el precio en frío.',
      'El mensaje de reactivación que recupera un 28% de clientas que te dejaron con el visto.',
      'Plantilla de confirmación y cobro de seña para erradicar las inasistencias de último minuto.',
      'Estrategia de preguntas filtro para que agenden sin dar 20 vueltas de mensajes.',
    ],
    sampleSnippet: {
      situation: 'Cuando preguntan solo "¿Precio de lifting de pestañas?"',
      wrongAnswer: '❌ "Hola, sale $15.000."',
      rightAnswer: '✅ "¡Hola [Nombre]! Con gusto. Nuestro lifting incluye nutrición de keratina profunda para que te dure más de 6 semanas impecable. El valor es de $15.000. ¿Buscás para esta semana o algún día en especial así reviso horarios disponibles?"',
    },
  },
};
