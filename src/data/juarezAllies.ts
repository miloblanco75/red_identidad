// =========================================================
// Aliados y Comercios Simulados Oficiales de Ciudad Juárez
// =========================================================

export interface JuarezAlly {
  id: string;
  name: string;
  category: string;
  discount: string;
  lat: number;
  lng: number;
  address: string;
  subzone: 'gomez_morin' | 'misiones' | 'pronaf' | 'valle_sol' | 'mexicanidad';
  promotions_given: number;
  facebook_url?: string;
  website_url?: string;
  created_at: string;
  isMock?: boolean;
}

// Fechas dinámicas para simular que algunos son recién incorporados esta semana
const now = Date.now();
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

export const juarezAlliesList: JuarezAlly[] = [
  {
    id: 'j-ally-1',
    name: 'Burritos & Tradición Fronteriza',
    category: 'Comida',
    discount: '15% de Descuento en Consumo Total',
    lat: 31.7058,
    lng: -106.4150,
    address: 'Av. Manuel Gómez Morín 7840, Col. Campestre',
    subzone: 'gomez_morin',
    promotions_given: 145,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(2),
    isMock: true
  },
  {
    id: 'j-ally-2',
    name: 'Tacos El Chihuas 656',
    category: 'Comida',
    discount: '15% OFF en Ordenes Especiales + Refresco Gratis',
    lat: 31.7180,
    lng: -106.4270,
    address: 'Av. Tecnológico 2100, Fracc. Simona Barba',
    subzone: 'gomez_morin',
    promotions_given: 132,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(3),
    isMock: true
  },
  {
    id: 'j-ally-3',
    name: 'Royal Shine Auto Spa Juárez',
    category: 'Auto',
    discount: 'Lavado Express Gratis en tu 3ra Visita + 10% en Encerado',
    lat: 31.6980,
    lng: -106.4020,
    address: 'Paseo de la Victoria 3500 (frente a Las Misiones)',
    subzone: 'misiones',
    promotions_given: 110,
    facebook_url: 'https://facebook.com',
    website_url: 'https://autospajuarez.com',
    created_at: daysAgo(20),
    isMock: true
  },
  {
    id: 'j-ally-4',
    name: 'Café de la X Terraza',
    category: 'Comida',
    discount: 'Bebida de Cortesía al Ordenar Alimento + 10% en Repostería',
    lat: 31.7370,
    lng: -106.4480,
    address: 'Plaza de la Mexicanidad, Av. Heroico Colegio Militar',
    subzone: 'mexicanidad',
    promotions_given: 180,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(15),
    isMock: true
  },
  {
    id: 'j-ally-5',
    name: 'Barbería & Grooming El Paso del Norte',
    category: 'Servicios',
    discount: '10% OFF en Corte y Arreglo de Barba + Bebida',
    lat: 31.7290,
    lng: -106.4510,
    address: 'Zona Pronaf, Av. López Mateos 1050',
    subzone: 'pronaf',
    promotions_given: 95,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(12),
    isMock: true
  },
  {
    id: 'j-ally-6',
    name: 'Lounge 656 Gómez Morín',
    category: 'Entretenimiento',
    discount: 'Bebida de Bienvenida de Cortesía + 15% en Mesa',
    lat: 31.7010,
    lng: -106.4180,
    address: 'Corredor Gómez Morín 8210',
    subzone: 'gomez_morin',
    promotions_given: 230,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(25),
    isMock: true
  },
  {
    id: 'j-ally-7',
    name: 'TecnoFix Juárez — Apple & Android',
    category: 'Servicios de Tecnología',
    discount: '15% OFF en Micas y Fundas + Diagnóstico sin Costo',
    lat: 31.6975,
    lng: -106.4010,
    address: 'Plaza Las Misiones, Planta Alta Local 42',
    subzone: 'misiones',
    promotions_given: 165,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(1),
    isMock: true
  },
  {
    id: 'j-ally-8',
    name: 'Refaccionaria & Accesorios Frontera Norte',
    category: 'Auto',
    discount: '10% de Descuento en Baterías y Accesorios Automotrices',
    lat: 31.6850,
    lng: -106.4290,
    address: 'Av. de las Torres y Palacio de Mitla',
    subzone: 'valle_sol',
    promotions_given: 78,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(18),
    isMock: true
  },
  {
    id: 'j-ally-9',
    name: 'Clínica Dental Juárez Sonríe',
    category: 'Salud',
    discount: '20% OFF en Limpieza Dental Ultrasónica y Valoración Gratis',
    lat: 31.7210,
    lng: -106.4420,
    address: 'Av. Adolfo López Mateos 1420, Fracc. Los Nogales',
    subzone: 'pronaf',
    promotions_given: 84,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(14),
    isMock: true
  },
  {
    id: 'j-ally-10',
    name: 'Iron Border Gym 656',
    category: 'Salud',
    discount: 'Semana de Prueba Gratis + 15% OFF en Mensualidad',
    lat: 31.6890,
    lng: -106.3920,
    address: 'Calzada del Sol 2340, Zona Valle del Sol',
    subzone: 'valle_sol',
    promotions_given: 140,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(4),
    isMock: true
  },
  {
    id: 'j-ally-11',
    name: 'Pizzería La Fronteriza Artesanal',
    category: 'Comida',
    discount: '2x1 en Bebidas y 15% OFF en Pizzas Familiares',
    lat: 31.7120,
    lng: -106.4080,
    address: 'Campos Elíseos 110, Zona Residencial',
    subzone: 'gomez_morin',
    promotions_given: 115,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(8),
    isMock: true
  },
  {
    id: 'j-ally-12',
    name: 'Autolavado Las Torres Express',
    category: 'Auto',
    discount: '15% OFF en Paquete Completo con Cera Líquida',
    lat: 31.6680,
    lng: -106.3880,
    address: 'Av. de las Torres 890, Col. Henequén',
    subzone: 'valle_sol',
    promotions_given: 62,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(30),
    isMock: true
  },
  {
    id: 'j-ally-13',
    name: 'Glamour Fronterizo Salón & Spa',
    category: 'Estética',
    discount: '15% OFF en Tratamientos Capilares y Manicure Gel',
    lat: 31.7330,
    lng: -106.4380,
    address: 'Av. Paseo Triunfo de la República 4120',
    subzone: 'pronaf',
    promotions_given: 92,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(5),
    isMock: true
  },
  {
    id: 'j-ally-14',
    name: 'Boutique Frontera Urbana',
    category: 'Ventas Diversas',
    discount: '10% OFF en Ropa y Gorras Originales de la X',
    lat: 31.6995,
    lng: -106.4040,
    address: 'Paseo de la Victoria 3800, Galerías Tec',
    subzone: 'misiones',
    promotions_given: 105,
    facebook_url: 'https://facebook.com',
    website_url: '',
    created_at: daysAgo(6),
    isMock: true
  }
];

