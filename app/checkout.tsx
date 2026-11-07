import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, Lock, CreditCard, Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { theme } from '../src/styles/theme';
import { siteConfig } from '../src/config/site';
import { CheckoutOrderSchema } from '../src/validations/schemas';
import { paymentRegistry } from '../src/services/payments/paymentRegistry';
import { PaymentGatewayId } from '../src/services/payments/types';
import { ordersClient } from '../src/services/orders/ordersClient';
import { analytics } from '../src/services/analytics/analyticsService';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ upsell?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [includeUpsell, setIncludeUpsell] = useState<boolean>(params.upsell === 'true');
  const [paymentGateway, setPaymentGateway] = useState<PaymentGatewayId>('sandbox');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    analytics.track('checkout_started', {
      planId: siteConfig.pricing.mainProduct.id,
      includeUpsell,
    });
  }, []);

  const availableGateways = paymentRegistry.getAvailableGateways();

  const mainPrice = siteConfig.pricing.mainProduct.launchPrice;
  const upsellPrice = siteConfig.pricing.upsell.price;
  const totalAmount = mainPrice + (includeUpsell ? upsellPrice : 0);

  const handleCheckout = async () => {
    setErrors({});

    const validation = CheckoutOrderSchema.safeParse({
      customerName,
      customerEmail,
      customerPhone,
      planId: siteConfig.pricing.mainProduct.id,
      includeUpsell,
      paymentGateway,
      termsAccepted,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Registrar sesión en @turnoflow/api (POST /api/orders/checkout-session)
      const orderSession = await ordersClient.createCheckoutSession({
        customerName,
        customerEmail,
        customerPhone,
        planId: siteConfig.pricing.mainProduct.id,
        amount: totalAmount,
        currency: 'USD',
        gateway: paymentGateway,
        includeUpsell,
      });

      const provider = paymentRegistry.getProvider(paymentGateway);
      const hostUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
      const emailParam = encodeURIComponent(orderSession.saasCredentials.email);
      const thankYouPath = `/thank-you?token=${orderSession.downloadToken}&email=${emailParam}`;

      if (paymentGateway === 'sandbox') {
        // Redirige directamente a la confirmación verificada con el token oficial y credenciales SaaS
        router.push(thankYouPath as any);
      } else {
        const session = await provider.createCheckoutSession({
          customerName,
          customerEmail,
          customerPhone,
          planId: siteConfig.pricing.mainProduct.id,
          includeUpsell,
          successUrl: `${hostUrl}${thankYouPath}`,
          cancelUrl: `${hostUrl}/checkout`,
        });

        if (typeof window !== 'undefined' && session.checkoutUrl.startsWith('http')) {
          window.location.href = session.checkoutUrl;
        } else {
          router.push(thankYouPath as any);
        }
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Error iniciando la sesión de pago. Por favor intente nuevamente.' });
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.pageWrapper}>
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Badge
            label="Proceso de Compra Seguro SSL de 256 bits"
            variant="emerald"
            icon={<Lock size={13} color="#065F46" />}
          />
          <Text style={styles.title}>Finalizá tu compra de TurnoFlow AI</Text>
          <Text style={styles.subtitle}>
            Acceso digital verificado de por vida inmediatamente después de confirmar tu orden.
          </Text>
        </View>

        <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
          {/* Left Col: Customer Information & Gateway Selection */}
          <View style={styles.formCol}>
            <Card variant="elevated" style={styles.formCard}>
              <Text style={styles.sectionHeading}>1. Datos del Comprador</Text>
              <Input
                label="Nombre y Apellido"
                placeholder="Ej: Sofía Martínez"
                value={customerName}
                onChangeText={setCustomerName}
                error={errors.customerName}
              />

              <Input
                label="Correo Electrónico (para entrega digital)"
                placeholder="sofia@estetica.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={customerEmail}
                onChangeText={setCustomerEmail}
                error={errors.customerEmail}
                helper="Aquí recibirás tu comprobante y claves de acceso digital."
              />

              <Input
                label="WhatsApp con código de país"
                placeholder="+54 9 11 9876-5432"
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                error={errors.customerPhone}
                helper="Para soporte técnico y coordinación del alta."
              />

              {/* Gateway Selection */}
              <Text style={[styles.sectionHeading, { marginTop: 16 }]}>2. Método de Pago</Text>
              <Text style={styles.gatewaySubtitle}>
                Seleccioná la pasarela con la que deseás abonar de forma segura:
              </Text>

              <View style={styles.gatewaysList}>
                {availableGateways.map((g) => {
                  const isSelected = paymentGateway === g.id;
                  return (
                    <TouchableOpacity
                      key={g.id}
                      activeOpacity={0.8}
                      onPress={() => setPaymentGateway(g.id)}
                      style={[styles.gatewayItem, isSelected && styles.gatewayItemSelected]}
                    >
                      <View style={styles.gatewayRow}>
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                        <Text style={[styles.gatewayName, isSelected && styles.gatewayNameActive]}>
                          {g.name}
                        </Text>
                      </View>
                      <View style={[styles.gatewayBadge, g.id === 'sandbox' ? styles.sandboxBadge : null]}>
                        <Text style={[styles.gatewayBadgeText, g.id === 'sandbox' ? styles.sandboxBadgeText : null]}>
                          {g.id === 'sandbox' ? 'Modo Prueba Verificado' : g.isConfigured ? 'Disponible' : 'Configurar API Key'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTermsAccepted(!termsAccepted)}
                style={styles.termsRow}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
                  {termsAccepted && <Check size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  Acepto los términos y condiciones de compra y la entrega de licencia digital de TurnoFlow AI.
                </Text>
              </TouchableOpacity>
              {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}

              {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

              <TouchableOpacity
                activeOpacity={0.88}
                disabled={isProcessing}
                onPress={handleCheckout}
                style={styles.payButton}
              >
                <CreditCard size={18} color="#FFFFFF" />
                <Text style={styles.payButtonText}>
                  {isProcessing ? 'Procesando sesión...' : `Pagar $${totalAmount} USD`}
                </Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Right Col: Order Summary & Optional Upsell */}
          <View style={styles.summaryCol}>
            <Card variant="default" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen de tu Orden</Text>

              {/* Main Product Item */}
              <View style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <Text style={styles.summaryItemName}>{siteConfig.pricing.mainProduct.name}</Text>
                  <Text style={styles.summaryItemTag}>
                    Entrega Dual: Acceso Panel Cloud SaaS + Kit Descargable (.ZIP)
                  </Text>
                </View>
                <Text style={styles.summaryItemPrice}>${mainPrice} USD</Text>
              </View>

              {/* Optional Upsell Checkbox Box */}
              <View style={[styles.upsellBox, includeUpsell && styles.upsellBoxActive]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIncludeUpsell(!includeUpsell)}
                  style={styles.upsellCheckboxRow}
                >
                  <View style={[styles.checkbox, includeUpsell && styles.checkboxActive]}>
                    {includeUpsell && <Check size={14} color="#FFFFFF" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.upsellBadgeRow}>
                      <Text style={styles.upsellTitle}>Agregar Implementación Personalizada</Text>
                      <View style={styles.upsellTag}>
                        <Text style={styles.upsellTagText}>+$249 USD</Text>
                      </View>
                    </View>
                    <Text style={styles.upsellDesc}>
                      Dejamos todo configurado por vos en 72 horas con tu número de WhatsApp y menú cargado.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Totals Breakdown */}
              <View style={styles.totalsList}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>${totalAmount} USD</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Impuestos / Tarifas de entrega</Text>
                  <Text style={styles.totalValue}>$0 USD (Digital)</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotalRow]}>
                  <Text style={styles.grandTotalLabel}>Total a Abonar</Text>
                  <Text style={styles.grandTotalValue}>${totalAmount} USD</Text>
                </View>
              </View>

              {/* Trust badges */}
              <View style={styles.trustBadges}>
                <View style={styles.trustItem}>
                  <ShieldCheck size={15} color={theme.colors.accent} />
                  <Text style={styles.trustBadgeText}>Acceso verificado por servidor</Text>
                </View>
                <View style={styles.trustItem}>
                  <Lock size={15} color={theme.colors.accent} />
                  <Text style={styles.trustBadgeText}>Encriptación segura de extremo a extremo</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#F8FAFC',
    minHeight: '80vh' as any,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[10],
    maxWidth: 720,
    marginHorizontal: 'auto' as any,
  },
  title: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: 28,
    alignItems: 'flex-start',
  },
  gridMobile: {
    flexDirection: 'column',
  },
  formCol: {
    flex: 1.3,
  },
  summaryCol: {
    flex: 1,
  },
  formCard: {
    padding: theme.spacing[8],
  },
  sectionHeading: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[4],
  },
  gatewaySubtitle: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  gatewaysList: {
    gap: 10,
    marginBottom: theme.spacing[6],
  },
  gatewayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: '#FFFFFF',
  },
  gatewayItemSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSubtle,
  },
  gatewayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: theme.colors.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  gatewayName: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weight.medium,
  },
  gatewayNameActive: {
    fontWeight: theme.typography.weight.bold,
  },
  gatewayBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sandboxBadge: {
    backgroundColor: '#DCFCE7',
  },
  gatewayBadgeText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  sandboxBadgeText: {
    color: '#065F46',
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: theme.spacing[5],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginBottom: 10,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    marginTop: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.base,
  },
  summaryCard: {
    padding: theme.spacing[8],
  },
  summaryTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[5],
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: theme.spacing[4],
  },
  summaryItemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  summaryItemName: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  summaryItemTag: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  summaryItemPrice: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  upsellBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: theme.spacing[6],
  },
  upsellBoxActive: {
    borderColor: '#818CF8',
    backgroundColor: '#EEF2FF',
  },
  upsellCheckboxRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  upsellBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  upsellTitle: {
    fontSize: 12,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  upsellTag: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  upsellTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3730A3',
  },
  upsellDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  totalsList: {
    gap: 8,
    marginBottom: theme.spacing[6],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weight.medium,
  },
  grandTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  grandTotalValue: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.accentDark,
  },
  trustBadges: {
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    gap: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustBadgeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
});
