import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Clock, Phone, User, CheckCircle2, 
  ArrowRight, AlertCircle, Store, 
  Utensils, Car, Smartphone, Gift, ShieldCheck, 
  ChevronDown, Heart, Award, MapPin
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  requestCampeche7DayTrial, 
  getStoredCampecheTrialPass, 
  checkCampecheTrialValidity, 
  type CampecheTrialPassData 
} from '../lib/campecheTrialService';
import { useAuth } from '../contexts/AuthContext';
import { useCity } from '../contexts/CityContext';
import { BuyStickerModal } from '../components/BuyStickerModal';

export const CampecheSemanaGratis: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginLocal } = useAuth();
  const { setCity } = useCity();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [activePass, setActivePass] = useState<CampecheTrialPassData | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  // Asegurar que la ciudad sea campeche
  useEffect(() => {
    setCity('campeche');
    
    // Revisar si ya tiene un pase guardado en este dispositivo
    const stored = getStoredCampecheTrialPass();
    if (stored) {
      const validity = checkCampecheTrialValidity(stored);
      if (validity.isExpired) {
        setIsExpired(true);
      } else if (validity.active) {
        setActivePass(stored);
      }
    }
  }, [setCity]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsExpired(false);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Ingresa tu número de WhatsApp o celular a 10 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const allyRef = searchParams.get('ally') || searchParams.get('ref') || undefined;
      const res = await requestCampeche7DayTrial(name, cleanPhone, allyRef);

      if (res.success && res.pass) {
        setActivePass(res.pass);
        loginLocal({
          phone: res.pass.phone,
          member_number: 0,
          level: 'trial_7d',
          code: res.pass.code
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (res.isExpired) {
          setIsExpired(true);
        }
        setErrorMsg(res.error || 'No se pudo activar el pase. Intenta nuevamente.');
      }
    } catch (err: any) {
      setErrorMsg('Ocurrió un error al activar tu membresía. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Comercios aliados reales de Campeche
  const sampleAllies = [
    { 
      name: 'Palmare', 
      category: 'Restaurante & Bar de Playa', 
      discount: '2x1 en bebidas de la casa al atardecer (5:00 a 6:30 pm)', 
      highlight: '2x1 Atardecer',
      icon: Utensils, 
      color: '#F59E0B' 
    },
    { 
      name: 'Tacos Los Toños', 
      category: 'Taquería Tradicional', 
      discount: '2x1 en tacos al pastor (5:00 pm a 6:30 pm)', 
      highlight: '2x1 al Pastor',
      icon: Utensils, 
      color: '#EF4444' 
    },
    { 
      name: 'Taquería Tenoch', 
      category: 'Tacos & Antojos', 
      discount: '15% de descuento en consumo total', 
      highlight: '15% OFF Total',
      icon: Store, 
      color: '#EAB308' 
    },
    { 
      name: 'Café con Pan', 
      category: 'Cafetería & Panadería Artesanal', 
      discount: 'Café americano gratis en la compra de cualquier pan', 
      highlight: 'Café Gratis',
      icon: Utensils, 
      color: '#D97706' 
    },
    { 
      name: 'Olivina', 
      category: 'Cocina & Panadería', 
      discount: 'Café americano gratis en compra de focaccia (Lun-Jue)', 
      highlight: 'Café Gratis',
      icon: Sparkles, 
      color: '#10B981' 
    },
    { 
      name: 'Clínica Veterinaria Ceballos', 
      category: 'Salud Animal & Estética Canina', 
      discount: 'Descuento especial en consultas y estética', 
      highlight: 'Precio Socio',
      icon: Heart, 
      color: '#38BDF8' 
    },
    { 
      name: 'Printmix', 
      category: 'Imprenta Digital & The Gift Bar', 
      discount: '15% al contratar The Gift Bar Live Experience', 
      highlight: '15% OFF',
      icon: Award, 
      color: '#8B5CF6' 
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0B0E',
      color: '#F5F5F7',
      fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
      padding: '1.2rem 1rem 6rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'radial-gradient(circle at top, rgba(212, 175, 55, 0.18) 0%, rgba(11, 11, 14, 1) 70%)'
    }}>
      {/* Contenedor Central Adaptable a Móvil */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto'
      }}>

        {/* ── LOGO OFICIAL RED IDENTIDAD CAMPECHE ── */}
        <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
          <img 
            src="/logo.png" 
            alt="Red Identidad Campeche" 
            style={{ 
              height: '56px', 
              width: 'auto', 
              margin: '0 auto', 
              display: 'block',
              filter: 'drop-shadow(0 4px 15px rgba(212, 175, 55, 0.35))'
            }} 
          />
        </div>

        {/* ═════════════════════════════════════════════════════════════
            ESTADO A: PASE ACTIVO (YA LO TIENE Y PUEDE DISFRUTARLO)
           ═════════════════════════════════════════════════════════════ */}
        {activePass && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass"
            style={{
              padding: '1.8rem',
              borderRadius: '24px',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              backgroundColor: 'rgba(20, 20, 24, 0.95)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
              textAlign: 'center',
              marginBottom: '2rem'
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22C55E',
              color: '#4ADE80',
              padding: '5px 14px',
              borderRadius: '100px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={15} /> ¡YA LA TRAES! • Membresía Activa
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', marginBottom: '0.4rem' }}>
              ¡Bienvenido, {activePass.name}!
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.45, marginBottom: '1.2rem' }}>
              Muestra este código QR en cualquiera de los comercios y restaurantes aliados de Campeche para recibir tus descuentos directos.
            </p>

            {/* Código QR del Pase de Cortesía de Campeche */}
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '1.2rem',
              borderRadius: '20px',
              display: 'inline-block',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              border: '3px solid var(--accent-gold)',
              marginBottom: '1rem'
            }}>
              <QRCodeSVG 
                value={`https://redidentidad.vercel.app/registro?c=${activePass.code}&city=campeche`}
                size={210}
                level="H"
                imageSettings={{
                  src: '/logo.png',
                  height: 44,
                  width: 85,
                  excavate: true
                }}
              />
            </div>

            <div style={{
              fontSize: '1.1rem',
              fontWeight: 900,
              color: 'var(--accent-gold)',
              letterSpacing: '0.08em',
              marginBottom: '1.2rem'
            }}>
              {activePass.code}
            </div>

            {/* Contador de Vigencia */}
            <div style={{
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '14px',
              padding: '0.9rem',
              marginBottom: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Clock size={18} color="var(--accent-gold)" />
              <span style={{ fontSize: '0.84rem', color: '#F1F5F9', fontWeight: 600 }}>
                {(() => {
                  const validity = checkCampecheTrialValidity(activePass);
                  if (validity.isExpired) return 'Tu pase de cortesía de 7 días ha expirado.';
                  return `Te quedan ${validity.remainingDays} días y ${validity.remainingHours} horas de prueba`;
                })()}
              </span>
            </div>

            {/* Acciones para el socio activo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                onClick={() => navigate('/aliados')}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)'
                }}
              >
                <Store size={18} />
                <span>Ver Comercios Aliados en Campeche</span>
              </button>

              <button
                onClick={() => navigate('/app')}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
              >
                Abrir App de Miembros
              </button>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            ESTADO B: NUEVO USUARIO (FLUJO COMPLETO EN 3 ACTOS)
           ═════════════════════════════════════════════════════════════ */}
        {!activePass && !isExpired && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

            {/* ─────────────────────────────────────────────────────────
                ACTO 1: LA REVELACIÓN (RESOLVER EL MISTERIO CALLEJERO)
               ───────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass"
              style={{
                padding: '2rem 1.6rem 1.8rem',
                borderRadius: '24px',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                backgroundColor: 'rgba(18, 18, 22, 0.92)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Franja decorativa superior dorada */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #D4AF37 0%, #FFF 50%, #D4AF37 100%)'
              }} />

              {/* Badge de Revelación */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(212, 175, 55, 0.18)',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                padding: '5px 16px',
                borderRadius: '100px',
                fontSize: '0.76rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem'
              }}>
                <Sparkles size={14} /> MISTERIO RESUELTO • CAMPECHE
              </div>

              {/* Titular Principal */}
              <h1 style={{
                fontSize: '2.1rem',
                fontWeight: 950,
                lineHeight: 1.12,
                color: '#FFF',
                margin: '0 0 0.6rem',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase'
              }}>
                ¿YA LA TRAES? <br />
                <span style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ¡AHORA SÍ!
                </span>
              </h1>

              <p style={{
                fontSize: '0.92rem',
                color: '#E2E8F0',
                lineHeight: 1.5,
                margin: '0 auto 1.4rem',
                maxWidth: '430px'
              }}>
                Acabas de escanear la llave oficial para <strong>ahorrar dinero real todos los días</strong> en tus restaurantes, cafés, salidas y servicios favoritos en Campeche.
              </p>

              {/* Botón Rápido de Salto */}
              <button
                onClick={scrollToForm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span>🎁 Reclamar Mis 7 Días Gratis</span>
                <ChevronDown size={18} />
              </button>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────
                ACTO 2: LOS BENEFICIOS REALES DE RED IDENTIDAD
               ───────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass"
              style={{
                padding: '1.8rem 1.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(16, 16, 20, 0.85)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  ¿QUÉ ES RED IDENTIDAD?
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFF', margin: '4px 0 6px' }}>
                  Una sola membresía digital. Descuentos en toda la ciudad.
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: 0, lineHeight: 1.45 }}>
                  Sin bancos, sin tarjetas de crédito y sin trucos. Muestras tu distintivo en tu celular al pedir la cuenta y te descuentan de inmediato.
                </p>
              </div>

              {/* Grid de 4 Beneficios Tangibles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.8rem' }}>
                
                {/* Beneficio 1: Comida y Bebida */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: '#F59E0B',
                    flexShrink: 0
                  }}>
                    <Utensils size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF', marginBottom: '2px' }}>
                      10% a 20% en Restaurantes y Cafés
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                      Tu café matutino, la comida familiar del fin de semana o los tacos en la noche te salen más baratos siempre.
                    </div>
                  </div>
                </div>

                {/* Beneficio 2: Servicios y Rutina */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.18)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: '#38BDF8',
                    flexShrink: 0
                  }}>
                    <Car size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF', marginBottom: '2px' }}>
                      Ahorra en tus Servicios del Mes
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                      Descuentos en lavados de autos, barberías, gimnasios, clínicas de salud, refaccionarias y boutiques aliadas.
                    </div>
                  </div>
                </div>

                {/* Beneficio 3: 100% Digital */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(74, 222, 128, 0.18)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: '#4ADE80',
                    flexShrink: 0
                  }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF', marginBottom: '2px' }}>
                      100% en tu Celular
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                      Cero plásticos estorbosos en la cartera. Tu distintivo vive en tu teléfono y funciona al instante en caja.
                    </div>
                  </div>
                </div>

                {/* Beneficio 4: 7 Días de Cortesía */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(212, 175, 55, 0.35)'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: 'var(--accent-gold)',
                    flexShrink: 0
                  }}>
                    <Gift size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.94rem', color: '#FFD700', marginBottom: '2px' }}>
                      Semana VIP de Cortesía (100% Gratis)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.4 }}>
                      Por escanear el código callejero recibes <strong>7 días completos</strong> de acceso total sin costo para que compruebes cuánto ahorras.
                    </div>
                  </div>
                </div>
              </div>

              {/* Escaparate de Comercios Aliados en Campeche */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="var(--accent-gold)" /> Dónde puedes ahorrar hoy:
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    Campeche y Carmen
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {sampleAllies.map((ally, idx) => {
                    const IconComp = ally.icon;
                    return (
                      <div 
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
                          <div style={{
                            backgroundColor: `${ally.color}22`,
                            color: ally.color,
                            borderRadius: '12px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <IconComp size={18} />
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#FFF' }}>
                                {ally.name}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                                • {ally.category}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#CBD5E1', marginTop: '2px', lineHeight: 1.3 }}>
                              {ally.discount}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.15)',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          borderRadius: '8px',
                          padding: '4px 9px',
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          color: '#FFD700',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {ally.highlight}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.74rem', color: '#64748B' }}>
                  + decenas de restaurantes, cafeterías y comercios en constante crecimiento.
                </div>
              </div>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────
                ACTO 3: EL REGISTRO EXPRESS (DESBLOQUEO DE 7 DÍAS)
               ───────────────────────────────────────────────────────── */}
            <div ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="glass"
                style={{
                  padding: '2rem 1.6rem',
                  borderRadius: '24px',
                  border: '2px solid rgba(212, 175, 55, 0.5)',
                  backgroundColor: 'rgba(18, 18, 24, 0.96)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                  position: 'relative'
                }}
              >
                {/* Badge de Recompensa */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(74, 222, 128, 0.15)',
                    border: '1px solid #4ADE80',
                    color: '#4ADE80',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    fontSize: '0.74rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    <Gift size={14} /> ACTIVACIÓN INMEDIATA EN 10 SEGUNDOS
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.65rem',
                  fontWeight: 950,
                  lineHeight: 1.2,
                  color: '#FFF',
                  textAlign: 'center',
                  margin: '0 0 0.4rem',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase'
                }}>
                  ACTIVA TUS 7 DÍAS <span style={{ color: 'var(--accent-gold)' }}>GRATIS</span>
                </h3>

                <p style={{
                  fontSize: '0.84rem',
                  color: '#94A3B8',
                  textAlign: 'center',
                  lineHeight: 1.45,
                  margin: '0 0 1.6rem'
                }}>
                  Solo ingresa tu nombre y celular para generar tu distintivo digital. Sin tarjetas bancarias ni cobros ocultos.
                </p>

                {/* Comercio que lo refiere (si viene de QR personalizado) */}
                {searchParams.get('ally') && (
                  <div style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.9rem',
                    marginBottom: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: '#FFF'
                  }}>
                    <Store size={16} color="var(--accent-gold)" />
                    <span>Cortesía especial en: <strong>{searchParams.get('ally')}</strong></span>
                  </div>
                )}

                {errorMsg && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #EF4444',
                    color: '#FCA5A5',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    marginBottom: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                      Tu Nombre Completo
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Roberto Sánchez"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem 0.85rem 2.8rem',
                          borderRadius: '14px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#FFF',
                          fontSize: '0.92rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                      Número de WhatsApp o Celular (10 dígitos)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="tel"
                        required
                        maxLength={14}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="981 123 4567"
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem 0.85rem 2.8rem',
                          borderRadius: '14px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#FFF',
                          fontSize: '0.92rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} color="#4ADE80" /> 100% Privado. Cero spam. Sirve como tu folio único de socio.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '1.05rem',
                      borderRadius: '16px',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#121212',
                      fontWeight: 900,
                      fontSize: '1rem',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(212, 175, 55, 0.45)',
                      marginTop: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{loading ? 'Generando tu pase...' : '🎁 Activar Mis 7 Días de Descuentos'}</span>
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </form>

                <div style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.72rem', color: '#64748B', lineHeight: 1.4 }}>
                  Válido por 7 días a partir del registro. 1 pase por número telefónico. Disfruta de la red de comercios aliados en Campeche.
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            ESTADO C: PASE EXPIRADO (INVITACIÓN A MEMBRESÍA COMPLETA)
           ═════════════════════════════════════════════════════════════ */}
        {isExpired && !activePass && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass"
            style={{
              padding: '2rem 1.8rem',
              borderRadius: '24px',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(20, 20, 24, 0.95)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem',
              color: '#EF4444'
            }}>
              <Clock size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', marginBottom: '0.5rem' }}>
              Tu Pase de Cortesía de 7 Días ha Concluido
            </h2>

            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.8rem' }}>
              Esperamos que hayas disfrutado tus descuentos en Campeche. Para seguir ahorrando todo el año sin interrupciones, adquiere tu distintivo oficial permanente.
            </p>

            <button
              onClick={() => setShowBuyModal(true)}
              style={{
                width: '100%',
                padding: '1.05rem',
                borderRadius: '16px',
                backgroundColor: 'var(--accent-gold)',
                color: '#121212',
                fontWeight: 900,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)'
              }}
            >
              <span>Obtener Membresía Oficial ($90 MXN)</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          BARRA FLOTANTE FIJA AL PIE (STICKY CTA EN CELULAR)
         ───────────────────────────────────────────────────────────── */}
      {!activePass && !isExpired && (
        <div style={{
          position: 'fixed',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 24px)',
          maxWidth: '500px',
          zIndex: 90,
          backgroundColor: 'rgba(18, 18, 22, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '18px',
          padding: '10px 14px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#FFF', whiteSpace: 'nowrap' }}>
              🎁 Pase de Cortesía (7 Días)
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 700 }}>
              100% Gratis • Sin Tarjetas
            </div>
          </div>

          <button
            onClick={scrollToForm}
            style={{
              backgroundColor: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 900,
              fontSize: '0.84rem',
              padding: '0.65rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}
          >
            <span>Activar Ahora</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Modal de compra de membresía oficial si expira */}
      <BuyStickerModal 
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </div>
  );
};

export default CampecheSemanaGratis;
