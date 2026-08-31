import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface StickerQRCodeProps {
  value: string;
  level?: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const StickerQRCode: React.FC<StickerQRCodeProps> = ({
  value,
  level = '',
  size = 100,
  style,
  className,
}) => {
  const normLevel = (level || '').toLowerCase().replace(/-/g, '_');
  const isRosa = normLevel.includes('rosa') || normLevel.includes('rosada') || normLevel.includes('pink');
  const isCampechanaOrNegra = normLevel.includes('campechana') || normLevel.includes('campechano') || normLevel.includes('negra');

  if (isRosa) {
    return (
      <img
        src="/qr_campechana_rosa.png"
        alt="QR Campechana Rosa"
        style={{
          width: size ? `${size}px` : '100%',
          height: size ? `${size}px` : '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto',
          ...style,
        }}
        className={className}
      />
    );
  }

  if (isCampechanaOrNegra) {
    return (
      <img
        src="/qr_campechana_negra.png"
        alt="QR Campechana Negra"
        style={{
          width: size ? `${size}px` : '100%',
          height: size ? `${size}px` : '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto',
          ...style,
        }}
        className={className}
      />
    );
  }

  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      bgColor="#FFFFFF"
      fgColor="#000000"
      style={{ display: 'block', ...style }}
      className={className}
    />
  );
};

export default StickerQRCode;
