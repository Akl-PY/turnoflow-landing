import { z } from 'zod';

export const LeadCaptureSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Por favor, ingresá tu nombre completo.')
    .max(80, 'El nombre es demasiado largo.'),
  email: z
    .string()
    .email('Ingresá una casilla de correo electrónico válida.')
    .toLowerCase()
    .trim(),
  whatsapp: z
    .string()
    .min(8, 'Ingresá un número de WhatsApp válido con código de país.')
    .max(20, 'Número de teléfono demasiado largo.')
    .optional()
    .or(z.literal('')),
  businessType: z
    .enum(['estetica', 'salon', 'unas', 'depilacion', 'independiente', 'otro'])
    .default('estetica'),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar las políticas de privacidad para acceder al material.',
    }),
});

export type LeadCaptureInput = z.infer<typeof LeadCaptureSchema>;

export const CheckoutOrderSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Por favor ingresá tu nombre completo.')
    .max(80),
  customerEmail: z
    .string()
    .email('Ingresá una dirección de correo válida.')
    .toLowerCase()
    .trim(),
  customerPhone: z
    .string()
    .min(8, 'Ingresá tu WhatsApp con código de país.')
    .max(25),
  planId: z.string().default('turnoflow-standard'),
  includeUpsell: z.boolean().default(false),
  paymentGateway: z.enum(['stripe', 'mercadopago', 'lemonsqueezy', 'sandbox']).default('sandbox'),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones de compra.',
    }),
});

export type CheckoutOrderInput = z.infer<typeof CheckoutOrderSchema>;

export const HandoffSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  whatsapp: z.string().min(8, 'Número de WhatsApp requerido'),
  businessType: z.string().optional(),
  reason: z.string().min(5, 'Detalla brevemente tu consulta'),
});

export type HandoffInput = z.infer<typeof HandoffSchema>;
