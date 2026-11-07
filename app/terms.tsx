import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../src/components/layout/Container';
import { theme } from '../src/styles/theme';
import { siteConfig } from '../src/config/site';

export default function TermsPage() {
  return (
    <View style={styles.pageWrapper}>
      <Container>
        <View style={styles.content}>
          <Text style={styles.title}>Términos y Condiciones de Uso</Text>
          <Text style={styles.updated}>Última actualización: Noviembre 2026</Text>

          <Text style={styles.paragraph}>
            Al acceder al sitio web de {siteConfig.name} o adquirir cualquiera de nuestros paquetes de software, automatizaciones o servicios de implementación, aceptás quedar vinculado por los siguientes términos y condiciones.
          </Text>

          <Text style={styles.heading}>1. Licencia de Uso Comercial</Text>
          <Text style={styles.paragraph}>
            La adquisición de TurnoFlow AI otorga una licencia no exclusiva, intransferible y de por vida para utilizar los flujos, diagramas y configuraciones en tu propio negocio o centros comerciales. Queda estrictamente prohibida la reventa, redistribución o publicación no autorizada de los archivos digitales protegidos por derechos de autor.
          </Text>

          <Text style={styles.heading}>2. Naturaleza del Producto</Text>
          <Text style={styles.paragraph}>
            TurnoFlow AI es un conjunto de herramientas, flujos automatizados y manuales de integración diseñados para WhatsApp Cloud API y canales afines. El usuario reconoce que Meta Platforms Inc. posee sus propias políticas de uso aceptable y costos de conversación de WhatsApp Cloud API ajenos a nuestra tarifa única de producto.
          </Text>

          <Text style={styles.heading}>3. Precios y Condiciones de Pago</Text>
          <Text style={styles.paragraph}>
            El precio promocional de lanzamiento es de USD 49 por pago único. El servicio opcional de implementación técnica personalizada tiene un valor de USD 249. Todos los pagos se procesan a través de pasarelas de pago seguras y verificadas.
          </Text>

          <Text style={styles.heading}>4. Soporte Técnico y Garantía</Text>
          <Text style={styles.paragraph}>
            Ofrecemos asistencia técnica directa para garantizar la correcta puesta en marcha de los flujos. Si experimentás inconvenientes técnicos no atribuibles a fallas generales de infraestructura externa de Meta, nuestro equipo te asistirá hasta dejar operativo el sistema.
          </Text>

          <Text style={styles.heading}>5. Contacto Legal</Text>
          <Text style={styles.paragraph}>
            Para cualquier consulta sobre estos términos, podés comunicarte con nuestro equipo legal a través de {siteConfig.supportEmail}.
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
