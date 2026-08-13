import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, CheckCircle2, Heart, User, Stethoscope } from 'lucide-react';
import { INITIAL_CARE_SCHEDULE } from '../data/initialData';

export default function CareScheduleView({ scheduleItems = INITIAL_CARE_SCHEDULE, onAddScheduleItem }) {
  const [items, setItems] = useState(scheduleItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [person, setPerson] = useState('');
  const [category, setCategory] = useState('Salud');
  const [day, setDay] = useState('Martes y Jueves');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('Domicilio');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: `sch-${Date.now()}`,
      title,
      person,
      category,
      day,
      time,
      location,
      status: 'Confirmado'
    };

    setItems([...items, newItem]);
    if (onAddScheduleItem) onAddScheduleItem(newItem);
    setShowAddModal(false);
    setTitle('');
    setPerson('');
  };

  return (
    <div className="care-schedule-view">
      <div className="gallery-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '999px', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <Calendar size={16} /> Compromisos Solidarios Fijos
        </div>
        <h2>Agenda de Cuidados y Acompañamiento Recurrente</h2>
        <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
          Organización de visitas constantes de enfermería, aplicación periódica de inyecciones y llamadas semanales de compañía agendadas.
        </p>

        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ margin: '0 auto 2rem auto', background: 'linear-gradient(135deg, #059669, #047857)' }}>
          <Plus size={16} /> Agendar Cuidado Recurrente
        </button>
      </div>

      {/* Grid of Scheduled Care */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="badge badge-offer" style={{ fontSize: '0.75rem' }}>
                <Stethoscope size={12} /> {item.category}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                {item.status}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0f172a' }}>{item.title}</h3>
            
            <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} color="#f43f5e" /> {item.person}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} color="#059669" /> <strong>Días:</strong> {item.day}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="#059669" /> <strong>Hora:</strong> {item.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="#059669" /> <strong>Lugar:</strong> {item.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Agendar Cuidado o Visita Recurrente</h3>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre de la actividad</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ej. Aplicación de Inyección / Llamada de Acompañamiento"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Participantes (Quien brinda ➔ Quien recibe)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ej. Dra. Rosaura ➔ Sra. Teresa"
                  required
                  value={person}
                  onChange={e => setPerson(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-group">
                <div>
                  <label className="form-label">Días agendados</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Ej. Lunes y Viernes"
                    required
                    value={day}
                    onChange={e => setDay(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Horario</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Ej. 10:00 AM"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Lugar o Modalidad</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ej. Domicilio Col. Roma / Llamada Telefónica"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                  Guardar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
