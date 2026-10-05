import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Sparkles, ShoppingBag, Store, MapPin, 
  ChevronRight, CheckCircle2, ChevronDown, ChevronUp,
  CreditCard, Smartphone, Car, Utensils, Wine, HeartPulse, 
  Briefcase, ArrowRight, MessageCircle, Star, Users,
  Calculator, Check, ExternalLink, Menu, X, Compass, Award,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BuyStickerModal } from '../components/BuyStickerModal';
import { useAuth } from '../contexts/AuthContext';
import { useCity } from '../contexts/CityContext';

// WhatsApp oficial de atención
const ADMIN_WHATSAPP = '529811971305';

// Definición exacta de distintivos oficiales (idéntica a Galeria.tsx)
interface StickerInfo {
  id: string;
  name: string;
  category: 'campechano' | 'campechana' | 'carmelita';
  colorName: string;
  colorType: 'black' | 'white' | 'pink';
  rarity: 'essential' | 'special';
  imagePath: string;
  description: string;
  perk: string;
}

const STICKERS_DATA: StickerInfo[] = [
  // Campechano Soy
  {
    id: 'campechano_blanca',
    name: 'Campechano Soy (Blanca)',
    category: 'campechano',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/campechano_oficial.svg',
    description: 'Edición Blanca oficial de Puerta de Tierra en vinil de alta resistencia para vehículo o cristal.',
    perk: 'Acceso a la Red de Aliados y beneficios en todo el estado.'
  },
  {
    id: 'campechano_negra',
    name: 'Campechano Soy (Negra)',
    category: 'campechano',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/campechano_oficial.svg',
    description: 'Edición Negra mate oficial de Puerta de Tierra con corte de precisión.',
    perk: 'Acceso a la Red de Aliados y beneficios en todo el estado.'
  },

  // Campechana Soy
  {
    id: 'campechana_blanca',
    name: 'Campechana Soy (Blanca)',
    category: 'campechana',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/campechana_rosada.png',
    description: 'Edición Campechana Blanca oficial en vinil automotriz brillante de alta resistencia para vehículo o cristal.',
    perk: 'Acceso a la Red de Aliados y descuentos en todo el estado.'
  },
  {
    id: 'campechana_negra',
    name: 'Campechana Soy (Negra)',
    category: 'campechana',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/campechana_rosada.png',
    description: 'Edición Campechana Negra mate oficial en vinil automotriz de alta resistencia.',
    perk: 'Acceso a la Red de Aliados y descuentos en todo el estado.'
  },
  {
    id: 'campechana_rosa',
    name: 'Campechana Soy (Rosa)',
    category: 'campechana',
    colorName: 'Rosa',
    colorType: 'pink',
    rarity: 'special',
    imagePath: '/campechana_rosada.png',
    description: 'Edición Campechana Rosa oficial en vinil de colección inspirada en la calidez campechana.',
    perk: 'Acceso a la Red de Aliados y descuentos en todo el estado.'
  },

  // Carmelita Soy
  {
    id: 'carmelita_blanca',
    name: 'Carmelita Soy (Blanca)',
    category: 'carmelita',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/carmelita_rosada.png',
    description: 'Edición Carmelita Blanca con el símbolo emblemático del Camarón de la Isla de Carmen.',
    perk: 'Acceso a la Red de Aliados y beneficios en la isla.'
  },
  {
    id: 'carmelita_negra',
    name: 'Carmelita Soy (Negra)',
    category: 'carmelita',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/carmelita_rosada.png',
    description: 'Edición Carmelita Negra mate de alta resistencia.',
    perk: 'Acceso a la Red de Aliados y beneficios en la isla.'
  },
  {
    id: 'carmelita_rosa',
    name: 'Carmelita Soy (Rosa)',
    category: 'carmelita',
    colorName: 'Rosa',
    colorType: 'pink',
    rarity: 'special',
    imagePath: '/carmelita_rosada.png',
    description: 'Edición Carmelita Rosa en vinil pastel con corte de precisión.',
    perk: 'Acceso a la Red de Aliados y promociones especiales en Ciudad del Carmen.'
  }
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCity } = useCity();

  // Asegurar que al estar en la landing de Campeche siempre se inicialice en modo Campeche
  useEffect(() => {
    setCity('campeche');
  }, [setCity]);

  // Helper de navegación a la app móvil asegurando contexto Campeche
  const goToApp = (path: string = '/app') => {
    setCity('campeche');
    navigate(`${path}?city=campeche`);
  };

  // Estados de navegación y modales
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStickerForModal, setSelectedStickerForModal] = useState<string>('campechano_negra');
  const [showMerchantModal, setShowMerchantModal] = useState(false);

  // Estados del visor de la colección oficial (idéntico a Galeria.tsx)
  const [galleryCategory, setGalleryCategory] = useState<'todos' | 'campechano' | 'campechana' | 'carmelita'>('todos');
  const [selectedSticker, setSelectedSticker] = useState<StickerInfo>(STICKERS_DATA[0]);
  const [simulatorMode, setSimulatorMode] = useState<'car' | 'phone'>('car');

  // Estado para comercios aliados
  const [allies, setAllies] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loadingAllies, setLoadingAllies] = useState(true);

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculadora de ahorro
  const [monthlyDining, setMonthlyDining] = useState<number>(2000);
  const [monthlyAuto, setMonthlyAuto] = useState<number>(800);
  const [monthlyServices, setMonthlyServices] = useState<number>(1000);

  // Formulario de afiliación B2B para comercios
  const [merchantForm, setMerchantForm] = useState({
    businessName: '',
    category: 'Restaurante / Cafetería',
    city: 'San Francisco de Campeche',
    contactName: '',
    phone: '',
    offerProposal: ''
  });
  const [merchantSubmitted, setMerchantSubmitted] = useState(false);

  // Cargar comercios desde Supabase
  useEffect(() => {
    const fetchAllies = async () => {
      try {
        const { data, error } = await supabase
          .from('allies')
          .select('*')
          .order('promotions_given', { ascending: false });

        if (!error && data && data.length > 0) {
          setAllies(data);
        } else {
          // Comercios de muestra
          setAllies([
            { id: '1', name: 'Café del Mar', category: 'Comida', discount: '15% de Descuento en consumo total', city: 'Campeche' },
            { id: '2', name: 'Lavadero Royal Shine', category: 'Auto', discount: 'Lavado Gratis en tu 3ra visita', city: 'Campeche' },
            { id: '3', name: 'Barbería Mdoce', category: 'Servicios', discount: 'Bebida de cortesía + 10% en corte', city: 'Campeche' },
            { id: '4', name: 'Club 59 Lounge', category: 'Entretenimiento', discount: 'Shot de bienvenida de cortesía', city: 'Campeche' },
            { id: '5', name: 'Spa Sentidos', category: 'Salud', discount: '15% OFF en masajes relajantes', city: 'Campeche' },
            { id: '6', name: 'Refaccionaria Bahía', category: 'Auto', discount: '10% de Descuento en refacciones', city: 'Campeche' }
          ]);
        }
      } catch (err) {
        console.error('Error cargando aliados:', err);
      } finally {
        setLoadingAllies(false);
      }
    };
    fetchAllies();
  }, []);

  // Helper CSS Filter para colores de calcomanías (idéntico a Galeria.tsx)
  const getFilterStyle = (colorType: 'black' | 'white' | 'pink') => {
    switch (colorType) {
      case 'black':
        return {
          filter: 'brightness(0) drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
        };
      case 'white':
        return {
          filter: 'brightness(0) invert(1) drop-shadow(0 2px 10px rgba(255,255,255,0.7))'
        };
      case 'pink':
        return {
          filter: 'drop-shadow(0 2px 8px rgba(244,143,177,0.45))'
        };
    }
  };

  // Dynamic card background color (idéntico a Galeria.tsx) para que las calcomanías negras contrasten perfectamente
  const getCardStyle = (colorType: 'black' | 'white' | 'pink', isSelected: boolean) => {
    if (colorType === 'black') {
      return {
        background: isSelected 
          ? 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)' 
          : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
        border: isSelected ? '3px solid #000000' : '2px solid #CBD5E1',
        textColor: '#000000',
        subTextColor: '#334155',
        badgeBg: '#000000',
        badgeText: '#FFFFFF'
      };
    }
    if (colorType === 'pink') {
      return {
        background: isSelected 
          ? 'linear-gradient(135deg, #351C2B 0%, #1A0D15 100%)' 
          : 'linear-gradient(135deg, #25131E 0%, #0E070B 100%)',
        border: isSelected ? '3px solid #F48FB1' : '2px solid rgba(244,143,177,0.4)',
        textColor: '#FFFFFF',
        subTextColor: '#F48FB1',
        badgeBg: 'rgba(244,143,177,0.2)',
        badgeText: '#F48FB1'
      };
    }
    // white
    return {
      background: isSelected 
        ? 'linear-gradient(135deg, #1E1E24 0%, #0F0F14 100%)' 
        : 'linear-gradient(135deg, #141418 0%, #08080A 100%)',
      border: isSelected ? '3px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.2)',
      textColor: '#FFFFFF',
      subTextColor: 'var(--text-dim)',
      badgeBg: 'rgba(255,255,255,0.15)',
      badgeText: '#FFFFFF'
    };
  };

  // Filtrar calcomanías para la sección oficial
  const filteredStickers = galleryCategory === 'todos'
    ? STICKERS_DATA
    : STICKERS_DATA.filter(s => s.category === galleryCategory);

  // Cálculo de ahorro aproximado (12% en promedio)
  const totalMonthlySpend = monthlyDining + monthlyAuto + monthlyServices;
  const estimatedMonthlySavings = Math.round(totalMonthlySpend * 0.12);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;

  // Puntos de venta oficiales
  const physicalStores = [
    {
      name: 'Maneki Neko',
      zone: 'Plaza del Mar',
      city: 'San Francisco de Campeche',
      desc: 'Punto de venta oficial con stock de distintivos y sobres sellados.'
    },
    {
      name: 'Barbería Mdoce',
      zone: 'Avenida Concordia',
      city: 'San Francisco de Campeche',
      desc: 'Entrega de kits físicos y asesoría de activación inmediata.'
    },
    {
      name: 'Lavadero Royal Shine',
      zone: 'Avenida Central',
      city: 'San Francisco de Campeche',
      desc: 'Adquiere tu calcomanía y aprovecha tu primer descuento en lavado.'
    },
    {
      name: 'Refaccionaria Bahía',
      zone: 'Avenida Hidalgo',
      city: 'San Francisco de Campeche',
      desc: 'Disponibles todas las ediciones oficiales en vinil automotriz.'
    },
    {
      name: 'Gesti+',
      zone: 'Av. Ruiz Cortines',
      city: 'Contra esquina Palacio Federal',
      desc: 'Punto céntrico para entrega de membresías y registro directo.'
    }
  ];

  // Preguntas Frecuentes
  const faqList = [
    {
      q: '¿Qué es exactamente Red Identidad?',
      a: 'Red Identidad es una iniciativa ciudadana y comercial que celebra el orgullo campechano y carmelita. Es un distintivo físico en vinil automotriz para tu vehículo (o pase digital) que te da acceso inmediato a una red exclusiva de descuentos y beneficios en más de 15 comercios locales de Campeche.'
    },
    {
      q: '¿Qué colores y modelos de calcomanía están disponibles?',
      a: 'Contamos con 3 líneas oficiales: Campechano Soy (Blanca y Negra), Campechana Soy (Blanca, Negra y Rosa) y Carmelita Soy (Blanca, Negra y Rosa). Todas fabricadas en vinil de grado automotriz de alta durabilidad.'
    },
    {
      q: '¿La calcomanía resiste el sol, la lluvia y lavados a presión?',
      a: '¡100%! Nuestros distintivos están fabricados en vinil tricapa de grado automotriz con protección UV. No se decoloran con el fuerte sol del Golfo de México ni se despegan con hidrolavadoras ni lluvia torrencial.'
    },
    {
      q: '¿Cómo funciona la activación y cómo obtengo los descuentos?',
      a: 'Cada distintivo viene dentro de un sobre sellado con un código QR único irrepetible. Al escanearlo con la cámara de tu celular, tu membresía se activa en 30 segundos. Cuando visites cualquiera de nuestros comercios aliados, solo muestras tu distintivo o tu QR digital para que te apliquen el descuento directo.'
    },
    {
      q: '¿No tengo coche, puedo tener mi membresía digital?',
      a: '¡Por supuesto! Tenemos la Membresía 100% Digital ($45 MXN) diseñada especialmente para llevarla en tu celular, disfrutar de los mismos descuentos en restaurantes y participar en las dinámicas de la comunidad.'
    },
    {
      q: '¿Dónde puedo conseguir mi distintivo hoy mismo en Campeche?',
      a: 'Puedes comprarlo en línea aquí mismo con entrega o acudir a cualquiera de nuestros 5 Puntos de Venta Oficiales: Maneki Neko (Plaza del Mar), Barbería Mdoce (Av. Concordia), Royal Shine (Av. Central), Refaccionaria Bahía (Av. Hidalgo) y Gesti+ (Av. Ruiz Cortines).'
    },
    {
      q: '¿Cómo puedo afiliar mi negocio como Comercio Aliado?',
      a: 'La afiliación para comercios es rápida y sin comisiones por venta. Solo requieres ofrecer un beneficio genuino para los miembros (descuento, cortesía o promoción). Escríbenos en la sección de comercios para dar de alta tu negocio en nuestro mapa y directorio.'
    }
  ];

  // Manejo de envío de afiliación B2B
  const handleMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantForm.businessName || !merchantForm.phone) return;

    const message = encodeURIComponent(
      `👋 ¡Hola! Me interesa afiliar mi negocio a Red Identidad.\n\n` +
      `🏢 *Negocio:* ${merchantForm.businessName}\n` +
      `🏷️ *Giro:* ${merchantForm.category}\n` +
      `📍 *Ciudad:* ${merchantForm.city}\n` +
      `👤 *Contacto:* ${merchantForm.contactName}\n` +
      `📱 *Teléfono:* ${merchantForm.phone}\n` +
      `🎁 *Propuesta de beneficio:* ${merchantForm.offerProposal || 'Por definir'}`
    );

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
    setMerchantSubmitted(true);
    setTimeout(() => {
      setShowMerchantModal(false);
      setMerchantSubmitted(false);
    }, 2000);
  };

  const handleOpenBuy = (stickerId: string = 'campechano_negra') => {
    setSelectedStickerForModal(stickerId);
    setShowBuyModal(true);
  };

  const filteredAllies = selectedCategory === 'Todos' 
    ? allies 
    : allies.filter(a => a.category?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div style={{ backgroundColor: '#0B0B0E', color: '#F5F5F7', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── BARRA SUPERIOR NOTIFICACIÓN DE SESIÓN ACTIVA SI EXISTE ── */}
      {user && (
        <div style={{
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '0.6rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span>👋 ¡Bienvenido de nuevo, socio <strong>#{user.member_number || user.code}</strong>!</span>
          <button 
            onClick={() => goToApp('/app')}
            style={{
              background: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 700,
              padding: '0.25rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.8rem'
            }}
          >
            Ir a mi App / Pase Digital →
          </button>
        </div>
      )}

      {/* ── BARRA SUPERIOR MULTI-CIUDAD ── */}
      <div style={{
        backgroundColor: 'rgba(212, 175, 55, 0.10)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '0.45rem 1.5rem',
        fontSize: '0.82rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
          <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Plataforma Oficial Estado de Campeche</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ color: '#8E8E98' }}>Conoce nuestra sede en el norte:</span>
          <a 
            href="/juarez" 
            style={{ 
              color: '#FFF', 
              textDecoration: 'underline', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600
            }}
          >
            <span>👉 Ir a Ciudad Juárez (Vive Juárez)</span>
          </a>
        </div>
      </div>

      {/* ── NAVBAR PRINCIPAL FULL WIDTH ── */}
      <nav 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(11, 11, 14, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="landing-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '76px' }}>
          
          {/* Logo y Slogan */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/logo.png" 
              alt="Red Identidad" 
              style={{ height: '44px', width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.35))' }}
            />
            <div style={{ display: 'none', flexDirection: 'column' }} className="d-md-flex">
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', letterSpacing: '0.04em', fontStyle: 'italic', fontWeight: 500 }}>
                "El poder de consumir, ahorrar y pertenecer a esta tierra"
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'none', gap: '1.8rem', alignItems: 'center' }} className="d-lg-flex">
            <a href="#como-funciona" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>¿Cómo Funciona?</a>
            <a href="#distintivo" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Colección Oficial</a>
            <a href="#aliados" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Comercios Aliados</a>
            <a href="#calculadora" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Calculadora</a>
            <a href="#puntos-venta" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Puntos de Venta</a>
            <a href="#planes" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Precios</a>
            <a href="#negocios" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Para Negocios</a>
          </div>

          {/* Actions: Portal App & Buy Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button 
              onClick={() => goToApp('/app')}
              className="landing-btn-glass"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
              title="Abrir la Web App de Miembros"
            >
              <Smartphone size={16} />
              <span>Abrir App</span>
            </button>

            <button 
              onClick={() => handleOpenBuy('campechano_negra')}
              className="landing-btn-gold"
              style={{ padding: '0.65rem 1.35rem', fontSize: '0.88rem' }}
            >
              <ShoppingBag size={16} />
              <span>Obtener Distintivo</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="d-lg-none"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                padding: '0.5rem',
                borderRadius: '8px',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                backgroundColor: '#121217',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1.2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <a 
                href="#como-funciona" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem', padding: '0.4rem 0' }}
              >
                ¿Cómo Funciona?
              </a>
              <a 
                href="#distintivo" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem', padding: '0.4rem 0' }}
              >
                Colección Oficial de Calcomanías
              </a>
              <a 
                href="#aliados" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem', padding: '0.4rem 0' }}
              >
                Directorio de Comercios Aliados
              </a>
              <a 
                href="#calculadora" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem', padding: '0.4rem 0' }}
              >
                Calculadora de Ahorro
              </a>
              <a 
                href="#puntos-venta" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem', padding: '0.4rem 0' }}
              >
                Puntos de Venta Físicos
              </a>
              <a 
                href="#planes" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem', padding: '0.4rem 0' }}
              >
                Planes y Precios ($45 / $90 MXN)
              </a>
              <a 
                href="#negocios" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '0.4rem 0' }}
              >
                Afiliar mi Negocio (Comercios)
              </a>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => { setMobileMenuOpen(false); goToApp('/app'); }}
                  className="landing-btn-glass"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Abrir App
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleOpenBuy(); }}
                  className="landing-btn-gold"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  Comprar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO SECTION PRINCIPAL ── */}
      <section style={{ position: 'relative', padding: '4rem 0 5rem', overflow: 'hidden' }}>
        
        {/* Glow de fondo decorativo */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="landing-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Columna Izquierda: Copy de Conversión */}
            <div>
              <div className="landing-badge" style={{ marginBottom: '1.4rem' }}>
                <Sparkles size={15} />
                <span>Movimiento de Identidad y Consumo en Campeche</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                marginBottom: '1.2rem',
                letterSpacing: '-0.03em'
              }}>
                El poder de consumir, ahorrar y <span className="gold-text">pertenecer</span> a esta tierra.
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#B0B0B8',
                lineHeight: 1.6,
                marginBottom: '2.2rem',
                maxWidth: '560px'
              }}>
                No es solo una calcomanía. Es tu distintivo oficial para tu vehículo y tu pase digital para obtener <strong>descuentos exclusivos en más de 15 comercios locales</strong> de Campeche y Carmen, sumándote a una red que apoya lo nuestro.
              </p>

              {/* Botones de acción principal */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <button 
                  onClick={() => handleOpenBuy('campechano_negra')}
                  className="landing-btn-gold"
                  style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
                >
                  <ShoppingBag size={19} />
                  <span>Obtener Distintivo Físico ($90)</span>
                </button>

                <button 
                  onClick={() => handleOpenBuy('digital')}
                  className="landing-btn-glass"
                  style={{ padding: '1rem 1.8rem', fontSize: '1.05rem' }}
                >
                  <Smartphone size={19} />
                  <span>Pase 100% Digital ($45)</span>
                </button>
              </div>

              {/* Micro Beneficios con checks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', color: '#9E9EA8', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Vinil grado automotriz 100% resistente</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Activación inmediata con código QR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Descuentos directos sin comisiones</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>5 Puntos de entrega en Campeche</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Showcase Visual de Alto Impacto con Fotos Reales */}
            <div style={{ position: 'relative' }}>
              <div 
                className="landing-card"
                style={{
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg, rgba(30, 30, 36, 0.8) 0%, rgba(18, 18, 22, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                }}
              >
                {/* Foto real instalada en vehículo */}
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.2rem' }}>
                  <img 
                    src="/campechano_soy_coche.jpg" 
                    alt="Distintivo Campechano Soy instalado en automóvil" 
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '320px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  
                  {/* Badge flotante en la foto */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(18, 18, 22, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Award size={14} />
                    <span>Vinil de Grado Automotriz</span>
                  </div>
                </div>

                {/* Subtarjetas de visualización: Sobre Sellado + Tres Líneas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem'
                  }}>
                    <img 
                      src="/qr_calcomania_sobre.jpg" 
                      alt="Sobre oficial sellado" 
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Sobre Sellado</div>
                      <div style={{ fontSize: '0.72rem', color: '#9E9EA8' }}>QR único $90 MXN</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'rgba(212, 175, 55, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)'
                    }}>
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>3 Líneas Oficiales</div>
                      <div style={{ fontSize: '0.72rem', color: '#9E9EA8' }}>Blanca, Negra y Rosa</div>
                    </div>
                  </div>
                </div>

                {/* Testimonio micro-resumen */}
                <div style={{
                  marginTop: '1rem',
                  padding: '0.8rem 1rem',
                  background: 'rgba(212, 175, 55, 0.06)',
                  borderRadius: '10px',
                  border: '1px dashed rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem'
                }}>
                  <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#D0D0D8', fontStyle: 'italic' }}>
                    "Ver otro coche con el distintivo es saber que apoyamos lo nuestro."
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BARRA DE MÉTRICAS & PRUEBA SOCIAL ── */}
      <section style={{ backgroundColor: 'rgba(20, 20, 25, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '2rem 0' }}>
        <div className="landing-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>+400</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>Miembros con Distintivo Activo</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF' }}>15+</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>Comercios y Negocios Aliados</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Hasta 15%</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>De Descuento en Cada Visita</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF' }}>5</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>Puntos de Entrega en Campeche</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 1: ¿CÓMO FUNCIONA? ── */}
      <section id="como-funciona" style={{ padding: '6rem 0' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <Compass size={14} />
              <span>Simple, Rápido y Transparente</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              ¿Cómo funciona Red Identidad?
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Sin membresías mensuales complicadas ni contratos. Un solo pago y disfrutas de beneficios permanentes.
            </p>
          </div>

          <div className="landing-grid-3">
            
            {/* Paso 1 */}
            <div className="landing-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '24px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                color: '#121212',
                fontWeight: 800,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem'
              }}>1</div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>Elige tu Distintivo</h3>
              <p style={{ color: '#9E9EA8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Solicita tu sobre oficial con la calcomanía física en vinil de grado automotriz ($90) o activa tu pase 100% digital ($45) al instante.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="landing-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '24px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                color: '#121212',
                fontWeight: 800,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem'
              }}>2</div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                <Car size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>Pégalo y Actívalo</h3>
              <p style={{ color: '#9E9EA8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Colócalo en tu auto o moto. Escanea el código QR de tu sobre con tu celular y activa tu número de miembro oficial en 30 segundos.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="landing-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '24px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                color: '#121212',
                fontWeight: 800,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem'
              }}>3</div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>Ahorra y Pertenece</h3>
              <p style={{ color: '#9E9EA8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Visita los restaurantes, autolavados y negocios aliados. Muestra tu calcomanía o tu QR y recibe descuentos inmediatos en tu cuenta.
              </p>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => handleOpenBuy('campechano_negra')}
              className="landing-btn-gold"
            >
              <span>Comenzar ahora</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 2: COLECCIÓN OFICIAL DE CALCOMANÍAS (100% FIDEDIGNA A LA GALERÍA) ── */}
      <section id="distintivo" style={{ padding: '6rem 0', backgroundColor: '#0F0F13' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <ShieldCheck size={14} />
              <span>Colección Oficial de Calcomanías</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              El Distintivo de Colección
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Fabricado con vinil automotriz alemán tricapa de corte de precisión. No se despinta, no se desprende y resiste el sol, la lluvia y los lavados a presión.
            </p>
          </div>

          {/* Filtros de Categoría Oficial (Idéntico a Galeria.tsx) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.35rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '0.4rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {(['todos', 'campechano', 'campechana', 'carmelita'] as const).map((cat) => {
                const label = cat === 'todos' ? 'Todas las Ediciones' :
                              cat === 'campechano' ? 'Campechano Soy' :
                              cat === 'campechana' ? 'Campechana Soy' : 'Carmelita Soy';
                const isActive = galleryCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat)}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: '9999px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      backgroundColor: isActive ? 'var(--accent-gold)' : 'transparent',
                      color: isActive ? '#121212' : '#C0C0C5',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Calcomanías Oficiales usando la estética y contraste exacto de la galería */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {filteredStickers.map((sticker) => {
              const isSelected = selectedSticker.id === sticker.id;
              const cardTheme = getCardStyle(sticker.colorType, isSelected);

              return (
                <div
                  key={sticker.id}
                  onClick={() => setSelectedSticker(sticker)}
                  style={{
                    borderRadius: '20px',
                    padding: '1.5rem',
                    background: cardTheme.background,
                    border: cardTheme.border,
                    boxShadow: isSelected ? '0 12px 30px rgba(212, 175, 55, 0.3)' : '0 6px 18px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '270px',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Badge de color / edición */}
                  <div style={{
                    alignSelf: 'flex-start',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '0.25rem 0.7rem',
                    borderRadius: '9999px',
                    backgroundColor: cardTheme.badgeBg,
                    color: cardTheme.badgeText
                  }}>
                    Edición {sticker.colorName}
                  </div>

                  {/* Imagen del distintivo con filtro oficial */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '1rem 0'
                  }}>
                    <img 
                      src={sticker.imagePath} 
                      alt={sticker.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        ...getFilterStyle(sticker.colorType)
                      }}
                    />
                  </div>

                  {/* Información y botón */}
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: cardTheme.textColor, marginBottom: '0.3rem' }}>
                      {sticker.name}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: cardTheme.subTextColor, lineHeight: 1.4, marginBottom: '1rem' }}>
                      {sticker.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBuy(sticker.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: sticker.colorType === 'black' ? '#000000' : 'var(--accent-gold)',
                        color: sticker.colorType === 'black' ? '#FFFFFF' : '#121212',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Pedir ({sticker.colorName}) $90 MXN</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Detalle del distintivo seleccionado con Simulador Interactivo */}
          <div className="landing-card" style={{ padding: '2.5rem', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              
              {/* Simulador interactivo en auto o celular */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Simulador en Vivo
                  </span>
                  
                  <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '100px' }}>
                    <button 
                      onClick={() => setSimulatorMode('car')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        backgroundColor: simulatorMode === 'car' ? 'var(--accent-gold)' : 'transparent',
                        color: simulatorMode === 'car' ? '#121212' : '#AAA',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      En Auto
                    </button>
                    <button 
                      onClick={() => setSimulatorMode('phone')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        backgroundColor: simulatorMode === 'phone' ? 'var(--accent-gold)' : 'transparent',
                        color: simulatorMode === 'phone' ? '#121212' : '#AAA',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      En Celular
                    </button>
                  </div>
                </div>

                {/* Contenedor del simulador */}
                <div style={{
                  position: 'relative',
                  height: '240px',
                  backgroundColor: selectedSticker.colorType === 'black' ? '#F1F5F9' : '#0c0c0e',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
                  transition: 'background-color 0.4s ease'
                }}>
                  {simulatorMode === 'car' ? (
                    <div style={{ position: 'relative', width: '85%', height: '75%', backgroundColor: selectedSticker.colorType === 'black' ? '#E2E8F0' : selectedSticker.colorType === 'pink' ? '#231822' : '#141e24', border: '3px solid #64748B', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={selectedSticker.imagePath} 
                        alt="Sticker Preview"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'contain',
                          ...getFilterStyle(selectedSticker.colorType)
                        }}
                      />
                      <span style={{ position: 'absolute', bottom: '6px', fontSize: '0.65rem', color: selectedSticker.colorType === 'black' ? '#475569' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                        Vista en cristal de vehículo
                      </span>
                    </div>
                  ) : (
                    <div style={{ width: '120px', height: '190px', backgroundColor: selectedSticker.colorType === 'black' ? '#FFFFFF' : selectedSticker.colorType === 'pink' ? '#2D1D27' : '#1E1E22', borderRadius: '20px', border: '3px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={selectedSticker.imagePath} 
                        alt="Sticker Preview"
                        style={{
                          width: '75px',
                          height: '75px',
                          objectFit: 'contain',
                          ...getFilterStyle(selectedSticker.colorType)
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Ficha descriptiva y botón para pedir */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: selectedSticker.colorType === 'pink' ? '#F48FB1' : 'var(--accent-gold)'
                  }}>
                    {selectedSticker.category === 'carmelita' ? 'Isla del Carmen' : 'Campeche Histórico'}
                  </span>
                  <span>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#BBB' }}>Edición {selectedSticker.colorName}</span>
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                  {selectedSticker.name}
                </h3>

                <p style={{ color: '#A0A0AA', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {selectedSticker.description}
                </p>

                <div style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${selectedSticker.colorType === 'pink' ? '#F48FB1' : 'var(--accent-gold)'}`,
                  marginBottom: '1.8rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem'
                }}>
                  <Info size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-gold)' }}>Beneficio Activo</div>
                    <div style={{ fontSize: '0.85rem', color: '#FFF' }}>{selectedSticker.perk}</div>
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenBuy(selectedSticker.id)}
                  className="landing-btn-gold"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>Adquirir {selectedSticker.name} ($90 MXN)</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 3: DIRECTORIO DE COMERCIOS ALIADOS ── */}
      <section id="aliados" style={{ padding: '6rem 0' }}>
        <div className="landing-container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <div className="landing-badge" style={{ marginBottom: '1rem' }}>
                <Store size={14} />
                <span>Consumo Local en Campeche y Carmen</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800 }}>
                Comercios y Negocios Aliados
              </h2>
              <p style={{ color: '#A5A5AF', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '580px' }}>
                Presenta tu distintivo en tu coche o tu código QR digital para disfrutar de promociones directas en tus visitas.
              </p>
            </div>

            <button 
              onClick={() => goToApp('/aliados')}
              className="landing-btn-glass"
            >
              <span>Ver mapa interactivo</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Filtros de Categoría */}
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
            {['Todos', 'Comida', 'Auto', 'Servicios', 'Entretenimiento', 'Salud'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat ? '#121212' : '#C0C0C8',
                  border: selectedCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Aliados */}
          <div className="landing-grid-3">
            {loadingAllies ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#A0A0A8' }}>
                Cargando comercios aliados...
              </div>
            ) : filteredAllies.length > 0 ? (
              filteredAllies.slice(0, 6).map((ally: any) => (
                <div key={ally.id} className="landing-card" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-gold)'
                      }}>
                        {ally.category === 'Comida' ? <Utensils size={22} /> :
                         ally.category === 'Auto' ? <Car size={22} /> :
                         ally.category === 'Entretenimiento' ? <Wine size={22} /> :
                         ally.category === 'Salud' ? <HeartPulse size={22} /> :
                         <Briefcase size={22} />}
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#A0A0A8'
                      }}>
                        {ally.category || 'Local'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{ally.name}</h4>
                    
                    <div style={{
                      margin: '0.8rem 0',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      color: 'var(--accent-gold)',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}>
                      🎁 {ally.discount || 'Descuento exclusivo para socios'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7E7E88', fontSize: '0.8rem', marginTop: '1rem' }}>
                    <MapPin size={14} />
                    <span>{ally.address || 'Campeche'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#A0A0A8' }}>
                No encontramos comercios en esta categoría por el momento.
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => goToApp('/aliados')}
              className="landing-btn-gold"
            >
              <span>Explorar Directorio Completo (+15 Aliados)</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 4: CALCULADORA INTERACTIVA DE AHORRO ── */}
      <section id="calculadora" style={{ padding: '6rem 0', backgroundColor: '#0E0E12' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <Calculator size={14} />
              <span>Retorno Inmediato</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              ¿Cuánto te ahorras con Red Identidad?
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Ajusta tu consumo mensual promedio y descubre cómo una calcomanía de $90 se paga sola desde tu primera semana.
            </p>
          </div>

          <div className="landing-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              
              {/* Sliders de Consumo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                
                {/* Comidas fuera */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D0D0D8' }}>Restaurantes y Cafeterías al mes:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>${monthlyDining.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="6000" 
                    step="250"
                    value={monthlyDining} 
                    onChange={(e) => setMonthlyDining(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                  />
                </div>

                {/* Auto / Lavado */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D0D0D8' }}>Autolavado y mantenimiento al mes:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>${monthlyAuto.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="3000" 
                    step="100"
                    value={monthlyAuto} 
                    onChange={(e) => setMonthlyAuto(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                  />
                </div>

                {/* Entretenimiento y Servicios */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D0D0D8' }}>Entretenimiento, Spa y Servicios:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>${monthlyServices.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="4000" 
                    step="200"
                    value={monthlyServices} 
                    onChange={(e) => setMonthlyServices(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                  />
                </div>

              </div>

              {/* Resultado del Ahorro Estimado */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(35, 30, 20, 0.6) 0%, rgba(20, 20, 24, 0.9) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#A0A0AA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ahorro Anual Estimado
                </span>
                
                <div style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                  fontWeight: 800,
                  color: 'var(--accent-gold)',
                  margin: '0.5rem 0'
                }}>
                  ${estimatedAnnualSavings.toLocaleString('es-MX')} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>MXN</span>
                </div>

                <p style={{ color: '#90909A', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Calculado con un descuento promedio del 12% en consumos locales habituales en Campeche.
                </p>

                <div style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#FFF',
                  marginBottom: '1.5rem'
                }}>
                  💡 Tu inversión de $90 MXN te rinde más de <strong>{Math.round(estimatedAnnualSavings / 90)}x</strong> en retorno.
                </div>

                <button 
                  onClick={() => handleOpenBuy('campechano_negra')}
                  className="landing-btn-gold"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <ShoppingBag size={17} />
                  <span>Obtener mi Distintivo por $90</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 5: PUNTOS DE VENTA OFICIALES FÍSICOS ── */}
      <section id="puntos-venta" style={{ padding: '6rem 0' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <MapPin size={14} />
              <span>Entrega Inmediata en Campeche</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Puntos de Venta Oficiales
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              ¿Prefieres recoger tu sobre físico sellado en persona? Acude a cualquiera de nuestros puntos de venta autorizados en San Francisco de Campeche.
            </p>
          </div>

          <div className="landing-grid-3">
            {physicalStores.map((store, i) => (
              <div key={i} className="landing-card" style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}>
                    <Store size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{store.name}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)' }}>{store.zone}</span>
                  </div>
                </div>

                <p style={{ color: '#9E9EA8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                  {store.desc}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.82rem',
                  color: '#8A8A94'
                }}>
                  <span>{store.city}</span>
                  <a 
                    href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(`Hola, me gustaría apartar un distintivo de Red Identidad para recogerlo en ${store.name} (${store.zone}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <span>Apartar</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 6: PLANES Y PRECIOS TRANSPARENTES ── */}
      <section id="planes" style={{ padding: '6rem 0', backgroundColor: '#0D0D11' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <CreditCard size={14} />
              <span>Un Solo Pago, Beneficios Permanentes</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Elige tu Membresía
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Sin cobros mensuales recurrentes. Acceso inmediato a la red de descuentos y al orgullo de pertenecer.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            
            {/* Opción 1: 100% Digital */}
            <div className="landing-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#A0A0A8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Activación Inmediata
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.4rem 0 1rem' }}>
                  Membresía 100% Digital
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800 }}>$45</span>
                  <span style={{ fontSize: '1rem', color: '#A0A0A8' }}>MXN / pago único</span>
                </div>

                <p style={{ color: '#9E9EA8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
                  Diseñada para quienes desean todos los beneficios y descuentos directamente en su celular, sin necesidad de calcomanía física.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  {[
                    'Pase digital con QR dinámico en tu smartphone',
                    'Descuentos en todos los comercios aliados',
                    'Acceso a retos, rutas y dinámicas comunitarias',
                    'Activación instantánea en menos de 1 minuto'
                  ].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#D0D0D8' }}>
                      <Check size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleOpenBuy('digital')}
                className="landing-btn-glass"
                style={{ width: '100%', padding: '0.95rem' }}
              >
                <span>Comprar Pase Digital ($45)</span>
              </button>
            </div>

            {/* Opción 2: Distintivo Físico + Membresía (El más popular) */}
            <div 
              className="landing-card" 
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '2px solid var(--accent-gold)',
                background: 'linear-gradient(160deg, rgba(32, 28, 20, 0.8) 0%, rgba(18, 18, 22, 0.95) 100%)',
                position: 'relative',
                boxShadow: '0 15px 40px rgba(212, 175, 55, 0.15)'
              }}
            >
              {/* Badge Más Popular */}
              <div style={{
                position: 'absolute',
                top: '-14px',
                right: '24px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                color: '#121212',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                ⭐ El Más Popular
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  Kit Completo de Colección
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.4rem 0 1rem' }}>
                  Calcomanía Oficial en Sobre + Membresía
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-gold)' }}>$90</span>
                  <span style={{ fontSize: '1rem', color: '#A0A0A8' }}>MXN / pago único</span>
                </div>

                <p style={{ color: '#C0C0C8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
                  El distintivo oficial para tu auto o moto en vinil automotriz alemán en sobre sellado de colección + la Membresía Digital completa.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  {[
                    'Calcomanía física en vinil de grado automotriz tricapa',
                    'Elección de modelo: Campechano Soy, Campechana Soy o Carmelita Soy',
                    'Colores disponibles: Blanco, Negro o Rosa oficial',
                    'Sobre oficial de colección sellado con código QR personal',
                    'Incluye toda la Membresía Digital en tu celular',
                    'Recoge hoy en puntos de venta o recibe a domicilio'
                  ].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#FFF' }}>
                      <Check size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span><strong>{feat}</strong></span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleOpenBuy('campechano_negra')}
                className="landing-btn-gold"
                style={{ width: '100%', padding: '0.95rem' }}
              >
                <ShoppingBag size={18} />
                <span>Pedir Distintivo en Sobre ($90)</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECCIÓN 7: PARA COMERCIOS Y NEGOCIOS LOCALES (B2B) ── */}
      <section id="negocios" style={{ padding: '6rem 0', position: 'relative' }}>
        
        {/* Glow sutil */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '5%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="landing-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="landing-card" style={{ padding: '3.5rem 2.5rem', background: 'linear-gradient(135deg, rgba(26, 26, 32, 0.95) 0%, rgba(16, 16, 20, 0.95) 100%)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              
              {/* Información para el Comerciante */}
              <div>
                <div className="landing-badge" style={{ marginBottom: '1.2rem' }}>
                  <Store size={14} />
                  <span>Alianza Comercial Estratégica</span>
                </div>

                <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.2rem' }}>
                  ¿Tienes un negocio en Campeche? <span className="gold-text">Conviértete en Aliado</span>.
                </h2>

                <p style={{ color: '#B0B0B8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Conecta tu negocio directamente con cientos de conductores y familias que buscan activamente consumir local. Cero comisiones ocultas sobre tus ventas.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Clientes Locales Fieles</h4>
                      <p style={{ color: '#8E8E98', fontSize: '0.88rem' }}>Los miembros de Red Identidad prefieren acudir a comercios que portan y apoyan el movimiento de nuestra tierra.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Presencia en Mapa y Directorio Digital</h4>
                      <p style={{ color: '#8E8E98', fontSize: '0.88rem' }}>Ficha oficial con fotos, enlaces a redes sociales y geolocalización para que nuevos clientes te encuentren.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Cero Comisiones por Venta</h4>
                      <p style={{ color: '#8E8E98', fontSize: '0.88rem' }}>Tú decides la cortesía o descuento que otorgas a los miembros sin que nadie te cobre porcentaje por transacción.</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setShowMerchantModal(true)}
                    className="landing-btn-gold"
                    style={{ padding: '0.9rem 1.8rem' }}
                  >
                    <Store size={18} />
                    <span>Afiliar mi Comercio Gratis</span>
                  </button>

                  <a 
                    href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('Hola, me gustaría afiliar mi negocio como comercio aliado de Red Identidad.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="landing-btn-glass"
                    style={{ padding: '0.9rem 1.6rem' }}
                  >
                    <MessageCircle size={18} />
                    <span>Hablar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Tarjeta Visual de Comercio Aliado */}
              <div style={{
                background: 'rgba(18, 18, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Award size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Insignia Oficial de Comercio Aliado</h3>
                  <p style={{ color: '#8E8E98', fontSize: '0.88rem', marginTop: '0.4rem' }}>
                    Recibe tu distintivo de acrílico para tu mostrador y acceso al portal de validación.
                  </p>
                </div>

                <div style={{
                  padding: '1.2rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#D0D0D8', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "Desde que nos sumamos como punto aliado, recibimos semanalmente automovilistas que llegan preguntando por el descuento de Red Identidad."
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, marginTop: '0.6rem' }}>
                    — Aliado Comercial, San Francisco de Campeche
                  </div>
                </div>

                <button 
                  onClick={() => goToApp('/aliado-panel')}
                  className="landing-btn-glass"
                  style={{ width: '100%', fontSize: '0.88rem', padding: '0.75rem' }}
                >
                  <span>Ver Portal para Comercios Afiliados</span>
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 8: PREGUNTAS FRECUENTES (FAQ) ── */}
      <section id="faq" style={{ padding: '6rem 0', backgroundColor: '#0D0D11' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Preguntas Frecuentes
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Resolvemos tus dudas sobre el distintivo, el pase digital y la red de beneficios.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="landing-card"
                  style={{
                    overflow: 'hidden',
                    borderColor: isOpen ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.4rem 1.6rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: isOpen ? 'var(--accent-gold)' : '#FFF'
                    }}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={20} color="var(--accent-gold)" /> : <ChevronDown size={20} />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 1.6rem 1.4rem', color: '#A5A5B0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SECCIÓN CTA FINAL ── */}
      <section style={{ padding: '6rem 0', position: 'relative', textAlign: 'center' }}>
        <div className="landing-container">
          <div style={{ maxWidth: '750px', margin: '0 auto' }}>
            <img 
              src="/logo.png" 
              alt="Red Identidad" 
              style={{ height: '65px', width: 'auto', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 15px rgba(212, 175, 55, 0.4))' }}
            />
            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '1.2rem', lineHeight: 1.2 }}>
              Lleva tu orgullo en el camino y apoya lo nuestro.
            </h2>
            <p style={{ color: '#B0B0B8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Únete a los más de 400 campechanos y carmelitas que ya forman parte de la red de beneficios más activa del estado.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleOpenBuy('campechano_negra')}
                className="landing-btn-gold"
                style={{ padding: '1rem 2.4rem', fontSize: '1.05rem' }}
              >
                <ShoppingBag size={20} />
                <span>Obtener Distintivo Oficial ($90)</span>
              </button>
              <button 
                onClick={() => goToApp('/app')}
                className="landing-btn-glass"
                style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
              >
                <Smartphone size={20} />
                <span>Entrar a la App / Miembros</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER COMPLETO ── */}
      <footer style={{ backgroundColor: '#08080A', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '4rem 0 2.5rem', color: '#7E7E88', fontSize: '0.88rem' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
            
            {/* Col 1: Brand */}
            <div>
              <img src="/logo.png" alt="Red Identidad" style={{ height: '38px', width: 'auto', marginBottom: '0.8rem' }} />
              <p style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontSize: '0.82rem', marginBottom: '1rem' }}>
                "El poder de consumir, ahorrar y pertenecer a esta tierra"
              </p>
              <p style={{ lineHeight: 1.6, color: '#7A7A85' }}>
                Iniciativa ciudadana y comercial en el Estado de Campeche.
              </p>
            </div>

            {/* Col 2: Accesos Rápidos */}
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Navegación</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a href="#como-funciona" style={{ color: '#90909A', textDecoration: 'none' }}>¿Cómo Funciona?</a>
                <a href="#distintivo" style={{ color: '#90909A', textDecoration: 'none' }}>Colección Oficial</a>
                <a href="#aliados" style={{ color: '#90909A', textDecoration: 'none' }}>Directorio de Aliados</a>
                <a href="#puntos-venta" style={{ color: '#90909A', textDecoration: 'none' }}>Puntos de Venta Físicos</a>
                <a href="#planes" style={{ color: '#90909A', textDecoration: 'none' }}>Planes y Membresías</a>
              </div>
            </div>

            {/* Col 3: Para Miembros y Comercios */}
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Portales</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button onClick={() => goToApp('/app')} style={{ textAlign: 'left', color: '#90909A', textDecoration: 'none' }}>App de Miembros</button>
                <button onClick={() => goToApp('/registro')} style={{ textAlign: 'left', color: '#90909A', textDecoration: 'none' }}>Activar mi Código QR</button>
                <button onClick={() => goToApp('/aliado-panel')} style={{ textAlign: 'left', color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Portal de Comercios Aliados</button>
                <button onClick={() => goToApp('/admin')} style={{ textAlign: 'left', color: '#90909A', textDecoration: 'none' }}>Administración</button>
              </div>
            </div>

            {/* Col 4: Contacto Oficial */}
            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Atención Oficial</h5>
              <p style={{ lineHeight: 1.6, marginBottom: '0.8rem' }}>
                Atención directa a miembros y comercios:
              </p>
              <a 
                href={`https://wa.me/${ADMIN_WHATSAPP}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={16} />
                <span>WhatsApp: 981 197 1305</span>
              </a>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6A6A74' }}>
                San Francisco de Campeche, México
              </div>
            </div>

          </div>

          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem'
          }}>
            <div>
              © 2026 Red Identidad Campeche. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span>Campechano Soy</span>
              <span>•</span>
              <span>Carmelita Soy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODAL DE COMPRA / ACTIVACIÓN INTEGRADO ── */}
      <BuyStickerModal 
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        initialSticker={selectedStickerForModal}
      />

      {/* ── MODAL DE AFILIACIÓN COMERCIAL B2B ── */}
      <AnimatePresence>
        {showMerchantModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="landing-card"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: '2rem',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Store size={22} color="var(--accent-gold)" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Afiliar mi Negocio</h3>
                </div>
                <button onClick={() => setShowMerchantModal(false)} style={{ color: '#AAA' }}>
                  <X size={20} />
                </button>
              </div>

              {merchantSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle2 size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>¡Solicitud enviada con éxito!</h4>
                  <p style={{ color: '#A0A0AA', fontSize: '0.9rem' }}>Te contactaremos de inmediato por WhatsApp para activar tu perfil de aliado.</p>
                </div>
              ) : (
                <form onSubmit={handleMerchantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ color: '#A0A0AA', fontSize: '0.88rem' }}>
                    Únete a la Red sin pagar comisiones por venta. Recibirás clientes y difusión oficial.
                  </p>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Nombre del Negocio *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Café Baluarte, Lavado Maya"
                      value={merchantForm.businessName}
                      onChange={(e) => setMerchantForm({ ...merchantForm, businessName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Giro / Categoría</label>
                      <select
                        value={merchantForm.category}
                        onChange={(e) => setMerchantForm({ ...merchantForm, category: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                      >
                        <option>Restaurante / Cafetería</option>
                        <option>Auto / Taller / Lavado</option>
                        <option>Salud / Spa / Estética</option>
                        <option>Entretenimiento / Bar</option>
                        <option>Servicios Profesionales</option>
                        <option>Comercio / Tienda</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Municipio</label>
                      <select
                        value={merchantForm.city}
                        onChange={(e) => setMerchantForm({ ...merchantForm, city: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                      >
                        <option>San Francisco de Campeche</option>
                        <option>Ciudad del Carmen</option>
                        <option>Champotón</option>
                        <option>Calkiní</option>
                        <option>Escárcega</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Tu Nombre</label>
                      <input 
                        type="text" 
                        placeholder="Nombre del encargado"
                        value={merchantForm.contactName}
                        onChange={(e) => setMerchantForm({ ...merchantForm, contactName: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>WhatsApp (10 dígitos) *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="981 123 4567"
                        value={merchantForm.phone}
                        onChange={(e) => setMerchantForm({ ...merchantForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Beneficio sugerido para socios</label>
                    <input 
                      type="text" 
                      placeholder="Ej. 10% en total, café de cortesía, postre gratis"
                      value={merchantForm.offerProposal}
                      onChange={(e) => setMerchantForm({ ...merchantForm, offerProposal: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="landing-btn-gold"
                    style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
                  >
                    <span>Enviar y Conectar por WhatsApp</span>
                    <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── BARRA FLOTANTE FIJA INFERIOR PARA MÓVILES (CONVERSIÓN RÁPIDA) ── */}
      <div 
        className="d-lg-none"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(15, 15, 18, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.75rem 1.2rem calc(0.75rem + env(safe-area-inset-bottom))',
          display: 'flex',
          gap: '0.8rem',
          zIndex: 90
        }}
      >
        <button 
          onClick={() => goToApp('/app')}
          className="landing-btn-glass"
          style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem' }}
        >
          <Smartphone size={16} />
          <span>Abrir App</span>
        </button>

        <button 
          onClick={() => handleOpenBuy('campechano_negra')}
          className="landing-btn-gold"
          style={{ flex: 1.4, padding: '0.7rem', fontSize: '0.85rem' }}
        >
          <ShoppingBag size={16} />
          <span>Distintivo $90</span>
        </button>
      </div>

    </div>
  );
};

export default Landing;
