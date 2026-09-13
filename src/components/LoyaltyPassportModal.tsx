import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Award, Lock, Gift, ExternalLink, MapPin, Sparkles, Flame, Star, Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getMemberVisitsSummary, type LoyaltyConfig, type MemberVisitRecord } from '../lib/loyaltyService';
import { 
  getUserGamificationProfile, 
  redeemRewardForMember, 
  REWARDS_CATALOG, 
  type RewardItem 
} from '../lib/challengesService';

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
  const [activeTab, setActiveTab] = useState<'challenges' | 'routes' | 'rewards' | 'history'>('challenges');
  const [summary, setSummary] = useState<{
    totalVisits: number;
    history: MemberVisitRecord[];
    config: LoyaltyConfig;
  } | null>(null);

  const [profile, setProfile] = useState<ReturnType<typeof getUserGamificationProfile> | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<{ code: string; url: string; title: string } | null>(null);
  const [redeemError, setRedeemError] = useState<string>('');

  const refreshData = () => {
    if (user?.code || user?.member_number) {
      const data = getMemberVisitsSummary(user?.code, user?.member_number);
      setSummary(data);
      const gameData = getUserGamificationProfile(user?.code, user?.member_number);
      setProfile(gameData);
    } else {
      const data = getMemberVisitsSummary();
      setSummary(data);
      const gameData = getUserGamificationProfile();
      setProfile(gameData);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const totalVisits = summary?.totalVisits || 0;
  const history = summary?.history || [];
  const availablePoints = profile?.availablePoints || 0;
  const challenges = profile?.challenges || [];
  const routes = profile?.routes || [];
  const redemptions = profile?.redemptions || [];

  const handleRedeem = (reward: RewardItem) => {
    setRedeemError('');
    const result = redeemRewardForMember(reward, user?.code, user?.member_number, user?.phone);
    if (result.success && result.redemptionCode && result.whatsappUrl) {
      setRedeemSuccess({
        code: result.redemptionCode,
        url: result.whatsappUrl,
        title: reward.title
      });
      refreshData();
    } else {
      setRedeemError(result.error || 'No se pudo procesar el canje.');
    }
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
        backgroundColor: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.8rem',
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
          maxWidth: '490px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          borderRadius: '30px',
          padding: '1.6rem 1.2rem',
          position: 'relative',
          border: '1.5px solid rgba(212,175,55,0.45)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.9), 0 0 45px rgba(212,175,55,0.25)',
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

        {/* Encabezado Principal */}
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(212,175,55,0.15)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              padding: '5px 12px',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}
          >
            <Sparkles size={13} /> Club de Recompensas
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>
            Retos, Rutas & Puntos
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', margin: 0, lineHeight: 1.3 }}>
            Cumple misiones en comercios aliados, recorre la ciudad y canjea premios.
          </p>
        </div>

        {/* Tarjeta Resumen: Puntos y Visitas */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(20,20,30,0.8) 100%)',
            border: '1.5px solid rgba(212,175,55,0.4)',
            borderRadius: '20px',
            padding: '1rem 1.2rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
          }}
        >
          {/* Puntos Disponibles */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '2px' }}>
              Puntos Disponibles
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, color: '#FFF', textShadow: '0 0 15px rgba(212,175,55,0.6)' }}>
              {availablePoints} <span style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>pts</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#A7F3D0', marginTop: '4px', fontWeight: 600 }}>
              ★ Listos para canjear
            </div>
          </div>

          <div style={{ width: '1px', height: '45px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

          {/* Sellos de Visitas */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '2px' }}>
              Sellos Acumulados
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, color: '#FFF' }}>
              {totalVisits}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 600 }}>
              {totalVisits === 1 ? '1 visita oficial' : `${totalVisits} visitas en aliados`}
            </div>
          </div>
        </div>

        {/* Segmented Control / Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '1.2rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setActiveTab('challenges')}
            style={{
              padding: '8px 4px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'challenges' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'challenges' ? '#121212' : '#CBD5E1',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              transition: 'all 0.2s'
            }}
          >
            <Flame size={15} />
            Retos
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            style={{
              padding: '8px 4px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'routes' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'routes' ? '#121212' : '#CBD5E1',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              transition: 'all 0.2s'
            }}
          >
            <MapPin size={15} />
            Rutas
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            style={{
              padding: '8px 4px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'rewards' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'rewards' ? '#121212' : '#CBD5E1',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              transition: 'all 0.2s'
            }}
          >
            <Gift size={15} />
            Canjear
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '8px 4px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeTab === 'history' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'history' ? '#121212' : '#CBD5E1',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              transition: 'all 0.2s'
            }}
          >
            <Award size={15} />
            Bitácora
          </button>
        </div>

        {/* ─── TAB 1: RETOS SEMANALES & DIARIOS ─── */}
        {activeTab === 'challenges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
              Completa estas misiones consumiendo en aliados para ganar puntos extra:
            </div>

            {challenges.map((ch) => (
              <div
                key={ch.id}
                style={{
                  backgroundColor: ch.completed ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  border: ch.completed ? '1.5px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '18px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF' }}>
                    {ch.title}
                  </div>
                  <span style={{
                    backgroundColor: ch.completed ? '#22C55E' : 'rgba(212,175,55,0.2)',
                    color: ch.completed ? '#000' : 'var(--accent-gold)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}>
                    {ch.completed ? '✓ ¡COMPLETADO!' : `+${ch.rewardPoints} PTS`}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
                  {ch.description}
                </div>

                {/* Barra de progreso */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>
                    <span>Progreso: {ch.current} de {ch.targetVisits} visitas</span>
                    <span>{ch.progressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${ch.progressPercent}%`,
                        height: '100%',
                        background: ch.completed ? '#22C55E' : 'linear-gradient(90deg, var(--accent-gold), #F59E0B)',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>

                {ch.badgeName && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={11} /> Recompensa de insignia: <strong>{ch.badgeName}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB 2: RUTAS TEMÁTICAS ─── */}
        {activeTab === 'routes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
              Explora la ciudad a través de circuitos especiales de consumo local:
            </div>

            {routes.map((rt) => (
              <div
                key={rt.id}
                style={{
                  backgroundColor: rt.completed ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  border: rt.completed ? '1.5px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '18px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFF' }}>
                    {rt.name}
                  </div>
                  <span style={{
                    backgroundColor: rt.completed ? '#22C55E' : 'rgba(212,175,55,0.2)',
                    color: rt.completed ? '#000' : 'var(--accent-gold)',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '8px'
                  }}>
                    {rt.completed ? '✓ RUTA CONCLUIDA' : `+${rt.rewardPoints} PTS`}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
                  {rt.description}
                </div>

                {/* Paradas de la Ruta */}
                <div style={{ marginTop: '4px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Paradas del Circuito:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {rt.stops.map((stop, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#E2E8F0' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-gold)', flexShrink: 0 }} />
                        <strong>{stop.name}:</strong> <span style={{ color: 'var(--text-dim)' }}>{stop.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barra de progreso de la ruta */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#CBD5E1', marginBottom: '4px', fontWeight: 700 }}>
                    <span>Paradas visitadas: {rt.currentStopsCount} de {rt.targetCount}</span>
                    <span>{rt.progressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${rt.progressPercent}%`,
                        height: '100%',
                        background: rt.completed ? '#22C55E' : 'linear-gradient(90deg, #3B82F6, #10B981)',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── TAB 3: CANJEAR PREMIOS ─── */}
        {activeTab === 'rewards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Catálogo oficial de recompensas:</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 800 }}>Saldo: {availablePoints} pts</span>
            </div>

            {redeemError && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', borderRadius: '12px', padding: '8px 12px', color: '#FCA5A5', fontSize: '0.78rem' }}>
                {redeemError}
              </div>
            )}

            {redeemSuccess && (
              <div style={{ backgroundColor: 'rgba(34,197,94,0.2)', border: '1.5px solid #22C55E', borderRadius: '14px', padding: '12px', color: '#FFF', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#4ADE80', marginBottom: '4px' }}>
                  🎉 ¡CANJE EXITOSO!
                </div>
                <div style={{ fontSize: '0.8rem', color: '#D1FAE5', marginBottom: '8px' }}>
                  Has canjeado: <strong>{redeemSuccess.title}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '6px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 900, color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  {redeemSuccess.code}
                </div>
                <a
                  href={redeemSuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#22C55E',
                    color: '#000',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={14} /> Coordinar Entrega por WhatsApp
                </a>
              </div>
            )}

            {REWARDS_CATALOG.map((rew) => {
              const canAfford = availablePoints >= rew.pointsCost;
              return (
                <div
                  key={rew.id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: canAfford ? '1.5px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '18px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.08em' }}>
                        {rew.category} • {rew.sponsorName}
                      </span>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFF', marginTop: '2px' }}>
                        {rew.title}
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: canAfford ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)',
                      color: canAfford ? 'var(--accent-gold)' : 'var(--text-dim)',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      padding: '4px 10px',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}>
                      {rew.pointsCost} PTS
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
                    {rew.description}
                  </div>

                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                    ℹ️ {rew.terms}
                  </div>

                  <button
                    onClick={() => handleRedeem(rew)}
                    disabled={!canAfford}
                    style={{
                      marginTop: '4px',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: canAfford ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                      color: canAfford ? '#121212' : 'var(--text-dim)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {canAfford ? (
                      <>
                        <Gift size={16} /> Canjear por {rew.pointsCost} Puntos
                      </>
                    ) : (
                      <>
                        <Lock size={14} /> Te faltan {rew.pointsCost - availablePoints} pts
                      </>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Historial de Vales Canjeados */}
            {redemptions.length > 0 && (
              <div style={{ marginTop: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Tus Vales Canjeados ({redemptions.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {redemptions.map((r, idx) => (
                    <div key={idx} style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#FFF' }}>{r.rewardTitle}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>{r.date}</div>
                      </div>
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent-gold)', fontWeight: 800 }}>
                        {r.redemptionCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: BITÁCORA DE SELLOS & HISTORIAL ─── */}
        {activeTab === 'history' && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>
              Registro oficial de visitas en comercios aliados:
            </div>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-dim)' }}>
                <Clock size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.8rem', opacity: 0.5 }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>
                  Aún no tienes visitas registradas
                </div>
                <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Muestra tu QR o calcomanía en tu próxima visita a un comercio aliado para obtener tu primer sello y tus primeros 10 puntos.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {history.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      padding: '0.9rem',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#FFF' }}>
                        {v.allyName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '2px', fontWeight: 600 }}>
                        {v.discount}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {v.date}
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(34,197,94,0.15)',
                      color: '#4ADE80',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}>
                      +10 PTS ✓
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botón Inferior de Cierre */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.2rem',
            padding: '0.85rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: '#FFF',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
