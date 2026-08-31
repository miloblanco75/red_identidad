import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, CheckCircle2, MessageCircle, Car, Laptop, Smartphone, Bike } from 'lucide-react';

interface UploadStickerPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadStickerPhotoModal: React.FC<UploadStickerPhotoModalProps> = ({ isOpen, onClose }) => {
  const [placementType, setPlacementType] = useState<'coche' | 'laptop' | 'telefono' | 'otro'>('coche');
  const [userName, setUserName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const ADMIN_PHONE = '9811971305';

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const placementText = placementType === 'coche' ? '🚗 Coche / Vehículo' :
                          placementType === 'laptop' ? '💻 Laptop / Computadora' :
                          placementType === 'telefono' ? '📱 Teléfono / Funda' : '🏍️ Otro';

    const message = `¡Hola! 👋 Quiero compartir la foto de mi distintivo oficial en la comunidad Red Identidad.\n\n` +
      `👤 *Nombre / Campechano:* ${userName.trim()}\n` +
      `📍 *Ubicación del Distintivo:* ${placementText}\n\n` +
      `📸 Adjunto mi foto para aparecer en el mural de la comunidad. ¡Orgullo Campechano!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/52${ADMIN_PHONE}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setIsSent(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.8rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="glass premium-glow-gold"
          style={{
            width: '100%',
            maxWidth: '460px',
            maxHeight: '92vh',
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '1.4rem',
            backgroundColor: '#141416',
            border: '1px solid rgba(212,175,55,0.35)',
            position: 'relative'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          {isSent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', border: '1px solid var(--accent-gold)' }}>
                <CheckCircle2 size={34} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>¡Foto Lista para Compartir!</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1.4rem', lineHeight: 1.45 }}>
                Hemos preparado tu mensaje en WhatsApp (<strong>{ADMIN_PHONE}</strong>). Adjunta la foto elegida en la conversación para publicarla en el mural de la comunidad.
              </p>
              <button
                onClick={() => { setIsSent(false); onClose(); }}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Volver a la Galería
              </button>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Camera color="var(--accent-gold)" size={22} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Sube la Foto de tu Distintivo</h3>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginBottom: '1.2rem', lineHeight: 1.4 }}>
                ¿Ya pegaste tu distintivo en tu vehículo, compu o celular? Muestra tu orgullo campechano y aparece en la comunidad.
              </p>

              <form onSubmit={handleSubmit}>
                {/* 1. ¿Dónde lo pegaste? */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                    1. ¿Dónde tienes tu distintivo?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => setPlacementType('coche')}
                      style={{
                        padding: '0.65rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: placementType === 'coche' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                        color: placementType === 'coche' ? 'var(--accent-gold)' : '#FFF',
                        border: placementType === 'coche' ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Car size={16} /> Coche / Auto
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlacementType('laptop')}
                      style={{
                        padding: '0.65rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: placementType === 'laptop' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                        color: placementType === 'laptop' ? 'var(--accent-gold)' : '#FFF',
                        border: placementType === 'laptop' ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Laptop size={16} /> Laptop / Compu
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlacementType('telefono')}
                      style={{
                        padding: '0.65rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: placementType === 'telefono' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                        color: placementType === 'telefono' ? 'var(--accent-gold)' : '#FFF',
                        border: placementType === 'telefono' ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Smartphone size={16} /> Teléfono / Cel
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlacementType('otro')}
                      style={{
                        padding: '0.65rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: placementType === 'otro' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                        color: placementType === 'otro' ? 'var(--accent-gold)' : '#FFF',
                        border: placementType === 'otro' ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Bike size={16} /> Moto / Otro
                    </button>
                  </div>
                </div>

                {/* 2. Nombre del usuario */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                    2. Tu Nombre o Apodo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos M. (Campeche Centro)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* 3. Selección / Previsualización de Foto */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                    3. Selecciona la foto desde tu dispositivo:
                  </label>

                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: photoPreview ? '0.5rem' : '1.2rem 1rem',
                    borderRadius: '16px',
                    border: '2px dashed rgba(212,175,55,0.4)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      style={{ display: 'none' }}
                    />
                    {photoPreview ? (
                      <div style={{ position: 'relative', width: '100%', maxHeight: '180px', borderRadius: '12px', overflow: 'hidden' }}>
                        <img src={photoPreview} alt="Previsualización" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.75)', color: '#FFF', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px' }}>
                          Toca para cambiar foto
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} color="var(--accent-gold)" style={{ marginBottom: '0.4rem' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>
                          Toca aquí para elegir tu foto 📸
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Formatos aceptados: JPG, PNG o Foto de Cámara
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    borderRadius: '14px',
                    backgroundColor: '#25D366',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)'
                  }}
                >
                  <MessageCircle size={18} /> Enviar Foto por WhatsApp
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadStickerPhotoModal;
