import { supabase } from './supabase';

export interface QrScanLog {
  id: string;
  code: string;
  city: 'campeche' | 'juarez';
  source: string;
  sourceLabel: string;
  timestamp: string;
}

export interface QrCampaignStats {
  totalScans: number;
  streetScans: number;
  galeriasScans: number;
  otherScans: number;
  totalTrials: number;
  conversionRate: string;
  scansBySource: Record<string, number>;
  recentScans: QrScanLog[];
}

const LOCAL_SCANS_KEY = 'red_identidad_offline_qr_scans';

/**
 * Normaliza la fuente del escaneo a partir de los query parameters.
 * NOTA CRUCIAL: Si viene vacío o sin parámetros, significa que proviene
 * del QR FÍSICO QUE YA ESTÁ PEGADO EN LAS CALLES de Campeche o Juárez.
 */
export function normalizeScanSource(rawSource?: string | null): { source: string; sourceLabel: string } {
  if (!rawSource || rawSource.trim() === '') {
    return {
      source: 'calle_pegados',
      sourceLabel: 'Stickers en Calle / Paradas (Físicos)'
    };
  }

  const s = rawSource.toLowerCase().trim();

  if (s.includes('galeria') || s.includes('mall') || s.includes('plaza')) {
    return {
      source: 'galerias',
      sourceLabel: 'Plaza Galerías Campeche'
    };
  }

  if (s.includes('parada') || s.includes('poste') || s.includes('terminal')) {
    return {
      source: 'paradas_camion',
      sourceLabel: 'Paradas de Camión / Terminales'
    };
  }

  if (s.includes('bostons') || s.includes('sushi') || s.includes('marti') || s.includes('ishop')) {
    return {
      source: `aliado_${s}`,
      sourceLabel: `Comercio Aliado (${s.toUpperCase()})`
    };
  }

  if (s.includes('aliado') || s.includes('ally')) {
    return {
      source: s,
      sourceLabel: 'Comercio / Mostrador Aliado'
    };
  }

  if (s.includes('whatsapp') || s.includes('wa')) {
    return {
      source: 'whatsapp_compartido',
      sourceLabel: 'Compartido por WhatsApp'
    };
  }

  return {
    source: s,
    sourceLabel: `Campaña ${s}`
  };
}

/**
 * Registra un escaneo QR en tiempo real cuando alguien abre la página.
 * Funciona de inmediato sin necesidad de cambiar los stickers ya pegados.
 */
