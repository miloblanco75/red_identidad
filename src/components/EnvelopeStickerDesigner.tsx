import React, { useState } from 'react';
import { Printer, ArrowLeft, ZoomIn, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface EnvelopeStickerDesignerProps {
  onBack?: () => void;
}

export const EnvelopeStickerDesigner: React.FC<EnvelopeStickerDesignerProps> = ({ onBack }) => {
  // Settings
  const [useExactImage, setUseExactImage] = useState<boolean>(true);
  const [headerText, setHeaderText] = useState<string>('RED IDENTIDAD');
  const [bottomLeftText, setBottomLeftText] = useState<string>('ESCANEA Y CONÓCENOS');
  const [priceNumber, setPriceNumber] = useState<string>('90');
  const [priceSubtext, setPriceSubtext] = useState<string>('PESOS');
  const [qrUrl, setQrUrl] = useState<string>('https://facebook.com/redidentidad');
  const [stickerSizeCm, setStickerSizeCm] = useState<number>(7); // Max 7x7 cm
  const [stickersPerPage, setStickersPerPage] = useState<number>(6); // 6 (2x3) fits A4 nicely
  const [showCutMarks, setShowCutMarks] = useState<boolean>(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D12', color: '#FFF', paddingBottom: '4rem' }}>
      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #envelope-sticker-print-area {
            display: grid !important;
            grid-template-columns: repeat(2, ${stickerSizeCm}cm) !important;
            gap: 0.8cm !important;
            padding: 1cm !important;
            justify-content: center !important;
            align-content: start !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .sticker-item-print {
            width: ${stickerSizeCm}cm !important;
            height: ${stickerSizeCm}cm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: ${showCutMarks ? '1px dashed #CCC' : 'none'} !important;
            box-sizing: border-box !important;
          }
          @page {
            size: A4 portrait;
            margin: 0.5cm;
          }
        }
      `}</style>

      {/* Header bar */}
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
              Calcomanías para Sobres (7×7 cm)
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Diseñador e impresor oficial para sobres (20cm × 15cm)
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
          <Printer size={18} /> Imprimir Hoja ({stickersPerPage} uds)
        </button>
      </header>

      <div className="no-print" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* Main Panel: Visual Preview & Print Sheet */}
        <div>
          {/* Information banner */}
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

          {/* Individual Preview Card */}
          <div style={{ backgroundColor: '#16161E', borderRadius: '20px', padding: '1.8rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ZoomIn size={18} /> Vista Previa Individual de la Calcomanía ({stickerSizeCm}×{stickerSizeCm} cm)
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)', borderRadius: '16px' }}>
              
              {/* STICKER CONTAINER (7x7 CM RATIO) */}
              <div
                style={{
                  width: '280px',
                  height: '280px',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {useExactImage ? (
                  <img
                    src="/qr_calcomania_sobre.jpg"
                    alt="Calcomanía Oficial Red Identidad"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                  />
                ) : (
                  <>
                    {/* Header Text */}
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      letterSpacing: '0.04em',
                      textAlign: 'center',
                      color: '#000000',
                      marginTop: '4px'
                    }}>
                      {headerText}
                    </div>

                    {/* QR Code */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                      <QRCodeSVG
                        value={qrUrl}
                        size={150}
                        level="H"
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>

                    {/* Bottom Row */}
                    <div style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      padding: '0 4px 2px 4px'
                    }}>
                      {/* Left: Escanea y Conócenos */}
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '800',
                        lineHeight: '1.15',
                        letterSpacing: '-0.01em',
                        color: '#000000',
                        textAlign: 'left'
                      }}>
                        {bottomLeftText.split(' ').length > 2 ? (
                          <>
                            <div>{bottomLeftText.split(' ').slice(0, 2).join(' ')}</div>
                            <div>{bottomLeftText.split(' ').slice(2).join(' ')}</div>
                          </>
                        ) : (
                          <div>{bottomLeftText}</div>
                        )}
                      </div>

                      {/* Right: Price Badge */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '28px', fontWeight: '900', lineHeight: '0.9', color: '#000000' }}>
                          {priceNumber}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', color: '#000000', marginTop: '2px' }}>
                          {priceSubtext}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sheet Layout Preview */}
          <div style={{ backgroundColor: '#16161E', borderRadius: '20px', padding: '1.8rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#FFF' }}>
                Vista Previa de la Hoja de Impresión ({stickersPerPage} unidades)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                Formato A4 • {stickerSizeCm}×{stickerSizeCm} cm
              </span>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              maxHeight: '480px',
              overflowY: 'auto'
            }}>
              {Array.from({ length: stickersPerPage }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    aspectRatio: '1/1',
                    backgroundColor: '#FFFFFF',
                    border: showCutMarks ? '1px dashed #B0B0B0' : '1px solid #EEE',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  {useExactImage ? (
                    <img src="/qr_calcomania_sobre.jpg" alt="Calcomanía" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <>
                      <div style={{ fontSize: '9px', fontWeight: '800', color: '#000' }}>{headerText}</div>
                      <QRCodeSVG value={qrUrl} size={65} level="M" />
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '6.5px', fontWeight: '800', color: '#000' }}>
                        <div>ESCANEA Y<br />CONÓCENOS</div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', fontWeight: '900' }}>{priceNumber}</span><br />
                          <span>{priceSubtext}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div style={{ backgroundColor: '#16161E', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', color: '#D4AF37' }}>
            Opciones de Impresión
          </h3>

          {/* Mode Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Modelo de Calcomanía
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => setUseExactImage(true)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '10px',
                  border: useExactImage ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: useExactImage ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                  color: useExactImage ? '#D4AF37' : '#FFF',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Oficial HD (QR Actual)
              </button>

              <button
                onClick={() => setUseExactImage(false)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '10px',
                  border: !useExactImage ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: !useExactImage ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                  color: !useExactImage ? '#D4AF37' : '#FFF',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Personalizable
              </button>
            </div>
          </div>

          {/* Size & Grid settings */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontWeight: 700 }}>
              Tamaño de la Calcomanía
            </label>
            <select
              value={stickerSizeCm}
              onChange={(e) => setStickerSizeCm(Number(e.target.value))}
              style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value={7} style={{ color: '#000' }}>7 x 7 cm (Recomendado para Sobre 20x15 cm)</option>
              <option value={6} style={{ color: '#000' }}>6 x 6 cm (Compacto)</option>
              <option value={5} style={{ color: '#000' }}>5 x 5 cm (Pequeño)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem', fontWeight: 700 }}>
              Cantidad de Calcomanías por Hoja
            </label>
            <select
              value={stickersPerPage}
              onChange={(e) => setStickersPerPage(Number(e.target.value))}
              style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value={6} style={{ color: '#000' }}>6 unidades por hoja A4 (2×3)</option>
              <option value={8} style={{ color: '#000' }}>8 unidades por hoja A4 (2×4)</option>
              <option value={4} style={{ color: '#000' }}>4 unidades por hoja (2×2)</option>
              <option value={2} style={{ color: '#000' }}>2 unidades por hoja (1×2)</option>
            </select>
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
              Mostrar líneas punteadas para recortar
            </label>
          </div>

          {/* Customizable text fields if custom mode enabled */}
          {!useExactImage && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                Personalizar Textos
              </h4>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Título Superior</label>
                <input
                  type="text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Texto Inferior Izquierdo</label>
                <input
                  type="text"
                  value={bottomLeftText}
                  onChange={(e) => setBottomLeftText(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Monto</label>
                  <input
                    type="text"
                    value={priceNumber}
                    onChange={(e) => setPriceNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>Moneda / Subtexto</label>
                  <input
                    type="text"
                    value={priceSubtext}
                    onChange={(e) => setPriceSubtext(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem' }}>URL de Destino QR</label>
                <input
                  type="url"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <button
            onClick={handlePrint}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#D4AF37',
              color: '#000',
              fontWeight: 800,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
            }}
          >
            <Printer size={20} /> Mandar a Imprimir Hoja
          </button>
        </div>
      </div>

      {/* PRINT-ONLY CONTAINER FOR PRINTING ON PAPER */}
      <div id="envelope-sticker-print-area" className="only-print-target" style={{ display: 'none' }}>
        {Array.from({ length: stickersPerPage }).map((_, index) => (
          <div
            key={index}
            className="sticker-item-print"
            style={{
              width: `${stickerSizeCm}cm`,
              height: `${stickerSizeCm}cm`,
              backgroundColor: '#FFFFFF',
              color: '#000000',
              padding: '0.3cm',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {useExactImage ? (
              <img
                src="/qr_calcomania_sobre.jpg"
                alt="Calcomanía Red Identidad"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <>
                <div style={{ fontSize: '13pt', fontWeight: '800', letterSpacing: '0.03em', textAlign: 'center' }}>
                  {headerText}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
                  <QRCodeSVG value={qrUrl} size={150} level="H" />
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '9pt', fontWeight: '800', lineHeight: '1.1' }}>
                    {bottomLeftText.split(' ').length > 2 ? (
                      <>
                        <div>{bottomLeftText.split(' ').slice(0, 2).join(' ')}</div>
                        <div>{bottomLeftText.split(' ').slice(2).join(' ')}</div>
                      </>
                    ) : (
                      <div>{bottomLeftText}</div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18pt', fontWeight: '900', lineHeight: '0.9' }}>
                      {priceNumber}
                    </div>
                    <div style={{ fontSize: '7pt', fontWeight: '800', marginTop: '1px' }}>
                      {priceSubtext}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvelopeStickerDesigner;
