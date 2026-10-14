import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Copy, Check, ArrowLeft, Scissors, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCampecheCampaignQrUrl } from '../lib/campecheTrialService';

export const CampechePosterStand: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  // Por defecto exactamente 1 hoja (con los 2 stickers de 12x12 cm)
  const [sheetCount, setSheetCount] = useState<number>(1);
  // Finura del QR
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

  // Componente que dibuja exactamente 1 Sticker para grilla 2x2 (4 por hoja carta)
  const MysterySticker = ({ idSuffix = '1' }: { idSuffix?: string }) => {
    return (
      <div 
        id={`mystery-sticker-4up-${idSuffix}`}
        className="sticker-4up"
        style={{
          width: '9.8cm',
          height: '12.2cm',
          maxWidth: '9.8cm',
          maxHeight: '12.2cm',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          boxSizing: 'border-box',
          padding: '0.35cm 0.35cm 0.3cm',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          border: '1px solid #111111',
          userSelect: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
          margin: '0 auto',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}
      >
        {/* Guías de corte en esquinas para recorte manual preciso */}
        <div className="crop-mark top-left" />
        <div className="crop-mark top-right" />
        <div className="crop-mark bottom-left" />
        <div className="crop-mark bottom-right" />

        {/* CÓDIGO QR PURO Y FINO: FONDO BLANCO, QR NEGRO NÍTIDO */}
        <div 
          style={{
            width: '8.8cm',
            height: '8.8cm',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            margin: '0 auto'
          }}
        >
          <QRCodeSVG 
            value={campaignUrl}
            size={330}
            level="Q"
            minVersion={minVersionMap[qrDensity]}
            marginSize={1}
            fgColor="#000000"
            bgColor="#FFFFFF"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              shapeRendering: 'crispEdges'
            }}
          />
        </div>

        {/* ÚNICO TEXTO: LA FRASE '¿YA LA TRAES?' MÁS GRANDE Y EN NEGRITAS EXTRA BOLD */}
        <div 
          style={{
            width: '100%',
            textAlign: 'center',
            paddingTop: '0.1cm'
          }}
        >
          <div 
            style={{
              fontSize: '1.5rem',
              fontWeight: 950,
              fontFamily: "'Outfit', 'Arial Black', Impact, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#000000',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              margin: '0'
            }}
          >
            ¿YA LA TRAES?
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="page-root"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F0F12',
        padding: '1.8rem 1rem 4rem',
        fontFamily: "'Outfit', 'Segoe UI', -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
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

        {/* Controles: Finura del QR y Cantidad de Hojas */}
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

          {/* Cantidad de Hojas a Imprimir (4 stickers por hoja) */}
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
            {[1, 2, 3, 5].map((num) => (
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
                {num} ({num * 4} stickers)
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
              padding: '0.6rem 1.3rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)'
            }}
          >
            <Printer size={17} />
            <span>Imprimir ({sheetCount * 4} Stickers en {sheetCount} hoja{sheetCount > 1 ? 's' : ''})</span>
          </button>
        </div>
      </div>

      {/* Indicador de Campaña y Calibración en pantalla */}
      <div className="no-print" style={{
        maxWidth: '680px',
        textAlign: 'center',
        marginBottom: '1.8rem',
        color: '#94A3B8',
        fontSize: '0.82rem',
        lineHeight: 1.45
      }}>
        <div style={{ color: '#FFF', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Scissors size={15} color="#4ADE80" />
          <span>Fondo Blanco Puro • Exactamente 4 Stickers por Hoja Carta (Grilla 2x2)</span>
        </div>
        Frase <strong>¿YA LA TRAES?</strong> ampliada y en negritas extra bold para lectura instantánea en paradas y postes. Cada hoja carta contiene exactamente 4 stickers listos para recortar (sin hojas vacías ni fondos oscuros).
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ÁREA IMPRIMIBLE: EXACTAMENTE 4 STICKERS POR HOJA CARTA (2x2)
         ───────────────────────────────────────────────────────────── */}
      <div id="printable-area">
        {Array.from({ length: sheetCount }).map((_, sheetIdx) => (
          <div key={sheetIdx} className="print-sheet">
            <MysterySticker idSuffix={`s${sheetIdx}-1`} />
            <MysterySticker idSuffix={`s${sheetIdx}-2`} />
            <MysterySticker idSuffix={`s${sheetIdx}-3`} />
            <MysterySticker idSuffix={`s${sheetIdx}-4`} />
          </div>
        ))}
      </div>

      {/* ── ESTILOS DE IMPRESIÓN ESTRICTOS ── */}
      <style>{`
        /* Guías de corte en esquinas */
        .crop-mark {
          position: absolute;
          width: 5mm;
          height: 5mm;
          pointer-events: none;
        }
        .crop-mark.top-left {
          top: 0;
          left: 0;
          border-top: 1px dashed #666;
          border-left: 1px dashed #666;
        }
        .crop-mark.top-right {
          top: 0;
          right: 0;
          border-top: 1px dashed #666;
          border-right: 1px dashed #666;
        }
        .crop-mark.bottom-left {
          bottom: 0;
          left: 0;
          border-bottom: 1px dashed #666;
          border-left: 1px dashed #666;
        }
        .crop-mark.bottom-right {
          bottom: 0;
          right: 0;
          border-bottom: 1px dashed #666;
          border-right: 1px dashed #666;
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
          display: grid;
          grid-template-columns: repeat(2, 9.8cm);
          grid-template-rows: repeat(2, 12.2cm);
          column-gap: 0.4cm;
          row-gap: 0.5cm;
          padding: 0.8cm;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          box-sizing: content-box;
        }

        @media screen and (max-width: 860px) {
          .print-sheet {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.2rem;
            padding: 0.8rem;
            width: auto;
            height: auto;
          }
        }

        /* ── CONFIGURACIÓN DE IMPRESIÓN DEFINITIVA (HOJA CARTA) ── */
        @page {
          size: letter portrait;
          margin: 6mm auto;
        }

        @media print {
          /* 1. Forzar blanco absoluto en HTML y BODY sin márgenes parásitos */
          html, body {
            background: #FFFFFF !important;
            background-color: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 2. Anular el fondo oscuro del contenedor raíz de pantalla */
          .page-root {
            background: #FFFFFF !important;
            background-color: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            height: auto !important;
            display: block !important;
          }

          /* 3. Ocultar absolutamente todo lo que no sea el área de impresión */
          .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #printable-area {
            display: block !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #FFFFFF !important;
          }

          /* 4. Cada hoja carta contiene exactamente 4 stickers en grilla 2x2 */
          .print-sheet {
            width: 20cm !important;
            max-width: 20cm !important;
            height: 25.2cm !important;
            max-height: 25.6cm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            display: grid !important;
            grid-template-columns: 9.8cm 9.8cm !important;
            grid-template-rows: 12.2cm 12.2cm !important;
            column-gap: 0.4cm !important;
            row-gap: 0.5cm !important;
            justify-content: center !important;
            align-content: center !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* La última hoja NO debe romper página para evitar la hoja en blanco final */
          .print-sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* 5. Cada sticker mide estrictamente 9.8 x 12.2 cm */
          .sticker-4up {
            width: 9.8cm !important;
            height: 12.2cm !important;
            max-width: 9.8cm !important;
            max-height: 12.2cm !important;
            background: #FFFFFF !important;
            background-color: #FFFFFF !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: 1px solid #000000 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }

          .crop-mark.top-left,
          .crop-mark.top-right,
          .crop-mark.bottom-left,
          .crop-mark.bottom-right {
            border-color: #888888 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CampechePosterStand;
