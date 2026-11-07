import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { analytics } from '../../services/analytics/analyticsService';

export const CtaSection: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleCta = () => {
    analytics.track('cta_clicked', { ctaText: 'Quiero automatizar mi negocio', location: 'Final CTA' });
    router.push('/checkout');
  };

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.box}>
          <View style={styles.badge}>
            <Sparkles size={14} color="#10B981" />
            <Text style={styles.badgeText}>Garantizá tus turnos en piloto automático</Text>
          </View>

          <Text style={[styles.title, !isDesktop && styles.titleMobile]}>
            Empezá a transformar tus consultas en reservas hoy mismo
          </Text>

          <Text style={styles.desc}>
            No dejes que otra clienta se vaya a la competencia por no responder a tiempo. Implementá TurnoFlow AI en tu negocio por solo $49 USD.
          </Text>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleCta}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Quiero automatizar mi negocio</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={[styles.trustRow, !isDesktop && styles.trustRowMobile]}>
            <View style={styles.trustItem}>
              <CheckCircle2 size={15} color="#10B981" />
              <Text style={styles.trustText}>Entrega digital inmediata</Text>
            </View>
            <View style={styles.trustItem}>
              <CheckCircle2 size={15} color="#10B981" />
              <Text style={styles.trustText}>Pago seguro verificado</Text>
            </View>
            <View style={styles.trustItem}>
              <CheckCircle2 size={15} color="#10B981" />
              <Text style={styles.trustText}>Soporte técnico directo</Text>
            </View>
          </View>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#FFFFFF',
  },
  box: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.radius.xl,
    paddingVertical: theme.spacing[16],
    paddingHorizontal: theme.spacing[8],
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto' as any,
    borderWidth: 1,
    borderColor: theme.colors.surfaceDarkBorder,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: theme.spacing[5],
  },
  badgeText: {
    color: '#34D399',
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
  },
  title: {
    fontSize: theme.typography.size['4xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontDisplay,
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 46,
    marginBottom: theme.spacing[4],
    maxWidth: 700,
  },
  titleMobile: {
    fontSize: theme.typography.size['2xl'],
    lineHeight: 32,
  },
  desc: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 620,
    marginBottom: theme.spacing[8],
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing[8],
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    fontFamily: theme.typography.fontDisplay,
  },
  trustRow: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  trustRowMobile: {
    flexDirection: 'column',
    gap: 10,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    color: '#94A3B8',
    fontSize: theme.typography.size.xs,
  },
});
