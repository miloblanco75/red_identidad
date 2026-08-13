import React, { useState } from 'react';
import { User, Shield, Camera, Heart, CheckCircle2, MapPin, Edit3 } from 'lucide-react';
import { AVATAR_OPTIONS } from '../data/initialData';
import PostCard from './PostCard';

export default function ProfileView({ user, onUpdateUser, userPosts, onConnect }) {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [nameText, setNameText] = useState(user.name);

  const handleSelectAvatar = (url) => {
    onUpdateUser({ ...user, avatar: url });
    setShowAvatarPicker(false);
  };

  const handleCustomAvatarSubmit = (e) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      onUpdateUser({ ...user, avatar: customAvatarUrl.trim() });
      setCustomAvatarUrl('');
      setShowAvatarPicker(false);
    }
  };

  const handleSaveProfile = () => {
    onUpdateUser({ ...user, name: nameText, bio: bioText });
    setIsEditingBio(false);
  };

  return (
    <div className="profile-view">
      {/* Profile Header */}
      <div className="profile-card-header">
        <div style={{ position: 'relative' }}>
          <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
          <button 
            onClick={() => setShowAvatarPicker(true)}
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              backgroundColor: '#f43f5e',
              color: 'white',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
            title="Cambiar Foto o Avatar"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="profile-info">
          <div className="profile-badge-row">
            <span className="badge badge-offer" style={{ fontSize: '0.82rem' }}>
              <Shield size={14} /> Corazón Solidario
            </span>
            <span className="badge badge-category" style={{ fontSize: '0.82rem' }}>
              <MapPin size={14} /> {user.location}
            </span>
          </div>

          {isEditingBio ? (
            <div style={{ marginBottom: '1rem' }}>
              <input 
                type="text" 
                className="form-control" 
                value={nameText} 
                onChange={e => setNameText(e.target.value)}
                style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}
              />
              <textarea 
                className="form-control" 
                rows={2} 
                value={bioText} 
                onChange={e => setBioText(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="btn-primary" onClick={handleSaveProfile} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  Guardar
                </button>
                <button className="btn-secondary" onClick={() => setIsEditingBio(false)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 className="profile-name">{user.name}</h1>
                <button 
                  onClick={() => setIsEditingBio(true)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  title="Editar perfil"
                >
                  <Edit3 size={18} />
                </button>
              </div>
              <p className="profile-bio">{user.bio}</p>
            </>
          )}

          {/* Stats Bar */}
          <div className="profile-stats-row">
            <div className="stat-box">
              <span className="stat-number">{user.actsCompleted}</span>
              <span className="stat-label">Conexiones Solidarias</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{user.thanksReceived}</span>
              <span className="stat-label">Agradecimientos Recibidos</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Dignidad e Igualdad</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Active Posts */}
      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Heart size={20} color="#f43f5e" fill="currentColor" /> Mis Publicaciones en el Muro
      </h3>

      {userPosts.length > 0 ? (
        <div className="cards-grid">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} onConnect={onConnect} />
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
          No has realizado publicaciones activas aún. ¡Puedes crear una en cualquier momento!
        </div>
      )}

      {/* Avatar Selector Modal */}
      {showAvatarPicker && (
        <div className="modal-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Selecciona tu Foto o Avatar</h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                Elige uno de nuestros avatares amables e ilustrativos o escribe la URL de tu foto de perfil.
              </p>

              <div className="avatar-picker-grid">
                {AVATAR_OPTIONS.map((imgUrl, idx) => (
                  <img 
                    key={idx}
                    src={imgUrl}
                    alt={`Avatar option ${idx}`}
                    className={`avatar-option ${user.avatar === imgUrl ? 'selected' : ''}`}
                    onClick={() => handleSelectAvatar(imgUrl)}
                  />
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <form onSubmit={handleCustomAvatarSubmit}>
                  <label className="form-label">O usa la URL de tu propia foto:</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="url" 
                      className="form-control"
                      placeholder="https://..."
                      value={customAvatarUrl}
                      onChange={e => setCustomAvatarUrl(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">
                      Usar
                    </button>
                  </div>
                </form>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button className="btn-secondary" onClick={() => setShowAvatarPicker(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
