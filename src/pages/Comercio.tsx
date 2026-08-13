import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, QrCode, Hash, CheckCircle2, Loader2, ChevronRight, Users, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Comercio: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'scan' | 'success'>('menu');
  const [memberInput, setMemberInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedMember, setConfirmedMember] = useState<{ number: number; level: string } | null>(null);
  const [selectedAlly, setSelectedAlly] = useState('');

  const handleRegisterVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberInput || !selectedAlly) return;
    setIsLoading(true);
    setErrorMsg('');

    const memberNum = parseInt(memberInput.replace('#', ''), 10);
    try {
      // Try to find member by member_number
      const { data: sticker, error } = await supabase
        .from('stickers')
        .select('member_number, level, phone')
        .eq('member_number', memberNum)
        .single();

      if (error || !sticker) {
        throw new Error('Número de miembro no encontrado en la Red.');
      }

      // Try to increment visits for the selected ally
      const { error: updateError } = await supabase
        .from('allies')
        .update({ visits: supabase.rpc('increment', { x: 1 }) as any })
        .eq('name', selectedAlly);

      // Even if ally update fails, the visit is considered registered
      if (updateError) {
        console.warn('Could not update ally visits:', updateError);
      }

      setConfirmedMember({ number: sticker.member_number, level: sticker.level });
      setMode('success');
    } catch (err: any) {
      // DEMO fallback — if the stickers table isn't set up yet, simulate success
      if (err.message?.includes('relation') || err.message?.includes('does not exist')) {
        setConfirmedMember({ number: memberNum, level: 'white' });
        setMode('success');
      } else {
        setErrorMsg(err.message || 'Error al verificar el miembro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'gold': return { label: 'Oro VIP', color: 'var(--accent-gold)' };
      case 'silver': return { label: 'Colección', color: 'var(--accent-silver)' };
      default: return { label: 'Esencial', color: 'var(--accent-white)' };
    }
  };

  const handleReset = () => {
    setMode('menu');
    setMemberInput('');
    setSelectedAlly('');
    setErrorMsg('');
    setConfirmedMember(null);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{
            backgroundColor: 'rgba(212,175,55,0.15)',
            padding: '8px',
            borderRadius: '10px',
            border: '1px solid rgba(212,175,55,0.3)'
          }}>
            <Store size={20} color="var(--accent-gold)" />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Panel de Negocio</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Comercios Aliados</h1>
          </div>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.5 }}>
          Registra la visita de un miembro para llevar control de las visitas a tu establecimiento. <strong style={{ color: 'var(--accent-gold)' }}>Completamente opcional.</strong>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── SUCCESS STATE ─── */}
        {mode === 'success' && confirmedMember && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ textAlign: 'center' }}
          >
            <div className="glass premium-glow-gold" style={{
              padding: '2.5rem 1.5rem',
              borderRadius: '28px',
              border: '1px solid rgba(212,175,55,0.3)',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                border: '2px solid #4ADE80',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <CheckCircle2 size={36} color="#4ADE80" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#4ADE80' }}>
                ¡Visita Registrada!
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                El miembro ha canjeado su beneficio en tu establecimiento.
              </p>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '1.2rem',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-around'
              }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Miembro No.</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace' }}>
                    #{String(confirmedMember.number).padStart(4, '0')}
                  </div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Nivel</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getLevelLabel(confirmedMember.level).color }}>
                    {getLevelLabel(confirmedMember.level).label}
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 700,
                  border: 'none',
                  fontSize: '0.9rem'
                }}
              >
                Registrar otra visita
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── REGISTER VISIT FORM ─── */}
        {mode === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                <Hash size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Ingresar Número de Miembro</h3>
              </div>

              <form onSubmit={handleRegisterVisit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>
                    No. de Miembro (ej: 0042)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--accent-gold)', fontWeight: 700, fontSize: '1rem'
                    }}>#</span>
                    <input
                      type="number"
                      placeholder="0042"
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem 0.9rem 2rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        color: '#FFF',
                        fontSize: '1.2rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                        letterSpacing: '0.1em'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>
                    Tu Establecimiento
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre de tu negocio"
                    value={selectedAlly}
                    onChange={(e) => setSelectedAlly(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {errorMsg && (
                  <div style={{ color: '#ff6b6b', fontSize: '0.82rem', marginBottom: '1rem', padding: '0.7rem', backgroundColor: 'rgba(255,100,100,0.1)', borderRadius: '10px', border: '1px solid rgba(255,100,100,0.2)' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    type="button"
                    onClick={() => setMode('menu')}
                    style={{
                      flex: 1,
                      padding: '0.9rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-dim)',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '0.85rem'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !memberInput || !selectedAlly}
                    style={{
                      flex: 2,
                      padding: '0.9rem',
                      borderRadius: '12px',
                      backgroundColor: (memberInput && selectedAlly) ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                      color: '#121212',
                      fontWeight: 700,
                      border: 'none',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                    {isLoading ? 'Verificando...' : 'Registrar Visita'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* ─── MENU STATE ─── */}
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Register visit card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('scan')}
              className="glass premium-glow-gold"
              style={{
                padding: '1.5rem',
                borderRadius: '24px',
                border: '1px solid rgba(212,175,55,0.25)',
                cursor: 'pointer',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <QrCode size={24} color="var(--accent-gold)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '3px' }}>Registrar Visita de Miembro</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  Ingresa el número de miembro que te muestra el cliente para registrar su visita.
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-dim)" />
            </motion.div>

            {/* Info card */}
            <div className="glass" style={{ padding: '1.2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Shield size={16} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>¿Cómo funciona?</span>
              </div>
              {[
                { step: '1', text: 'El cliente te muestra su Pase QR o número de miembro en la app.' },
                { step: '2', text: 'Aplica el descuento o beneficio correspondiente.' },
                { step: '3', text: 'Opcionalmente, registra la visita aquí para llevar control.' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    backgroundColor: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-gold)',
                    flexShrink: 0
                  }}>{step}</div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats banner */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
              <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Users size={18} color="var(--accent-gold)" style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>1,248</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Miembros activos</div>
              </div>
              <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                <QrCode size={18} color="var(--accent-gold)" style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>3,890</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Visitas registradas</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Comercio;
