import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Copy, Check, ArrowLeft, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCampecheCampaignQrUrl } from '../lib/campecheTrialService';

export const CampechePosterStand: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [stickerColor, setStickerColor] = useState<'white' | 'black'>('white');
  const [layoutMode, setLayoutMode] = useState<'single' | 'duo'>('single');

  // URL a la que dirigirá el QR al escanearse en paradas de camión / terminales
  const campaignUrl = getCampecheCampaignQrUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Componente que dibuja exactamente 1 Sticker de 12 x 12 cm de puro misterio
  const MysterySticker = ({ idSuffix = '1' }: { idSuffix?: string }) => {
    const isDark = stickerColor === 'black';
    const bgColor = isDark ? '#000000' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const borderColor = isDark ? '#333333' : '#E2E8F0';

    return (
      <div 
        id={`mystery-sticker-12x12-${idSuffix}`}
        className="sticker-12x12"
        style={{
          width: '12cm',
          height: '12cm',
          maxWidth: '12cm',
          maxHeight: '12cm',
          backgroundColor: bgColor,
          color: textColor,
          boxSizing: 'border-box',
          padding: '0.6cm',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          borderRadius: '4px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          border: `1.5px solid ${borderColor}`,
          userSelect: 'none'
        }}
      >
        {/* Guías de corte punteadas de 12x12 cm en las esquinas */}
        <div className="crop-mark top-left" />
        <div className="crop-mark top-right" />
        <div className="crop-mark bottom-left" />
        <div className="crop-mark bottom-right" />

        {/* CÓDIGO QR PURO (SIN LOGOTIPO, 100% ESCANEABLE A DISTANCIA) */}
        <div 
          style={{
            width: '9.2cm',
            height: '9.2cm',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            margin: '0 auto'
          }}
        >
          <QRCodeSVG 
            value={campaignUrl}
            size={345}
            level="M"
            fgColor={textColor}
            bgColor={bgColor}
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        </div>

        {/* ÚNICO TEXTO: LA PALABRA 'DESCUENTOS' (PURO MISTERIO) */}
        <div 
          style={{
            width: '100%',
            textAlign: 'center',
            paddingTop: '0.2cm'
          }}
        >
          <div 
            style={{
              fontSize: '1.45rem',
              fontWeight: 950,
              fontFamily: "'Impact', 'Arial Black', -apple-system, sans-serif",
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: textColor,
              lineHeight: 1,
              margin: 0
            }}
          >
            DESCUENTOS
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F0F12',
      padding: '2rem 1rem',
      fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Barra superior de herramientas (se oculta al imprimir) */}
      <div className="no-print" style={{
        width: '100%',
        maxWidth: '820px',
        backgroundColor: '#18181F',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '1.1rem 1.4rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
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

        {/* Controles de estilo del sticker de guerrilla */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Formato 1 vs 2 por hoja */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.06)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={() => setLayoutMode('single')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: layoutMode === 'single' ? '#FFF' : 'transparent',
                color: layoutMode === 'single' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              1 Sticker (12x12)
            </button>
            <button
              onClick={() => setLayoutMode('duo')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: layoutMode === 'duo' ? '#FFF' : 'transparent',
                color: layoutMode === 'duo' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              2 por Hoja (Ahorro)
            </button>
          </div>

          {/* Color del Sticker */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.06)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={() => setStickerColor('white')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: stickerColor === 'white' ? '#FFF' : 'transparent',
                color: stickerColor === 'white' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Fondo Blanco
            </button>
            <button
              onClick={() => setStickerColor('black')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: stickerColor === 'black' ? '#FFF' : 'transparent',
                color: stickerColor === 'black' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Fondo Negro
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
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
            <span>{copied ? 'Copiado' : 'Copiar URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: 'none',
              color: '#000000',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            <Printer size={18} />
            <span>Imprimir ({layoutMode === 'single' ? '1x 12x12 cm' : '2x 12x12 cm'})</span>
          </button>
        </div>
      </div>

      {/* Nota de Campaña de Guerrilla */}
      <div className="no-print" style={{
        maxWidth: '560px',
        textAlign: 'center',
        marginBottom: '1.8rem',
        color: '#94A3B8',
        fontSize: '0.82rem',
        lineHeight: 1.45
      }}>
        <div style={{ color: '#FFF', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Scissors size={15} color="#38BDF8" />
          <span>Sticker Callejero 12 x 12 cm — Campaña de Misterio</span>
        </div>
        Diseñado para paradas de camión y terminales de Campeche. Sin logotipos ni nombres comerciales: solo el código QR y la palabra <strong>DESCUENTOS</strong>. Al escanear, el usuario recibe sus 7 días de cortesía en la app.
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ÁREA IMPRIMIBLE: STICKERS CALIBRADOS A EXACTAMENTE 12 X 12 CM
         ───────────────────────────────────────────────────────────── */}
      <div 
        id="printable-area" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.2cm',
          width: '100%'
        }}
      >
        <MysterySticker idSuffix="1" />
        {layoutMode === 'duo' && <MysterySticker idSuffix="2" />}
      </div>

      {/* Estilos de Impresión y Calibración Métrica */}
      <style>{`
        /* Guías de corte en esquinas */
        .crop-mark {
          position: absolute;
          width: 8mm;
          height: 8mm;
          pointer-events: none;
        }
        .crop-mark.top-left {
          top: 0;
          left: 0;
          border-top: 1px dashed rgba(120, 120, 120, 0.45);
          border-left: 1px dashed rgba(120, 120, 120, 0.45);
        }
        .crop-mark.top-right {
          top: 0;
          right: 0;
          border-top: 1px dashed rgba(120, 120, 120, 0.45);
          border-right: 1px dashed rgba(120, 120, 120, 0.45);
        }
        .crop-mark.bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: 1px dashed rgba(120, 120, 120, 0.45);
          border-left: 1px dashed rgba(120, 120, 120, 0.45);
        }
        .crop-mark.bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: 1px dashed rgba(120, 120, 120, 0.45);
          border-right: 1px dashed rgba(120, 120, 120, 0.45);
        }

        @page {
          size: letter portrait;
          margin: 1cm;
        }

        @media print {
          html, body {
            background-color: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }

          #printable-area {
            gap: 1.5cm !important;
            margin: 0 auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Sticker calibrado estrictamente a 12cm x 12cm */
          .sticker-12x12 {
            width: 12cm !important;
            height: 12cm !important;
            max-width: 12cm !important;
            max-height: 12cm !important;
            box-shadow: none !important;
            border: 1px solid #000000 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CampechePosterStand;
