import { useTranslation } from 'react-i18next';
import { formatNumberByLanguage, formatCurrencyByLanguage } from '../utils';

/**
 * Custom hook for formatting numbers based on current language
 * Returns functions to format numbers with Arabic or Western numerals
 */
export const useFormatNumber = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  /**
   * Format a number with proper numerals for current language
   * @param {number|string} value - The number to format
   * @returns {string} - Formatted number
   */
  const formatNumber = (value) => {
    return formatNumberByLanguage(value, currentLanguage);
  };

  /**
   * Format a currency amount with proper numerals for current language
   * @param {number|string} amount - The amount to format
   * @returns {string} - Formatted currency
   */
  const formatCurrency = (amount) => {
    return formatCurrencyByLanguage(amount, currentLanguage);
  };

  return {
    formatNumber,
    formatCurrency,
    isArabic: currentLanguage === 'ar',
  };
};
