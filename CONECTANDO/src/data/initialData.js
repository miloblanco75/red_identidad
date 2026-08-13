// Initial data for Conectando - Red de Ayuda Mutua y Solidaridad

export const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80'
];

export const INITIAL_USER = {
  id: 'usr_me',
  name: 'Sofía Morales',
  tag: 'Corazón Solidario',
  avatar: AVATAR_OPTIONS[0],
  bio: 'Apasionada por tender puentes comunitarios. Creo firmemente que la empatía y la solidaridad nos hacen iguales y más fuertes a todos.',
  location: 'Zona Centro, CDMX',
  actsCompleted: 8,
  thanksReceived: 12,
  isVolunteerDriver: true,
  vehicleType: 'Automóvil particular',
  isPrivateByPreference: false
};

export const CATEGORIES = [
  { id: 'all', label: 'Todas las áreas', icon: 'Heart' },
  { id: 'salud', label: 'Salud & Enfermería', icon: 'Stethoscope' },
  { id: 'movilidad', label: 'Movilidad & Aparatos', icon: 'Accessibility' },
  { id: 'escucha', label: 'Compañía & Charla', icon: 'MessageCircle' },
  { id: 'medicinas', label: 'Medicamentos & Insumos', icon: 'Pill' },
  { id: 'alimentos', label: 'Básicos del Hogar', icon: 'ShoppingBag' },
  { id: 'educacion', label: 'Apoyo Escolar & Talleres', icon: 'BookOpen' }
];

export const INITIAL_POSTS = [
  {
    id: 'post-urgent-1',
    type: 'solicitud',
    title: '🚨 URGENCIÓN: Tanque o Concentrador de Óxigeno para Don Pedro',
    category: 'salud',
    categoryLabel: 'Salud & Enfermería',
    description: 'Requerimos de emergencia un concentrador de oxígeno o tanque en préstamo por 5 días para paciente de 78 años en recuperación pulmonar. El Staff está coordinando la recolección inmediata.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
    userName: 'Familia Mendoza',
    userAvatar: AVATAR_OPTIONS[3],
    userLocation: 'Colonia Roma Norte (A 1.2 km)',
    distanceKm: 1.2,
    deliveryMode: 'Envío Urgente / Staff',
    isPrivate: false,
    isUrgent: true,
    date: 'Hace 15 minutos',
    status: 'abierto'
  },
  {
    id: 'post-1',
    type: 'solicitud',
    title: 'Solicito Silla de Ruedas para mi abuelita (84 años)',
    category: 'movilidad',
    categoryLabel: 'Movilidad & Aparatos',
    description: 'Mi abuela Carmen sufrió una pequeña caída y no tiene la capacidad de caminar tramos largos. Necesitamos una silla de ruedas estándar o plegable en buen estado. No podemos costearla en este momento y nos sería de inmensa ayuda.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    userName: 'Mariana González',
    userAvatar: AVATAR_OPTIONS[2],
    userLocation: 'Zona Centro (A 0.8 km)',
    distanceKm: 0.8,
    deliveryMode: 'Presencial / Recolección',
    isPrivate: false,
    isUrgent: false,
    date: 'Hace 2 horas',
    status: 'abierto'
  },
  {
    id: 'post-2',
    type: 'ofrecimiento',
    title: 'Ofrezco servicio de aplicación de inyecciones y curaciones sencillas',
    category: 'salud',
    categoryLabel: 'Salud & Enfermería',
    description: 'Soy enfermera jubilada y dispongo de 3 mañanas a la semana para aplicar medicamentos inyectables prescritos o curaciones menores a personas de la tercera edad o que no puedan desplazarse.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    userName: 'Dra. Rosaura Méndez',
    userAvatar: AVATAR_OPTIONS[4],
    userLocation: 'Colonia Del Valle (A 3.1 km)',
    distanceKm: 3.1,
    deliveryMode: 'Visita Solidaria',
    isPrivate: false,
    isUrgent: false,
    date: 'Hace 5 horas',
    status: 'abierto'
  },
  {
    id: 'post-3',
    type: 'solicitud',
    title: 'Busco a alguien para platicar por teléfono o tomar un café',
    category: 'escucha',
    categoryLabel: 'Compañía & Charla',
    description: 'Vivo solo desde hace 2 años y a veces los días se sienten muy fríos y solitarios. Me encantaría conversar con alguien amable sobre historias, libros, música o simplemente la vida.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
    userName: 'Don Roberto V.',
    userAvatar: AVATAR_OPTIONS[1],
    userLocation: 'Zona Centro (A 0.5 km)',
    distanceKm: 0.5,
    deliveryMode: 'Llamada / Encuentro',
    isPrivate: false,
    isUrgent: false,
    date: 'Ayer',
    status: 'abierto'
  },
  {
    id: 'post-4',
    type: 'ofrecimiento',
    title: 'Donación Privada: Muletas ajustables de aluminio casi nuevas',
    category: 'movilidad',
    categoryLabel: 'Movilidad & Aparatos',
    description: 'Tengo un par de muletas ortopédicas de altura regulable. Se usaron solo 3 semanas por una rehabilitación leve. Prefiero entregarlas a quien las necesite de forma discreta o a través del staff.',
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80',
    userName: 'Donante Solidario (Anónimo)',
    userAvatar: AVATAR_OPTIONS[5],
    userLocation: 'Condesa (A 2.4 km)',
    distanceKm: 2.4,
    deliveryMode: 'Envío Discreto / Staff',
    isPrivate: true,
    isUrgent: false,
    date: 'Ayer',
    status: 'abierto'
  }
];

