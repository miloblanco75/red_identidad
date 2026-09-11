import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ShieldCheck, Sparkles, Utensils, Car, Wine, 
  HeartPulse, Building2, MapPin, Loader2, Globe, QrCode, 
  Award, Heart, Store, Camera, Flame, DollarSign, ChevronDown, ChevronUp, Briefcase, Navigation,
  Gift, Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import BrandLogo from '../components/BrandLogo';
import { BuyStickerModal } from '../components/BuyStickerModal';
import { MemberCardModal } from '../components/MemberCardModal';
import { RecoverPassModal } from '../components/RecoverPassModal';
import { UploadStickerPhotoModal } from '../components/UploadStickerPhotoModal';
import { SorteosPublicModal } from '../components/SorteosPublicModal';
import { useAuth } from '../contexts/AuthContext';

const FacebookIcon = ({ size = 14, color = '#1877F2' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const mockPromotions = [
  {
    id: 'mock-1',
    name: 'Café del Mar Campeche',
    category: 'Comida',
    discount: '15% de Descuento en Consumo Total',
    visits: 120,
    isMock: true,
    facebook_url: 'https://facebook.com',
    website_url: ''
  },
  {
    id: 'mock-2',
    name: 'AutoLavado Fast El Carmen',
    category: 'Auto',
    discount: 'Lavado Gratis en tu 3ra Visita',
    visits: 95,
    isMock: true,
    facebook_url: 'https://facebook.com',
    website_url: 'https://autolavadofast.com'
  },
  {
    id: 'mock-3',
    name: 'Club 59 Lounge',
    category: 'Entretenimiento',
    discount: 'Shot de Bienvenida de Cortesía',
    visits: 210,
    isMock: true,
    facebook_url: 'https://facebook.com',
    website_url: ''
  },
  {
    id: 'mock-4',
    name: 'Spa Sentidos',
    category: 'Salud',
    discount: '20% OFF en Masaje Relajante',
    visits: 45,
    isMock: true,
    facebook_url: 'https://facebook.com',
    website_url: 'https://spasentidos.com'
  }
];

const communityShowcase = [
  {
    name: 'Carlos M.',
    location: 'Campeche Centro',
    quote: 'Llevar mi distintivo en el coche es un orgullo. Los descuentos en aliados se pagan solos.',
    tag: 'Miembro Activo'
  },
  {
    name: 'María F.',
    location: 'Ciudad del Carmen',
    quote: 'Me encanta ser parte de una red que impulsa los negocios de nuestra propia tierra.',
    tag: 'Miembro Activo'
  },
  {
    name: 'Jorge L.',
    location: 'Champotón',
    quote: 'Cuando veo a otro automovilista con el emblema, sé que compartimos el mismo orgullo.',
    tag: 'Miembro Activo'
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allies, setAllies] = useState<any[]>([]);
  const [newAllies, setNewAllies] = useState<any[]>([]);
  const [claimedCount, setClaimedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  const [showSorteosModal, setShowSorteosModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [initialStickerSelection, setInitialStickerSelection] = useState<string>('campechano_negra');

  const officialStores = [
    {
      city: 'San Francisco de Campeche',
      name: 'Maneki Neko',
      address: 'Plaza del Mar',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Barbería Mdoce',
      address: 'Avenida Concordia',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Lavadero Royal Shine',
      address: 'Avenida Central',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Refaccionaria Bahía',
      address: 'Avenida Hidalgo',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Gesti+',
      address: 'Av. Ruiz Cortines (contra esquina del Palacio Federal)',
      phone: '9811971305'
    }
  ];

  const faqItems = [
    {
      q: '¿La calcomanía resiste el sol, la lluvia y los lavados de auto?',
      a: '¡Totalmente! Tu distintivo está producido en vinil de grado automotriz de alta durabilidad con corte de precisión. No se despinta con el sol de Campeche ni se desprende al lavar tu vehículo a presión.'
    },
    {
      q: '¿Cómo activo mis beneficios digitales y descuentos?',
      a: 'Junto con tu calcomanía recibes tu tarjeta física o código QR único. Al escanearlo con cualquier teléfono inteligente activas tu perfil oficial y presentas tus descuentos inmediatos en todos los comercios afiliados.'
    },
    {
      q: '¿Dónde entregan mi distintivo físico o dónde puedo recogerlo?',
      a: 'Puedes solicitarlo con envío directo por WhatsApp o acudir personalmente a nuestros Puntos de Venta Oficiales: Maneki Neko en Plaza del Mar, Barbería Mdoce en Av. Concordia, Lavadero Royal Shine en Av. Central, Refaccionaria Bahía en Av. Hidalgo y Gesti+ en Av. Ruiz Cortines (contra esquina del Palacio Federal).'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Allies
      const { data, error } = await supabase
        .from('allies')
        .select('*')
        .order('promotions_given', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setAllies(data);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        setNewAllies(data.filter((a: any) => a.created_at && new Date(a.created_at) > weekAgo));
      }

      // 2. Fetch Claimed stickers count for social proof
      const { count } = await supabase
        .from('stickers')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null);

      if (count !== null && count !== undefined) {
        setClaimedCount(count);
      }
    } catch (error) {
      console.error('Error fetching Home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'gold': return 'VIP';
      case 'silver': return 'Colección';
      default: return 'Esencial';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'gold': return 'var(--accent-gold)';
      case 'silver': return 'var(--accent-silver)';
      default: return 'var(--accent-white)';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Comida': return Utensils;
      case 'Auto': return Car;
      case 'Servicios': return Briefcase;
      case 'Estética': return Sparkles;
      case 'Entretenimiento': return Wine;
      case 'Salud': return HeartPulse;
      default: return Building2;
    }
  };

  const displayPromotions = allies.length > 0 ? allies : mockPromotions;
  const totalAlliesCount = allies.length > 0 ? allies.length : 12;
  const totalMembersCount = claimedCount > 0 ? claimedCount : 350;

  return (
    <div className="animate-fade-in" style={{ padding: '1.2rem 1.5rem 5rem' }}>

      {/* ── Saludo personalizado si ya tiene pase activo ── */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass"
          style={{
            marginTop: '0.8rem',
            marginBottom: '1.5rem',
            padding: '1rem 1.2rem',
            borderRadius: '20px',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(20,15,5,0.95) 100%)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '3px' }}>👋 Bienvenido de regreso</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Miembro <span className="gold-text">#{String(user.member_number).padStart(4, '0')}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: getLevelColor(user.level), fontWeight: 600, marginTop: '3px' }}>
              ● Distintivo Activo — {getLevelName(user.level)}
            </div>
          </div>
          <button
            onClick={() => setShowCardModal(true)}
            style={{
              backgroundColor: 'var(--accent-gold)',
              border: 'none',
              color: '#121212',
              borderRadius: '12px',
              padding: '0.7rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 0 15px rgba(212,175,55,0.3)',
            }}
          >
            <QrCode size={16} /> Mi Carné Digital
          </button>
        </motion.div>
      )}

      {/* ── Banner de Sincronizar Pase si no tiene sesión activa en esta ventana ── */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowRecoverModal(true)}
          className="glass"
          style={{
            marginTop: '0.8rem',
            marginBottom: '1.5rem',
            padding: '0.85rem 1.2rem',
            borderRadius: '18px',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(212,175,55,0.08)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFF', fontWeight: 600 }}>
            <Sparkles size={16} color="var(--accent-gold)" />
            ¿Ya tienes tu distintivo o carné?
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
            Sincronizar Pase →
          </span>
        </motion.div>
      )}

      {/* =========================================================
          SECCIÓN 1: HERO PRINCIPAL (CAMPECHANO SOY + DISTINTIVO COMPLETO)
         ========================================================= */}
      <section style={{ marginTop: user ? '0.5rem' : '1rem', marginBottom: '2.5rem' }}>
        
        {/* Subtle Institutional Brand Sub-logo */}
        <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
          <BrandLogo size="small" showSlogan={false} />
        </div>

        {/* Hero Responsive Layout Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.8rem',
          alignItems: 'center',
        }}>
          {/* Main Title & Value Proposition */}
          <div style={{ textAlign: 'center' }}>
            {/* Badge de Prueba Social Dinámica (FOMO) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.78rem',
                color: '#F87171',
                fontWeight: 700
              }}>
                <Flame size={15} color="#EF4444" />
                <span>🔥 18 campechanos han solicitado su distintivo esta semana en Campeche y Carmen</span>
              </div>
            </div>

            <h1 style={{ 
              fontSize: '2.8rem', 
              fontWeight: 900, 
              lineHeight: 1.05, 
              letterSpacing: '-0.02em', 
              marginBottom: '0.8rem' 
            }}>
              <span className="gold-text">CAMPECHANO</span> SOY
            </h1>

            {/* OBLIGATORIO: Imagen del Distintivo Físico Completo en Mobile/Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                margin: '1.2rem auto',
                maxWidth: '340px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div 
                className="glass premium-glow-gold"
                style={{
                  padding: '1.2rem',
                  borderRadius: '24px',
                  border: '1px solid rgba(212,175,55,0.4)',
                  backgroundColor: 'rgba(20,20,20,0.85)',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.8rem',
                  boxShadow: '0 8px 32px rgba(212,175,55,0.2)'
                }}
              >
                <img 
                  src="/campechano_soy_coche.jpg" 
                  alt="Distintivo Oficial Campechano Soy (Puerta de Tierra)" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '260px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    border: '1px solid rgba(212,175,55,0.4)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    display: 'block'
                  }}
                />
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <ShieldCheck size={14} /> Distintivo Físico Oficial
                </div>
              </div>
            </motion.div>

            {/* Mensaje Racional y Emocional */}
            <p style={{ 
              color: 'var(--text-dim)', 
              fontSize: '1rem', 
              lineHeight: 1.6, 
              maxWidth: '460px', 
              margin: '0 auto 1.4rem',
              fontWeight: 400 
            }}>
              El distintivo que identifica a quienes sienten orgullo por Campeche y les da acceso a beneficios exclusivos dentro de una red de negocios aliados.
            </p>

            {/* Selector Visual de Pertenencia Territorial con Calcomanías Reales de la Galería */}
            <div style={{ marginBottom: '1.8rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, display: 'block', marginBottom: '0.8rem' }}>
                Elige tu Distintivo Oficial ($90 MXN):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', maxWidth: '460px', margin: '0 auto' }}>
                {/* Campechano Soy */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setInitialStickerSelection('campechano_negra'); setShowBuyModal(true); }}
                  className="glass"
                  style={{
                    padding: '0.9rem 0.4rem 0.75rem',
                    borderRadius: '18px',
                    border: '1.5px solid rgba(212,175,55,0.4)',
                    backgroundColor: 'rgba(30,30,35,0.85)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                    <img 
                      src="/campechano_oficial.svg" 
                      alt="Campechano Soy" 
                      style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'brightness(0) invert(1) drop-shadow(0 2px 6px rgba(255,255,255,0.5))' }} 
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FFF', whiteSpace: 'nowrap', marginBottom: '2px' }}>CAMPECHANO</div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--accent-gold)', fontWeight: 800, backgroundColor: 'rgba(212,175,55,0.15)', padding: '2px 6px', borderRadius: '6px' }}>
                    Blanca / Negra
                  </span>
                </motion.div>

                {/* Campechana Soy */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setInitialStickerSelection('campechana_rosa'); setShowBuyModal(true); }}
                  className="glass"
                  style={{
                    padding: '0.9rem 0.4rem 0.75rem',
                    borderRadius: '18px',
                    border: '1.5px solid rgba(244,143,177,0.45)',
                    backgroundColor: 'rgba(35,20,30,0.85)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                    <img 
                      src="/campechana_rosada.png" 
                      alt="Campechana Soy" 
                      style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(244,143,177,0.5))' }} 
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FFF', whiteSpace: 'nowrap', marginBottom: '2px' }}>CAMPECHANA</div>
                  <span style={{ fontSize: '0.6rem', color: '#F48FB1', fontWeight: 800, backgroundColor: 'rgba(244,143,177,0.15)', padding: '2px 6px', borderRadius: '6px' }}>
                    Blanca / Negra / Rosa
                  </span>
                </motion.div>

                {/* Carmelita Soy */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setInitialStickerSelection('carmelita_rosa'); setShowBuyModal(true); }}
                  className="glass"
                  style={{
                    padding: '0.9rem 0.4rem 0.75rem',
                    borderRadius: '18px',
                    border: '1.5px solid rgba(96,165,250,0.45)',
                    backgroundColor: 'rgba(20,25,40,0.85)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                    <img 
                      src="/carmelita_rosada.png" 
                      alt="Carmelita Soy" 
                      style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(96,165,250,0.5))' }} 
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FFF', whiteSpace: 'nowrap', marginBottom: '2px' }}>CARMELITA</div>
                  <span style={{ fontSize: '0.6rem', color: '#60A5FA', fontWeight: 800, backgroundColor: 'rgba(96,165,250,0.15)', padding: '2px 6px', borderRadius: '6px' }}>
                    Blanca/Negra/Rosa
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Botones de Acción (CTAs Inequívocos) */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.8rem', 
              maxWidth: '360px', 
              margin: '0 auto' 
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBuyModal(true)}
                style={{
                  width: '100%',
                  padding: '1.15rem 1.5rem',
                  borderRadius: '18px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(212,175,55,0.4)',
                  letterSpacing: '0.04em'
                }}
              >
                QUIERO MI DISTINTIVO <ChevronRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById('beneficios');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('/aliados');
                }}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                VER BENEFICIOS
              </motion.button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 2: PRUEBA SOCIAL (CIFRAS REALES DE LA PLATAFORMA)
         ========================================================= */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.8rem'
        }}>
          <div className="glass" style={{ padding: '1rem 0.6rem', borderRadius: '18px', textAlign: 'center', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-gold)' }}>+{totalMembersCount}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '2px', lineHeight: 1.2 }}>Miembros Activos</div>
          </div>

          <div className="glass" style={{ padding: '1rem 0.6rem', borderRadius: '18px', textAlign: 'center', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{totalAlliesCount}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '2px', lineHeight: 1.2 }}>Negocios Aliados</div>
          </div>

          <div className="glass" style={{ padding: '1rem 0.6rem', borderRadius: '18px', textAlign: 'center', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-gold)' }}>5</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '2px', lineHeight: 1.2 }}>Categorías Exclusivas</div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN: SORTEOS Y RIFAS MENSUALES (FIDELIZACIÓN)
         ========================================================= */}
      <section style={{ marginBottom: '2.5rem' }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => setShowSorteosModal(true)}
          style={{
            padding: '1.4rem 1.3rem',
            borderRadius: '22px',
            border: '1.5px solid rgba(212,175,55,0.45)',
            background: 'linear-gradient(135deg, rgba(35,25,12,0.95) 0%, rgba(18,16,24,0.95) 100%)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 25px rgba(212,175,55,0.15)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'rgba(212,175,55,0.2)',
              border: '1.5px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Gift size={28} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.08em' }}>
                  Gran Sorteo Mensual en Vivo
                </span>
                <span style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#F87171', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  ACTIVO
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFF', margin: '0 0 3px' }}>
                ¡Gana gasolina y premios con tu calcomanía!
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
                Cada distintivo registrado participa automáticamente con su número de socio oficial.
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSorteosModal(true);
            }}
            style={{
              padding: '0.7rem 1.1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(212,175,55,0.18)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Trophy size={15} /> Ver Premios & Bases →
          </button>
        </motion.div>
      </section>

      {/* =========================================================
          SECCIÓN: VALOR Y RETORNO DE INVERSIÓN (SE PAGA SOLO)
         ========================================================= */}
      <section style={{ marginBottom: '3.5rem' }}>
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass premium-glow-gold" 
          style={{
            padding: '1.6rem 1.4rem',
            borderRadius: '24px',
            border: '1px solid rgba(212,175,55,0.35)',
            background: 'linear-gradient(135deg, rgba(30,25,10,0.9) 0%, rgba(15,12,5,0.95) 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(212,175,55,0.15)',
            padding: '0.8rem',
            borderRadius: '16px',
            border: '1px solid var(--accent-gold)',
            flexShrink: 0
          }}>
            <DollarSign size={28} color="var(--accent-gold)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', marginBottom: '0.4rem' }}>
              ¡Tu distintivo se paga solo desde tu 1ra o 2da visita! 💡
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
              Tu calcomanía cuesta solo <strong>$90 MXN</strong>, pero te otorga entre <strong>10% y 20% de descuento directo</strong> en restaurantes, lavacoches, cafeterías y servicios en todo Campeche y Carmen. Ahorras en promedio más de <strong>$600 MXN al mes</strong> con solo portar tu distintivo.
            </p>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECCIÓN 3: BENEFICIOS (PERTENECER TIENE BENEFICIOS)
         ========================================================= */}
      <section id="beneficios" style={{ marginBottom: '3.5rem', scrollMarginTop: '2rem' }}>
        <div style={{ marginBottom: '1.4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '0.6rem' }}>
            <Sparkles size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Beneficios Concretos
            </span>
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '0.6rem' }}>
            PERTENECER TIENE BENEFICIOS
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Tu distintivo te identifica y tu pertenencia te da acceso a promociones, descuentos y tratos preferenciales en negocios locales de nuestro estado.
          </p>
        </div>

        {/* =========================================================
            SECCIÓN 4: ALIADOS (NEGOCIOS QUE FORMAN PARTE DE LA RED)
           ========================================================= */}
        <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            NEGOCIOS QUE FORMAN PARTE DE LA RED
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Descubre los negocios que ya decidieron formar parte de esta comunidad.
          </p>
        </div>

        {loading ? (
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" color="var(--accent-gold)" />
          </div>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              paddingBottom: '0.8rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {displayPromotions.map((promo) => {
              const IconComponent = getCategoryIcon(promo.category);

              return (
                <motion.div 
                  key={promo.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    flex: '0 0 85%',
                    maxWidth: '300px',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div 
                    className="glass premium-glow-gold" 
                    style={{ 
                      padding: '1.3rem', 
                      borderRadius: '24px', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      border: '1px solid rgba(212,175,55,0.25)',
                      position: 'relative',
                      background: 'linear-gradient(135deg, rgba(25,25,25,0.85) 0%, rgba(15,15,15,0.95) 100%)'
                    }}
                  >
                    {promo.isMock && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        backgroundColor: 'rgba(255,255,255,0.08)', 
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'var(--text-dim)', 
                        padding: '2px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.6rem',
                        fontWeight: 700
                      }}>
                        Demo
                      </span>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                        {promo.logo_url ? (
                          <img src={promo.logo_url} alt={promo.name} style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'contain', border: '1px solid var(--glass-border)', backgroundColor: '#FFF', padding: '2px' }} />
                        ) : (
                          <div style={{ backgroundColor: 'rgba(212,175,55,0.12)', padding: '7px', borderRadius: '10px' }}>
                            <IconComponent size={16} color="var(--accent-gold)" />
                          </div>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                          {promo.category}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem' }}>{promo.name}</h4>
                      <p className="gold-text" style={{ fontSize: '1.18rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.9rem' }}>
                        {promo.discount}
                      </p>

                      {/* Social Links */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
                        {promo.facebook_url && (
                          <a
                            href={promo.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(24, 119, 242, 0.15)',
                              color: '#1877F2',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              border: '1px solid rgba(24, 119, 242, 0.3)'
                            }}
                          >
                            <FacebookIcon size={12} color="#1877F2" /> Facebook
                          </a>
                        )}
                        {promo.website_url && (
                          <a
                            href={promo.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: 'var(--accent-white)',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              border: '1px solid var(--glass-border)'
                            }}
                          >
                            <Globe size={12} color="var(--accent-gold)" /> Web
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        🎁 {promo.promotions_given || 0} promociones dadas
                      </span>
                      <button 
                        onClick={() => navigate('/aliados')}
                        style={{ 
                          backgroundColor: 'rgba(212,175,55,0.15)', 
                          color: 'var(--accent-gold)', 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          fontSize: '0.72rem', 
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(212,175,55,0.3)',
                          cursor: 'pointer'
                        }}
                      >
                        <MapPin size={12} /> Ubicar
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate('/aliados')}
          style={{ 
            width: '100%', 
            marginTop: '1.2rem', 
            padding: '1rem', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--glass-border)', 
            color: '#FFF', 
            fontSize: '0.9rem', 
            fontWeight: 700,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            cursor: 'pointer' 
          }}
        >
          VER TODOS LOS ALIADOS ({totalAlliesCount}) <ChevronRight size={16} />
        </button>
      </section>

      {/* ── Nuevos Aliados Destacados ── */}
      {newAllies.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ADE80', boxShadow: '0 0 10px #4ADE80', flexShrink: 0 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nuevos Aliados esta semana</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {newAllies.map((ally: any) => {
              const IconComponent = getCategoryIcon(ally.category);
              return (
                <motion.div
                  key={ally.id}
                  className="glass"
                  style={{
                    padding: '1rem 1.2rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(74,222,128,0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ backgroundColor: 'rgba(74,222,128,0.1)', padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
                      <IconComponent size={18} color="#4ADE80" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ally.name}</div>
                      <div className="gold-text" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ally.discount}</div>
                    </div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '4px 8px', borderRadius: '6px', fontSize: '0.62rem', fontWeight: 800, flexShrink: 0 }}>
                    NUEVO
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================
          SECCIÓN 5: IDENTIDAD / PROPÓSITO (RED IDENTIDAD COMO RESPALDO)
         ========================================================= */}
      <section className="glass" style={{
        padding: '1.8rem 1.5rem',
        borderRadius: '26px',
        marginBottom: '3.5rem',
        border: '1px solid rgba(212,175,55,0.25)',
        background: 'linear-gradient(135deg, rgba(25,25,30,0.9) 0%, rgba(15,15,20,0.95) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <BrandLogo size="medium" showSlogan={false} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.6rem' }}>
          La Red Comunitaria que Conecta a Campeche
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '440px', margin: '0 auto 1.2rem' }}>
          <strong>Red Identidad</strong> es la plataforma tecnológica y comunitaria que impulsa nuestra economía local. Conectamos personas, comercios independientes y talento regional alrededor del orgullo campechano.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '1.2rem' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.9rem', borderRadius: '14px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
            <Award size={20} color="var(--accent-gold)" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>Respaldo Digital</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Validación QR Segura</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.9rem', borderRadius: '14px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
            <Building2 size={20} color="var(--accent-gold)" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>Red Comercial</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Comercio Local Unido</div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 6: COMUNIDAD (CAMPECHANOS QUE YA LO LLEVAN)
         ========================================================= */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '0.6rem' }}>
            <Heart size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Nuestra Comunidad
            </span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            CAMPECHANOS QUE YA LO LLEVAN
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: '420px', margin: '0 auto' }}>
            Personas reales que forman parte de este movimiento y portan su distintivo con orgullo.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {communityShowcase.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="glass"
              style={{
                padding: '1.2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(135deg, rgba(30,30,30,0.6) 0%, rgba(20,20,20,0.8) 100%)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    backgroundColor: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: 'var(--accent-gold)', fontSize: '0.9rem'
                  }}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>📍 {item.location}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(212,175,55,0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(212,175,55,0.3)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  {item.tag}
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#E0E0E0', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{item.quote}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Botón para subir foto del coche/compu/celular */}
        <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadPhotoModal(true)}
            style={{
              width: '100%',
              padding: '1rem 1.2rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(212,175,55,0.15)',
              border: '1.5px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Camera size={18} /> ¿Ya pegaste tu distintivo? ¡Sube tu foto aquí! 📸
          </motion.button>
        </div>
      </section>

      {/* ── Galería / Álbum Showcase ── */}
      <section className="glass premium-glow-gold" style={{ 
        padding: '1.5rem', 
        borderRadius: '24px', 
        marginBottom: '3.5rem',
        background: 'linear-gradient(135deg, rgba(30,30,30,0.85) 0%, rgba(20,20,20,0.95) 100%)',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <Sparkles color="var(--accent-gold)" size={20} />
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Galería y Simulador
          </span>
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Explora los Diseños Oficiales</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Visualiza las variantes en Negro y Blanco para automóvil o dispositivo personal con nuestro simulador interactivo.
        </p>
        <button 
          onClick={() => navigate('/galeria')}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '16px',
            backgroundColor: 'var(--accent-white)',
            color: '#121212',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
        >
          Explorar Galería <ChevronRight size={18} />
        </button>
      </section>

      {/* =========================================================
          SECCIÓN SEPARADA: PUNTOS DE VENTA FÍSICOS
         ========================================================= */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '0.6rem' }}>
            <Store size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Venta Presencial Directa
            </span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            PUNTOS DE VENTA FÍSICOS
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: '420px', margin: '0 auto' }}>
            Adquiere tu distintivo oficial de $90 MXN de forma presencial e inmediata en los siguientes puntos oficiales:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
          {officialStores.map((store, idx) => (
            <div key={idx} className="glass" style={{ padding: '1.2rem', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)', backgroundColor: 'rgba(20,20,22,0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>📍 {store.city}</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address} Campeche`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ fontSize: '0.75rem', color: '#4285F4', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Navigation size={12} /> Ver en Maps ↗
                  </a>
                  <a href={`https://wa.me/52${store.phone}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>WhatsApp</a>
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '0.2rem' }}>{store.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0 }}>{store.address}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECCIÓN ACCORDION FAQ: PREGUNTAS FRECUENTES ACCESIBLES
         ========================================================= */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            PREGUNTAS FRECUENTES
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: '420px', margin: '0 auto' }}>
            Resuelve tus dudas sobre tu distintivo físico y tus beneficios digitales.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {faqItems.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.2rem',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--accent-gold)" /> : <ChevronDown size={18} color="var(--text-dim)" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.2rem 1rem', fontSize: '0.86rem', color: 'var(--text-dim)', lineHeight: 1.55 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 7: CIERRE EMOCIONAL DE PÁGINA (CONVERSIÓN)
         ========================================================= */}
      <section style={{ textAlign: 'center', padding: '1rem 0 3rem' }}>
        <div className="glass premium-glow-gold" style={{
          padding: '2.5rem 1.5rem',
          borderRadius: '30px',
          border: '1px solid rgba(212,175,55,0.35)',
          background: 'linear-gradient(135deg, rgba(30,20,5,0.95) 0%, rgba(15,12,5,0.98) 100%)'
        }}>
          <Award size={38} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />

          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-gold)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
            ¿Y TÚ?
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#FFF', fontWeight: 600, marginBottom: '0.8rem' }}>
            Haz visible aquello que ya llevas dentro.
          </p>

          <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }} className="gold-text">
            CAMPECHANO SOY.
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowBuyModal(true)}
            style={{
              width: '100%',
              maxWidth: '340px',
              padding: '1.15rem 1.8rem',
              borderRadius: '18px',
              backgroundColor: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 900,
              fontSize: '1.05rem',
              border: 'none',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(212,175,55,0.45)',
              letterSpacing: '0.04em'
            }}
          >
            QUIERO MI DISTINTIVO <ChevronRight size={20} />
          </motion.button>
        </div>
      </section>

      {/* Modals preserved without changing any flow */}
      <BuyStickerModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} initialSticker={initialStickerSelection} />

      {user && showCardModal && (
        <MemberCardModal user={user} onClose={() => setShowCardModal(false)} />
      )}

      <RecoverPassModal isOpen={showRecoverModal} onClose={() => setShowRecoverModal(false)} />

      <UploadStickerPhotoModal isOpen={showUploadPhotoModal} onClose={() => setShowUploadPhotoModal(false)} />

      <SorteosPublicModal
        isOpen={showSorteosModal}
        onClose={() => setShowSorteosModal(false)}
        onBuySticker={() => setShowBuyModal(true)}
      />

    </div>
  );
};

export default Home;
