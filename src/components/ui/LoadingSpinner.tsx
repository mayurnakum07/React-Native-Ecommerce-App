import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';
import AnimatedLogo from './AnimatedLogo';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: any;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = Theme.COLORS.primary,
  text,
  fullScreen = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle}>
      <AnimatedLogo 
        size={size === 'large' ? 'medium' : 'small'} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.Spacing.lg,
  },
  
  fullScreen: {
    flex: 1,
    backgroundColor: Theme.COLORS.background,
  },
  
  text: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.base,
    fontWeight: Theme.Typography.medium,
    textAlign: 'center',
  },
});

export default LoadingSpinner; 