import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Lock, QrCode, Star, Gift, Utensils, GlassWater } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dorados: React.FC = () => {
  const { user } = useAuth();

  // Para pruebas rápidas si no hay usuario, asumimos que no es Dorado.
  const isGold = user?.level === 'gold' || user?.code?.toUpperCase().includes('FD');

  if (!isGold) {
    return (
      <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
        <header style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>El Camino al Oro</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Aún no eres VIP Dorado. ¡Pero puedes serlo gratis encontrando el Tesoro Phygital de esta semana!
          </p>
        </header>

        <section className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={32} color="var(--text-dim)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Salón VIP Bloqueado</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Los beneficios exclusivos de estatus preferencial, trato VIP y eventos especiales están reservados para Miembros Dorados.
          </p>
        </section>

        <section className="premium-glow-gold glass" style={{ 
          padding: '2rem', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(212,175,55,0.1) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <MapPin color="var(--accent-gold)" />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>La Búsqueda del Tesoro</span>
          </div>
          
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Hemos escondido un <strong>Código QR Dorado</strong> físico en uno de los negocios de nuestros aliados. El primero en ir y escanearlo, subirá automáticamente a Nivel Dorado.
          </p>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-gold)', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Pista de esta semana:</h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, fontStyle: 'italic' }}>
              "Busca donde los tacos al pastor giran en el centro histórico, cerca de la catedral..."
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
              <QrCode size={20} />
            </div>
            <span>Cuando lo encuentres, solo ábrelo con la cámara de tu celular.</span>
          </div>
        </section>
      </div>
    );
  }

  // VISTA PARA USUARIOS DORADOS
  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <header style={{ marginTop: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}
        >
          <Trophy size={40} color="var(--accent-gold)" />
        </motion.div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Salón VIP Dorado</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          Bienvenido a la élite de Red Identidad.
        </p>
      </header>

      {/* Secret Perks */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Privilegios Activos</h3>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass premium-glow-gold" 
          style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}
        >
          <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '16px' }}>
            <Utensils size={32} color="var(--accent-gold)" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Cena VIP a Mitad de Precio</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>En Restaurante La Pigua (Válido Jueves)</p>
            <span style={{ backgroundColor: 'var(--accent-gold)', color: '#121212', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>RECLAMAR</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
            <GlassWater size={32} color="#FFF" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Fast-Track & Botella</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>Acceso sin fila en Club 59</p>
            <span style={{ backgroundColor: '#FFF', color: '#121212', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>RECLAMAR</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass" 
          style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '16px' }}>
            <Gift size={32} color="#FFF" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Sorteo Mensual x10</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>Tienes 10 participaciones para el iPhone 15</p>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>PARTICIPANDO</span>
          </div>
        </motion.div>
      </section>
      
      <div style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}>
        <Star size={24} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
        <p style={{ fontSize: '0.8rem' }}>Mantén tu estatus consumiendo al menos 1 vez al mes.</p>
      </div>
    </div>
  );
};

export default Dorados;
