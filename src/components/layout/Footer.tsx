import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Shield, Clock, MessageSquare, ExternalLink } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { siteConfig } from '../../config/site';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleNavigate = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.footerWrapper}>
      <Container>
        <View style={[styles.mainSection, !isDesktop && styles.mainSectionMobile]}>
          {/* Brand Col */}
          <View style={styles.brandCol}>
            <View style={styles.brandRow}>
              <View style={styles.logoIcon}>
                <Sparkles size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.brandTitle}>{siteConfig.name}</Text>
            </View>
            <Text style={styles.brandDesc}>
              Recepción inteligente 24/7 para centros de estética, salones y estudios de belleza. Convertí consultas en turnos reales en piloto automático.
            </Text>
            <View style={styles.trustRow}>
              <Shield size={14} color={theme.colors.accent} />
              <Text style={styles.trustText}>Conexión oficial WhatsApp Cloud API</Text>
            </View>
          </View>

          {/* Links Col 1 */}
          <View style={styles.linksCol}>
            <Text style={styles.colHeader}>Funnel & Soluciones</Text>
            <TouchableOpacity onPress={() => handleNavigate('/')} style={styles.linkItem}>
              <Text style={styles.linkText}>Landing Principal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('/free-guide')} style={styles.linkItem}>
              <Text style={styles.linkText}>Guía Gratuita 15 Respuestas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('/sales')} style={styles.linkItem}>
              <Text style={styles.linkText}>Propuesta y Precios</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('/checkout')} style={styles.linkItem}>
              <Text style={styles.linkText}>Adquirir Licencia ($49)</Text>
            </TouchableOpacity>
          </View>

          {/* Links Col 2 */}
          <View style={styles.linksCol}>
            <Text style={styles.colHeader}>Legal & Soporte</Text>
            <TouchableOpacity onPress={() => handleNavigate('/privacy')} style={styles.linkItem}>
              <Text style={styles.linkText}>Política de Privacidad</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('/terms')} style={styles.linkItem}>
              <Text style={styles.linkText}>Términos y Condiciones</Text>
            </TouchableOpacity>
            <Text style={styles.contactEmail}>{siteConfig.supportEmail}</Text>
            <Text style={styles.contactHelp}>Soporte técnico para clientes activos</Text>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyText}>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados. Desarrollado con Expo & React Native.
          </Text>
          <Text style={styles.disclaimerText}>
            No afiliado comercialmente a Meta Inc ni WhatsApp LLC. WhatsApp es marca registrada de Meta Platforms.
          </Text>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: theme.colors.surfaceDark,
    paddingTop: theme.spacing[16],
    paddingBottom: theme.spacing[10],
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceDarkBorder,
  },
  mainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing[8],
    paddingBottom: theme.spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  mainSectionMobile: {
    flexDirection: 'column',
    gap: theme.spacing[8],
  },
  brandCol: {
    maxWidth: 380,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing[4],
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontDisplay,
  },
  brandDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textLight,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: theme.spacing[4],
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textLight,
  },
  linksCol: {
    minWidth: 180,
  },
  colHeader: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing[4],
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  linkItem: {
    marginBottom: theme.spacing[3],
  },
  linkText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontDisplay,
  },
  contactEmail: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.accent,
    fontWeight: theme.typography.weight.medium,
    marginTop: 4,
  },
  contactHelp: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  bottomBar: {
    paddingTop: theme.spacing[8],
    flexDirection: 'column',
    gap: 8,
  },
  copyText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
});
