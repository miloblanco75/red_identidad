import React from 'react';
import BrandLogo from './BrandLogo';

export const Header: React.FC = () => {
  return (
    <header 
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: '0 0 16px 16px',
        backgroundColor: 'rgba(18, 18, 18, 0.85)'
      }}
    >
      <BrandLogo size="small" showSlogan={true} centered={true} />
    </header>
  );
};

export default Header;
