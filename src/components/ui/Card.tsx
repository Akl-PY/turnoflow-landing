import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'dark' | 'outline' | 'subtle';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'dark':
        return styles.dark;
      case 'outline':
        return styles.outline;
      case 'subtle':
        return styles.subtle;
      case 'default':
      default:
        return styles.default;
    }
  };

  return <View style={[styles.card, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing[6],
  },
  default: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.subtle,
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.card,
  },
  dark: {
    backgroundColor: theme.colors.surfaceDarkElevated,
    borderWidth: 1,
    borderColor: theme.colors.surfaceDarkBorder,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  subtle: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
});
