import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const containerStyle = [
    styles.container,
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
    style,
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
  ];

  const textInputStyle = [
    styles.input,
    multiline && styles.multilineInput,
    inputStyle,
  ];

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={error ? Theme.COLORS.error : Theme.COLORS.textSecondary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={textInputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Theme.COLORS.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color={error ? Theme.COLORS.error : Theme.COLORS.textSecondary}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.Spacing.md,
  },
  
  label: {
    fontSize: Theme.Typography.sm,
    fontWeight: Theme.Typography.medium,
    color: Theme.COLORS.text,
    marginBottom: Theme.Spacing.xs,
  },
  
  labelError: {
    color: Theme.COLORS.error,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.surface,
    borderRadius: Theme.BorderRadius.lg,
    borderWidth: 1,
    borderColor: Theme.COLORS.border,
    paddingHorizontal: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  
  inputWithLeftIcon: {
    paddingLeft: Theme.Spacing.sm,
  },
  
  inputWithRightIcon: {
    paddingRight: Theme.Spacing.sm,
  },
  
  input: {
    flex: 1,
    fontSize: Theme.Typography.base,
    color: Theme.COLORS.text,
    paddingVertical: Theme.Spacing.md,
    lineHeight: Theme.Typography.base * Theme.Typography.lineHeight.normal,
  },
  
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.md,
  },
  
  leftIcon: {
    marginRight: Theme.Spacing.sm,
  },
  
  rightIcon: {
    marginLeft: Theme.Spacing.sm,
  },
  
  focused: {
    borderColor: Theme.COLORS.primary,
    ...Theme.Shadows.md,
  },
  
  error: {
    borderColor: Theme.COLORS.error,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  errorText: {
    fontSize: Theme.Typography.xs,
    color: Theme.COLORS.error,
    marginTop: Theme.Spacing.xs,
  },
});

export default Input; 