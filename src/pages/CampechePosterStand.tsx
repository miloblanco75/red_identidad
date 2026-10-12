import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Copy, Check, ArrowLeft, Scissors, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCampecheCampaignQrUrl } from '../lib/campecheTrialService';

export const CampechePosterStand: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [stickerColor, setStickerColor] = useState<'white' | 'black'>('white');
  // Por defecto 2 por hoja como solicitó el usuario
  const [sheetCount, setSheetCount] = useState<number>(1); // 1 hoja = 2 stickers
  // Control de densidad / finura del QR
  const [qrDensity, setQrDensity] = useState<'ultra' | 'fino' | 'clasico'>('fino');

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

  // Nivel de versión mínima para afinar los módulos del QR
  const minVersionMap = {
    ultra: 8,   // Micro-módulos súper finos de alta densidad
    fino: 6,    // Fino, moderno y perfectamente legible a distancia (Recomendado)
    clasico: 1  // Versión estándar con módulos más grandes
  };

  // Componente que dibuja exactamente 1 Sticker de 12 x 12 cm de puro misterio
  const MysterySticker = ({ idSuffix = '1' }: { idSuffix?: string }) => {
    const isDark = stickerColor === 'black';
    const bgColor = isDark ? '#000000' : '#FFFFFF';
    const textColor = isDark ? '#FFFFFF' : '#000000';
    const borderColor = isDark ? '#333333' : '#D1D5DB';

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
          padding: '0.55cm 0.6cm 0.45cm',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          borderRadius: '2px',
          border: `1px solid ${borderColor}`,
          userSelect: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          margin: '0 auto',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}
      >
        {/* Guías de corte en esquinas para recorte manual preciso a 12x12 cm */}
        <div className="crop-mark top-left" />
        <div className="crop-mark top-right" />
        <div className="crop-mark bottom-left" />
        <div className="crop-mark bottom-right" />

        {/* CÓDIGO QR PURO Y FINO (SIN LOGO, MATRIZ DE ALTA DEFINICIÓN) */}
        <div 
          style={{
            width: '9.4cm',
            height: '9.4cm',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            margin: '0 auto'
          }}
        >
          <QRCodeSVG 
            value={campaignUrl}
            size={355}
            level="Q"
            minVersion={minVersionMap[qrDensity]}
            marginSize={1}
            fgColor={textColor}
            bgColor={bgColor}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              shapeRendering: 'crispEdges'
            }}
          />
        </div>

        {/* ÚNICO TEXTO: LA PALABRA 'DESCUENTOS' (TIPOGRAFÍA FINA, ELEGANTE Y DE ALTO IMPACTO) */}
        <div 
          style={{
            width: '100%',
            textAlign: 'center',
            paddingTop: '0.15cm'
          }}
        >
          <div 
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: textColor,
              lineHeight: 1,
              margin: '0 0 0 0.36em' // Compensar el letterSpacing al final para centrado milimétrico
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
      padding: '1.8rem 1rem 4rem',
      fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Barra superior de herramientas (se oculta al imprimir) */}
      <div className="no-print" style={{
        width: '100%',
        maxWidth: '860px',
        backgroundColor: '#18181F',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '1rem 1.4rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.9rem',
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
          <span>Volver</span>
        </button>

        {/* Controles: Finura del QR, Color y Cantidad de Hojas */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Selector de Finura del QR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            padding: '3px 8px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Sliders size={14} color="#38BDF8" />
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, marginRight: '3px' }}>QR:</span>
            <button
              onClick={() => setQrDensity('fino')}
              style={{
                padding: '5px 10px',
                borderRadius: '7px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: qrDensity === 'fino' ? '#38BDF8' : 'transparent',
                color: qrDensity === 'fino' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Fino
            </button>
            <button
              onClick={() => setQrDensity('ultra')}
              style={{
                padding: '5px 10px',
                borderRadius: '7px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: qrDensity === 'ultra' ? '#38BDF8' : 'transparent',
                color: qrDensity === 'ultra' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Ultra Fino
            </button>
            <button
              onClick={() => setQrDensity('clasico')}
              style={{
                padding: '5px 8px',
                borderRadius: '7px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: qrDensity === 'clasico' ? '#38BDF8' : 'transparent',
                color: qrDensity === 'clasico' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Clásico
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
                padding: '5px 11px',
                borderRadius: '7px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: stickerColor === 'white' ? '#FFF' : 'transparent',
                color: stickerColor === 'white' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Blanco
            </button>
            <button
              onClick={() => setStickerColor('black')}
              style={{
                padding: '5px 11px',
                borderRadius: '7px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: stickerColor === 'black' ? '#FFF' : 'transparent',
                color: stickerColor === 'black' ? '#000' : '#AAA',
                transition: 'all 0.2s'
              }}
            >
              Negro
            </button>
          </div>

          {/* Cantidad de Hojas a Imprimir (2 stickers por hoja) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            padding: '3px 8px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Hojas:</span>
            {[1, 2, 5].map((num) => (
              <button
                key={num}
                onClick={() => setSheetCount(num)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: sheetCount === num ? '#4ADE80' : 'transparent',
                  color: sheetCount === num ? '#000' : '#AAA',
                  transition: 'all 0.2s'
                }}
              >
                {num} ({num * 2} u.)
              </button>
            ))}
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
              padding: '0.6rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={15} color="#4ADE80" /> : <Copy size={15} />}
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
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            <Printer size={17} />
            <span>Imprimir ({sheetCount * 2} Stickers — 2 por hoja)</span>
          </button>
        </div>
      </div>

      {/* Indicador de Campaña y Calibración */}
      <div className="no-print" style={{
        maxWidth: '580px',
        textAlign: 'center',
        marginBottom: '1.8rem',
        color: '#94A3B8',
        fontSize: '0.82rem',
        lineHeight: 1.45
      }}>
        <div style={{ color: '#FFF', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Scissors size={15} color="#4ADE80" />
          <span>Calibrado a 2 Stickers de 12 x 12 cm por Hoja Carta</span>
        </div>
        Código QR con matriz fina de alta definición sin logotipos + palabra <strong>DESCUENTOS</strong>. Cada hoja impresa contiene exactamente 2 stickers listos para corte.
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ÁREA IMPRIMIBLE: HOJAS CARTA CON EXACTAMENTE 2 STICKERS CADA UNA
         ───────────────────────────────────────────────────────────── */}
      <div id="printable-area">
        {Array.from({ length: sheetCount }).map((_, sheetIdx) => (
          <div key={sheetIdx} className="print-sheet">
            <MysterySticker idSuffix={`s${sheetIdx}-1`} />
            <div className="sheet-cut-divider no-print" />
            <MysterySticker idSuffix={`s${sheetIdx}-2`} />
          </div>
        ))}
      </div>

      {/* Estilos de Impresión y Calibración Estricta a Hoja Carta */}
      <style>{`
        /* Guías de corte en esquinas */
        .crop-mark {
          position: absolute;
          width: 7mm;
          height: 7mm;
          pointer-events: none;
        }
        .crop-mark.top-left {
          top: 0;
          left: 0;
          border-top: 1px dashed rgba(100, 100, 100, 0.45);
          border-left: 1px dashed rgba(100, 100, 100, 0.45);
        }
        .crop-mark.top-right {
          top: 0;
          right: 0;
          border-top: 1px dashed rgba(100, 100, 100, 0.45);
          border-right: 1px dashed rgba(100, 100, 100, 0.45);
        }
        .crop-mark.bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: 1px dashed rgba(100, 100, 100, 0.45);
          border-left: 1px dashed rgba(100, 100, 100, 0.45);
        }
        .crop-mark.bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: 1px dashed rgba(100, 100, 100, 0.45);
          border-right: 1px dashed rgba(100, 100, 100, 0.45);
        }

        /* En pantalla */
        #printable-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }

        .print-sheet {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6cm;
          padding: 1.2rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .sheet-cut-divider {
          width: 12cm;
          border-top: 1px dashed rgba(255, 255, 255, 0.2);
          margin: 0.2cm 0;
        }

        /* ── CONFIGURACIÓN DE IMPRESIÓN OFICIAL TAMAÑO CARTA ── */
        @page {
          size: letter portrait;
          margin: 4mm auto;
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

          #printable-area {
            gap: 0 !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
            display: block !important;
          }

          /* Cada hoja carta contiene exactamente 2 stickers (12cm + 12cm = 24cm de alto en hoja de 27.94cm) */
          .print-sheet {
            width: 100% !important;
            height: 26.5cm !important;
            max-height: 27cm !important;
            margin: 0 auto !important;
            padding: 0.3cm 0 !important;
            background: transparent !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Cada sticker mide estrictamente 12 x 12 cm */
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

          .crop-mark.top-left,
          .crop-mark.top-right,
          .crop-mark.bottom-left,
          .crop-mark.bottom-right {
            border-color: #777777 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CampechePosterStand;
