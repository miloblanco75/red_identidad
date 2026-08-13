import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, Users, Sparkles, Utensils, Car, Wine, HeartPulse, Building2, MapPin, Loader2, Globe, ShoppingBag, QrCode, ArrowRight, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import BrandLogo from '../components/BrandLogo';
import { BuyStickerModal } from '../components/BuyStickerModal';
import { useAuth } from '../contexts/AuthContext';

const FacebookIcon = ({ size = 14, color = '#1877F2' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const mockPromotions = [
  {
    id: 'mock-1',
    name: 'Los Trompos Campeche',
    category: 'Comida',
    discount: '15% de Descuento en Consumo Total',
    visits: 120,
    isMock: true,
    facebook_url: 'https://facebook.com/lostrompos',
    website_url: 'https://lostrompos.com.mx'
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allies, setAllies] = useState<any[]>([]);
  const [newAllies, setNewAllies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    fetchAllies();
  }, []);

  const fetchAllies = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching allies for Home:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'gold': return 'VIP Dorado';
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
      case 'Servicios': return Zap;
      case 'Entretenimiento': return Wine;
      case 'Salud': return HeartPulse;
      default: return Building2;
    }
  };

  const displayPromotions = allies.length > 0 ? allies : mockPromotions;

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem' }}>

      {/* ── Saludo personalizado si ya tiene pase ── */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass"
          style={{
            marginTop: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem 1.2rem',
            borderRadius: '20px',
            border: '1px solid rgba(212,175,55,0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(30,30,30,0.85) 0%, rgba(20,15,5,0.9) 100%)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '3px' }}>👋 Bienvenido de regreso</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Miembro{' '}
              <span className="gold-text">#{String(user.member_number).padStart(4, '0')}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: getLevelColor(user.level), fontWeight: 600, marginTop: '3px' }}>
              ● Pase activo — {getLevelName(user.level)}
            </div>
          </div>
          <button
            onClick={() => navigate('/registro')}
            style={{
              backgroundColor: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: 'var(--accent-gold)',
              borderRadius: '12px',
              padding: '0.6rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Ver pase <ChevronRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Hero Section */}
      <section style={{ marginTop: user ? '0' : '1rem', marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <BrandLogo size="medium" showSlogan={true} />
        </div>

        <h2 style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Membresía Exclusiva
        </h2>
        <h1 style={{ fontSize: '2.2rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Un símbolo que <span className="gold-text">nos une</span>,<br />
          membresía local <span className="gold-text">inteligente</span>.
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          No compraste una calca, entraste a una red exclusiva. Red Identidad es pertenencia regional y acceso premium a los mejores comercios de Campeche y El Carmen.
        </p>
        
        <div className="glass" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
            <Users style={{ color: 'var(--accent-gold)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>1,248</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Campechanos y Carmelitas unidos</div>
          </div>
        </div>
      </section>

      {/* Allied Promotions Carousel */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Promociones de Aliados</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Beneficios y descuentos exclusivos</p>
          </div>
          <button 
            onClick={() => navigate('/aliados')}
            style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', fontWeight: 600 }}
          >
            Ver todos <ChevronRight size={14} />
          </button>
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
              paddingBottom: '0.5rem',
              paddingRight: '1rem',
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
                      padding: '1.2rem', 
                      borderRadius: '24px', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      border: '1px solid rgba(212,175,55,0.2)',
                      position: 'relative'
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                        <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '6px', borderRadius: '8px' }}>
                          <IconComponent size={14} color="var(--accent-gold)" />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {promo.category}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{promo.name}</h4>
                      <p className="gold-text" style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.8rem' }}>
                        {promo.discount}
                      </p>

                      {/* Social & Website Links */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {promo.facebook_url && (
                          <a
                            href={promo.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(24, 119, 242, 0.15)',
                              color: '#1877F2',
                              fontSize: '0.65rem',
                              fontWeight: 600,
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
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: 'var(--accent-white)',
                              fontSize: '0.65rem',
                              fontWeight: 600,
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
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          🎁 {promo.promotions_given || 0} promociones
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => navigate('/aliados')}
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.06)', 
                              color: '#FFF', 
                              padding: '5px 8px', 
                              borderRadius: '8px', 
                              fontSize: '0.7rem', 
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              border: '1px solid var(--glass-border)'
                            }}
                          >
                            <MapPin size={10} /> Ubicar
                          </button>
                          <button 
                            onClick={() => navigate('/registro')}
                            style={{ 
                              backgroundColor: 'rgba(212,175,55,0.15)', 
                              color: 'var(--accent-gold)', 
                              padding: '5px 10px', 
                              borderRadius: '8px', 
                              fontSize: '0.7rem', 
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              border: '1px solid rgba(212,175,55,0.3)'
                            }}
                          >
                            <CreditCard size={10} /> Ver Pase
                          </button>
                        </div>
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Nuevos aliados esta semana ── */}
      {newAllies.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ADE80', boxShadow: '0 0 10px #4ADE80', flexShrink: 0 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Nuevos en la Red esta semana</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {newAllies.map((ally: any) => {
              const IconComponent = getCategoryIcon(ally.category);
              return (
                <motion.div
                  key={ally.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass"
                  style={{
                    padding: '1rem 1.2rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(74,222,128,0.18)',
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
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ally.name}</div>
                      <div className="gold-text" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{ally.discount}</div>
                    </div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '3px 8px', borderRadius: '6px', fontSize: '0.62rem', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    🆕 NUEVO
                  </span>
                </motion.div>
              );
            })}
          </div>
          <button
            onClick={() => navigate('/aliados')}
            style={{ width: '100%', marginTop: '0.8rem', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
          >
            Ver todos los aliados <ChevronRight size={14} />
          </button>
        </section>
      )}

      {/* Stickers Gallery Showcase Banner */}
      <section className="glass premium-glow-gold" style={{ 
        padding: '1.5rem', 
        borderRadius: '24px', 
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(30,30,30,0.85) 0%, rgba(20,20,20,0.95) 100%)',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <Sparkles color="var(--accent-gold)" size={20} />
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Álbum de Identidad
          </span>
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Galería de Calcomanías</h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Explora los diseños oficiales en Negro, Blanco, Plata y Oro VIP. ¡Visualiza cómo lucen aplicadas en tu auto o celular con nuestro simulador interactivo!
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
            boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
          }}
        >
          Explorar Galería <ChevronRight size={18} />
        </button>
      </section>

      {/* Buy Sticker Section */}
      <section style={{ marginBottom: '3rem' }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowBuyModal(true)}
          style={{
            borderRadius: '28px',
            overflow: 'hidden',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #1a1204 0%, #2a1f05 40%, #1a1204 100%)',
            border: '1px solid rgba(212,175,55,0.4)',
            boxShadow: '0 0 40px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          {/* Top badge */}
          <div style={{
            background: 'linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37)',
            padding: '6px 0',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#121212', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              🏷 Calcomanía Oficial Red Identidad
            </span>
          </div>

          <div style={{ padding: '1.6rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShoppingBag size={24} color="#D4AF37" />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Compra en Línea</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>Tu Calcomanía,<br />tu acceso a la Red</h3>
              </div>
            </div>

            {/* Flow steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              {[
                { icon: ShoppingBag, label: 'Compras' },
                { icon: ArrowRight, label: null },
                { icon: QrCode, label: 'Escaneas QR' },
                { icon: ArrowRight, label: null },
                { icon: ShieldCheck, label: 'Accedes' }
              ].map((step, i) =>
                step.label ? (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '5px 9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <step.icon size={12} color="#D4AF37" />
                    <span style={{ fontSize: '0.7rem', color: '#FFF', fontWeight: 600 }}>{step.label}</span>
                  </div>
                ) : (
                  <step.icon key={i} size={12} color="rgba(212,175,55,0.5)" />
                )
              )}
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.4rem' }}>
              {[
                { icon: ShieldCheck, text: 'Vinil Premium de corte de precisión' },
                { icon: Zap, text: 'Acceso instantáneo a descuentos en aliados' },
                { icon: Sparkles, text: 'Ediciones: Negra, Blanca, Plata y Oro VIP' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon size={14} color="#D4AF37" />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Precio</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D4AF37', lineHeight: 1 }}>$90 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>MXN</span></div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#121212',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0.8rem 1.4rem',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.4)'
                }}
              >
                Comprar <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Buy Sticker Modal */}
      <BuyStickerModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />

      {/* Video Teaser */}
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Cómo aplicar correctamente</h3>
        <div className="glass" style={{ 
          height: '200px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent-white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid var(--accent-white)', marginLeft: '5px' }}></div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Ver tutorial de aplicación</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
