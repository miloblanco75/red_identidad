import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, Crown, Sparkles, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const getLevelInfo = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'campechana_rosa':
      case 'rosa':
        return { name: 'CAMPECHANA SOY (ROSA VIP)', color: '#FF5C9D', icon: Crown, bg: 'rgba(255,92,157,0.2)' };
      case 'campechana_negra':
      case 'negra':
        return { name: 'CAMPECHANA SOY (NEGRA VIP)', color: '#D4AF37', icon: Crown, bg: 'rgba(212,175,55,0.2)' };
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
  const qrValue = user.code ? `https://redidentidad.vercel.app/registro?c=${user.code}` : `RED-${String(user.member_number).padStart(4, '0')}`;

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
            marginBottom: '1rem',
          }}
        >
          <IconComponent size={16} />
          {levelInfo.name}
        </div>

        <h2 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '0.2rem' }}>
          Carné Digital de Miembro
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          Muestra este código en comercios aliados para aplicar tus beneficios.
        </p>

        {/* QR Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.2rem',
            borderRadius: '24px',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            marginBottom: '1.2rem',
          }}
        >
          <QRCodeSVG value={qrValue} size={200} level="H" />
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

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.9rem',
            borderRadius: '14px',
            backgroundColor: 'var(--accent-gold)',
            color: '#121212',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          Cerrar Carné
        </button>
      </motion.div>
    </div>
  );
};
