/**
 * Servicio de Membresía de Cortesía de 7 Días - Lanzamiento Juárez Conecta
 * 
 * Permite a los comercios aliados regalar membresías de cortesía ilimitadas
 * durante la semana de lanzamiento de Juárez Conecta (Red Identidad).
 * Control estricto anti-duplicados por número de celular (10 dígitos).
 * Al vencer los 7 días, redirige inmediatamente a la compra de la membresía digital ($80 MXN).
 */

import { supabase } from './supabase';

export interface JuarezTrialPassData {
  name: string;
  phone: string;
  code: string;
  member_number: number;
  activatedAt: string; // ISO string
  expiresAt: string;   // ISO string (7 días exactos)
  isExpired: boolean;
  remainingDays: number;
  remainingHours: number;
}

const STORAGE_KEY = 'juarez_conecta_7d_trial_pass';
export const TRIAL_DURATION_DAYS = 7;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Obtiene el pase de 7 días guardado localmente en este dispositivo
 */
export function getStoredJuarezTrialPass(): JuarezTrialPassData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vive_juarez_7d_trial_pass');
    if (!raw) return null;
    const pass = JSON.parse(raw) as JuarezTrialPassData;
    
    // Recalcular estado de expiración
    const now = Date.now();
    const expireTime = new Date(pass.expiresAt).getTime();
    const diffMs = expireTime - now;
    
    if (diffMs <= 0) {
      pass.isExpired = true;
      pass.remainingDays = 0;
      pass.remainingHours = 0;
    } else {
      pass.isExpired = false;
      pass.remainingDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      pass.remainingHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    }
    
    return pass;
  } catch (e) {
    return null;
  }
}

/**
 * Guarda el pase localmente
 */
export function saveStoredJuarezTrialPass(pass: JuarezTrialPassData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pass));
  } catch (e) {
    console.warn('Error guardando pase de 7 días local:', e);
  }
}

/**
 * Limpia el pase local
 */
