import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Crown, QrCode, Star, Phone, Sparkles, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const Registro: React.FC = () => {
  const { user, loginLocal, signOut, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeParam = searchParams.get('c') || '';

  const [serial, setSerial] = useState(codeParam);
  const [phone, setPhone] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isFounder = user?.code.toUpperCase().includes('FD') || serial.toUpperCase().includes('FD');

  const isDemoCode = (codeStr: string) => {
    if (!codeStr) return false;
    const clean = codeStr.trim().toUpperCase();
    if (clean === 'DEMO' || clean.includes('DEMO')) return true;
    if (clean.startsWith('SOBRE-')) return true;
    if (clean.startsWith('ROSA-')) return true;
    if (clean.startsWith('NEGR-')) return true;
    return false;
  };

  const handleActivateDemo = (overridePhone?: string) => {
    loginLocal({
      phone: overridePhone || phone || '9810000000',
      member_number: 9,
      level: 'gold',
      code: 'PASE-DEMO-009'
    });
    navigate('/');
  };

  const handleActivate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serial) return;
    
    if (isDemoCode(serial) || isDemoCode(codeParam)) {
      handleActivateDemo(phone);
      return;
    }

    if (!phone) return;
    
    setIsActivating(true);
    setErrorMsg('');
    
    try {
      // 1. Buscar la calcomanía en la base de datos
      const { data: sticker, error: fetchError } = await supabase
        .from('stickers')
        .select('*')
        .eq('code', serial.toUpperCase())
        .single();

      if (fetchError || !sticker) {
        throw new Error('Código QR no válido o no encontrado.');
      }

      if (sticker.phone) {
        if (phone && sticker.phone.trim() === phone.trim()) {
          // El mismo usuario intenta sincronizar su pase
          loginLocal({
            phone: sticker.phone,
            member_number: sticker.member_number,
            level: sticker.level,
            code: sticker.code
          });
          return;
        }
        // Restaurar de todos modos si consulta su propio código
        loginLocal({
          phone: sticker.phone,
          member_number: sticker.member_number,
          level: sticker.level,
          code: sticker.code
        });
        return;
      }

      // 2. Reclamar la calcomanía guardando el teléfono
      const { data: updatedSticker, error: updateError } = await supabase
        .from('stickers')
        .update({ phone: phone, claimed_at: new Date().toISOString() })
        .eq('id', sticker.id)
        .select()
        .single();

      if (updateError || !updatedSticker) {
        throw new Error('Error al activar tu membresía. Intenta de nuevo.');
      }

      // 3. Éxito: Guardar en local storage (Login local)
      loginLocal({
        phone: updatedSticker.phone,
        member_number: updatedSticker.member_number,
        level: updatedSticker.level,
        code: updatedSticker.code
      });

    } catch (err: any) {
      setErrorMsg(err.message || 'Error desconocido');
      // SIMULACIÓN FALLBACK para desarrollo
      if (err.message.includes('relation "public.stickers" does not exist') || err.message.includes('column "phone" of relation')) {
          console.warn("Tabla stickers no actualizada. Usando simulación.");
          const upperSerial = serial.toUpperCase();
          let mockLevel = 'white';
          if (upperSerial.includes('GD') || upperSerial.includes('GOLD')) mockLevel = 'gold';
          else if (upperSerial.includes('PL') || upperSerial.includes('SILV')) mockLevel = 'silver';
          
          loginLocal({
            phone: phone,
            member_number: Math.floor(Math.random() * 1000),
            level: mockLevel,
            code: upperSerial
          });
      }
    } finally {
      setIsActivating(false);
    }
  };

  const getLevelInfo = (levelStr: string) => {
    switch (levelStr) {
      case 'white': return { name: 'Esencial', color: 'var(--accent-white)', glow: 'premium-glow-white', progress: 30 };
      case 'silver': return { name: 'Colección', color: 'var(--accent-silver)', glow: 'premium-glow-silver', progress: 70 };
      case 'gold': return { name: 'VIP Dorado', color: 'var(--accent-gold)', glow: 'premium-glow-gold', progress: 100 };
      default: return { name: '', color: '', glow: '', progress: 0 };
    }
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>Cargando pase...</div>;
  }

  // --- ESTADO 1: NO TIENE PASE EN LOCAL STORAGE ---
  if (!user) {
    return (
      <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px', textAlign: 'center' }}>
        <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          <BrandLogo size="medium" showSlogan={true} />
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Ingresa tu WhatsApp para vincular tu calcomanía física y obtener tu Pase VIP.
        </p>

        <section className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'left' }}>
          
          {isDemoCode(codeParam || serial) && (
            <div style={{
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '18px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <Sparkles size={20} color="var(--accent-gold)" />
                <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Modo Demostración POS
                </span>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                Has escaneado el QR de exhibición del Punto de Venta. Puedes acceder libremente para probar la experiencia de Red Identidad.
              </p>
              <button
                type="button"
                onClick={() => handleActivateDemo()}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
              >
                <Sparkles size={16} /> Entrar en Modo Demo (Sin registro)
              </button>
            </div>
          )}

          <form onSubmit={handleActivate}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                Código de Calcomanía
              </label>
              <div style={{ position: 'relative' }}>
                <QrCode size={20} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Ej: RED-001"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value.toUpperCase())}
                  required
                  readOnly={!!codeParam}
                  style={{
                    width: '100%', padding: '1rem 1rem 1rem 3rem', backgroundColor: codeParam ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)', borderRadius: '12px',
                    color: '#FFF', fontSize: '1rem', outline: 'none', textTransform: 'uppercase'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
                Número de WhatsApp (10 dígitos)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={20} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="tel" 
                  placeholder="55 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  required
                  pattern="[0-9]{10}"
                  style={{
                    width: '100%', padding: '1rem 1rem 1rem 3rem', backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)', borderRadius: '12px',
                    color: '#FFF', fontSize: '1rem', outline: 'none'
                  }}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={isActivating || phone.length < 10 || !serial}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '12px', 
                backgroundColor: (phone.length === 10 && serial) ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', 
                color: '#121212',
                fontWeight: 700, border: 'none', cursor: 'pointer',
                opacity: isActivating ? 0.7 : 1,
                transition: 'all 0.3s'
              }}
            >
              {isActivating ? 'Verificando...' : 'Activar Membresía'}
            </button>
          </form>

        </section>
      </div>
    );
  }

  // --- ESTADO 2: TIENE PASE ACTIVO EN LOCAL STORAGE ---
  const levelInfo = getLevelInfo(user.level);

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <section>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Mi Pase</h1>
          {isFounder && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--accent-gold)', color: '#121212', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
              <Star size={12} /> FOUNDER
            </div>
          )}
        </div>

        {user.code?.includes('DEMO') && (
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--accent-gold)', padding: '0.6rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--accent-gold)', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Pase de Demostración Activo (Vista Previa POS)
          </div>
        )}

        {/* Digital Wallet Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className={`glass ${levelInfo.glow}`}
          style={{ 
            padding: '2rem', 
            borderRadius: '24px', 
            position: 'relative', 
            overflow: 'hidden', 
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: `linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(10,10,10,0.95) 100%)`
          }}
        >
          {/* Background Icon */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', opacity: 0.05 }}>
            {user.level === 'gold' ? <Crown size={200} /> : <ShieldCheck size={200} />}
          </div>

          {/* QR Code Section */}
          <div style={{ 
            backgroundColor: '#FFF', 
            padding: '1.2rem', 
            borderRadius: '16px', 
            marginBottom: '0.8rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 1
          }}>
            {/* El QR del pase muestra el ID del miembro para que el comercio lo escanee */}
            <QRCodeSVG value={`redidentidad://validate/member/${user.member_number}`} size={190} level="H" />
          </div>

          {/* Instruction below QR */}
          <div style={{
            backgroundColor: 'rgba(212,175,55,0.1)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '10px',
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1.5rem',
            zIndex: 1
          }}>
            <QrCode size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Muéstrale este código o tu número al negocio aliado</span>
          </div>

          <div style={{ textAlign: 'center', zIndex: 1, width: '100%' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>
              Miembro Oficial No.
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1.5rem', fontFamily: 'monospace', color: 'var(--accent-white)' }}>
              #{String(user.member_number).padStart(4, '0')}
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Nivel</div>
                <div style={{ color: levelInfo.color, fontWeight: 700, fontSize: '1rem' }}>{levelInfo.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Teléfono</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{user.phone.slice(0,2)} •••• {user.phone.slice(-4)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          <Sparkles size={14} color="var(--accent-gold)" /> Tu membresía está activa — úsala en cualquier aliado
        </div>
        
        {/* Primary CTA: Ver Aliados */}
        <button
          onClick={() => navigate('/aliados')}
          style={{
            width: '100%',
            padding: '1.1rem',
            borderRadius: '14px',
            backgroundColor: 'var(--accent-gold)',
            color: '#121212',
            fontWeight: 800,
            fontSize: '1rem',
            border: 'none',
            marginBottom: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
          }}
        >
          Ver Aliados y Descuentos
        </button>
        
        <button
          onClick={() => navigate('/galeria')}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(30, 30, 30, 0.9) 100%)',
            color: 'var(--accent-gold)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            marginBottom: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={16} /> Ver mi Galería de Calcomanías
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('red_identidad_pwa_dismissed');
            window.location.reload();
          }}
          style={{
            width: '100%',
            padding: '0.9rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#FFF',
            fontWeight: 600,
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Smartphone size={16} color="var(--accent-gold)" /> Guardar icono en Pantalla de Inicio
        </button>

        <button 
          onClick={signOut}
          style={{ width: '100%', padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', background: 'none', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', marginBottom: '0.8rem' }}
        >
          Remover Tarjeta de este dispositivo
        </button>

      </section>
    </div>
  );
};

export default Registro;
