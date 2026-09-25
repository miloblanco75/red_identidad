import { recordMemberVisit, type LoyaltyMilestone } from './loyaltyService';

export interface PromotionRecord {
  id: string;
  allyId: string;
  allyName: string;
  allyCategory?: string;
  timestamp: number;
  dateStr: string; // e.g. "25/09/2026"
  timeStr: string; // e.g. "14:35:10"
  memberNumber: number; // e.g. 35
  memberCode: string; // e.g. "CB-0035", "DIG-1024", "TRIAL-8812"
  memberLevel: string; // e.g. "Membresía Digital", "Campechana Blanca", "Pase de Cortesía 24h"
  discountApplied: string; // e.g. "15% de descuento en cuenta total"
  validationMethod: 'Cámara QR en vivo' | 'Calcomanía Física' | 'Pase Cortesía 24h' | 'Validación Manual';
  phoneMasked?: string;
  totalVisits?: number;
  notes?: string;
}

const STORAGE_PREFIX = 'red_identidad_promotions_';
const GLOBAL_STORAGE_KEY = 'red_identidad_all_promotions_log';

/**
 * Obtiene el almacenamiento seguro para el navegador
 */
const getStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

/**
 * Obtener todos los registros de promociones otorgadas por un aliado específico
 */
export const getAllyPromotions = (allyId: string): PromotionRecord[] => {
  const storage = getStorage();
  if (!storage || !allyId) return [];
  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${allyId}`);
    if (raw) {
      const parsed: PromotionRecord[] = JSON.parse(raw);
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (err) {
    console.warn('Error al leer promociones del aliado:', err);
  }
  return [];
};

/**
 * Obtener todos los registros globales de todas las promociones otorgadas
 */
export const getAllPromotionsGlobal = (): PromotionRecord[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(GLOBAL_STORAGE_KEY);
    if (raw) {
      const parsed: PromotionRecord[] = JSON.parse(raw);
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (err) {
    console.warn('Error al leer log global de promociones:', err);
  }
  return [];
};

/**
 * Registrar una nueva promoción entregada por un aliado
 */
export const recordPromotionDelivery = (
  entry: {
    allyId: string;
    allyName: string;
    allyCategory?: string;
    memberNumber: number;
    memberCode: string;
    memberLevel: string;
    discountApplied: string;
    validationMethod: 'Cámara QR en vivo' | 'Calcomanía Física' | 'Pase Cortesía 24h' | 'Validación Manual';
    phoneMasked?: string;
    totalVisits?: number;
    notes?: string;
  }
): {
  record: PromotionRecord;
  loyaltyVisit?: { totalVisits: number; achievedMilestone: LoyaltyMilestone | null; nextMilestone: LoyaltyMilestone };
} => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Registrar visita en el sistema de lealtad y pasaportes si es distintivo oficial
  let loyaltyVisit;
  if (!entry.memberCode.startsWith('TRIAL-')) {
    loyaltyVisit = recordMemberVisit(
      entry.memberCode,
      entry.memberNumber,
      entry.allyName,
      entry.discountApplied
    );
  }

  const record: PromotionRecord = {
    id: `promo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    allyId: entry.allyId,
    allyName: entry.allyName,
    allyCategory: entry.allyCategory,
    timestamp: now.getTime(),
    dateStr,
    timeStr,
    memberNumber: entry.memberNumber,
    memberCode: entry.memberCode.toUpperCase().trim(),
    memberLevel: entry.memberLevel,
    discountApplied: entry.discountApplied,
    validationMethod: entry.validationMethod,
    phoneMasked: entry.phoneMasked || '',
    totalVisits: loyaltyVisit ? loyaltyVisit.totalVisits : (entry.totalVisits || 1),
    notes: entry.notes || ''
  };

  const storage = getStorage();
  if (storage) {
    try {
      // 1. Guardar en la bitácora específica del aliado
      const allyRecords = getAllyPromotions(entry.allyId);
      const updatedAllyRecords = [record, ...allyRecords];
      storage.setItem(`${STORAGE_PREFIX}${entry.allyId}`, JSON.stringify(updatedAllyRecords));

      // 2. Guardar en el log global consolidado
      const globalRecords = getAllPromotionsGlobal();
      const updatedGlobalRecords = [record, ...globalRecords.filter(r => r.id !== record.id)];
      // Limitar el global a los últimos 2000 registros para proteger almacenamiento local
      storage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(updatedGlobalRecords.slice(0, 2000)));
    } catch (err) {
      console.warn('Error al persistir registro de promoción:', err);
    }
  }

  return { record, loyaltyVisit };
};

/**
 * Escapar cadenas para formato CSV estándar
 */
const escapeCSV = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Genera y descarga un archivo CSV con UTF-8 BOM (\uFEFF)
 * Abrirá perfectamente en Microsoft Excel (Windows y Mac) sin problemas de acentos ni ñ.
 */
