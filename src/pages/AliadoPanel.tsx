import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Store,
  Lock,
  Gift,
  TrendingUp,
  Loader2,
  LogOut,
  ShieldAlert,
  Camera,
  Crown,
  Sparkles,
  ShieldCheck,
  X,
  MapPin,
  Search,
  AlertTriangle,
  Clock,
  History,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrScannerModal } from '../components/QrScannerModal';
import { recordMemberVisit, type LoyaltyMilestone } from '../lib/loyaltyService';

interface AllyData {
  id: string;
  name: string;
  category: string;
  discount: string;
  promotions_given: number;
}

interface ValidationResult {
  status: 'valid' | 'invalid';
  code: string;
  member_number?: number;
  level?: string;
  phone?: string;
  discountToApply: string;
  message: string;
  isUnclaimedOfficial?: boolean;
  totalVisits?: number;
  achievedMilestone?: LoyaltyMilestone | null;
  nextMilestone?: LoyaltyMilestone;
}

// Reproductor de efectos sonoros y hápticos nativos para terminal de caja
const playFeedback = (type: 'success' | 'error') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      if (type === 'success') {
        // Chime triunfal de caja registradora: E5 -> G#5 -> B5
        [659.25, 830.61, 987.77].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.3, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.35);
        });
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } else {
        // Zumbido de error
        [220, 180].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.25, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.2);
        });
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(250);
        }
      }
    }
  } catch (e) {
    // Audio restriction fallback
  }
};

