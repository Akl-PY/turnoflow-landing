import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../src/components/layout/Container';
import { theme } from '../src/styles/theme';
import { siteConfig } from '../src/config/site';

export default function PrivacyPage() {
  return (
    <View style={styles.pageWrapper}>
      <Container>
        <View style={styles.content}>
          <Text style={styles.title}>Política de Privacidad</Text>
          <Text style={styles.updated}>Última actualización: Noviembre 2026</Text>

          <Text style={styles.paragraph}>
            En {siteConfig.name} valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal de los usuarios que interactúan con nuestro sitio web y adquieren nuestras soluciones de recepción automatizada.
          </Text>

          <Text style={styles.heading}>1. Información que recopilamos</Text>
          <Text style={styles.paragraph}>
            • **Datos de contacto:** Nombre, dirección de correo electrónico, número de teléfono/WhatsApp y tipo de negocio que proporcionás voluntariamente al solicitar recursos gratuitos o adquirir productos.
          </Text>
          <Text style={styles.paragraph}>
            • **Datos de transacciones:** Registros de órdenes de compra, identificadores de pago generados por pasarelas seguras (Stripe, Mercado Pago o Lemon Squeezy). No almacenamos números de tarjetas de crédito en nuestros servidores.
          </Text>
          <Text style={styles.paragraph}>
            • **Métricas y analítica:** Eventos de navegación, páginas visitadas y datos de rendimiento recopilados bajo tu previo consentimiento.
          </Text>

          <Text style={styles.heading}>2. Finalidad del tratamiento</Text>
          <Text style={styles.paragraph}>
            Utilizamos la información para:
            {'\n'}• Entregar el acceso inmediato a los recursos descargables y capacitaciones.
            {'\n'}• Validar y registrar la licencia comercial de uso de TurnoFlow AI.
            {'\n'}• Proveer asistencia y soporte técnico directo vía WhatsApp o email.
            {'\n'}• Comunicar actualizaciones importantes de los flujos de automatización.
          </Text>

          <Text style={styles.heading}>3. Seguridad y confidencialidad</Text>
          <Text style={styles.paragraph}>
            Aplicamos estándares de seguridad SSL de 256 bits y verificación de tokens en el servidor. Nunca venderemos, alquilaremos ni cederemos tus datos personales a empresas de terceros con fines publicitarios.
          </Text>

          <Text style={styles.heading}>4. Tus derechos</Text>
          <Text style={styles.paragraph}>
            Tenés derecho en todo momento a solicitar el acceso, rectificación o eliminación total de tus datos personales de nuestra base de datos escribiéndonos a {siteConfig.supportEmail}.
          </Text>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#FFFFFF',
    minHeight: '80vh' as any,
  },
  content: {
    maxWidth: 780,
    marginHorizontal: 'auto' as any,
  },
  title: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  updated: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing[8],
  },
  heading: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[3],
  },
  paragraph: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: theme.spacing[4],
  },
});
