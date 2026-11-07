import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { MessageCircle, CheckCheck, Clock, Zap, Sparkles, Calendar, ArrowRight, Play, RotateCcw } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';

interface DemoStep {
  speaker: 'client' | 'agent';
  text: string;
  time: string;
  actionTag?: string;
}

const DEMO_SCENARIOS = {
  manicura: [
    { speaker: 'client', text: 'Hola, ¿cuánto cuesta la manicura semipermanente?', time: '20:14' },
    {
      speaker: 'agent',
      text: '¡Hola! Tenemos diferentes opciones. La semipermanente con manicuría rusa y esmaltado premium está en $18.000 (dura más de 20 días). ¿Querés conocer detalles o consultar disponibilidad para agendar?',
      time: '20:14',
      actionTag: 'Respuesta en 2 seg',
    },
    { speaker: 'client', text: 'Quiero reservar para mañana por la tarde si tienen.', time: '20:15' },
    {
      speaker: 'agent',
      text: '¡Perfecto! Mañana tenemos lugares disponibles a las 15:30 hs y a las 18:00 hs con Sofía. ¿Cuál de esos dos horarios te queda más cómodo?',
      time: '20:15',
      actionTag: 'Consulta de agenda activa',
    },
    { speaker: 'client', text: 'A las 18:00 hs me queda genial.', time: '20:16' },
    {
      speaker: 'agent',
      text: '¡Excelente! Te reservo provisoriamente mañana 18:00 hs. Para confirmar el bloqueo del turno, ¿me confirmás tu nombre y te paso el alias para la seña de $5.000?',
      time: '20:16',
      actionTag: 'Bloqueo + Solicitud de seña',
    },
  ] as DemoStep[],

  depilacion: [
    { speaker: 'client', text: 'Buenas noches, ¿hacen depilación láser en piernas enteras?', time: '23:40' },
    {
      speaker: 'agent',
      text: '¡Buenas noches! Sí, realizamos depilación definitiva Soprano Titanium en piernas enteras, cavado y axilas. La sesión de piernas completas está en promoción en $24.000.',
      time: '23:40',
      actionTag: 'Atención fuera de horario comercial',
    },
    { speaker: 'client', text: '¿Se puede hacer si tomé sol hace poco?', time: '23:41' },
    {
      speaker: 'agent',
      text: 'Recomendamos esperar al menos 48 horas tras exposición solar directa. Nuestra próxima jornada de láser con cabezal frío es este sábado. ¿Querés que te reserve un lugar para evaluar tu piel?',
      time: '23:41',
      actionTag: 'Calificación de seguridad',
    },
  ] as DemoStep[],
};

