import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Clock, Phone, User, CheckCircle2, 
  ArrowRight, AlertCircle, ShoppingBag, 
  Store
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0B0E',
      color: '#F5F5F7',
      fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
      padding: '1.5rem 1rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, rgba(212, 175, 55, 0.16) 0%, rgba(11, 11, 14, 1) 75%)'
    }}>
      {/* Contenedor Central */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        {/* Logotipo Oficial Red Identidad */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <img 
            src="/logo.png" 
            alt="Red Identidad Campeche" 
            style={{ 
              height: '62px', 
              width: 'auto', 
              margin: '0 auto', 
              display: 'block',
              filter: 'drop-shadow(0 4px 15px rgba(212, 175, 55, 0.35))'
            }} 
          />
        </div>

        {/* ── ESTADO A: PASE ACTIVO (YA TIENE 7 DÍAS EN VIGOR) ── */}
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
              textAlign: 'center'
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
              <CheckCircle2 size={15} /> Membresía Activa (7 Días Gratis)
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFF', marginBottom: '0.5rem' }}>
              ¡Bienvenido, {activePass.name}!
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.45, marginBottom: '1.2rem' }}>
              Muestra este código QR en cualquiera de los comercios y restaurantes aliados de Campeche para recibir hasta 15% de descuento directo.
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
              fontSize: '1rem',
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
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Clock size={20} color="var(--accent-gold)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tiempo de cortesía restante
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFF' }}>
                  {activePass.remainingDays > 0 
                    ? `${activePass.remainingDays} días y ${activePass.remainingHours} hrs`
                    : `${activePass.remainingHours} horas restantes`}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/aliados?city=campeche')}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)'
                }}
              >
                <Store size={18} />
                <span>Ver Comercios Aliados en Campeche</span>
              </button>

              <button
                onClick={() => navigate('/app?city=campeche')}
                style={{
                  width: '100%',
                  padding: '0.85rem',
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

        {/* ── ESTADO B: FORMULARIO DE REGISTRO INICIAL ── */}
        {!activePass && !isExpired && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass"
            style={{
              padding: '2rem 1.8rem',
              borderRadius: '24px',
              border: '1.5px solid rgba(212, 175, 55, 0.4)',
              backgroundColor: 'rgba(18, 18, 22, 0.95)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            {/* Badge de Campaña */}
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold)',
                padding: '4px 14px',
                borderRadius: '100px',
                fontSize: '0.74rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                <Sparkles size={14} /> Campaña Oficial Campeche
              </div>
            </div>

            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 950,
              lineHeight: 1.15,
              color: '#FFF',
              textAlign: 'center',
              margin: '0 0 0.5rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}>
              7 DÍAS DE MEMBRESÍA <span className="gold-text">GRATIS</span>
            </h1>

            <p style={{
              fontSize: '0.88rem',
              color: '#94A3B8',
              textAlign: 'center',
              lineHeight: 1.5,
              margin: '0 0 1.8rem'
            }}>
              Ingresa tu nombre y WhatsApp para activar de inmediato tu pase digital sin costo y comenzar a ahorrar en toda la red de Campeche.
            </p>

            {/* Comercio que lo refiere (si viene de QR en mesa / mostrador) */}
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
                <span>Cortesia ofrecida en: <strong>{searchParams.get('ally')}</strong></span>
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  Tu Nombre Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem 0.9rem 2.8rem',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#CBD5E1', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  Número de Celular o WhatsApp (10 dígitos)
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
                      padding: '0.9rem 1rem 0.9rem 2.8rem',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  🔒 No enviamos spam. Solo sirve como tu folio único de socio.
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
                  fontSize: '1.05rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
                  marginTop: '0.6rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{loading ? 'Activando...' : '🎁 Activar Mis 7 Días Gratis'}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
              Válido por 7 días naturales a partir del momento del escaneo. 1 activación por número telefónico.
            </div>
          </motion.div>
        )}

        {/* ── ESTADO C: MEMBRESÍA DE CORTESÍA VENCIDA ── */}
        {isExpired && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass"
            style={{
              padding: '2rem 1.8rem',
              borderRadius: '24px',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(20, 20, 24, 0.95)',
              textAlign: 'center'
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              color: '#F87171',
              padding: '4px 14px',
              borderRadius: '100px',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              Periodo Concluido
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', margin: '0 0 0.5rem' }}>
              Tu Periodo de Cortesía ha Terminado
            </h2>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Esperamos que hayas disfrutado tus descuentos en Campeche. Para continuar recibiendo hasta 15% de descuento en todos los comercios aliados, adquiere tu membresía oficial permanente.
            </p>

            <button
              onClick={() => setShowBuyModal(true)}
              style={{
                width: '100%',
                padding: '1rem',
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
                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.4)',
                marginBottom: '0.8rem'
              }}
            >
              <ShoppingBag size={18} />
              <span>Adquirir Membresía Oficial ($45 / $90 MXN)</span>
            </button>

            <button
              onClick={() => navigate('/app?city=campeche')}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '14px',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                fontWeight: 600,
                fontSize: '0.82rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ir a la App
            </button>
          </motion.div>
        )}
      </div>

      {showBuyModal && (
        <BuyStickerModal 
          isOpen={showBuyModal} 
          onClose={() => setShowBuyModal(false)}
          initialSticker="campechano_negra"
        />
      )}
    </div>
  );
};

export default CampecheSemanaGratis;
