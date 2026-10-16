import React, { useState, useEffect } from 'react';
import { 
  Building2, Car, CheckCircle2, Sparkles, Smartphone, Download, 
  MessageCircle, Award, ShoppingBag, Utensils, Laptop, Film, Coffee
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface GaleriasMerchant {
  id: string;
  name: string;
  category: string;
  categoryIcon: React.ElementType;
  logo: string;
  accentColor: string;
  badge: string;
  discount: string;
  location: string;
  ticketEligible: boolean;
  tagline: string;
}

const GALERIAS_MERCHANTS: GaleriasMerchant[] = [
  {
    id: 'bostons',
    name: "Boston's Restaurant & Sports Bar",
    category: 'Restaurante & Deportes',
    categoryIcon: Utensils,
    logo: '🍕',
    accentColor: '#EF4444',
    badge: 'Aliado Gastronómico Ancla',
    discount: '15% OFF en consumo total o Postre de Cortesía en consumos de $150 MXN o más',
    location: 'Planta Alta — Zona Restaurantes',
    ticketEligible: true,
    tagline: 'Pizzas gourmet, hamburguesas al carbón, alitas y pantallas gigantes para eventos deportivos.'
  },
  {
    id: 'sushi_roll',
    name: 'Sushi Roll Galerías',
    category: 'Comida Japonesa & Fusión',
    categoryIcon: Utensils,
    logo: '🍣',
    accentColor: '#F59E0B',
    badge: 'Aliado Gastronómico',
    discount: '2x1 en Rollos Clásicos seleccionados o 15% OFF en barra fría con distintivo oficial',
    location: 'Planta Alta — Terraza con Vista',
    ticketEligible: true,
    tagline: 'Rollos de autor, teppanyaki a la plancha, ramen y coctelería oriental.'
  },
  {
    id: 'marti',
    name: 'Deportes Martí Galerías',
    category: 'Ropa Deportiva & Calzado',
    categoryIcon: ShoppingBag,
    logo: '👟',
    accentColor: '#3B82F6',
    badge: 'Aliado Retail Premium',
    discount: '10% Adicional en calzado deportivo y prendas de entrenamiento en compras de $150+',
    location: 'Planta Baja — Pasillo Central',
    ticketEligible: true,
    tagline: 'Líder en moda deportiva, running y fitness con marcas oficiales Nike, Adidas y Puma.'
  },
  {
    id: 'ishop',
    name: 'iShop Mixup (Apple Reseller)',
    category: 'Tecnología & Gadgets',
    categoryIcon: Laptop,
    logo: '💻',
    accentColor: '#A855F7',
    badge: 'Aliado Tecnología',
    discount: '15% de Descuento en accesorios de protección (fundas, micas y cables certificados)',
    location: 'Planta Baja — Acceso Principal',
    ticketEligible: true,
    tagline: 'Apple Premium Reseller: iPhone, iPad, Mac, audio premium JBL y servicio técnico especializado.'
  },
  {
    id: 'cinepolis',
    name: 'Cinépolis Galerías Campeche',
    category: 'Entretenimiento & Cine',
    categoryIcon: Film,
    logo: '🍿',
    accentColor: '#EAB308',
    badge: 'Entretenimiento Familiar',
    discount: 'Precio Especial Socio en Combo Tradicional (Palomitas Grandes + 2 Refrescos)',
    location: 'Planta Alta — Zona de Entretenimiento',
    ticketEligible: true,
    tagline: 'Salas tradicionales, sonido Dolby y dulcería con nachos, crepas y café.'
  },
  {
    id: 'starbucks',
    name: 'Starbucks Coffee Galerías',
    category: 'Cafetería de Especialidad',
    categoryIcon: Coffee,
    logo: '☕',
    accentColor: '#10B981',
    badge: 'Café & Lifestyle',
    discount: 'Upgrade de tamaño gratis (de Alto a Grande / de Grande a Venti) en bebida preparada',
    location: 'Planta Baja — Kiosco Central',
    ticketEligible: true,
    tagline: 'Bebidas de temporada, frappuccinos, bocadillos artesanales y café de grano arábica.'
  }
];

export const GaleriasPropuesta: React.FC = () => {
  // Pestaña principal de la propuesta
  const [proposalSection, setProposalSection] = useState<'estacionamiento' | 'pabellon' | 'intercambio'>('estacionamiento');

  // Simulador interactivo: Estados de la caseta y conductor
  const [simRoleTab, setSimRoleTab] = useState<'conductor' | 'caseta'>('conductor');
  const [ticketFolio, setTicketFolio] = useState('BOL-04892');
  const [carPlates, setCarPlates] = useState('DFE-48-21');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(3600); // 60 minutos
  const [validatedByBooth, setValidatedByBooth] = useState(false);
  const [validationHistory, setValidationHistory] = useState<Array<{ folio: string; plate: string; time: string; status: string }>>([
    { folio: 'BOL-04810', plate: 'YZA-12-88', time: '14:20 hrs', status: "Aprobado (Ticket Boston's $280)" },
    { folio: 'BOL-04855', plate: 'DJB-99-04', time: '15:05 hrs', status: 'Aprobado (Ticket Martí $450)' }
  ]);
  const [purchaseVerified, setPurchaseVerified] = useState(true);

  // Filtro del Pabellón Galerías
  const [merchantCategory, setMerchantCategory] = useState<string>('Todos');

  // Reloj simulado de cuenta regresiva
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
    setRemainingSeconds(3600);
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

  const filteredMerchants = merchantCategory === 'Todos'
    ? GALERIAS_MERCHANTS
    : GALERIAS_MERCHANTS.filter(m => m.category.toLowerCase().includes(merchantCategory.toLowerCase()));

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
        padding: '0.85rem 1.2rem'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                Convenio Integral • Estacionamiento + Pabellón Comercial + Banner Físico
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="https://wa.me/529811971305?text=Estimado%20equipo%20de%20Red%20Identidad,%20revisamos%20la%20propuesta%20integral%20de%20Galerías%20Campeche%20(Estacionamiento%20y%20Pabellón%20Comercial)%20y%20deseamos%20coordinar%20la%20reunión."
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
              <MessageCircle size={15} /> Agendar Cita
            </a>
          </div>
        </div>
      </header>

      {/* ── BARRA DE NAVEGACIÓN DE LAS 3 PROPUESTAS ── */}
      <nav style={{
        backgroundColor: '#111319',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: '61px',
        zIndex: 40,
        padding: '0.4rem 1.2rem'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'estacionamiento', label: '🅿️ 1. Estacionamiento (1 Hora x $150) & Simulador', badge: 'Operativo' },
            { id: 'pabellon', label: "🛍️ 2. Pabellón Digital Galerías (Boston's, Sushi Roll, Martí, iShop)", badge: 'Exclusivo' },
            { id: 'intercambio', label: '🚩 3. Convenio Intercambio: Banner Físico en la Plaza', badge: 'Intercambio' }
          ].map((tab) => {
            const isCurrent = proposalSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProposalSection(tab.id as any)}
                style={{
                  padding: '0.55rem 0.95rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  backgroundColor: isCurrent ? 'var(--accent-gold, #D4AF37)' : 'rgba(255,255,255,0.04)',
                  color: isCurrent ? '#000' : '#CBD5E1',
                  border: isCurrent ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── HERO BANNER RESUMEN ── */}
      <section style={{
        padding: '2.5rem 1.2rem 2rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.15) 0%, rgba(9, 10, 13, 1) 80%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '100px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #D4AF37',
            color: '#FFD700',
            fontSize: '0.74rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem'
          }}>
            <Sparkles size={14} /> Alianza Comercial Ganar-Ganar 2026
          </div>

          <h1 style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.5rem)', fontWeight: 900, lineHeight: 1.18, color: '#FFF', margin: '0 0 0.8rem' }}>
            Convenio de Exención de Estacionamiento e Intercambio Publicitario en <span style={{ color: '#D4AF37' }}>Galerías Campeche</span>
          </h1>

          <p style={{ fontSize: '0.98rem', color: '#CBD5E1', lineHeight: 1.5, maxWidth: '720px', margin: '0 auto' }}>
            Una sinergia integral: <strong>1 hora gratis de estacionamiento</strong> ligada a <strong>consumo obligatorio de $150 MXN</strong>, un <strong>área VIP digital en la app</strong> para los comercios de la plaza y un <strong>banner físico oficial</strong> de activación de 7 días gratis y distintivos.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECCIÓN 1: ESTACIONAMIENTO ($150 + 1 HORA GRATIS & SIMULADOR)
         ══════════════════════════════════════════════════════════════ */}
      {proposalSection === 'estacionamiento' && (
        <section style={{ padding: '1.5rem 1.2rem 3rem', maxWidth: '980px', margin: '0 auto' }}>
          {/* Tarjetas de Beneficio Directo para la Administración */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '1.2rem', borderRadius: '18px', backgroundColor: '#12141A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>💰</div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem', marginBottom: '4px' }}>Ticket Promedio Forzoso</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Para gozar de la hora, el automovilista <strong>debe demostrar una compra de al menos $150 pesos</strong> en comercios de Galerías.
              </div>
            </div>

            <div style={{ padding: '1.2rem', borderRadius: '18px', backgroundColor: '#12141A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⏱️</div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem', marginBottom: '4px' }}>Rotación Rápida de Cajones</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                La gratuidad expira exactamente a los <strong>60 minutos</strong>. Acelera visitas y libera cajones para nuevos compradores.
              </div>
            </div>

            <div style={{ padding: '1.2rem', borderRadius: '18px', backgroundColor: '#12141A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🛡️</div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.95rem', marginBottom: '4px' }}>Cero Gasto en Software</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Galerías no tiene que reprogramar sus cajeros automáticos. Toda la validación corre en la nube de Red Identidad.
              </div>
            </div>
          </div>

          {/* SIMULADOR INTERACTIVO */}
          <div style={{
            backgroundColor: '#111319',
            borderRadius: '24px',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            padding: '1.8rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-gold, #D4AF37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Prueba Interactiva
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFF', margin: '4px 0 6px' }}>
                Simulador del Control de Estacionamiento en Vivo
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
                Alterna entre la <strong>pantalla del conductor</strong> y la <strong>terminal del encargado de estacionamiento</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setSimRoleTab('conductor')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    backgroundColor: simRoleTab === 'conductor' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: simRoleTab === 'conductor' ? '#000' : '#FFF',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Smartphone size={15} /> Vista Conductor (Teléfono)
                </button>

                <button
                  type="button"
                  onClick={() => setSimRoleTab('caseta')}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    backgroundColor: simRoleTab === 'caseta' ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: simRoleTab === 'caseta' ? '#000' : '#FFF',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Building2 size={15} /> Terminal Caseta / Módulo Galerías
                </button>
              </div>
            </div>

            {/* CONTENIDO DEL SIMULADOR: VISTA CONDUCTOR */}
            {simRoleTab === 'conductor' && (
              <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                {!isTimerRunning ? (
                  <form onSubmit={handleStartParking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 800, marginBottom: '6px' }}>
                        1. Número de Folio del Boleto de Entrada:
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
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 800, marginBottom: '6px' }}>
                        2. Placa del Auto Registrado:
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
                        {validatedByBooth ? '✅ EXENCIÓN AUTORIZADA POR CASETA' : '⏳ CRONÓMETRO OFICIAL DE 60 MINUTOS'}
                      </span>

                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFF', margin: '6px 0' }}>
                        {formatTimer(remainingSeconds)}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                        {validatedByBooth 
                          ? 'Tu boleto ha sido marcado en $0.00. Tienes 15 minutos para salir por la pluma.'
                          : 'Recuerda guardar tu ticket de $150 MXN y pasar al módulo de estacionamiento antes de los 60 min.'}
                      </div>
                    </div>

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

                    <button
                      type="button"
                      onClick={() => { setIsTimerRunning(false); setValidatedByBooth(false); }}
                      style={{ width: '100%', padding: '6px', background: 'transparent', border: 'none', color: '#64748B', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Reiniciar simulador
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CONTENIDO DEL SIMULADOR: VISTA CASETA */}
            {simRoleTab === 'caseta' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Auto en Ventanilla del Módulo
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
                        <span style={{ color: '#94A3B8' }}>Calcomanía Física:</span>
                        <strong style={{ color: '#4ADE80' }}>✓ Verificada en Auto</strong>
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
                          {remainingSeconds > 0 ? `${Math.floor((3600 - remainingSeconds)/60)} min transcurridos (Válido)` : 'Excedió los 60 min'}
                        </strong>
                      </div>
                    </div>

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

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '1.2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase' }}>
                        Historial de Conciliación Diaria
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 700 }}>
                        <Download size={11} style={{ verticalAlign: 'middle' }} /> Excel
                      </span>
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
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECCIÓN 2: PABELLÓN DIGITAL GALERÍAS (ÁREA ESPECIAL VIP)
         ══════════════════════════════════════════════════════════════ */}
      {proposalSection === 'pabellon' && (
        <section style={{ padding: '1.5rem 1.2rem 3rem', maxWidth: '1020px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Exclusividad & Prestigio Comercial
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF', margin: '6px 0 10px' }}>
              Pabellón Comercial Galerías Campeche en la App
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '680px', margin: '0 auto' }}>
              Un escaparate VIP donde los socios automovilistas de Red Identidad descubren dónde realizar su compra obligatoria de <strong>$150 MXN</strong> para obtener su estacionamiento gratis.
            </p>

            {/* Filtros de Categoría */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1.2rem', flexWrap: 'wrap' }}>
              {['Todos', 'Restaurante', 'Ropa', 'Tecnología', 'Entretenimiento', 'Cafetería'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMerchantCategory(cat)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: merchantCategory === cat ? '#D4AF37' : 'rgba(255,255,255,0.06)',
                    color: merchantCategory === cat ? '#000' : '#CBD5E1',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Comercios VIP de Galerías */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.2rem' }}>
            {filteredMerchants.map((merchant) => {
              const CategoryIcon = merchant.categoryIcon;
              return (
                <div
                  key={merchant.id}
                  style={{
                    backgroundColor: '#12141C',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    padding: '1.3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Etiqueta superior */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: 'rgba(212,175,55,0.15)',
                      color: '#FFD700',
                      border: '1px solid rgba(212,175,55,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Award size={12} /> {merchant.badge}
                    </span>

                    <span style={{ fontSize: '0.68rem', color: '#4ADE80', fontWeight: 800, backgroundColor: 'rgba(74,222,128,0.15)', padding: '2px 6px', borderRadius: '6px' }}>
                      ✓ Válido Boleto $150
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        flexShrink: 0
                      }}>
                        {merchant.logo}
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
                          {merchant.name}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CategoryIcon size={12} /> {merchant.category}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.76rem', color: '#CBD5E1', lineHeight: 1.4, margin: '6px 0 12px' }}>
                      {merchant.tagline}
                    </p>

                    {/* Caja de Beneficio Exclusivo */}
                    <div style={{
                      backgroundColor: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      marginBottom: '10px'
                    }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 800, display: 'block', marginBottom: '2px' }}>
                        Beneficio Exclusivo con Calcomanía:
                      </span>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', lineHeight: 1.35 }}>
                        {merchant.discount}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: '#64748B' }}>
                    <span>📍 {merchant.location}</span>
                    <span style={{ color: 'var(--accent-gold, #D4AF37)', fontWeight: 700 }}>Galerías Campeche</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mensaje de Valor para Arrendatarios */}
          <div style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            borderRadius: '20px',
            backgroundColor: 'rgba(212,175,55,0.06)',
            border: '1.5px solid rgba(212,175,55,0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', margin: '0 0 6px' }}>
              ¿Por qué los locatarios de Galerías amarán este pabellón?
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
              Porque los automovilistas de Campeche que entran a la plaza abren la app para ver <strong>dónde gastar sus $150 pesos</strong> para salir gratis del estacionamiento. Red Identidad canaliza el dinero directamente a las cajas registradoras de los negocios participantes.
            </p>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECCIÓN 3: CONVENIO DE INTERCAMBIO (BANNER FÍSICO EN GALERÍAS)
         ══════════════════════════════════════════════════════════════ */}
      {proposalSection === 'intercambio' && (
        <section style={{ padding: '1.5rem 1.2rem 3rem', maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Intercambio Comercial (Barter Agreement)
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF', margin: '6px 0 10px' }}>
              El Intercambio: Banner Físico de Activación en la Plaza
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '680px', margin: '0 auto' }}>
              Galerías Campeche otorga un <strong>espacio publicitario preferencial</strong> para un banner roll-up de piso y Red Identidad asume toda la digitalización, soporte y promoción masiva de la plaza.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            
            {/* MOCKUP VISUAL DEL BANNER FÍSICO DE 2.00M X 0.85M */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Vista Previa del Banner de Piso (2.00 x 0.85 m)
              </span>

              {/* El Banner Vertical Físico */}
              <div style={{
                width: '100%',
                maxWidth: '340px',
                aspectRatio: '0.52',
                backgroundColor: '#0D0E12',
                borderRadius: '16px',
                border: '3px solid #D4AF37',
                padding: '1.5rem 1.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.3)',
                position: 'relative',
                background: 'linear-gradient(180deg, #161822 0%, #08090C 100%)'
              }}>
                {/* Cabecera del Banner */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>🏛️</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#FFF', letterSpacing: '0.06em' }}>GALERÍAS CAMPECHE</span>
                    <span style={{ color: '#D4AF37', fontSize: '0.8rem' }}>×</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#D4AF37' }}>RED IDENTIDAD</span>
                  </div>

                  <div style={{
                    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
                    fontWeight: 900,
                    color: '#FFF',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    marginTop: '0.8rem'
                  }}>
                    ¿YA LA TRAES?
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#D4AF37',
                    marginTop: '4px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Pase Oficial para Automovilistas
                  </div>
                </div>

                {/* Código QR Central Gigante */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '16px',
                  margin: '0.8rem auto',
                  display: 'inline-block',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <QRCodeSVG 
                    value="https://redidentidad.vercel.app/campeche/semana-gratis?source=galerias_totem" 
                    size={140}
                  />
                  <div style={{ fontSize: '0.62rem', fontWeight: 900, color: '#000', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Escanea Aquí
                  </div>
                </div>

                {/* Beneficios Destacados en el Banner */}
                <div>
                  <div style={{
                    backgroundColor: 'rgba(212,175,55,0.15)',
                    border: '1.5px solid #D4AF37',
                    borderRadius: '12px',
                    padding: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#FFD700' }}>
                      🎁 7 DÍAS GRATIS DE MEMBRESÍA
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#CBD5E1', marginTop: '2px' }}>
                      1 Hora Gratis de Estacionamiento en tu compra de $150 MXN
                    </div>
                  </div>

                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', lineHeight: 1.3 }}>
                    Descuentos inmediatos en Boston's, Sushi Roll, Deportes Martí, iShop, Cinépolis y más de 30 comercios en Campeche.
                  </div>

                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.58rem',
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Pide tu calcomanía en administración o recíbela en tu auto
                  </div>
                </div>
              </div>

              {/* Base metálica del roll-up simulada */}
              <div style={{
                width: '180px',
                height: '10px',
                backgroundColor: '#334155',
                borderRadius: '0 0 6px 6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.8)'
              }} />
            </div>

            {/* TABLA DE ACUERDO MUTUO (LO QUE APORTA CADA PARTE) */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem' }}>
                Matriz del Convenio de Intercambio
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Lo que Galerías Aporta */}
                <div style={{ backgroundColor: '#13151D', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                    <strong style={{ color: '#D4AF37', fontSize: '0.92rem' }}>Galerías Campeche aporta:</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                    <li>Espacio físico para 1 tótem/banner publicitario en pasillo central o zona de alta afluencia peatonal.</li>
                    <li>Cortesía de la 1ª hora de estacionamiento condicionada a compra de $150 MXN en sus locales.</li>
                    <li>Acceso al módulo/caseta para entrega del boleto de cortesía de $0.00 al socio verificado.</li>
                  </ul>
                </div>

                {/* Lo que Red Identidad Aporta */}
                <div style={{ backgroundColor: '#13151D', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚡</span>
                    <strong style={{ color: '#4ADE80', fontSize: '0.92rem' }}>Red Identidad aporta:</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                    <li>Producción, impresión y montaje del banner físico de alta calidad sin costo para la plaza.</li>
                    <li>Pabellón Digital Exclusivo en la App para promover los comercios de Galerías ante miles de conductores.</li>
                    <li>Sistema en la nube y control de tiempo anti-fraude (cero inversión de software para Galerías).</li>
                    <li>Campañas en redes sociales impulsando el consumo dentro de Galerías Campeche.</li>
                  </ul>
                </div>
              </div>

              {/* Botón de acción */}
              <div style={{ marginTop: '1.5rem' }}>
                <a
                  href="https://wa.me/529811971305?text=Buenas%20tardes,%20revisamos%20el%20convenio%20de%20intercambio%20(Banner%20físico%20en%20plaza%20+%20Pabellón%20Comercial)%20y%20deseamos%20afinar%20detalles."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.85rem 1.4rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--accent-gold, #D4AF37)',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
                  }}
                >
                  <MessageCircle size={16} /> Confirmar Ubicación del Banner
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER Y CIERRE EJECUTIVO ── */}
      <footer style={{
        backgroundColor: '#0E1016',
        borderTop: '1px solid rgba(212,175,55,0.25)',
        padding: '2.5rem 1.2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFF', margin: '0 0 0.5rem' }}>
            Alianza Estratégica Lista para Firma
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.45 }}>
            Podemos iniciar con una fase piloto inmediata de 15 días instalando el banner y activando a los primeros 100 automovilistas para medir el impacto en ventas en Galerías Campeche.
          </p>

          <a
            href="https://wa.me/529811971305?text=Estimado%20equipo%20de%20Red%20Identidad,%20revisamos%20la%20propuesta%20integral%20de%20Galerías%20Campeche%20y%20deseamos%20reunirnos%20para%20activar%20el%20piloto."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.95rem 1.8rem',
              borderRadius: '16px',
              backgroundColor: 'var(--accent-gold, #D4AF37)',
              color: '#000',
              fontWeight: 900,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.45)'
            }}
          >
            <MessageCircle size={17} /> Agendar Cita con Dirección Red Identidad
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
