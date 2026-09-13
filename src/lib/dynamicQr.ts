/**
 * Módulo de Seguridad y QR Dinámico - Red Identidad
 * 
 * Protege contra capturas de pantalla en WhatsApp / redes sociales
 * generando tokens con firma temporal que caducan a los 90 segundos.
 * 
 * Funciona de forma retrocompatible:
 * - Soporta las 406 calcomanías físicas existentes.
 * - Soporta todos los nuevos lotes de calcomanías futuras.
 * - Protege la credencial digital en vivo de todos los usuarios.
 */

const SECRET_SALT = 'RED_IDENTIDAD_MX_2026_DYNAMIC_SECURE_TOKEN';

// Genera un hash numérico simple y rápido para firmar el token
function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a entero de 32 bits
  }
  return Math.abs(hash).toString(36);
}

/**
 * Genera el valor dinámico para el código QR de la credencial digital.
 * El token incluye el código del miembro, el timestamp UNIX (en segundos) y una firma.
 */
export function generateDynamicQrPayload(code: string, memberNumber?: number): {
  url: string;
  timestamp: number;
  expiresInSeconds: number;
} {
  const cleanCode = (code || `RED-${memberNumber || 1}`).toUpperCase().trim();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const signature = generateHash(`${cleanCode}:${nowSeconds}:${SECRET_SALT}`);
  
  // URL compatible con el escáner del aliado y con cámaras estándar
  const url = `https://redidentidad.vercel.app/registro?c=${encodeURIComponent(cleanCode)}&t=${nowSeconds}&sig=${signature}&mode=dynamic`;

  return {
    url,
    timestamp: nowSeconds,
    expiresInSeconds: 60, // Se renueva en pantalla cada 60s
  };
}

export interface QrValidationResult {
  code: string;
  isDynamic: boolean;
  isValid: boolean;
  isExpired: boolean;
  ageSeconds?: number;
  errorMessage?: string;
}

/**
 * Valida cualquier texto o URL escaneado por el aliado.
 * Detecta automáticamente si es un QR Dinámico en vivo o una Calcomanía Física.
 */
export function verifyQrPayload(rawInput: string): QrValidationResult {
  const clean = rawInput.trim();
  
  // 1. Verificar si contiene parámetros dinámicos
  let codeParam: string | null = null;
  let timestampParam: string | null = null;
  let signatureParam: string | null = null;

  try {
    if (clean.includes('?c=') || clean.includes('&c=')) {
      const urlStr = clean.startsWith('http') ? clean : `https://dummy.com/${clean.replace(/^\//, '')}`;
      const urlObj = new URL(urlStr);
      codeParam = urlObj.searchParams.get('c');
      timestampParam = urlObj.searchParams.get('t');
      signatureParam = urlObj.searchParams.get('sig');
    }
  } catch (e) {
    // Si falla el parseo de URL, se procesa como texto plano
  }

  // 2. Si tiene timestamp y firma, es un Pase Digital Dinámico
  if (codeParam && timestampParam && signatureParam) {
    const code = codeParam.trim().toUpperCase();
    const tokenTime = parseInt(timestampParam, 10);
    const expectedSig = generateHash(`${code}:${tokenTime}:${SECRET_SALT}`);

    if (signatureParam !== expectedSig) {
      return {
        code,
        isDynamic: true,
        isValid: false,
        isExpired: false,
        errorMessage: 'Firma de seguridad inválida o código digital alterado.',
      };
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const ageSeconds = nowSeconds - tokenTime;

    // Margen de tolerancia: 90 segundos para absorber desajustes de reloj y tiempo de escaneo
    // Si ageSeconds > 90, es una captura de pantalla enviada con retraso.
    if (ageSeconds > 90) {
      return {
        code,
        isDynamic: true,
        isValid: false,
        isExpired: true,
        ageSeconds,
        errorMessage: `Captura de pantalla expirada (generada hace ${Math.floor(ageSeconds / 60)} min ${ageSeconds % 60} s). Pida al cliente que muestre su membresía en vivo desde su teléfono.`,
      };
    }

    // Código dinámico válido y en vivo
    return {
      code,
      isDynamic: true,
      isValid: true,
      isExpired: false,
      ageSeconds,
    };
  }

  // 3. Si no tiene parámetros dinámicos, es una Calcomanía Física o código manual
  let fallbackCode = clean;
  if (codeParam) {
    fallbackCode = codeParam;
  } else if (clean.includes('/registro?c=')) {
    fallbackCode = clean.split('/registro?c=')[1].split('&')[0];
  } else if (clean.includes('?c=')) {
    fallbackCode = clean.split('?c=')[1].split('&')[0];
  } else if (clean.includes('/') && !clean.startsWith('http')) {
    const parts = clean.split('/');
    fallbackCode = parts[parts.length - 1];
  }

  fallbackCode = fallbackCode.replace(/#/g, '').trim().toUpperCase();

  return {
    code: fallbackCode,
    isDynamic: false,
    isValid: true,
    isExpired: false,
  };
}
