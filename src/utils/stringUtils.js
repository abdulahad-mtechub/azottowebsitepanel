
export const sanitizeSearchInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/\s+/g, ' ');
};

export const isEmptySearch = (input) => {
  return !input || !input.trim();
};

export const normalizeSearchInput = (input) => {
  const sanitized = sanitizeSearchInput(input);
  return isEmptySearch(sanitized) ? '' : sanitized;
};

export const truncateChars = (text, max = 25) => {
    if (!text) return "";
    const chars = Array.from(text);
    return chars.length > max ? chars.slice(0, max).join("") + "..." : text;
};

/**
 * Format a number with commas (thousands separator)
 * @param {number|string} value - The number to format
 * @returns {string} - Formatted number with commas
 */
export const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';
    return num.toLocaleString();
};

/**
 * Format currency display - Riyal symbol should always appear on the left
 * @param {number|string} amount - The amount to format
 * @returns {string} - Formatted currency string with commas
 */
export const formatCurrency = (amount) => {
    return formatNumber(amount);
};