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
          maxWidth: '580px',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          borderRadius: '20px',
          padding: '1.8rem 2rem 1.4rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid #0B1525',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Franja decorativa superior con colores oficiales */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #DC2626 0%, #0B1525 50%, #DC2626 100%)'
        }} />

        {/* Insignia Oficial Juárez Conecta — Gran Protagonismo de Marca */}
        <div style={{
          margin: '0.2rem auto 0.8rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src="/juarez_conecta.png" 
            alt="Juárez Conecta — Red Identidad" 
            style={{ 
              height: '175px', 
              width: 'auto', 
              maxWidth: '330px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.1))'
            }} 
          />
        </div>

        {/* Comercio Aliado (si fue personalizado) */}
        {allyParam && (
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 900,
            color: '#0B1525',
            marginBottom: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            📍 {allyParam}
          </div>
        )}

        {/* Badge de Campaña */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#DC2626',
          color: '#FFFFFF',
          padding: '4px 18px',
          borderRadius: '100px',
          fontSize: '0.78rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.5rem',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
        }}>
          ★ SEMANA DE LANZAMIENTO ★
        </div>

        {/* Título Principal de Alto Impacto */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 950,
          lineHeight: 1.15,
          color: '#0B1525',
          margin: '0 0 0.35rem',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase'
        }}>
          ¡OBTÉN TU MEMBRESÍA GRATIS POR 7 DÍAS!
        </h1>

        <p style={{
          fontSize: '0.88rem',
          fontWeight: 600,
          color: '#475569',
          maxWidth: '470px',
          margin: '0 auto 0.9rem',
          lineHeight: 1.35
        }}>
          Escanea con la cámara de tu celular y llévate descuentos inmediatos en restaurantes y comercios aliados de <strong>Juárez Conecta</strong>.
        </p>

        {/* Recuadro Destacado con el Código QR */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '2.5px dashed #CBD5E1',
          borderRadius: '20px',
          padding: '1rem 1.2rem',
          maxWidth: '340px',
          margin: '0 auto 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '18px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            marginBottom: '0.5rem',
            border: '2.5px solid #0B1525'
          }}>
            <QRCodeSVG 
              value={campaignUrl}
              size={215}
              level="H"
              imageSettings={{
                src: '/juarez_conecta.png',
                height: 54,
                width: 99,
                excavate: true
              }}
            />
          </div>

          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#DC2626',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            📲 Escanea con tu cámara aquí
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            Sin costo • 100% Digital • Sin tarjetas
          </div>
        </div>

        {/* 3 Pasos Rápidos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.6rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '0.65rem 0.4rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#0B1525',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px'
            }}>1</div>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0B1525' }}>Escanea el QR</div>
            <div style={{ fontSize: '0.66rem', color: '#64748B', marginTop: '1px' }}>Apunta tu celular</div>
          </div>

          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '0.65rem 0.4rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px'
            }}>2</div>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0B1525' }}>Ingresa Celular</div>
            <div style={{ fontSize: '0.66rem', color: '#64748B', marginTop: '1px' }}>Activación inmediata</div>
          </div>

          <div style={{
            backgroundColor: '#F1F5F9',
            padding: '0.65rem 0.4rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#0B1525',
              color: '#FFF',
              fontWeight: 900,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px'
            }}>3</div>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0B1525' }}>Ahorra en Caja</div>
            <div style={{ fontSize: '0.66rem', color: '#64748B', marginTop: '1px' }}>Muestra tu Pase QR</div>
          </div>
        </div>

        {/* Pie de Cartel Oficial */}
        <div style={{
          borderTop: '1.5px solid #E2E8F0',
          paddingTop: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: '#64748B'
        }}>
          <div>
            <strong>{allyParam ? allyParam : 'Punto Aliado Oficial'}</strong> • Ciudad Juárez, Chih.
          </div>
          <div style={{ fontWeight: 700, color: '#0B1525' }}>
            Red Identidad — Orgullo Juarense
          </div>
        </div>

      </div>

      {/* Estilos específicos para impresión */}
      <style>{`
        @page {
          size: letter portrait;
          margin: 8mm;
        }
        @media print {
          html, body {
            background-color: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-poster {
            width: 100% !important;
            max-width: 100% !important;
            height: calc(100vh - 16mm) !important;
            max-height: 260mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: 3px solid #0B1525 !important;
            border-radius: 16px !important;
            margin: 0 auto !important;
            padding: 1.2rem 1.6rem 0.8rem !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
};

export default JuarezPosterStand;
