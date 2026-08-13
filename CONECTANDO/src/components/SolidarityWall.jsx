import React, { useState } from 'react';
import { Heart, HandHeart, Search, Filter, Sparkles, ShieldCheck } from 'lucide-react';
import PostCard from './PostCard';
import { CATEGORIES } from '../data/initialData';

export default function SolidarityWall({ posts, onConnect, openCreateModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'solicitud', 'ofrecimiento'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || post.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="solidarity-wall">
      {/* Banner Principal de Dignidad & Cero Ventas */}
      <div className="banner-solidarity">
        <div className="banner-content">
          <div className="banner-icon">
            <Sparkles size={24} />
          </div>
          <div className="banner-text">
            <h3>Comunidad de Apoyo Mutuo e Igualdad</h3>
            <p>
              En <strong>Conectando</strong> nadie es más ni menos. Cada persona puede solicitar apoyo cuando lo necesite u ofrecer su ayuda con generosidad. <strong>Cero ventas, 100% solidaridad.</strong>
            </p>
          </div>
        </div>
        <div className="banner-pills">
          <span className="solidarity-pill">
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Entregas Supervisadas por Staff
          </span>
          <span className="solidarity-pill">❤️ Donaciones Gratuitas</span>
        </div>
      </div>

      {/* Feed Header with Search & Filters */}
      <div className="feed-header">
        <div className="search-filter-bar">
          {/* Search Box */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Buscar sillas de ruedas, inyecciones, acompañamiento, medicamentos..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Tabs: All, Solicitudes, Ofrecimientos */}
          <div className="type-tabs">
            <button 
              className={`type-tab-btn ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              Todos los Anuncios
            </button>
            <button 
              className={`type-tab-btn ${selectedType === 'solicitud' ? 'active' : ''}`}
              onClick={() => setSelectedType('solicitud')}
            >
              ❤️ Solicitudes
            </button>
            <button 
              className={`type-tab-btn ${selectedType === 'ofrecimiento' ? 'active' : ''}`}
              onClick={() => setSelectedType('ofrecimiento')}
            >
              🤝 Ofrecimientos
            </button>
          </div>
        </div>

        {/* Category Scroll Chips */}
        <div className="category-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="cards-grid">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onConnect={onConnect} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <Heart size={48} color="#f43f5e" style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No encontramos publicaciones en este filtro</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Sé la primera persona en solicitar u ofrecer este apoyo a la comunidad.</p>
          <button className="btn-primary" onClick={openCreateModal} style={{ margin: '0 auto' }}>
            Publicar en el Muro
          </button>
        </div>
      )}
    </div>
  );
}