export const InteractiveDemoSection: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'manicura' | 'depilacion'>('manicura');
  const [stepIndex, setStepIndex] = useState<number>(DEMO_SCENARIOS.manicura.length);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  const currentSteps = DEMO_SCENARIOS[activeScenario].slice(0, stepIndex);

  const handleNextStep = () => {
    if (stepIndex < DEMO_SCENARIOS[activeScenario].length) {
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(1);
    }
  };

  const handleScenarioChange = (scenario: 'manicura' | 'depilacion') => {
    setActiveScenario(scenario);
    setStepIndex(DEMO_SCENARIOS[scenario].length);
  };

  return (
    <View style={styles.section}>
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Badge
            label="Simulación Interactiva de Flujo"
            variant="purple"
            icon={<Sparkles size={13} color="#4338CA" />}
          />
          <Text style={styles.title}>Así atiende TurnoFlow AI cuando vos estás ocupada</Text>
          <Text style={styles.subtitle}>
            Una clienta interesada no espera 4 horas. TurnoFlow responde al instante, califica la necesidad, ofrece opciones y solicita la seña.
          </Text>
        </View>

        {/* Demo Controller & Phone Mockup */}
        <View style={[styles.demoGrid, !isDesktop && styles.demoGridMobile]}>
          {/* Controls & Explanation Column */}
          <View style={styles.infoCol}>
            <Text style={styles.infoTitle}>Probá los distintos escenarios de tu salón</Text>
            <Text style={styles.infoText}>
              Seleccioná un rubro para ver cómo el agente guía la conversación desde la pregunta inicial de precio hasta la reserva formal con seña.
            </Text>

            {/* Scenario Switcher */}
            <View style={styles.scenarioButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleScenarioChange('manicura')}
                style={[styles.scenarioBtn, activeScenario === 'manicura' && styles.scenarioBtnActive]}
              >
                <Text style={[styles.scenarioBtnText, activeScenario === 'manicura' && styles.scenarioBtnTextActive]}>
                  💅 Estudio de Uñas & Manicura
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleScenarioChange('depilacion')}
                style={[styles.scenarioBtn, activeScenario === 'depilacion' && styles.scenarioBtnActive]}
              >
                <Text style={[styles.scenarioBtnText, activeScenario === 'depilacion' && styles.scenarioBtnTextActive]}>
                  ⚡ Depilación Láser (23:40 hs)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Feature Callouts */}
            <View style={styles.calloutCard}>
              <View style={styles.calloutItem}>
                <Clock size={18} color={theme.colors.accent} />
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>Respuesta en menos de 3 segundos</Text>
                  <Text style={styles.calloutDesc}>Nunca más un visto o una clienta que le escribe a la competencia mientras trabajás.</Text>
                </View>
              </View>
              <View style={styles.calloutItem}>
                <Calendar size={18} color={theme.colors.brandPurple} />
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>Filtro de horarios inteligentes</Text>
                  <Text style={styles.calloutDesc}>Ofrece solo huecos reales según la duración de cada servicio para no superponer turnos.</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNextStep}
              style={styles.stepBtn}
            >
              <Play size={16} color="#FFFFFF" />
              <Text style={styles.stepBtnText}>
                {stepIndex < DEMO_SCENARIOS[activeScenario].length
                  ? `Ver siguiente mensaje (${stepIndex + 1}/${DEMO_SCENARIOS[activeScenario].length})`
                  : 'Reiniciar simulación paso a paso'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* WhatsApp UI Mockup */}
          <View style={styles.mockupCol}>
            <View style={styles.phoneFrame}>
              {/* WhatsApp Header */}
              <View style={styles.waHeader}>
                <View style={styles.waAvatar}>
                  <Text style={styles.waAvatarText}>TF</Text>
                </View>
                <View style={styles.waContact}>
                  <Text style={styles.waContactName}>TurnoFlow Estética & Spa</Text>
                  <View style={styles.waOnlineRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.waStatus}>en línea (WhatsApp Business Oficial)</Text>
                  </View>
                </View>
              </View>

              {/* Chat Simulation Area */}
              <View style={styles.chatArea}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>HOY • SIMULACIÓN EN VIVO</Text>
                </View>

                {currentSteps.map((step, idx) => {
                  const isClient = step.speaker === 'client';
                  return (
                    <View
                      key={idx}
                      style={[styles.messageRow, isClient ? styles.messageRowClient : styles.messageRowAgent]}
                    >
                      <View style={[styles.waBubble, isClient ? styles.waBubbleClient : styles.waBubbleAgent]}>
                        <Text style={styles.waMessageText}>{step.text}</Text>
                        <View style={styles.waMeta}>
                          <Text style={styles.waTime}>{step.time}</Text>
                          {isClient ? <CheckCheck size={14} color="#53BDEB" /> : null}
                        </View>
                      </View>
                      {step.actionTag ? (
                        <View style={styles.waActionTag}>
                          <Zap size={10} color={theme.colors.accentDark} />
                          <Text style={styles.waActionText}>{step.actionTag}</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              {/* WhatsApp Input Mockup */}
              <View style={styles.waInputBar}>
                <Text style={styles.waInputPlaceholder}>Mensaje</Text>
                <View style={styles.waSendMic}>
                  <MessageCircle size={16} color="#FFFFFF" />
                </View>
              </View>
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
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing[12],
    maxWidth: 780,
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
  demoGrid: {
    flexDirection: 'row',
    gap: theme.spacing[10],
    alignItems: 'center',
  },
  demoGridMobile: {
    flexDirection: 'column',
  },
  infoCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    marginBottom: 8,
  },
  infoText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing[5],
  },
  scenarioButtons: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: theme.spacing[6],
  },
  scenarioBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  scenarioBtnActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSubtle,
  },
  scenarioBtnText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontDisplay,
  },
  scenarioBtnTextActive: {
    color: theme.colors.accentDark,
    fontWeight: theme.typography.weight.bold,
  },
  calloutCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[5],
    gap: 16,
    marginBottom: theme.spacing[6],
    ...theme.shadows.subtle,
  },
  calloutItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  calloutContent: {
    flex: 1,
  },
  calloutTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  calloutDesc: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  stepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
  },
  mockupCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#E5DDD5',
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#1E293B',
    ...theme.shadows.floating,
  },
  waHeader: {
    backgroundColor: '#075E54',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#128C7E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waAvatarText: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: 14,
  },
  waContact: {
    flex: 1,
  },
  waContactName: {
    color: '#FFFFFF',
    fontWeight: theme.typography.weight.bold,
    fontSize: 14,
  },
  waOnlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#25D366',
  },
  waStatus: {
    color: '#D1FAE5',
    fontSize: 11,
  },
  chatArea: {
    padding: 16,
    minHeight: 390,
  },
  dateBadge: {
    alignSelf: 'center',
    backgroundColor: '#D1D7DB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 10,
    fontWeight: theme.typography.weight.semibold,
    color: '#54656F',
  },
  messageRow: {
    marginBottom: 12,
  },
  messageRowClient: {
    alignItems: 'flex-end',
  },
  messageRowAgent: {
    alignItems: 'flex-start',
  },
  waBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    ...theme.shadows.subtle,
  },
  waBubbleClient: {
    backgroundColor: '#E7FFDB',
    borderTopRightRadius: 2,
  },
  waBubbleAgent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
  },
  waMessageText: {
    fontSize: 13,
    color: '#111B21',
    lineHeight: 18,
  },
  waMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  waTime: {
    fontSize: 10,
    color: '#667781',
  },
  waActionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  waActionText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: theme.typography.weight.semibold,
  },
  waInputBar: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waInputPlaceholder: {
    color: '#8696A0',
    fontSize: 13,
  },
  waSendMic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A884',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
