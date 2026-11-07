import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../styles/theme';

export interface QuickSuggestionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSelect, disabled }) => {
  const suggestions = [
    '¿Cuánto cuesta TurnoFlow AI?',
    '¿Cómo funciona con WhatsApp?',
    '¿Qué incluye el paquete de $49?',
    'Quiero ver la guía gratuita',
    'Hablar con un asesor humano',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.75}
            disabled={disabled}
            onPress={() => onSelect(item)}
            style={styles.chip}
          >
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  chipText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontDisplay,
    fontWeight: theme.typography.weight.medium,
  },
});
