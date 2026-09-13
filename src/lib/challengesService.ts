/**
 * Motor de Retos, Rutas Temáticas y Puntos de Recompensa
 * Red Identidad Campeche
 * 
 * Gestiona la gamificación urbana:
 * - Acumulación y canje de Puntos Identidad.
 * - Retos semanales y de días específicos (ej. Reto de Media Semana).
 * - Rutas temáticas (Café, Gastronomía, Servicios).
 * - Catálogo de recompensas y cupones de canje.
 */

import { getAllVisits } from './loyaltyService';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'weekly' | 'days' | 'milestone';
  targetVisits: number;
  rewardPoints: number;
  badgeName: string;
  daysActive?: number[]; // 0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb
  startDate?: string;
  endDate?: string;
  icon: string;
}

export interface ThematicRoute {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  targetCount: number;
  rewardPoints: number;
  badgeName: string;
  stops: {
    name: string;
    description: string;
    location?: string;
  }[];
}

export interface RewardItem {
  id: string;
  title: string;
  category: string;
  pointsCost: number;
  description: string;
  sponsorName: string;
  terms: string;
  icon: string;
}

export interface RedemptionRecord {
  id: string;
  memberCode: string;
  memberNumber: number;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  redemptionCode: string;
  date: string;
  timestamp: number;
  status: 'pending' | 'delivered';
}

const REDEMPTIONS_KEY = 'red_identidad_user_redemptions';

// ── RETOS PREDETERMINADOS DE LA RED ──
export const ACTIVE_CHALLENGES: Challenge[] = [
  {
    id: 'midweek_trio',
    title: '🎯 Trío de Media Semana (Mié - Jue)',
    description: 'Visita 3 aliados diferentes entre miércoles y jueves y acelera el consumo local.',
    category: 'days',
    targetVisits: 3,
    rewardPoints: 25,
    badgeName: 'Guerrero de Media Semana',
    daysActive: [3, 4], // Miércoles y Jueves
    icon: 'flame'
  },
  {
    id: 'weekend_flavor',
    title: '🍔 Doble Sabor de Fin de Semana (Vie - Dom)',
    description: 'Visita al menos 2 restaurantes, cafeterías o bares aliados este fin de semana.',
    category: 'days',
    targetVisits: 2,
    rewardPoints: 20,
    badgeName: 'Cazador de Sabores',
    daysActive: [5, 6, 0], // Viernes, Sábado, Domingo
    icon: 'utensils'
  },
  {
    id: 'first_step',
    title: '⭐ Explorador Novato',
    description: 'Realiza tu primera visita oficial en cualquier comercio aliado de la red.',
    category: 'milestone',
    targetVisits: 1,
    rewardPoints: 15,
    badgeName: 'Primer Paso Campechano',
    icon: 'sparkles'
  },
  {
    id: 'habit_hero',
    title: '👑 Rey de la Fidelidad (5 Visitas)',
    description: 'Acumula un total de 5 visitas en la red de aliados.',
    category: 'milestone',
    targetVisits: 5,
    rewardPoints: 35,
    badgeName: 'Consumidor Oficial',
    icon: 'trophy'
  }
];

// ── RUTAS TEMÁTICAS DE LA CIUDAD ──
export const THEMATIC_ROUTES: ThematicRoute[] = [
  {
    id: 'route_coffee',
    name: '☕ Ruta del Café y Postre',
    description: 'Recorre los mejores rincones para un café artesanal y repostería en la ciudad.',
    category: 'Cafeterías & Dulces',
    icon: 'coffee',
    targetCount: 2,
    rewardPoints: 30,
    badgeName: 'Catador de Café',
    stops: [
      { name: 'Café del Mar Campeche', description: 'Café de especialidad y vista al malecón' },
      { name: 'Cafetería & Panadería La Antigua', description: 'Pan artesanal campechano y café de olla' },
      { name: 'Repostería Dulce Tradición', description: 'Postres locales y café gourmet' }
    ]
  },
  {
    id: 'route_food',
    name: '🌮 Ruta del Sabor Campechano',
    description: 'Saboréate la auténtica gastronomía local en los mejores restaurantes aliados.',
    category: 'Gastronomía',
    icon: 'utensils',
    targetCount: 3,
    rewardPoints: 45,
    badgeName: 'Embajador Gastronómico',
    stops: [
      { name: 'Mariscos & Pescados El Vigía', description: 'Pescado frito, pan de cazón y cocteles frescos' },
      { name: 'Taquería La Muralla', description: 'Tacos tradicionales, tortas y aguas frescas' },
      { name: 'Restaurante Fuerte de San José', description: 'Comida regional yucateca y campechana' }
    ]
  },
  {
    id: 'route_services',
    name: '🚗 Ruta Automotriz & Estilo',
    description: 'Mantén tu vehículo impecable y apoya a los talleres y servicios locales.',
    category: 'Servicios',
    icon: 'car',
    targetCount: 2,
    rewardPoints: 25,
    badgeName: 'Conductor Distinguido',
    stops: [
      { name: 'AutoLavado Fast El Carmen', description: 'Lavado ecológico y detallado automotriz' },
      { name: 'Taller Mecánico & Llantas San Román', description: 'Alineación, balanceo y servicio express' }
    ]
  }
];

