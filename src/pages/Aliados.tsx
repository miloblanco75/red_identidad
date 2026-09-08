import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Utensils, Car, Loader2, Wine, HeartPulse, Building2, MapPin, Globe, CreditCard, Briefcase, Sparkles } from 'lucide-react';
import L from 'leaflet';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FacebookIcon = ({ size = 14, color = '#1877F2' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Fix Leaflet icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface Ally {
  id: string;
  name: string;
  category: string;
  discount: string;
  lat?: number | null;
  lng?: number | null;
  promotions_given: number;
  facebook_url?: string;
  website_url?: string;
  logo_url?: string;
}

const mockAllies: Ally[] = [
  {
    id: 'mock-1',
    name: 'Café del Mar Campeche',
    category: 'Comida',
    discount: '15% de Descuento en Consumo Total',
    lat: 19.8438,
    lng: -90.5312,
    promotions_given: 120,
    facebook_url: 'https://facebook.com',
    website_url: ''
  },
  {
    id: 'mock-2',
    name: 'AutoLavado Fast El Carmen',
    category: 'Auto',
    lat: 18.6481,
    lng: -91.8219,
    promotions_given: 95,
    discount: 'Lavado Gratis en tu 3ra Visita',
    facebook_url: 'https://facebook.com',
    website_url: 'https://autolavadofast.com'
  },
  {
    id: 'mock-3',
    name: 'Club 59 Lounge',
    category: 'Entretenimiento',
    lat: 19.8471,
    lng: -90.5381,
    promotions_given: 210,
    discount: 'Shot de Bienvenida de Cortesía',
    facebook_url: 'https://facebook.com'
  },
  {
    id: 'mock-4',
    name: 'Spa Sentidos',
    category: 'Salud',
    lat: 19.8291,
    lng: -90.5422,
    promotions_given: 45,
    discount: '20% OFF en Masaje Relajante',
    facebook_url: 'https://facebook.com',
    website_url: 'https://spasentidos.com'
  },
  {
    id: 'mock-5',
    name: 'Gimnasio Master Fitness',
    category: 'Servicios',
    lat: 19.8355,
    lng: -90.5288,
    promotions_given: 88,
    discount: 'Inscripción Gratis y 10% en Mensualidad',
    facebook_url: 'https://facebook.com'
  },
  {
    id: 'mock-6',
    name: 'Diseño & Software Digital Campeche',
    category: 'Servicios',
    promotions_given: 64,
    discount: '20% OFF en Desarrollo de Páginas Web y Tiendas Online',
    facebook_url: 'https://facebook.com',
    website_url: 'https://ejemplo.com'
  }
];

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

const Aliados: React.FC = () => {
  const navigate = useNavigate();
  const [allies, setAllies] = useState<Ally[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.8301, -90.5349]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Comida', 'Auto', 'Servicios', 'Estética', 'Entretenimiento', 'Salud'];

  useEffect(() => {
    fetchAllies();
  }, []);

  const fetchAllies = async () => {
    try {
      const { data, error } = await supabase
        .from('allies')
        .select('id, name, category, discount, lat, lng, promotions_given, facebook_url, website_url, logo_url, created_at')
        .order('promotions_given', { ascending: false });
      
      if (error) throw error;
      if (data) setAllies(data);
    } catch (error) {
      console.error('Error fetching allies:', error);
    } finally {
      setLoading(false);
    }
  };

  const isNewAlly = (createdAt?: string) => {
    if (!createdAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(createdAt) > weekAgo;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Comida': return Utensils;
      case 'Auto': return Car;
      case 'Servicios': return Briefcase;
      case 'Estética': return Sparkles;
      case 'Entretenimiento': return Wine;
      case 'Salud': return HeartPulse;
      default: return Building2;
    }
  };

  const displayAllies = [...allies, ...mockAllies];
  const topAllies = [...displayAllies].sort((a, b) => b.promotions_given - a.promotions_given).slice(0, 5);
  const filteredAllies = selectedCategory === 'Todas'
    ? displayAllies
    : displayAllies.filter(item => item.category === selectedCategory);

  const handleLocateAlly = (ally: Ally) => {
    setMapCenter([parseFloat(ally.lat as any), parseFloat(ally.lng as any)]);
    setMapZoom(16);
    const mapElement = document.getElementById('map-section');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', marginTop: '1rem' }}>Aliados de la Red</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Encuentra comercios en Campeche y Ciudad del Carmen que recompensan tu identidad.
      </p>

      {/* How to use banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.9rem 1rem',
        borderRadius: '14px',
        backgroundColor: 'rgba(212,175,55,0.1)',
        border: '1px solid rgba(212,175,55,0.25)',
        marginBottom: '1.5rem'
      }}>
        <CreditCard size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.4, margin: 0 }}>
          <strong style={{ color: 'var(--accent-white)' }}>¿Cómo canjear?</strong> Muestra tu Pase QR o número de miembro en el establecimiento aliado.
        </p>
      </div>

      {/* Map Section */}
      <div 
        id="map-section"
        style={{ 
          height: '300px', 
          width: '100%', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          marginBottom: '2rem',
          border: '1px solid var(--glass-border)',
          zIndex: 1,
          position: 'relative'
        }}
      >
        {loading && allies.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" color="var(--accent-gold)" />
          </div>
        )}
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {displayAllies
            .filter(partner => partner.lat != null && partner.lng != null && !isNaN(Number(partner.lat)) && !isNaN(Number(partner.lng)) && Number(partner.lat) !== 0 && Number(partner.lng) !== 0)
            .map(partner => {
            const goldIcon = L.divIcon({
              className: 'custom-gold-marker',
              html: `<div style="
                background-color: #D4AF37;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid #FFF;
                box-shadow: 0 0 15px rgba(212, 175, 55, 1);
              "></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
              popupAnchor: [0, -12]
            });

            return (
              <Marker key={partner.id} position={[parseFloat(partner.lat as any), parseFloat(partner.lng as any)]} icon={goldIcon}>
                <Popup>
                  <div style={{ color: '#121212', minWidth: '160px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {partner.logo_url && (
                        <img src={partner.logo_url} alt={partner.name} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'contain', backgroundColor: '#FFF', padding: '2px' }} />
                      )}
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem' }}>{partner.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>{partner.category}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '5px', color: '#B8860B', fontWeight: 700, fontSize: '0.85rem' }}>{partner.discount}</div>
                    {(partner.facebook_url || partner.website_url) && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #eee' }}>
                        {partner.facebook_url && (
                          <a href={partner.facebook_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                            Facebook ↗
                          </a>
                        )}
                        {partner.website_url && (
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066CC', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                            Sitio Web ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Category Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          overflowX: 'auto', 
          marginBottom: '1.5rem', 
          paddingBottom: '0.5rem' 
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '100px',
              backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              color: selectedCategory === cat ? '#121212' : 'var(--text-dim)',
              fontSize: '0.8rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: selectedCategory === cat ? 'none' : '1px solid var(--glass-border)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Promotions List Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Promociones Disponibles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAllies.length === 0 ? (
            <div className="glass" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>
              No hay promociones registradas en esta categoría.
            </div>
          ) : (
            filteredAllies.map((item) => {
              const IconComponent = getCategoryIcon(item.category);
              const isDigitalAlly = !item.lat || !item.lng || isNaN(Number(item.lat)) || isNaN(Number(item.lng)) || (Number(item.lat) === 0 && Number(item.lng) === 0);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass premium-glow-gold"
                  style={{
                    padding: '1.2rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(212,175,55,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      {item.logo_url ? (
                        <img 
                          src={item.logo_url} 
                          alt={item.name} 
                          style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'contain', border: '1px solid var(--glass-border)', backgroundColor: '#FFF', padding: '4px' }} 
                        />
                      ) : (
                        <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '10px', borderRadius: '12px' }}>
                          <IconComponent size={20} color="var(--accent-gold)" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.category}</div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.name}</h4>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                      {isDigitalAlly && (
                        <span style={{ backgroundColor: 'rgba(168,85,247,0.2)', color: '#C084FC', padding: '2px 7px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 800 }}>
                          🌐 DIGITAL
                        </span>
                      )}
                      {isNewAlly((item as any).created_at) && (
                        <span style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '2px 7px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 800 }}>
                          🆕 NUEVO
                        </span>
                      )}
                      {item.id.startsWith('mock-') && (
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: '6px', fontSize: '0.6rem', fontWeight: 600 }}>
                          Demo
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="gold-text" style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.6rem' }}>
                      {item.discount}
                    </p>

                    {/* Social & Website links */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      {item.facebook_url && (
                        <a
                          href={item.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(24, 119, 242, 0.15)',
                            color: '#1877F2',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '1px solid rgba(24, 119, 242, 0.3)'
                          }}
                        >
                          <FacebookIcon size={12} color="#1877F2" /> Facebook
                        </a>
                      )}
                      {item.website_url && (
                        <a
                          href={item.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            color: 'var(--accent-white)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          <Globe size={12} color="var(--accent-gold)" /> Web
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      🎁 {item.promotions_given} promociones dadas
                    </span>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!isDigitalAlly ? (
                        <button
                          onClick={() => handleLocateAlly(item)}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: '#FFF',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid var(--glass-border)',
                            cursor: 'pointer'
                          }}
                        >
                          <MapPin size={12} /> Ubicar
                        </button>
                      ) : item.website_url ? (
                        <a
                          href={item.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: 'rgba(212,175,55,0.15)',
                            color: 'var(--accent-gold)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid rgba(212,175,55,0.3)',
                            textDecoration: 'none'
                          }}
                        >
                          <Globe size={12} /> Visitar Web
                        </a>
                      ) : null}
                      <button
                        onClick={() => navigate('/registro')}
                        style={{
                          backgroundColor: 'rgba(212,175,55,0.15)',
                          color: 'var(--accent-gold)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid rgba(212,175,55,0.3)',
                          cursor: 'pointer'
                        }}
                      >
                        <CreditCard size={12} /> Ver mi Pase
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Ranking Section */}
      <section>
        
        <div className="glass" style={{ borderRadius: '20px', padding: '1rem' }}>
          {loading && allies.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
               <Loader2 className="animate-spin" style={{ margin: '0 auto' }} color="var(--text-dim)" />
            </div>
          ) : topAllies.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Aún no hay aliados registrados. ¡Sé el primero en agregar uno desde el panel!
            </div>
          ) : (
            topAllies.map((item, i) => {
              const IconComponent = getCategoryIcon(item.category);
              return (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem 0',
                  borderBottom: i === topAllies.length - 1 ? 'none' : '1px solid var(--glass-border)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: i < 3 ? 'var(--accent-gold)' : 'var(--text-dim)', width: '20px' }}>
                      {i + 1}
                    </span>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
                      <IconComponent size={16} color="var(--text-dim)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>🎁 {item.promotions_given} promociones</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4ADE80', fontWeight: 600 }}>
                    {item.discount}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Top Allies Ranking header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Top Aliados esta semana</h3>
      </div>
    </div>
  );
};

export default Aliados;
