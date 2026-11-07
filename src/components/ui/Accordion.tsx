import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { theme } from '../../styles/theme';

export interface AccordionProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  question,
  answer,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
        style={styles.header}
      >
        <Text style={styles.question}>{question}</Text>
        <View style={styles.iconWrapper}>
          {isOpen ? (
            <ChevronUp size={20} color={theme.colors.accentDark} />
          ) : (
            <ChevronDown size={20} color={theme.colors.textMuted} />
          )}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.body}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing[3],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[5],
  },
  question: {
    flex: 1,
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.fontDisplay,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.textPrimary,
    paddingRight: theme.spacing[3],
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[5],
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: theme.spacing[4],
  },
  answer: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontDisplay,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
