import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'dark':
        return styles.dark;
      case 'ghost':
        return styles.ghost;
      case 'primary':
      default:
        return styles.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      case 'ghost':
        return styles.textGhost;
      case 'secondary':
        return styles.textSecondary;
      case 'dark':
        return styles.textDark;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.textSizeSm;
      case 'lg':
        return styles.textSizeLg;
      case 'md':
      default:
        return styles.textSizeMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.colors.accent : '#FFF'} />
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          <Text style={[styles.textBase, getTextStyle(), getTextSizeStyle(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    gap: 8,
  },
  primary: {
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
  },
  dark: {
    backgroundColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sizeSm: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sizeMd: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sizeLg: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: theme.radius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontFamily: theme.typography.fontDisplay,
    fontWeight: theme.typography.weight.semibold,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: theme.colors.textPrimary,
  },
  textOutline: {
    color: theme.colors.accentDark,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textGhost: {
    color: theme.colors.textSecondary,
  },
  textSizeSm: {
    fontSize: theme.typography.size.xs,
  },
  textSizeMd: {
    fontSize: theme.typography.size.sm,
  },
  textSizeLg: {
    fontSize: theme.typography.size.base,
  },
});
