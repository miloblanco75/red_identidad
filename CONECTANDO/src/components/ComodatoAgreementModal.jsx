import React, { useState } from 'react';
import { FileText, ShieldCheck, Check, X, Download, Heart, Calendar } from 'lucide-react';

export default function ComodatoAgreementModal({ isOpen, onClose, post, user, peerName, onSignAgreement }) {
  const [signed, setSigned] = useState(false);
  const [months, setMonths] = useState('3 meses');

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleSign = () => {
    setSigned(true);
    if (onSignAgreement) {
      onSignAgreement({
        id: `comodato-${Date.now()}`,
        itemTitle: post ? post.title : 'Silla de Ruedas Ortopédica',
        lender: post ? post.userName : 'Donante Solidario',
        borrower: user ? user.name : 'Beneficiario',
        duration: months,
        date: todayStr,
        signedAt: new Date().toLocaleTimeString()
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Acuerdo de Comodato Solidario Digital</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Préstamo gratuito de bien con compromiso de devolución</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Printable Document Box */}
          <div style={{ backgroundColor: '#fafaf9', border: '2px solid #e7e5e4', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem', fontFamily: 'serif', color: '#1c1917', lineHeight: 1.6 }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #d6d3d1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h4 style={{ fontFamily: 'var(--font-family)', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0c4a6e', fontSize: '1.05rem', margin: 0 }}>
                CONTRATO SIMPLIFICADO DE COMODATO SOLIDARIO
              </h4>
              <span style={{ fontFamily: 'var(--font-family)', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                🛡️ Documento de Resguardo Gratuito • Red Conectando
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', marginBottom: '0.75rem' }}>
              En la fecha <strong>{todayStr}</strong>, a través de la Red Solidaria Conectando, acuerdan libremente:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: 'white', border: '1px solid #e7e5e4', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.84rem', fontFamily: 'sans-serif' }}>
              <div>
                <strong style={{ color: '#44403c' }}>COMODANTE (Quien presta):</strong>
                <div>{post ? post.userName : 'Integrante Donante'}</div>
              </div>
              <div>
                <strong style={{ color: '#44403c' }}>COMODATARIO (Quien recibe):</strong>
                <div>{user ? user.name : peerName || 'Integrante Beneficiario'}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>
              <strong>CLÁUSULAS DEL PRÉSTAMO:</strong>
              <ol style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>
                  <strong>Objeto:</strong> Se entrega en calidad de préstamo temporal el objeto denominado: <em>"{post ? post.title : 'Silla de Ruedas Ortopédica'}"</em>.
                </li>
                <li>
                  <strong>Gratuidad Absoluta:</strong> El presente comodato es estrictamente gratuito. Queda prohibido cualquier cobro, alquiler o renta.
                </li>
                <li>
                  <strong>Duración estimada:</strong> El préstamo se establece por un periodo de 
                  <select 
                    value={months}
                    onChange={e => setMonths(e.target.value)}
                    style={{ marginLeft: 6, marginRight: 6, padding: '2px 6px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'sans-serif', fontWeight: 700 }}
                  >
                    <option value="1 mes">1 mes</option>
                    <option value="3 meses">3 meses</option>
                    <option value="6 meses">6 meses</option>
                    <option value="Hasta recuperación total">Hasta recuperación total</option>
                  </select>.
                </li>
                <li>
                  <strong>Compromiso de Cuidado y Devolución:</strong> El comodatario se compromete a usar el objeto con el debido cuidado y devolverlo al término de la recuperación o plazo acordado para que beneficie a otro integrante.
                </li>
              </ol>
            </div>

            {signed && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', color: '#047857', fontFamily: 'sans-serif', fontSize: '0.85rem', fontWeight: 700 }}>
                <Check size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Firmado Digitalmente por ambas partes e Ingresado en el Registro del Staff
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            {!signed ? (
              <button className="btn-primary" onClick={handleSign} style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                <FileText size={16} /> Aceptar y Firmar Comodato Digital
              </button>
            ) : (
              <button className="btn-primary" onClick={onClose} style={{ background: '#059669' }}>
                <Download size={16} /> Descargar Comodato PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
