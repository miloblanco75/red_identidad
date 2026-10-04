import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Sparkles, ShoppingBag, Store, MapPin, 
  CheckCircle2, ChevronDown, ChevronUp,
  CreditCard, Smartphone, Car, Utensils, Wine, 
  Briefcase, ArrowRight, MessageCircle, Star, Users,
  Calculator, Check, ExternalLink, Menu, X, Compass, Award,
  Globe, QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BuyStickerModal } from '../components/BuyStickerModal';
import { useCity } from '../contexts/CityContext';

// WhatsApp oficial de atención para Ciudad Juárez
const JUAREZ_WHATSAPP = '529811971305'; // Configurable para Lada 656

interface JuarezStickerInfo {
  id: string;
  name: string;
  edition: string;
  imagePath: string;
  description: string;
  perk: string;
}

const JUAREZ_OFFICIAL_STICKER: JuarezStickerInfo = {
  id: 'juarense_oficial',
  name: 'Vive Juárez — Edición Oficial Única',
  edition: 'Edición Oficial 2026',
  imagePath: '/vive_juarez_oficial.png',
  description: 'Insignia oficial con la emblemática X de Juárez en vías ferroviarias rojas y el corazón de nuestra frontera juarense.',
  perk: 'Acceso a la Red de Aliados, descuentos directos de hasta 15% en restaurantes y comercios en Ciudad Juárez.'
};

