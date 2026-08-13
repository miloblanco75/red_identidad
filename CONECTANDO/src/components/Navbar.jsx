import React from 'react';
import { Heart, MessageCircle, Image, User, PlusCircle, ShieldCheck, Navigation, Calendar, Truck, Mail } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  openCreateModal, 
  openStaffModal,
  openTransportModal,
  unreadCount = 1 
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('muro')}>
          <div className="brand-icon">
            <Heart size={24} fill="currentColor" />
          </div>
          <div className="brand-title">
            Conectando
            <span className="brand-subtitle">Red de Solidaridad</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs" style={{ flexWrap: 'wrap' }}>
          <button 
            className={`nav-tab-btn ${activeTab === 'muro' ? 'active' : ''}`}
            onClick={() => setActiveTab('muro')}
          >
            <Heart size={17} />
            <span>Muro</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            <Navigation size={17} />
            <span>Radar Vecinal</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'cartas' ? 'active' : ''}`}
            onClick={() => setActiveTab('cartas')}
          >
            <Mail size={17} />
            <span>Cartas Gratitud</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'agenda' ? 'active' : ''}`}
            onClick={() => setActiveTab('agenda')}
          >
            <Calendar size={17} />
            <span>Agenda Cuidados</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'galeria' ? 'active' : ''}`}
            onClick={() => setActiveTab('galeria')}
          >
            <Image size={17} />
            <span>Galería</span>
          </button>

          <button 
            className={`nav-tab-btn ${activeTab === 'mensajes' ? 'active' : ''}`}
            onClick={() => setActiveTab('mensajes')}
            style={{ position: 'relative' }}
          >
            <MessageCircle size={17} />
            <span>Mensajes</span>
            {unreadCount > 0 && (
              <span className="badge" style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: '#e11d48', color: 'white' }}>
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Header Actions */}
        <div className="nav-actions">
          <button 
            className="btn-secondary"
            onClick={openTransportModal}
            title="Mensajeros de la Esperanza"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <Truck size={17} color="#059669" />
            <span>Mensajeros</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={openStaffModal} 
            title="Protección y Guía del Staff"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
          >
            <ShieldCheck size={17} color="#059669" />
            <span>Seguridad Staff</span>
          </button>

          <button className="btn-primary" onClick={openCreateModal} style={{ padding: '0.5rem 1rem' }}>
            <PlusCircle size={17} />
            <span>Publicar</span>
          </button>

          <div className="user-profile-pill" onClick={() => setActiveTab('perfil')}>
            <img src={user.avatar} alt={user.name} className="avatar-img" />
            <span className="user-pill-name">{user.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
