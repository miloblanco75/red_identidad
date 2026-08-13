import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(onEnter, 600); // Match animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#121212',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img 
              src="/logo.png" 
              alt="Red Identidad Logo" 
              style={{
                width: '100%',
                maxWidth: '250px',
                marginBottom: '0.75rem',
                filter: 'drop-shadow(0px 4px 15px rgba(212, 175, 55, 0.3))'
              }}
            />
            <p style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--accent-gold)',
              letterSpacing: '0.01em',
              lineHeight: 1.4,
              maxWidth: '300px',
              margin: '0 auto 1rem',
              fontStyle: 'italic'
            }}>
              "El poder de consumir, ahorrar y pertenecer a esta tierra"
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              color: '#A1A1A6'
            }}>
              <span>Campechano Soy</span>
              <span>•</span>
              <span>Carmelita Soy</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ 
              fontSize: '1.1rem', 
              color: '#F5F5F7',
              maxWidth: '280px',
              lineHeight: 1.6,
              marginBottom: '3rem'
            }}
          >
            "No es una calcomanía.<br />
            Es <span style={{ fontWeight: 600 }}>pertenencia</span>."
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            onClick={handleEnter}
            style={{
              padding: '1rem 2.5rem',
              borderRadius: '100px',
              backgroundColor: '#F5F5F7',
              color: '#121212',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
              border: 'none'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Entrar a la Red
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
