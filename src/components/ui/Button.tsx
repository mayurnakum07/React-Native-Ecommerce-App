import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const buttonStyle = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? Theme.COLORS.textInverse : Theme.COLORS.primary} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyleCombined}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[Theme.COLORS.primary, Theme.COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  
  // Size variants
  small: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: Theme.Spacing.xl,
    paddingVertical: Theme.Spacing.md,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: Theme.Spacing.xxl,
    paddingVertical: Theme.Spacing.lg,
    minHeight: 56,
  },
  
  // Variant styles
  primary: {
    // Gradient handled separately
  },
  secondary: {
    backgroundColor: Theme.COLORS.surface,
    borderWidth: 1,
    borderColor: Theme.COLORS.border,
    ...Theme.Shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Theme.COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Theme.COLORS.error,
  },
  
  // Text styles
  text: {
    fontWeight: Theme.Typography.semibold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: Theme.Typography.sm,
  },
  mediumText: {
    fontSize: Theme.Typography.base,
  },
  largeText: {
    fontSize: Theme.Typography.lg,
  },
  
  // Variant text styles
  primaryText: {
    color: Theme.COLORS.textInverse,
  },
  secondaryText: {
    color: Theme.COLORS.text,
  },
  outlineText: {
    color: Theme.COLORS.primary,
  },
  ghostText: {
    color: Theme.COLORS.primary,
  },
  dangerText: {
    color: Theme.COLORS.textInverse,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Layout
  fullWidth: {
    width: '100%',
  },
  
  // Gradient
  gradient: {
    flex: 1,
    borderRadius: Theme.BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
});

export default Button; 