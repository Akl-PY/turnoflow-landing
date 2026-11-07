import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, X, AlertCircle } from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { theme } from '../src/styles/theme';
import { siteConfig } from '../src/config/site';
import { PricingSection } from '../src/components/landing/PricingSection';
import { FaqSection } from '../src/components/landing/FaqSection';
import { analytics } from '../src/services/analytics/analyticsService';

export default function SalesPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  React.useEffect(() => {
    analytics.track('sales_page_view');
  }, []);

  const comparisonRows = [
    {
      feature: 'Tiempo de respuesta a consultas',
      manual: '30 a 90 minutos (si estás atendiendo)',
      genericBot: 'Inmediato pero con botones rígidos que frustran',
      turnoflow: 'Menos de 3 segundos en lenguaje natural fluido',
    },
    {
      feature: 'Atención nocturna y fines de semana',
      manual: 'No (se pierden los turnos de la noche)',
      genericBot: 'Sí, pero no califica ni cierra seña',
      turnoflow: '24/7 activo con solicitud de seña bancaria',
    },
    {
      feature: 'Riesgo de bloqueo de chip WhatsApp',
      manual: 'Bajo',
      genericBot: 'Alto si usa emuladores piratas no oficiales',
      turnoflow: 'Cero riesgo: WhatsApp Cloud API Oficial Meta',
    },
    {
      feature: 'Costo mensual recurrente',
      manual: 'Tiempo no cobrado ($500+ USD en horas)',
      genericBot: '$50 a $120 USD todos los meses',
      turnoflow: 'Pago único de lanzamiento: $49 USD vitalicio',
    },
    {
      feature: 'Calibración para salones de estética',
      manual: 'Excelente pero no escalable',
      genericBot: 'Genérica e impersonal',
      turnoflow: 'Diseñada específicamente para estética y belleza',
    },
  ];

  return (
    <View style={styles.pageWrapper}>
      <Container>
        {/* Sales Hero Header */}
        <View style={styles.heroSection}>
          <Badge
            label="Propuesta Comercial Completa"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />
          <Text style={[styles.mainTitle, !isDesktop && styles.mainTitleMobile]}>
            El sistema probado para llenar tu agenda sin pasar el día pegada al celular
          </Text>
          <Text style={styles.subtitle}>
            Una solución llave en mano para dueñas de centros de estética, salones y estudios que quieren triplicar la conversión de sus consultas en WhatsApp.
          </Text>
        </View>

        {/* The Core Shift */}
        <View style={styles.shiftCard}>
          <Text style={styles.shiftTitle}>Por qué los métodos tradicionales ya no funcionan:</Text>
          <Text style={styles.shiftText}>
            Antes alcanzaba con responder cuando terminaba la jornada. Hoy, la clienta que pregunta en Instagram o WhatsApp por un servicio de pestañas, manicura o depilación está esperando una confirmación en los próximos 5 minutos. Si no la recibe, sigue bajando en su pantalla y le escribe a tu competencia.
          </Text>
        </View>

        {/* Comparison Table */}
        <View style={styles.comparisonWrapper}>
          <Text style={styles.compTableTitle}>Comparativa Directa de Opciones</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Aspecto</Text>
              <Text style={styles.tableHeaderCell}>Atención Manual</Text>
              <Text style={styles.tableHeaderCell}>Bot Genérico</Text>
              <Text style={[styles.tableHeaderCell, styles.turnoflowHeader]}>TurnoFlow AI</Text>
            </View>

            {comparisonRows.map((row, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.cellText, { flex: 1.5, fontWeight: '600' }]}>{row.feature}</Text>
                <Text style={styles.cellText}>{row.manual}</Text>
                <Text style={styles.cellText}>{row.genericBot}</Text>
                <Text style={[styles.cellText, styles.turnoflowCell]}>{row.turnoflow}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Component Embedded */}
        <PricingSection />

        {/* FAQ Section Embedded */}
        <FaqSection />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[12],
    maxWidth: 820,
    marginHorizontal: 'auto' as any,
  },
  mainTitle: {
    fontSize: theme.typography.size['4xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[4],
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  mainTitleMobile: {
    fontSize: theme.typography.size['2xl'],
    lineHeight: 34,
  },
  subtitle: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 720,
  },
  shiftCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    marginBottom: theme.spacing[12],
    maxWidth: 840,
    marginHorizontal: 'auto' as any,
  },
  shiftTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  shiftText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  comparisonWrapper: {
    marginBottom: theme.spacing[16],
    maxWidth: 980,
    marginHorizontal: 'auto' as any,
    width: '100%',
  },
  compTableTitle: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    ...theme.shadows.subtle,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
  },
  turnoflowHeader: {
    color: theme.colors.accentDark,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  cellText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  turnoflowCell: {
    color: '#065F46',
    fontWeight: '700',
  },
});
