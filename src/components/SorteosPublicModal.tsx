import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Trophy, ChevronRight, ShieldCheck } from 'lucide-react';
import type { WinnerRecord } from './SorteosRuleta';

interface SorteosPublicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuySticker: () => void;
}

export const SorteosPublicModal: React.FC<SorteosPublicModalProps> = ({
  isOpen,
  onClose,
  onBuySticker
}) => {
  const [winners, setWinners] = useState<WinnerRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      try {
        const saved = localStorage.getItem('red_identidad_sorteos_history');
        if (saved) {
          setWinners(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Error al leer ganadores:', e);
      }

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 99998,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          boxSizing: 'border-box'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            backgroundColor: '#13131A',
            borderRadius: '24px',
            border: '1.5px solid rgba(212,175,55,0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: '#FFF'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.4rem 1.6rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(19,19,26,0.95) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212,175,55,0.2)',
                border: '1px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}>
                <Gift size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#FFF' }}>
                  Sorteos y Rifas Red Identidad
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Beneficio exclusivo para conductores y miembros con calcomanía.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#FFF',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body con Scroll */}
          <div style={{ padding: '1.4rem 1.6rem', overflowY: 'auto', flex: 1 }}>
            
            {/* Próximo Gran Premio */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(30,25,15,0.9) 100%)',
              border: '1.5px solid var(--accent-gold)',
              borderRadius: '18px',
              padding: '1.2rem',
              marginBottom: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                fontSize: '2.2rem',
                lineHeight: 1,
                padding: '0.5rem',
                backgroundColor: 'rgba(212,175,55,0.2)',
                borderRadius: '16px'
              }}>
                🎁
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.08em' }}>
                    Sorteo de la Red
                  </div>
                  <span style={{ backgroundColor: 'rgba(234,179,8,0.2)', color: '#FDE047', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    PRÓXIMAMENTE
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFF', marginTop: '3px' }}>
                  Sorteo Exclusivo de la Red Identidad
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Anunciaremos los premios y bases oficiales muy pronto. Todos los socios con calcomanía registrada participarán automáticamente.
                </div>
              </div>
            </div>

            {/* ¿Cómo participar? */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                ¿Cómo participar en los sorteos?
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--accent-gold)', fontWeight: 900, borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', flexShrink: 0 }}>
                    1
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                    <strong>Adquiere tu distintivo oficial ($90 MXN):</strong> Campechana (Blanca, Rosa, Negra), Campechano o Carmelita en cualquiera de los 5 puntos de venta o por WhatsApp.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--accent-gold)', fontWeight: 900, borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', flexShrink: 0 }}>
                    2
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                    <strong>Escanea y regístrate:</strong> Al escanear tu calcomanía por primera vez se asigna tu número permanente de socio (#0001...) con tu teléfono de contacto.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ backgroundColor: 'rgba(74,222,128,0.2)', color: '#4ADE80', fontWeight: 900, borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', flexShrink: 0 }}>
                    ✓
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                    <strong>¡Participas en automático de por vida!</strong> Cada mes giramos la ruleta oficial en vivo y contactamos al ganador directamente por WhatsApp.
                  </div>
                </div>
              </div>
            </div>

            {/* Ganadores Recientes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={14} /> Ganadores Anteriores Verificados
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Transparencia 100%</span>
              </div>

              {winners.length === 0 ? (
                <div style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  color: 'var(--text-dim)',
                  fontSize: '0.8rem'
                }}>
                  Los ganadores del próximo sorteo en vivo se publicarán aquí automáticamente. ¡Asegura tu calcomanía para participar!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {winners.slice(0, 5).map(w => (
                    <div
                      key={w.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          backgroundColor: 'rgba(212,175,55,0.2)',
                          color: 'var(--accent-gold)',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid rgba(212,175,55,0.4)'
                        }}>
                          #{String(w.member_number).padStart(3, '0')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFF' }}>
                            {w.prize}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {w.level} • {w.date}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Entregado
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer CTA */}
          <div style={{
            padding: '1.2rem 1.6rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              ¿Aún no tienes tu distintivo?
            </div>
            <button
              onClick={() => {
                onClose();
                onBuySticker();
              }}
              style={{
                padding: '0.85rem 1.4rem',
                borderRadius: '14px',
                backgroundColor: 'var(--accent-gold)',
                color: '#121212',
                fontWeight: 900,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 20px rgba(212,175,55,0.35)'
              }}
            >
              Comprar Mi Calcomanía ($90 MXN) <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default SorteosPublicModal;
