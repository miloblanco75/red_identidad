import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Tesoro: React.FC = () => {
  const { user, loginLocal } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeParam = searchParams.get('c');
  const hasClaimedRef = useRef(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'unauthorized'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) {
      setStatus('unauthorized');
      return;
    }

    if (!codeParam) {
      setErrorMsg('No se detectó ningún código del tesoro.');
      setStatus('error');
      return;
    }

    if (!hasClaimedRef.current) {
      hasClaimedRef.current = true;
      claimTreasure();
    }
  }, [user, codeParam]);

  const claimTreasure = async () => {
    try {
      // 1. Verificar el código del tesoro
      const { data: treasure, error: fetchError } = await supabase
        .from('stickers')
        .select('*')
        .eq('code', codeParam?.toUpperCase())
        .single();

      if (fetchError || !treasure) {
        throw new Error('Este código no existe o no es válido.');
      }

      if (treasure.phone) {
        throw new Error('¡Oh no! Alguien más encontró este tesoro antes que tú.');
      }

      if (treasure.level !== 'gold') {
        throw new Error('Este código no es un tesoro Dorado.');
      }

      // 2. Quemar el código del tesoro (lo marcamos como reclamado)
      await supabase
        .from('stickers')
        .update({ phone: `BURNED_BY_${user?.phone}`, claimed_at: new Date().toISOString() })
        .eq('id', treasure.id);

      // 3. Subir de nivel al usuario actual (Actualizar su calcomanía original a Gold)
      const { data: updatedUser, error: upgradeError } = await supabase
        .from('stickers')
        .update({ level: 'gold' })
        .eq('phone', user?.phone)
        .select()
        .limit(1)
        .single();

      if (upgradeError) {
        // Fallback local
        loginLocal({ ...user!, level: 'gold' });
      } else if (updatedUser) {
        loginLocal({
          phone: updatedUser.phone,
          member_number: updatedUser.member_number,
          level: updatedUser.level,
          code: updatedUser.code
        });
      }

      setStatus('success');

      // Redirigir al salón VIP después de 4 segundos
      setTimeout(() => {
        navigate('/dorados');
      }, 4000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Error al reclamar el tesoro.');
      setStatus('error');
    }
  };

  if (status === 'unauthorized') {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center', paddingTop: '4rem' }}>
        <AlertCircle size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Identifícate Primero</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          Para reclamar un tesoro y subir a Nivel Dorado, primero debes tener tu Pase Phygital activo.
        </p>
        <button 
          onClick={() => navigate('/registro')}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--accent-gold)', color: '#121212', fontWeight: 700, border: 'none' }}
        >
          Ir a Mi Pase
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center', paddingTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {status === 'loading' && (
        <>
          <Loader2 className="animate-spin" size={48} color="var(--accent-gold)" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ fontSize: '1.5rem' }}>Verificando Tesoro...</h2>
          <p style={{ color: 'var(--text-dim)' }}>Estamos comprobando la autenticidad del código dorado.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle size={48} color="#ff4444" style={{ margin: '0 auto 2rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Búsqueda Fallida</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{errorMsg}</p>
          <button 
            onClick={() => navigate('/dorados')}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', fontWeight: 700, border: 'none' }}
          >
            Volver al Mapa
          </button>
        </>
      )}

      {status === 'success' && (
        <div className="premium-glow-gold glass" style={{ padding: '3rem 2rem', borderRadius: '24px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
            <Sparkles size={32} color="#FFF" style={{ position: 'absolute', top: -10, right: -10, zIndex: 2 }} />
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--accent-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={40} color="#121212" />
            </div>
          </div>
          
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>¡FELICIDADES!</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '2rem' }}>
            Has encontrado un Código del Tesoro. Acabamos de actualizar tu Pase Oficial a <strong style={{ color: 'var(--accent-gold)' }}>Nivel Dorado</strong>.
          </p>
          
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Loader2 className="animate-spin" size={14} /> Abriendo las puertas del Salón VIP...
          </div>
        </div>
      )}
    </div>
  );
};

export default Tesoro;
