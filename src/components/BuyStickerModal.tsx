import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CheckCircle2, MessageCircle, User, Phone, Store, Navigation } from 'lucide-react';
import StickerQRCode from './StickerQRCode';

interface BuyStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSticker?: string;
}

export const BuyStickerModal: React.FC<BuyStickerModalProps> = ({ isOpen, onClose, initialSticker }) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'stores'>('whatsapp');
  const [selectedSticker, setSelectedSticker] = useState<string>(initialSticker || 'campechano_negra');
  const [fullName, setFullName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  React.useEffect(() => {
    if (initialSticker) {
      setSelectedSticker(initialSticker);
    }
  }, [initialSticker]);

  const ADMIN_PHONE = '9811971305';
  const pricePerUnit = 90;

  // Catálogo exacto de 7 distintivos
  const stickerOptions = [
    { id: 'campechano_blanca', label: 'Campechano — Blanca', tag: 'Blanca', bg: '#FFF', color: '#000' },
    { id: 'campechano_negra', label: 'Campechano — Negra', tag: 'Negra', bg: '#333', color: '#FFF' },
    
    { id: 'carmelita_blanca', label: 'Carmelita — Blanca', tag: 'Blanca', bg: '#FFF', color: '#000' },
    { id: 'carmelita_negra', label: 'Carmelita — Negra', tag: 'Negra', bg: '#333', color: '#FFF' },
    { id: 'carmelita_rosa', label: 'Carmelita — Rosa', tag: 'Rosa', bg: '#FF69B4', color: '#FFF' },

    { id: 'campechana_negra', label: 'Campechana — Negra', tag: 'Negra', bg: '#333', color: '#FFF' },
    { id: 'campechana_rosa', label: 'Campechana — Rosa', tag: 'Rosa', bg: '#FF69B4', color: '#FFF' },
  ];

  // Puntos de Venta Físicos
  const physicalStores = [
    {
      city: 'San Francisco de Campeche',
      name: 'Maneki Neko',
      address: 'Plaza del Mar',
      hours: 'Punto de Venta Oficial',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Barbería Mdoce',
      address: 'Avenida Concordia',
      hours: 'Punto de Venta Oficial',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Lavadero Royal Shine',
      address: 'Avenida Central',
      hours: 'Punto de Venta Oficial',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Refaccionaria Bahía',
      address: 'Avenida Hidalgo',
      hours: 'Punto de Venta Oficial',
      phone: '9811971305'
    },
    {
      city: 'San Francisco de Campeche',
      name: 'Gesti+',
      address: 'Av. Ruiz Cortines (contra esquina del Palacio Federal)',
      hours: 'Punto de Venta Oficial',
      phone: '9811971305'
    }
  ];

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !userPhone.trim()) return;

    const chosenOption = stickerOptions.find(s => s.id === selectedSticker);
    const chosenName = chosenOption ? chosenOption.label : 'Campechano — Negra';

    const message = `¡Hola! 👋 Me interesa adquirir mi distintivo oficial.\n\n` +
      `📋 *Mis Datos de Contacto:*\n` +
      `• Nombre: ${fullName.trim()}\n` +
      `• Teléfono: ${userPhone.trim()}\n` +
      `• Distintivo Elegido: ${chosenName}\n` +
      `• Precio: $${pricePerUnit} MXN\n\n` +
      `Quedo atento para comunicarnos y coordinar la entrega. ¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/52${ADMIN_PHONE}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setIsOrdered(true);
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
            borderRadius: '22px',
            padding: '1.2rem',
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
              top: '0.9rem',
              right: '0.9rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          {isOrdered ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', border: '1px solid var(--accent-gold)' }}>
                <CheckCircle2 size={32} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem' }}>¡Solicitud Enviada por WhatsApp!</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1.4rem', lineHeight: 1.45 }}>
                Hemos abierto WhatsApp con tus datos. Nos comunicaremos de inmediato al número <strong>{ADMIN_PHONE}</strong> para coordinar tu distintivo.
              </p>
              <button
                onClick={() => { setIsOrdered(false); onClose(); }}
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
                Volver a la Plataforma
              </button>
            </div>
          ) : (
            <div>
              {/* Header Ultra Compacto */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <ShoppingBag color="var(--accent-gold)" size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Obtener Distintivo ($90 MXN)</h3>
              </div>

              {/* Selector de Modo: WhatsApp vs Puntos de Venta Físicos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  style={{
                    padding: '8px',
                    borderRadius: '9px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'whatsapp' ? 'var(--accent-gold)' : 'transparent',
                    color: activeTab === 'whatsapp' ? '#121212' : 'var(--text-dim)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('stores')}
                  style={{
                    padding: '8px',
                    borderRadius: '9px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'stores' ? 'var(--accent-gold)' : 'transparent',
                    color: activeTab === 'stores' ? '#121212' : 'var(--text-dim)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <Store size={14} /> Puntos Físicos
                </button>
              </div>

              {activeTab === 'whatsapp' ? (
                <form onSubmit={handleWhatsAppOrder}>
                  {/* 1. Selección de Distintivos en Grilla Compacta de 2 Columnas */}
                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                      1. Selecciona tu variante:
                    </label>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      {stickerOptions.map((st) => {
                        const isSelected = selectedSticker === st.id;
                        return (
                          <div
                            key={st.id}
                            onClick={() => setSelectedSticker(st.id)}
                            style={{
                              padding: '0.55rem 0.7rem',
                              borderRadius: '10px',
                              backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.04)',
                              border: isSelected ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '4px'
                            }}
                          >
                            <span style={{ fontWeight: 700, fontSize: '0.74rem', color: isSelected ? 'var(--accent-gold)' : '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {st.label}
                            </span>
                            <span style={{ 
                              fontSize: '0.6rem', 
                              fontWeight: 800, 
                              padding: '2px 5px', 
                              borderRadius: '4px', 
                              backgroundColor: st.bg, 
                              color: st.color,
                              flexShrink: 0
                            }}>
                              {st.tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {(selectedSticker === 'campechana_rosa' || selectedSticker === 'campechana_negra') && (
                    <div style={{
                      margin: '0.6rem 0 1rem 0',
                      padding: '0.6rem',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem'
                    }}>
                      <StickerQRCode
                        value="https://www.facebook.com/share/1DHyrzvtjh/?mibextid=wwXIfr"
                        level={selectedSticker}
                        size={56}
                      />
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: selectedSticker === 'campechana_rosa' ? '#FF69B4' : '#FFF' }}>
                          Diseño de QR Oficial — Campechana Soy ({selectedSticker === 'campechana_rosa' ? 'Rosa' : 'Negra'})
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Incluye el escudo impreso en el centro y tecnología QR scannable de vinil.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Datos Obligatorios Ultra Compactos */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                      2. Datos para comunicarnos:
                    </label>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }}>
                          <User size={14} />
                        </div>
                        <input
                          type="text"
                          placeholder="Tu nombre *"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px',
                            color: '#FFF',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }}>
                          <Phone size={14} />
                        </div>
                        <input
                          type="tel"
                          placeholder="Tu WhatsApp *"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '10px',
                            color: '#FFF',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button visible sin scroll */}
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '0.9rem',
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
                    <MessageCircle size={18} /> Pedir por WhatsApp ({ADMIN_PHONE})
                  </button>
                </form>
              ) : (
                /* Puntos de Venta Físicos */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                    Adquiere tu distintivo físico de $90 MXN de forma presencial en los siguientes puntos oficiales:
                  </p>

                  {physicalStores.map((store, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
                          📍 {store.city}
                        </span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address} Campeche`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.68rem', color: '#4285F4', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <Navigation size={10} /> Maps ↗
                          </a>
                          <a
                            href={`https://wa.me/52${store.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.68rem', color: '#25D366', fontWeight: 700, textDecoration: 'none' }}
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>{store.name}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '2px 0' }}>{store.address}</p>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{store.hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuyStickerModal;
