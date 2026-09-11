import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Gift, Volume2, VolumeX, Phone, MessageCircle, 
  RefreshCw, Eye, EyeOff, CheckCircle2, Award, Calendar,
  Trash2, Users, Play, Crown
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface WinnerRecord {
  id: string;
  member_number: number;
  code: string;
  phone: string;
  level: string;
  prize: string;
  date: string;
}

// Generador de sonidos nativos Web Audio API (0 dependencias externas)
class SorteoSoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTick(pitch: number = 600) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio fallback
    }
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Acorde triunfal: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.8);
      });
    } catch (e) {
      // Audio fallback
    }
  }
}

const soundFX = new SorteoSoundFX();

export const SorteosRuleta: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [prizeName, setPrizeName] = useState<string>('Premio de la Red Identidad 🎁');
  const [hidePhoneDigits, setHidePhoneDigits] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Estados de la Ruleta / Giro
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [displayCandidate, setDisplayCandidate] = useState<any | null>(null);
  const [winner, setWinner] = useState<any | null>(null);
  const [winnersHistory, setWinnersHistory] = useState<WinnerRecord[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationTimerRef = useRef<any>(null);

  // Cargar historial de ganadores guardado
  useEffect(() => {
    try {
      const saved = localStorage.getItem('red_identidad_sorteos_history');
      if (saved) {
        setWinnersHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error al leer historial de ganadores:', e);
    }
    fetchActiveMembers();

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  const fetchActiveMembers = async () => {
    setIsLoading(true);
    try {
      let allStickers: any[] = [];
      let from = 0;
      const step = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('stickers')
          .select('*')
          .not('phone', 'is', null)
          .order('member_number', { ascending: true })
          .range(from, from + step - 1);

        if (error) throw error;
        if (!data || data.length === 0) break;
        allStickers = allStickers.concat(data);
        if (data.length < step) break;
        from += step;
      }

      // Filtrar aquellos que realmente tengan teléfono válido registrado
      const registered = allStickers.filter(s => s.phone && String(s.phone).trim() !== '');
      setMembers(registered);

      if (registered.length > 0 && !displayCandidate) {
        setDisplayCandidate(registered[0]);
      }
    } catch (err) {
      console.error('Error al cargar participantes del sorteo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado de participantes según categoría
  const eligibleMembers = members.filter(m => {
    if (selectedFilter === 'all') return true;
    const lvl = (m.level || '').toLowerCase();
    const code = (m.code || '').toUpperCase();
    if (selectedFilter === 'campechana') {
      return lvl.includes('campechana') || code.includes('ROSA') || code.includes('NEGR') || code.includes('BLAN');
    }
    if (selectedFilter === 'campechano') {
      return lvl.includes('campechano') || code.startsWith('CB-') || code.startsWith('CN-');
    }
    if (selectedFilter === 'carmelita') {
      return lvl.includes('carmelita') || code.startsWith('CRB-') || code.startsWith('CRN-');
    }
    if (selectedFilter === 'gold') {
      return lvl.includes('gold') || lvl.includes('vip') || code.includes('GOLD') || code.includes('TESORO');
    }
    return true;
  });

  // Efecto Confeti en Canvas
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const colors = ['#D4AF37', '#FFDF73', '#FF5C9D', '#FFFFFF', '#60A5FA', '#34D399'];
    const particles: any[] = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 8 + 4,
        h: Math.random() * 14 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 15,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        gravity: 0.28,
        opacity: 1
      });
    }

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        if (frame > 40) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      frame++;
      if (active && frame < 180) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  // Función principal: Iniciar el giro de la Ruleta
  const startSpin = () => {
    if (eligibleMembers.length === 0 || isSpinning) return;

    setWinner(null);
    setIsSpinning(true);

    // Escoger al ganador de forma aleatoria
    const winnerIndex = Math.floor(Math.random() * eligibleMembers.length);
    const chosenWinner = eligibleMembers[winnerIndex];

    const totalDuration = 4800; // 4.8 segundos de emoción
    const startTime = Date.now();
    let currentDelay = 40;

    const runStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / totalDuration;

      const randomCandidate = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
      setDisplayCandidate(randomCandidate);

      const pitch = 300 + (1 - progress) * 500;
      soundFX.playTick(pitch);

      if (progress < 1) {
        currentDelay = 40 + Math.pow(progress, 3) * 350;
        animationTimerRef.current = setTimeout(runStep, currentDelay);
      } else {
        setDisplayCandidate(chosenWinner);
        setWinner(chosenWinner);
        setIsSpinning(false);
        soundFX.playVictory();
        triggerConfetti();
      }
    };

    runStep();
  };

  // Guardar ganador en el historial
  const saveWinnerToHistory = () => {
    if (!winner) return;

    const newRecord: WinnerRecord = {
      id: Date.now().toString(),
      member_number: winner.member_number,
      code: winner.code,
      phone: winner.phone,
      level: formatLevel(winner.level),
      prize: prizeName || 'Premio Oficial Red Identidad',
      date: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newRecord, ...winnersHistory];
    setWinnersHistory(updated);
    try {
      localStorage.setItem('red_identidad_sorteos_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error al guardar ganador:', e);
    }
  };

  const deleteWinnerFromHistory = (id: string) => {
    const filtered = winnersHistory.filter(w => w.id !== id);
    setWinnersHistory(filtered);
    try {
      localStorage.setItem('red_identidad_sorteos_history', JSON.stringify(filtered));
    } catch (e) {}
  };

  const clearWinnersHistory = () => {
    if (confirm('¿Deseas vaciar todo el historial de ganadores de los sorteos?')) {
      setWinnersHistory([]);
      localStorage.removeItem('red_identidad_sorteos_history');
    }
  };

  const formatLevel = (lvl: string) => {
    if (!lvl) return 'Oficial';
    const s = lvl.toLowerCase();
    if (s.includes('blanca')) return 'Campechana Blanca';
    if (s.includes('rosa')) return 'Campechana Rosa';
    if (s.includes('negra')) return 'Campechana Negra';
    if (s.includes('carmelita')) return 'Carmelita Soy';
    if (s.includes('campechano')) return 'Campechano Soy';
    if (s.includes('gold')) return 'Tesoro VIP Gold';
    return s.replace(/_/g, ' ');
  };

  const maskPhone = (phoneStr: string) => {
    if (!phoneStr) return '---';
    const clean = phoneStr.replace(/\D/g, '');
    if (!hidePhoneDigits || clean.length < 7) return phoneStr;
    const start = clean.slice(0, 3);
    const end = clean.slice(-2);
    return `${start} *** **${end}`;
  };

  const getWhatsAppWinnerLink = () => {
    if (!winner || !winner.phone) return '#';
    const rawPhone = winner.phone.replace(/\D/g, '');
    const phone = rawPhone.length === 10 ? `52${rawPhone}` : rawPhone;
    const msg = `¡Hola! 🥳🎊 Te contactamos de la coordinación oficial de *Red Identidad*.\n\n` +
      `¡Muchas felicidades! Tu calcomanía oficial *#${String(winner.member_number).padStart(4, '0')}* (Código: *${winner.code}* - ${formatLevel(winner.level)}) ha resultado *GANADORA* en nuestro sorteo oficial 🎉🚗💨\n\n` +
      `🎁 *Premio Ganado:* ${prizeName}\n\n` +
      `Por favor respóndenos a este mensaje para coordinar la entrega o validación de tu premio. ¡Gracias por formar parte de la Red Identidad! 🌟`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', color: '#FFF' }}>
      
      {/* ── Encabezado de la Sección de Sorteos ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(20,20,26,0.95) 100%)',
        border: '1.5px solid rgba(212,175,55,0.4)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'rgba(212,175,55,0.2)',
            border: '1px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}>
            <Gift size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', margin: 0, letterSpacing: '-0.01em' }}>
              Ruleta & Sorteos en Vivo
            </h2>
            <p style={{ margin: '2px 0 0', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              Sortea premios reales en vivo entre los conductores y miembros activos con calcomanía.
            </p>
          </div>
        </div>

        {/* Acciones de Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFX.enabled = next;
            }}
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '10px',
              backgroundColor: soundEnabled ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: soundEnabled ? 'var(--accent-gold)' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {soundEnabled ? 'Audio On' : 'Mudo'}
          </button>

          <button
            onClick={() => setHidePhoneDigits(!hidePhoneDigits)}
            title="Ocultar parte del teléfono en pantalla (Recomendado para transmisiones en vivo)"
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '10px',
              backgroundColor: hidePhoneDigits ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: hidePhoneDigits ? '#93C5FD' : '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            {hidePhoneDigits ? <EyeOff size={16} /> : <Eye size={16} />}
            {hidePhoneDigits ? 'Privacidad Activa' : 'Teléfono Completo'}
          </button>

          <button
            onClick={fetchActiveMembers}
            disabled={isLoading || isSpinning}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {/* ── Controles del Sorteo ── */}
      <div style={{
        backgroundColor: '#16161E',
        borderRadius: '16px',
        padding: '1.2rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.4rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            🎁 Premio a Sortear
          </label>
          <input
            type="text"
            value={prizeName}
            onChange={(e) => setPrizeName(e.target.value)}
            placeholder="Ej. Premio Especial, $1,000 en Efectivo..."
            disabled={isSpinning}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,175,55,0.4)',
              borderRadius: '10px',
              color: '#FFF',
              fontSize: '0.9rem',
              fontWeight: 700,
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            🎯 Grupo de Calcomanías Participantes
          </label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            disabled={isSpinning}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              color: '#FFF',
              fontSize: '0.88rem',
              fontWeight: 700,
              outline: 'none'
            }}
          >
            <option value="all" style={{ color: '#000' }}>⭐ Todos los Miembros Registrados ({members.length})</option>
            <option value="campechana" style={{ color: '#000' }}>🌸 Edición Campechana Soy (Blanca, Rosa, Negra)</option>
            <option value="campechano" style={{ color: '#000' }}>🏰 Edición Campechano Soy (Puerta de Tierra)</option>
            <option value="carmelita" style={{ color: '#000' }}>🌊 Edición Carmelita Soy (Carmen)</option>
            <option value="gold" style={{ color: '#000' }}>👑 Ediciones Doradas / Tesoros VIP</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            👥 Participantes Calificados
          </label>
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#4ADE80'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} /> {eligibleMembers.length} Miembros Activos
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              100% con Teléfono
            </span>
          </div>
        </div>
      </div>

      {/* ── ESCENARIO DE LA RULETA / TOMBOLA DIGITAL ── */}
      <div style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at center, #1E1B2E 0%, #0D0D12 100%)',
        borderRadius: '24px',
        border: winner ? '2.5px solid var(--accent-gold)' : '1.5px solid rgba(212,175,55,0.3)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        boxShadow: winner ? '0 0 50px rgba(212,175,55,0.35)' : '0 10px 40px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        {/* Canvas transparente para confeti */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 20
          }}
        />

        {/* Luces decorativas superiores */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '1.2rem'
        }}>
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isSpinning 
                  ? (i % 2 === 0 ? 'var(--accent-gold)' : '#FF5C9D') 
                  : (winner ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'),
                boxShadow: isSpinning || winner ? '0 0 10px var(--accent-gold)' : 'none',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        {/* Display del Tambor / Cilindro de Giro */}
        <div style={{
          maxWidth: '460px',
          margin: '0 auto 1.8rem',
          backgroundColor: '#09090D',
          borderRadius: '20px',
          padding: '1.8rem 1rem',
          border: '2px solid rgba(212,175,55,0.5)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 0 20px rgba(212,175,55,0.15)',
          position: 'relative'
        }}>
          {/* Indicador flecha de selección central */}
          <div style={{
            position: 'absolute',
            left: '-14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderLeft: '14px solid var(--accent-gold)',
            filter: 'drop-shadow(0 0 6px var(--accent-gold))'
          }} />
          <div style={{
            position: 'absolute',
            right: '-14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '14px solid var(--accent-gold)',
            filter: 'drop-shadow(0 0 6px var(--accent-gold))'
          }} />

          {eligibleMembers.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--text-dim)' }}>
              No hay miembros registrados en este grupo para sortear.
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-gold)', fontWeight: 800, marginBottom: '6px' }}>
                {isSpinning ? '🎲 SELECCIONANDO AL AZAR...' : (winner ? '🎉 ¡DISTINTIVO GANADOR!' : 'PRÓXIMO A PARTICIPAR')}
              </div>

              {/* Número de socio en Gigante */}
              <div style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                color: winner ? 'var(--accent-gold)' : '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1,
                marginBottom: '0.5rem',
                textShadow: winner ? '0 0 25px rgba(212,175,55,0.7)' : 'none',
                fontFamily: 'monospace'
              }}>
                #{String(displayCandidate?.member_number || 1).padStart(4, '0')}
              </div>

              {/* Código y Calcomanía */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#FFF',
                marginBottom: '8px'
              }}>
                <Award size={14} color="var(--accent-gold)" />
                <span>{displayCandidate?.code || 'RED-0000'}</span>
                <span>•</span>
                <span style={{ color: 'var(--accent-gold)' }}>{formatLevel(displayCandidate?.level)}</span>
              </div>

              {/* Teléfono enmascarado o visible */}
              <div style={{ fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Phone size={14} color="#4ADE80" />
                <span>{maskPhone(displayCandidate?.phone)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Botón Gigante de Lanzamiento */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={!isSpinning ? { scale: 1.04 } : {}}
            whileTap={!isSpinning ? { scale: 0.96 } : {}}
            onClick={startSpin}
            disabled={isSpinning || eligibleMembers.length === 0}
            style={{
              padding: '1.2rem 2.8rem',
              borderRadius: '100px',
              backgroundColor: isSpinning ? '#555' : 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 900,
              fontSize: '1.15rem',
              border: 'none',
              cursor: isSpinning || eligibleMembers.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              boxShadow: isSpinning ? 'none' : '0 0 35px rgba(212,175,55,0.5)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            {isSpinning ? (
              <>
                <RefreshCw size={22} className="animate-spin" /> Girando Ruleta...
              </>
            ) : (
              <>
                <Play size={22} fill="#121212" /> ¡Girar Ruleta de la Suerte!
              </>
            )}
          </motion.button>
        </div>

        {/* ── TARJETA DEL GANADOR Y ACCIÓN DE WHATSAPP ── */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(212,175,55,0.12)',
                border: '2px solid var(--accent-gold)',
                borderRadius: '18px',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.2rem'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Crown size={16} /> ¡Tenemos Ganador Confirmado!
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', margin: '0 0 4px' }}>
                  Socio #{String(winner.member_number).padStart(4, '0')} — {winner.code}
                </h3>
                <p style={{ margin: 0, color: '#E2E8F0', fontSize: '0.9rem' }}>
                  🏆 <strong>Premio:</strong> {prizeName} &nbsp;|&nbsp; 📱 <strong>Teléfono:</strong> {winner.phone}
                </p>
                <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                  Registrado con calcomanía <strong>{formatLevel(winner.level)}</strong>
                </p>
              </div>

              {/* Botones de Notificación y Guardado */}
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <a
                  href={getWhatsAppWinnerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.9rem 1.4rem',
                    borderRadius: '12px',
                    backgroundColor: '#25D366',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(37,211,102,0.4)',
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={18} /> Felicitar por WhatsApp
                </a>

                <button
                  onClick={saveWinnerToHistory}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} color="var(--accent-gold)" /> Guardar en Historial
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HISTORIAL DE GANADORES VERIFICADOS ── */}
      <div style={{
        backgroundColor: '#16161E',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.2rem',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Historial de Ganadores ({winnersHistory.length})
            </h3>
          </div>

          {winnersHistory.length > 0 && (
            <button
              onClick={clearWinnersHistory}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF4444',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={14} /> Vaciar Historial
            </button>
          )}
        </div>

        {winnersHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: 'var(--text-dim)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <Trophy size={32} style={{ opacity: 0.3, marginBottom: '0.6rem' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#CBD5E1' }}>Aún no hay ganadores registrados</div>
            <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
              Gira la ruleta y presiona "Guardar en Historial" para llevar la bitácora oficial.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {winnersHistory.map((w) => (
              <div
                key={w.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(212,175,55,0.15)',
                    border: '1px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    color: 'var(--accent-gold)',
                    fontSize: '0.85rem'
                  }}>
                    #{String(w.member_number).padStart(3, '0')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF' }}>
                      {w.prize}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span>Código: <strong style={{ color: '#FFF' }}>{w.code}</strong></span>
                      <span>•</span>
                      <span>{w.level}</span>
                      <span>•</span>
                      <span>📱 {hidePhoneDigits ? maskPhone(w.phone) : w.phone}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {w.date}
                  </span>
                  <a
                    href={`https://wa.me/${w.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola! Te contactamos de Red Identidad respecto a tu premio de: ${w.prize}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Enviar WhatsApp"
                    style={{
                      padding: '0.4rem 0.7rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(37,211,102,0.15)',
                      border: '1px solid rgba(37,211,102,0.3)',
                      color: '#4ADE80',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <MessageCircle size={13} /> Contactar
                  </a>
                  <button
                    onClick={() => deleteWinnerFromHistory(w.id)}
                    title="Eliminar registro"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SorteosRuleta;
