export interface LoyaltyMilestone {
  visits: number;
  reward: string;
  badgeName: string;
}

export interface LoyaltyConfig {
  milestone1: LoyaltyMilestone;
  milestone2: LoyaltyMilestone;
  milestone3: LoyaltyMilestone;
}

export interface MemberVisitRecord {
  id: string;
  memberCode: string;
  memberNumber: number;
  allyName: string;
  discount: string;
  date: string;
  timestamp: number;
}

const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  milestone1: {
    visits: 5,
    reward: 'Premio Especial de Frecuencia (5 Visitas)',
    badgeName: 'Explorador Frecuente'
  },
  milestone2: {
    visits: 10,
    reward: 'Gran Recompensa de Lealtad (10 Visitas)',
    badgeName: 'Cliente Distinguido'
  },
  milestone3: {
    visits: 20,
    reward: 'Premio VIP Máxima Fidelidad (20 Visitas)',
    badgeName: 'Embajador de la Red'
  }
};

const CONFIG_KEY = 'red_identidad_loyalty_config';
const VISITS_KEY = 'red_identidad_all_member_visits';

// Obtener configuración de premios
export const getLoyaltyConfig = (): LoyaltyConfig => {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return { ...DEFAULT_LOYALTY_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error al leer configuración de lealtad:', e);
  }
  return DEFAULT_LOYALTY_CONFIG;
};

// Guardar configuración de premios (desde /admin-red)
export const saveLoyaltyConfig = (config: LoyaltyConfig): void => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Error al guardar configuración de lealtad:', e);
  }
};

// Leer todas las visitas registradas
export const getAllVisits = (): MemberVisitRecord[] => {
  try {
    const saved = localStorage.getItem(VISITS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error al leer visitas:', e);
  }
  return [];
};

// Registrar una visita desde el panel de aliados
export const recordMemberVisit = (
  memberCode: string,
  memberNumber: number,
  allyName: string,
  discount: string
): { totalVisits: number; achievedMilestone: LoyaltyMilestone | null; nextMilestone: LoyaltyMilestone } => {
  const all = getAllVisits();
  const now = new Date();
  
  const newVisit: MemberVisitRecord = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    memberCode: memberCode.toUpperCase().trim(),
    memberNumber,
    allyName,
    discount,
    date: now.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: now.getTime()
  };

  const updated = [newVisit, ...all];
  try {
    localStorage.setItem(VISITS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error al persistir visita:', e);
  }

  // Contar visitas de este socio
  const memberVisits = updated.filter(
    v => (v.memberNumber === memberNumber && memberNumber > 0) || v.memberCode === memberCode.toUpperCase().trim()
  );
  const totalVisits = memberVisits.length;

  const config = getLoyaltyConfig();
  let achievedMilestone: LoyaltyMilestone | null = null;
  if (totalVisits === config.milestone1.visits) achievedMilestone = config.milestone1;
  else if (totalVisits === config.milestone2.visits) achievedMilestone = config.milestone2;
  else if (totalVisits === config.milestone3.visits) achievedMilestone = config.milestone3;

  let nextMilestone = config.milestone1;
  if (totalVisits >= config.milestone2.visits) {
    nextMilestone = config.milestone3;
  } else if (totalVisits >= config.milestone1.visits) {
    nextMilestone = config.milestone2;
  }

  return {
    totalVisits,
    achievedMilestone,
    nextMilestone
  };
};

// Obtener estadísticas de visitas de un miembro
export const getMemberVisitsSummary = (
  memberCode?: string,
  memberNumber?: number
): { totalVisits: number; history: MemberVisitRecord[]; config: LoyaltyConfig } => {
  const all = getAllVisits();
  const cleanCode = (memberCode || '').toUpperCase().trim();
  const num = memberNumber || 0;

  const history = all.filter(
    v => (num > 0 && v.memberNumber === num) || (cleanCode !== '' && v.memberCode === cleanCode)
  );

  return {
    totalVisits: history.length,
    history,
    config: getLoyaltyConfig()
  };
};
