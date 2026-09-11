import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, Crown, Sparkles, Smartphone, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoyaltyPassportModal } from './LoyaltyPassportModal';

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

  const getLevelInfo = (level: string) => {
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
          Membresía Digital
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
};
