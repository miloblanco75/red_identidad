import React, { useState } from 'react';
import { X, Search, CheckCircle2, ShieldAlert, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface RecoverPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecoverPassModal: React.FC<RecoverPassModalProps> = ({ isOpen, onClose }) => {
  const { recoverSession } = useAuth();
  const [inputVal, setInputVal] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setIsSearching(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const ok = await recoverSession(inputVal);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setErrorMsg('No encontramos una membresía activa vinculada a esos datos. Revisa tu número de WhatsApp o código.');
      }
    } catch (err: any) {
      setErrorMsg('Error al consultar. Intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '28px',
          padding: '2rem 1.5rem',
          position: 'relative',
          border: '1px solid rgba(212,175,55,0.3)',
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#FFF',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          width: 60,
          height: 60,
          borderRadius: '20px',
          backgroundColor: 'rgba(212,175,55,0.12)',
          border: '1px solid rgba(212,175,55,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <Sparkles size={28} color="var(--accent-gold)" />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.4rem' }}>
          Sincronizar mi Pase
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Ingresa tu número de <strong>WhatsApp</strong> o tu <strong>Código</strong> (ej: RED-0001) para recuperar tu carné digital en este dispositivo.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
              Teléfono de WhatsApp o Código
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ej. 9811234567 o RED-0001"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: '#FFF',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {errorMsg && (
            <div style={{ color: '#ff4444', fontSize: '0.82rem', marginBottom: '1.2rem', padding: '0.8rem 1rem', backgroundColor: 'rgba(255,0,0,0.08)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center', textAlign: 'left' }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} /> {errorMsg}
            </div>
          )}

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  backgroundColor: 'rgba(74,222,128,0.12)',
                  border: '1px solid #4ADE80',
                  color: '#4ADE80',
                  borderRadius: '14px',
                  padding: '1rem',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={20} /> ¡Pase Sincronizado con Éxito!
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSearching || success}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              backgroundColor: isSearching ? 'rgba(255,255,255,0.1)' : 'var(--accent-gold)',
              color: isSearching ? '#FFF' : '#121212',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: isSearching ? 'not-allowed' : 'pointer',
            }}
          >
            {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={18} />}
            {isSearching ? 'Buscando tu pase...' : 'Buscar y Sincronizar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