export function clearStoredJuarezTrialPass(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

/**
 * Valida la vigencia de un pase de 7 días
 */
export function checkJuarezTrialValidity(pass: JuarezTrialPassData | null): {
  active: boolean;
  isExpired: boolean;
  remainingDays: number;
  remainingHours: number;
  remainingMs: number;
} {
  if (!pass) return { active: false, isExpired: false, remainingDays: 0, remainingHours: 0, remainingMs: 0 };
  
  const now = Date.now();
  const expireTime = new Date(pass.expiresAt).getTime();
  const remainingMs = expireTime - now;
  
  if (remainingMs <= 0) {
    return { active: false, isExpired: true, remainingDays: 0, remainingHours: 0, remainingMs: 0 };
  }
  
  const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  return {
    active: true,
    isExpired: false,
    remainingDays,
    remainingHours,
    remainingMs
  };
}

/**
 * Registra o recupera una membresía gratuita de 7 días por número de celular
 */
export async function requestJuarez7DayTrial(name: string, phone: string, _allyName?: string): Promise<{
  success: boolean;
  pass?: JuarezTrialPassData;
  error?: string;
  isExpired?: boolean;
  isAlreadyMember?: boolean;
}> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { success: false, error: 'Ingresa un número de celular o WhatsApp válido a 10 dígitos.' };
  }

  const phoneSuffix = cleanPhone.slice(-10);

  try {
    // 1. Verificar si ya es socio oficial de pago
    const { data: existingMember } = await supabase
      .from('stickers')
      .select('*')
      .ilike('phone', `%${phoneSuffix}%`)
      .not('level', 'in', '("trial","trial_7d","trial_expired","trial_used")')
      .maybeSingle();

    if (existingMember && existingMember.member_number > 0) {
      return {
        success: false,
        isAlreadyMember: true,
        error: `¡Este número ya cuenta con una Membresía Oficial (#${existingMember.member_number})! Accede desde tu app para ver tu credencial definitiva.`
      };
    }

    // 2. Verificar si este teléfono ya solicitó la membresía de cortesía de 7 días
    const { data: previousTrial } = await supabase
      .from('stickers')
      .select('*')
      .ilike('phone', `%${phoneSuffix}%`)
      .or('code.ilike.VJ-7D-%,level.eq.trial_7d,level.eq.trial_expired')
      .maybeSingle();

    const now = new Date();

    if (previousTrial) {
      const createdAt = new Date(previousTrial.claimed_at || previousTrial.created_at);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      // Si ya transcurrieron los 7 días
      if (diffDays >= TRIAL_DURATION_DAYS || previousTrial.level === 'trial_expired') {
        // Asegurar que en base de datos esté como trial_expired
        if (previousTrial.level !== 'trial_expired') {
          await supabase.from('stickers').update({ level: 'trial_expired' }).eq('id', previousTrial.id);
        }
        return {
          success: false,
          isExpired: true,
          error: 'Tu membresía de cortesía de 7 días ha concluido. ¡Adquiere tu Membresía Digital Oficial por solo $80 MXN para seguir recibiendo descuentos todo el año!'
        };
      }

      // Si aún está dentro de los 7 días, recuperar y devolver su pase activo
      const expiresAt = new Date(createdAt.getTime() + TRIAL_DURATION_MS).toISOString();
      const remainingMs = new Date(expiresAt).getTime() - now.getTime();
      const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
      const remainingHours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

      const passData: JuarezTrialPassData = {
        name: name.trim() || 'Invitado Juárez Conecta',
        phone: cleanPhone,
        code: previousTrial.code,
        member_number: 0,
        activatedAt: createdAt.toISOString(),
        expiresAt,
        isExpired: false,
        remainingDays,
        remainingHours
      };

      saveStoredJuarezTrialPass(passData);
      return { success: true, pass: passData };
    }

    // 3. Crear nuevo pase de prueba de 7 días
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trialCode = `VJ-7D-${phoneSuffix.slice(-4)}${randomDigits}`;
    const expiresAt = new Date(now.getTime() + TRIAL_DURATION_MS).toISOString();

    const { error: insertError } = await supabase.from('stickers').insert([{
      code: trialCode,
      phone: cleanPhone,
      member_number: 0,
      level: 'trial_7d',
      claimed_at: now.toISOString()
    }]);

    if (insertError) {
      console.warn('Supabase insert warning, using fallback:', insertError);
    }

    const passData: JuarezTrialPassData = {
      name: name.trim() || 'Invitado Juárez Conecta',
      phone: cleanPhone,
      code: trialCode,
      member_number: 0,
      activatedAt: now.toISOString(),
      expiresAt,
      isExpired: false,
      remainingDays: 7,
      remainingHours: 0
    };

    saveStoredJuarezTrialPass(passData);
    return { success: true, pass: passData };

  } catch (err: any) {
    console.error('Error generando membresía de 7 días:', err);
    // Fallback local seguro
    const now = new Date();
    const fallbackCode = `VJ-7D-${phoneSuffix.slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(now.getTime() + TRIAL_DURATION_MS).toISOString();

    const passData: JuarezTrialPassData = {
      name: name.trim() || 'Invitado Juárez Conecta',
      phone: cleanPhone,
      code: fallbackCode,
      member_number: 0,
      activatedAt: now.toISOString(),
      expiresAt,
      isExpired: false,
      remainingDays: 7,
      remainingHours: 0
    };

    saveStoredJuarezTrialPass(passData);
    return { success: true, pass: passData };
  }
}

/**
 * Obtiene la URL canónica de la campaña para el código QR de los comercios
 */
export function getJuarezCampaignQrUrl(allyId?: string): string {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://redidentidad.vercel.app';

  return allyId 
    ? `${origin}/juarez/semana-gratis?ally=${encodeURIComponent(allyId)}`
    : `${origin}/juarez/semana-gratis`;
}
