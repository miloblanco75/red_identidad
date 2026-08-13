import React, { useState } from 'react';
import { Navigation, MapPin, Search, Heart, HandHeart, AlertCircle } from 'lucide-react';
import PostCard from './PostCard';

export default function RadarView({ posts, onConnect }) {
  const [maxDistance, setMaxDistance] = useState(5.0);
  const [selectedZone, setSelectedZone] = useState('all');

  const filteredPosts = posts.filter(post => {
    const dist = post.distanceKm || 1.5;
    const matchesDistance = dist <= maxDistance;
    const matchesZone = selectedZone === 'all' || post.userLocation.toLowerCase().includes(selectedZone.toLowerCase());
    return matchesDistance && matchesZone;
  });

  return (
    <div className="radar-view">
      <div className="gallery-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '999px', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <Navigation size={16} /> Radar de Apoyo Vecinal
        </div>
        <h2>Solidaridad Cercana a Tu Alrededor</h2>
        <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
          Encuentra personas que solicitan u ofrecen ayuda en tu misma colonia o a pocos kilómetros caminando.
        </p>

        {/* Distance Controls */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', maxWidth: '680px', margin: '0 auto 2rem auto', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="#e11d48" /> Radio Máximo de Distancia:
            </label>
            <span style={{ fontWeight: 800, color: '#e11d48', fontSize: '1rem' }}>
              {maxDistance >= 10 ? 'Toda la Ciudad' : `${maxDistance} km de distancia`}
            </span>
          </div>

          <input 
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={maxDistance}
            onChange={e => setMaxDistance(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#e11d48', height: 6, cursor: 'pointer' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>
            <span>0.5 km (Caminando)</span>
            <span>2.5 km (En tu colonia)</span>
            <span>5 km</span>
            <span>+10 km (Toda la ciudad)</span>
          </div>
        </div>
      </div>

      {/* Grid of Nearby Posts */}
      {filteredPosts.length > 0 ? (
        <div className="cards-grid">
          {filteredPosts.map(post => (
            <div key={post.id} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: '#0f172a', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                📍 A {post.distanceKm || 1.5} km
              </div>
              <PostCard post={post} onConnect={onConnect} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <AlertCircle size={40} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No encontramos apoyos registrados en este radio de {maxDistance} km.</h3>
          <p style={{ marginTop: '0.4rem' }}>Prueba ampliar la distancia de búsqueda con la barra superior.</p>
        </div>
      )}
    </div>
  );
}
