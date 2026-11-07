import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

export interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: theme.spacing[4],
  },
});
