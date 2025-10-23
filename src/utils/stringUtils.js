
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