// ── CATÁLOGO DE RECOMPENSAS CANJEABLES ──
export const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rew_coffee',
    title: 'Café de Especialidad o Postre Gratis',
    category: 'Cafetería',
    pointsCost: 35,
    description: 'Disfruta de una bebida caliente o postre de cortesía en cafeterías aliadas participantes.',
    sponsorName: 'Café del Mar & Aliados de Café',
    terms: 'Válido de lunes a jueves presentando tu código de canje en mostrador.',
    icon: 'coffee'
  },
  {
    id: 'rew_discount30',
    title: '30% OFF en Tu Consumo Total',
    category: 'Gastronomía',
    pointsCost: 65,
    description: 'Aplica un 30% de descuento directo en tu cuenta en restaurantes aliados seleccionados.',
    sponsorName: 'Restaurantes Aliados Red Identidad',
    terms: 'Consumo máximo sujeto a condiciones de cada restaurante. Válido una vez.',
    icon: 'percent'
  },
  {
    id: 'rew_sticker_exclusive',
    title: 'Sticker Oficial Coleccionable Holográfico',
    category: 'Merch Oficial',
    pointsCost: 90,
    description: 'Edición conmemorativa limitada metálica/holográfica de la Red Identidad con escudo de vinil.',
    sponsorName: 'Red Identidad Oficial',
    terms: 'Entrega física en puntos de distribución o envío coordinado por WhatsApp.',
    icon: 'shield'
  },
  {
    id: 'rew_vip_gold',
    title: 'Acceso VIP Dorado por 3 Meses',
    category: 'Membresía VIP',
    pointsCost: 150,
    description: 'Eleva tu membresía al Nivel Oro con acceso al Salón Dorado y mayores descuentos.',
    sponsorName: 'Red Identidad Club',
    terms: 'Actualización digital instantánea en tu credencial tras verificación.',
    icon: 'crown'
  }
];

// ── GESTIÓN DE CANJES ──
export const getRedemptions = (memberCode?: string, memberNumber?: number): RedemptionRecord[] => {
  try {
    const raw = localStorage.getItem(REDEMPTIONS_KEY);
    if (!raw) return [];
    const list: RedemptionRecord[] = JSON.parse(raw);
    const cleanCode = (memberCode || '').toUpperCase().trim();
    return list.filter(r => 
      (cleanCode && r.memberCode === cleanCode) ||
      (memberNumber && memberNumber > 0 && r.memberNumber === memberNumber)
    );
  } catch (e) {
    console.warn('Error al leer canjes:', e);
    return [];
  }
};

export const saveRedemption = (record: RedemptionRecord): void => {
  try {
    const raw = localStorage.getItem(REDEMPTIONS_KEY);
    const list: RedemptionRecord[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify([record, ...list]));
  } catch (e) {
    console.warn('Error al guardar canje:', e);
  }
};

/**
 * Calcula el resumen completo de Puntos, Retos y Rutas de un socio.
 */
