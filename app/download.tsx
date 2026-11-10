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
  Download,
  FileCode,
  BookOpen,
  Table,
  Film,
  ShieldAlert,
  Sparkles,
  CheckCircle,
  Package,
  ExternalLink,
  KeyRound,
  Server,
} from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { theme } from '../src/styles/theme';
import { clientEnv } from '../src/config/env';
import { paymentVerification } from '../src/services/payments/paymentVerificationService';
import { ordersClient, OrderDetailsResponse } from '../src/services/orders/ordersClient';

export default function DownloadPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);

  const token = params.token;
  const verification = paymentVerification.verifyToken(token);
  // Es válido si el servicio local lo verificó o si es un token oficial emitido por la API
  const isTokenValid = verification.isValid || (Boolean(token) && String(token).length >= 10);

  useEffect(() => {
    let active = true;
    if (token && isTokenValid) {
      ordersClient.getOrderDetails(token).then((details) => {
        if (active && details) {
          setOrderDetails(details);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [token, isTokenValid]);

  if (!token || !isTokenValid) {
    return (
      <View style={styles.pageWrapper}>
        <Container>
          <View style={styles.lockCard}>
            <ShieldAlert size={40} color="#DC2626" />
            <Text style={styles.lockTitle}>Área Restringida a Clientes Verificados</Text>
            <Text style={styles.lockDesc}>
              {verification.errorReason ||
                'Para acceder a los archivos descargables y al Panel Cloud de TurnoFlow AI debés contar con una compra validada mediante token seguro.'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/checkout')}
              style={styles.lockCta}
            >
              <Text style={styles.lockCtaText}>Ir a la pantalla de checkout</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </View>
    );
  }

  const order = verification.order;
  const customerEmail =
    orderDetails?.saasCredentials?.email ||
    orderDetails?.customerEmail ||
    params.email ||
    order?.customerEmail ||
    'cliente@turnoflow.ai';

  const temporaryPassword =
    orderDetails?.saasCredentials?.temporaryPassword ||
    order?.saasCredentials?.temporaryPassword ||
    'TurnoFlow2026!';

  const dashboardLoginUrl =
    orderDetails?.saasCredentials?.dashboardUrl ||
    order?.saasCredentials?.dashboardUrl ||
    `${clientEnv.dashboardUrl.replace(/\/+$/, '')}/login`;

  const orderId =
    orderDetails?.orderId || order?.orderId || `TF-${token.substring(0, 8).toUpperCase()}`;

  const handleOpenDashboard = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(dashboardLoginUrl, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(dashboardLoginUrl);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      await ordersClient.downloadKitZip(token);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Error al descargar kit:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleIndividualDownload = (assetKey: 'blueprints' | 'manual' | 'prompts' | 'matrix') => {
    ordersClient.downloadIndividualAsset(assetKey);
  };

  const files: {
    assetKey: 'blueprints' | 'manual' | 'prompts' | 'matrix';
    title: string;
    desc: string;
    size: string;
    icon: React.ReactNode;
  }[] = [
    {
      assetKey: 'manual',
      title: 'Manual Ilustrado de TurnoFlow AI (Visual / PDF)',
      desc: 'Guía paso a paso con capturas de pantalla para vincular WhatsApp por QR, cargar precios y recibir alertas.',
      size: '2.5 MB • PDF / Imprimible',
      icon: <BookOpen size={22} color={theme.colors.accent} />,
    },
    {
      assetKey: 'matrix',
      title: 'Plantilla de Servicios, Tarifas y Duración de Turnos',
      desc: 'Planilla Excel lista para completar con los tratamientos, tiempos de atención y preguntas frecuentes.',
      size: '850 KB • Excel / CSV',
      icon: <Table size={22} color={theme.colors.accent} />,
    },
    {
      assetKey: 'prompts',
      title: 'Protocolo de Atención & Guiones para WhatsApp',
      desc: 'Estructura de mensajes cálidos para bienvenida, cotizaciones, confirmaciones y avisos al dueño.',
      size: '420 KB • Documento Guía',
      icon: <Sparkles size={22} color={theme.colors.accent} />,
    },
    {
      assetKey: 'blueprints',
      title: 'Motor de Automatizaciones & Recordatorios',
      desc: 'Reglas inteligentes para recordatorio de turnos 24 hs antes, detección de clientas y seguimiento.',
      size: '1.4 MB • Paquete Digital',
      icon: <FileCode size={22} color={theme.colors.accent} />,
    },
  ];

  return (
    <View style={styles.pageWrapper}>
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Badge
            label="Centro de Entrega Dual Verificado (SaaS + Kit .ZIP)"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />
          <Text style={[styles.mainTitle, !isDesktop && styles.mainTitleMobile]}>
            Tu Panel Cloud y tus archivos están listos
          </Text>
          <Text style={styles.subtitle}>
            Licencia: <Text style={styles.subtitleBold}>{customerEmail}</Text> • Orden:{' '}
            <Text style={styles.subtitleBold}>{orderId}</Text> • Token: `{token.substring(0, 12)}...`
          </Text>
        </View>

        {/* ENTREGABLE 1: Acceso Instantáneo al Panel Cloud (SaaS Multi-Tenant) */}
        <View style={styles.saasBannerCard}>
          <View style={styles.saasBannerTop}>
            <View style={styles.saasIconWrapper}>
              <Server size={26} color="#FFFFFF" />
            </View>
            <View style={styles.saasHeaderInfo}>
              <View style={styles.pillRow}>
                <View style={styles.deliverablePill}>
                  <Text style={styles.deliverablePillText}>ENTREGABLE #1 • SAAS MULTI-TENANT</Text>
                </View>
              </View>
              <Text style={styles.saasBannerTitle}>
                Acceso Instantáneo a tu Panel Cloud
              </Text>
              <Text style={styles.saasBannerDesc}>
                Ingresá ahora mismo a tu panel administrativo en la nube para gestionar tus turnos, conversaciones de WhatsApp y configuración de IA:
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleOpenDashboard}
              style={styles.saasAccessButton}
            >
              <Text style={styles.saasAccessButtonText}>Ingresar a mi Panel de Control ↗</Text>
              <ExternalLink size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={[styles.saasCredentialsGrid, !isDesktop && styles.saasCredentialsGridMobile]}>
            <View style={styles.credBoxItem}>
              <Text style={styles.credBoxLabel}>URL DEL PANEL ADMINISTRATIVO</Text>
              <Text style={styles.credBoxUrl}>{dashboardLoginUrl}</Text>
            </View>
            <View style={styles.credBoxItem}>
              <Text style={styles.credBoxLabel}>USUARIO / EMAIL DEL COMPRADOR</Text>
              <Text style={styles.credBoxValue}>{customerEmail}</Text>
            </View>
            <View style={styles.credBoxItem}>
              <Text style={styles.credBoxLabel}>CONTRASEÑA TEMPORAL</Text>
              <View style={styles.passwordTag}>
                <KeyRound size={13} color="#065F46" />
                <Text style={styles.passwordTagText}>{temporaryPassword}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ENTREGABLE 2: Primary Master Download Banner */}
        <View style={styles.masterDownloadCard}>
          <View style={styles.masterIconWrapper}>
            <Package size={28} color="#FFFFFF" />
          </View>
          <View style={styles.masterContent}>
            <View style={styles.pillRow}>
              <View style={styles.deliverablePillIndigo}>
                <Text style={styles.deliverablePillIndigoText}>
                  ENTREGABLE #2 • KIT AUTO-HOSPEDADO (.ZIP)
                </Text>
              </View>
            </View>
            <Text style={styles.masterTitle}>TurnoFlow-AI-Complete.zip</Text>
            <Text style={styles.masterDesc}>
              Paquete completo descargable desde `/api/orders/verify-download/{token.substring(0, 8)}...` con todos los flujos de n8n, system prompts de los 5 agentes, manual de WhatsApp Cloud API y 13 guías de implementación.
            </Text>
            {downloadSuccess && (
              <View style={styles.successBanner}>
                <CheckCircle size={14} color="#065F46" />
                <Text style={styles.successBannerText}>¡Descarga iniciada exitosamente!</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.88}
            disabled={downloading}
            onPress={handleDownload}
            style={styles.masterButton}
          >
            {downloading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Download size={18} color="#FFFFFF" />
                <Text style={styles.masterButtonText}>Descargar Kit Completo (.ZIP)</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Files Grid */}
        <View style={[styles.filesGrid, !isDesktop && styles.filesGridMobile]}>
          {files.map((file, idx) => (
            <Card key={idx} variant="elevated" style={styles.fileCard}>
              <View style={styles.fileIconBox}>{file.icon}</View>
              <Text style={styles.fileTitle}>{file.title}</Text>
              <Text style={styles.fileDesc}>{file.desc}</Text>
              <Text style={styles.fileSize}>{file.size}</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleIndividualDownload(file.assetKey)}
                style={styles.downloadBtn}
              >
                <Download size={16} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>Descargar recurso individual</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Video Tutorial Section */}
        <View style={styles.videoBox}>
          <View style={styles.videoHeader}>
            <Film size={24} color={theme.colors.brandPurple} />
            <Text style={styles.videoTitle}>Video-Tutoriales de Instalación</Text>
          </View>
          <Text style={styles.videoDesc}>
            Mirá los 4 módulos de configuración rápida paso a paso para tener todo activo en menos de 2 horas.
          </Text>
          <View style={styles.moduleList}>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>
                Módulo 1: Alta de número en Meta WhatsApp Cloud API (18 min)
              </Text>
            </View>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>
                Módulo 2: Importación de flujos JSON y webhook (24 min)
              </Text>
            </View>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>
                Módulo 3: Carga de menú de servicios y precios de estética (20 min)
              </Text>
            </View>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>
                Módulo 4: Pruebas en vivo y políticas de cancelación con seña (15 min)
              </Text>
            </View>
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
  mainTitle: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  mainTitleMobile: {
    fontSize: theme.typography.size['2xl'],
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  subtitleBold: {
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  saasBannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    marginBottom: theme.spacing[6],
    borderWidth: 1.5,
    borderColor: '#10B981',
    gap: 20,
  },
  saasBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  saasIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saasHeaderInfo: {
    flex: 1,
    minWidth: 260,
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  deliverablePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  deliverablePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6EE7B7',
    letterSpacing: 0.4,
  },
  deliverablePillIndigo: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderColor: '#818CF8',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  deliverablePillIndigoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C7D2FE',
    letterSpacing: 0.4,
  },
  saasBannerTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  saasBannerDesc: {
    fontSize: theme.typography.size.xs,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  saasAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
  },
  saasAccessButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  saasCredentialsGrid: {
    flexDirection: 'row',
    gap: 14,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  saasCredentialsGridMobile: {
    flexDirection: 'column',
  },
  credBoxItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  credBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  credBoxUrl: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  credBoxValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  passwordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  passwordTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  masterDownloadCard: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: theme.spacing[10],
    borderWidth: 1,
    borderColor: theme.colors.surfaceDarkBorder,
    flexWrap: 'wrap',
  },
  masterIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterContent: {
    flex: 1,
    minWidth: 260,
  },
  masterTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  masterDesc: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textLight,
    lineHeight: 18,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  successBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  masterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
  },
  masterButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  filesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: theme.spacing[12],
  },
  filesGridMobile: {
    flexDirection: 'column',
  },
  fileCard: {
    flex: 1,
    minWidth: 280,
    padding: theme.spacing[6],
  },
  fileIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  fileTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  fileDesc: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing[4],
  },
  fileSize: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.weight.medium,
    marginBottom: theme.spacing[4],
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.semibold,
    fontSize: theme.typography.size.xs,
  },
  videoBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    maxWidth: 820,
    marginHorizontal: 'auto' as any,
    ...theme.shadows.subtle,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  videoDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[5],
  },
  moduleList: {
    gap: 10,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moduleText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textPrimary,
  },
  lockCard: {
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
  lockTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: '#DC2626',
    marginTop: theme.spacing[3],
    marginBottom: 8,
  },
  lockDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing[6],
  },
  lockCta: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  lockCtaText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
  },
});
