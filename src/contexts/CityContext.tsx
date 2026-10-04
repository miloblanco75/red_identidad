import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  let locationSearch = '';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation();
    locationSearch = location.search;
  } catch {
    if (typeof window !== 'undefined') locationSearch = window.location.search;
  }

  const [city, setCityState] = useState<CityId>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCity = urlParams.get('city') || urlParams.get('ciudad');
      if (queryCity === 'juarez' || queryCity === 'vivejuarez') return 'juarez';
      if (queryCity === 'carmen') return 'carmen';
      if (queryCity === 'campeche') return 'campeche';

      const host = window.location.hostname.toLowerCase();
      if (host.startsWith('juarez.') || host.includes('juarez')) return 'juarez';

      const saved = localStorage.getItem('selected_city') as CityId;
      if (saved && ['campeche', 'carmen', 'juarez'].includes(saved)) {
        return saved;
      }
    }
    return 'campeche';
  });

  const setCity = (newCity: CityId) => {
    setCityState(newCity);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_city', newCity);
    }
  };

  useEffect(() => {
    const rawSearch = locationSearch || (typeof window !== 'undefined' ? window.location.search : '');
    const urlParams = new URLSearchParams(rawSearch);
    const queryCity = urlParams.get('city') || urlParams.get('ciudad');
    if (queryCity === 'juarez' && city !== 'juarez') {
      setCity('juarez');
    } else if (queryCity === 'campeche' && city !== 'campeche') {
      setCity('campeche');
    } else if (queryCity === 'carmen' && city !== 'carmen') {
      setCity('carmen');
    }
  }, [locationSearch, city]);

  const cityName = city === 'juarez' 
    ? 'Ciudad Juárez' 
    : city === 'carmen' 
    ? 'Ciudad del Carmen' 
    : 'San Francisco de Campeche';

  const brandName = city === 'juarez' ? 'Vive Juárez' : 'Red Identidad';
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
