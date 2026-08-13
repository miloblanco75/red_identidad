import React, { useState } from 'react';
import { X, Heart, HandHeart, ShieldAlert, Image, EyeOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

export default function CreatePostModal({ isOpen, onClose, onSubmitPost }) {
  const [type, setType] = useState('solicitud');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('salud');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('Presencial');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLoan, setIsLoan] = useState(false);
  const [loanDuration, setLoanDuration] = useState('3 meses');
  const [confirmedFree, setConfirmedFree] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmedFree) {
      alert('Debes confirmar que esta interacción no incluye ventas ni cobro alguno.');
      return;
    }

    const selectedCatObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[1];

    const defaultImages = {
      salud: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      movilidad: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      escucha: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
      medicinas: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      alimentos: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
      educacion: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'
    };

    const newPost = {
      id: `post-${Date.now()}`,
      type,
      title,
      category,
      categoryLabel: selectedCatObj.label,
      description,
      image: imageUrl.trim() || defaultImages[category] || defaultImages.salud,
      userName: isPrivate ? 'Donante Solidario (Anónimo)' : 'Usuario Conectando',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      userLocation: location || 'Zona Centro, CDMX',
      distanceKm: 1.2,
      deliveryMode,
      isPrivate,
      isUrgent,
      isLoan,
      loanDuration: isLoan ? loanDuration : null,
      date: 'Hace un momento',
      status: 'abierto'
    };

    onSubmitPost(newPost);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
              <Heart size={18} fill="currentColor" />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Crear Publicación Solidaria</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Strict Warning Banner */}
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <ShieldAlert size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.82rem', color: '#92400e' }}>
              <strong>Política de la Comunidad:</strong> Queda estrictamente prohibida cualquier transacción monetaria, cobro o venta (aun a precio bajo). Todo apoyo en Conectando es 100% gratuito.
            </div>
          </div>

          {/* Type Switcher */}
          <div className="form-group">
            <label className="form-label">¿Qué deseas publicar?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn-secondary ${type === 'solicitud' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  padding: '0.75rem',
                  borderColor: type === 'solicitud' ? '#f43f5e' : '#e2e8f0',
                  backgroundColor: type === 'solicitud' ? '#fff1f2' : 'white',
                  color: type === 'solicitud' ? '#be123c' : '#475569'
                }}
                onClick={() => setType('solicitud')}
              >
                <Heart size={16} fill={type === 'solicitud' ? 'currentColor' : 'none'} />
                <span>Necesito Ayuda / Objeto</span>
              </button>

              <button
                type="button"
                className={`btn-secondary ${type === 'ofrecimiento' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  padding: '0.75rem',
                  borderColor: type === 'ofrecimiento' ? '#059669' : '#e2e8f0',
                  backgroundColor: type === 'ofrecimiento' ? '#ecfdf5' : 'white',
                  color: type === 'ofrecimiento' ? '#047857' : '#475569'
                }}
                onClick={() => setType('ofrecimiento')}
              >
                <HandHeart size={16} />
                <span>Deseo Donar / Apoyar</span>
              </button>
            </div>
          </div>

          {/* Modalidad de Apoyo: Donación Definitiva vs Préstamo Solidario */}
          <div className="form-group" style={{ backgroundColor: '#f0f9ff', padding: '0.85rem', borderRadius: '12px', border: '1px solid #bae6fd' }}>
            <label className="form-label" style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={15} /> ¿Modalidad de la entrega?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', backgroundColor: !isLoan ? 'white' : 'transparent', padding: '0.4rem 0.6rem', borderRadius: '8px', border: !isLoan ? '1px solid #0284c7' : 'none' }}>
                <input type="radio" name="loanMode" checked={!isLoan} onChange={() => setIsLoan(false)} style={{ accentColor: '#0284c7' }} />
                🎁 Donación Definitiva
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', backgroundColor: isLoan ? 'white' : 'transparent', padding: '0.4rem 0.6rem', borderRadius: '8px', border: isLoan ? '1px solid #0284c7' : 'none' }}>
                <input type="radio" name="loanMode" checked={isLoan} onChange={() => setIsLoan(true)} style={{ accentColor: '#0284c7' }} />
                🔄 Préstamo / Comodato
              </label>
            </div>

            {isLoan && (
              <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px dashed #bae6fd' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: '#0369a1' }}>Duración estimada del préstamo:</label>
                <select className="form-control" value={loanDuration} onChange={e => setLoanDuration(e.target.value)} style={{ padding: '0.45rem' }}>
                  <option value="1 mes">1 mes</option>
                  <option value="3 meses">3 meses</option>
                  <option value="6 meses">6 meses</option>
                  <option value="Hasta recuperación total">Hasta recuperación total</option>
                </select>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Título claro de lo que pides u ofreces</label>
            <input 
              type="text"
              className="form-control"
              placeholder="Ej. Silla de ruedas ortopédica / Aplico inyecciones / Charla amigable..."
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Área / Categoría</label>
            <select 
              className="form-control"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Descripción detallada</label>
            <textarea 
              className="form-control"
              rows={3}
              placeholder="Explica tu situación o el apoyo que ofreces con calidez y respeto..."
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Urgent Toggle */}
          <div className="form-group" style={{ backgroundColor: '#fff1f2', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fecdd3' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={isUrgent}
                onChange={e => setIsUrgent(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#e11d48' }}
              />
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#be123c', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={15} /> 🚨 Necesidad Médica Urgente (Señal del Corazón)
                </span>
                <p style={{ fontSize: '0.78rem', color: '#881337' }}>
                  Resalta la publicación arriba en el muro y envía alerta inmediata al Staff para acelerar la respuesta.
                </p>
              </div>
            </label>
          </div>

          {/* Location & Delivery Mode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-group">
            <div>
              <label className="form-label">Ubicación / Colonia</label>
              <input 
                type="text"
                className="form-control"
                placeholder="Ej. Colonia Roma Norte, CDMX"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Modalidad de entrega</label>
              <select 
                className="form-control"
                value={deliveryMode}
                onChange={e => setDeliveryMode(e.target.value)}
              >
                <option value="Presencial / Recolección">Presencial / Entrega</option>
                <option value="Visita a Domicilio">Visita a Domicilio</option>
                <option value="Llamada / Encuentro">Llamada / Encuentro</option>
                <option value="Virtual">Virtual</option>
                <option value="Envío Discreto por Staff">Envío Discreto por Staff</option>
              </select>
            </div>
          </div>

          {/* Image URL Optional */}
          <div className="form-group">
            <label className="form-label">URL de foto del objeto (Opcional)</label>
            <input 
              type="url"
              className="form-control"
              placeholder="https://..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>

          {/* Privacy Toggle */}
          <div className="form-group" style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#e11d48' }}
              />
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <EyeOff size={14} /> Publicación Privada / Anónima
                </span>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Tu nombre de usuario no aparecerá en el muro público; la interacción se canalizará a través del staff.
                </p>
              </div>
            </label>
          </div>

          {/* Mandatory Check */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={confirmedFree}
                onChange={e => setConfirmedFree(e.target.checked)}
                required
                style={{ width: 18, height: 18, accentColor: '#059669', marginTop: 3 }}
              />
              <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
                Declaro y acepto que esta publicación es totalmente gratuita y solidaria, y no exigirá pago o intercambio de dinero.
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Publicar con Amor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