const AliadoPanel: React.FC = () => {
  const [step, setStep] = useState<'login' | 'select_branch' | 'panel'>('login');
  const [pinInput, setPinInput] = useState('');
  const [branchesList, setBranchesList] = useState<AllyData[]>([]);
  const [ally, setAlly] = useState<AllyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // QR Scanning & Semáforo States
  const [showScanner, setShowScanner] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [todayValidations, setTodayValidations] = useState<Array<{ time: string; member: string; discount: string }>>([]);
  const [showHistoryList, setShowHistoryList] = useState(false);

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
    }
  };

  // Motor Inteligente y Flexible de Validación
  const validateCodeOrInput = async (rawInput: string) => {
    if (!ally || !rawInput.trim() || isSaving) return;
    setIsSaving(true);
    setErrorMsg('');

    // 1. Extraer código limpio de URLs, parámetros o texto
    let clean = rawInput.trim();
    if (clean.includes('?c=')) {
      clean = clean.split('?c=')[1].split('&')[0];
    } else if (clean.includes('/registro?c=')) {
      clean = clean.split('/registro?c=')[1].split('&')[0];
    } else if (clean.includes('/') && !clean.startsWith('http')) {
      const parts = clean.split('/');
      clean = parts[parts.length - 1];
    } else if (clean.startsWith('http')) {
      try {
        const urlObj = new URL(clean);
        const cParam = urlObj.searchParams.get('c');
        if (cParam) clean = cParam;
      } catch (e) {}
    }

    clean = clean.replace(/#/g, '').trim().toUpperCase();

    try {
      let foundSticker: any = null;

      // A. Búsqueda directa por código en Supabase
      const { data: exactMatch } = await supabase
        .from('stickers')
        .select('*')
        .eq('code', clean)
        .maybeSingle();

      if (exactMatch) {
        foundSticker = exactMatch;
      }

      // B. Si es número (ej. "35" o "0035"), buscar por member_number
      if (!foundSticker) {
        const numVal = parseInt(clean.replace(/\D/g, ''), 10);
        if (!isNaN(numVal) && numVal > 0) {
          const { data: numMatch } = await supabase
            .from('stickers')
            .select('*')
            .eq('member_number', numVal)
            .maybeSingle();

          if (numMatch) {
            foundSticker = numMatch;
          }
        }
      }

      // C. Búsqueda por teléfono
      if (!foundSticker) {
        const phoneDigits = clean.replace(/\D/g, '');
        if (phoneDigits.length >= 7) {
          const { data: phoneMatch } = await supabase
            .from('stickers')
            .select('*')
            .ilike('phone', `%${phoneDigits}%`)
            .maybeSingle();

          if (phoneMatch) {
            foundSticker = phoneMatch;
          }
        }
      }

      // D. Búsqueda flexible con/sin guión (ej. BLAN0001 vs BLAN-0001)
      if (!foundSticker) {
        const withHyphen = clean.replace(/([A-Z]+)(\d+)/, '$1-$2');
        const withoutHyphen = clean.replace(/-/g, '');
        const { data: fuzzyMatch } = await supabase
          .from('stickers')
          .select('*')
          .or(`code.eq.${withHyphen},code.eq.${withoutHyphen}`)
          .maybeSingle();

        if (fuzzyMatch) {
          foundSticker = fuzzyMatch;
        }
      }

      // ── EVALUACIÓN Y RESULTADO DEL SEMÁFORO ──
      if (foundSticker) {
        const isClaimed = Boolean(foundSticker.phone && String(foundSticker.phone).trim() !== '');
        const memberNum = foundSticker.member_number || parseInt(foundSticker.code?.replace(/\D/g, '') || '1', 10);
        const level = foundSticker.level || 'campechana_blanca';

        // Éxito: Sonido + vibración + incremento
        playFeedback('success');
        await incrementPromotionCount();

        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        setTodayValidations(prev => [
          { time: timeStr, member: `#${String(memberNum).padStart(4, '0')}`, discount: ally.discount },
          ...prev
        ]);

        const visitResult = recordMemberVisit(
          foundSticker.code,
          memberNum,
          ally.name,
          ally.discount
        );

        setValidationResult({
          status: 'valid',
          code: foundSticker.code,
          member_number: memberNum,
          level: level,
          phone: foundSticker.phone || '',
          discountToApply: ally.discount,
          message: isClaimed 
            ? '¡Miembro Activo Verificado!' 
            : '¡Calcomanía Oficial Válida! (Pendiente de registrar por el usuario)',
          isUnclaimedOfficial: !isClaimed,
          totalVisits: visitResult.totalVisits,
          achievedMilestone: visitResult.achievedMilestone,
          nextMilestone: visitResult.nextMilestone
        });
        setManualInput('');
        return;
      }

      // E. Fallback: Prefijos oficiales reconocidos de la Red Identidad
      const officialPrefixes = ['BLAN', 'ROSA', 'NEGR', 'CB-', 'CN-', 'CRN-', 'CRB-', 'RED-', 'TUL'];
      const isOfficialPattern = officialPrefixes.some(p => clean.startsWith(p) || clean.includes(p));

      if (isOfficialPattern) {
        playFeedback('success');
        await incrementPromotionCount();

        const memberNum = parseInt(clean.replace(/\D/g, '') || '100', 10);
        let derivedLevel = 'campechana_blanca';
        if (clean.includes('ROSA') || clean.startsWith('CRN-') || clean.startsWith('CB-')) derivedLevel = 'campechana_rosa';
        else if (clean.includes('NEGR') || clean.startsWith('CN-')) derivedLevel = 'campechana_negra';
        else if (clean.includes('GOLD') || clean.includes('TESORO')) derivedLevel = 'gold';

        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        setTodayValidations(prev => [
          { time: timeStr, member: `#${String(memberNum).padStart(4, '0')}`, discount: ally.discount },
          ...prev
        ]);

        const visitResult = recordMemberVisit(
          clean,
          memberNum,
          ally.name,
          ally.discount
        );

        setValidationResult({
          status: 'valid',
          code: clean,
          member_number: memberNum,
          level: derivedLevel,
          discountToApply: ally.discount,
          message: '¡Distintivo Oficial de la Red Reconocido!',
          isUnclaimedOfficial: true,
          totalVisits: visitResult.totalVisits,
          achievedMilestone: visitResult.achievedMilestone,
          nextMilestone: visitResult.nextMilestone
        });
        setManualInput('');
        return;
      }

      // Si no es un distintivo válido: PANTALLA ROJA
      playFeedback('error');
      setValidationResult({
        status: 'invalid',
        code: clean,
        discountToApply: '',
        message: `El código "${clean}" no pertenece a la Red Identidad o no está activado.`
      });

    } catch (err: any) {
      playFeedback('error');
      setValidationResult({
        status: 'invalid',
        code: clean,
        discountToApply: '',
        message: err.message || 'Error al validar el distintivo.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanQRSuccess = (decodedText: string) => {
    setShowScanner(false);
    validateCodeOrInput(decodedText);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    validateCodeOrInput(manualInput);
  };

  const handleLogout = () => {
    setAlly(null);
    setStep('login');
    setPinInput('');
    setErrorMsg('');
    setValidationResult(null);
  };

  const getLevelInfo = (levelStr?: string) => {
    const s = (levelStr || '').toLowerCase();
    if (s.includes('blanca')) {
      return { name: 'CAMPECHANA SOY BLANCA', color: '#FFFFFF', icon: Crown };
    }
    if (s.includes('rosa')) {
      return { name: 'CAMPECHANA SOY ROSA', color: '#FF5C9D', icon: Crown };
    }
    if (s.includes('negra')) {
      return { name: 'CAMPECHANA SOY NEGRA', color: '#D4AF37', icon: Crown };
    }
    if (s.includes('carmelita')) {
      return { name: 'CARMELITA SOY', color: '#60A5FA', icon: ShieldCheck };
    }
    if (s.includes('campechano')) {
      return { name: 'CAMPECHANO SOY', color: '#D4AF37', icon: ShieldCheck };
    }
    if (s.includes('gold')) {
      return { name: 'VIP DORADO', color: '#D4AF37', icon: Crown };
    }
    if (s.includes('silver')) {
      return { name: 'COLECCIÓN PLATA', color: '#C0C0C0', icon: Sparkles };
    }
    return { name: 'DISTINTIVO OFICIAL', color: '#4ADE80', icon: ShieldCheck };
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
            Valida los distintivos oficiales y registra las promociones que otorgas a los miembros.
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
            <div style={{ color: '#ff4444', fontSize: '0.85rem', marginBottom: '1.5rem', padding: '0.9rem', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <ShieldAlert size={18} /> {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1.1rem',
              borderRadius: '16px',
              backgroundColor: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
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

  /* ─── TERMINAL PANEL DE NEGOCIO ─── */
  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '120px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
            Terminal de Caja • {ally?.category}
          </p>
          <h1 style={{ fontSize: '1.6rem', lineHeight: 1.2, margin: 0 }}>{ally?.name}</h1>
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
            cursor: 'pointer'
          }}
        >
          <LogOut size={14} /> Salir
        </button>
      </div>

      {/* Promoción activa en grande */}
      <div style={{
        padding: '1rem 1.2rem',
        borderRadius: '16px',
        backgroundColor: 'rgba(212,175,55,0.12)',
        border: '1.5px solid rgba(212,175,55,0.35)',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '0.8rem',
        alignItems: 'center',
      }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Gift size={22} color="var(--accent-gold)" />
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>Tu Promoción a Aplicar en Caja</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>{ally?.discount}</div>
        </div>
      </div>

      {/* ── BOTÓN GIGANTE: ESCANEAR CÁMARA (TERMINAL) ── */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowScanner(true)}
        disabled={isSaving}
        style={{
          width: '100%',
          padding: '1.4rem 1rem',
          borderRadius: '24px',
          backgroundColor: '#22C55E',
          color: '#121212',
          fontWeight: 900,
          fontSize: '1.25rem',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.8rem',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 35px rgba(34,197,94,0.45)',
          marginBottom: '1.2rem',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}
      >
        <Camera size={26} strokeWidth={2.5} />
        Escanear QR de Cliente
      </motion.button>

      {/* ── VALIDACIÓN MANUAL DIRECTA (SI EL COCHE ESTÁ AFUERA) ── */}
      <div style={{
        backgroundColor: '#161622',
        borderRadius: '20px',
        padding: '1.2rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
          🔍 O Valida Manualmente (Sin cámara)
        </label>
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Escribe # de socio (ej. 0035), código o WhatsApp"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            disabled={isSaving}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: '#FFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isSaving || !manualInput.trim()}
            style={{
              padding: '0.85rem 1.3rem',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: isSaving || !manualInput.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            Validar
          </button>
        </form>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
          Útil si el cliente tiene la calcomanía en su vehículo estacionado.
        </span>
      </div>

      {errorMsg && (
        <div style={{ color: '#ff4444', fontSize: '0.85rem', padding: '0.9rem 1.2rem', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '14px', display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <ShieldAlert size={18} /> {errorMsg}
        </div>
      )}

      {/* ── CONTADOR DEL TURNO & TOTAL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
        {/* Clientes de Hoy */}
        <div className="glass" style={{ borderRadius: '20px', padding: '1.2rem 1rem', textAlign: 'center', border: '1px solid rgba(74,222,128,0.3)', backgroundColor: 'rgba(74,222,128,0.04)' }}>
          <Clock size={18} color="#4ADE80" style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#4ADE80', lineHeight: 1 }}>
            {todayValidations.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 600 }}>
            Validados en tu turno
          </div>
        </div>

        {/* Total Histórico */}
        <div className="glass" style={{ borderRadius: '20px', padding: '1.2rem 1rem', textAlign: 'center', border: '1px solid rgba(212,175,55,0.3)', backgroundColor: 'rgba(212,175,55,0.04)' }}>
          <TrendingUp size={18} color="var(--accent-gold)" style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-gold)', lineHeight: 1 }}>
            {ally?.promotions_given ?? 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 600 }}>
            Total histórico acumulado
          </div>
        </div>
      </div>

      {/* Bitácora de Turno Desplegable */}
      {todayValidations.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowHistoryList(!showHistoryList)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#CBD5E1',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={14} color="#4ADE80" /> Ver clientes atendidos hoy ({todayValidations.length})
            </span>
            {showHistoryList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showHistoryList && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {todayValidations.map((item, idx) => (
                <div key={idx} style={{ padding: '0.6rem 0.9rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>Socio {item.member}</span>
                  <span style={{ color: '#4ADE80', fontWeight: 700 }}>{item.discount}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SEMÁFORO EN PANTALLA COMPLETA (VERDE / ROJO) ── */}
      <AnimatePresence>
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: validationResult.status === 'valid'
                ? 'radial-gradient(ellipse at center, #059669 0%, #022c22 100%)'
                : 'radial-gradient(ellipse at center, #DC2626 0%, #450A0A 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem 1.5rem',
              color: '#FFF',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            {/* Botón cerrar esquina */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setValidationResult(null)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Contenido Central */}
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              {validationResult.status === 'valid' ? (
                <div>
                  {/* Ícono gigante verde con halo */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '3px solid #FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.2rem',
                      boxShadow: '0 0 50px rgba(255,255,255,0.5)'
                    }}
                  >
                    <Check size={62} strokeWidth={3.5} color="#FFF" />
                  </motion.div>

                  <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                    ¡DISTINTIVO VÁLIDO! ✓
                  </h1>

                  <p style={{ fontSize: '1rem', color: '#D1FAE5', margin: '0 0 1.5rem', fontWeight: 600 }}>
                    {validationResult.message}
                  </p>

                  {/* CAJA GIGANTE DE DESCUENTO A APLICAR */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    color: '#064E3B',
                    borderRadius: '24px',
                    padding: '1.8rem 1.2rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                    border: '3px solid var(--accent-gold)'
                  }}>
                    <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 900, color: '#047857', marginBottom: '6px' }}>
                      APLICAR EN CUENTA O TICKET:
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#064E3B', lineHeight: 1.1 }}>
                      {validationResult.discountToApply || ally?.discount}
                    </div>
                  </div>

                  {/* Datos del Socio */}
                  <div style={{
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    borderRadius: '18px',
                    padding: '1rem 1.2rem',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A7F3D0', fontWeight: 800 }}>Socio</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
                        #{String(validationResult.member_number || 1).padStart(4, '0')}
                      </div>
                    </div>
                    <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A7F3D0', fontWeight: 800 }}>Distintivo</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>
                        {getLevelInfo(validationResult.level).name}
                      </div>
                    </div>
                  </div>

                  {/* Pasaporte & Sellos de Lealtad */}
                  {validationResult.totalVisits !== undefined && (
                    <div style={{
                      marginTop: '0.9rem',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '16px',
                      padding: '0.8rem 1rem',
                      border: '1px solid rgba(255,255,255,0.2)',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 800, color: '#FDE047' }}>
                        ⭐ Visita #{validationResult.totalVisits} en comercios aliados
                      </div>
                      {validationResult.achievedMilestone ? (
                        <div style={{
                          marginTop: '6px',
                          backgroundColor: 'rgba(234,179,8,0.25)',
                          border: '1px solid #EAB308',
                          borderRadius: '10px',
                          padding: '6px 8px',
                          fontSize: '0.78rem',
                          color: '#FEF08A',
                          fontWeight: 700
                        }}>
                          🎉 ¡META ALCANZADA! El socio desbloqueó:<br />
                          <strong>{validationResult.achievedMilestone.reward}</strong>
                        </div>
                      ) : validationResult.nextMilestone ? (
                        <div style={{ fontSize: '0.72rem', color: '#D1FAE5', marginTop: '4px' }}>
                          Faltan {Math.max(0, validationResult.nextMilestone.visits - (validationResult.totalVisits || 0))} visitas para su premio ({validationResult.nextMilestone.badgeName})
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                /* PANTALLA ROJA DE ERROR */
                <div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '3px solid #FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.2rem',
                      boxShadow: '0 0 40px rgba(0,0,0,0.4)'
                    }}
                  >
                    <AlertTriangle size={52} color="#FFF" />
                  </motion.div>

                  <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 0.8rem', letterSpacing: '-0.02em' }}>
                    DISTINTIVO NO VÁLIDO
                  </h1>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '1.05rem', color: '#FEE2E2', margin: 0, lineHeight: 1.5 }}>
                      {validationResult.message}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#FCA5A5', marginTop: '8px', marginBottom: 0 }}>
                      Pide al cliente que abra su Membresía Digital o verifique su código en redidentidad.vercel.app
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Inferior de Cierre Rápido */}
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setValidationResult(null)}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  borderRadius: '18px',
                  backgroundColor: '#FFFFFF',
                  color: validationResult.status === 'valid' ? '#064E3B' : '#7F1D1D',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  letterSpacing: '0.02em'
                }}
              >
                {validationResult.status === 'valid' ? '✓ Listo / Siguiente Cliente' : '← Volver a Intentar'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal del Escáner de Cámara */}
      {showScanner && (
        <QrScannerModal
          onScanSuccess={handleScanQRSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Instrucciones de Uso */}
      <div className="glass" style={{ borderRadius: '18px', padding: '1.2rem', border: '1px solid var(--glass-border)', marginTop: '1rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--accent-white)' }}>Guía Rápida para el Cajero:</strong><br />
          1. Toca <strong>"Escanear QR de Cliente"</strong> para apuntar al QR de la calcomanía o membresía digital.<br />
          2. La pantalla se pondrá <strong>VERDE en grande</strong> con el descuento que debes aplicar en su cuenta.<br />
          3. Si el cliente dejó el auto afuera, escribe su número de socio o WhatsApp en la casilla manual.
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
