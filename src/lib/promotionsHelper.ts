/**
 * Utilidades para manejo y parseo de múltiples promociones por aliado
 */

/**
 * Delimitador canónico para guardar múltiples promociones en el campo discount de Supabase
 */
export const PROMOTION_DELIMITER = ' /// ';

/**
 * Parsea un string de promociones (posiblemente con múltiples promociones separadas por delimitador)
 * a un arreglo de strings limpios.
 */
export const parsePromotions = (discountStr?: string | null): string[] => {
  if (!discountStr || typeof discountStr !== 'string') return [];
  
  const raw = discountStr.trim();
  if (!raw) return [];

  // Soporta separador canónico ' /// '
  if (raw.includes('///')) {
    return raw.split('///').map(s => s.trim()).filter(Boolean);
  }

  // Soporta saltos de línea si se guardaron en multilínea
  if (raw.includes('\n')) {
    return raw.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
  }

  // Soporta separador ' | '
  if (raw.includes(' | ')) {
    return raw.split(' | ').map(s => s.trim()).filter(Boolean);
  }

  return [raw];
};

/**
 * Une un arreglo de promociones en un solo string usando el delimitador canónico
 */
export const formatPromotions = (promotions: string[]): string => {
  const clean = promotions.map(p => p.trim()).filter(Boolean);
  if (clean.length === 0) return '';
  return clean.join(PROMOTION_DELIMITER);
};
