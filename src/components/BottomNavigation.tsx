import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, MapPin, Store } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const tabs = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/registro', icon: CreditCard, label: 'Mi Pase' },
    { path: '/aliados', icon: MapPin, label: 'Aliados' },
    { path: '/aliado-panel', icon: Store, label: 'Mi Negocio' },
  ];

  return (
    <nav className="glass" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(70px + var(--safe-area-bottom))',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'var(--safe-area-bottom)',
      zIndex: 1000,
      borderRadius: '24px 24px 0 0',
      borderBottom: 'none'
    }}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive ? 'var(--accent-gold)' : 'var(--text-dim)',
            textDecoration: 'none',
            fontSize: '0.65rem',
            transition: 'all 0.3s ease',
            gap: '4px',
            flex: 1
          })}
        >
          <tab.icon size={22} strokeWidth={2} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
