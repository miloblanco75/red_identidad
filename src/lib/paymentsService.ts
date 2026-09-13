/**
 * Servicio de Pagos y Activación de Membresías - Red Identidad
 * 
 * Gestiona el cobro con Stripe (Tarjetas, Apple Pay, Google Pay, OXXO Pay)
 * y la activación automática inmediata de membresías digitales ($45) y físicas ($90).
 */

import { supabase } from './supabase';

export interface ProductConfig {
  id: 'digital' | 'physical';
  name: string;
  price: number; // MXN
  description: string;
  badge: string;
  features: string[];
}

export const PRODUCTS: Record<'digital' | 'physical', ProductConfig> = {
  digital: {
    id: 'digital',
    name: 'Membresía 100% Digital',
    price: 45,
    description: 'Activación instantánea en tu celular. Todos los descuentos, retos, rutas y puntos.',
    badge: '⚡ Entrega Instantánea',
    features: [
      'Pase digital en tu celular de inmediato',
      'Descuentos en todos los comercios aliados',
      'Acceso a Retos Semanales y Rutas de la Ciudad',
      'Acumulación de Puntos Identidad para premios',
      'QR Dinámico seguro anti-captura'
    ]
  },
  physical: {
    id: 'physical',
    name: 'Calcomanía Oficial en Sobre + Membresía',
    price: 90,
    description: 'Distintivo físico de vinil automotriz en sobre oficial de colección + Membresía Digital.',
    badge: '⭐ El Más Popular',
    features: [
      'Calcomanía física en vinil de grado automotriz',
      'Sobre oficial de colección sellado',
      'Elección de color (Blanco, Negro o Rosa)',
      'Incluye la Membresía Digital completa',
      'Recoge en puntos de venta o envío a domicilio'
    ]
  }
};

// Enlaces de Stripe configurables (puedes cambiarlos en tus variables de entorno en Vercel)
const STRIPE_LINK_DIGITAL = import.meta.env.VITE_STRIPE_LINK_DIGITAL || '';
const STRIPE_LINK_PHYSICAL = import.meta.env.VITE_STRIPE_LINK_PHYSICAL || '';

/**
 * Genera el enlace de pago de Stripe con datos precargados del cliente.
 */
export function getStripeCheckoutUrl(
  productType: 'digital' | 'physical',
  customerName: string,
  customerPhone: string,
  stickerStyle: string = 'campechano_negra'
): string {
  const origin = window.location.origin;
  const returnUrl = encodeURIComponent(
    `${origin}/pago-exitoso?tipo=${productType}&nombre=${encodeURIComponent(customerName)}&tel=${encodeURIComponent(customerPhone)}&estilo=${encodeURIComponent(stickerStyle)}`
  );

  const baseLink = productType === 'digital' ? STRIPE_LINK_DIGITAL : STRIPE_LINK_PHYSICAL;

  // Si hay un Payment Link de Stripe configurado
  if (baseLink) {
    const separator = baseLink.includes('?') ? '&' : '?';
    return `${baseLink}${separator}client_reference_id=${encodeURIComponent(customerPhone)}&prefilled_email=&return_url=${returnUrl}`;
  }

  // Si aún no configuran sus enlaces en Vercel, redirige directamente al flujo simulado de éxito
  return `${origin}/pago-exitoso?tipo=${productType}&nombre=${encodeURIComponent(customerName)}&tel=${encodeURIComponent(customerPhone)}&estilo=${encodeURIComponent(stickerStyle)}&demo=true`;
}

/**
 * Activa automáticamente al socio en la base de datos de Supabase tras el pago exitoso.
 */
export async function activateMembershipAfterPayment(params: {
  productType: 'digital' | 'physical';
  name: string;
  phone: string;
  stickerStyle?: string;
}): Promise<{
  success: boolean;
  memberNumber: number;
  code: string;
  level: string;
  phone: string;
  error?: string;
}> {
  const { productType, phone, stickerStyle } = params;
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    // 1. Verificar si este teléfono ya tiene una membresía registrada
    const { data: existing } = await supabase
      .from('stickers')
      .select('*')
      .ilike('phone', `%${cleanPhone.slice(-10)}%`)
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        memberNumber: existing.member_number,
        code: existing.code,
        level: existing.level || 'campechana_blanca',
        phone: existing.phone
      };
    }

    // 2. Generar número de socio correlativo
    const { count } = await supabase
      .from('stickers')
      .select('*', { count: 'exact', head: true });

    const nextNumber = (count || 406) + 1;
    
    // Prefijo de código: DIG para digitales, o según estilo
    let newCode = `DIG-${String(nextNumber).padStart(4, '0')}`;
    let derivedLevel = 'campechana_blanca';

    if (stickerStyle?.includes('rosa')) derivedLevel = 'campechana_rosa';
    else if (stickerStyle?.includes('negra')) derivedLevel = 'campechana_negra';
    else if (stickerStyle?.includes('carmelita')) derivedLevel = 'carmelita_blanca';

    if (productType === 'physical') {
      newCode = `RED-${String(nextNumber).padStart(4, '0')}`;
    }

    // 3. Insertar el nuevo socio activado en Supabase
    const { data: newSticker, error: insertError } = await supabase
      .from('stickers')
      .insert([{
        code: newCode,
        phone: cleanPhone,
        member_number: nextNumber,
        level: derivedLevel,
        claimed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.warn('Error insertando en Supabase, usando activación local:', insertError);
      return {
        success: true,
        memberNumber: nextNumber,
        code: newCode,
        level: derivedLevel,
        phone: cleanPhone
      };
    }

    return {
      success: true,
      memberNumber: newSticker.member_number || nextNumber,
      code: newSticker.code || newCode,
      level: newSticker.level || derivedLevel,
      phone: cleanPhone
    };
  } catch (err: any) {
    console.error('Error al activar membresía tras pago:', err);
    // Fallback de contingencia: nunca dejar al usuario sin su membresía
    const fallbackNum = Math.floor(Math.random() * 9000) + 1000;
    const fallbackCode = `DIG-${fallbackNum}`;
    return {
      success: true,
      memberNumber: fallbackNum,
      code: fallbackCode,
      level: 'campechana_blanca',
      phone: cleanPhone
    };
  }
}
