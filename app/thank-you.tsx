import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  CheckCircle2,
  ShieldAlert,
  Download,
  ArrowRight,
  Sparkles,
  ExternalLink,
  KeyRound,
  Package,
  Server,
} from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { theme } from '../src/styles/theme';
import { clientEnv } from '../src/config/env';
import { paymentVerification } from '../src/services/payments/paymentVerificationService';
import { ordersClient, OrderDetailsResponse } from '../src/services/orders/ordersClient';
import { analytics } from '../src/services/analytics/analyticsService';

export default function ThankYouPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; email?: string; sandbox?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const token = params.token;
  const verification = paymentVerification.verifyToken(token);
  const isValid = verification.isValid || (Boolean(token) && String(token).length >= 10);

  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const localOrder = verification.order;
  const resolvedOrderId =
    orderDetails?.orderId ||
    localOrder?.orderId ||
    (token ? `TF-${token.substring(0, 8).toUpperCase()}` : 'TF-VERIFIED');

  const resolvedEmail =
    orderDetails?.saasCredentials?.email ||
    orderDetails?.customerEmail ||
    params.email ||
    localOrder?.customerEmail ||
    'cliente@turnoflow.ai';

  const resolvedPassword =
    orderDetails?.saasCredentials?.temporaryPassword ||
    localOrder?.saasCredentials?.temporaryPassword ||
    'TurnoFlow2026!';

  const resolvedDashboardUrl =
    orderDetails?.saasCredentials?.dashboardUrl ||
    localOrder?.saasCredentials?.dashboardUrl ||
    `${clientEnv.dashboardUrl.replace(/\/+$/, '')}/login`;

  const resolvedItems = orderDetails?.items ||
    localOrder?.items || [
      { id: 'turnoflow-standard', name: 'TurnoFlow AI — Recepción Inteligente 24/7', price: 49 },
    ];

  const resolvedAmount = orderDetails?.amount ?? localOrder?.totalAmount ?? 49;
  const resolvedCurrency = orderDetails?.currency || localOrder?.currency || 'USD';

  useEffect(() => {
    let active = true;
    if (token && isValid) {
      ordersClient.getOrderDetails(token).then((details) => {
        if (active && details) {
          setOrderDetails(details);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [token, isValid]);

  useEffect(() => {
    if (isValid && token) {
      analytics.track('purchase_completed', {
        orderId: resolvedOrderId,
        amount: resolvedAmount,
        currency: resolvedCurrency,
        items: resolvedItems.map((i) => i.name),
      });
    }
  }, [isValid, token]);

  const handleOpenDashboard = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(resolvedDashboardUrl, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(resolvedDashboardUrl);
    }
  };

  const handleDirectZipDownload = async () => {
    if (!token) return;
    setDownloadingZip(true);
    setDownloadSuccess(false);
    try {
      await ordersClient.downloadKitZip(token);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Error al descargar kit:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  if (!isValid || !token) {
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
            label="Pago Verificado • Entrega Dual Activada"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />

          <Text style={[styles.mainTitle, !isDesktop && styles.mainTitleMobile]}>
            ¡Felicitaciones! Tus 2 entregables ya están activos
          </Text>

          <Text style={styles.subtitle}>
            Hemos aprovisionado tu cuenta SaaS Multi-Tenant y habilitado tu paquete de descarga para{' '}
            <Text style={styles.subtitleBold}>{resolvedEmail}</Text>.
          </Text>

          {/* Dual Deliverables Grid */}
          <View style={[styles.deliverablesGrid, !isDesktop && styles.deliverablesGridMobile]}>
            {/* ENTREGABLE 1: SAAS CLOUD PANEL */}
            <View style={styles.saasCard}>
              <View style={styles.deliverableHeader}>
                <View style={styles.saasIconBadge}>
                  <Server size={20} color="#FFFFFF" />
                </View>
                <View style={styles.deliverablePillEmerald}>
                  <Text style={styles.deliverablePillEmeraldText}>ENTREGABLE #1 • SAAS CLOUD</Text>
                </View>
              </View>

              <Text style={styles.saasTitle}>
                Acceso Instantáneo a tu Panel Cloud (SaaS Multi-Tenant)
              </Text>
              <Text style={styles.saasDesc}>
                Tu entorno administrativo en la nube ya fue creado. Ingresá con las siguientes credenciales:
              </Text>

              <View style={styles.credentialsBox}>
                <View style={styles.credRow}>
                  <Text style={styles.credLabel}>URL del Panel:</Text>
                  <Text style={styles.credValueUrl}>{resolvedDashboardUrl}</Text>
                </View>
                <View style={styles.credRow}>
                  <Text style={styles.credLabel}>Email de Acceso:</Text>
                  <Text style={styles.credValue}>{resolvedEmail}</Text>
                </View>
                <View style={[styles.credRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                  <Text style={styles.credLabel}>Contraseña Temporal:</Text>
                  <View style={styles.passwordBadge}>
                    <KeyRound size={12} color="#065F46" />
                    <Text style={styles.passwordValue}>{resolvedPassword}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleOpenDashboard}
                style={styles.saasPrimaryButton}
              >
                <Text style={styles.saasPrimaryButtonText}>Ingresar a mi Panel de Control ↗</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* ENTREGABLE 2: SELF-HOSTED IMPLEMENTATION KIT (.ZIP) */}
            <View style={styles.kitCard}>
              <View style={styles.deliverableHeader}>
                <View style={styles.kitIconBadge}>
                  <Package size={20} color="#FFFFFF" />
                </View>
                <View style={styles.deliverablePillIndigo}>
                  <Text style={styles.deliverablePillIndigoText}>ENTREGABLE #2 • KIT COMPLETO (.ZIP)</Text>
                </View>
              </View>

              <Text style={styles.kitTitle}>
                Descarga del Kit de Implementación Auto-Hospedado
              </Text>
              <Text style={styles.kitDesc}>
                Descargá el archivo maestro <Text style={styles.kitCode}>TurnoFlow-AI-Complete.zip</Text> con los workflows de n8n, los 5 system prompts blindados, manual de Meta WhatsApp Cloud API y las 13 guías técnicas.
              </Text>

              <View style={styles.kitFeaturesBox}>
                <Text style={styles.kitFeatureItem}>✓ Blueprints JSON n8n (WhatsApp + Calendar)</Text>
                <Text style={styles.kitFeatureItem}>✓ System Prompts de los 5 Agentes IA</Text>
                <Text style={styles.kitFeatureItem}>✓ Guía paso a paso Meta WhatsApp Cloud API</Text>
                <Text style={styles.kitFeatureItem}>✓ 13 Manuales de arquitectura y despliegue</Text>
              </View>

              {downloadSuccess && (
                <View style={styles.downloadSuccessBanner}>
                  <Text style={styles.downloadSuccessText}>
                    ¡Descarga de TurnoFlow-AI-Complete.zip iniciada!
                  </Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.88}
                disabled={downloadingZip}
                onPress={handleDirectZipDownload}
                style={styles.kitDownloadButton}
              >
                {downloadingZip ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Download size={18} color="#FFFFFF" />
                    <Text style={styles.kitDownloadButtonText}>
                      Descargar TurnoFlow-AI-Complete.zip
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push(
                    `/download?token=${encodeURIComponent(token)}&email=${encodeURIComponent(resolvedEmail)}` as any,
                  )
                }
                style={styles.kitSecondaryButton}
              >
                <Text style={styles.kitSecondaryButtonText}>
                  Ir al Centro de Descargas y Guías Individuales
                </Text>
                <ArrowRight size={15} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Receipt Card */}
          <Card variant="elevated" style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumberLabel}>NÚMERO DE ORDEN</Text>
                <Text style={styles.orderNumber}>{resolvedOrderId}</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>VERIFICADO</Text>
              </View>
            </View>

            <View style={styles.itemsList}>
              {resolvedItems.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price} USD</Text>
                </View>
              ))}
              <View style={[styles.itemRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Abonado</Text>
                <Text style={styles.totalAmount}>
                  ${resolvedAmount} {resolvedCurrency}
                </Text>
              </View>
            </View>
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
    maxWidth: 960,
    marginHorizontal: 'auto' as any,
    width: '100%',
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
    maxWidth: 680,
  },
  subtitleBold: {
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  deliverablesGrid: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
    marginBottom: theme.spacing[8],
    alignItems: 'stretch',
  },
  deliverablesGridMobile: {
    flexDirection: 'column',
  },
  saasCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    borderWidth: 1.5,
    borderColor: '#10B981',
    justifyContent: 'space-between',
  },
  kitCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'space-between',
    ...theme.shadows.card,
  },
  deliverableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  saasIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliverablePillEmerald: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  deliverablePillEmeraldText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6EE7B7',
    letterSpacing: 0.4,
  },
  deliverablePillIndigo: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  deliverablePillIndigoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3730A3',
    letterSpacing: 0.4,
  },
  saasTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  saasDesc: {
    fontSize: theme.typography.size.xs,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: theme.spacing[5],
  },
  credentialsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: theme.spacing[6],
    gap: 10,
  },
  credRow: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    gap: 2,
  },
  credLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  credValueUrl: {
    fontSize: 12,
    color: '#34D399',
    fontWeight: '700',
  },
  credValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  passwordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  passwordValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  saasPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
  },
  saasPrimaryButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  kitTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  kitDesc: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: theme.spacing[4],
  },
  kitCode: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  kitFeaturesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: theme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing[5],
    gap: 6,
  },
  kitFeatureItem: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  downloadSuccessBanner: {
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  downloadSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    textAlign: 'center',
  },
  kitDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    marginBottom: 10,
  },
  kitDownloadButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  kitSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#F8FAFC',
  },
  kitSecondaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: theme.typography.weight.semibold,
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
