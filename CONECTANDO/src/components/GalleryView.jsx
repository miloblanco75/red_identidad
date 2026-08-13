import React, { useState } from 'react';
import { Image, Heart, Sparkles, Plus, Calendar } from 'lucide-react';

export default function GalleryView({ galleryItems, onAddGalleryItem }) {
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Salud');
  const [story, setStory] = useState('');
  const [image, setImage] = useState('');
  const [donor, setDonor] = useState('');

  const filteredItems = galleryItems.filter(item => {
    if (filter === 'all') return true;
    return item.category.toLowerCase() === filter.toLowerCase();
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: `gal-${Date.now()}`,
      title,
      category,
      date: 'Reciente',
      image: image.trim() || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      donor: donor || 'Integrante Solidario',
      recipient: 'Comunidad Conectando',
      story
    };

    onAddGalleryItem(newItem);
    setShowAddModal(false);
    setTitle('');
    setStory('');
    setImage('');
  };

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '999px', backgroundColor: '#fff1f2', color: '#e11d48', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} /> Muro de Gratitud e Impacto
        </div>
        <h2>Galería de Entregas y Corazones Felices</h2>
        <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
          Cada fotografía representa una sonrisa, una silla de ruedas que devolvió autonomía, una inyección administrada con ternura o una charla reconfortante.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button className={`btn-secondary ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Ver Todo
          </button>
          <button className={`btn-secondary ${filter === 'movilidad' ? 'active' : ''}`} onClick={() => setFilter('movilidad')}>
            Aparatos & Movilidad
          </button>
          <button className={`btn-secondary ${filter === 'salud' ? 'active' : ''}`} onClick={() => setFilter('salud')}>
            Salud & Cuidados
          </button>
          <button className={`btn-secondary ${filter === 'acompañamiento' ? 'active' : ''}`} onClick={() => setFilter('acompañamiento')}>
            Compañía & Escucha
          </button>

          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ marginLeft: 'auto' }}>
            <Plus size={16} /> Compartir Foto de Entrega
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="gallery-item-card">
            <div className="gallery-img-wrap">
              <img src={item.image} alt={item.title} />
              <span className="badge badge-offer" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
                {item.category}
              </span>
            </div>

            <div className="gallery-item-content">
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                <Calendar size={12} /> {item.date}
              </div>
              <h3 className="gallery-title">{item.title}</h3>
              <p className="gallery-story">{item.story}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Gallery Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Publicar en Galería de Gratitud</h3>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Título de la Entrega o Momento</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ej. Silla de ruedas entregada a Don Ernesto"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Movilidad">Movilidad</option>
                  <option value="Salud">Salud & Medicina</option>
                  <option value="Acompañamiento">Acompañamiento & Escucha</option>
                  <option value="Varios">Varios</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Historia o Testimonio breve</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  placeholder="Relata el momento cálido vivido..."
                  required
                  value={story}
                  onChange={e => setStory(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL de la Foto</label>
                <input 
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={image}
                  onChange={e => setImage(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Publicar Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
