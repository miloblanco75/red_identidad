import React, { useState } from 'react';
import { Truck, ShieldCheck, Plus, CheckCircle, MapPin, UserCheck, X } from 'lucide-react';
import { INITIAL_VOLUNTEERS } from '../data/initialData';

export default function TransportVolunteerModal({ isOpen, onClose, onRegisterVolunteer }) {
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('Automóvil particular');
  const [zone, setZone] = useState('Zona Centro');
  const [availability, setAvailability] = useState('Fin de semana');

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    const newVol = {
      id: `vol-${Date.now()}`,
      name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      vehicle,
      zone,
      availability,
      deliveriesDone: 0,
      status: 'Disponible'
    };

    setVolunteers([newVol, ...volunteers]);
    if (onRegisterVolunteer) onRegisterVolunteer(newVol);
    setShowRegisterForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Truck size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Voluntariado de Transporte Solidario</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Los <strong>Mensajeros de la Esperanza</strong> ayudan a trasladar sillas de ruedas, muletas u objetos pesados desde la casa del donante hasta la persona que lo requiere.
          </p>

          {!showRegisterForm ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>Mensajeros Activos en la Comunidad</h4>
                <button className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={() => setShowRegisterForm(true)}>
                  <Plus size={15} /> Registrarme como Mensajero
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: 320, overflowY: 'auto' }}>
                {volunteers.map(vol => (
                  <div key={vol.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={vol.avatar} alt={vol.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{vol.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          <Truck size={12} style={{ display: 'inline', marginRight: 4 }} /> {vol.vehicle} • <MapPin size={12} style={{ display: 'inline', marginRight: 2 }} /> {vol.zone}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-offer" style={{ fontSize: '0.75rem' }}>
                        <CheckCircle size={12} /> {vol.deliveriesDone} trasladados
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: 4 }}>
                        {vol.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleRegister}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Formulario de Inscripción de Mensajero</h4>

              <div className="form-group">
                <label className="form-label">Tu Nombre o Seudónimo</label>
                <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Juan Pérez" />
              </div>

              <div className="form-group">
                <label className="form-label">Medio de Transporte Disponible</label>
                <select className="form-control" value={vehicle} onChange={e => setVehicle(e.target.value)}>
                  <option value="Automóvil particular">Automóvil particular</option>
                  <option value="Camioneta / Furgoneta">Camioneta / Furgoneta</option>
                  <option value="Motocicleta">Motocicleta</option>
                  <option value="Bicicleta de carga">Bicicleta de carga</option>
                  <option value="A pie (Traslados locales de 1 km)">A pie (Traslados locales de 1 km)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Zona o Colonia donde puedes brindar apoyo</label>
                <input type="text" className="form-control" required value={zone} onChange={e => setZone(e.target.value)} placeholder="Ej. Colonia Roma, Centro y alrededores" />
              </div>

              <div className="form-group">
                <label className="form-label">Disponibilidad de Horario</label>
                <input type="text" className="form-control" value={availability} onChange={e => setAvailability(e.target.value)} placeholder="Ej. Fines de semana de 10am a 2pm" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRegisterForm(false)}>
                  Volver a la lista
                </button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                  Confirmar Registro Solidario
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
