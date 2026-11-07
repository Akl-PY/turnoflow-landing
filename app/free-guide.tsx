import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Gift, CheckCircle, Download, ArrowRight, ShieldCheck, Sparkles, BookOpen, Lock } from 'lucide-react-native';
import { Container } from '../src/components/layout/Container';
import { Badge } from '../src/components/ui/Badge';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { theme } from '../src/styles/theme';
import { siteConfig } from '../src/config/site';
import { LeadCaptureSchema } from '../src/validations/schemas';
import { leadStorage } from '../src/services/leads/leadStorageService';
import { analytics } from '../src/services/analytics/analyticsService';

export default function FreeGuidePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [businessType, setBusinessType] = useState<'estetica' | 'salon' | 'unas' | 'depilacion' | 'independiente' | 'otro'>('estetica');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [deliveredLead, setDeliveredLead] = useState<any>(null);

  React.useEffect(() => {
    analytics.track('lead_magnet_view');
  }, []);

  const handleSubmit = async () => {
    setErrors({});

    const validation = LeadCaptureSchema.safeParse({
      fullName,
      email,
      whatsapp,
      businessType,
      privacyConsent,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const fieldName = String(err.path[0]);
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await leadStorage.registerLead(validation.data, 'free-guide-page');
      setDeliveredLead(result.lead);
      setIsDelivered(true);
    } catch (err: any) {
      setErrors({ form: 'Ocurrió un error al procesar tu registro. Por favor reintentá.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleSnippet = siteConfig.leadMagnet.sampleSnippet;

  return (
    <View style={styles.pageWrapper}>
      <Container>
        {/* Header Hero */}
        <View style={styles.header}>
          <Badge
            label={siteConfig.leadMagnet.badge}
            variant="purple"
            icon={<Gift size={13} color="#4338CA" />}
          />
          <Text style={[styles.title, !isDesktop && styles.titleMobile]}>
            {siteConfig.leadMagnet.title}
          </Text>
          <Text style={styles.subtitle}>
            {siteConfig.leadMagnet.subtitle}
          </Text>
        </View>

        {!isDelivered ? (
          /* Pre-Conversion: Information + Form */
          <View style={[styles.contentGrid, !isDesktop && styles.contentGridMobile]}>
            {/* Left Column: Benefits & Real Snippet Preview */}
            <View style={styles.leftCol}>
              <Text style={styles.colTitle}>Lo que vas a encontrar en esta guía:</Text>
              <View style={styles.highlightsList}>
                {siteConfig.leadMagnet.highlights.map((h, idx) => (
                  <View key={idx} style={styles.highlightItem}>
                    <View style={styles.checkIcon}>
                      <CheckCircle size={16} color={theme.colors.accent} />
                    </View>
                    <Text style={styles.highlightText}>{h}</Text>
                  </View>
                ))}
              </View>

              {/* Real Content Preview */}
              <View style={styles.snippetCard}>
                <View style={styles.snippetHeader}>
                  <BookOpen size={16} color={theme.colors.accentDark} />
                  <Text style={styles.snippetHeaderText}>Ejemplo Real del Recetario:</Text>
                </View>
                <Text style={styles.snippetSituation}>{sampleSnippet.situation}</Text>
                <View style={styles.snippetWrong}>
                  <Text style={styles.snippetWrongText}>{sampleSnippet.wrongAnswer}</Text>
                </View>
                <View style={styles.snippetRight}>
                  <Text style={styles.snippetRightText}>{sampleSnippet.rightAnswer}</Text>
                </View>
              </View>

              <View style={styles.deliveryNote}>
                <ShieldCheck size={16} color={theme.colors.accent} />
                <Text style={styles.deliveryNoteText}>
                  Acceso digital directo. No enviamos spam ni compartimos tus datos con terceros.
                </Text>
              </View>
            </View>

            {/* Right Column: Lead Form */}
            <View style={styles.rightCol}>
              <Card variant="elevated" style={styles.formCard}>
                <Text style={styles.formTitle}>Descargá tu copia gratuita ahora</Text>
                <Text style={styles.formSubtitle}>Completá tus datos para acceder al material de inmediato.</Text>

                <Input
                  label="Nombre y Apellido"
                  placeholder="Ej: Laura Gómez"
                  value={fullName}
                  onChangeText={setFullName}
                  error={errors.fullName}
                />

                <Input
                  label="Correo Electrónico"
                  placeholder="laura@tu-salon.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
                />

                <Input
                  label="WhatsApp de tu negocio (Opcional)"
                  placeholder="+54 9 11 1234-5678"
                  keyboardType="phone-pad"
                  value={whatsapp}
                  onChangeText={setWhatsapp}
                  error={errors.whatsapp}
                  helper="Con código de país para enviarte novedades de automatización."
                />

                {/* Consent Checkbox */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setPrivacyConsent(!privacyConsent)}
                  style={styles.consentRow}
                >
                  <View style={[styles.checkbox, privacyConsent && styles.checkboxActive]}>
                    {privacyConsent && <CheckCircle size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.consentText}>
                    Acepto la política de privacidad y recibir material educativo para mi negocio.
                  </Text>
                </TouchableOpacity>
                {errors.privacyConsent ? (
                  <Text style={styles.errorText}>{errors.privacyConsent}</Text>
                ) : null}

                {errors.form ? <Text style={styles.errorText}>{errors.form}</Text> : null}

                <TouchableOpacity
                  activeOpacity={0.88}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                  style={styles.submitButton}
                >
                  <Download size={18} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Verificando datos...' : 'Acceder al recetario gratuito'}
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
          </View>
        ) : (
          /* Post-Conversion: Instant Delivery + Main Product Offer */
          <View style={styles.deliveredContainer}>
            <View style={styles.deliveredCard}>
              <View style={styles.successBadge}>
                <CheckCircle size={24} color="#065F46" />
                <Text style={styles.successTitle}>¡Acceso Concedido Exitosamente!</Text>
              </View>
              <Text style={styles.deliveredText}>
                Hola {deliveredLead?.fullName}, tu recetario comercial está listo para descargar:
              </Text>

              {/* Direct Download Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => alert('Iniciando descarga: 15-Respuestas-WhatsApp-TurnoFlow.pdf')}
                style={styles.downloadActionBtn}
              >
                <Download size={20} color="#FFFFFF" />
                <Text style={styles.downloadActionText}>Descargar Guía en PDF (15 Respuestas)</Text>
              </TouchableOpacity>
              <Text style={styles.noEmailDisclaimer}>
                ℹ️ La descarga se inicia directamente aquí en tu navegador sin esperas de correo electrónico.
              </Text>
            </View>

            {/* Special OTO (One-Time-Offer) for Main Product */}
            <View style={styles.specialOfferBox}>
              <View style={styles.offerBadge}>
                <Sparkles size={14} color="#065F46" />
                <Text style={styles.offerBadgeText}>OFERTA EXCLUSIVA PARA NUEVOS MIEMBROS</Text>
              </View>

              <Text style={styles.offerTitle}>
                ¿Querés que estas 15 respuestas se envíen solas en 2 segundos?
              </Text>
              <Text style={styles.offerDesc}>
                Las respuestas manuales funcionan, pero te siguen quitando 2 horas al día. Con **TurnoFlow AI - Recepción Inteligente 24/7**, conectás todo tu WhatsApp oficial para que califique, responda y cobre la seña por vos.
              </Text>

              <View style={styles.offerPriceRow}>
                <Text style={styles.offerRegularPrice}>Valor regular: $149 USD</Text>
                <Text style={styles.offerLaunchPrice}>Hoy con tu registro: $49 USD (Pago único)</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => router.push('/checkout')}
                style={styles.offerCta}
              >
                <Text style={styles.offerCtaText}>Quiero automatizar mi negocio por $49 USD</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#FFFFFF',
    minHeight: '80vh' as any,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[12],
    maxWidth: 780,
    marginHorizontal: 'auto' as any,
  },
  title: {
    fontSize: theme.typography.size['4xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[3],
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  titleMobile: {
    fontSize: theme.typography.size['2xl'],
    lineHeight: 34,
  },
  subtitle: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: theme.typography.fontDisplay,
  },
  contentGrid: {
    flexDirection: 'row',
    gap: theme.spacing[10],
  },
  contentGridMobile: {
    flexDirection: 'column',
  },
  leftCol: {
    flex: 1.2,
  },
  colTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[5],
  },
  highlightsList: {
    gap: 14,
    marginBottom: theme.spacing[8],
  },
  highlightItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkIcon: {
    marginTop: 2,
  },
  highlightText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  snippetCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
  },
  snippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  snippetHeaderText: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.accentDark,
    textTransform: 'uppercase',
  },
  snippetSituation: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  snippetWrong: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  snippetWrongText: {
    fontSize: 12,
    color: '#991B1B',
  },
  snippetRight: {
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 8,
  },
  snippetRightText: {
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  deliveryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryNoteText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
  },
  rightCol: {
    flex: 1,
  },
  formCard: {
    padding: theme.spacing[8],
  },
  formTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing[6],
  },
  consentRow: {
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
  consentText: {
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    marginTop: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
  deliveredContainer: {
    maxWidth: 780,
    marginHorizontal: 'auto' as any,
    gap: theme.spacing[8],
  },
  deliveredCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    alignItems: 'center',
    textAlign: 'center',
    ...theme.shadows.subtle,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: theme.spacing[4],
  },
  successTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.extrabold,
    color: '#065F46',
  },
  deliveredText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[6],
    textAlign: 'center',
  },
  downloadActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
    marginBottom: 12,
  },
  downloadActionText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.base,
  },
  noEmailDisclaimer: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  specialOfferBox: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    borderWidth: 1,
    borderColor: theme.colors.surfaceDarkBorder,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.accentSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing[4],
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: theme.typography.weight.extrabold,
    color: '#065F46',
  },
  offerTitle: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.weight.extrabold,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  offerDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textLight,
    lineHeight: 22,
    marginBottom: theme.spacing[6],
  },
  offerPriceRow: {
    marginBottom: theme.spacing[6],
  },
  offerRegularPrice: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  offerLaunchPrice: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.accent,
  },
  offerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
  },
  offerCtaText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.sm,
  },
});