export const LandingJuarez: React.FC = () => {
  const navigate = useNavigate();
  const { setCity } = useCity();

  // Helper de navegación a la app móvil con contexto de Juárez
  const goToApp = (path: string = '/app') => {
    setCity('juarez');
    navigate(`${path}?city=juarez`);
  };

  // Estados de navegación y modales
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStickerForModal, setSelectedStickerForModal] = useState<string>('juarense_oficial');
  const [showMerchantModal, setShowMerchantModal] = useState(false);

  // Simulador de calcomanía
  const [simulatorMode, setSimulatorMode] = useState<'car' | 'phone'>('car');

  // Filtros de comercios de muestra en Ciudad Juárez
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculadora de ahorro mensual
  const [monthlyDining, setMonthlyDining] = useState<number>(3000);
  const [monthlyAuto, setMonthlyAuto] = useState<number>(1000);
  const [monthlyServices, setMonthlyServices] = useState<number>(1200);

  // Formulario de afiliación B2B
  const [merchantForm, setMerchantForm] = useState({
    businessName: '',
    category: 'Restaurante / Cafetería',
    zone: 'Gómez Morín / San Lorenzo',
    contactName: '',
    phone: '',
    offerProposal: ''
  });
  const [merchantSubmitted, setMerchantSubmitted] = useState(false);

  // Comercios aliados de muestra en Ciudad Juárez
  const juarezAllies = [
    { id: 'j-1', name: 'Burritos & Tradición Fronteriza', category: 'Comida', discount: '15% de Descuento en tu consumo', zone: 'Gómez Morín' },
    { id: 'j-2', name: 'Royal Shine Auto Spa Juárez', category: 'Auto', discount: 'Lavado Express Gratis en tu 3ra visita', zone: 'Las Misiones' },
    { id: 'j-3', name: 'Barbería & Grooming El Paso del Norte', category: 'Servicios', discount: '10% OFF en corte y arreglo de barba', zone: 'Pronaf' },
    { id: 'j-4', name: 'Café de la X Terraza', category: 'Comida', discount: 'Bebida de cortesía al ordenar alimento', zone: 'Plaza de la Mexicanidad' },
    { id: 'j-5', name: 'Lounge 656', category: 'Entretenimiento', discount: 'Bebida de bienvenida de cortesía', zone: 'Gómez Morín' },
    { id: 'j-6', name: 'Refacciones & Detallado Frontera', category: 'Auto', discount: '10% de Descuento en accesorios y refacciones', zone: 'Av. Tecnológico' }
  ];

  const handleOpenBuy = (stickerId: string = 'juarense_oficial') => {
    setSelectedStickerForModal(stickerId);
    setShowBuyModal(true);
  };

  // Cálculo de ahorro
  const totalMonthlySpend = monthlyDining + monthlyAuto + monthlyServices;
  const estimatedMonthlySavings = Math.round(totalMonthlySpend * 0.12);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;

  // Puntos de venta oficiales en Ciudad Juárez
  const juarezStores = [
    {
      name: 'Punto Oficial Gómez Morín',
      zone: 'Corredor Gómez Morín',
      city: 'Ciudad Juárez, Chih.',
      desc: 'Entrega de sobres sellados y activación en zona gastronómica.'
    },
    {
      name: 'Punto Las Misiones',
      zone: 'Av. Paseo de la Victoria',
      city: 'Ciudad Juárez, Chih.',
      desc: 'Punto céntrico para entrega de distintivos automotrices oficiales.'
    },
    {
      name: 'Punto Pronaf / San Lorenzo',
      zone: 'Zona Pronaf',
      city: 'Ciudad Juárez, Chih.',
      desc: 'Atención a comercios aliados y recogida de calcomanías.'
    },
    {
      name: 'Punto Av. Tecnológico',
      zone: 'Av. Tecnológico',
      city: 'Ciudad Juárez, Chih.',
      desc: 'Stock completo de distintivos en vinil de grado automotriz.'
    },
    {
      name: 'Punto Valle del Sol',
      zone: 'Valle del Sol',
      city: 'Ciudad Juárez, Chih.',
      desc: 'Entrega de kits físicos para la zona residencial oriente.'
    }
  ];

  // Preguntas Frecuentes de Ciudad Juárez
  const faqList = [
    {
      q: '¿Qué es Vive Juárez?',
      a: 'Vive Juárez es el movimiento de orgullo local y club de beneficios exclusivos de Ciudad Juárez respaldado por la plataforma Red Identidad. Al colocar tu distintivo oficial automotriz (o pase digital) obtienes hasta un 15% de descuento en restaurantes, servicios y comercios aliados en toda la ciudad.'
    },
    {
      q: '¿La calcomanía soporta el clima extremo de Ciudad Juárez?',
      a: '¡Totalmente! Está producida en vinil automotriz alemán tricapa de alta durabilidad con protección contra rayos UV. Resiste tanto el calor intenso de verano como las heladas de invierno y los lavados de vehículo a presión.'
    },
    {
      q: '¿Cómo activo mis beneficios en comercios juarenses?',
      a: 'Recibes tu distintivo en un sobre sellado con un código QR irrepetible. Al escanearlo con la cámara de tu celular, activas tu membresía en 30 segundos. En cualquier comercio aliado solo muestras tu distintivo o tu QR en el celular para recibir el descuento inmediato.'
    },
    {
      q: '¿Dónde puedo conseguir el distintivo oficial en Ciudad Juárez?',
      a: 'Puedes solicitarlo en línea aquí mismo con envío directo o acudir a cualquiera de nuestros puntos de venta en Gómez Morín, Las Misiones, Pronaf, Tecnológico o Valle del Sol.'
    },
    {
      q: '¿Cómo puedo registrar mi negocio como Comercio Aliado en Juárez?',
      a: 'La afiliación para comercios locales es sin costo ni comisiones por venta. Solo requieres ofrecer un descuento o cortesía a los socios portadores del distintivo. Escríbenos en la sección de comercios para darte de alta.'
    }
  ];

  const handleMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantForm.businessName || !merchantForm.phone) return;

    const message = encodeURIComponent(
      `👋 ¡Hola! Me interesa afiliar mi negocio a Vive Juárez (Ciudad Juárez).\n\n` +
      `🏢 *Negocio:* ${merchantForm.businessName}\n` +
      `🏷️ *Giro:* ${merchantForm.category}\n` +
      `📍 *Zona:* ${merchantForm.zone}\n` +
      `👤 *Contacto:* ${merchantForm.contactName}\n` +
      `📱 *Teléfono:* ${merchantForm.phone}\n` +
      `🎁 *Propuesta de beneficio:* ${merchantForm.offerProposal || 'Por definir'}`
    );

    window.open(`https://wa.me/${JUAREZ_WHATSAPP}?text=${message}`, '_blank');
    setMerchantSubmitted(true);
    setTimeout(() => {
      setShowMerchantModal(false);
      setMerchantSubmitted(false);
    }, 2000);
  };

  const filteredAllies = selectedCategory === 'Todos'
    ? juarezAllies
    : juarezAllies.filter(a => a.category?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div style={{ backgroundColor: '#0B0B0E', color: '#F5F5F7', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── BARRA SUPERIOR CON CAMBIO DE CIUDAD ── */}
      <div style={{
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
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
          <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Plataforma Oficial Ciudad Juárez, Chihuahua</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ color: '#8E8E98' }}>Cambiar de ciudad:</span>
          <a 
            href="/" 
            style={{ 
              color: '#FFF', 
              textDecoration: 'underline', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Globe size={13} />
            <span>Ir a Campeche (Red Identidad)</span>
          </a>
        </div>
      </div>

      {/* ── NAVBAR PRINCIPAL VIVE JUÁREZ ── */}
      <nav 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(11, 11, 14, 0.88)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="landing-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '76px' }}>
          
          {/* Logo Vive Juárez */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/vive_juarez_qr_icon.png"
              alt="Vive Juárez"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                objectFit: 'contain',
                boxShadow: '0 4px 12px rgba(220,38,38,0.35)'
              }}
            />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.1 }}>
                VIVE <span className="gold-text">JUÁREZ</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#8E8E98', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                by Red Identidad
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'none', gap: '1.8rem', alignItems: 'center' }} className="d-lg-flex">
            <a href="#como-funciona" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>¿Cómo Funciona?</a>
            <a href="#distintivo" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>El Distintivo</a>
            <a href="#pase-digital" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Pase con QR</a>
            <a href="#aliados" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Comercios Aliados</a>
            <a href="#calculadora" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Calculadora</a>
            <a href="#planes" style={{ color: '#C0C0C5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Membresía ($80)</a>
            <a href="#negocios" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Para Negocios</a>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button 
              onClick={() => goToApp('/app')}
              className="landing-btn-glass"
              style={{ padding: '0.65rem 1.15rem', fontSize: '0.86rem' }}
            >
              <Smartphone size={16} />
              <span>Abrir App</span>
            </button>

            <button 
              onClick={() => handleOpenBuy('juarense_oficial')}
              className="landing-btn-gold"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
            >
              <ShoppingBag size={16} />
              <span>Distintivo Digital $80</span>
            </button>

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
              <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem' }}>¿Cómo Funciona?</a>
              <a href="#distintivo" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem' }}>El Distintivo Oficial Único</a>
              <a href="#pase-digital" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Tu Pase con Código QR</a>
              <a href="#aliados" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem' }}>Comercios en Cd. Juárez</a>
              <a href="#calculadora" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem' }}>Calculadora de Ahorro</a>
              <a href="#puntos-venta" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem' }}>Puntos de Entrega</a>
              <a href="#planes" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E0E0E6', textDecoration: 'none', fontSize: '1rem' }}>Membresía ($80 MXN)</a>
              <a href="#negocios" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Afiliar mi Negocio</a>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button onClick={() => { setMobileMenuOpen(false); goToApp('/app'); }} className="landing-btn-glass" style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}>Abrir App</button>
                <button onClick={() => { setMobileMenuOpen(false); handleOpenBuy('juarense_oficial'); }} className="landing-btn-gold" style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }}>Distintivo $80</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO SECTION PRINCIPAL ── */}
      <section style={{ position: 'relative', padding: '4.5rem 0 5rem', overflow: 'hidden' }}>
        
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="landing-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Copy Principal */}
            <div>
              <div className="landing-badge" style={{ marginBottom: '1.4rem' }}>
                <Sparkles size={15} />
                <span>Movimiento de Identidad y Consumo en Ciudad Juárez</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                marginBottom: '1.2rem',
                letterSpacing: '-0.03em'
              }}>
                El poder de consumir, ahorrar y <span className="gold-text">pertenecer</span> a esta frontera.
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#B0B0B8',
                lineHeight: 1.6,
                marginBottom: '2.2rem',
                maxWidth: '560px'
              }}>
                <strong>Vive Juárez</strong> es el distintivo digital oficial por <strong>$80 MXN</strong> que se convierte en tu <strong>pase digital con código QR</strong> en tu smartphone, con el logotipo oficial incrustado para obtener <strong>hasta un 15% de descuento en comercios y restaurantes aliados</strong> de Ciudad Juárez.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <button 
                  onClick={() => handleOpenBuy('juarense_oficial')}
                  className="landing-btn-gold"
                  style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
                >
                  <ShoppingBag size={19} />
                  <span>Obtener Distintivo Digital ($80)</span>
                </button>

                <button 
                  onClick={() => goToApp('/app')}
                  className="landing-btn-glass"
                  style={{ padding: '1rem 1.8rem', fontSize: '1.05rem' }}
                >
                  <Smartphone size={19} />
                  <span>Abrir App</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', color: '#9E9EA8', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Distintivo 100% digital e inmediato ($80 MXN)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Tu distintivo se convierte en tu pase con código QR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Código QR con el escudo oficial Vive Juárez insertado al centro</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span>Calcomanías físicas: próximamente en puntos autorizados</span>
                </div>
              </div>
            </div>

            {/* Showcase Visual */}
            <div style={{ position: 'relative' }}>
              <div 
                className="landing-card"
                style={{
                  padding: '1.8rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg, rgba(30, 30, 36, 0.8) 0%, rgba(18, 18, 22, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                }}
              >
                {/* Insignia Principal de la X de Juárez */}
                <div style={{
                  background: 'radial-gradient(circle, rgba(35, 35, 42, 0.9) 0%, rgba(18, 18, 22, 1) 100%)',
                  borderRadius: '16px',
                  padding: '2.5rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.2rem',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(18, 18, 22, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Award size={14} />
                    <span>Insignia Oficial 2026</span>
                  </div>

                  <img 
                    src="/vive_juarez_oficial.png" 
                    alt="Vive Juárez Insignia Oficial" 
                    style={{
                      maxHeight: '190px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 6px 20px rgba(220,38,38,0.45))'
                    }}
                  />

                  <div style={{ marginTop: '0.8rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    La "X" Monumental • Red Identidad Juárez
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#A0A0A8' }}>
                    Edición Oficial Única • Sin colores alternos
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div 
                    onClick={() => {
                      const el = document.getElementById('pase-digital');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)'
                    }}>
                      <QrCode size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Pase con QR Oficial</div>
                      <div style={{ fontSize: '0.72rem', color: '#D0D0D8' }}>Con logo inserto</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleOpenBuy('juarense_oficial')}
                    style={{
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)'
                    }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Distintivo Digital</div>
                      <div style={{ fontSize: '0.72rem', color: '#D0D0D8' }}>$80 • Edición Única</div>
                    </div>
                  </div>
                </div>

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
                    "Portar la X en el carro es sentir el verdadero orgullo juarense."
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BARRA DE MÉTRICAS & PROYECCIÓN EN CD. JUÁREZ ── */}
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
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>Socios en Lanzamiento</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF' }}>15+</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>Comercios en Zonas Clave</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Hasta 15%</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>De Descuento Inmediato</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF' }}>5</div>
              <div style={{ fontSize: '0.9rem', color: '#A0A0A8', marginTop: '0.2rem' }}>Puntos de Entrega en Juárez</div>
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
              ¿Cómo funciona Vive Juárez?
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Sin mensualidades ni cobros automáticos. Un solo pago y disfrutas de beneficios permanentes en la frontera.
            </p>
          </div>

          <div className="landing-grid-3">
            <div className="landing-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '24px', background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)', color: '#121212', fontWeight: 800, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>1</div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', marginBottom: '1.5rem' }}>
                <QrCode size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>Elige tu Acceso</h3>
              <p style={{ color: '#9E9EA8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Genera tu <strong>Pase QR Gratuito ($0 MXN)</strong> o adquiere tu <strong>Distintivo Digital Oficial ($80 MXN)</strong> para beneficios certificados. (Calcomanías físicas próximamente).
              </p>
            </div>

            <div className="landing-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '24px', background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)', color: '#121212', fontWeight: 800, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>2</div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                <Smartphone size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>QR con Escudo Insertado</h3>
              <p style={{ color: '#9E9EA8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Tu código QR personal incluye el escudo oficial de Vive Juárez en su centro. Mantenlo en tu smartphone o guárdalo como imagen.
              </p>
            </div>

            <div className="landing-card" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '24px', background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)', color: '#121212', fontWeight: 800, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>3</div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>Ahorra y Pertenece</h3>
              <p style={{ color: '#9E9EA8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Visita los restaurantes, autolavados y negocios aliados en Juárez. Muestra tu QR en el celular y recibe descuentos directos al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: EL DISTINTIVO OFICIAL VIVE JUÁREZ ── */}
      <section id="distintivo" style={{ padding: '6rem 0', backgroundColor: '#0F0F13' }}>
        <div className="landing-container">
          
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <ShieldCheck size={14} />
              <span>Identidad Oficial Fronteriza</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              El Distintivo Oficial de Juárez
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Inspirado en la fuerza y monumentalidad de nuestra emblemática "X", las vías del ferrocarril y el corazón juarense. <strong>Un solo diseño oficial, sin variantes de color: una sola identidad para todo Juárez.</strong>
            </p>
          </div>

          {/* Tarjeta de presentación de la insignia única */}
          <div style={{ maxWidth: '880px', margin: '0 auto 3.5rem' }}>
            <div 
              className="landing-card"
              style={{
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                background: 'linear-gradient(145deg, rgba(28, 25, 20, 0.95) 0%, rgba(15, 15, 18, 0.98) 100%)',
                border: '2px solid rgba(212, 175, 55, 0.45)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center'
              }}
            >
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1.5px solid rgba(212, 175, 55, 0.35)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                minHeight: '260px',
                background: '#121216'
              }}>
                <img 
                  src="/vive_juarez_auto.jpg" 
                  alt="Distintivo Vive Juárez colocado en vehículo"
                  style={{
                    width: '100%',
                    height: '260px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(15, 15, 18, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Car size={13} />
                  <span>En Vehículo</span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '10px 14px',
                  background: 'linear-gradient(to top, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.4) 70%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF' }}>
                    Colocación en Cajuela
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    Edición Oficial 2026
                  </span>
                </div>
              </div>

              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  color: 'var(--accent-gold)',
                  marginBottom: '0.8rem'
                }}>
                  <Award size={13} />
                  <span>Sin Colores Alternos • Solo el Oficial</span>
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: '0.8rem' }}>
                  {JUAREZ_OFFICIAL_STICKER.name}
                </h3>

                <p style={{ color: '#B0B0B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {JUAREZ_OFFICIAL_STICKER.description}
                </p>

                <div style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: '3px solid var(--accent-gold)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '2px' }}>
                    Beneficio Certificado
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#FFF' }}>
                    {JUAREZ_OFFICIAL_STICKER.perk}
                  </div>
                </div>

                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  border: '1px dashed rgba(212,175,55,0.3)',
                  marginBottom: '1.5rem',
                  fontSize: '0.82rem',
                  color: '#DDD'
                }}>
                  📍 <strong>Lanzamiento 100% digital ($80 MXN)</strong>: No hay calcomanía física aún. Recibirás tu distintivo y folio de socio oficial de inmediato en tu celular. Las piezas físicas se anunciarán próximamente.
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleOpenBuy('juarense_oficial')}
                    className="landing-btn-gold"
                    style={{ flex: 1, padding: '0.85rem 1.4rem', fontSize: '0.92rem', minWidth: '200px' }}
                  >
                    <ShoppingBag size={17} />
                    <span>Distintivo Digital ($80)</span>
                  </button>

                  <a 
                    href="#pase-digital"
                    className="landing-btn-glass"
                    style={{ padding: '0.85rem 1.2rem', fontSize: '0.92rem', color: 'var(--accent-gold)', borderColor: 'rgba(212,175,55,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <QrCode size={17} />
                    <span>Ver Pase con QR</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Simulador Interactivo */}
          <div className="landing-card" style={{ padding: '2.5rem', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Simulador en Vivo
                  </span>
                  <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '100px' }}>
                    <button 
                      onClick={() => setSimulatorMode('car')}
                      style={{ padding: '5px 12px', borderRadius: '100px', fontSize: '0.75rem', backgroundColor: simulatorMode === 'car' ? 'var(--accent-gold)' : 'transparent', color: simulatorMode === 'car' ? '#121212' : '#AAA', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      En Auto
                    </button>
                    <button 
                      onClick={() => setSimulatorMode('phone')}
                      style={{ padding: '5px 12px', borderRadius: '100px', fontSize: '0.75rem', backgroundColor: simulatorMode === 'phone' ? 'var(--accent-gold)' : 'transparent', color: simulatorMode === 'phone' ? '#121212' : '#AAA', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      En Celular
                    </button>
                  </div>
                </div>

                <div style={{
                  position: 'relative',
                  height: '240px',
                  backgroundColor: '#0c0c0e',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {simulatorMode === 'car' ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                      <img 
                        src="/vive_juarez_auto.jpg" 
                        alt="Distintivo Vive Juárez en Vehículo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '6px 12px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
                        fontSize: '0.72rem',
                        color: '#FFF',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}>
                        Distintivo oficial colocado en cajuela
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: '130px', height: '190px', backgroundColor: '#1E1E22', borderRadius: '20px', border: '3px solid #444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px' }}>
                      <img 
                        src={JUAREZ_OFFICIAL_STICKER.imagePath} 
                        alt="Sticker Preview"
                        style={{ width: '90px', height: '70px', objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(220,38,38,0.5))' }}
                      />
                      <span style={{ fontSize: '0.58rem', color: 'var(--accent-gold)', fontWeight: 700 }}>Pase Digital</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                    Ciudad Juárez, Chih.
                  </span>
                  <span>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#BBB' }}>Distintivo Digital $80 MXN</span>
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                  Tu Pase Oficial en Pantalla
                </h3>

                <p style={{ color: '#A0A0AA', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                  Muestra tu distintivo digital o tu código QR gratuito directamente desde tu smartphone en cualquier restaurante o comercio aliado para hacer válidos tus descuentos.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button 
                    onClick={() => handleOpenBuy('juarense_oficial')}
                    className="landing-btn-gold"
                    style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                  >
                    <ShoppingBag size={17} />
                    <span>Obtener Distintivo Digital ($80 MXN)</span>
                  </button>

                  <a 
                    href="#pase-digital"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'var(--accent-gold)',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      padding: '0.6rem'
                    }}
                  >
                    <QrCode size={16} />
                    <span>Ver cómo se convierte en tu Pase con QR</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN INTERACTIVA: EL DISTINTIVO ES TU PASE CON CÓDIGO QR ── */}
      <section id="pase-digital" style={{ padding: '6rem 0', backgroundColor: '#0B0B0E', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem', backgroundColor: 'rgba(212, 175, 55, 0.12)', borderColor: 'rgba(212, 175, 55, 0.35)', color: 'var(--accent-gold)' }}>
              <QrCode size={14} />
              <span>Tu Membresía en tu Smartphone</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Tu Distintivo se Convierte en tu Pase con QR
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Por solo <strong>$80 pesos (pago único)</strong>, adquieres tu distintivo digital oficial que <strong>se convierte en tu pase personal con código QR</strong> en tu celular. El código QR lleva la <strong>imagen oficial de Vive Juárez inserta en el centro</strong> para validar tus descuentos al instante.
            </p>
          </div>

          <div 
            className="landing-card"
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              padding: '2.5rem 2rem',
              background: 'linear-gradient(145deg, rgba(28, 25, 20, 0.95) 0%, rgba(16, 16, 19, 0.98) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              
              {/* Explicación y Beneficios */}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Todo Incluido por $80 MXN
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF', margin: '0.4rem 0 1rem' }}>
                  ¿Cómo funciona tu Pase Digital?
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem' }}>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0, fontWeight: 800, fontSize: '0.85rem' }}>1</div>
                    <div style={{ fontSize: '0.9rem', color: '#D0D0D8', lineHeight: 1.5 }}>
                      <strong>Un solo pago de $80 MXN:</strong> Adquieres tu distintivo oficial Vive Juárez sin mensualidades ni cobros posteriores.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0, fontWeight: 800, fontSize: '0.85rem' }}>2</div>
                    <div style={{ fontSize: '0.9rem', color: '#D0D0D8', lineHeight: 1.5 }}>
                      <strong>Se convierte en tu Pase con QR:</strong> Tu distintivo digital genera tu código QR con la insignia oficial de Vive Juárez insertada en el centro.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0, fontWeight: 800, fontSize: '0.85rem' }}>3</div>
                    <div style={{ fontSize: '0.9rem', color: '#D0D0D8', lineHeight: 1.5 }}>
                      <strong>Ahorro inmediato en Ciudad Juárez:</strong> Muestras tu pase al pagar en cualquier comercio aliado y recibes hasta 15% de descuento.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0, fontWeight: 800, fontSize: '0.85rem' }}>4</div>
                    <div style={{ fontSize: '0.9rem', color: '#D0D0D8', lineHeight: 1.5 }}>
                      <strong>Calcomanía física:</strong> Próximamente disponible en puntos de entrega autorizados.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBuy('juarense_oficial')}
                  className="landing-btn-gold"
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.4rem',
                    fontSize: '1rem'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Obtener mi Distintivo por $80 MXN</span>
                </button>
              </div>

              {/* Vista previa del Pase Digital con QR y Escudo insertado */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  background: 'linear-gradient(160deg, #1A1A20 0%, #0F0F12 100%)',
                  borderRadius: '24px',
                  padding: '1.8rem 1.4rem',
                  border: '1.5px solid rgba(212, 175, 55, 0.45)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
                  width: '100%',
                  maxWidth: '300px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <img src="/vive_juarez_qr_icon.png" alt="Vive Juárez" style={{ width: '24px', height: '24px', borderRadius: '6px' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.06em', color: '#FFF' }}>PASE DIGITAL OFICIAL</span>
                  </div>

                  <div style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1.1rem',
                    borderRadius: '18px',
                    display: 'inline-block',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    margin: '0.4rem 0'
                  }}>
                    <QRCodeSVG 
                      value="https://redidentidad.vercel.app/app?city=juarez"
                      size={175}
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#121212"
                      imageSettings={{
                        src: '/vive_juarez_qr_icon.png',
                        height: 46,
                        width: 46,
                        excavate: true
                      }}
                    />
                  </div>

                  <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    VIVE JUÁREZ • $80 MXN
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#9E9EA8', marginTop: '4px', lineHeight: 1.4 }}>
                    Código QR único con imagen oficial incrustada. Válido en toda la red de comercios aliados.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: COMERCIOS ALIADOS EN CIUDAD JUÁREZ ── */}
      <section id="aliados" style={{ padding: '6rem 0' }}>
        <div className="landing-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <div className="landing-badge" style={{ marginBottom: '1rem' }}>
                <Store size={14} />
                <span>Consumo Local en Ciudad Juárez</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800 }}>
                Comercios Aliados en Juárez
              </h2>
              <p style={{ color: '#A5A5AF', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '580px' }}>
                Muestra tu distintivo o tu QR en tu smartphone para disfrutar de promociones directas en tus visitas.
              </p>
            </div>

            <button 
              onClick={() => goToApp('/aliados')}
              className="landing-btn-glass"
            >
              <span>Ver mapa de aliados</span>
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Categorías */}
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
            {['Todos', 'Comida', 'Auto', 'Servicios', 'Entretenimiento'].map((cat) => (
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
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Aliados en Juárez */}
          <div className="landing-grid-3">
            {filteredAllies.map((ally) => (
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
                      {ally.category}
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
                    🎁 {ally.discount}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7E7E88', fontSize: '0.8rem', marginTop: '1rem' }}>
                  <MapPin size={14} />
                  <span>{ally.zone} • Ciudad Juárez</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 4: CALCULADORA DE AHORRO ── */}
      <section id="calculadora" style={{ padding: '6rem 0', backgroundColor: '#0E0E12' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <Calculator size={14} />
              <span>Retorno Inmediato</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              ¿Cuánto te ahorras con Vive Juárez?
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Ajusta tu consumo habitual y comprueba que una calcomanía de $90 se paga sola desde tus primeras salidas.
            </p>
          </div>

          <div className="landing-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D0D0D8' }}>Restaurantes y Cafeterías al mes:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>${monthlyDining.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="8000" 
                    step="250"
                    value={monthlyDining} 
                    onChange={(e) => setMonthlyDining(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D0D0D8' }}>Autolavado y Mantenimiento al mes:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>${monthlyAuto.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="4000" 
                    step="100"
                    value={monthlyAuto} 
                    onChange={(e) => setMonthlyAuto(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#D0D0D8' }}>Entretenimiento y Servicios:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>${monthlyServices.toLocaleString('es-MX')} MXN</strong>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="5000" 
                    step="200"
                    value={monthlyServices} 
                    onChange={(e) => setMonthlyServices(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(145deg, rgba(35, 30, 20, 0.6) 0%, rgba(20, 20, 24, 0.9) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.85rem', color: '#A0A0AA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ahorro Anual Estimado
                </span>
                
                <div style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.5rem 0' }}>
                  ${estimatedAnnualSavings.toLocaleString('es-MX')} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>MXN</span>
                </div>

                <p style={{ color: '#90909A', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Calculado con un descuento promedio del 12% en consumos locales habituales en Ciudad Juárez.
                </p>

                <button 
                  onClick={() => handleOpenBuy('juarense_oficial')}
                  className="landing-btn-gold"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  <ShoppingBag size={17} />
                  <span>Obtener mi Distintivo Digital por $80</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 5: PUNTOS DE VENTA EN CD. JUÁREZ ── */}
      <section id="puntos-venta" style={{ padding: '6rem 0' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <MapPin size={14} />
              <span>Red de Puntos Autorizados en Juárez</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Puntos de Entrega en Juárez
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              <strong>Lanzamiento Fase 1:</strong> Distintivo 100% Digital ($80 MXN) y Pase QR Gratuito disponibles hoy mismo en tu smartphone. Próximamente distribución de calcomanías físicas oficiales en sobre sellado en estos puntos autorizados.
            </p>
          </div>

          <div className="landing-grid-3">
            {juarezStores.map((store, i) => (
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
                    href={`https://wa.me/${JUAREZ_WHATSAPP}?text=${encodeURIComponent(`Hola, me gustaría más información sobre el distintivo de Vive Juárez en el punto ${store.name} (${store.zone}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <span>Consultar</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: PRECIOS ── */}
      <section id="planes" style={{ padding: '6rem 0', backgroundColor: '#0D0D11' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <div className="landing-badge" style={{ marginBottom: '1rem' }}>
              <CreditCard size={14} />
              <span>Un Solo Pago • Sin Mensualidades</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Membresía & Distintivo Digital
            </h2>
            <p style={{ color: '#A5A5AF', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Tu distintivo digital de $80 pesos se convierte en tu pase con código QR para identificarte y ahorrar en comercios de Ciudad Juárez.
            </p>
          </div>

          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            
            {/* PLAN ÚNICO: DISTINTIVO DIGITAL OFICIAL */}
            <div 
              className="landing-card" 
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '2px solid var(--accent-gold)',
                background: 'linear-gradient(160deg, rgba(32, 28, 20, 0.9) 0%, rgba(18, 18, 22, 0.98) 100%)',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(212, 175, 55, 0.2)'
              }}
            >
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
                ⭐ Lanzamiento Oficial Ciudad Juárez
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  Membresía Digital Completa
                </span>
                <h3 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0.4rem 0 1rem' }}>
                  Distintivo & Pase Vive Juárez
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '3.4rem', fontWeight: 900, color: 'var(--accent-gold)' }}>$80</span>
                  <span style={{ fontSize: '1rem', color: '#A0A0A8' }}>MXN / pago único permanente</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.2rem' }}>
                  {[
                    'Distintivo Digital Oficial en alta resolución con la X de Juárez (Rojo y Negro)',
                    'Se convierte en tu Pase Digital con código QR en tu smartphone',
                    'Código QR oficial con la insignia Vive Juárez incrustada en el centro',
                    'Hasta 15% de descuento en restaurantes, talleres y comercios aliados en Cd. Juárez',
                    'Folio único de socio fronterizo registrado en el sistema',
                    'Sin plazos forzosos ni mensualidades (un solo pago de $80 MXN)',
                    'Próximamente calcomanía física en sobre sellado en puntos de entrega oficiales'
                  ].map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', fontSize: '0.92rem', color: '#FFF' }}>
                      <Check size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleOpenBuy('juarense_oficial')}
                className="landing-btn-gold"
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
              >
                <ShoppingBag size={19} />
                <span>Obtener mi Distintivo Digital ($80 MXN)</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECCIÓN 7: PARA COMERCIOS DE CIUDAD JUÁREZ (B2B) ── */}
      <section id="negocios" style={{ padding: '6rem 0' }}>
        <div className="landing-container">
          <div className="landing-card" style={{ padding: '3.5rem 2.5rem', background: 'linear-gradient(135deg, rgba(26, 26, 32, 0.95) 0%, rgba(16, 16, 20, 0.95) 100%)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <div className="landing-badge" style={{ marginBottom: '1.2rem' }}>
                  <Store size={14} />
                  <span>Alianza Comercial Fronteriza</span>
                </div>

                <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.2rem' }}>
                  ¿Tienes un negocio en Juárez? <span className="gold-text">Súmate como Aliado</span>.
                </h2>

                <p style={{ color: '#B0B0B8', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Atrae a cientos de clientes y familias juarenses que buscan apoyar lo local. Cero comisiones sobre tus ventas.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Clientes Locales Frecuentes</h4>
                      <p style={{ color: '#8E8E98', fontSize: '0.88rem' }}>Los socios de Vive Juárez buscan consumir preferentemente en negocios que portan el distintivo.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Cero Comisiones</h4>
                      <p style={{ color: '#8E8E98', fontSize: '0.88rem' }}>Tú decides el beneficio directo sin pagar porcentajes a intermediarios.</p>
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
                    <span>Afiliar mi Comercio en Juárez</span>
                  </button>

                  <a 
                    href={`https://wa.me/${JUAREZ_WHATSAPP}?text=${encodeURIComponent('Hola, me gustaría afiliar mi negocio como comercio aliado de Vive Juárez.')}`}
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

              <div style={{
                background: 'rgba(18, 18, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Award size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Insignia Oficial de Aliado Juárez</h3>
                <p style={{ color: '#8E8E98', fontSize: '0.88rem', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
                  Recibe tu distintivo de mostrador y presencia destacada en la app de Vive Juárez.
                </p>
                <button 
                  onClick={() => navigate('/aliado-panel')}
                  className="landing-btn-glass"
                  style={{ width: '100%', fontSize: '0.88rem', padding: '0.75rem' }}
                >
                  <span>Portal para Comercios Afiliados</span>
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
              Todo lo que necesitas saber sobre Vive Juárez.
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

      {/* ── FOOTER VIVE JUÁREZ ── */}
      <footer style={{ backgroundColor: '#08080A', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '4rem 0 2.5rem', color: '#7E7E88', fontSize: '0.88rem' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
            
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', marginBottom: '0.3rem' }}>
                VIVE <span className="gold-text">JUÁREZ</span>
              </div>
              <p style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontSize: '0.82rem', marginBottom: '1rem' }}>
                "El poder de consumir, ahorrar y pertenecer a esta frontera"
              </p>
              <p style={{ lineHeight: 1.6, color: '#7A7A85' }}>
                Iniciativa ciudadana y comercial en Ciudad Juárez, Chihuahua. Respaldada por la red nacional Red Identidad.
              </p>
            </div>

            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Navegación</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a href="#como-funciona" style={{ color: '#90909A', textDecoration: 'none' }}>¿Cómo Funciona?</a>
                <a href="#distintivo" style={{ color: '#90909A', textDecoration: 'none' }}>El Distintivo de Juárez</a>
                <a href="#aliados" style={{ color: '#90909A', textDecoration: 'none' }}>Comercios Aliados</a>
                <a href="#puntos-venta" style={{ color: '#90909A', textDecoration: 'none' }}>Puntos de Entrega</a>
                <a href="#planes" style={{ color: '#90909A', textDecoration: 'none' }}>Planes y Membresías</a>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Portales</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button onClick={() => goToApp('/app')} style={{ textAlign: 'left', color: '#90909A', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>App de Miembros</button>
                <button onClick={() => goToApp('/registro')} style={{ textAlign: 'left', color: '#90909A', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Activar mi Código QR</button>
                <button onClick={() => goToApp('/aliado-panel')} style={{ textAlign: 'left', color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Portal de Comercios Aliados</button>
                <a href="/" style={{ textAlign: 'left', color: '#90909A', textDecoration: 'none' }}>Ver Red Identidad Campeche</a>
              </div>
            </div>

            <div>
              <h5 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Atención Juárez</h5>
              <p style={{ lineHeight: 1.6, marginBottom: '0.8rem' }}>
                Atención directa a miembros y comercios:
              </p>
              <a 
                href={`https://wa.me/${JUAREZ_WHATSAPP}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontWeight: 600, textDecoration: 'none' }}
              >
                <MessageCircle size={16} />
                <span>WhatsApp Atención Juárez</span>
              </a>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6A6A74' }}>
                Ciudad Juárez, Chihuahua, México
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
              © 2026 Vive Juárez. Red Identidad. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span>Juarense Soy</span>
              <span>•</span>
              <span>Vive Juárez</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Compra */}
      <BuyStickerModal 
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        initialSticker={selectedStickerForModal}
      />

      {/* Modal de Afiliación B2B */}
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
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Afiliar Negocio en Cd. Juárez</h3>
                </div>
                <button onClick={() => setShowMerchantModal(false)} style={{ color: '#AAA' }}>
                  <X size={20} />
                </button>
              </div>

              {merchantSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle2 size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>¡Solicitud enviada con éxito!</h4>
                  <p style={{ color: '#A0A0AA', fontSize: '0.9rem' }}>Te contactaremos de inmediato por WhatsApp para activar tu perfil de aliado en Vive Juárez.</p>
                </div>
              ) : (
                <form onSubmit={handleMerchantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ color: '#A0A0AA', fontSize: '0.88rem' }}>
                    Súmate a la red comercial más activa de Ciudad Juárez sin pagar comisiones por venta.
                  </p>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Nombre del Negocio *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Burritos del Puente, Taller Frontera"
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
                      <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Zona en Juárez</label>
                      <select
                        value={merchantForm.zone}
                        onChange={(e) => setMerchantForm({ ...merchantForm, zone: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#19191E', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}
                      >
                        <option>Gómez Morín / San Lorenzo</option>
                        <option>Las Misiones / Ejército Nal.</option>
                        <option>Zona Pronaf / Chamizal</option>
                        <option>Valle del Sol</option>
                        <option>Centro Histórico</option>
                        <option>Av. Tecnológico / Aeropuerto</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#BBB', display: 'block', marginBottom: '0.3rem' }}>Tu Nombre</label>
                      <input 
                        type="text" 
                        placeholder="Encargado o dueño"
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
                        placeholder="656 123 4567"
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
                      placeholder="Ej. 10% de descuento, bebida de cortesía"
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
                    <span>Enviar Solicitud a WhatsApp</span>
                    <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Barra móvil inferior */}
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
          onClick={() => handleOpenBuy('juarense_oficial')} 
          className="landing-btn-gold" 
          style={{ flex: 1.4, padding: '0.7rem', fontSize: '0.85rem' }}
        >
          <ShoppingBag size={16} />
          <span>Distintivo $80</span>
        </button>
      </div>

    </div>
  );
};

export default LandingJuarez;
