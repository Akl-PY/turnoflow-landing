import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

export interface BadgeProps {
  label: string;
  variant?: 'emerald' | 'purple' | 'slate' | 'amber' | 'blue';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'emerald',
  icon,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'purple':
        return {
          container: styles.purpleContainer,
          text: styles.purpleText,
        };
      case 'slate':
        return {
          container: styles.slateContainer,
          text: styles.slateText,
        };
      case 'amber':
        return {
          container: styles.amberContainer,
          text: styles.amberText,
        };
      case 'blue':
        return {
          container: styles.blueContainer,
          text: styles.blueText,
        };
      case 'emerald':
      default:
        return {
          container: styles.emeraldContainer,
          text: styles.emeraldText,
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <View style={[styles.badge, vStyles.container, style]}>
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <Text style={[styles.label, vStyles.text, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 6,
  },
  label: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontDisplay,
    fontWeight: theme.typography.weight.semibold,
    letterSpacing: 0.3,
  },
  emeraldContainer: {
    backgroundColor: theme.colors.accentSubtle,
    borderColor: '#A7F3D0',
  },
  emeraldText: {
    color: '#065F46',
  },
  purpleContainer: {
    backgroundColor: theme.colors.brandPurpleLight,
    borderColor: '#C7D2FE',
  },
  purpleText: {
    color: '#3730A3',
  },
  slateContainer: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  slateText: {
    color: '#334155',
  },
  amberContainer: {
    backgroundColor: theme.colors.warningLight,
    borderColor: '#FDE68A',
  },
  amberText: {
    color: '#92400E',
  },
  blueContainer: {
    backgroundColor: theme.colors.infoLight,
    borderColor: '#BFDBFE',
  },
  blueText: {
    color: '#1E40AF',
  },
});
