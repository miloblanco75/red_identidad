import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface StickerQRCodeProps {
  value?: string;
  level?: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const StickerQRCode: React.FC<StickerQRCodeProps> = ({
  value = '',
  level = '',
  size = 100,
  style,
  className,
}) => {
  const normLevel = (level || '').toLowerCase().replace(/-/g, '_');
  const normValue = (value || '').toLowerCase();

  const isRosa = 
    normLevel.includes('rosa') || 
    normLevel.includes('rosada') || 
    normLevel.includes('pink') || 
    normValue.includes('rosa');

  const isJuarez =
    normLevel.includes('juarez') ||
    normLevel.includes('juarense') ||
    normValue.includes('city=juarez') ||
    normValue.includes('juarez') ||
    normValue.startsWith('vj') ||
    normValue.includes('c=vj');

  // Garantizar que la URL sea directa a la plataforma de registro
  let targetUrl = '';
  if (value.startsWith('http')) {
    targetUrl = value;
    if (isJuarez && !targetUrl.includes('city=juarez')) {
      targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'city=juarez';
    }
  } else {
    const defaultCode = isJuarez ? 'VJ0001' : 'TUL0035';
    const codeParam = encodeURIComponent(value || defaultCode);
    const cityParam = isJuarez ? '&city=juarez' : '';
    targetUrl = `https://redidentidad.vercel.app/registro?c=${codeParam}${cityParam}`;
  }

  const qrFgColor = isRosa ? '#FF5C9D' : '#000000';

  return (
    <QRCodeSVG
      value={targetUrl}
      size={size}
      level={isJuarez ? "H" : "M"}
      bgColor="#FFFFFF"
      fgColor={qrFgColor}
      imageSettings={isJuarez ? {
        src: '/juarez_conecta.png',
        height: Math.max(16, Math.round(size * 0.22)),
        width: Math.max(28, Math.round(size * 0.40)),
        excavate: true,
      } : undefined}
      style={{ display: 'block', margin: '0 auto', ...style }}
      className={className}
    />
  );
};

export default StickerQRCode;
