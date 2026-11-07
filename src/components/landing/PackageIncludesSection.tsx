import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Package, FileCode, Bot, BookOpen, Table, Film, Check } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { siteConfig } from '../../config/site';

export const PackageIncludesSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const deliverables = [
    {
      icon: <FileCode size={20} color={theme.colors.accent} />,
      title: 'Blueprints de Flujos JSON',
      desc: 'Diagramas y flujos de conversación listos para importar directamente en tu plataforma no-code o servidor.',
      format: 'Archivos JSON + Diagramas Visuales',
    },
    {
      icon: <Bot size={20} color={theme.colors.accent} />,
      title: 'Prompts del Agente Calibrado',
      desc: 'Instrucciones del sistema completas, reglas de negocio, respuestas a objeciones y directrices de seguridad.',
      format: 'Documentación Técnica + System Prompts',
    },
    {
      icon: <BookOpen size={20} color={theme.colors.accent} />,
      title: 'Guía de WhatsApp Cloud API Oficial',
      desc: 'El paso a paso sin rodeos para dar de alta tu número oficial en Meta Developers sin intermediarios.',
      format: 'Manual PDF + Checklist de Verificación',
    },
    {
      icon: <Table size={20} color={theme.colors.accent} />,
      title: 'Matriz de Seguimiento de Leads',
      desc: 'Estructura lista para monitorear qué clientas consultaron, qué servicio solicitaron y si concretaron la reserva.',
      format: 'Plantilla de Gestión / CRM Liviano',
    },
    {
      icon: <Film size={20} color={theme.colors.accent} />,
      title: 'Video-Tutoriales de Instalación',
      desc: 'Videos cortos en español guiándote clic por clic desde cero hasta dejar el sistema operativo en 2 horas.',
      format: 'Acceso ilimitado a Video-Clases',
    },
    {
      icon: <Check size={20} color={theme.colors.accent} />,
      title: 'Licencia Comercial Ilimitada',
      desc: 'Utilizalo en todos los números y sucursales de tu negocio sin costos adicionales por volumen de chats.',
      format: 'Licencia Vitalicia',
    },
  ];

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge label="Entrega Inmediata Digital" variant="purple" />
          <Text style={styles.title}>Qué incluye exactamente el producto</Text>
          <Text style={styles.subtitle}>
            Todo lo necesario para pasar de perder clientas a tener un sistema de atención funcionando hoy mismo.
          </Text>
        </View>

        <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
          {deliverables.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>{item.icon}</View>
                <View style={styles.formatBadge}>
                  <Text style={styles.formatText}>{item.format}</Text>
                </View>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          ))}
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
    flexWrap: 'wrap',
    gap: 20,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
    ...theme.shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  formatText: {
    fontSize: 10,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.textMuted,
  },
  itemTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  itemDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
