import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, QrCode, Store, ArrowRight, Loader2, Award } from 'lucide-react';
import { activateMembershipAfterPayment } from '../lib/paymentsService';
import { useAuth } from '../contexts/AuthContext';
import BrandLogo from '../components/BrandLogo';

export const PagoExitoso: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginLocal } = useAuth();

  const productType = (searchParams.get('tipo') || 'digital') as 'digital' | 'physical';
  const customerName = searchParams.get('nombre') || 'Nuevo Miembro';
  const customerPhone = searchParams.get('tel') || '';
  const stickerStyle = searchParams.get('estilo') || 'campechano_negra';

  const [loading, setLoading] = useState(true);
  const [activatedUser, setActivatedUser] = useState<{
    memberNumber: number;
    code: string;
    level: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const activate = async () => {
      if (!customerPhone) {
        setLoading(false);
        return;
      }

      const res = await activateMembershipAfterPayment({
        productType,
        name: customerName,
        phone: customerPhone,
        stickerStyle
      });

      if (isMounted && res.success) {
        setActivatedUser({
          memberNumber: res.memberNumber,
          code: res.code,
          level: res.level,
          phone: res.phone
        });

        // Iniciar sesión localmente para que el usuario tenga acceso inmediato a su credencial
        loginLocal({
          phone: res.phone,
          member_number: res.memberNumber,
          level: res.level,
          code: res.code
        });

        setLoading(false);
      }
    };

    activate();

    return () => {
      isMounted = false;
    };
  }, [customerPhone, productType, customerName, stickerStyle]);

  const physicalStores = [
    { name: 'Maneki Neko', address: 'Plaza del Mar, Campeche' },
    { name: 'Barbería Mdoce', address: 'Avenida Concordia, Campeche' },
    { name: 'Lavadero Royal Shine', address: 'Avenida Central, Campeche' },
    { name: 'Refaccionaria Bahía', address: 'Avenida Hidalgo, Campeche' },
    { name: 'Gesti+', address: 'Av. Ruiz Cortines (contra esquina Palacio Federal)' }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-gold)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>Confirmando tu pago y activando membresía...</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Generando tu número de socio oficial y credencial digital segura.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', padding: '1.5rem', paddingBottom: '120px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <BrandLogo size="medium" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'rgba(34,197,94,0.2)',
          border: '3px solid #22C55E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.2rem',
          boxShadow: '0 0 35px rgba(34,197,94,0.5)'
        }}
      >
        <CheckCircle2 size={46} color="#4ADE80" />
      </motion.div>

      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'rgba(212,175,55,0.15)',
        border: '1px solid var(--accent-gold)',
        color: 'var(--accent-gold)',
        padding: '5px 14px',
        borderRadius: '100px',
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        marginBottom: '0.8rem'
      }}>
        <Sparkles size={14} /> ¡Pago Aprobado con Éxito!
      </span>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 0.4rem', letterSpacing: '-0.02em', color: '#FFF' }}>
        ¡Bienvenido a la Red Identidad!
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', margin: '0 0 1.8rem', lineHeight: 1.4 }}>
        Hola <strong>{customerName}</strong>, tu compra de <strong>{productType === 'digital' ? 'Membresía Digital ($45 MXN)' : 'Calcomanía Física Oficial ($90 MXN)'}</strong> ha sido completada.
      </p>

      {/* Tarjeta de Socio Asignado */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(20,20,30,0.85) 100%)',
          border: '2px solid var(--accent-gold)',
          borderRadius: '24px',
          padding: '1.6rem 1.2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '4px' }}>
          Tu Número de Socio Oficial
        </div>
        <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#FFF', lineHeight: 1, textShadow: '0 0 20px rgba(212,175,55,0.6)' }}>
          #{String(activatedUser?.memberNumber || 1).padStart(4, '0')}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 800, marginTop: '8px', fontFamily: 'monospace' }}>
          Código: {activatedUser?.code}
        </div>

        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: '#CBD5E1' }}>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Estado:</span>
            <strong style={{ color: '#4ADE80' }}>● ACTIVO</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Vigencia:</span>
            <strong style={{ color: '#FFF' }}>De Por Vida</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Puntos Iniciales:</span>
            <strong style={{ color: 'var(--accent-gold)' }}>+15 pts</strong>
          </div>
        </div>
      </div>

      {/* Botón Principal: Ver Credencial */}
      <button
        onClick={() => navigate('/')}
        style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '16px',
          border: 'none',
          backgroundColor: 'var(--accent-gold)',
          color: '#121212',
          fontSize: '1rem',
          fontWeight: 900,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 0 25px rgba(212,175,55,0.45)',
          marginBottom: '1rem'
        }}
      >
        <QrCode size={20} /> Abrir Mi Membresía Digital Ahora <ArrowRight size={18} />
      </button>

      {/* Instrucciones según producto */}
      {productType === 'physical' ? (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.2rem', textAlign: 'left', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>
            <Store size={18} /> ¿Dónde recoger tu sobre físico?
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
            Presenta tu comprobante o número de socio en cualquiera de nuestros puntos de venta oficiales autorizados:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {physicalStores.map((store, i) => (
              <div key={i} style={{ padding: '6px 8px', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '8px', fontSize: '0.74rem' }}>
                <strong style={{ color: '#FFF' }}>{store.name}</strong> — <span style={{ color: 'var(--text-dim)' }}>{store.address}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '16px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.78rem', color: '#D1FAE5', lineHeight: 1.4 }}>
          <div style={{ fontWeight: 800, color: '#4ADE80', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} /> Tu pase ya está activado en tu teléfono
          </div>
          No necesitas recoger nada físico. Puedes visitar hoy mismo cualquier comercio aliado, mostrar tu QR dinámico en pantalla y recibir tus descuentos de inmediato.
        </div>
      )}

      {/* Soporte WhatsApp */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        ¿Tienes alguna duda o necesitas ayuda?{' '}
        <a
          href={`https://wa.me/529811385474?text=${encodeURIComponent(`Hola, acabo de comprar mi membresía (Socio #${activatedUser?.memberNumber || ''}) y tengo una pregunta.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none' }}
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PagoExitoso;
