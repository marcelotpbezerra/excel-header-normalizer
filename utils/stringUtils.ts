/**
 * Normalizes a string to be used as a database column or variable name.
 * Rules:
 * 1. Convert to lowercase.
 * 2. Remove accents (diacritics).
 * 3. Replace spaces, slashes, and special characters with underscores.
 * 4. Remove duplicate underscores.
 * 5. Trim leading/trailing underscores.
 */
export const normalizeHeader = (header: any): string => {
  if (header === null || header === undefined) {
    return `col_${Math.random().toString(36).substring(7)}`;
  }

  const str = String(header);

  return str
    .normalize("NFD") // Decompose combined graphemes (e.g., 'é' becomes 'e' + '´')
    .replace(/[\u0300-\u036f]/g, "") // Remove the diacritic marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric chars with underscore
    .replace(/_+/g, "_") // Collapse multiple underscores
    .replace(/^_|_$/g, ""); // Trim leading/trailing underscores
};
