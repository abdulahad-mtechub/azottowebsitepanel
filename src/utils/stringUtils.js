
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