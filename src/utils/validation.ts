/**
 * Validation utilities for form inputs and data validation
 */

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation regex patterns
 */
const PASSWORD_PATTERNS = {
  minLength: /.{8,}/,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * Phone number validation regex pattern
 */
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{10,}$/;

/**
 * Credit card validation regex patterns
 */
const CREDIT_CARD_PATTERNS = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePassword = (password: string) => {
  const results = {
    isValid: true,
    errors: [] as string[],
    strength: 0,
  };

  if (!PASSWORD_PATTERNS.minLength.test(password)) {
    results.errors.push('Password must be at least 8 characters long');
    results.isValid = false;
  }

  if (!PASSWORD_PATTERNS.hasUppercase.test(password)) {
    results.errors.push('Password must contain at least one uppercase letter');
    results.isValid = false;
  }

  if (!PASSWORD_PATTERNS.hasLowercase.test(password)) {
    results.errors.push('Password must contain at least one lowercase letter');
    results.isValid = false;
  }

  if (!PASSWORD_PATTERNS.hasNumber.test(password)) {
    results.errors.push('Password must contain at least one number');
    results.isValid = false;
  }

  if (!PASSWORD_PATTERNS.hasSpecialChar.test(password)) {
    results.errors.push('Password must contain at least one special character');
    results.isValid = false;
  }

  // Calculate strength (0-100)
  let strength = 0;
  if (PASSWORD_PATTERNS.minLength.test(password)) strength += 20;
  if (PASSWORD_PATTERNS.hasUppercase.test(password)) strength += 20;
  if (PASSWORD_PATTERNS.hasLowercase.test(password)) strength += 20;
  if (PASSWORD_PATTERNS.hasNumber.test(password)) strength += 20;
  if (PASSWORD_PATTERNS.hasSpecialChar.test(password)) strength += 20;

  results.strength = strength;
  return results;
};

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns True if phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.trim());
};

/**
 * Validates credit card number
 * @param cardNumber - Credit card number to validate
 * @returns Object with validation results
 */
export const validateCreditCard = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Luhn algorithm for credit card validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  const isValidLuhn = sum % 10 === 0;
  
  // Determine card type
  let cardType = 'unknown';
  if (CREDIT_CARD_PATTERNS.visa.test(cleaned)) {
    cardType = 'visa';
  } else if (CREDIT_CARD_PATTERNS.mastercard.test(cleaned)) {
    cardType = 'mastercard';
  } else if (CREDIT_CARD_PATTERNS.amex.test(cleaned)) {
    cardType = 'amex';
  } else if (CREDIT_CARD_PATTERNS.discover.test(cleaned)) {
    cardType = 'discover';
  }
  
  return {
    isValid: isValidLuhn && cardType !== 'unknown',
    cardType,
    errors: isValidLuhn ? [] : ['Invalid credit card number'],
  };
};

/**
 * Validates required field
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export const validateRequired = (value: string, fieldName: string) => {
  const trimmed = value.trim();
  return {
    isValid: trimmed.length > 0,
    error: trimmed.length === 0 ? `${fieldName} is required` : '',
  };
};

/**
 * Validates minimum length
 * @param value - Value to validate
 * @param minLength - Minimum required length
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export const validateMinLength = (value: string, minLength: number, fieldName: string) => {
  return {
    isValid: value.length >= minLength,
    error: value.length < minLength ? `${fieldName} must be at least ${minLength} characters` : '',
  };
};

/**
 * Validates maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export const validateMaxLength = (value: string, maxLength: number, fieldName: string) => {
  return {
    isValid: value.length <= maxLength,
    error: value.length > maxLength ? `${fieldName} must be no more than ${maxLength} characters` : '',
  };
};

/**
 * Validates numeric value
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export const validateNumeric = (value: string, fieldName: string) => {
  const isNumeric = !isNaN(Number(value)) && value.trim() !== '';
  return {
    isValid: isNumeric,
    error: !isNumeric ? `${fieldName} must be a valid number` : '',
  };
};

/**
 * Validates price (positive number with optional decimals)
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export const validatePrice = (value: string, fieldName: string) => {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  const isPositive = parseFloat(value) > 0;
  const isValidFormat = priceRegex.test(value);
  
  return {
    isValid: isValidFormat && isPositive,
    error: !isValidFormat ? `${fieldName} must be a valid price` : !isPositive ? `${fieldName} must be greater than 0` : '',
  };
};

/**
 * Validates URL format
 * @param url - URL to validate
 * @returns True if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates form data object
 * @param formData - Object containing form data
 * @param validationRules - Object containing validation rules for each field
 * @returns Object with validation results
 */
export const validateForm = (formData: Record<string, any>, validationRules: Record<string, any>) => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rules = validationRules[fieldName];

    // Required validation
    if (rules.required) {
      const requiredValidation = validateRequired(value, fieldName);
      if (!requiredValidation.isValid) {
        errors[fieldName] = requiredValidation.error;
        isValid = false;
        return;
      }
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      return;
    }

    // Email validation
    if (rules.email && !isValidEmail(value)) {
      errors[fieldName] = 'Please enter a valid email address';
      isValid = false;
    }

    // Min length validation
    if (rules.minLength) {
      const minLengthValidation = validateMinLength(value, rules.minLength, fieldName);
      if (!minLengthValidation.isValid) {
        errors[fieldName] = minLengthValidation.error;
        isValid = false;
      }
    }

    // Max length validation
    if (rules.maxLength) {
      const maxLengthValidation = validateMaxLength(value, rules.maxLength, fieldName);
      if (!maxLengthValidation.isValid) {
        errors[fieldName] = maxLengthValidation.error;
        isValid = false;
      }
    }

    // Numeric validation
    if (rules.numeric) {
      const numericValidation = validateNumeric(value, fieldName);
      if (!numericValidation.isValid) {
        errors[fieldName] = numericValidation.error;
        isValid = false;
      }
    }

    // Price validation
    if (rules.price) {
      const priceValidation = validatePrice(value, fieldName);
      if (!priceValidation.isValid) {
        errors[fieldName] = priceValidation.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
}; 