export interface JuarezZoneOption {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  center?: [number, number];
  zoom?: number;
}

export const JUAREZ_ZONES: JuarezZoneOption[] = [
  {
    id: 'todas',
    label: 'Todo Ciudad Juárez',
    shortLabel: 'Todo Juárez',
    icon: '🌵',
    center: [31.6904, -106.4245],
    zoom: 12
  },
  {
    id: 'gomez_morin',
    label: 'Corredor Gómez Morín',
    shortLabel: 'Gómez Morín',
    icon: '🍽️',
    center: [31.7050, -106.4150],
    zoom: 14
  },
  {
    id: 'misiones',
    label: 'Las Misiones / Victoria',
    shortLabel: 'Las Misiones',
    icon: '🛍️',
    center: [31.6980, -106.4020],
    zoom: 14
  },
  {
    id: 'pronaf',
    label: 'Pronaf / San Lorenzo',
    shortLabel: 'Pronaf / Triunfo',
    icon: '🏛️',
    center: [31.7330, -106.4440],
    zoom: 14
  },
  {
    id: 'valle_sol',
    label: 'Valle del Sol / Torres',
    shortLabel: 'Valle del Sol',
    icon: '🏡',
    center: [31.6850, -106.3950],
    zoom: 14
  },
  {
    id: 'digitales',
    label: 'Digitales / A Domicilio',
    shortLabel: 'Digitales',
    icon: '🌐'
  }
];
