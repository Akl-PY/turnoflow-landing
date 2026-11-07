import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { siteConfig } from '../../config/site';
import { analytics } from '../../services/analytics/analyticsService';

export const PricingSection: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  const handleCheckoutStandard = () => {
    analytics.track('cta_clicked', { ctaText: 'Comprar Paquete Estandar', amount: 49 });
    router.push('/checkout');
  };

  const handleCheckoutWithUpsell = () => {
    analytics.track('cta_clicked', { ctaText: 'Comprar con Implementacion', amount: 298 });
    router.push('/checkout?upsell=true');
  };

  const mainProduct = siteConfig.pricing.mainProduct;
  const upsell = siteConfig.pricing.upsell;

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge
            label="Precio de Lanzamiento Internacional"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />
          <Text style={styles.title}>Una sola clienta recuperada paga toda la inversión</Text>
          <Text style={styles.subtitle}>
            Acceso vitalicio sin mensualidades obligatorias ni costos ocultos. Elegí la modalidad que mejor se adapte a tu ritmo.
          </Text>
        </View>

        <View style={[styles.pricingGrid, !isDesktop && styles.pricingGridMobile]}>
          {/* Card 1: Paquete Estándar ($49) */}
          <View style={[styles.card, styles.popularCard]}>
            <View style={styles.popularBanner}>
              <Text style={styles.popularBannerText}>MÁS ELEGIDO • OFERTA DE LANZAMIENTO</Text>
            </View>

            <View style={styles.cardPadding}>
              <Text style={styles.planName}>{mainProduct.name}</Text>
              <Text style={styles.planTagline}>{mainProduct.tagline}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.regularPrice}>${mainProduct.regularPrice} USD</Text>
                <View style={styles.launchPriceWrapper}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <Text style={styles.launchPriceNumber}>{mainProduct.launchPrice}</Text>
                  <Text style={styles.currencyCode}>USD</Text>
                </View>
                <Text style={styles.paymentTerms}>pago único • acceso de por vida</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleCheckoutStandard}
                style={styles.ctaPrimary}
              >
                <Text style={styles.ctaPrimaryText}>Quiero automatizar mi negocio</Text>
                <ArrowRight size={17} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.featuresHeader}>Todo lo incluido en tu acceso:</Text>
              <View style={styles.featuresList}>
                {mainProduct.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <View style={styles.checkIcon}>
                      <Check size={13} color="#065F46" />
                    </View>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Card 2: Implementación Personalizada Llave en Mano ($249) */}
          <View style={[styles.card, styles.upsellCard]}>
            <View style={styles.cardPadding}>
              <View style={styles.upsellBadge}>
                <Star size={13} color="#4338CA" />
                <Text style={styles.upsellBadgeText}>{upsell.badge}</Text>
              </View>

              <Text style={styles.planName}>{upsell.name}</Text>
              <Text style={styles.planTagline}>{upsell.description}</Text>

              <View style={styles.priceRow}>
                <View style={styles.launchPriceWrapper}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <Text style={styles.launchPriceNumber}>{upsell.price}</Text>
                  <Text style={styles.currencyCode}>USD</Text>
                </View>
                <Text style={styles.paymentTerms}>servicio completo llave en mano</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCheckoutWithUpsell}
                style={styles.ctaSecondary}
              >
                <Text style={styles.ctaSecondaryText}>Comprar con implementación</Text>
                <ArrowRight size={17} color={theme.colors.textPrimary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.featuresHeader}>El servicio técnico incluye:</Text>
              <View style={styles.featuresList}>
                {upsell.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <View style={styles.purpleCheckIcon}>
                      <Check size={13} color="#4338CA" />
                    </View>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Security / Guarantee bar */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={24} color={theme.colors.accent} />
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Garantía de Satisfacción y Soporte Técnico</Text>
            <Text style={styles.guaranteeText}>
              Comprobá la efectividad de TurnoFlow AI. Si encontrás cualquier dificultad técnica al implementarlo, nuestro equipo te asiste directamente para que quede operativo.
            </Text>
          </View>
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
  pricingGrid: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'stretch',
    maxWidth: 1040,
    marginHorizontal: 'auto' as any,
    marginBottom: theme.spacing[10],
  },
  pricingGridMobile: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  popularCard: {
    borderColor: theme.colors.accent,
    borderWidth: 2,
  },
  upsellCard: {
    borderColor: '#C7D2FE',
  },
  popularBanner: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 7,
    alignItems: 'center',
  },
  popularBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: theme.typography.weight.extrabold,
    letterSpacing: 0.8,
  },
  cardPadding: {
    padding: theme.spacing[8],
  },
  upsellBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.brandPurpleLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  upsellBadgeText: {
    fontSize: 11,
    color: '#3730A3',
    fontWeight: theme.typography.weight.bold,
  },
  planName: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 6,
  },
  planTagline: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing[6],
  },
  priceRow: {
    marginBottom: theme.spacing[6],
  },
  regularPrice: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  launchPriceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currencySymbol: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  launchPriceNumber: {
    fontSize: 48,
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    lineHeight: 52,
  },
  currencyCode: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textMuted,
    marginLeft: 4,
  },
  paymentTerms: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.accentDark,
    fontWeight: theme.typography.weight.semibold,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing[6],
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing[6],
  },
  ctaSecondaryText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginBottom: theme.spacing[6],
  },
  featuresHeader: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing[4],
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.accentSubtle,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  purpleCheckIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.brandPurpleLight,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  featureText: {
    flex: 1,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  guaranteeBox: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
    maxWidth: 820,
    marginHorizontal: 'auto' as any,
    alignItems: 'center',
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  guaranteeText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
