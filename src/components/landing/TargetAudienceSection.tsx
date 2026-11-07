import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { siteConfig } from '../../config/site';

export const TargetAudienceSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge label="Claridad y Transparencia" variant="slate" />
          <Text style={styles.title}>¿TurnoFlow AI es la solución correcta para vos?</Text>
          <Text style={styles.subtitle}>
            Queremos clientes que multipliquen sus resultados. Por eso somos transparentes sobre el perfil ideal de negocio.
          </Text>
        </View>

        <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
          {/* Columna: Para quién es */}
          <View style={[styles.card, styles.cardForWho]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeForWho}>
                <Text style={styles.badgeForWhoText}>Para quién ES ideal</Text>
              </View>
            </View>
            <View style={styles.list}>
              {siteConfig.forWho.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={styles.checkIcon}>
                    <Check size={14} color="#065F46" />
                  </View>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Columna: Para quién NO es */}
          <View style={[styles.card, styles.cardNotForWho]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeNotForWho}>
                <Text style={styles.badgeNotForWhoText}>Para quién NO es</Text>
              </View>
            </View>
            <View style={styles.list}>
              {siteConfig.notForWho.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={styles.crossIcon}>
                    <X size={14} color="#991B1B" />
                  </View>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: theme.spacing[16],
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[12],
    maxWidth: 720,
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
  grid: {
    flexDirection: 'row',
    gap: 24,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[8],
    borderWidth: 1.5,
  },
  cardForWho: {
    backgroundColor: theme.colors.accentSubtle,
    borderColor: '#A7F3D0',
  },
  cardNotForWho: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  cardHeader: {
    marginBottom: theme.spacing[6],
  },
  badgeForWho: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  badgeForWhoText: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
    color: '#065F46',
  },
  badgeNotForWho: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  badgeNotForWhoText: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
    color: '#991B1B',
  },
  list: {
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  crossIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textPrimary,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
