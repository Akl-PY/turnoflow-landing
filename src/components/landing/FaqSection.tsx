import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { theme } from '../../styles/theme';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { Accordion } from '../ui/Accordion';
import { faqList } from '../../config/faqData';

export const FaqSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Container>
        <View style={styles.header}>
          <Badge
            label="Dudas Frecuentes"
            variant="blue"
            icon={<HelpCircle size={13} color="#1E40AF" />}
          />
          <Text style={styles.title}>Respuestas claras a tus preguntas</Text>
          <Text style={styles.subtitle}>
            Si tenés alguna consulta adicional que no figure aquí, podés preguntarle a nuestro asistente de ventas en el chat flotante.
          </Text>
        </View>

        <View style={styles.accordionContainer}>
          {faqList.map((faq, index) => (
            <Accordion
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={index === 0}
            />
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
  accordionContainer: {
    maxWidth: 820,
    marginHorizontal: 'auto' as any,
  },
});
