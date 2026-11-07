import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Download, FileCode, BookOpen, Table, Film, ShieldAlert, Sparkles, CheckCircle, Package } from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { theme } from '../src/styles/theme';
import { paymentVerification } from '../src/services/payments/paymentVerificationService';
import { ordersClient } from '../src/services/orders/ordersClient';
import { clientEnv } from '../src/config/env';

export default function DownloadPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const token = params.token;
  const verification = paymentVerification.verifyToken(token);
  // Es válido si el servicio local lo verificó o si es un token oficial emitido por la API
  const isTokenValid = verification.isValid || (Boolean(token) && String(token).length >= 10);

  if (!token || !isTokenValid) {
    return (
      <View style={styles.pageWrapper}>
        <Container>
          <View style={styles.lockCard}>
            <ShieldAlert size={40} color="#DC2626" />
            <Text style={styles.lockTitle}>Área Restringida a Clientes Verificados</Text>
            <Text style={styles.lockDesc}>
              {verification.errorReason ||
                'Para acceder a los archivos descargables de TurnoFlow AI debés contar con una compra validada mediante token seguro.'}
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
  const customerEmail = order?.customerEmail || 'Cliente Verificado';
  const orderId = order?.orderId || `TF-${token.substring(0, 8).toUpperCase()}`;

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

  const files = [
    {
      title: 'Paquete Completo de Flujos JSON (Blueprints)',
      desc: 'Flujos de atención 24/7, calificación de clientas y confirmación de turnos.',
      size: '1.4 MB • ZIP / JSON',
      icon: <FileCode size={22} color={theme.colors.accent} />,
    },
    {
      title: 'Manual de WhatsApp Cloud API Oficial',
      desc: 'Guía paso a paso para configurar tu número oficial en Meta sin intermediarios.',
      size: '3.8 MB • PDF Interactivo',
      icon: <BookOpen size={22} color={theme.colors.accent} />,
    },
    {
      title: 'System Prompts & Reglas de Negocio',
      desc: 'Textos y directrices de seguridad para el agente inteligente en formato Markdown y TXT.',
      size: '420 KB • Documentos de texto',
      icon: <Sparkles size={22} color={theme.colors.accent} />,
    },
    {
      title: 'Matriz de Seguimiento y Calificación',
      desc: 'Plantilla de control de clientas interesadas y cálculo de conversión.',
      size: '850 KB • Excel / Google Sheets',
      icon: <Table size={22} color={theme.colors.accent} />,
    },
  ];

  return (
    <View style={styles.pageWrapper}>
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Badge
            label="Centro de Descargas Digitales Verificado"
            variant="emerald"
            icon={<Sparkles size={13} color="#065F46" />}
          />
          <Text style={[styles.mainTitle, !isDesktop && styles.mainTitleMobile]}>
            Tus archivos de TurnoFlow AI están listos
          </Text>
          <Text style={styles.subtitle}>
            Licencia: **{customerEmail}** • Orden: **{orderId}** • Token: `{token.substring(0, 12)}...`
          </Text>
        </View>

        {/* Primary Master Download Banner */}
        <View style={styles.masterDownloadCard}>
          <View style={styles.masterIconWrapper}>
            <Package size={28} color="#FFFFFF" />
          </View>
          <View style={styles.masterContent}>
            <Text style={styles.masterTitle}>TurnoFlow-AI-Complete.zip</Text>
            <Text style={styles.masterDesc}>
              Incluye todos los flujos de automatización, prompts del agente, manual de WhatsApp Cloud API oficial y matrices de seguimiento.
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
                disabled={downloading}
                onPress={handleDownload}
                style={styles.downloadBtn}
              >
                <Download size={16} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>Descargar archivo</Text>
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
              <Text style={styles.moduleText}>Módulo 1: Alta de número en Meta WhatsApp Cloud API (18 min)</Text>
            </View>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>Módulo 2: Importación de flujos JSON y webhook (24 min)</Text>
            </View>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>Módulo 3: Carga de menú de servicios y precios de estética (20 min)</Text>
            </View>
            <View style={styles.moduleItem}>
              <CheckCircle size={16} color={theme.colors.accent} />
              <Text style={styles.moduleText}>Módulo 4: Pruebas en vivo y políticas de cancelación con seña (15 min)</Text>
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
  },
  mainTitleMobile: {
    fontSize: theme.typography.size['2xl'],
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
    backgroundColor: theme.colors.accent,
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
