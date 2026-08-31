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
  Camera,
  Crown,
  Sparkles,
  ShieldCheck,
  X,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrScannerModal } from '../components/QrScannerModal';

interface AllyData {
  id: string;
  name: string;
  category: string;
  discount: string;
  promotions_given: number;
}

interface ScannedMember {
  code: string;
  level: string;
  member_number: number;
  phone: string;
}

const AliadoPanel: React.FC = () => {
  const [step, setStep] = useState<'login' | 'select_branch' | 'panel'>('login');
  const [pinInput, setPinInput] = useState('');
  const [branchesList, setBranchesList] = useState<AllyData[]>([]);
  const [ally, setAlly] = useState<AllyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successAnim, setSuccessAnim] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // QR Scanning States
  const [showScanner, setShowScanner] = useState(false);
  const [scannedMember, setScannedMember] = useState<ScannedMember | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const cleanPin = pinInput.trim();
      if (!cleanPin) {
        throw new Error('Ingresa tu PIN de acceso.');
      }

      const { data, error } = await supabase
        .from('allies')
        .select('id, name, category, discount, promotions_given, ally_pin')
        .eq('ally_pin', cleanPin);

      if (error || !data || data.length === 0) {
        throw new Error('PIN incorrecto o no registrado. Verifica con el administrador.');
      }

      const formattedBranches: AllyData[] = data.map((b: any) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        discount: b.discount,
        promotions_given: b.promotions_given ?? 0,
      }));

      if (formattedBranches.length === 1) {
        setAlly(formattedBranches[0]);
        setStep('panel');
      } else {
        setBranchesList(formattedBranches);
        setStep('select_branch');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBranch = (selectedAlly: AllyData) => {
    setAlly(selectedAlly);
    setStep('panel');
  };

  const incrementPromotionCount = async () => {
    if (!ally) return;
    const newCount = (ally.promotions_given || 0) + 1;
    const { error } = await supabase
      .from('allies')
      .update({ promotions_given: newCount })
      .eq('id', ally.id);

    if (!error) {
      setAlly({ ...ally, promotions_given: newCount });
      setSuccessAnim(true);
      setTimeout(() => setSuccessAnim(false), 2000);
    }
  };

  const handleRegisterPromotion = async () => {
    if (!ally || isSaving) return;
    setIsSaving(true);
    setErrorMsg('');

    try {
      await incrementPromotionCount();
    } catch (err: any) {
      setErrorMsg('Error al registrar la promoción. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanQRSuccess = async (decodedText: string) => {
    setShowScanner(false);
    setErrorMsg('');

    // Extract code from text or URL parameter ?c=RED-XXXX
    let extractedCode = decodedText.trim();
    if (extractedCode.includes('?c=')) {
      extractedCode = extractedCode.split('?c=')[1].split('&')[0];
    } else if (extractedCode.includes('/')) {
      const parts = extractedCode.split('/');
      extractedCode = parts[parts.length - 1];
    }
    extractedCode = extractedCode.toUpperCase();

    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('stickers')
        .select('*')
        .eq('code', extractedCode)
        .single();

      if (error || !data) {
        throw new Error(`Código ${extractedCode} no encontrado en la base de datos.`);
      }

      if (!data.phone) {
        throw new Error(`El código ${extractedCode} aún no ha sido activado por un usuario.`);
      }

      // Valid Member Found!
      setScannedMember({
        code: data.code,
        level: data.level || 'white',
        member_number: data.member_number,
        phone: data.phone,
      });

      await incrementPromotionCount();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al validar el código QR.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setAlly(null);
    setStep('login');
    setPinInput('');
    setErrorMsg('');
    setScannedMember(null);
  };

  const getLevelInfo = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'gold':
        return { name: 'VIP DORADO', color: '#D4AF37', icon: Crown };
      case 'silver':
        return { name: 'COLECCIÓN PLATA', color: '#C0C0C0', icon: Sparkles };
      default:
        return { name: 'ESENCIAL', color: '#4ADE80', icon: ShieldCheck };
    }
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
            Valida los códigos QR y registra las promociones que das a los miembros.
          </p>
        </div>

        <form onSubmit={handleLogin} className="glass" style={{ padding: '2rem', borderRadius: '28px' }}>
          <div style={{ marginBottom: '1.8rem' }}>
            <label style={labelStyle}>PIN de acceso del comercio</label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Ingresa tu PIN secret"
              autoFocus
              required
              style={{ ...inputStyle, letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }}
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

  /* ─── SELECT BRANCH ─── */
  if (step === 'select_branch') {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', paddingBottom: '120px', paddingTop: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            <MapPin size={34} color="var(--accent-gold)" />
          </div>
          <h1 style={{ fontSize: '1.7rem', marginBottom: '0.4rem' }}>Selecciona tu Sucursal</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Se encontraron {branchesList.length} sucursales vinculadas a este PIN.<br />
            Elige en cuál estás operando hoy.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {branchesList.map((branch) => (
            <motion.div
              key={branch.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectBranch(branch)}
              className="glass"
              style={{
                borderRadius: '20px',
                padding: '1.5rem',
                cursor: 'pointer',
                border: '1px solid rgba(212,175,55,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {branch.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {branch.promotions_given} canjes
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#FFF', fontWeight: 800, lineHeight: 1.2 }}>
                {branch.name}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#4ADE80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gift size={16} /> {branch.discount}
              </div>
            </motion.div>
          ))}

          <button
            onClick={() => setStep('login')}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.9rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Probar con otro PIN
          </button>
        </div>
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
        marginBottom: '1.5rem',
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

      {/* Counter Card */}
      <div className="glass" style={{
        borderRadius: '28px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
        border: '1px solid rgba(212,175,55,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <TrendingUp size={18} color="var(--text-dim)" style={{ marginBottom: '0.6rem' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
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
            style={{ fontSize: '4.5rem', fontWeight: 700, lineHeight: 1 }}
          >
            {ally?.promotions_given ?? 0}
          </motion.div>
        </AnimatePresence>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
          Total histórico acumulado
        </p>

        {/* Success animation overlay */}
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
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                borderRadius: '28px',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={52} color="#4ADE80" />
              <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: '1.1rem' }}>¡Promoción Registrada!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botón Principal: Escanear QR */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowScanner(true)}
        disabled={isSaving}
        style={{
          width: '100%',
          padding: '1.3rem',
          borderRadius: '20px',
          backgroundColor: 'var(--accent-gold)',
          color: '#121212',
          fontWeight: 800,
          fontSize: '1.1rem',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.7rem',
          cursor: 'pointer',
          boxShadow: '0 0 25px rgba(212,175,55,0.35)',
          marginBottom: '1rem',
        }}
      >
        <Camera size={22} strokeWidth={2.5} />
        Escanear QR de Cliente
      </motion.button>

      {/* Botón de Respaldo: Manual */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleRegisterPromotion}
        disabled={isSaving}
        style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-dim)',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
        {isSaving ? 'Guardando...' : 'Reg. Manual (Sin cámara)'}
      </motion.button>

      {errorMsg && (
        <div style={{ color: '#ff4444', fontSize: '0.82rem', padding: '0.8rem 1rem', backgroundColor: 'rgba(255,0,0,0.08)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.2rem' }}>
          <ShieldAlert size={18} /> {errorMsg}
        </div>
      )}

      {/* Modal Resultado de Escaneo de Miembro */}
      {scannedMember && (
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{
              width: '100%',
              maxWidth: '380px',
              borderRadius: '28px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
              border: '2px solid #4ADE80',
            }}
          >
            <button
              onClick={() => setScannedMember(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#FFF',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            <CheckCircle2 size={56} color="#4ADE80" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.4rem' }}>
              ¡Membresía Válida!
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              El beneficio ha sido validado y registrado.
            </p>

            {/* Member Details */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '1rem', marginBottom: '1.2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Código de Miembro:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.05rem' }}>{scannedMember.code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Nivel:</span>
                {(() => {
                  const info = getLevelInfo(scannedMember.level);
                  const Icon = info.icon;
                  return (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: info.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon size={14} /> {info.name}
                    </span>
                  );
                })()}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>Descuento a aplicar:</span>
                <span style={{ fontWeight: 700, color: '#4ADE80', fontSize: '0.95rem' }}>{ally?.discount}</span>
              </div>
            </div>

            <button
              onClick={() => setScannedMember(null)}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '14px',
                backgroundColor: '#4ADE80',
                color: '#121212',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Aceptar y Continuar
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal del Escáner */}
      {showScanner && (
        <QrScannerModal
          onScanSuccess={handleScanQRSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Instrucciones */}
      <div className="glass" style={{ borderRadius: '18px', padding: '1.2rem', border: '1px solid var(--glass-border)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--accent-white)' }}>¿Cómo funciona?</strong><br />
          1. Presiona <strong>"Escanear QR de Cliente"</strong> para verificar con tu cámara el QR del cliente.<br />
          2. Si no tienes cámara disponible, usa <strong>"Reg. Manual"</strong> como respaldo.
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
