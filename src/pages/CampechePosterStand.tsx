import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Copy, Check, ArrowLeft, QrCode, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCampecheCampaignQrUrl } from '../lib/campecheTrialService';

export const CampechePosterStand: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const allyParam = searchParams.get('ally') || '';
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'poster' | 'pure_qr'>('poster');

  const campaignUrl = getCampecheCampaignQrUrl(allyParam || undefined);

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
      backgroundColor: '#141418',
      padding: '2rem 1rem',
      fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Barra superior de herramientas (se oculta al imprimir) */}
      <div className="no-print" style={{
        width: '100%',
        maxWidth: '780px',
        backgroundColor: '#0E0E12',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
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
          onClick={() => navigate('/app')}
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
          <span>Volver a la App</span>
        </button>

        {/* Selector de Modo: Cartel Completo vs Sticker QR 12x12 cm */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(255,255,255,0.06)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setViewMode('poster')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: viewMode === 'poster' ? 'var(--accent-gold)' : 'transparent',
              color: viewMode === 'poster' ? '#121212' : '#AAA',
              transition: 'all 0.2s'
            }}
          >
            <FileText size={14} />
            <span>Cartel Mostrador</span>
          </button>
          <button
            onClick={() => setViewMode('pure_qr')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: viewMode === 'pure_qr' ? 'var(--accent-gold)' : 'transparent',
              color: viewMode === 'pure_qr' ? '#121212' : '#AAA',
              transition: 'all 0.2s'
            }}
          >
            <QrCode size={14} />
            <span>Sticker QR (12x12 cm)</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
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
              backgroundColor: 'var(--accent-gold)',
              border: 'none',
              color: '#121212',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
            }}
          >
            <Printer size={18} />
            <span>Imprimir ({viewMode === 'poster' ? 'Cartel' : 'QR 12x12 cm'})</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODO 1: CARTEL COMPLETO CON QR CALIBRADO A 12 X 12 CM
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'poster' && (
        <div 
          id="printable-campeche-poster"
          style={{
            width: '100%',
            maxWidth: '620px',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            borderRadius: '24px',
            padding: '2rem 2.2rem 1.6rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            border: '3px solid #D4AF37',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* Franja decorativa superior dorada */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '10px',
            background: 'linear-gradient(90deg, #B8860B 0%, #D4AF37 50%, #F5F7FA 100%)'
          }} />

          {/* Insignia Oficial Red Identidad Campeche */}
          <div style={{
            margin: '0.4rem auto 0.8rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src="/logo.png" 
              alt="Red Identidad — Campeche" 
              style={{ 
                height: '75px', 
                width: 'auto', 
                maxWidth: '280px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                filter: 'drop-shadow(0 4px 14px rgba(212,175,55,0.3))'
              }} 
            />
          </div>

          {/* Comercio Aliado (si fue personalizado) */}
          {allyParam && (
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#0F172A',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              📍 {allyParam}
            </div>
          )}

          {/* Badge de Campaña Oficial Campeche */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#121212',
            color: 'var(--accent-gold)',
            border: '1.5px solid var(--accent-gold)',
            padding: '5px 22px',
            borderRadius: '100px',
            fontSize: '0.82rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.6rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            ★ SEMANA DE LANZAMIENTO CAMPECHE ★
          </div>

          {/* Título Principal de Alto Impacto */}
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 950,
            lineHeight: 1.15,
            color: '#121212',
            margin: '0 0 0.4rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
          }}>
            ¡OBTÉN TU MEMBRESÍA GRATIS POR 7 DÍAS!
          </h1>

          <p style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#475569',
            maxWidth: '510px',
            margin: '0 auto 1.2rem',
            lineHeight: 1.4
          }}>
            Escanea con la cámara de tu celular y llévate descuentos de hasta el 15% en los mejores restaurantes, cafeterías y comercios aliados en Campeche y Carmen.
          </p>

          {/* Recuadro Destacado con el Código QR CALIBRADO A EXACTAMENTE 12 X 12 CM */}
          <div 
            className="qr-calibrated-container"
            style={{
              backgroundColor: '#FAFAF9',
              border: '3px dashed #D4AF37',
              borderRadius: '24px',
              padding: '1.2rem',
              width: '12cm',
              height: '12cm',
              maxWidth: '100%',
              margin: '0 auto 1.2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="qr-svg-wrapper"
              style={{
                backgroundColor: '#FFFFFF',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '2px solid #121212',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <QRCodeSVG 
                value={campaignUrl}
                size={340}
                level="H"
                imageSettings={{
                  src: '/logo.png',
                  height: 58,
                  width: 110,
                  excavate: true
                }}
              />
            </div>

            <div style={{
              fontSize: '0.9rem',
              fontWeight: 900,
              color: '#B8860B',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginTop: '8px'
            }}>
              📲 Escanea con tu cámara aquí
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
              Código QR Calibrado a 12 x 12 cm • 100% Digital
            </div>
          </div>

          {/* 3 Pasos Rápidos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.7rem',
            textAlign: 'center',
            marginBottom: '1.2rem'
          }}>
            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '0.75rem 0.5rem',
              borderRadius: '14px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#121212',
                color: 'var(--accent-gold)',
                fontWeight: 900,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px'
              }}>1</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#121212' }}>Escanea el QR</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px' }}>Apunta tu celular</div>
            </div>

            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '0.75rem 0.5rem',
              borderRadius: '14px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#D4AF37',
                color: '#121212',
                fontWeight: 900,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px'
              }}>2</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#121212' }}>Ingresa WhatsApp</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px' }}>Activación en 30s</div>
            </div>

            <div style={{
              backgroundColor: '#F8FAFC',
              padding: '0.75rem 0.5rem',
              borderRadius: '14px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#121212',
                color: '#4ADE80',
                fontWeight: 900,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px'
              }}>3</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#121212' }}>Ahorra en Caja</div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '1px' }}>Muestra tu Pase</div>
            </div>
          </div>

          {/* Pie de Cartel Oficial */}
          <div style={{
            borderTop: '1.5px solid #E2E8F0',
            paddingTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: '#64748B'
          }}>
            <div>
              <strong>{allyParam ? allyParam : 'Punto Aliado Oficial'}</strong> • Estado de Campeche
            </div>
            <div style={{ fontWeight: 800, color: '#121212' }}>
              Red Identidad — El poder de pertenecer
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODO 2: STICKER PURO QR CALIBRADO A EXACTAMENTE 12 X 12 CM
         ───────────────────────────────────────────────────────────── */}
      {viewMode === 'pure_qr' && (
        <div 
          id="printable-campeche-sticker-12x12"
          style={{
            width: '12cm',
            height: '12cm',
            backgroundColor: '#FFFFFF',
            color: '#121212',
            borderRadius: '20px',
            border: '4px solid #121212',
            padding: '0.8cm',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* Header del sticker */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
            <img 
              src="/logo.png" 
              alt="Red Identidad" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.06em', color: '#B8860B', textTransform: 'uppercase' }}>
              7 DÍAS GRATIS
            </span>
          </div>

          {/* QR de gran resolución calibrado a 12x12 cm */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <QRCodeSVG 
              value={campaignUrl}
              size={290}
              level="H"
              imageSettings={{
                src: '/logo.png',
                height: 48,
                width: 90,
                excavate: true
              }}
            />
          </div>

          {/* Footer del sticker */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#121212' }}>
              ¡ESCANEA CON TU CELULAR!
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>
              {allyParam ? `Aliado: ${allyParam} • Campeche` : 'Descuentos inmediatos en Comercios Aliados'}
            </div>
          </div>
        </div>
      )}

      {/* Estilos específicos para impresión */}
      <style>{`
        @page {
          size: letter portrait;
          margin: 6mm;
        }
        @media print {
          html, body {
            background-color: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            height: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }

          /* Cartel Completo en Hoja Carta */
          #printable-campeche-poster {
            width: 100% !important;
            max-width: 100% !important;
            height: calc(100vh - 12mm) !important;
            max-height: 265mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: 3px solid #D4AF37 !important;
            border-radius: 16px !important;
            margin: 0 auto !important;
            padding: 1.2rem 1.6rem 0.8rem !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }

          /* QR Calibrado a exactamente 12 x 12 cm */
          .qr-calibrated-container {
            width: 12cm !important;
            height: 12cm !important;
            max-width: 12cm !important;
            max-height: 12cm !important;
            margin: 0.3rem auto !important;
            padding: 0.4cm !important;
            box-sizing: border-box !important;
          }

          /* Sticker Puro QR de 12 x 12 cm para corte */
          #printable-campeche-sticker-12x12 {
            width: 12cm !important;
            height: 12cm !important;
            max-width: 12cm !important;
            max-height: 12cm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: 3px solid #121212 !important;
            margin: 1cm auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CampechePosterStand;
