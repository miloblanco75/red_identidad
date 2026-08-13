import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Crown, Copy, Users, Wallet, CheckCircle2, Handshake, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Fundadores: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Verificación estricta: Solo Nivel Gold O que su código tenga "FD"
  const isFounder = user?.level === 'gold' || user?.code?.toUpperCase().includes('FD');

  const referralLink = `https://redidentidad.vercel.app/afiliar?ref=${user?.phone || 'RED'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isFounder) {
    return (
      <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
        <header style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Embajadores Fundadores</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Este espacio es exclusivo para los socios embajadores fundadores de la red.
          </p>
        </header>

        <section className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Crown size={32} color="var(--text-dim)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Acceso Restringido</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Aún no eres parte del programa de embajadores. Continúa interactuando en la red y recibe una invitación directa de los creadores.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <header style={{ marginTop: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}
        >
          <Crown size={40} color="var(--accent-gold)" />
        </motion.div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Socio Fundador</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          Tu red es tu patrimonio. Gana recomendando.
        </p>
      </header>

      {/* Dashboard de Ganancias (Mock visual para el usuario) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass premium-glow-gold" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center' }}>
          <Wallet size={24} color="var(--accent-gold)" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Ganancias</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF' }}>$0.00</div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Users size={24} color="#FFF" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Referidos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFF' }}>0</div>
        </div>
      </div>

      {/* Tarjeta de Referido */}
      <section className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--accent-gold)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Tu Código Único</h3>
        
        <div style={{ backgroundColor: '#FFF', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
          <QRCodeSVG value={referralLink} size={150} level="H" />
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Comparte este código con tus conocidos. Cuando tus amigos compren una calcomanía o cuando afilies un nuevo negocio, quedará registrado automáticamente para sumar a tus ganancias.
        </p>

        <button 
          onClick={copyToClipboard}
          style={{ 
            width: '100%', padding: '1rem', borderRadius: '12px', 
            backgroundColor: copied ? '#4ade80' : 'rgba(255,255,255,0.05)', 
            color: copied ? '#121212' : '#FFF',
            border: copied ? 'none' : '1px solid rgba(255,255,255,0.2)',
            fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
            transition: 'all 0.3s'
          }}
        >
          {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          {copied ? '¡Enlace Copiado!' : 'Copiar Enlace Privado'}
        </button>
      </section>

      {/* Niveles de recompensa */}
      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Tabla de Recompensas</h3>
        
        <div className="glass" style={{ padding: '1rem', borderRadius: '16px', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '0.8rem', borderRadius: '12px' }}>
            <Handshake size={24} color="var(--accent-gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Afiliar Comercios Nuevos</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Gana $150 MXN por cada 5 negocios que afilies</div>
          </div>
          <ChevronRight size={20} color="var(--text-dim)" />
        </div>

        <div className="glass" style={{ padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
            <Users size={24} color="#FFF" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Vender una Calcomanía</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Gana $10 MXN de comisión por cada referido</div>
          </div>
          <ChevronRight size={20} color="var(--text-dim)" />
        </div>
      </section>
      
    </div>
  );
};

export default Fundadores;
