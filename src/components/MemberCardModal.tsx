import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, Crown, Sparkles, Smartphone, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoyaltyPassportModal } from './LoyaltyPassportModal';
import { generateDynamicQrPayload } from '../lib/dynamicQr';

interface LocalUser {
  phone: string;
  member_number: number;
  level: string;
  code: string;
}

interface MemberCardModalProps {
  user: LocalUser;
  onClose: () => void;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({ user, onClose }) => {
  const [showPassport, setShowPassport] = useState(false);
  
  // Estado para el QR dinámico con rotación de 60 segundos
  const [dynamicPayload, setDynamicPayload] = useState(() => 
    generateDynamicQrPayload(user.code, user.member_number)
  );
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [liveClock, setLiveClock] = useState('');

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Temporizador de 1 segundo para el reloj en vivo y la cuenta regresiva del QR dinámico
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('es-MX', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();

    const interval = setInterval(() => {
      updateTime();
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Regenerar el QR dinámico cuando llegue a cero
          setDynamicPayload(generateDynamicQrPayload(user.code, user.member_number));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user.code, user.member_number]);

  const getLevelInfo = (level: string) => {
    if (user.code?.startsWith('DIG-') || level?.toLowerCase() === 'digital') {
      return { name: 'MEMBRESÍA DIGITAL OFICIAL', color: '#38BDF8', icon: Crown, bg: 'rgba(56,189,248,0.2)' };
    }
    if (user.code?.startsWith('TRIAL-') || level?.toLowerCase() === 'trial') {
      return { name: 'PASE DE PRUEBA 24H', color: '#4ADE80', icon: Sparkles, bg: 'rgba(74,222,128,0.2)' };
    }
    switch (level?.toLowerCase()) {
      case 'campechana_blanca':
      case 'blanca':
        return { name: 'CAMPECHANA SOY (BLANCA VIP)', color: '#FFFFFF', icon: Crown, bg: 'rgba(255,255,255,0.2)' };
      case 'campechana_rosa':
      case 'rosa':
        return { name: 'CAMPECHANA SOY (ROSA VIP)', color: '#FF5C9D', icon: Crown, bg: 'rgba(255,92,157,0.2)' };
      case 'campechana_negra':
      case 'negra':
        return { name: 'CAMPECHANA SOY (NEGRA VIP)', color: '#D4AF37', icon: Crown, bg: 'rgba(212,175,55,0.2)' };
      case 'digital':
        return { name: 'MEMBRESÍA DIGITAL OFICIAL', color: '#38BDF8', icon: Crown, bg: 'rgba(56,189,248,0.2)' };
      case 'trial':
        return { name: 'PASE DE PRUEBA 24H', color: '#4ADE80', icon: Sparkles, bg: 'rgba(74,222,128,0.2)' };
      case 'gold':
        return { name: 'VIP DORADO', color: '#D4AF37', icon: Crown, bg: 'rgba(212,175,55,0.15)' };
      case 'silver':
        return { name: 'COLECCIÓN PLATA', color: '#C0C0C0', icon: Sparkles, bg: 'rgba(192,192,192,0.15)' };
      default:
        return { name: 'MIEMBRO ESENCIAL', color: '#4ADE80', icon: ShieldCheck, bg: 'rgba(74,222,128,0.15)' };
    }
  };

  const levelInfo = getLevelInfo(user.level);
  const IconComponent = levelInfo.icon;
  const qrValue = dynamicPayload.url;

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
        zIndex: 99998,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '380px',
          borderRadius: '30px',
          padding: '2rem 1.5rem',
          position: 'relative',
          border: `1px solid ${levelInfo.color}40`,
          boxShadow: `0 0 40px ${levelInfo.color}25`,
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
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Level Badge Header */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: levelInfo.bg,
            border: `1px solid ${levelInfo.color}`,
            color: levelInfo.color,
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '0.8rem',
          }}
        >
          <IconComponent size={16} />
          {levelInfo.name}
        </div>

        <h2 style={{ fontSize: '1.35rem', color: '#FFF', marginBottom: '0.2rem' }}>
          Membresía Digital
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Muestra este código en comercios aliados para aplicar tus beneficios.
        </p>

        {/* Indicador de Seguridad y Reloj en Vivo Anti-Captura */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(74, 222, 128, 0.09)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          borderRadius: '12px',
          padding: '6px 12px',
          marginBottom: '0.8rem',
          fontSize: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontWeight: 700 }}>
            <span style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: '#4ADE80', 
              display: 'inline-block', 
              boxShadow: '0 0 10px #4ADE80',
              animation: 'pulse 2s infinite'
            }} />
            EN VIVO • {liveClock}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-dim)' }}>
            <Clock size={12} color="var(--accent-gold)" />
            <span>Renueva: <strong style={{ color: '#FFF' }}>{secondsLeft}s</strong></span>
          </div>
        </div>

        {/* Barra de expiración regresiva */}
        <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.8rem' }}>
          <div style={{ 
            width: `${(secondsLeft / 60) * 100}%`, 
            height: '100%', 
            backgroundColor: secondsLeft <= 10 ? '#EF4444' : 'var(--accent-gold)', 
            transition: 'width 1s linear' 
          }} />
        </div>

        {/* QR Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.2rem',
            borderRadius: '24px',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            marginBottom: '0.6rem',
          }}
        >
          <QRCodeSVG value={qrValue} size={190} level="H" />
        </div>

        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.8rem' }}>
          🔒 Código de seguridad temporal. Capturas de pantalla no son válidas en comercios.
        </div>

        {/* Code & Phone */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '0.8rem 1rem',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--accent-gold)' }}>
            {user.code || `RED-${String(user.member_number).padStart(4, '0')}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <Smartphone size={14} color="var(--accent-gold)" /> WhatsApp: {user.phone}
          </div>
        </div>

        {/* Botón Pasaporte de Visitas */}
        <button
          onClick={() => setShowPassport(true)}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.85rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(212,175,55,0.15)',
            border: '1.5px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Award size={18} /> Ver Mi Pasaporte de Visitas & Sellos
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '0.6rem',
            padding: '0.85rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: '#FFF',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Cerrar Membresía
        </button>
      </motion.div>

      {/* Modal de Pasaporte */}
      <LoyaltyPassportModal
        isOpen={showPassport}
        onClose={() => setShowPassport(false)}
        user={{
          code: user.code,
          member_number: user.member_number,
          phone: user.phone
        }}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};
