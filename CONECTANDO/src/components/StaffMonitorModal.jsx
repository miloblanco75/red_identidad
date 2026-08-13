import React from 'react';
import { ShieldCheck, X, Heart, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StaffMonitorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Protección y Resguardo del Staff</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
            En <strong>Conectando</strong> cuidamos la tranquilidad, integridad y seguridad de cada integrante que ofrece o recibe ayuda.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Lock size={20} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Conservación de Conversaciones</h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Los chats de la plataforma son conservados y monitoreados de manera constante por nuestro equipo de staff voluntario para prevenir abusos, resolver dudas y acompañar cada entrega.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <CheckCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Protocolo de Entregas Seguras</h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Recomendamos agendar la entrega de sillas de ruedas u objetos en lugares de concurrencia pública o mediante nuestra red de apoyo de transporte voluntario.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Cero Tolerancia a Ventas o Cobros</h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Cualquier intento de venta, cobro de tarifa o condicionamiento monetario acarrea la suspensión inmediata del perfil.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={onClose}>
              Entendido y Aceptado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
