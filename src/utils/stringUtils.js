export const sanitizeSearchInput = (input) => {
  if (!input || typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ");
};

export const isEmptySearch = (input) => {
  return !input || !input.trim();
};

export const normalizeSearchInput = (input) => {
  const sanitized = sanitizeSearchInput(input);
  return isEmptySearch(sanitized) ? "" : sanitized;
};

export const truncateChars = (text, max = 25) => {
  if (!text) return "";
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max).join("") + "..." : text;
};

// Show only the first N characters preserving spaces (supports English/Arabic)
export const getNamePreview = (name, max = 5) => {
  if (!name || typeof name !== "string") return "";
  // Only remove non-letter, non-space characters
  const cleanedName = name.replace(/[^A-Za-z\u0600-\u06FF\s]/g, "");
  if (!cleanedName) return "";
  return Array.from(cleanedName).slice(0, max).join("");
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

export const formatCurrency = (amount) => {
  return formatNumber(amount);
};

export const toArabicNumerals = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  return String(value).replace(
    /\d/g,
    (digit) => arabicNumerals[parseInt(digit)]
  );
};

export const formatNumberByLanguage = (value, language = "en") => {
  if (value === null || value === undefined || value === "") return "";

  const formatted = formatNumber(value);

  if (language === "ar") {
    return toArabicNumerals(formatted);
  }

  return formatted;
};

export const formatCurrencyByLanguage = (amount, language = "en") => {
  return formatNumberByLanguage(amount, language);
};
export const formatPhoneByLanguage = (phone, language = "en") => {
  if (phone === null || phone === undefined || phone === "") return "";

  const phoneStr = String(phone);

  if (language === "ar") {
    return toArabicNumerals(phoneStr);
  }

  return phoneStr;
};
