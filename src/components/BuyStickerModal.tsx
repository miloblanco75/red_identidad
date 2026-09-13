import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, CheckCircle2, MessageCircle, User, Phone, 
  Store, Navigation, CreditCard, Smartphone, Car 
} from 'lucide-react';
import { getStripeCheckoutUrl, PRODUCTS } from '../lib/paymentsService';

interface BuyStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSticker?: string;
}

export const BuyStickerModal: React.FC<BuyStickerModalProps> = ({ isOpen, onClose, initialSticker }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'stores'>('online');
  const [membershipType, setMembershipType] = useState<'digital' | 'physical'>('digital');
  const [selectedSticker, setSelectedSticker] = useState<string>(initialSticker || 'campechano_negra');
  const [fullName, setFullName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (initialSticker) {
      setSelectedSticker(initialSticker);
    }
  }, [initialSticker]);

  const ADMIN_PHONE = '9811971305';
  const currentPrice = membershipType === 'digital' ? PRODUCTS.digital.price : PRODUCTS.physical.price;

  // Catálogo exacto de distintivos físicos
  const stickerOptions = [
    { id: 'campechano_blanca', label: 'Campechano — Blanca', tag: 'Blanca', bg: '#FFF', color: '#000' },
    { id: 'campechano_negra', label: 'Campechano — Negra', tag: 'Negra', bg: '#333', color: '#FFF' },
    
    { id: 'carmelita_blanca', label: 'Carmelita — Blanca', tag: 'Blanca', bg: '#FFF', color: '#000' },
    { id: 'carmelita_negra', label: 'Carmelita — Negra', tag: 'Negra', bg: '#333', color: '#FFF' },
    { id: 'carmelita_rosa', label: 'Carmelita — Rosa', tag: 'Rosa', bg: '#FF69B4', color: '#FFF' },

    { id: 'campechana_blanca', label: 'Campechana — Blanca', tag: 'Blanca', bg: '#FFF', color: '#000' },
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

  const handleStripePay = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!fullName.trim() || !userPhone.trim()) {
      setFormError('Por favor ingresa tu nombre y WhatsApp para activar tu membresía.');
      return;
    }

    const cleanDigits = userPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setFormError('Ingresa un número de WhatsApp válido (10 dígitos).');
      return;
    }

    const stripeUrl = getStripeCheckoutUrl(membershipType, fullName, userPhone, selectedSticker);
    window.location.href = stripeUrl;
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!fullName.trim() || !userPhone.trim()) {
      setFormError('Por favor ingresa tu nombre y WhatsApp antes de continuar.');
      return;
    }

    const chosenOption = stickerOptions.find(s => s.id === selectedSticker);
    const chosenName = chosenOption ? chosenOption.label : 'Campechano — Negra';

    const message = `¡Hola! 👋 Deseo adquirir mi Membresía Oficial Red Identidad.\n\n` +
      `📋 *Detalles del Pedido:*\n` +
      `• Formato: ${membershipType === 'digital' ? '📱 Membresía 100% Digital' : '🚗 Calcomanía Física en Sobre'}\n` +
      `${membershipType === 'physical' ? `• Variante: ${chosenName}\n` : ''}` +
      `• Total a Pagar: $${currentPrice} MXN\n\n` +
      `👤 *Mis Datos:*\n` +
      `• Nombre: ${fullName.trim()}\n` +
      `• WhatsApp: ${userPhone.trim()}\n\n` +
      `Por favor compártanme los datos de transferencia SPEI / OXXO para liquidar mi membresía. ¡Muchas gracias!`;

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
          backgroundColor: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
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
            maxWidth: '470px',
            maxHeight: '92vh',
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '1.4rem 1.2rem',
            backgroundColor: '#141416',
            border: '1.5px solid rgba(212,175,55,0.4)',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)'
          }}
        >
          {/* Botón Cerrar */}
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
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={18} />
          </button>

          {isOrdered ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', border: '1.5px solid var(--accent-gold)' }}>
                <CheckCircle2 size={34} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', color: '#FFF' }}>¡Solicitud Iniciada por WhatsApp!</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.4rem', lineHeight: 1.45 }}>
                Hemos abierto WhatsApp con tus datos. En breve te responderemos desde el número oficial <strong>{ADMIN_PHONE}</strong> para confirmar tu pago y dar de alta tu membresía.
              </p>
              <button
                onClick={() => { setIsOrdered(false); onClose(); }}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 900,
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
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <ShoppingBag color="var(--accent-gold)" size={22} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
                    Adquirir Membresía Oficial
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Acceso ilimitado a descuentos, retos y puntos
                  </span>
                </div>
              </div>

              {/* Selector de Pestaña: Pago en Línea vs Tiendas Físicas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '1.2rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('online')}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    backgroundColor: activeTab === 'online' ? 'var(--accent-gold)' : 'transparent',
                    color: activeTab === 'online' ? '#121212' : 'var(--text-dim)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={15} /> Compra en Línea
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('stores')}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    backgroundColor: activeTab === 'stores' ? 'var(--accent-gold)' : 'transparent',
                    color: activeTab === 'stores' ? '#121212' : 'var(--text-dim)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Store size={15} /> Tiendas Físicas
                </button>
              </div>

              {activeTab === 'online' ? (
                <div>
                  {/* 1. SELECTOR DUAL DE FORMATO ($45 Digital vs $90 Física) */}
                  <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem', letterSpacing: '0.08em', fontWeight: 800 }}>
                    1. Elige tu formato:
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.1rem' }}>
                    {/* Tarjeta Digital ($45) */}
                    <div
                      onClick={() => setMembershipType('digital')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        backgroundColor: membershipType === 'digital' ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                        border: membershipType === 'digital' ? '2px solid #22C55E' : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <Smartphone size={18} color={membershipType === 'digital' ? '#4ADE80' : 'var(--text-dim)'} />
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#4ADE80', backgroundColor: 'rgba(74,222,128,0.2)', padding: '2px 6px', borderRadius: '6px' }}>
                          ⚡ Instantánea
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFF' }}>
                        Membresía Digital
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4ADE80', margin: '4px 0' }}>
                        $45 <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dim)' }}>MXN</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: 1.2 }}>
                        Activación inmediata en tu celular. Cero esperas.
                      </div>
                    </div>

                    {/* Tarjeta Física ($90) */}
                    <div
                      onClick={() => setMembershipType('physical')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        backgroundColor: membershipType === 'physical' ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.04)',
                        border: membershipType === 'physical' ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <Car size={18} color={membershipType === 'physical' ? 'var(--accent-gold)' : 'var(--text-dim)'} />
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-gold)', backgroundColor: 'rgba(212,175,55,0.2)', padding: '2px 6px', borderRadius: '6px' }}>
                          ⭐ Popular
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFF' }}>
                        Calcomanía + Digital
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-gold)', margin: '4px 0' }}>
                        $90 <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dim)' }}>MXN</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: 1.2 }}>
                        Vinil automotriz en sobre oficial + Membresía digital.
                      </div>
                    </div>
                  </div>

                  {/* Selector de variante de calcomanía (solo si eligió física) */}
                  {membershipType === 'physical' && (
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                        Variante del distintivo para tu vehículo:
                      </label>
                      <select
                        value={selectedSticker}
                        onChange={(e) => setSelectedSticker(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.8rem',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '10px',
                          color: '#FFF',
                          fontSize: '0.82rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {stickerOptions.map((s) => (
                          <option key={s.id} value={s.id} style={{ color: '#000' }}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 2. DATOS DEL COMPRADOR */}
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem', letterSpacing: '0.08em', fontWeight: 700 }}>
                      2. Datos para activar tu membresía:
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
                            border: '1px solid rgba(255,255,255,0.15)',
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
                          placeholder="WhatsApp (10 dígitos) *"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.65rem 0.65rem 2.2rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '10px',
                            color: '#FFF',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <div style={{ color: '#FCA5A5', backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', borderRadius: '10px', padding: '8px 12px', fontSize: '0.76rem', marginBottom: '1rem' }}>
                      {formError}
                    </div>
                  )}

                  {/* 3. BOTONES DE PAGO (STRIPE vs WHATSAPP) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Botón Principal: Stripe */}
                    <button
                      type="button"
                      onClick={handleStripePay}
                      style={{
                        width: '100%',
                        padding: '0.95rem 1rem',
                        borderRadius: '14px',
                        backgroundColor: '#635BFF',
                        color: '#FFF',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        boxShadow: '0 4px 20px rgba(99, 91, 255, 0.45)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} /> Pagar con Stripe — ${currentPrice} MXN
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                        Tarjetas • Apple Pay • Google Pay • OXXO
                      </span>
                    </button>

                    {/* Botón Secundario: Transferencia / WhatsApp */}
                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(37, 211, 102, 0.15)',
                        border: '1.5px solid #25D366',
                        color: '#4ADE80',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageCircle size={16} /> Pagar por Transferencia / WhatsApp
                    </button>
                  </div>

                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '10px' }}>
                    🔒 Pago 100% seguro y encriptado. Activación de por vida.
                  </div>
                </div>
              ) : (
                /* Puntos de Venta Físicos */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                    Adquiere tu calcomanía física oficial de $90 MXN de forma presencial en efectivo en los siguientes puntos oficiales:
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
