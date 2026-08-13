import React from 'react';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSlogan?: boolean;
  centered?: boolean;
  className?: string;
  sloganColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'medium',
  showSlogan = true,
  centered = true,
  className = '',
  sloganColor
}) => {
  const logoWidth = size === 'small' ? '130px' : size === 'large' ? '250px' : '180px';
  const sloganSize = size === 'small' ? '0.75rem' : size === 'large' ? '0.95rem' : '0.85rem';

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
          "El poder de consumir, ahorrar y pertenecer a esta tierra"
        </p>
      )}
    </div>
  );
};

export default BrandLogo;
