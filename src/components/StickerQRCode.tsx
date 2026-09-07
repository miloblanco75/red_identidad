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

  const isEnvelopeOrCampechana = 
    normLevel.includes('campechana') ||
    normLevel.includes('sobre') ||
    normLevel.includes('envelope') ||
    normValue.includes('campechana') ||
    normValue.includes('sobre') ||
    normValue.includes('rosa') ||
    normValue.includes('negr');

  // Enlace oficial de Facebook de Red Identidad para sobres y Campechana
  const OFFICIAL_FACEBOOK_URL = 'https://www.facebook.com/share/1DHyrzvtjh/?mibextid=wwXIfr';

  let targetUrl = OFFICIAL_FACEBOOK_URL;

  if (isEnvelopeOrCampechana || normValue.includes('registro?c=rosa') || normValue.includes('registro?c=negr') || normValue.includes('registro?c=sobre')) {
    // Si es sobre o Campechana, NUNCA ir al registro, SIEMPRE ir a Facebook
    targetUrl = OFFICIAL_FACEBOOK_URL;
  } else if (value && value.startsWith('http')) {
    targetUrl = value;
  } else if (value) {
    targetUrl = `https://redidentidad.vercel.app/registro?c=${encodeURIComponent(value)}`;
  } else {
    targetUrl = OFFICIAL_FACEBOOK_URL;
  }

  const qrFgColor = isRosa ? '#FF5C9D' : '#000000';

  return (
    <QRCodeSVG
      value={targetUrl}
      size={size}
      level="M"
      bgColor="#FFFFFF"
      fgColor={qrFgColor}
      style={{ display: 'block', margin: '0 auto', ...style }}
      className={className}
    />
  );
};

export default StickerQRCode;
