import React, { useState } from 'react';
import { Heart, Volume2, Plus, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';
import { INITIAL_GRATITUDE_LETTERS } from '../data/initialData';

export default function GratitudeWallView({ letters = INITIAL_GRATITUDE_LETTERS, onAddLetter }) {
  const [lettersList, setLettersList] = useState(letters);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newLetter = {
      id: `let-${Date.now()}`,
      author: 'Integrante de Conectando',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      recipient: recipient || 'A toda la comunidad',
      title,
      content,
      date: 'Hace unos momentos',
      audioUrl: null,
      likesCount: 1
    };

    setLettersList([newLetter, ...lettersList]);
    if (onAddLetter) onAddLetter(newLetter);
    setShowAddModal(false);
    setTitle('');
    setContent('');
    setRecipient('');
  };

  const toggleAudioPlay = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      // Simulate audio play auto-stop after 4s
      setTimeout(() => setPlayingAudioId(null), 4000);
    }
  };

  const handleLike = (id) => {
    setLettersList(prev => prev.map(l => l.id === id ? { ...l, likesCount: l.likesCount + 1 } : l));
  };

  return (
    <div className="gratitude-wall-view">
      <div className="gallery-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '999px', backgroundColor: '#fff1f2', color: '#e11d48', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} /> Palabras que Llenan el Alma
        </div>
        <h2>Muro de Cartas & Mensajes de Gratitud</h2>
        <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
          Cartas digitales y testimonios de quienes han recibido apoyo o donación en Conectando. Recordándonos que la solidaridad nos iguala y reconforta a todos.
        </p>

        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ margin: '0 auto 2rem auto' }}>
          <Plus size={16} /> Escribir Carta de Agradecimiento
        </button>
      </div>

      {/* Grid of Letters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {lettersList.map(letter => (
          <div key={letter.id} style={{ backgroundColor: '#fffdfa', border: '1px solid #fed7aa', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src={letter.authorAvatar} alt={letter.author} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fecdd3' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{letter.author}</div>
                <div style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 600 }}>
                  Para: {letter.recipient}
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
              "{letter.title}"
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, flex: 1, marginBottom: '1.25rem', fontStyle: 'italic' }}>
              {letter.content}
            </p>

            {/* Simulated Audio Note if present */}
            {letter.audioUrl && (
              <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '0.6rem 0.85rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#be123c', fontWeight: 600 }}>
                  <Volume2 size={16} />
                  <span>{playingAudioId === letter.letterId ? 'Reproduciendo audio...' : 'Escuchar mensaje de voz'}</span>
                </div>
                <button 
                  onClick={() => toggleAudioPlay(letter.id)}
                  style={{ backgroundColor: '#e11d48', color: 'white', border: 'none', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {playingAudioId === letter.id ? 'Pausar' : '▶ Escuchar'}
                </button>
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed #fed7aa', fontSize: '0.8rem', color: '#64748b' }}>
              <span>{letter.date}</span>
              <button 
                onClick={() => handleLike(letter.id)}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#e11d48', fontWeight: 700, cursor: 'pointer' }}
              >
                <Heart size={15} fill="currentColor" /> {letter.likesCount} me alegra
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Escribir Carta */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart color="#e11d48" size={20} fill="currentColor" />
                Escribir Carta de Gratitud
              </h3>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">¿A quién dedicas esta carta?</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ej. A Sofía Morales / A los voluntarios de enfermería"
                  required
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Título de tu carta</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ej. Gracias por la silla de ruedas que me volvió la alegría"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contenido de tu mensaje o experiencia</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  placeholder="Expresa con tus propias palabras lo que este acto solidario significó para ti..."
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Publicar Carta con Amor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
