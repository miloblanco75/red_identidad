import React, { useState, useEffect } from 'react';
import { 
  Building2, Car, CheckCircle2, Sparkles, Smartphone, Download, 
  MessageCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const GaleriasPropuesta: React.FC = () => {
  // Simulador interactivo: Estados
  const [activeTab, setActiveTab] = useState<'conductor' | 'caseta'>('conductor');
  const [ticketFolio, setTicketFolio] = useState('BOL-04892');
  const [carPlates, setCarPlates] = useState('DFE-48-21');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(3600); // 60 minutos
  const [validatedByBooth, setValidatedByBooth] = useState(false);
  const [validationHistory, setValidationHistory] = useState<Array<{ folio: string; plate: string; time: string; status: string }>>([
    { folio: 'BOL-04810', plate: 'YZA-12-88', time: '14:20 hrs', status: 'Aprobado ($150 ticket Liverpool)' },
    { folio: 'BOL-04855', plate: 'DJB-99-04', time: '15:05 hrs', status: 'Aprobado ($210 ticket Cinépolis)' }
  ]);
  const [purchaseVerified, setPurchaseVerified] = useState(true);

  // Reloj de cuenta regresiva simulado
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && remainingSeconds > 0 && !validatedByBooth) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, remainingSeconds, validatedByBooth]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Reproducir chime de confirmación
  const playApprovalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.25, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
      }
    } catch (e) {}
  };

  const handleStartParking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketFolio.trim() || !carPlates.trim()) return;
    setRemainingSeconds(3600); // Reiniciar a 60 min
    setIsTimerRunning(true);
    setValidatedByBooth(false);
  };

  const handleBoothValidate = () => {
    playApprovalChime();
    setValidatedByBooth(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + ' hrs';
    setValidationHistory(prev => [
      {
        folio: ticketFolio,
        plate: carPlates,
        time: timeStr,
        status: 'Aprobado ($150 ticket verificado)'
      },
      ...prev
    ]);
  };

  const handleSimulateFastForward = (minsElapsed: number) => {
    const remaining = Math.max(0, 3600 - minsElapsed * 60);
    setRemainingSeconds(remaining);
  };

  return (
    <div style={{ backgroundColor: '#090A0D', color: '#F1F5F9', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ── BARRA SUPERIOR INSTITUCIONAL ── */}
      <header style={{
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        backgroundColor: 'rgba(14, 16, 22, 0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.9rem 1.4rem'
      }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.04em', color: '#FFF' }}>
                  GALERÍAS CAMPECHE
                </span>
                <span style={{ color: 'var(--accent-gold, #D4AF37)', fontWeight: 800 }}>×</span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-gold, #D4AF37)' }}>
                  RED IDENTIDAD
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Documento Ejecutivo de Convenio Operativo
              </span>
            </div>
          </div>

          <a
            href="https://wa.me/529811971305?text=Hola,%20revisé%20la%20propuesta%20de%20exención%20de%20estacionamiento%20para%20Galerías%20Campeche%20y%20me%20gustaría%20agendar%20la%20reunión."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '100px',
              backgroundColor: '#25D366',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.78rem',
              textDecoration: 'none',
              boxShadow: '0 0 15px rgba(37, 211, 102, 0.35)'
            }}
          >
            <MessageCircle size={15} /> Contactar Dirección
          </a>
        </div>
      </header>

      {/* ── HERO BANNER PRINCIPAL ── */}
      <section style={{
        padding: '3rem 1.2rem 2.5rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.14) 0%, rgba(9, 10, 13, 1) 75%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '100px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #D4AF37',
            color: '#FFD700',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1.2rem'
          }}>
            <Sparkles size={14} /> Solución Tecnológica Llave en Mano
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', fontWeight: 900, lineHeight: 1.18, color: '#FFF', margin: '0 0 1rem' }}>
            1 Hora de Estacionamiento Gratis por Compra Mínima de <span style={{ color: '#D4AF37' }}>$150 MXN</span>
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#CBD5E1', lineHeight: 1.55, maxWidth: '680px', margin: '0 auto 2rem' }}>
            Mecanismo digital controlado por <strong>Red Identidad</strong> para que los automovilistas con distintivo oficial consuman dentro de <strong>Galerías Campeche</strong> y liberen su boleto en menos de 5 segundos, <strong>sin alterar sus cajeros automáticos</strong>.
          </p>

          {/* Tres Tarjetas de Valor Inmediato */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', textAlign: 'left', marginTop: '2rem' }}>
            <div style={{ padding: '1.2rem', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>💰</div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem', marginBottom: '4px' }}>Ticket Promedio Forzoso</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Para gozar de la hora, el cliente <strong>debe demostrar una compra de al menos $150 pesos</strong> en comercios de la plaza.
              </div>
            </div>

            <div style={{ padding: '1.2rem', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⏱️</div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem', marginBottom: '4px' }}>Rotación Rápida de Cajones</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                La gratuidad expira exactamente a los <strong>60 minutos</strong>. Incentiva compras ágiles y libera cajones para nuevos clientes.
              </div>
            </div>

            <div style={{ padding: '1.2rem', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🛡️</div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem', marginBottom: '4px' }}>Cero Gasto en Software</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Galerías no tiene que reprogramar sus máquinas automáticas. Toda la validación y control de tiempo corre en la nube de Red Identidad.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: SIMULADOR INTERACTIVO EN VIVO ── */}
      <section style={{ padding: '2.5rem 1.2rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold, #D4AF37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Demostración Práctica
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF', margin: '6px 0 10px' }}>
            Simulador en Vivo: Así Funciona en la Vida Real
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '600px', margin: '0 auto' }}>
            Prueba cómo interactúa el <strong>conductor en su teléfono</strong> y cómo lo valida el <strong>personal de Galerías en la caseta/módulo</strong>.
          </p>
        </div>

        {/* Selector de Pestaña del Simulador */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('conductor')}
            style={{
              padding: '0.65rem 1.2rem',
              borderRadius: '12px',
              fontSize: '0.84rem',
              fontWeight: 800,
              backgroundColor: activeTab === 'conductor' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'conductor' ? '#000' : '#FFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={16} /> 1. Vista Conductor (Su Teléfono)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('caseta')}
            style={{
              padding: '0.65rem 1.2rem',
              borderRadius: '12px',
              fontSize: '0.84rem',
              fontWeight: 800,
              backgroundColor: activeTab === 'caseta' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'caseta' ? '#000' : '#FFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={16} /> 2. Terminal Caseta / Módulo Galerías
          </button>
        </div>

        {/* CONTENEDOR DEL SIMULADOR */}
        <div style={{
          backgroundColor: '#12141A',
          borderRadius: '24px',
          border: '1.5px solid rgba(212, 175, 55, 0.4)',
          padding: '1.8rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
        }}>

          {/* VISTA 1: CONDUCTOR */}
          {activeTab === 'conductor' && (
            <div style={{ maxWidth: '440px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Pantalla del Socio Red Identidad
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFF' }}>
                  🅿️ Pase Estacionamiento Galerías
                </div>
              </div>

              {!isTimerRunning ? (
                <form onSubmit={handleStartParking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 800, marginBottom: '6px' }}>
                      1. Número de Folio del Boleto Físico:
                    </label>
                    <input
                      type="text"
                      value={ticketFolio}
                      onChange={(e) => setTicketFolio(e.target.value)}
                      placeholder="Ej: BOL-04892"
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFF',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                      Impreso en la parte superior de tu boleto al entrar.
                    </span>
                  </div>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 800, marginBottom: '6px' }}>
                      2. Placa del Auto con Calcomanía:
                    </label>
                    <input
                      type="text"
                      value={carPlates}
                      onChange={(e) => setCarPlates(e.target.value.toUpperCase())}
                      placeholder="Ej: DFE-48-21"
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFF',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      borderRadius: '14px',
                      backgroundColor: 'var(--accent-gold, #D4AF37)',
                      color: '#000',
                      fontWeight: 900,
                      fontSize: '1rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)'
                    }}
                  >
                    <Car size={18} /> Iniciar Mi Hora Gratis en Galerías
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  {/* Cronómetro Activo */}
                  <div style={{
                    width: '100%',
                    padding: '1.4rem 1rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    background: validatedByBooth
                      ? 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(20,40,25,0.95) 100%)'
                      : 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(30,25,12,0.95) 100%)',
                    border: validatedByBooth ? '2px solid #22C55E' : '2px solid #D4AF37'
                  }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: validatedByBooth ? '#4ADE80' : '#FFD700', letterSpacing: '0.08em' }}>
                      {validatedByBooth ? '✅ EXENCIÓN AUTORIZADA POR CAJERO' : '⏳ CRONÓMETRO OFICIAL DE 60 MINUTOS'}
                    </span>

                    <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFF', margin: '6px 0' }}>
                      {formatTimer(remainingSeconds)}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                      {validatedByBooth 
                        ? 'Tu boleto ha sido marcado en $0.00. Tienes 15 minutos para salir por la pluma.'
                        : 'Recuerda guardar tu ticket de $150 MXN y pasar al módulo antes de que acabe el tiempo.'}
                    </div>
                  </div>

                  {/* Datos del Auto y QR Dinámico */}
                  <div style={{
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    padding: '1rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase' }}>Boleto Registrado:</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'monospace', color: '#FFF' }}>{ticketFolio}</div>
                      <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '2px' }}>Auto Placas: <strong>{carPlates}</strong></div>
                    </div>

                    <div style={{ backgroundColor: '#FFF', padding: '6px', borderRadius: '10px' }}>
                      <QRCodeSVG value={`https://redidentidad.vercel.app/galerias-check?f=${ticketFolio}&p=${carPlates}`} size={64} />
                    </div>
                  </div>

                  {/* Controles de Simulación Rápida */}
                  <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: '6px', textAlign: 'center' }}>
                      Herramientas de prueba para el evaluador:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleSimulateFastForward(25)}
                        style={{ padding: '6px 8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: 'none', fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        Simular 25 min pasados
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateFastForward(55)}
                        style={{ padding: '6px 8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: 'none', fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        Simular 55 min pasados
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setIsTimerRunning(false); setValidatedByBooth(false); }}
                      style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'transparent', border: 'none', color: '#64748B', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Reiniciar simulador
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: TERMINAL DE CASETA / MÓDULO GALERÍAS */}
          {activeTab === 'caseta' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold, #D4AF37)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                    Panel Operativo en Caseta / Administración Galerías
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                    Terminal de Validación de Cortesías Red Identidad
                  </div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '100px', backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontSize: '0.72rem', fontWeight: 700 }}>
                  ● Sistema en Línea
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {/* Inspección del Auto Actual */}
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Auto Solicitante en Ventanilla
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Boleto Folio:</span>
                      <strong style={{ color: '#FFF', fontFamily: 'monospace' }}>{ticketFolio}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Placas registradas:</span>
                      <strong style={{ color: '#FFF', fontFamily: 'monospace' }}>{carPlates}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Calcomanía Física Oficial:</span>
                      <strong style={{ color: '#4ADE80' }}>✓ Verificada (Parabrisas)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Ticket de Compra ≥ $150:</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: purchaseVerified ? '#4ADE80' : '#EF4444' }}>
                        <input
                          type="checkbox"
                          checked={purchaseVerified}
                          onChange={(e) => setPurchaseVerified(e.target.checked)}
                        />
                        {purchaseVerified ? '✓ Presentado' : 'Pendiente'}
                      </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Tiempo de estancia:</span>
                      <strong style={{ color: remainingSeconds > 0 ? '#4ADE80' : '#EF4444' }}>
                        {remainingSeconds > 0 ? `${Math.floor((3600 - remainingSeconds)/60)} minutos transcurridos` : 'Excedió los 60 min'}
                      </strong>
                    </div>
                  </div>

                  {/* Botón de Aprobación */}
                  <div style={{ marginTop: '1.2rem' }}>
                    {validatedByBooth ? (
                      <div style={{ padding: '0.9rem', borderRadius: '12px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid #22C55E', color: '#86EFAC', textAlign: 'center', fontWeight: 800, fontSize: '0.86rem' }}>
                        ✓ Boleto {ticketFolio} exentado con éxito. Entrega boleto de cortesía $0 al cliente.
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleBoothValidate}
                        disabled={!isTimerRunning || !purchaseVerified || remainingSeconds <= 0}
                        style={{
                          width: '100%',
                          padding: '0.9rem',
                          borderRadius: '12px',
                          backgroundColor: (!isTimerRunning || !purchaseVerified || remainingSeconds <= 0) ? '#334155' : '#22C55E',
                          color: '#000',
                          fontWeight: 900,
                          fontSize: '0.88rem',
                          border: 'none',
                          cursor: (!isTimerRunning || !purchaseVerified || remainingSeconds <= 0) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={16} /> Exentar 1 Hora (Marcar $0.00)
                      </button>
                    )}
                  </div>
                </div>

                {/* Historial en Vivo para la Administración */}
                <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                      Auditoría Diaria Galerías
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Descargando reporte oficial para contabilidad Galerías en formato Excel...')}
                      style={{ background: 'transparent', border: 'none', color: '#4ADE80', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Download size={11} /> Exportar Excel
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {validationHistory.map((h, i) => (
                      <div key={i} style={{ padding: '8px 10px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#FFF', fontFamily: 'monospace' }}>{h.folio}</strong> • <span style={{ color: '#94A3B8' }}>{h.plate}</span>
                          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{h.status}</div>
                        </div>
                        <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem' }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECCIÓN 3: LOS 4 CANDADOS DE SEGURIDAD ── */}
      <section style={{ padding: '2.5rem 1.2rem', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold, #D4AF37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Blindaje Operativo
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFF', margin: '6px 0' }}>
            4 Candados Anti-Fraude que Garantizan Cero Fugas
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#13151C', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#4ADE80', fontWeight: 900, fontSize: '1.2rem', marginBottom: '6px' }}>1. Un Auto por Día</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.45, margin: 0 }}>
              El sistema bloquea la placa y el número de socio en cuanto recibe la exención. Un auto no puede salir, dar la vuelta y volver a pedir otra hora gratis el mismo día.
            </p>
          </div>

          <div style={{ backgroundColor: '#13151C', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#4ADE80', fontWeight: 900, fontSize: '1.2rem', marginBottom: '6px' }}>2. Placa ↔ Calcomanía</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.45, margin: 0 }}>
              La calcomanía física oficial tiene adherencia de seguridad automotriz. Si alguien intenta despegarla para pegarla en otro coche, se destruye. Además, la placa debe coincidir con el registro.
            </p>
          </div>

          <div style={{ backgroundColor: '#13151C', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#4ADE80', fontWeight: 900, fontSize: '1.2rem', marginBottom: '6px' }}>3. QR Anti-Capturas</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.45, margin: 0 }}>
              El código QR del socio cambia de color y token criptográfico cada 60 segundos con reloj de servidor. No es posible enviar capturas de pantalla por WhatsApp a terceros.
            </p>
          </div>

          <div style={{ backgroundColor: '#13151C', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#4ADE80', fontWeight: 900, fontSize: '1.2rem', marginBottom: '6px' }}>4. Auditoría Contable</div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.45, margin: 0 }}>
              Cada noche, el gerente puede descargar el reporte de conciliación con la hora exacta, folio de boleto, placa y ticket presentado para cotejarlo con el arqueo de caja.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: PREGUNTAS FRECUENTES PARA LA GERENCIA ── */}
      <section style={{ padding: '2rem 1.2rem 3rem', maxWidth: '820px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', textAlign: 'center', marginBottom: '1.5rem' }}>
          Preguntas Frecuentes de la Gerencia
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <strong style={{ color: '#FFF', fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>
              ¿Qué pasa si el auto se queda 1 hora con 20 minutos?
            </strong>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>
              La app marca que la hora gratis ya fue consumida y que tiene 20 minutos excedentes. Galerías le exenta los primeros 60 minutos y el cliente solo paga la fracción restante en las cajas automáticas habituales.
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <strong style={{ color: '#FFF', fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>
              ¿Cuánto le cuesta este sistema a Galerías Campeche?
            </strong>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>
              <strong>Cero pesos de inversión.</strong> Red Identidad absorbe toda la infraestructura tecnológica, hosting y soporte. A cambio, Galerías se convierte en el Aliado Ancla oficial de la red y obtiene promoción masiva ante miles de automovilistas campechanos.
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <strong style={{ color: '#FFF', fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>
              ¿Requiere capacitación compleja para los empleados de la plaza?
            </strong>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>
              No. El panel se abre en cualquier celular o tablet. Solo tiene un botón verde que dice "Exentar 1 Hora". Un empleado aprende a usarlo en 2 minutos.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER Y LLAMADO A LA ACCIÓN ── */}
      <footer style={{
        backgroundColor: '#0E1016',
        borderTop: '1px solid rgba(212,175,55,0.25)',
        padding: '2.5rem 1.2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', margin: '0 0 0.5rem' }}>
            ¿Listos para activar la alianza?
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginBottom: '1.5rem', lineHeight: 1.45 }}>
            Podemos realizar una prueba piloto de 15 días con 100 vehículos seleccionados para que el equipo de Galerías compruebe la eficacia y el incremento de ventas en sus locales.
          </p>

          <a
            href="https://wa.me/529811971305?text=Estimado%20equipo%20de%20Red%20Identidad,%20revisamos%20la%20propuesta%20de%20Galerías%20Campeche%20y%20deseamos%20coordinar%20la%20reunión%20técnica."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '1rem 2rem',
              borderRadius: '16px',
              backgroundColor: 'var(--accent-gold, #D4AF37)',
              color: '#000',
              fontWeight: 900,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.45)'
            }}
          >
            <MessageCircle size={18} /> Agendar Reunión de Coordinación
          </a>

          <div style={{ marginTop: '2rem', fontSize: '0.72rem', color: '#64748B' }}>
            Red Identidad Campeche • Plataforma de Identidad y Comercio Local • Documento Confidencial
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GaleriasPropuesta;