export const INITIAL_CHATS = [
  {
    id: 'chat-1',
    postId: 'post-1',
    peerName: 'Mariana González',
    peerAvatar: AVATAR_OPTIONS[2],
    postTitle: 'Solicito Silla de Ruedas para mi abuelita',
    staffSupervised: true,
    lastActivity: '10:45 AM',
    messages: [
      {
        id: 'm1',
        sender: 'peer',
        text: '¡Hola Sofía! Vi tu mensaje de apoyo sobre la silla de ruedas. ¿Aún la tienes disponible?',
        time: '10:30 AM'
      },
      {
        id: 'm2',
        sender: 'me',
        text: '¡Hola Mariana! Sí, mi tío la dejó en perfecto estado y nos da muchísima alegría que le sirva a tu abuelita Carmen.',
        time: '10:35 AM'
      },
      {
        id: 'm3',
        sender: 'staff',
        text: '🛡️ Mensaje automático del Staff: Este chat se encuentra monitoreado para la seguridad de ambas partes. Por favor acuerden puntos públicos para la entrega o coordinen con nuestros voluntarios de transporte.',
        time: '10:36 AM'
      },
      {
        id: 'm4',
        sender: 'peer',
        text: '¡Muchísimas gracias de corazón! Podríamos vernos mañana a las 4:00 PM frente al parque principal.',
        time: '10:45 AM'
      }
    ]
  },
  {
    id: 'chat-2',
    postId: 'post-3',
    peerName: 'Don Roberto V.',
    peerAvatar: AVATAR_OPTIONS[1],
    postTitle: 'Busco a alguien para platicar',
    staffSupervised: true,
    lastActivity: 'Ayer',
    messages: [
      {
        id: 'm10',
        sender: 'me',
        text: 'Hola Don Roberto, me dio mucha emoción leer su mensaje. A mí también me encanta platicar sobre libros y escuchar vivencias.',
        time: 'Ayer 5:10 PM'
      },
      {
        id: 'm11',
        sender: 'peer',
        text: '¡Hola jovencita Sofía! Qué alegría saber de ti. ¿Te gustaría tener una llamada telefónica este fin de semana?',
        time: 'Ayer 5:25 PM'
      }
    ]
  }
];

export const INITIAL_GALLERY = [
  {
    id: 'gal-1',
    title: 'Entrega de Silla Ortopédica a Don Ernesto',
    category: 'Movilidad',
    date: '02 de Agosto, 2026',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
    donor: 'Familia Ramírez',
    recipient: 'Don Ernesto (Comunidad Sur)',
    story: 'Gracias a la red solidaria, Don Ernesto ahora puede salir al jardín a disfrutar de las tardes de sol.'
  },
  {
    id: 'gal-2',
    title: 'Jornada de Inyección y Medicamentos Solidarios',
    category: 'Salud',
    date: '28 de Julio, 2026',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    donor: 'Enfermeros Voluntarios',
    recipient: 'Comunidad Adulto Mayor',
    story: 'Atención continua con cariño y profesionalismo para 14 abuelitos del barrio.'
  },
  {
    id: 'gal-3',
    title: 'Tarde de Charlas y Café en el Parque',
    category: 'Acompañamiento',
    date: '20 de Julio, 2026',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    donor: 'Grupo Amigos Solidarios',
    recipient: 'Don Roberto y la comunidad',
    story: 'Momentos compartidos que llenan el alma de conversaciones, risas y la calidez de no estar solos.'
  }
];

