import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Smartphone, Sliders, CheckCircle, ArrowRight } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';

export const HowItWorksSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const steps = [
    {
      number: '01',
      title: 'Conectás tu número oficial',
      desc: 'Seguís nuestra guía paso a paso para vincular WhatsApp Cloud API oficial de Meta. Sin riesgos de suspensión de línea y sin pagar abonos mensuales a plataformas intermediarias.',
      badge: 'Menos de 20 min',
    },
    {
      number: '02',
      title: 'Cargás tus servicios y reglas',
      desc: 'Completás la plantilla con tu lista de tratamientos, precios, duración de cada servicio, horarios de atención y tu alias/CBU o link de Mercado Pago para la seña.',
      badge: 'Plantilla lista',
    },
    {
      number: '03',
      title: 'Tu recepción opera 24/7',
      desc: 'El agente responde al instante, resuelve dudas frecuentes, clasifica a cada interesada, ofrece huecos disponibles en la agenda y solicita la confirmación con seña.',
      badge: 'En piloto automático',
    },
  ];

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge label="Puesta en Marcha Rápida" variant="slate" />
          <Text style={styles.title}>Cómo funciona en tres sencillos pasos</Text>
          <Text style={styles.subtitle}>
            Diseñado para que cualquier dueña o recepcionista pueda ponerlo en marcha en una tarde, sin saber nada de programación.
          </Text>
        </View>

        <View style={[styles.stepsContainer, !isDesktop && styles.stepsContainerMobile]}>
          {steps.map((step, idx) => (
            <View key={idx} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>{step.number}</Text>
                <View style={styles.stepPill}>
                  <Text style={styles.stepPillText}>{step.badge}</Text>
                </View>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
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
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[12],
    maxWidth: 720,
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
  stepsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  stepsContainerMobile: {
    flexDirection: 'column',
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
    ...theme.shadows.subtle,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  stepNumber: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.accent,
    fontFamily: theme.typography.fontDisplay,
  },
  stepPill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepPillText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weight.medium,
  },
  stepTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
