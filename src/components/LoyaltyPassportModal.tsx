import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, CheckCircle2, Lock, Gift, ExternalLink, Calendar, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMemberVisitsSummary, type LoyaltyConfig, type MemberVisitRecord } from '../lib/loyaltyService';

interface LoyaltyPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    code?: string;
    member_number?: number;
    phone?: string;
  };
}

export const LoyaltyPassportModal: React.FC<LoyaltyPassportModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const [summary, setSummary] = useState<{
    totalVisits: number;
    history: MemberVisitRecord[];
    config: LoyaltyConfig;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const data = getMemberVisitsSummary(user?.code, user?.member_number);
      setSummary(data);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, user]);

  if (!isOpen || !summary) return null;

  const { totalVisits, history, config } = summary;

  const milestones = [
    { ...config.milestone1, key: 'm1' },
    { ...config.milestone2, key: 'm2' },
    { ...config.milestone3, key: 'm3' }
  ];

  // Cálculo del porcentaje de la barra de progreso (hacia el hito 20)
  const progressPercent = Math.min(100, Math.round((totalVisits / config.milestone3.visits) * 100));

  // Próximo hito pendiente
  const nextPendingMilestone = milestones.find(m => totalVisits < m.visits);

  const handleClaimReward = (milestone: typeof milestones[0]) => {
    const memberId = user?.code || (user?.member_number ? `#${String(user.member_number).padStart(4, '0')}` : 'Socio');
    const text = encodeURIComponent(
      `¡Hola Red Identidad Campeche! 🎉 He alcanzado ${totalVisits} visitas en comercios aliados con mi membresía ${memberId} y quiero reclamar mi recompensa: "${milestone.reward}".`
    );
    window.open(`https://wa.me/529811385474?text=${text}`, '_blank');
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 999999,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          borderRadius: '28px',
          padding: '1.8rem 1.4rem',
          position: 'relative',
          border: '1.5px solid rgba(212,175,55,0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.25)',
          color: '#FFF',
          boxSizing: 'border-box',
          margin: 'auto'
        }}
      >
        {/* Botón cerrar */}
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
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Header con insignia */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(212,175,55,0.15)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}
          >
            <Sparkles size={14} /> Recorrido de Lealtad
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
            Mi Pasaporte de Visitas
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
            Consume en comercios aliados (como tus visitas diarias a cafés o restaurantes), acumula sellos y desbloquea recompensas.
          </p>
        </div>

        {/* Tarjeta Contador de Visitas */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(20,20,30,0.7) 100%)',
            border: '1.5px solid rgba(212,175,55,0.4)',
            borderRadius: '22px',
            padding: '1.4rem 1.2rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.35)'
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '4px' }}>
            Sellos Acumulados
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1, color: '#FFF', textShadow: '0 0 20px rgba(212,175,55,0.6)' }}>
            {totalVisits}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#D4D4D8', marginTop: '6px', fontWeight: 600 }}>
            {totalVisits === 1 ? 'visita registrada' : 'visitas registradas en comercios aliados'}
          </div>

          {/* Barra de Progreso visual */}
          <div style={{ marginTop: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '5px', fontWeight: 700 }}>
              <span>Inicio</span>
              <span>5 Visitas</span>
              <span>10 Visitas</span>
              <span>20 Visitas</span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #F59E0B, #22C55E)',
                  borderRadius: '10px',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>

          {nextPendingMilestone ? (
            <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: '#A7F3D0', backgroundColor: 'rgba(16,185,129,0.15)', padding: '6px 12px', borderRadius: '100px', display: 'inline-block' }}>
              🎯 Te faltan <strong>{nextPendingMilestone.visits - totalVisits} visitas</strong> para tu siguiente recompensa
            </div>
          ) : (
            <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: '#FDE047', backgroundColor: 'rgba(234,179,8,0.2)', padding: '6px 12px', borderRadius: '100px', display: 'inline-block' }}>
              👑 ¡Has completado todos los hitos del recorrido de lealtad!
            </div>
          )}
        </div>

        {/* Lista de Metas e Hitos */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '0.8rem' }}>
            Metas & Recompensas del Recorrido
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {milestones.map((m, idx) => {
              const isUnlocked = totalVisits >= m.visits;
              return (
                <div
                  key={m.key}
                  style={{
                    backgroundColor: isUnlocked ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                    border: isUnlocked ? '1.5px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '18px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          backgroundColor: isUnlocked ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)',
                          color: isUnlocked ? '#4ADE80' : 'var(--text-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isUnlocked ? <CheckCircle2 size={22} /> : <Lock size={20} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: isUnlocked ? '#4ADE80' : 'var(--text-dim)', fontWeight: 800 }}>
                          Meta {idx + 1} • {m.visits} Visitas
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isUnlocked ? '#FFF' : '#A1A1AA' }}>
                          {m.badgeName}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '100px',
                        backgroundColor: isUnlocked ? '#22C55E' : 'rgba(255,255,255,0.08)',
                        color: isUnlocked ? '#121212' : 'var(--text-dim)'
                      }}
                    >
                      {isUnlocked ? 'DESBLOQUEADO' : `${totalVisits}/${m.visits}`}
                    </span>
                  </div>

                  {/* Descripción de la recompensa */}
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: isUnlocked ? '#D1FAE5' : 'var(--text-dim)',
                      backgroundColor: isUnlocked ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.15)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Gift size={16} color={isUnlocked ? '#4ADE80' : 'var(--text-dim)'} style={{ flexShrink: 0 }} />
                    <span><strong>Premio:</strong> {m.reward}</span>
                  </div>

                  {/* Botón Reclamar Premio si está desbloqueado */}
                  {isUnlocked && (
                    <button
                      onClick={() => handleClaimReward(m)}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: '#25D366',
                        color: '#121212',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
                        marginTop: '2px'
                      }}
                    >
                      <ExternalLink size={15} /> Reclamar este Premio por WhatsApp
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Historial de Sellos Recientes */}
        <div>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} /> Historial de Sellos en Comercios ({history.length})
          </div>

          {history.length === 0 ? (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '1.4rem 1rem',
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.12)'
              }}
            >
              <MapPin size={24} color="var(--accent-gold)" style={{ opacity: 0.7, marginBottom: '6px' }} />
              <p style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 700, color: '#E4E4E7' }}>
                Aún no tienes visitas registradas
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                Al consumir en cualquier comercio aliado (restaurantes, cafeterías, etc.), muestra tu código QR o número de socio. Cada visita sumará un sello a tu pasaporte.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {history.map((h, i) => (
                <div
                  key={h.id || i}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '0.7rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>
                      {h.allyName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> {h.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ADE80' }}>
                      {h.discount}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Sello #{history.length - i}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.85rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: '#FFF',
            fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Cerrar Pasaporte
        </button>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
