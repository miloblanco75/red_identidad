import React, { useState, useEffect } from 'react';
import { Award, Gift, Save, CheckCircle2, History, Users, RefreshCw } from 'lucide-react';
import { getLoyaltyConfig, saveLoyaltyConfig, getAllVisits, type LoyaltyConfig, type MemberVisitRecord } from '../lib/loyaltyService';

export const LoyaltyAdminManager: React.FC = () => {
  const [config, setConfig] = useState<LoyaltyConfig>(getLoyaltyConfig());
  const [visits, setVisits] = useState<MemberVisitRecord[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const loadData = () => {
    setConfig(getLoyaltyConfig());
    setVisits(getAllVisits());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLoyaltyConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Contar socios únicos participantes
  const uniqueMembers = new Set(visits.map(v => v.memberNumber || v.memberCode)).size;

  return (
    <div className="glass" style={{ padding: '1.8rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(212,175,55,0.15)', color: 'var(--accent-gold)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Award size={14} /> Recorrido de Lealtad & Visitas
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.3rem' }}>
            Configuración de Premios de Lealtad
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: 0, maxWidth: '650px', lineHeight: 1.4 }}>
            Los socios acumulan visitas consumiendo en cualquiera de los <strong>comercios aliados</strong> (no puntos de venta). No tienen que ser comercios diferentes; visitas diarias al mismo café o negocio también cuentan.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.6rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} /> Actualizar Datos
        </button>
      </div>

      {/* Tarjetas de Estadísticas Globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '18px', padding: '1.2rem', textAlign: 'center' }}>
          <History size={20} color="var(--accent-gold)" style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-gold)', lineHeight: 1 }}>
            {visits.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 700 }}>
            Visitas Registradas en Aliados
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '18px', padding: '1.2rem', textAlign: 'center' }}>
          <Users size={20} color="#4ADE80" style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4ADE80', lineHeight: 1 }}>
            {uniqueMembers}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 700 }}>
            Socios Participando
          </div>
        </div>
      </div>

      {/* Formulario de Configuración de Premios */}
      <form onSubmit={handleSave} style={{ marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={18} color="var(--accent-gold)" /> Edición de Premios por Hito
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', margin: '0 0 1.2rem', lineHeight: 1.4 }}>
            Escribe aquí el premio que pactes con patrocinadores o aliados. Cuando lo guardes, se verá reflejado inmediatamente en el pasaporte digital de cada socio y en el semáforo del aliado.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Hito 1: 5 Visitas */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: 800, color: '#4ADE80', fontSize: '0.85rem' }}>
                  Meta 1 • {config.milestone1.visits} Visitas
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                  Insignia: {config.milestone1.badgeName}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 700 }}>
                    Descripción del Premio (Editable):
                  </label>
                  <input
                    type="text"
                    value={config.milestone1.reward}
                    onChange={e => setConfig({
                      ...config,
                      milestone1: { ...config.milestone1, reward: e.target.value }
                    })}
                    placeholder="Ej. Café gratis en Crissantas o postre de cortesía"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 700 }}>
                    Nombre del Título / Medalla:
                  </label>
                  <input
                    type="text"
                    value={config.milestone1.badgeName}
                    onChange={e => setConfig({
                      ...config,
                      milestone1: { ...config.milestone1, badgeName: e.target.value }
                    })}
                    placeholder="Ej. Explorador Frecuente"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Hito 2: 10 Visitas */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                  Meta 2 • {config.milestone2.visits} Visitas
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                  Insignia: {config.milestone2.badgeName}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 700 }}>
                    Descripción del Premio (Editable):
                  </label>
                  <input
                    type="text"
                    value={config.milestone2.reward}
                    onChange={e => setConfig({
                      ...config,
                      milestone2: { ...config.milestone2, reward: e.target.value }
                    })}
                    placeholder="Ej. 2x1 en hamburguesas o boleto para sorteo mensual"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 700 }}>
                    Nombre del Título / Medalla:
                  </label>
                  <input
                    type="text"
                    value={config.milestone2.badgeName}
                    onChange={e => setConfig({
                      ...config,
                      milestone2: { ...config.milestone2, badgeName: e.target.value }
                    })}
                    placeholder="Ej. Cliente Distinguido"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Hito 3: 20 Visitas */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.85rem' }}>
                  Meta 3 • {config.milestone3.visits} Visitas
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                  Insignia: {config.milestone3.badgeName}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 700 }}>
                    Descripción del Premio (Editable):
                  </label>
                  <input
                    type="text"
                    value={config.milestone3.reward}
                    onChange={e => setConfig({
                      ...config,
                      milestone3: { ...config.milestone3, reward: e.target.value }
                    })}
                    placeholder="Ej. Cena completa para 2 o kit oficial Red Identidad"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: 700 }}>
                    Nombre del Título / Medalla:
                  </label>
                  <input
                    type="text"
                    value={config.milestone3.badgeName}
                    onChange={e => setConfig({
                      ...config,
                      milestone3: { ...config.milestone3, badgeName: e.target.value }
                    })}
                    placeholder="Ej. Embajador de la Red"
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.85rem 1.8rem',
              borderRadius: '14px',
              backgroundColor: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Save size={18} /> Guardar Premios de Lealtad
          </button>

          {isSaved && (
            <span style={{ color: '#4ADE80', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> ¡Configuración guardada exitosamente!
            </span>
          )}
        </div>
      </form>

      {/* Bitácora de Visitas Recientes en Comercios */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="var(--accent-gold)" /> Últimas Visitas Registradas en la Red ({visits.length})
        </h3>

        {visits.length === 0 ? (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Aún no hay visitas registradas por los comercios aliados. Se irán listando aquí en tiempo real conforme los aliados validen clientes en su terminal.
          </div>
        ) : (
          <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {visits.slice(0, 50).map((v) => (
              <div
                key={v.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
                    Socio #{String(v.memberNumber || 1).padStart(4, '0')}
                  </span>
                  <span style={{ color: 'var(--text-dim)', margin: '0 8px' }}>•</span>
                  <strong style={{ color: '#FFF' }}>{v.allyName}</strong>
                  <span style={{ color: '#4ADE80', marginLeft: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ({v.discount})
                  </span>
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                  {v.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyAdminManager;