export const getUserGamificationProfile = (
  memberCode?: string,
  memberNumber?: number
): {
  totalVisits: number;
  basePoints: number;
  challengeBonusPoints: number;
  routeBonusPoints: number;
  spentPoints: number;
  availablePoints: number;
  challenges: (Challenge & { current: number; completed: boolean; progressPercent: number })[];
  routes: (ThematicRoute & { currentStopsCount: number; completed: boolean; progressPercent: number })[];
  redemptions: RedemptionRecord[];
} => {
  const allVisits = getAllVisits();
  const cleanCode = (memberCode || '').toUpperCase().trim();

  // Filtrar visitas del socio
  const userVisits = allVisits.filter(v => 
    (cleanCode && v.memberCode === cleanCode) ||
    (memberNumber && memberNumber > 0 && v.memberNumber === memberNumber)
  );

  const totalVisits = userVisits.length;
  // Cada visita otorga 10 puntos base
  const basePoints = totalVisits * 10;

  // 1. Evaluar Retos
  let challengeBonusPoints = 0;
  const evaluatedChallenges = ACTIVE_CHALLENGES.map(ch => {
    let current = 0;

    if (ch.category === 'milestone') {
      current = Math.min(ch.targetVisits, totalVisits);
    } else if (ch.daysActive && ch.daysActive.length > 0) {
      // Contar visitas en los días activos especificados
      current = userVisits.filter(v => {
        const d = new Date(v.timestamp);
        return ch.daysActive!.includes(d.getDay());
      }).length;
    } else {
      current = Math.min(ch.targetVisits, totalVisits);
    }

    const completed = current >= ch.targetVisits;
    if (completed) {
      challengeBonusPoints += ch.rewardPoints;
    }

    const progressPercent = Math.min(100, Math.round((current / ch.targetVisits) * 100));

    return {
      ...ch,
      current,
      completed,
      progressPercent
    };
  });

  // 2. Evaluar Rutas Temáticas
  let routeBonusPoints = 0;
  const evaluatedRoutes = THEMATIC_ROUTES.map(rt => {
    // Contar cuántas paradas de esta ruta ha visitado el usuario
    const visitedStops = new Set<string>();
    
    userVisits.forEach(v => {
      const vName = v.allyName.toLowerCase();
      rt.stops.forEach(stop => {
        if (vName.includes(stop.name.toLowerCase()) || stop.name.toLowerCase().includes(vName)) {
          visitedStops.add(stop.name);
        }
      });
    });

    // Fallback: si no coincide exactamente el nombre, cada visita suma a rutas afines
    const currentStopsCount = Math.min(rt.targetCount, Math.max(visitedStops.size, Math.floor(totalVisits / 2)));
    const completed = currentStopsCount >= rt.targetCount;

    if (completed) {
      routeBonusPoints += rt.rewardPoints;
    }

    const progressPercent = Math.min(100, Math.round((currentStopsCount / rt.targetCount) * 100));

    return {
      ...rt,
      currentStopsCount,
      completed,
      progressPercent
    };
  });

  // 3. Puntos gastados en canjes
  const redemptions = getRedemptions(memberCode, memberNumber);
  const spentPoints = redemptions.reduce((sum, r) => sum + r.pointsCost, 0);

  // Saldo final disponible
  const grossPoints = basePoints + challengeBonusPoints + routeBonusPoints;
  const availablePoints = Math.max(0, grossPoints - spentPoints);

  return {
    totalVisits,
    basePoints,
    challengeBonusPoints,
    routeBonusPoints,
    spentPoints,
    availablePoints,
    challenges: evaluatedChallenges,
    routes: evaluatedRoutes,
    redemptions
  };
};

/**
 * Realiza el canje de una recompensa para el socio.
 */
export const redeemRewardForMember = (
  reward: RewardItem,
  memberCode?: string,
  memberNumber?: number,
  phone?: string
): { success: boolean; error?: string; redemptionCode?: string; whatsappUrl?: string } => {
  const profile = getUserGamificationProfile(memberCode, memberNumber);

  if (profile.availablePoints < reward.pointsCost) {
    return {
      success: false,
      error: `Puntos insuficientes. Tienes ${profile.availablePoints} pts y se requieren ${reward.pointsCost} pts.`
    };
  }

  const cleanCode = (memberCode || `RED-${memberNumber || 1}`).toUpperCase().trim();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const redemptionCode = `VALE-${reward.id.slice(4, 8).toUpperCase()}-${rand}`;

  const record: RedemptionRecord = {
    id: `red_${Date.now()}`,
    memberCode: cleanCode,
    memberNumber: memberNumber || 1,
    rewardId: reward.id,
    rewardTitle: reward.title,
    pointsCost: reward.pointsCost,
    redemptionCode,
    date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    status: 'pending'
  };

  saveRedemption(record);

  // Generar URL para entrega por WhatsApp con el soporte de Red Identidad
  const text = encodeURIComponent(
    `¡Hola Red Identidad! 🎉 He canjeado mi recompensa en la app:\n\n` +
    `🎁 Premio: ${reward.title}\n` +
    `🔢 Vale de Canje: ${redemptionCode}\n` +
    `⭐ Puntos Canjeados: ${reward.pointsCost} pts\n` +
    `👤 Socio: ${cleanCode} ${phone ? `(Tel: ${phone})` : ''}\n\n` +
    `¿Me ayudan a coordinar la entrega/aplicación de mi beneficio?`
  );

  const whatsappUrl = `https://wa.me/529811385474?text=${text}`;

  return {
    success: true,
    redemptionCode,
    whatsappUrl
  };
};
