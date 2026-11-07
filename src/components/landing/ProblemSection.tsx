import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { MessageSquareOff, UserX, Clock, CalendarX, AlertTriangle } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const ProblemSection: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const problems = [
    {
      icon: <MessageSquareOff size={24} color="#EF4444" />,
      title: 'Responder mientras estás atendiendo',
      desc: 'Estás con una clienta en camilla o aplicando color. Llegan 3 mensajes preguntando precios. Cuando terminás 40 minutos después, 2 de ellas ya le escribieron a otro salón.',
    },
    {
      icon: <Clock size={24} color="#EF4444" />,
      title: 'Consultas fuera de horario comercial',
      desc: 'El 45% de las clientas busca turnos de noche (21:00 a 00:30 hs) o domingos. Si tu WhatsApp no responde hasta la mañana siguiente, esa reserva se perdió.',
    },
    {
      icon: <CalendarX size={24} color="#EF4444" />,
      title: 'Turnos cancelados a último momento',
      desc: 'Reservás un turno de 2 horas sin cobrar seña previa. La clienta no asiste o te avisa 15 minutos antes. Tu profesional queda parada y tu negocio pierde dinero.',
    },
    {
      icon: <UserX size={24} color="#EF4444" />,
      title: 'El agotador "¿Cuánto sale?" sin cierre',
      desc: 'Pasás horas tipeando precios, mandando fotos de trabajos y listas de servicios para que luego te dejen con el visto sin concretar ninguna reserva.',
    },
  ];

  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge
            label="La Realidad Operativa"
            variant="amber"
            icon={<AlertTriangle size={13} color="#92400E" />}
          />
          <Text style={styles.title}>¿Por qué se te escapan clientas todos los días?</Text>
          <Text style={styles.subtitle}>
            El problema no es la calidad de tus tratamientos ni la habilidad de tu equipo: es la velocidad de respuesta en el canal donde la clienta decide comprar.
          </Text>
        </View>

        <View style={[styles.grid, !isDesktop && styles.gridMobile]}>
          {problems.map((p, idx) => (
            <Card key={idx} variant="elevated" style={styles.cardItem}>
              <View style={styles.iconBox}>{p.icon}</View>
              <Text style={styles.problemTitle}>{p.title}</Text>
              <Text style={styles.problemDesc}>{p.desc}</Text>
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
    minWidth: 260,
    padding: theme.spacing[6],
    borderRadius: theme.radius.xl,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  problemTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  problemDesc: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    fontFamily: theme.typography.fontDisplay,
  },
});
