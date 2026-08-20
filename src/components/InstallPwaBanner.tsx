import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (isStandalone) return;

    // 2. Check if user dismissed banner recently
    const dismissed = localStorage.getItem('red_identidad_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 86400000) { // 24 hours
      return;
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS/.test(ua);

    if (isIosDevice && isSafari) {
      setIsIos(true);
      setShowBanner(true);
      return;
    }

    // 4. Android / Chrome beforeinstallprompt event listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('red_identidad_pwa_dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              right: '12px',
              zIndex: 9999,
              backgroundColor: 'rgba(25, 25, 25, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '18px',
              padding: '0.8rem 1rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.8rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: 0 }}>
              <img
                src="/logo.png"
                alt="Red Identidad"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  objectFit: 'contain',
                  backgroundColor: '#000',
                  padding: '2px',
                  border: '1px solid var(--accent-gold)'
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Smartphone size={14} color="var(--accent-gold)" /> Instalar App Red Identidad
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Agrega el icono a tu pantalla de inicio
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={handleInstallClick}
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 10px rgba(212,175,55,0.3)'
                }}
              >
                <Download size={14} /> Instalar
              </button>

              <button
                onClick={handleDismiss}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Safari Guide Modal */}
      <AnimatePresence>
        {showIosGuide && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="glass"
              style={{
                width: '100%',
                maxWidth: '420px',
                padding: '1.5rem',
                borderRadius: '24px',
                border: '1px solid var(--accent-gold)',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>
                  Instalar en iPhone / iPad
                </h3>
                <button onClick={() => setShowIosGuide(false)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                Sigue estos sencillos pasos en Safari para tener el icono de Red Identidad en la pantalla de inicio de tu celular:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(212,175,55,0.2)', padding: '6px', borderRadius: '8px', color: 'var(--accent-gold)' }}>
                    <Share size={20} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#FFF' }}>1. Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(212,175,55,0.2)', padding: '6px', borderRadius: '8px', color: 'var(--accent-gold)' }}>
                    <PlusSquare size={20} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#FFF' }}>2. Desliza y selecciona <strong>"Agregar al inicio"</strong>.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(212,175,55,0.2)', padding: '6px', borderRadius: '8px', color: 'var(--accent-gold)' }}>
                    <Smartphone size={20} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#FFF' }}>3. Toca <strong>"Agregar"</strong> arriba a la derecha. ¡Y listo!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 800,
                  border: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPwaBanner;
