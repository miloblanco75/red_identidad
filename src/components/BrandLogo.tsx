import React from 'react';
import { useCity } from '../contexts/CityContext';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSlogan?: boolean;
  centered?: boolean;
  className?: string;
  sloganColor?: string;
  forceCity?: 'campeche' | 'carmen' | 'juarez';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'medium',
  showSlogan = true,
  centered = true,
  className = '',
  sloganColor,
  forceCity
}) => {
  let isJuarez = false;
  let brandSlogan = 'El poder de consumir, ahorrar y pertenecer a esta tierra';

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cityContext = useCity();
    const effectiveCity = forceCity || cityContext.city;
    isJuarez = effectiveCity === 'juarez';
    brandSlogan = cityContext.brandSlogan;
  } catch {
    if (forceCity === 'juarez') {
      isJuarez = true;
      brandSlogan = 'El poder de consumir, ahorrar y pertenecer a esta frontera';
    }
  }

  const sloganSize = size === 'small' ? '0.75rem' : size === 'large' ? '0.95rem' : '0.85rem';

  if (isJuarez) {
    const badgeSize = size === 'small' ? '36px' : size === 'large' ? '54px' : '44px';
    const textSize = size === 'small' ? '1.15rem' : size === 'large' ? '1.75rem' : '1.35rem';

    return (
      <div 
        className={`brand-logo-container ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'center' : 'flex-start',
          textAlign: centered ? 'center' : 'left',
          margin: centered ? '0 auto' : undefined
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img 
            src="/vive_juarez_qr_icon.png"
            alt="Vive Juárez Oficial"
            style={{
              width: badgeSize,
              height: badgeSize,
              borderRadius: '10px',
              objectFit: 'contain',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)'
            }}
          />
          <div>
            <div style={{ fontSize: textSize, fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.1, color: '#FFFFFF' }}>
              VIVE <span className="gold-text">JUÁREZ</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#8E8E98', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              by Red Identidad
            </div>
          </div>
        </div>
        {showSlogan && (
          <p 
            style={{
              marginTop: '0.45rem',
              fontSize: sloganSize,
              color: sloganColor || 'var(--accent-gold)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              lineHeight: 1.3,
              fontStyle: 'italic',
              opacity: 0.95
            }}
          >
            "{brandSlogan}"
          </p>
        )}
      </div>
    );
  }

  const logoWidth = size === 'small' ? '130px' : size === 'large' ? '250px' : '180px';

  return (
    <div 
      className={`brand-logo-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        textAlign: centered ? 'center' : 'left',
        margin: centered ? '0 auto' : undefined
      }}
    >
      <img 
        src="/logo.png" 
        alt="Red Identidad" 
        style={{
          width: logoWidth,
          maxWidth: '100%',
          height: 'auto',
          filter: 'drop-shadow(0px 4px 14px rgba(212, 175, 55, 0.3))',
          objectFit: 'contain'
        }}
      />
      {showSlogan && (
        <p 
          style={{
            marginTop: '0.4rem',
            fontSize: sloganSize,
            color: sloganColor || 'var(--accent-gold)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
            fontStyle: 'italic',
            opacity: 0.95
          }}
        >
          "{brandSlogan}"
        </p>
      )}
    </div>
  );
};

export default BrandLogo;
