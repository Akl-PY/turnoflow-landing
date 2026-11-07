import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TrendingDown, Hourglass, DollarSign, CalendarCheck } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';

export const LateCostSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const costBreakdown = [
    {
      metric: '1 a 2 turnos perdidos por día',
      label: 'Fuga de facturación',
      desc: 'En un salón con ticket promedio de $25 a $40 USD, dejar escapar sólo 1 clienta diaria representa entre $750 y $1.200 USD al mes que van directamente a tus competidores.',
    },
    {
      metric: '2 horas diarias respondiendo',
      label: 'Tiempo no cobrado',
      desc: 'Tipear manualmente listas de precios, consultar la agenda de papel o WhatsApp y reenviar audios te roba más de 50 horas mensuales que podrías dedicar a brindar servicios.',
    },
    {
      metric: '25% de ausentismo sin seña',
      label: 'Huecos en la agenda',
      desc: 'Agendar "de palabra" sin un sistema automático que solicite la seña bancaria deja a tus estilistas y especialistas con horas muertas irrecuperables.',
    },
  ];

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.contentBox}>
          <View style={styles.header}>
            <Text style={styles.preTitle}>EL COSTO OCULTO DE LA DEMORA</Text>
            <Text style={styles.title}>¿Cuánto te cuesta tardar 30 minutos en responder?</Text>
            <Text style={styles.desc}>
              La clienta de belleza tiene un impulso de compra inmediato. Cuando escribe, tiene el dinero y las ganas en ese preciso minuto. Si no recibe respuesta, su impulso se enfría o encuentra otra opción.
            </Text>
          </View>

          <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
            {costBreakdown.map((item, idx) => (
              <View key={idx} style={styles.metricCard}>
                <Text style={styles.metricNumber}>{item.metric}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: theme.spacing[16],
    backgroundColor: theme.colors.surfaceDark,
  },
  contentBox: {
    maxWidth: 960,
    marginHorizontal: 'auto' as any,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[10],
  },
  preTitle: {
    color: '#F87171',
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
    letterSpacing: 1.2,
    marginBottom: theme.spacing[2],
  },
  title: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontDisplay,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: theme.spacing[4],
  },
  desc: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 720,
  },
  grid: {
    flexDirection: 'row',
    gap: 20,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
  },
  metricNumber: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: '#F87171',
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    color: '#FFFFFF',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDesc: {
    fontSize: theme.typography.size.sm,
    color: '#94A3B8',
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
