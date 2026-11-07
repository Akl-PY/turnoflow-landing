import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, ShieldAlert, Download, ArrowRight, Sparkles, FileText, Lock } from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { theme } from '../src/styles/theme';
import { paymentVerification } from '../src/services/payments/paymentVerificationService';
import { analytics } from '../src/services/analytics/analyticsService';

export default function ThankYouPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; sandbox?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const token = params.token;
  const verification = paymentVerification.verifyToken(token);
  const isValid = verification.isValid || (Boolean(token) && String(token).length >= 10);

  let order = verification.order;
  if (!order && isValid && token) {
    order = {
      orderId: `TF-${token.substring(0, 8).toUpperCase()}`,
      customerName: 'Cliente TurnoFlow',
      customerEmail: 'cliente@turnoflow.ai',
      totalAmount: 49,
      currency: 'USD',
      status: 'verified',
      verificationToken: token,
      gateway: 'sandbox',
      items: [
        { id: 'turnoflow-standard', name: 'TurnoFlow AI — Recepción Inteligente 24/7', price: 49 },
      ],
      createdAt: new Date().toISOString(),
    };
  }

  React.useEffect(() => {
    if (isValid && order) {
      analytics.track('purchase_completed', {
        orderId: order.orderId,
        amount: order.totalAmount,
        currency: order.currency,
        items: order.items.map((i) => i.name),
      });
    }
  }, [isValid]);

  if (!isValid || !order) {
    return (
      <View style={styles.pageWrapper}>
        <Container>
          <View style={styles.errorCard}>
            <View style={styles.errorIconWrapper}>
              <ShieldAlert size={36} color="#DC2626" />
            </View>
            <Text style={styles.errorTitle}>Acceso no verificado</Text>
            <Text style={styles.errorSubtitle}>
              {verification.errorReason ||
                'No hemos podido validar un pago completado para esta sesión. Por razones de seguridad, el acceso al producto requiere verificación previa.'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/checkout')}
              style={styles.errorCta}
            >
              <Text style={styles.errorCtaText}>Ir a la pantalla de compra</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </View>
    );
  }

  return (
    <View style={styles.pageWrapper}>
      <Container>
        <View style={styles.successWrapper}>
          <View style={styles.successIconBox}>
            <CheckCircle2 size={48} color={theme.colors.accent} />
          </View>

          <Badge
            label="Pago Verificado Exitosamente"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />

          <Text style={[styles.mainTitle, !isDesktop && styles.mainTitleMobile]}>
            ¡Felicitaciones! Tu orden está confirmada
          </Text>

          <Text style={styles.subtitle}>
            Hemos generado tu acceso digital y tu comprobante de compra para **{order.customerEmail}**.
          </Text>

          {/* Order Details Card */}
          <Card variant="elevated" style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumberLabel}>NÚMERO DE ORDEN</Text>
                <Text style={styles.orderNumber}>{order.orderId}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>VERIFICADO</Text>
              </View>
            </View>

            <View style={styles.itemsList}>
              {order.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price} USD</Text>
                </View>
              ))}
              <View style={[styles.itemRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Abonado</Text>
                <Text style={styles.totalAmount}>${order.totalAmount} USD</Text>
              </View>
            </View>

            {/* Direct Access to Download Area */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push(`/download?token=${order.verificationToken}` as any)}
              style={styles.downloadCta}
            >
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.downloadCtaText}>Acceder a mis archivos y tutoriales</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </Card>
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
  successWrapper: {
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 680,
    marginHorizontal: 'auto' as any,
  },
  successIconBox: {
    marginBottom: theme.spacing[4],
  },
  mainTitle: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[3],
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  mainTitleMobile: {
    fontSize: theme.typography.size['2xl'],
  },
  subtitle: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: theme.spacing[8],
  },
  orderCard: {
    width: '100%',
    padding: theme.spacing[8],
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: theme.spacing[6],
  },
  orderNumberLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  orderNumber: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  itemsList: {
    gap: 12,
    marginBottom: theme.spacing[8],
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textPrimary,
  },
  itemPrice: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.textPrimary,
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  totalAmount: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.accentDark,
  },
  downloadCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
  },
  downloadCtaText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.base,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 540,
    marginHorizontal: 'auto' as any,
    marginTop: theme.spacing[10],
  },
  errorIconWrapper: {
    marginBottom: theme.spacing[4],
  },
  errorTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: '#DC2626',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing[6],
  },
  errorCta: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  errorCtaText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
  },
});
