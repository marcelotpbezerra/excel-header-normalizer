import { NamingConvention } from '../types';

/**
 * Strips accents/diacritics from a string.
 */
export const stripAccents = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Splits any string into clean lowercase alphanumeric tokens.
 */
export const tokenize = (header: any): string[] => {
  if (header === null || header === undefined || String(header).trim() === '') {
    return ['col', Math.random().toString(36).substring(2, 7)];
  }

  const clean = stripAccents(String(header).trim());
  // Split on non-alphanumeric characters, and camelCase transitions
  const tokens = clean
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return tokens.length > 0 ? tokens : ['col'];
};

/**
 * Normalizes header string according to the selected naming convention.
 */
export const normalizeHeader = (header: any, convention: NamingConvention = 'snake_case'): string => {
  const tokens = tokenize(header);

  switch (convention) {
    case 'snake_case':
      return tokens.join('_');
    
    case 'UPPER_SNAKE':
      return tokens.join('_').toUpperCase();
    
    case 'kebab-case':
      return tokens.join('-');
    
    case 'camelCase':
      return tokens
        .map((t, i) => i === 0 ? t : t.charAt(0).toUpperCase() + t.slice(1))
        .join('');
    
    case 'PascalCase':
      return tokens
        .map(t => t.charAt(0).toUpperCase() + t.slice(1))
        .join('');
    
    default:
      return tokens.join('_');
  }
};
