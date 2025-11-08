import { useTranslation } from 'react-i18next';
import { formatNumberByLanguage, formatCurrencyByLanguage } from '../utils';

export const useFormatNumber = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const formatNumber = (value) => {
    return formatNumberByLanguage(value, currentLanguage);
  };
  const formatCurrency = (amount) => {
    return formatCurrencyByLanguage(amount, currentLanguage);
  };
  return {
    formatNumber,
    formatCurrency,
    isArabic: currentLanguage === 'ar',
  };
};
