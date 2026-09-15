/**
 * Servicio de Pase de Cortesía por 24 Horas (Trial Pass) - Red Identidad
 * 
 * Permite a usuarios nuevos obtener 1 descuento de prueba gratis durante 24 horas
 * para acelerar la conversión a calcomanía física ($90) o membresía digital ($45).
 */

import { supabase } from './supabase';

export interface TrialPassData {
  name: string;
  phone: string;
  code: string;
  member_number: number;
  activatedAt: string; // ISO string
  expiresAt: string;   // ISO string (24h después)
  isUsed: boolean;
  usedAt?: string;
  usedAtAlly?: string;
}

const STORAGE_KEY = 'red_identidad_trial_pass';

/**
 * Obtiene el pase de prueba guardado en el dispositivo actual
 */
export function getStoredTrialPass(): TrialPassData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TrialPassData;
  } catch (e) {
    return null;
  }
}

/**
 * Guarda o actualiza el pase de prueba local
 */
export function saveStoredTrialPass(pass: TrialPassData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pass));
  } catch (e) {
    console.warn('Error guardando trial pass local:', e);
  }
}

/**
 * Limpia el pase de prueba local
 */
export function clearStoredTrialPass(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

/**
 * Verifica si un pase de prueba sigue vigente (menos de 24 horas desde creación)
 */
export function isTrialPassActive(pass: TrialPassData | null): { active: boolean; reason?: 'expired' | 'used' | 'none'; remainingMs: number } {
  if (!pass) return { active: false, reason: 'none', remainingMs: 0 };
  
  if (pass.isUsed) {
    return { active: false, reason: 'used', remainingMs: 0 };
  }

  const now = Date.now();
  const expireTime = new Date(pass.expiresAt).getTime();
  const remainingMs = expireTime - now;

  if (remainingMs <= 0) {
    return { active: false, reason: 'expired', remainingMs: 0 };
  }

  return { active: true, remainingMs };
}

/**
 * Genera o reactiva un pase de cortesía de 24 horas para un número de WhatsApp
 */
export async function requestTrialPass(name: string, phone: string): Promise<{
  success: boolean;
  pass?: TrialPassData;
  error?: string;
  alreadyUsed?: boolean;
}> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { success: false, error: 'Ingresa un número de WhatsApp válido (10 dígitos).' };
  }

  try {
    // 1. Verificar si ya es socio oficial con membresía pagada
    const { data: existingSticker } = await supabase
      .from('stickers')
      .select('*')
      .ilike('phone', `%${cleanPhone.slice(-10)}%`)
      .maybeSingle();

    if (existingSticker && !existingSticker.code?.startsWith('TRIAL-')) {
      return {
        success: false,
        error: `¡Este WhatsApp ya cuenta con una Membresía Oficial (#${existingSticker.member_number})! Entra a "Mi Pase" para ver tu credencial definitiva.`
      };
    }

    // 2. Verificar en base de datos si este teléfono ya tuvo un trial pass registrado
    const { data: previousTrial } = await supabase
      .from('stickers')
      .select('*')
      .ilike('code', 'TRIAL-%')
      .ilike('phone', `%${cleanPhone.slice(-10)}%`)
      .maybeSingle();

    const now = new Date();
    
    if (previousTrial) {
      // Si ya existía, revisar si sus 24h ya expiraron o si ya fue usado
      const createdAt = new Date(previousTrial.claimed_at || previousTrial.created_at);
      const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      // Si pasaron más de 24 horas o ya fue usado
      if (diffHours >= 24 || previousTrial.level === 'trial_used') {
        return {
          success: false,
          alreadyUsed: true,
          error: 'Este número ya disfrutó de su Pase de Cortesía de 24 Horas. Adquiere tu Membresía Oficial para seguir disfrutando de descuentos.'
        };
      }

      // Si aún está dentro de las 24 horas, recuperar su pase
      const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString();
      const trialData: TrialPassData = {
        name: name.trim() || 'Invitado Especial',
        phone: cleanPhone,
        code: previousTrial.code,
        member_number: previousTrial.member_number || 0,
        activatedAt: createdAt.toISOString(),
        expiresAt,
        isUsed: false
      };
      saveStoredTrialPass(trialData);
      return { success: true, pass: trialData };
    }

    // 3. Crear nuevo pase de prueba de 24h
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trialCode = `TRIAL-${cleanPhone.slice(-4)}${randomSuffix}`;
    const trialNumber = 0; // Indicador de cortesía
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // Guardar registro en Supabase para evitar reusos fraudulentos
    await supabase.from('stickers').insert([{
      code: trialCode,
      phone: cleanPhone,
      member_number: trialNumber,
      level: 'trial',
      claimed_at: now.toISOString()
    }]);

    const trialData: TrialPassData = {
      name: name.trim() || 'Invitado',
      phone: cleanPhone,
      code: trialCode,
      member_number: trialNumber,
      activatedAt: now.toISOString(),
      expiresAt,
      isUsed: false
    };

    saveStoredTrialPass(trialData);
    return { success: true, pass: trialData };
  } catch (err: any) {
    console.error('Error generando trial pass:', err);
    // Fallback local en caso de error de red
    const now = new Date();
    const fallbackCode = `TRIAL-${cleanPhone.slice(-4)}`;
    const trialData: TrialPassData = {
      name: name.trim() || 'Invitado',
      phone: cleanPhone,
      code: fallbackCode,
      member_number: 0,
      activatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false
    };
    saveStoredTrialPass(trialData);
    return { success: true, pass: trialData };
  }
}

/**
 * Marca el pase de prueba como usado cuando un aliado lo escanea
 */
export async function consumeTrialPass(code: string, allyName: string): Promise<boolean> {
  try {
    const local = getStoredTrialPass();
    if (local && local.code === code) {
      local.isUsed = true;
      local.usedAt = new Date().toISOString();
      local.usedAtAlly = allyName;
      saveStoredTrialPass(local);
    }

    await supabase
      .from('stickers')
      .update({ level: 'trial_used' })
      .eq('code', code);

    return true;
  } catch (e) {
    console.warn('Error consumiendo trial pass:', e);
    return false;
  }
}
