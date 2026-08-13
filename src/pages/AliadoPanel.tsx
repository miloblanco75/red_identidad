import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Store,
  Lock,
  Gift,
  TrendingUp,
  CheckCircle2,
  Loader2,
  LogOut,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AllyData {
  id: string;
  name: string;
  category: string;
  discount: string;
  promotions_given: number;
}

const AliadoPanel: React.FC = () => {
  const [step, setStep] = useState<'login' | 'panel'>('login');
  const [nameInput, setNameInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [ally, setAlly] = useState<AllyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successAnim, setSuccessAnim] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase
        .from('allies')
        .select('id, name, category, discount, promotions_given, ally_pin')
        .ilike('name', nameInput.trim())
        .single();

      if (error || !data) {
        throw new Error('No se encontró un aliado con ese nombre.');
      }

      if (!data.ally_pin) {
        throw new Error('Este aliado no tiene PIN configurado. Contacta al administrador.');
      }

      if (data.ally_pin !== pinInput.trim()) {
        throw new Error('PIN incorrecto. Verifica tus credenciales.');
      }

      setAlly({
        id: data.id,
        name: data.name,
        category: data.category,
        discount: data.discount,
        promotions_given: data.promotions_given ?? 0,
      });
      setStep('panel');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPromotion = async () => {
    if (!ally || isSaving) return;
    setIsSaving(true);

    try {
      const newCount = ally.promotions_given + 1;
      const { error } = await supabase
        .from('allies')
        .update({ promotions_given: newCount })
        .eq('id', ally.id);

      if (error) throw error;

      setAlly({ ...ally, promotions_given: newCount });
      setSuccessAnim(true);
      setTimeout(() => setSuccessAnim(false), 1800);
    } catch (err: any) {
      setErrorMsg('Error al registrar la promoción. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setAlly(null);
    setStep('login');
    setNameInput('');
    setPinInput('');
    setErrorMsg('');
  };

  /* ─── LOGIN ─── */
  if (step === 'login') {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', paddingBottom: '120px', paddingTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '22px',
            backgroundColor: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem',
          }}>
            <Store size={34} color="var(--accent-gold)" />
          </div>
          <h1 style={{ fontSize: '1.7rem', marginBottom: '0.4rem' }}>Portal de Aliados</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Registra las promociones que das a los<br />miembros de la Red Identidad.
          </p>
        </div>

        <form onSubmit={handleLogin} className="glass" style={{ padding: '2rem', borderRadius: '28px' }}>
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={labelStyle}>Nombre de tu negocio</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Ej. Los Trompos Campeche"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={labelStyle}>PIN de acceso</label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Tu PIN secreto"
              required
              style={{ ...inputStyle, letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.4rem' }}
            />
          </div>

          {errorMsg && (
            <div style={{ color: '#ff4444', fontSize: '0.82rem', marginBottom: '1.2rem', padding: '0.8rem 1rem', backgroundColor: 'rgba(255,0,0,0.08)', borderRadius: '10px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <ShieldAlert size={16} /> {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              backgroundColor: isLoading ? 'rgba(255,255,255,0.1)' : 'var(--accent-gold)',
              color: isLoading ? '#FFF' : '#121212',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
            {isLoading ? 'Verificando...' : 'Entrar a mi Panel'}
          </button>

          <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textAlign: 'center', marginTop: '1.2rem', lineHeight: 1.5 }}>
            ¿No tienes acceso? Contacta al administrador de la Red para obtener tu PIN.
          </p>
        </form>
      </div>
    );
  }

  /* ─── PANEL ─── */
  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '120px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
            {ally?.category}
          </p>
          <h1 style={{ fontSize: '1.6rem', lineHeight: 1.2 }}>{ally?.name}</h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-dim)',
            borderRadius: '10px',
            padding: '0.5rem 0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.75rem',
          }}
        >
          <LogOut size={14} /> Salir
        </button>
      </div>

      {/* Promoción activa */}
      <div style={{
        padding: '1rem 1.2rem',
        borderRadius: '16px',
        backgroundColor: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.2)',
        marginBottom: '2rem',
        display: 'flex',
        gap: '0.8rem',
        alignItems: 'center',
      }}>
        <Gift size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tu promoción activa</div>
          <div className="gold-text" style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>{ally?.discount}</div>
        </div>
      </div>

      {/* Contador grande */}
      <div className="glass" style={{
        borderRadius: '28px',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
        border: '1px solid rgba(212,175,55,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <TrendingUp size={18} color="var(--text-dim)" style={{ marginBottom: '0.8rem' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem' }}>
          Promociones otorgadas
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={ally?.promotions_given}
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.3, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="gold-text"
            style={{ fontSize: '5rem', fontWeight: 700, lineHeight: 1 }}
          >
            {ally?.promotions_given ?? 0}
          </motion.div>
        </AnimatePresence>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.6rem' }}>
          Total histórico
        </p>

        {/* Success flash */}
        <AnimatePresence>
          {successAnim && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(74, 222, 128, 0.12)',
                borderRadius: '28px',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={52} color="#4ADE80" />
              <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: '1.1rem' }}>¡Registrado!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botón +1 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={handleRegisterPromotion}
        disabled={isSaving}
        style={{
          width: '100%',
          padding: '1.4rem',
          borderRadius: '20px',
          backgroundColor: isSaving ? 'rgba(255,255,255,0.08)' : 'var(--accent-gold)',
          color: isSaving ? '#FFF' : '#121212',
          fontWeight: 700,
          fontSize: '1.15rem',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.7rem',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          boxShadow: isSaving ? 'none' : '0 0 30px rgba(212,175,55,0.35)',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          marginBottom: '1.5rem',
        }}
      >
        {isSaving
          ? <Loader2 className="animate-spin" size={22} />
          : <Plus size={22} strokeWidth={3} />
        }
        {isSaving ? 'Guardando...' : 'Registrar Promoción Dada'}
      </motion.button>

      {errorMsg && (
        <div style={{ color: '#ff4444', fontSize: '0.82rem', padding: '0.8rem 1rem', backgroundColor: 'rgba(255,0,0,0.08)', borderRadius: '10px', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <ShieldAlert size={16} /> {errorMsg}
        </div>
      )}

      {/* Instrucciones */}
      <div className="glass" style={{ borderRadius: '18px', padding: '1.2rem', border: '1px solid var(--glass-border)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--accent-white)' }}>¿Cómo funciona?</strong><br />
          Cada vez que un miembro de la Red canjee su beneficio en tu negocio, presiona el botón de arriba. Así llevamos un registro oficial de las promociones que has otorgado.
        </p>
      </div>
    </div>
  );
};

/* ─── Styles ─── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  color: 'var(--text-dim)',
  marginBottom: '0.5rem',
  letterSpacing: '0.1em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--glass-border)',
  borderRadius: '14px',
  color: '#FFF',
  fontSize: '1rem',
  outline: 'none',
  fontFamily: 'inherit',
};

export default AliadoPanel;