// 1. VOLUNTARIOS DE TRANSPORTE
export const INITIAL_VOLUNTEERS = [
  {
    id: 'vol-1',
    name: 'Carlos Ruiz',
    avatar: AVATAR_OPTIONS[5],
    vehicle: 'Camioneta de Carga Pequeña',
    zone: 'Centro & Sur CDMX',
    availability: 'Fines de semana y tardes',
    deliveriesDone: 14,
    status: 'Disponible'
  },
  {
    id: 'vol-2',
    name: 'Lucía Fernández',
    avatar: AVATAR_OPTIONS[7],
    vehicle: 'Bicicleta de Carga / A pie',
    zone: 'Colonia Roma & Condesa',
    availability: 'Lunes a Viernes (Mañanas)',
    deliveriesDone: 9,
    status: 'En ruta'
  },
  {
    id: 'vol-3',
    name: 'Sofía Morales (Tú)',
    avatar: AVATAR_OPTIONS[0],
    vehicle: 'Automóvil particular',
    zone: 'Zona Centro & Poniente',
    availability: 'Tardes y fines de semana',
    deliveriesDone: 8,
    status: 'Disponible'
  }
];

// 2. CARTAS Y MENSAJES DE GRATITUD
export const INITIAL_GRATITUDE_LETTERS = [
  {
    id: 'let-1',
    author: 'Don Roberto V.',
    authorAvatar: AVATAR_OPTIONS[1],
    recipient: 'Sofía Morales & Comunidad',
    title: 'Una llamada que me devolvió la sonrisa',
    content: 'Quiero agradecer de todo corazón a Sofía y a los muchachos de Conectando. Hacía meses que nadie me escuchaba contar mis anécdotas de juventud. Su llamada me alegró toda la semana. Dios los bendiga siempre.',
    date: 'Hace 3 días',
    audioUrl: 'https://actions.google.com/sounds/v1/human/applause_moderate.ogg',
    likesCount: 24
  },
  {
    id: 'let-2',
    author: 'Mariana & Abuelita Carmen',
    authorAvatar: AVATAR_OPTIONS[2],
    recipient: 'Familia Donante Solidaria',
    title: 'Mi abuela vuelve a ver el sol en el parque',
    content: 'No tenemos palabras para agradecer la silla de ruedas. Llegó limpísima y ajustada. Hoy llevamos a mi abuela al parque a tomar aire fresco. Gracias por tratar con tanta dignidad a las personas.',
    date: 'Ayer',
    audioUrl: null,
    likesCount: 42
  }
];

// 3. AGENDA DE CUIDADOS Y ACOMPAÑAMIENTO RECURRENTE
export const INITIAL_CARE_SCHEDULE = [
  {
    id: 'sch-1',
    title: 'Aplicación de Inyección Prescrita',
    person: 'Dra. Rosaura Méndez ➔ Sra. Teresa',
    category: 'Salud',
    day: 'Martes y Jueves',
    time: '09:30 AM',
    location: 'Domicilio Col. Roma',
    status: 'Confirmado'
  },
  {
    id: 'sch-2',
    title: 'Llamada Telefónica de Compañía',
    person: 'Sofía Morales ➔ Don Roberto V.',
    category: 'Compañía',
    day: 'Todos los Sábados',
    time: '05:00 PM',
    location: 'Llamada telefónica',
    status: 'Confirmado'
  },
  {
    id: 'sch-3',
    title: 'Sesión de Lectura y Conversación',
    person: 'Esteban M. ➔ Don Ernesto',
    category: 'Compañía',
    day: 'Miércoles',
    time: '04:00 PM',
    location: 'Parque España',
    status: 'Próximo'
  }
];
