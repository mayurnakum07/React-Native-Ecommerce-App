/**
 * Utility functions for formatting data throughout the app
 */

/**
 * Formats a price with currency symbol and proper decimal places
 * @param price - The price to format
 * @param currency - Currency symbol (default: '$')
 * @param locale - Locale for number formatting (default: 'en-US')
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: string = '$',
  locale: string = 'en-US'
): string => {
  return `${currency}${price.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats a price range (min - max)
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted price range string
 */
export const formatPriceRange = (
  minPrice: number,
  maxPrice: number,
  currency: string = '$'
): string => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
};

/**
 * Calculates discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage as number
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Formats a number with appropriate suffix (K, M, B)
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Formats a relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  return formatDate(dateObj);
};

/**
 * Capitalizes the first letter of each word in a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Formats a phone number with proper spacing
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

/**
 * Formats a credit card number with asterisks
 * @param cardNumber - Credit card number
 * @returns Masked credit card number
 */
export const maskCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
}; 