import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { analytics } from '../../services/analytics/analyticsService';

export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const stored = localStorage.getItem('turnoflow_cookie_consent');
      if (stored === null) {
        setVisible(true);
      }
    }
  }, []);

  const handleChoice = (accepted: boolean) => {
    analytics.setConsent(accepted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <ShieldCheck size={20} color={theme.colors.accent} />
        </View>
        <Text style={styles.text}>
          Utilizamos cookies y métricas con fines analíticos y de rendimiento para ofrecerte una experiencia fluida. Respetamos tu privacidad conforme a estándares internacionales.
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleChoice(false)}
          style={styles.btnSecondary}
        >
          <Text style={styles.btnSecondaryText}>Solo necesarias</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleChoice(true)}
          style={styles.btnPrimary}
        >
          <Text style={styles.btnPrimaryText}>Aceptar todas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute' as any,
    bottom: 20,
    left: 20,
    right: 20,
    maxWidth: 620,
    marginHorizontal: 'auto' as any,
    backgroundColor: theme.colors.surfaceDarkElevated,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[4],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'column',
    gap: 12,
    zIndex: 9999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    paddingTop: 2,
  },
  text: {
    flex: 1,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textLight,
    lineHeight: 18,
    fontFamily: theme.typography.fontDisplay,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  btnSecondaryText: {
    color: '#CBD5E1',
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.medium,
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accent,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.semibold,
  },
});
