import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import BottomNavigation from './components/BottomNavigation';
import { AuthProvider } from './contexts/AuthContext';
import InstallPwaBanner from './components/InstallPwaBanner';

// Lazy load pages for performance
const Landing = React.lazy(() => import('./pages/Landing'));
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

  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0B0E', color: '#F5F5F7' }}>Cargando Red Identidad...</div>}>
          <Routes>
            {/* Landing Page Principal Full-Width */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />

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
      </Router>
    </AuthProvider>
  );
}

export default App;
