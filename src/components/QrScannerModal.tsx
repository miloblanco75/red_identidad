import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QrScannerModalProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ onScanSuccess, onClose }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const qrInstanceRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-container';

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerContainerId);
        qrInstanceRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (isMounted) {
              // Stop camera and trigger success callback
              html5QrCode.stop().then(() => {
                onScanSuccess(decodedText);
              }).catch(() => {
                onScanSuccess(decodedText);
              });
            }
          },
          () => {
            // Ignore scan failures per frame
          }
        );

        if (isMounted) setIsInitializing(false);
      } catch (err: any) {
        console.error('Error starting QR scanner:', err);
        if (isMounted) {
          setIsInitializing(false);
          setErrorMsg(
            'No se pudo acceder a la cámara. Verifica los permisos del navegador o usa el botón manual.'
          );
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (qrInstanceRef.current && qrInstanceRef.current.isScanning) {
        qrInstanceRef.current.stop().catch((e) => console.error('Error stopping scanner:', e));
      }
    };
  }, [onScanSuccess]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '28px',
          padding: '2rem 1.5rem',
          position: 'relative',
          border: '1px solid rgba(212,175,55,0.3)',
          textAlign: 'center',
        }}
      >
        {/* Header & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 700 }}>
            <Camera size={20} /> Escáner de Cliente
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFF',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Apunta la cámara al QR del carné o calcomanía del miembro.
        </p>

        {/* Camera Container */}
        <div
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#000',
            minHeight: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(212,175,55,0.4)',
          }}
        >
          <div id={scannerContainerId} style={{ width: '100%' }} />

          {isInitializing && !errorMsg && (
            <div style={{ position: 'absolute', color: 'var(--text-dim)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw className="animate-spin" size={18} /> Encendiendo cámara...
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '1.5rem', color: '#FF4444', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
              {errorMsg}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.9rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#FFF',
            fontWeight: 600,
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
      </motion.div>
    </div>
  );
};
