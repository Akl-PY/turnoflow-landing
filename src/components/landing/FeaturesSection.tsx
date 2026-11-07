import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Bot, MessageCircle, DollarSign, Calendar, ShieldCheck, Zap } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const FeaturesSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const features = [
    {
      icon: <Bot size={22} color={theme.colors.accent} />,
      title: 'Agente calibrado para estética',
      desc: 'Entrenado con el vocabulario exacto de manicuría, pestañas, depilación, faciales y aparatología. Sabe cómo responder objeciones de precios con elegancia.',
    },
    {
      icon: <DollarSign size={22} color={theme.colors.accent} />,
      title: 'Solicitud de seña obligatoria',
      desc: 'El agente solicita comprobante de pago o provee el alias antes de fijar el turno, reduciendo las cancelaciones de última hora casi a cero.',
    },
    {
      icon: <Calendar size={22} color={theme.colors.accent} />,
      title: 'Manejo inteligente de disponibilidad',
      desc: 'Comprende que un color requiere 2 horas y un perfilado de cejas 30 minutos, evitando la superposición de clientas en tu salón.',
    },
    {
      icon: <ShieldCheck size={22} color={theme.colors.accent} />,
      title: 'Cero alucinaciones ni inventos',
      desc: 'El modelo cuenta con restricciones estrictas de backend. Jamás inventará promociones no vigentes ni dará información técnica no autorizada.',
    },
    {
      icon: <MessageCircle size={22} color={theme.colors.accent} />,
      title: 'WhatsApp Cloud API Oficial',
      desc: 'Operación sobre la infraestructura oficial de Meta. Evitá los bloqueos de chip de herramientas no oficiales que ponen en riesgo tu base de datos.',
    },
    {
      icon: <Zap size={22} color={theme.colors.accent} />,
      title: 'Derivación humana al instante',
      desc: 'Si una clienta consulta por una patología médica previa o pide hablar con su profesional preferida, el chat se transfiere en un clic.',
    },
  ];

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge label="Capacidades Técnicas" variant="emerald" />
          <Text style={styles.title}>Funcionalidades construidas para generar reservas</Text>
          <Text style={styles.subtitle}>
            Cada característica está pensada para solucionar un punto de fricción real en la venta diaria de tratamientos y servicios.
          </Text>
        </View>

        <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
          {features.map((item, idx) => (
            <Card key={idx} variant="default" style={styles.cardItem}>
              <View style={styles.iconBox}>{item.icon}</View>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </Card>
          ))}
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
    flexWrap: 'wrap',
    gap: 20,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  cardItem: {
    flex: 1,
    minWidth: 280,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[6],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  featureTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
