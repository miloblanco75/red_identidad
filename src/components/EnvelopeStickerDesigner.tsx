import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft, ZoomIn, ShieldCheck, RefreshCw } from 'lucide-react';
import StickerQRCode from './StickerQRCode';

interface EnvelopeStickerDesignerProps {
  onBack?: () => void;
}

export const EnvelopeStickerDesigner: React.FC<EnvelopeStickerDesignerProps> = ({ onBack }) => {
  // Settings
  const [selectedStickerType, setSelectedStickerType] = useState<'campechana_rosa' | 'campechana_negra' | 'campechana_blanca' | 'sobre'>('campechana_rosa');
  const [useExactImage] = useState<boolean>(false);
  const [headerText, setHeaderText] = useState<string>('RED IDENTIDAD');
  const [bottomLeftText, setBottomLeftText] = useState<string>('ESCANEA Y CONÓCENOS');
  const [priceNumber] = useState<string>('90');
  const [priceSubtext] = useState<string>('PESOS');
  const [qrUrl, setQrUrl] = useState<string>('https://redidentidad.vercel.app/registro?c=PASE-DEMO-001');

  // Quantity & Code Source settings
  const [totalQuantity, setTotalQuantity] = useState<number>(95);
  const [codeMode, setCodeMode] = useState<'auto' | 'db' | 'static'>('auto');
  const [envelopeStickers, setEnvelopeStickers] = useState<Array<{ code: string; url: string }>>([]);
  const [isLoadingStickers, setIsLoadingStickers] = useState<boolean>(false);

  // Layout presets & sizing (Formato Estándar 3.5x3.5 cm — 6 por fila x 7 filas = 42 calcomanías por hoja Carta ocupando el 100%)
  const [layoutPreset, setLayoutPreset] = useState<string>('letter_6x7');
  const [columnsPerRow, setColumnsPerRow] = useState<number>(6);
  const [stickerSizeCm, setStickerSizeCm] = useState<number>(3.5);
  const [stickersPerPage, setStickersPerPage] = useState<number>(42);
  const [showCutMarks, setShowCutMarks] = useState<boolean>(true);

  const handleLayoutChange = (preset: string) => {
    setLayoutPreset(preset);
    if (preset === 'letter_6x7') {
      setColumnsPerRow(6);
      setStickerSizeCm(3.5);
      setStickersPerPage(42);
    } else if (preset === 'letter_6x8') {
      setColumnsPerRow(6);
      setStickerSizeCm(3.3);
      setStickersPerPage(48);
    } else if (preset === 'letter_5x5') {
      setColumnsPerRow(4);
      setStickerSizeCm(5.0);
      setStickersPerPage(20);
    }
  };

  const generateSequentialCodes = (qty: number) => {
    const prefix = selectedStickerType === 'campechana_rosa' ? 'ROSA' : selectedStickerType === 'campechana_negra' ? 'NEGR' : selectedStickerType === 'campechana_blanca' ? 'BLAN' : 'SOBRE';
    const list = Array.from({ length: qty }).map((_, i) => {
      const code = `${prefix}-${String(i + 1).padStart(4, '0')}`;
      return {
        code: code,
        url: `https://redidentidad.vercel.app/registro?c=${code}`
      };
    });
    setEnvelopeStickers(list);
  };

  const fetchEnvelopeStickers = async () => {
    setIsLoadingStickers(true);
    try {
      const prefix = selectedStickerType === 'campechana_rosa' ? 'ROSA' : selectedStickerType === 'campechana_negra' ? 'NEGR' : selectedStickerType === 'campechana_blanca' ? 'BLAN' : 'SOBRE';
      const mapped = Array.from({ length: totalQuantity }).map((_, i) => {
        const code = `${prefix}-${String(i + 1).padStart(4, '0')}`;
        return {
          code: code,
          url: codeMode === 'static' ? qrUrl : `https://redidentidad.vercel.app/registro?c=${code}`
        };
      });
      setEnvelopeStickers(mapped);
    } catch (e) {
      generateSequentialCodes(totalQuantity);
    } finally {
      setIsLoadingStickers(false);
    }
  };

  useEffect(() => {
    fetchEnvelopeStickers();
  }, [totalQuantity, codeMode, qrUrl, selectedStickerType]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D12', color: '#FFF', paddingBottom: '4rem' }}>
      {/* Estilos para impresión en Hoja Carta (Letter) 5x5 cm ocupando el 100% de la hoja */}
      <style>{`
        @media print {
          html, body {
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
          }

          /* Ocultar elementos de navegación y UI interactiva */
          header, nav, footer, button, input, select, form, p, h1, h2, h3, .no-print, .glass, .admin-header, .admin-tabs {
            display: none !important;
          }

          /* Mantener visibles los contenedores de origen */
          body, #root, #root > div, main, .animate-fade-in {
            visibility: visible !important;
            background: #FFFFFF !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
          }

          #envelope-sticker-print-area {
            display: grid !important;
            grid-template-columns: repeat(${columnsPerRow}, 1fr) !important;
            gap: 0.1cm !important;
            padding: 0.2cm 0.15cm !important;
            justify-content: stretch !important;
            align-content: start !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            min-width: 100% !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            visibility: visible !important;
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 9999999 !important;
          }

          #envelope-sticker-print-area * {
            visibility: visible !important;
          }

          .sticker-item-print {
            width: 100% !important;
            height: ${stickerSizeCm}cm !important;
            min-height: ${stickerSizeCm}cm !important;
            max-height: ${stickerSizeCm}cm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: ${showCutMarks ? '1px dashed #777777' : 'none'} !important;
            box-sizing: border-box !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 1.5mm !important;
          }

          @page {
            size: letter portrait;
            margin: 0.3cm 0.2cm;
          }
        }
      `}</style>

      <header className="no-print" style={{
        padding: '1.2rem 1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#FFF',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #FFF 0%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Calcomanías para Sobres ({stickerSizeCm}×{stickerSizeCm} cm)
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              {columnsPerRow} por fila — {stickersPerPage} calcomanías por hoja Carta ({columnsPerRow} cols × {Math.ceil(stickersPerPage / columnsPerRow)} filas)
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1.4rem',
            backgroundColor: '#D4AF37',
            color: '#000',
            fontWeight: 800,
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
            fontSize: '0.95rem'
          }}
        >
          <Printer size={18} /> Imprimir {envelopeStickers.length || totalQuantity} Calcomanías
        </button>
      </header>

      <div className="no-print" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        <div>
          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '1rem 1.2rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <ShieldCheck size={28} color="#D4AF37" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.4' }}>
              <strong>Formato Exacto de la Marca:</strong> Diseñado específicamente para caber centrado en el exterior de los sobres de 20cm × 15cm sin obstruir el cierre.
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '2px solid #D4AF37',
            borderRadius: '16px',
            padding: '1.2rem',
            marginBottom: '1.5rem'
          }}>
            <label style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.6rem', fontWeight: 900, letterSpacing: '0.05em' }}>
              🌟 ELIGE EL MODELO DE CALCOMANÍA A IMPRIMIR:
            </label>
            <select
              value={selectedStickerType}
              onChange={(e) => setSelectedStickerType(e.target.value as any)}
              style={{ width: '100%', padding: '0.9rem 1rem', backgroundColor: '#141416', border: '1.5px solid #D4AF37', borderRadius: '12px', color: '#FFF', fontSize: '1.05rem', fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              <option value="campechana_rosa" style={{ color: '#000' }}>🌸 Campechana — Rosa (Oficial QR)</option>
              <option value="campechana_negra" style={{ color: '#000' }}>🖤 Campechana — Negra (Oficial QR)</option>
              <option value="campechana_blanca" style={{ color: '#000' }}>🤍 Campechana — Blanca (Oficial QR)</option>
              <option value="sobre" style={{ color: '#000' }}>✉️ Sobre Estándar Red Identidad</option>
            </select>
          </div>

          <div style={{ backgroundColor: '#16161E', borderRadius: '20px', padding: '1.8rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ZoomIn size={18} /> Vista Previa Individual de la Calcomanía ({stickerSizeCm}×{stickerSizeCm} cm)
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)', borderRadius: '16px' }}>
              
              <div
                style={{
                  width: '240px',
                  height: '240px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  position: 'relative',
                  overflow: 'hidden',
                  border: selectedStickerType === 'campechana_rosa' ? '3px solid #FD80BF' : selectedStickerType === 'campechana_blanca' ? '3px solid #D4AF37' : '3px solid #333'
                }}
              >
                <div style={{
                  width: '100%',
                  backgroundColor: selectedStickerType === 'campechana_rosa' ? '#FD80BF' : selectedStickerType === 'campechana_blanca' ? '#F4F4F6' : '#121212',
                  color: selectedStickerType === 'campechana_blanca' ? '#121212' : '#FFFFFF',
                  border: selectedStickerType === 'campechana_blanca' ? '1.5px solid #D4AF37' : 'none',
                  fontSize: '13px',
                  fontWeight: '900',
                  letterSpacing: '0.04em',
                  textAlign: 'center',
                  padding: '4px 0',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  {selectedStickerType === 'campechana_rosa' ? '🌸 CAMPECHANA ROSA' : selectedStickerType === 'campechana_negra' ? '🖤 CAMPECHANA NEGRA' : selectedStickerType === 'campechana_blanca' ? '🤍 CAMPECHANA BLANCA' : headerText}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                  <StickerQRCode
                    value={qrUrl}
                    level={selectedStickerType}
                    size={130}
                  />
                </div>

                <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  padding: '0 4px'
                }}>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', lineHeight: '0.9', color: '#000000' }}>
                      {priceNumber}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.05em', color: '#000000', marginTop: '2px' }}>
                      {priceSubtext}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#16161E', borderRadius: '20px', padding: '1.8rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#FFF' }}>
                Vista Previa de la Hoja de Impresión ({stickersPerPage} unidades)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                Hoja Carta • {stickerSizeCm}×{stickerSizeCm} cm
              </span>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
              gap: '0.4rem',
              maxHeight: '560px',
              overflowY: 'auto'
            }}>
              {(envelopeStickers.length > 0 ? envelopeStickers.slice(0, stickersPerPage) : Array.from({ length: stickersPerPage }).map((_, i) => ({ code: `SOBRE-${String(i + 1).padStart(4, '0')}`, url: qrUrl }))).map((stickerItem, index) => (
                <div
                  key={index}
                  style={{
                    aspectRatio: '1/1',
                    backgroundColor: '#FFFFFF',
                    border: showCutMarks ? '1px dashed #B0B0B0' : '1px solid #EEE',
                    borderRadius: '6px',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ fontSize: '6.5px', fontWeight: '900', color: selectedStickerType === 'campechana_rosa' ? '#FF5C9D' : '#000', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedStickerType === 'campechana_rosa' ? '🌸 ROSA' : selectedStickerType === 'campechana_negra' ? '🖤 NEGRA' : selectedStickerType === 'campechana_blanca' ? '🤍 BLANCA' : headerText}
                  </div>
                  <StickerQRCode value={stickerItem.url || qrUrl} level={selectedStickerType} size={42} />
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', fontSize: '4.5px', fontWeight: '800', color: '#000' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '8px', fontWeight: '900' }}>{priceNumber}</span><br />
                      <span>{priceSubtext}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#16161E', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', color: '#D4AF37' }}>
            Opciones de Impresión
          </h3>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              Cantidad Total a Imprimir
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.8rem' }}>
              <input
                type="number"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                min={1}
                max={500}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  color: '#FFF',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              <button
                onClick={fetchEnvelopeStickers}
                disabled={isLoadingStickers}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#FFF',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem'
                }}
              >
                <RefreshCw size={14} className={isLoadingStickers ? 'animate-spin' : ''} />
                Actualizar
              </button>
            </div>

            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.4rem', fontWeight: 700 }}>
              Modelo / Estilo de Calcomanía
            </label>
            <select
              value={selectedStickerType}
              onChange={(e) => setSelectedStickerType(e.target.value as any)}
              style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem', outline: 'none', marginBottom: '0.8rem' }}
            >
              <option value="campechana_blanca" style={{ color: '#000' }}>🤍 Campechana — Blanca (Oficial QR)</option>
              <option value="campechana_rosa" style={{ color: '#000' }}>🌸 Campechana — Rosa (Oficial QR)</option>
              <option value="campechana_negra" style={{ color: '#000' }}>🖤 Campechana — Negra (Oficial QR)</option>
              <option value="sobre" style={{ color: '#000' }}>✉️ Sobre Estándar Red Identidad</option>
            </select>

            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontWeight: 700 }}>
              Origen de los Códigos
            </label>
            <select
              value={codeMode}
              onChange={(e) => setCodeMode(e.target.value as any)}
              style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.82rem', outline: 'none' }}
            >
              <option value="auto" style={{ color: '#000' }}>⚡ Secuencia Demo Registro (Recomendado)</option>
              <option value="static" style={{ color: '#000' }}>🌐 Enlace Fijo Personalizado</option>
              <option value="db" style={{ color: '#000' }}>Cargar de Base de Datos</option>
            </select>

            {codeMode === 'static' && (
              <div style={{ marginTop: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.3rem', fontWeight: 700 }}>
                  Enlace QR Personalizado
                </label>
                <input
                  type="url"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://redidentidad.vercel.app/registro?c=PASE-DEMO-001"
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', color: '#FFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontWeight: 700 }}>
              Aprovechamiento de Papel (Hoja Carta)
            </label>
            <select
              value={layoutPreset}
              onChange={(e) => handleLayoutChange(e.target.value)}
              style={{ width: '100%', padding: '0.85rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '10px', color: '#D4AF37', fontWeight: 800, fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="letter_6x7" style={{ color: '#000' }}>🌟 3.5×3.5 cm IDEAL (6 por fila × 7 filas — 42 por hoja) — MÁXIMA CLARIDAD</option>
              <option value="letter_6x8" style={{ color: '#000' }}>⚡ 3.3×3.3 cm Compacto (6 por fila × 8 filas — 48 por hoja)</option>
              <option value="letter_5x5" style={{ color: '#000' }}>📦 5×5 cm Grande (4 por fila × 5 filas — 20 por hoja)</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.5rem', lineHeight: 1.4, margin: '0.4rem 0 0 0' }}>
              💡 Configurado exactamente a <strong>6 por fila (42 calcomanías de 3.5×3.5 cm por hoja Carta)</strong> ocupando el 100% de la hoja de borde a borde.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="checkbox"
              id="cutMarks"
              checked={showCutMarks}
              onChange={(e) => setShowCutMarks(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#D4AF37', cursor: 'pointer' }}
            />
            <label htmlFor="cutMarks" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
              Mostrar líneas de corte
            </label>
          </div>

          {!useExactImage && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                Personalizar Textos
              </h4>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Título</label>
                <input
                  type="text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Texto Inferior</label>
                <input
                  type="text"
                  value={bottomLeftText}
                  onChange={(e) => setBottomLeftText(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handlePrint}
            style={{
              width: '100%',
              padding: '1.1rem',
              backgroundColor: '#D4AF37',
              color: '#000',
              fontWeight: 800,
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 20px rgba(212,175,55,0.4)'
            }}
          >
            <Printer size={20} /> Imprimir Hoja
          </button>
        </div>
      </div>

      <div id="envelope-sticker-print-area" className="only-print-target" style={{ display: 'none' }}>
        {envelopeStickers.map((stickerItem, index) => (
          <div
            key={index}
            className="sticker-item-print"
            style={{
              width: '100%',
              height: `${stickerSizeCm}cm`,
              backgroundColor: '#FFFFFF',
              color: '#000000',
              padding: '1.5mm',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <div style={{ fontSize: `${stickerSizeCm <= 3.2 ? 6.5 : 9}pt`, fontWeight: '900', letterSpacing: '0.01em', textAlign: 'center', lineHeight: '1', color: selectedStickerType === 'campechana_rosa' ? '#FF5C9D' : '#000000' }}>
              {selectedStickerType === 'campechana_rosa' ? '🌸 CAMPECHANA ROSA' : selectedStickerType === 'campechana_negra' ? '🖤 CAMPECHANA NEGRA' : selectedStickerType === 'campechana_blanca' ? '🤍 CAMPECHANA BLANCA' : headerText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
              <StickerQRCode value={stickerItem.url || qrUrl} level={selectedStickerType} size={stickerSizeCm <= 3.2 ? 65 : 100} />
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: `${stickerSizeCm <= 3.2 ? 9 : 13}pt`, fontWeight: '900', lineHeight: '0.9' }}>
                  {priceNumber}
                </div>
                <div style={{ fontSize: `${stickerSizeCm <= 3.2 ? 4 : 5.5}pt`, fontWeight: '800', marginTop: '1px' }}>
                  {priceSubtext}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvelopeStickerDesigner;
