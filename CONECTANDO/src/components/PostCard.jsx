import React from 'react';
import { Heart, HandHeart, MessageCircle, MapPin, Shield, EyeOff, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';

export default function PostCard({ post, onConnect }) {
  const isRequest = post.type === 'solicitud';

  return (
    <div className={`post-card ${post.isUrgent ? 'urgent-border' : ''}`} style={post.isUrgent ? { border: '2px solid #f43f5e', boxShadow: '0 4px 20px rgba(244, 63, 94, 0.2)' } : {}}>
      {/* Image Wrap */}
      {post.image && (
        <div className="post-card-image-wrap">
          <img src={post.image} alt={post.title} className="post-card-img" />
          
          <div className="post-card-type-badge">
            <span className={`badge ${isRequest ? 'badge-request' : 'badge-offer'}`}>
              {isRequest ? (
                <>
                  <Heart size={13} fill="currentColor" /> Solicitud de Ayuda
                </>
              ) : (
                <>
                  <HandHeart size={13} /> Ofrecimiento Solidario
                </>
              )}
            </span>
          </div>

          {post.isLoan && (
            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
              <span className="badge" style={{ backgroundColor: '#0284c7', color: 'white', fontWeight: 700 }}>
                <RefreshCw size={12} /> Préstamo ({post.loanDuration || '3 meses'})
              </span>
            </div>
          )}

          {post.isUrgent && (
            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', zIndex: 2 }}>
              <span className="badge" style={{ backgroundColor: '#be123c', color: 'white', fontWeight: 800, padding: '0.35rem 0.75rem' }}>
                <AlertTriangle size={13} /> URGENCIAL MÉDICA
              </span>
            </div>
          )}

          {post.isPrivate && !post.isLoan && (
            <div className="post-card-privacy-badge">
              <span className="badge badge-private">
                <EyeOff size={12} /> Donación Privada
              </span>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="post-card-body">
        {/* User profile details - Dignity equal */}
        <div className="post-user-info">
          <img src={post.userAvatar} alt={post.userName} className="user-avatar-sm" />
          <div className="user-details">
            <span className="user-name">
              {post.isPrivate ? 'Integrante Solidario' : post.userName}
            </span>
            <span className="user-tag">
              <Shield size={12} /> Integrante Conectando
            </span>
          </div>
        </div>

        {/* Category tag */}
        <div style={{ marginBottom: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
            {post.categoryLabel}
          </span>
          {post.isLoan ? (
            <span className="badge" style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
              🔄 Comodato / Préstamo
            </span>
          ) : (
            <span className="badge" style={{ fontSize: '0.75rem', backgroundColor: '#fdf2f8', color: '#be185d', fontWeight: 600 }}>
              🎁 Donación Permanente
            </span>
          )}
          {post.distanceKm && (
            <span className="badge badge-category" style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              📍 A {post.distanceKm} km
            </span>
          )}
        </div>

        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>

        {/* Meta Details */}
        <div className="post-meta-details">
          <div className="meta-item">
            <MapPin size={14} />
            <span>{post.userLocation}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} />
            <span>{post.date}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="post-card-footer">
          <button 
            className="btn-card-action btn-primary"
            style={post.isUrgent ? { background: 'linear-gradient(135deg, #be123c, #881337)' } : {}}
            onClick={() => onConnect(post)}
          >
            <MessageCircle size={16} />
            <span>{isRequest ? 'Ofrecer mi Ayuda' : 'Solicitar Apoyo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
