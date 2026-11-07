export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'tecnica' | 'pagos';
}

export const faqList: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: '¿Necesito saber programar para utilizar TurnoFlow AI?',
    answer:
      'Para nada. El producto está pensado para dueñas de centros de estética, recepcionistas y profesionales independientes. Incluye guías en video paso a paso, plantillas prediseñadas y textos listos para copiar y pegar.',
  },
  {
    id: 'faq-2',
    category: 'general',
    question: '¿Esto reemplaza a mi recepcionista o le ayuda?',
    answer:
      'TurnoFlow AI no busca eliminar al equipo humano, sino liberarlo de responder 50 veces al día "¿cuánto cuesta?" o "¿qué horarios tienen?". El agente atiende al instante 24/7 y deriva al profesional cuando la clienta necesita atención personalizada o ya está lista para reservar.',
  },
  {
    id: 'faq-3',
    category: 'tecnica',
    question: '¿Qué pasa si una clienta hace una pregunta no contemplada?',
    answer:
      'El agente tiene instrucciones de seguridad para nunca inventar información. Si una consulta supera sus reglas o requiere confirmación médica/técnica (por ejemplo alergias o patologías), el agente le pide los datos a la clienta y notifica inmediatamente a tu equipo humano para que tome el control del chat.',
  },
  {
    id: 'faq-4',
    category: 'tecnica',
    question: '¿Con qué canales de mensajería es compatible?',
    answer:
      'La arquitectura principal está optimizada para WhatsApp Cloud API (la API oficial de Meta), lo que garantiza máxima estabilidad sin riesgo de bloqueos por spam. También se puede conectar a plataformas de mensajería integradas mediante webhooks estándar.',
  },
  {
    id: 'faq-5',
    category: 'pagos',
    question: '¿El valor de USD 49 es un pago único o mensual?',
    answer:
      'Es un pago único de lanzamiento con acceso de por vida al paquete de automatizaciones, prompts del agente, guías de instalación y futuras actualizaciones de los flujos base.',
  },
  {
    id: 'faq-6',
    category: 'pagos',
    question: '¿Cómo accedo al producto una vez que pago?',
    answer:
      'Inmediatamente después de confirmarse tu pago recibirás un acceso digital verificado en nuestra plataforma con todos los archivos descargables, plantillas y tutoriales paso a paso.',
  },
  {
    id: 'faq-7',
    category: 'general',
    question: '¿Qué diferencia hay entre comprar el paquete y el servicio llave en mano?',
    answer:
      'El paquete estándar ($49) te entrega todo el material listo para que vos o alguien de tu equipo lo implemente siguiendo los videos (demora unas 2 horas). La Implementación Personalizada ($249) incluye a nuestro equipo técnico realizando la conexión completa por vos, cargando tus servicios y entrenando a tu equipo en 72 hs.',
  },
  {
    id: 'faq-8',
    category: 'tecnica',
    question: '¿Evita el ausentismo de turnos?',
    answer:
      'Sí. Gran parte del abandono de turnos ocurre porque no se solicita seña previa o no se envían recordatorios a tiempo. El flujo de TurnoFlow incluye la solicitud de comprobante de seña para confirmar el bloqueo del horario en tu agenda.',
  },
];
