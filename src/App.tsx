import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import BottomNavigation from './components/BottomNavigation';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages for performance
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

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="mobile-container">
        <React.Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/aliados" element={<Aliados />} />
            <Route path="/dorados" element={<Dorados />} />
            <Route path="/fundadores" element={<Fundadores />} />
            <Route path="/admin-red" element={<Admin />} />
            <Route path="/tesoro" element={<Tesoro />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/comercio" element={<Comercio />} />
            <Route path="/aliado-panel" element={<AliadoPanel />} />
            <Route path="/imprimir-calcomanias" element={<EnvelopeStickerDesigner />} />
          </Routes>
        </React.Suspense>
        <BottomNavigation />
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
