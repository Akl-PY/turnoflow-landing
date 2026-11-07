import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, Zap } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { analytics } from '../../services/analytics/analyticsService';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleCtaPrimary = () => {
    analytics.track('cta_clicked', { ctaText: 'Quiero automatizar mi negocio', location: 'Hero' });
    router.push('/checkout');
  };

  const handleCtaSecondary = () => {
    analytics.track('cta_clicked', { ctaText: 'Ver cómo funciona', location: 'Hero' });
    router.push('/sales');
  };

  return (
    <View style={styles.heroWrapper}>
      {/* Subtle Background Glow */}
      <View style={styles.glowDecoration} />

      <Container>
        <View style={styles.heroContent}>
          {/* Top Pill Badge */}
          <Badge
            label="Recepción Inteligente 24/7 para Salones y Estética"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
            style={styles.heroBadge}
          />

          {/* Main Title */}
          <Text style={[styles.mainTitle, !isDesktop && styles.mainTitleMobile]}>
            Dejá de perder clientes por no responder a tiempo.
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, !isDesktop && styles.subtitleMobile]}>
            Implementá un sistema de recepción inteligente que responde consultas, organiza potenciales clientes y facilita la gestión de turnos de tu negocio.
          </Text>

          {/* CTA Buttons Row */}
          <View style={[styles.ctaRow, !isDesktop && styles.ctaRowMobile]}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleCtaPrimary}
              style={styles.primaryCta}
            >
              <Text style={styles.primaryCtaText}>Quiero automatizar mi negocio</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCtaSecondary}
              style={styles.secondaryCta}
            >
              <Play size={16} color={theme.colors.textPrimary} />
              <Text style={styles.secondaryCtaText}>Ver cómo funciona</Text>
            </TouchableOpacity>
          </View>

          {/* Value Highlights */}
          <View style={[styles.highlightsRow, !isDesktop && styles.highlightsRowMobile]}>
            <View style={styles.highlightItem}>
              <CheckCircle2 size={16} color={theme.colors.accent} />
              <Text style={styles.highlightText}>Respuestas en menos de 3 seg</Text>
            </View>
            <View style={styles.highlightItem}>
              <CheckCircle2 size={16} color={theme.colors.accent} />
              <Text style={styles.highlightText}>WhatsApp Cloud API oficial</Text>
            </View>
            <View style={styles.highlightItem}>
              <CheckCircle2 size={16} color={theme.colors.accent} />
              <Text style={styles.highlightText}>Sin mensualidades obligatorias</Text>
            </View>
          </View>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    paddingTop: theme.spacing[16],
    paddingBottom: theme.spacing[16],
    backgroundColor: '#FFFFFF',
    position: 'relative' as any,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  glowDecoration: {
    position: 'absolute' as any,
    top: -150,
    alignSelf: 'center',
    width: 600,
    height: 350,
    borderRadius: 300,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    // filter blur is simulated with opacity in RN
  },
  heroContent: {
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 880,
    marginHorizontal: 'auto' as any,
  },
  heroBadge: {
    marginBottom: theme.spacing[5],
  },
  mainTitle: {
    fontSize: theme.typography.size['5xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    textAlign: 'center',
    lineHeight: 56,
    letterSpacing: -1.2,
    marginBottom: theme.spacing[5],
  },
  mainTitleMobile: {
    fontSize: theme.typography.size['3xl'],
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontDisplay,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 720,
    marginBottom: theme.spacing[8],
  },
  subtitleMobile: {
    fontSize: theme.typography.size.base,
    lineHeight: 24,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: theme.spacing[10],
  },
  ctaRowMobile: {
    flexDirection: 'column',
    width: '100%',
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    fontFamily: theme.typography.fontDisplay,
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
  },
  secondaryCtaText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.semibold,
    fontFamily: theme.typography.fontDisplay,
  },
  highlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: theme.spacing[4],
  },
  highlightsRowMobile: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'flex-start',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontDisplay,
  },
});
