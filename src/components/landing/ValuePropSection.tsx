import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Sparkles, Check, Zap, Layers, ShieldCheck, HeartHandshake } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';

export const ValuePropSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const pillars = [
    {
      title: 'Recepción Inteligente 24/7',
      desc: 'Atiende consultas a la medianoche, domingos o feriados. Ninguna clienta queda esperando.',
    },
    {
      title: 'Clasificación Automática de Interesadas',
      desc: 'Identifica si sólo preguntan precio o si quieren agendar hoy mismo, guiando la conversación hacia la reserva.',
    },
    {
      title: 'Cobro de Seña Integrado',
      desc: 'Solicita el comprobante bancario o link de pago antes de confirmar el turno para erradicar las inasistencias.',
    },
    {
      title: 'Derivación Humana Fluida',
      desc: 'Si una clienta tiene una duda técnica compleja o patología, transfiere el chat con su historial completo a tu equipo.',
    },
  ];

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge
            label="La Solución Concreta"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />
          <Text style={styles.title}>No es inteligencia abstracta: es tu negocio atendiendo sin parar</Text>
          <Text style={styles.subtitle}>
            TurnoFlow AI no es un chatbot tosco de botones rígidos. Es un sistema estructurado de atención comercial diseñado específicamente para los servicios de belleza y estética.
          </Text>
        </View>

        <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
          {pillars.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.iconCircle}>
                <Check size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[12],
    maxWidth: 780,
    marginHorizontal: 'auto' as any,
  },
  title: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[3],
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 25,
    fontFamily: theme.typography.fontDisplay,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    minWidth: 260,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  cardTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
