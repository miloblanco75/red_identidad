import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import BottomNavigation from './components/BottomNavigation';
import { AuthProvider } from './contexts/AuthContext';
import { CityProvider } from './contexts/CityContext';
import InstallPwaBanner from './components/InstallPwaBanner';

// Lazy load pages for performance
const Landing = React.lazy(() => import('./pages/Landing'));
const LandingJuarez = React.lazy(() => import('./pages/LandingJuarez'));
const Home = React.lazy(() => import('./pages/Home'));
const Registro = React.lazy(() => import('./pages/Registro'));
const Aliados = React.lazy(() => import('./pages/Aliados'));
const Dorados = React.lazy(() => import('./pages/Dorados'));
const Fundadores = React.lazy(() => import('./pages/Fundadores'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Tesoro = React.lazy(() => import('./pages/Tesoro'));
const Galeria = React.lazy(() => import('./pages/Galeria'));
const Comercio = React.lazy(() => import('./pages/Comercio'));
const AliadoPanel = React.lazy(() => import('./pages/AliadoPanel'));
const EnvelopeStickerDesigner = React.lazy(() => import('./components/EnvelopeStickerDesigner'));
const PagoExitoso = React.lazy(() => import('./pages/PagoExitoso'));
const JuarezSemanaGratis = React.lazy(() => import('./pages/JuarezSemanaGratis'));
const JuarezPosterStand = React.lazy(() => import('./pages/JuarezPosterStand'));

// Layout para la Web App Móvil con su contenedor optimizado y navegación inferior
const MobileAppLayout: React.FC = () => {
  return (
    <div className="mobile-container">
      <InstallPwaBanner />
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(false);

  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  // Detección automática del subdominio de Ciudad Juárez (juarez.redidentidad.app o juarez.*)
  const isJuarezSubdomain = typeof window !== 'undefined' && (
    window.location.hostname.startsWith('juarez.') ||
    window.location.hostname.includes('juarez')
  );

  return (
    <AuthProvider>
      <Router>
        <CityProvider>
          <React.Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0B0E', color: '#F5F5F7' }}>Cargando...</div>}>
            <Routes>
              {/* Si entra desde juarez.redidentidad.app, la raíz '/' muestra Vive Juárez; sino, muestra Campeche */}
              <Route path="/" element={isJuarezSubdomain ? <LandingJuarez /> : <Landing />} />
              
              {/* Rutas explícitas para Campeche */}
              <Route path="/campeche" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />

              {/* Rutas explícitas para Vive Juárez (Ciudad Juárez) */}
              <Route path="/juarez" element={<LandingJuarez />} />
              <Route path="/juarez/landing" element={<LandingJuarez />} />
              <Route path="/vivejuarez" element={<LandingJuarez />} />

              {/* Campaña de Lanzamiento Vive Juárez: 7 Días de Membresía Gratis */}
              <Route path="/juarez/semana-gratis" element={<JuarezSemanaGratis />} />
              <Route path="/semana-gratis" element={<JuarezSemanaGratis />} />
              <Route path="/juarez/promo7" element={<JuarezSemanaGratis />} />
              <Route path="/juarez/poster-mostrador" element={<JuarezPosterStand />} />
              <Route path="/juarez/display-mesa" element={<JuarezPosterStand />} />

              {/* Rutas de la Web App Móvil y PWA de Miembros */}
              <Route element={<MobileAppLayout />}>
                <Route path="/app" element={<Home />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/aliados" element={<Aliados />} />
                <Route path="/dorados" element={<Dorados />} />
                <Route path="/fundadores" element={<Fundadores />} />
                <Route path="/admin-red" element={<Admin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/tesoro" element={<Tesoro />} />
                <Route path="/galeria" element={<Galeria />} />
                <Route path="/comercio" element={<Comercio />} />
                <Route path="/aliado-panel" element={<AliadoPanel />} />
                <Route path="/imprimir-calcomanias" element={<EnvelopeStickerDesigner />} />
                <Route path="/pago-exitoso" element={<PagoExitoso />} />
              </Route>
            </Routes>
          </React.Suspense>
        </CityProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
