import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';

interface BuyStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyStickerModal: React.FC<BuyStickerModalProps> = ({ isOpen, onClose }) => {
  const [selectedEdition, setSelectedEdition] = useState<'negra' | 'blanca' | 'plata' | 'oro'>('negra');
  const [city, setCity] = useState<'Campeche' | 'Ciudad del Carmen'>('Campeche');
  const [name, setName] = useState('');
  const [phone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);

  const pricePerUnit = 90;
  const totalPrice = pricePerUnit * quantity;

  const editions = [
    { id: 'negra', name: 'Negra Mate', badge: 'Popular', color: '#1E1E1E', border: '#444', desc: 'Vinil de alta resistencia mate con corte de precisión.' },
    { id: 'blanca', name: 'Blanca Premium', badge: 'Alta Visibilidad', color: '#F5F5F7', border: '#FFF', desc: 'Destaca en cristal templado y cristales polarizados oscuros.' },
    { id: 'plata', name: 'Plata Reflejante', badge: 'Reflejante 3M', color: '#C0C0C0', border: '#C0C0C0', desc: 'Refleja la luz de noche, visibilidad máxima.' },
    { id: 'oro', name: 'Oro VIP', badge: 'VIP Dorado', color: '#D4AF37', border: '#D4AF37', desc: 'Edición especial para miembros distinguidos.' },
  ];

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const edName = editions.find(e => e.id === selectedEdition)?.name || 'Negra Mate';
    
    const message = `¡Hola! 👋 Quiero comprar mi Calcomanía Oficial de Red Identidad.\n\n` +
      `📦 *Detalles del Pedido:*\n` +
      `• Edición: ${edName}\n` +
      `• Cantidad: ${quantity} unidad(es)\n` +
      `• Total: $${totalPrice} MXN\n` +
      `• Ciudad: ${city}\n` +
      (name ? `• Nombre: ${name}\n` : '') +
      (phone ? `• Teléfono: ${phone}\n` : '') +
      (address ? `• Dirección/Entrega: ${address}\n` : '') +
      `\nQuedo atento para coordinar el pago y la entrega. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/529811234567?text=${encodedMessage}`;
    
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
          padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass premium-glow-gold"
          style={{
            width: '100%',
            maxWidth: '460px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '1.5rem',
            backgroundColor: '#161618',
            border: '1px solid rgba(212,175,55,0.3)',
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
              color: '#FFF'
            }}
          >
            <X size={18} />
          </button>

          {isOrdered ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={36} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>¡Pedido Iniciado!</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Hemos abierto WhatsApp con los datos de tu orden para coordinar la entrega o envío de tu calcomanía.
              </p>
              <button
                onClick={() => { setIsOrdered(false); onClose(); }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 700,
                  border: 'none'
                }}
              >
                Volver a la App
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <ShoppingBag color="var(--accent-gold)" size={22} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Comprar Calcomanía Oficial</h3>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                Recibe tu empaque oficial con tu Calcomanía física y el Pase de Acceso QR para desbloquear todos los descuentos.
              </p>

              <form onSubmit={handleWhatsAppOrder}>
                {/* Select Edition */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                    1. Selecciona la Edición
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    {editions.map((ed) => {
                      const isSelected = selectedEdition === ed.id;
                      return (
                        <div
                          key={ed.id}
                          onClick={() => setSelectedEdition(ed.id as any)}
                          style={{
                            padding: '0.8rem',
                            borderRadius: '12px',
                            backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.04)',
                            border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--accent-gold)' : '#FFF' }}>
                              {ed.name}
                            </span>
                            <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-dim)' }}>
                              {ed.badge}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
                            {ed.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Select City */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                    2. Tu Ciudad (Entrega Local o Envío)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    {(['Campeche', 'Ciudad del Carmen'] as const).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCity(c)}
                        style={{
                          padding: '0.8rem',
                          borderRadius: '12px',
                          backgroundColor: city === c ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.04)',
                          border: city === c ? '1.5 solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                          color: city === c ? 'var(--accent-gold)' : '#FFF',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <MapPin size={14} /> {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact info optional */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                    3. Datos de contacto (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      marginBottom: '0.6rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Dirección o punto de entrega"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Price summary */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Precio Total:</span>
                    <strong style={{ fontSize: '1.3rem', color: 'var(--accent-gold)' }}>${totalPrice} MXN</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                    Incluye Calcomanía + Pase QR
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '14px',
                    backgroundColor: '#25D366',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <MessageCircle size={20} /> Pedir por WhatsApp (${totalPrice} MXN)
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuyStickerModal;