export async function recordQrScan(city: 'campeche' | 'juarez', rawSource?: string | null): Promise<boolean> {
  const { source, sourceLabel } = normalizeScanSource(rawSource);
  const sessionKey = `qr_scanned_session_${city}_${source}`;
  const cooldownKey = `qr_cooldown_${city}_${source}`;

  try {
    // 1. Evitar contar recargas seguidas del mismo usuario (cooldown de 15 min por sesión)
    if (typeof window !== 'undefined') {
      const inSession = sessionStorage.getItem(sessionKey);
      const lastScanned = localStorage.getItem(cooldownKey);
      const nowMs = Date.now();

      if (inSession) return false;
      if (lastScanned && nowMs - parseInt(lastScanned, 10) < 15 * 60 * 1000) {
        return false;
      }

      sessionStorage.setItem(sessionKey, '1');
      localStorage.setItem(cooldownKey, nowMs.toString());
    }

    const now = new Date();
    const cityCode = city === 'juarez' ? 'JRA' : 'CAM';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const scanCode = `SCAN-${cityCode}-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;
    const levelStr = `scan_${city}_${source}`.slice(0, 40);

    // 2. Guardar en Supabase tabla 'stickers'
    // phone tiene prefijo 'SCAN_' para que no se confunda con celular real ni con null
    const { error } = await supabase.from('stickers').insert([{
      code: scanCode,
      phone: `SCAN_${source.toUpperCase()}`,
      member_number: 0,
      level: levelStr,
      claimed_at: now.toISOString()
    }]);

    if (error) {
      console.warn('Registro de escaneo Supabase (aviso seguro):', error.message);
    }

    // 3. Respaldo local
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(LOCAL_SCANS_KEY);
        const list: QrScanLog[] = raw ? JSON.parse(raw) : [];
        list.unshift({
          id: scanCode,
          code: scanCode,
          city,
          source,
          sourceLabel,
          timestamp: now.toISOString()
        });
        localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(list.slice(0, 50)));
      } catch (e) {}
    }

    return true;
  } catch (err) {
    console.error('Error al registrar escaneo QR:', err);
    return false;
  }
}

/**
 * Consulta las métricas consolidadas de escaneos y activaciones de 7 días
 */
export async function getQrCampaignStats(cityFilter: 'campeche' | 'juarez' | 'all' = 'all'): Promise<QrCampaignStats> {
  const result: QrCampaignStats = {
    totalScans: 0,
    streetScans: 0,
    galeriasScans: 0,
    otherScans: 0,
    totalTrials: 0,
    conversionRate: '0.0%',
    scansBySource: {},
    recentScans: []
  };

  try {
    // 1. Obtener escaneos brutos desde Supabase
    let scanQuery = supabase
      .from('stickers')
      .select('code, level, phone, claimed_at, created_at')
      .like('code', 'SCAN-%')
      .order('claimed_at', { ascending: false });

    if (cityFilter === 'campeche') {
      scanQuery = scanQuery.or('code.ilike.SCAN-CAM-%,level.ilike.%campeche%');
    } else if (cityFilter === 'juarez') {
      scanQuery = scanQuery.or('code.ilike.SCAN-JRA-%,level.ilike.%juarez%');
    }

    const { data: scanRows, error: scanErr } = await scanQuery.limit(500);

    if (!scanErr && scanRows && scanRows.length > 0) {
      result.totalScans = scanRows.length;

      scanRows.forEach((row: any) => {
        const lvl = (row.level || '').toLowerCase();
        const ph = (row.phone || '').toLowerCase();

        let srcKey = 'calle_pegados';
        if (lvl.includes('galeria') || ph.includes('galeria')) {
          srcKey = 'galerias';
          result.galeriasScans++;
        } else if (lvl.includes('calle') || ph.includes('calle') || lvl.includes('parada') || ph.includes('parada')) {
          srcKey = 'calle_pegados';
          result.streetScans++;
        } else {
          srcKey = lvl.replace('scan_campeche_', '').replace('scan_juarez_', '') || 'otros';
          result.otherScans++;
        }

        result.scansBySource[srcKey] = (result.scansBySource[srcKey] || 0) + 1;
      });

      // Recientes
      result.recentScans = scanRows.slice(0, 15).map((row: any) => {
        const isJuarez = row.code?.includes('-JRA-') || row.level?.includes('juarez');
        const rawSrc = (row.phone || '').replace('SCAN_', '').toLowerCase();
        const { source, sourceLabel } = normalizeScanSource(rawSrc);

        return {
          id: row.code,
          code: row.code,
          city: isJuarez ? 'juarez' : 'campeche',
          source,
          sourceLabel,
          timestamp: row.claimed_at || row.created_at || new Date().toISOString()
        };
      });
    }

    // 2. Obtener activaciones de 7 días completadas (personas que dejaron su WhatsApp)
    let trialQuery = supabase
      .from('stickers')
      .select('id, code, level, phone, member_number, claimed_at', { count: 'exact' })
      .or('code.ilike.CAM-7D-%,code.ilike.VJ-7D-%,code.ilike.RED-7D-%,level.eq.trial_7d,level.eq.trial_7d_juarez,level.eq.trial_expired');

    if (cityFilter === 'campeche') {
      trialQuery = trialQuery.or('code.ilike.CAM-7D-%,code.ilike.RED-7D-%,level.eq.trial_7d');
    } else if (cityFilter === 'juarez') {
      trialQuery = trialQuery.or('code.ilike.VJ-7D-%,level.eq.trial_7d_juarez');
    }

    const { count: trialCount, error: trialErr } = await trialQuery;

    if (!trialErr && typeof trialCount === 'number') {
      result.totalTrials = trialCount;
    }

    // Si aún no hay escaneos en Supabase pero hay registros de prueba locales
    if (result.totalScans === 0 && typeof window !== 'undefined') {
      const localRaw = localStorage.getItem(LOCAL_SCANS_KEY);
      if (localRaw) {
        const localList: QrScanLog[] = JSON.parse(localRaw);
        result.totalScans = localList.length;
        result.recentScans = localList.slice(0, 15);
        result.streetScans = localList.filter(s => s.source === 'calle_pegados').length;
        result.galeriasScans = localList.filter(s => s.source === 'galerias').length;
        result.otherScans = result.totalScans - result.streetScans - result.galeriasScans;
      }
    }

    // Calcular tasa de conversión
    if (result.totalScans > 0) {
      const rate = ((result.totalTrials / result.totalScans) * 100).toFixed(1);
      result.conversionRate = `${rate}%`;
    } else if (result.totalTrials > 0) {
      result.conversionRate = '100%';
    } else {
      result.conversionRate = '0.0%';
    }

  } catch (err) {
    console.warn('Error obteniendo métricas de campaña QR:', err);
  }

  return result;
}
