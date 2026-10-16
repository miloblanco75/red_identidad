import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type CityId = 'campeche' | 'carmen' | 'juarez';

interface CityContextType {
  city: CityId;
  setCity: (city: CityId) => void;
  cityName: string;
  brandName: string;
  brandSlogan: string;
  isJuarez: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [city, setCityState] = useState<CityId>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCity = urlParams.get('city') || urlParams.get('ciudad');
      if (queryCity === 'juarez' || queryCity === 'vivejuarez' || queryCity === 'juarezconecta') return 'juarez';
      if (queryCity === 'carmen') return 'carmen';
      if (queryCity === 'campeche') return 'campeche';

      const host = window.location.hostname.toLowerCase();
      const isJuarezHost = host.startsWith('juarez.') || host.includes('juarez');
      const path = window.location.pathname.toLowerCase();

      if (isJuarezHost || path.startsWith('/juarez') || path.startsWith('/vivejuarez') || path.startsWith('/juarez-conecta')) return 'juarez';
      if (path.startsWith('/campeche') || path.startsWith('/landing')) return 'campeche';

      const saved = localStorage.getItem('selected_city') as CityId;
      if (saved && ['campeche', 'carmen', 'juarez'].includes(saved)) {
        return saved;
      }
    }
    return 'campeche';
  });

  const setCity = useCallback((newCity: CityId) => {
    setCityState(newCity);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_city', newCity);
    }

    // Sincronizar parámetro en la URL para evitar que query params desfasados reviertan la elección
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('city') !== newCity) {
        params.set('city', newCity);
        params.delete('ciudad');
        navigate(
          {
            pathname: window.location.pathname,
            search: params.toString() ? `?${params.toString()}` : '',
            hash: window.location.hash
          },
          { replace: true }
        );
      }
    } catch {
      // Ignorar si navigate no está disponible
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryCity = urlParams.get('city') || urlParams.get('ciudad');
    const path = location.pathname.toLowerCase();
    const host = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
    const isJuarezHost = host.startsWith('juarez.') || host.includes('juarez');

    let targetCity: CityId | null = null;

    if (queryCity === 'juarez' || queryCity === 'vivejuarez' || queryCity === 'juarezconecta') {
      targetCity = 'juarez';
    } else if (queryCity === 'campeche') {
      targetCity = 'campeche';
    } else if (queryCity === 'carmen') {
      targetCity = 'carmen';
    } else if (isJuarezHost || path.startsWith('/juarez') || path.startsWith('/vivejuarez') || path.startsWith('/juarez-conecta')) {
      targetCity = 'juarez';
    } else if (path.startsWith('/campeche') || path.startsWith('/landing')) {
      targetCity = 'campeche';
    } else if (path === '/') {
      const saved = typeof window !== 'undefined' ? (localStorage.getItem('selected_city') as CityId) : null;
      if (saved && ['campeche', 'carmen', 'juarez'].includes(saved)) {
        targetCity = saved;
      } else {
        targetCity = 'campeche';
      }
    }

    if (targetCity) {
      setCityState(prev => {
        if (prev === targetCity) return prev;
        if (typeof window !== 'undefined') {
          localStorage.setItem('selected_city', targetCity);
        }
        return targetCity;
      });
    }
  }, [location.pathname, location.search]);

  const cityName = city === 'juarez' 
    ? 'Ciudad Juárez' 
    : city === 'carmen' 
    ? 'Ciudad del Carmen' 
    : 'San Francisco de Campeche';

  const brandName = city === 'juarez' ? 'Juárez Conecta' : 'Red Identidad';
  const brandSlogan = city === 'juarez'
    ? 'El poder de consumir, ahorrar y pertenecer a esta frontera'
    : 'El poder de consumir, ahorrar y pertenecer a esta tierra';

  return (
    <CityContext.Provider value={{
      city,
      setCity,
      cityName,
      brandName,
      brandSlogan,
      isJuarez: city === 'juarez'
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