export const downloadPromotionsCSV = (
  records: PromotionRecord[],
  allyName: string = 'Comercio_Aliado',
  reportTitle: string = 'Reporte de Promociones Otorgadas'
): void => {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const fechaGeneracion = now.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const horaGeneracion = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const rows: string[] = [];

  // UTF-8 Byte Order Mark (BOM) para que Excel reconozca tildes y caracteres en español
  const BOM = '\uFEFF';

  // Encabezados institucionales del reporte
  rows.push(escapeCSV(`RED IDENTIDAD - ${reportTitle.toUpperCase()}`));
  rows.push(`${escapeCSV('Comercio / Aliado:')},${escapeCSV(allyName)}`);
  rows.push(`${escapeCSV('Fecha de Emisión:')},${escapeCSV(`${fechaGeneracion} a las ${horaGeneracion}`)}`);
  rows.push(`${escapeCSV('Total de Registros:')},${escapeCSV(records.length)}`);
  rows.push(''); // Línea vacía separadora

  // Cabecera de columnas de la tabla
  const headers = [
    '#',
    'Fecha',
    'Hora',
    'No. Socio',
    'Código Distintivo',
    'Tipo de Membresía',
    'Beneficio Otorgado',
    'Método de Validación',
    'Teléfono del Socio',
    'Visitas del Socio'
  ];
  rows.push(headers.map(h => escapeCSV(h)).join(','));

  // Filas de datos
  records.forEach((r, idx) => {
    const row = [
      escapeCSV(idx + 1),
      escapeCSV(r.dateStr),
      escapeCSV(r.timeStr),
      escapeCSV(r.memberNumber > 0 ? `#${String(r.memberNumber).padStart(4, '0')}` : 'Pase 24h'),
      escapeCSV(r.memberCode),
      escapeCSV(r.memberLevel),
      escapeCSV(r.discountApplied),
      escapeCSV(r.validationMethod),
      escapeCSV(r.phoneMasked || 'No registrado'),
      escapeCSV(r.totalVisits || 1)
    ];
    rows.push(row.join(','));
  });

  // Fila de resumen al pie
  rows.push('');
  rows.push(`${escapeCSV('TOTAL PROMOCIONES ENTREGADAS:')},${escapeCSV(records.length)}`);

  const csvContent = BOM + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const cleanAllyName = allyName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  const dateFile = now.toISOString().split('T')[0];
  const filename = `Reporte_Promociones_${cleanAllyName}_${dateFile}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Genera y descarga un archivo de Excel Formateado (.xls)
 * Utiliza HTML/XML estructurado que Microsoft Excel abre directamente
 * con tipografías, colores de fondo institucionales dorados y bordes.
 */
export const downloadPromotionsStyledExcel = (
  records: PromotionRecord[],
  allyName: string = 'Comercio_Aliado',
  reportTitle: string = 'Reporte de Promociones Otorgadas'
): void => {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const fechaGeneracion = now.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const horaGeneracion = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let rowsHtml = '';
  records.forEach((r, idx) => {
    const bgColor = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
    rowsHtml += `
      <tr style="background-color: ${bgColor};">
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center; font-weight: bold;">${idx + 1}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${r.dateStr}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${r.timeStr}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center; font-weight: bold; color: #1E3A8A;">${r.memberNumber > 0 ? `#${String(r.memberNumber).padStart(4, '0')}` : 'Pase 24h'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center; font-family: monospace;">${r.memberCode}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px;">${r.memberLevel}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; font-weight: bold; color: #047857;">${r.discountApplied}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${r.validationMethod}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${r.phoneMasked || 'No registrado'}</td>
        <td style="border: 1px solid #CBD5E1; padding: 8px; text-align: center;">${r.totalVisits || 1}</td>
      </tr>
    `;
  });

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Promociones Otorgadas</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; }
        .title { font-size: 16pt; font-weight: bold; color: #D4AF37; }
        .subtitle { font-size: 11pt; color: #334155; }
        .th-header { background-color: #1E293B; color: #FFFFFF; font-weight: bold; border: 1px solid #0F172A; padding: 10px; text-align: center; }
      </style>
    </head>
    <body>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td colspan="10" class="title" style="padding-bottom: 5px;">RED IDENTIDAD - ${reportTitle.toUpperCase()}</td>
        </tr>
        <tr>
          <td colspan="2" class="subtitle" style="font-weight: bold;">Comercio / Aliado:</td>
          <td colspan="8" class="subtitle">${allyName}</td>
        </tr>
        <tr>
          <td colspan="2" class="subtitle" style="font-weight: bold;">Fecha de Emisi&oacute;n:</td>
          <td colspan="8" class="subtitle">${fechaGeneracion} a las ${horaGeneracion}</td>
        </tr>
        <tr>
          <td colspan="2" class="subtitle" style="font-weight: bold;">Total de Promociones:</td>
          <td colspan="8" class="subtitle" style="font-weight: bold; color: #047857;">${records.length}</td>
        </tr>
        <tr><td colspan="10"></td></tr>
        <thead>
          <tr>
            <th class="th-header" style="background-color: #0F172A; color: #FEF08A;">#</th>
            <th class="th-header">Fecha</th>
            <th class="th-header">Hora</th>
            <th class="th-header">No. Socio</th>
            <th class="th-header">C&oacute;digo Distintivo</th>
            <th class="th-header">Tipo de Membres&iacute;a</th>
            <th class="th-header" style="background-color: #064E3B; color: #D1FAE5;">Beneficio Otorgado</th>
            <th class="th-header">M&eacute;todo de Validaci&oacute;n</th>
            <th class="th-header">Tel&eacute;fono</th>
            <th class="th-header">Visitas</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot>
          <tr><td colspan="10" style="padding-top: 10px;"></td></tr>
          <tr style="background-color: #FEF3C7; font-weight: bold;">
            <td colspan="6" style="border: 1px solid #D97706; padding: 10px; text-align: right;">TOTAL DE BENEFICIOS ENTREGADOS:</td>
            <td colspan="4" style="border: 1px solid #D97706; padding: 10px; font-size: 13pt; color: #92400E; text-align: left;">${records.length} promociones</td>
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const cleanAllyName = allyName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  const dateFile = now.toISOString().split('T')[0];
  const filename = `Reporte_Promociones_${cleanAllyName}_${dateFile}.xls`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
