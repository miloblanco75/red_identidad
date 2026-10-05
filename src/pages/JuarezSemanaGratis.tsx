import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Clock, Phone, User, CheckCircle2, 
  ArrowRight, ShieldCheck, AlertCircle, ShoppingBag, 
  Store
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  requestJuarez7DayTrial, 
  getStoredJuarezTrialPass, 
  checkJuarezTrialValidity, 
  type JuarezTrialPassData 
} from '../lib/juarezTrialService';
import { useAuth } from '../contexts/AuthContext';
import { useCity } from '../contexts/CityContext';
import { BuyStickerModal } from '../components/BuyStickerModal';

export const JuarezSemanaGratis: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginLocal } = useAuth();
  const { setCity } = useCity();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [activePass, setActivePass] = useState<JuarezTrialPassData | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Asegurar que la ciudad sea juarez
  useEffect(() => {
    setCity('juarez');
    
    // Revisar si ya tiene un pase guardado en este dispositivo
    const stored = getStoredJuarezTrialPass();
    if (stored) {
      const validity = checkJuarezTrialValidity(stored);
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
      const res = await requestJuarez7DayTrial(name, cleanPhone, allyRef);

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
      background: 'radial-gradient(circle at top, rgba(220, 38, 38, 0.18) 0%, rgba(11, 11, 14, 1) 75%)'
    }}>
      {/* Contenedor Central */}
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Cabecera / Logotipo Oficial */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src="/juarez_conecta.png" 
            alt="Juárez Conecta Oficial" 
            style={{ 
              height: '70px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3)) drop-shadow(0 4px 20px rgba(220,38,38,0.5))',
              marginBottom: '0.8rem'
            }} 
          />
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#FF6B6B',
            padding: '4px 14px',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <Sparkles size={14} /> Semana de Lanzamiento • 7 Días Gratis
          </div>
        </div>

        {/* ── CASO 1: YA EXSPIRÓ SU PRUEBA DE 7 DÍAS ── */}
        {isExpired ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{
              padding: '2rem 1.5rem',
              borderRadius: '24px',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              backgroundColor: 'rgba(20, 20, 26, 0.95)',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem'
            }}>
              <ShoppingBag size={32} color="var(--accent-gold)" />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', marginBottom: '0.5rem' }}>
              Tu Membresía Gratuita ha Concluido
            </h2>

            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Esperamos que hayas disfrutado tus descuentos en los comercios aliados de Ciudad Juárez.
              <br /><br />
              Para seguir disfrutando de <strong>descuentos ilimitados todo el año</strong>, adquiere hoy tu <strong>Membresía Digital Oficial Juárez Conecta</strong>.
            </p>

            <div style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
                Membresía Digital Juárez Conecta
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF', margin: '4px 0' }}>
                $80 <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>MXN</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#E2E8F0' }}>
                Pago único anual • Activación inmediata de tu Pase QR definitivo
              </div>
            </div>

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
                boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)',
                marginBottom: '0.8rem'
              }}
            >
              <ShoppingBag size={20} />
              <span>Adquirir Mi Membresía por $80 MXN</span>
            </button>

            <button
              onClick={() => navigate('/app?city=juarez')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Explorar comercios aliados en Juárez →
            </button>
          </motion.div>
        ) : activePass ? (
          /* ── CASO 2: PASE ACTIVO (MOSTRAR QR Y VIGENCIA) ── */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{
              padding: '1.8rem 1.4rem',
              borderRadius: '24px',
              border: '2px solid rgba(74, 222, 128, 0.4)',
              backgroundColor: 'rgba(18, 22, 20, 0.96)',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(74, 222, 128, 0.15)'
            }}
          >
            {/* Indicador de Vigencia 7 Días */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid #4ADE80',
              color: '#4ADE80',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>
              <Clock size={16} />
              <span>
                {activePass.remainingDays > 0 
                  ? `Vigente: Te quedan ${activePass.remainingDays} días` 
                  : `Vence hoy en ${activePass.remainingHours} horas`}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFF', margin: '0 0 0.3rem' }}>
              ¡Membresía Digital Activa!
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: '0 0 1.2rem' }}>
              Presenta este código en caja al comprar en cualquier comercio aliado de Ciudad Juárez.
            </p>

            {/* Tarjeta del Código QR */}
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '1.2rem',
              borderRadius: '18px',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              marginBottom: '1rem'
            }}>
              <QRCodeSVG 
                value={`https://redidentidad.vercel.app/registro?c=${activePass.code}&city=juarez`}
                size={200}
                level="H"
                imageSettings={{
                  src: '/juarez_conecta.png',
                  height: 44,
                  width: 80,
                  excavate: true
                }}
              />
            </div>

            <div style={{
              fontSize: '0.9rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              color: 'var(--accent-gold)',
              marginBottom: '1.2rem'
            }}>
              {activePass.code}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.8rem',
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: '14px',
              padding: '0.9rem',
              textAlign: 'left',
              marginBottom: '1.4rem',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', display: 'block' }}>Titular:</span>
                <strong style={{ color: '#FFF' }}>{activePass.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', display: 'block' }}>Celular:</span>
                <strong style={{ color: '#FFF' }}>•••• {activePass.phone.slice(-4)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <button
                onClick={() => navigate('/registro?city=juarez')}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  backgroundColor: '#22C55E',
                  color: '#121212',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Ver Mi Credencial Completa</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/aliados?city=juarez')}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Store size={16} color="var(--accent-gold)" />
                <span>Ver Comercios Aliados con Descuentos</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── CASO 3: FORMULARIO DE ACTIVACIÓN GRATIS ── */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{
              padding: '2rem 1.6rem',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(18, 18, 22, 0.95)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}
          >
            <h1 style={{ 
              fontSize: '1.65rem', 
              fontWeight: 900, 
              color: '#FFF', 
              textAlign: 'center', 
              margin: '0 0 0.5rem', 
              lineHeight: 1.2 
            }}>
              Tu Membresía Digital Gratis
            </h1>
            
            <p style={{ 
              color: 'var(--text-dim)', 
              fontSize: '0.88rem', 
              textAlign: 'center', 
              lineHeight: 1.45, 
              margin: '0 0 1.5rem' 
            }}>
              Cortesía exclusiva en mostrador de comercios aliados. Disfruta de beneficios y descuentos directos durante <strong>7 días completos</strong>.
            </p>

            {/* Ventajas destacadas */}
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFF', marginBottom: '8px' }}>
                <CheckCircle2 size={16} color="#4ADE80" />
                <span><strong>Descuentos directos de hasta 15%</strong> en restaurantes y negocios</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFF', marginBottom: '8px' }}>
                <Clock size={16} color="#4ADE80" />
                <span>Válido por <strong>7 días completos</strong> desde este momento</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFF' }}>
                <ShieldCheck size={16} color="var(--accent-gold)" />
                <span><strong>Sin tarjeta bancaria</strong> • Activación por número de celular</span>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 800 }}>
                  Tu Nombre o Apodo:
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Ej: Sofía Martínez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 0.85rem 0.85rem 2.6rem',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '14px',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 800 }}>
                  Tu Número de Celular o WhatsApp (10 dígitos):
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Ej: 6561234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    pattern="[0-9]{10}"
                    style={{
                      width: '100%',
                      padding: '0.85rem 0.85rem 0.85rem 2.6rem',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '14px',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '5px', display: 'block' }}>
                  * Solo 1 membresía gratuita de 7 días por número de celular.
                </span>
              </div>

              {errorMsg && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  color: '#FCA5A5',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '0.8rem',
                  marginBottom: '1.2rem',
                  lineHeight: 1.4
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{errorMsg}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || phone.length < 10 || !name.trim()}
                style={{
                  width: '100%',
                  padding: '1.05rem',
                  borderRadius: '16px',
                  backgroundColor: (phone.length === 10 && name.trim()) ? '#DC2626' : 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: (phone.length === 10 && name.trim()) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: (phone.length === 10 && name.trim()) ? '0 8px 30px rgba(220, 38, 38, 0.5)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? 'Activando...' : 'Obtener Mi Membresía de 7 Días'} 
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6B7280', fontSize: '0.78rem' }}>
          Iniciativa de orgullo y comercio local en Ciudad Juárez, Chih.
          <br />
          <button 
            onClick={() => navigate('/juarez')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--accent-gold)', 
              fontSize: '0.78rem', 
              cursor: 'pointer',
              marginTop: '6px',
              textDecoration: 'underline'
            }}
          >
            Conocer la Red de Aliados Juárez Conecta →
          </button>
        </div>

      </div>

      {/* Modal de compra en caso de querer membresía anual oficial */}
      <BuyStickerModal 
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        initialSticker="juarense_oficial"
      />
    </div>
  );
};

export default JuarezSemanaGratis;
