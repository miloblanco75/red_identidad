import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, Phone, User, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { requestTrialPass } from '../lib/trialService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TrialPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyFullPass?: () => void;
}

export const TrialPassModal: React.FC<TrialPassModalProps> = ({
  isOpen,
  onClose,
  onBuyFullPass
}) => {
  const { loginLocal } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setAlreadyUsed(false);

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMsg('Por favor ingresa un número de WhatsApp a 10 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestTrialPass(name, cleanDigits);

      if (res.success && res.pass) {
        // Iniciar sesión temporal en AuthContext
        loginLocal({
          phone: res.pass.phone,
          member_number: res.pass.member_number,
          level: 'trial',
          code: res.pass.code
        });

        setSuccess(true);
        setTimeout(() => {
          onClose();
          navigate('/registro');
        }, 1600);
      } else {
        setErrorMsg(res.error || 'No se pudo activar el pase de prueba.');
        if (res.alreadyUsed) {
          setAlreadyUsed(true);
        }
      }
    } catch (err: any) {
      setErrorMsg('Ocurrió un inconveniente al activar tu prueba. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.2rem'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="glass"
          style={{
            width: '100%',
            maxWidth: '430px',
            borderRadius: '26px',
            border: '2px solid rgba(74, 222, 128, 0.4)',
            background: 'linear-gradient(145deg, rgba(20,30,25,0.96) 0%, rgba(10,15,12,0.98) 100%)',
            padding: '1.8rem 1.4rem',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(74, 222, 128, 0.2)'
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {success ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(74,222,128,0.2)',
                  border: '2px solid #4ADE80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                  boxShadow: '0 0 30px rgba(74,222,128,0.5)'
                }}
              >
                <CheckCircle2 size={40} color="#4ADE80" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', marginBottom: '0.4rem' }}>
                ¡Pase de Cortesía Activado!
              </h3>
              <p style={{ color: '#86EFAC', fontSize: '0.85rem', lineHeight: 1.4, margin: '0 0 1rem' }}>
                Tienes <strong>24 Horas</strong> para disfrutar de tu 1er descuento en cualquier negocio aliado. Abriendo tu credencial...
              </p>
            </div>
          ) : (
            <div>
              {/* Badge superior */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(74, 222, 128, 0.15)',
                  border: '1px solid #4ADE80',
                  color: '#4ADE80',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem'
                }}
              >
                <Clock size={14} /> Prueba Gratis por 24 Horas
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', margin: '0 0 0.4rem', lineHeight: 1.2 }}>
                Pase de Cortesía
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: '0 0 1.4rem', lineHeight: 1.45 }}>
                Queremos que compruebes que los descuentos funcionan de verdad. Obtén <strong>1 descuento gratis hoy</strong> en cualquier aliado sin costo y sin tarjetas.
              </p>

              {/* Beneficios clave de la prueba */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '0.9rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF', marginBottom: '6px' }}>
                  <ShieldCheck size={16} color="#4ADE80" />
                  <span><strong>1 Descuento Inmediato</strong> en el aliado que elijas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF', marginBottom: '6px' }}>
                  <Clock size={16} color="#4ADE80" />
                  <span>Vigencia de <strong>24 horas exactas</strong> desde este momento</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF' }}>
                  <Sparkles size={16} color="#D4AF37" />
                  <span>Sin compromiso: si te gusta, quédate con la oficial</span>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 700 }}>
                    Tu Nombre:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Ej: Carlos Mendoza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 0.8rem 0.8rem 2.4rem',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 700 }}>
                    Tu WhatsApp (10 dígitos):
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      placeholder="Ej: 9811234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      required
                      pattern="[0-9]{10}"
                      style={{
                        width: '100%',
                        padding: '0.8rem 0.8rem 0.8rem 2.4rem',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                    Solo 1 pase de cortesía por número de teléfono.
                  </span>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      color: '#FCA5A5',
                      backgroundColor: 'rgba(239,68,68,0.15)',
                      border: '1px solid #EF4444',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      fontSize: '0.78rem',
                      marginBottom: '1rem',
                      lineHeight: 1.35
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{errorMsg}</div>
                  </div>
                )}

                {alreadyUsed && onBuyFullPass && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBuyFullPass();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#121212',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '0.8rem'
                    }}
                  >
                    ⭐ Adquirir Membresía Oficial ($45 / $90)
                  </button>
                )}

                {!alreadyUsed && (
                  <button
                    type="submit"
                    disabled={loading || phone.length < 10 || !name.trim()}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '14px',
                      backgroundColor: (phone.length === 10 && name.trim()) ? '#22C55E' : 'rgba(255,255,255,0.1)',
                      color: '#121212',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: (phone.length === 10 && name.trim()) ? '0 0 25px rgba(34,197,94,0.4)' : 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    {loading ? 'Activando...' : 'Obtener Mi Pase de Cortesía Gratis'} <ArrowRight size={18} />
                  </button>
                )}
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrialPassModal;
