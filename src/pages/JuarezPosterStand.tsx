import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Copy, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getJuarezCampaignQrUrl } from '../lib/juarezTrialService';

export const JuarezPosterStand: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const allyParam = searchParams.get('ally') || '';
  const [copied, setCopied] = useState(false);

  const campaignUrl = getJuarezCampaignQrUrl(allyParam || undefined);

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1E1E24',
      padding: '2rem 1rem',
      fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Barra superior de herramientas (se oculta al imprimir) */}
      <div className="no-print" style={{
        width: '100%',
        maxWidth: '750px',
        backgroundColor: '#0E0E12',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 1.4rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
      }}>
        <button
          onClick={() => navigate('/aliado-panel?city=juarez')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#A0A0A8',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Volver al Panel</span>
        </button>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={16} color="#4ADE80" /> : <Copy size={16} />}
            <span>{copied ? '¡Enlace copiado!' : 'Copiar Enlace'}</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#DC2626',
              border: 'none',
              color: '#FFF',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
            }}
          >
            <Printer size={18} />
            <span>Imprimir Cartel de Mostrador</span>
          </button>
        </div>
      </div>

      {/* ── CARTEL FÍSICO IMPRIMIBLE PARA MOSTRADOR / MESA ── */}
      <div 
        id="printable-poster"
        style={{
          width: '100%',
          maxWidth: '650px',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden',
          border: '4px solid #0B1525',
          textAlign: 'center'
        }}
      >
        {/* Franja decorativa superior con colores oficiales */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '10px',
          background: 'linear-gradient(90deg, #DC2626 0%, #0B1525 50%, #DC2626 100%)'
        }} />

        {/* Insignia Oficial Vive Juárez */}
        <div style={{ marginBottom: '1.2rem' }}>
          <img 
            src="/vive_juarez_oficial.png" 
            alt="Vive Juárez Insignia Oficial" 
            style={{ 
              height: '110px', 
              width: 'auto', 
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto'
            }} 
          />
        </div>

        {/* Badge de Campaña */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          padding: '6px 20px',
          borderRadius: '100px',
          fontSize: '0.85rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
        }}>
          ★ SEMANA DE LANZAMIENTO ★
        </div>

        {/* Título Principal de Alto Impacto */}
        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 950,
          lineHeight: 1.1,
          color: '#0B1525',
          margin: '0 0 0.8rem',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase'
        }}>
          ¡OBTÉN TU MEMBRESÍA GRATIS POR 7 DÍAS!
        </h1>

        <p style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          color: '#475569',
          maxWidth: '520px',
          margin: '0 auto 1.8rem',
          lineHeight: 1.4
        }}>
          Escanea con la cámara de tu celular y llévate descuentos inmediatos en restaurantes y comercios de Ciudad Juárez.
        </p>

        {/* Recuadro Destacado con el Código QR */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '3px dashed #CBD5E1',
          borderRadius: '24px',
          padding: '1.8rem 1.5rem',
          maxWidth: '380px',
          margin: '0 auto 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1.2rem',
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            marginBottom: '1rem',
            border: '2px solid #0B1525'
          }}>
            <QRCodeSVG 
              value={campaignUrl}
              size={220}
              level="H"
              imageSettings={{
                src: '/vive_juarez_qr_icon.png',
                height: 52,
                width: 52,
                excavate: true
              }}
            />
          </div>

          <div style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: '#DC2626',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            📲 Escanea con tu cámara aquí
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Sin costo • 100% Digital • Sin tarjetas
          </div>
        </div>

        {/* 3 Pasos Rápidos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '1rem 0.6rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0B1525',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px'
            }}>1</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B1525' }}>Escanea el QR</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>Apunta tu celular</div>
          </div>

          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '1rem 0.6rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px'
            }}>2</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B1525' }}>Ingresa tu Celular</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>Activación inmediata</div>
          </div>

          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '1rem 0.6rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0B1525',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px'
            }}>3</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B1525' }}>Ahorra en Caja</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>Muestra tu Pase QR</div>
          </div>
        </div>

        {/* Pie de Cartel Oficial */}
        <div style={{
          borderTop: '2px solid #E2E8F0',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748B'
        }}>
          <div>
            <strong>Punto Aliado Oficial</strong> • Ciudad Juárez, Chih.
          </div>
          <div style={{ fontWeight: 700, color: '#0B1525' }}>
            Red Identidad — Orgullo Juarense
          </div>
        </div>

      </div>

      {/* Estilos específicos para impresión */}
      <style>{`
        @media print {
          body {
            background-color: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-poster {
            max-width: 100% !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
            margin: 0 !important;
            padding: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JuarezPosterStand;
