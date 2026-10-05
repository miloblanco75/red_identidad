import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Printer, ArrowLeft, BookOpen, ShieldCheck, QrCode, Store, Smartphone, 
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, FileText, Share2
} from 'lucide-react';

export const JuarezManual: React.FC = () => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Manual de Uso y Operaciones — Vive Juárez',
      text: 'Guía oficial para comercios aliados, operadores y clientes de Red Identidad Vive Juárez.',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share error or cancelled', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace del manual copiado al portapapeles!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0B0E',
      color: '#F3F4F6',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Barra de Controles Superior - No Imprimible */}
      <header className="no-print" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(15, 15, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              padding: '0.5rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
              Manual de Uso — Vive Juárez
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
              Documento Oficial • Formato Imprimible Tamaño Carta
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              padding: '0.55rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Share2 size={15} /> Compartir
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#DC2626',
              border: 'none',
              color: '#FFF',
              padding: '0.55rem 1.2rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
            }}
          >
            <Printer size={16} /> Imprimir / Guardar PDF
          </button>
        </div>
      </header>

      {/* Contenedor Principal del Documento */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem 1.5rem'
      }}>
        <article 
          id="printable-juarez-manual"
          style={{
            backgroundColor: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            fontSize: '0.92rem',
            lineHeight: 1.65
          }}
        >
          {/* Membrete Oficial */}
          <div style={{
            borderBottom: '2.5px solid #EF4444',
            paddingBottom: '1.2rem',
            marginBottom: '1.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FCA5A5', fontWeight: 800 }}>
                RED IDENTIDAD • SISTEMA DE BENEFICIOS Y LEALTAD
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '4px 0', color: '#FFF' }}>
                🌵 MANUAL DE OPERACIONES — CIUDAD JUÁREZ
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Versión Oficial 2.0 • Plaza Fronteriza Ciudad Juárez, Chihuahua • Vigencia 2026
              </div>
            </div>
            <div style={{
              padding: '0.6rem 1.1rem',
              backgroundColor: 'rgba(239,68,68,0.12)',
              border: '1.5px solid #EF4444',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#FCA5A5', textTransform: 'uppercase', fontWeight: 800 }}>LOTE AUTORIZADO</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFF' }}>VJ-0001 a VJ-1000</div>
            </div>
          </div>

          {/* MÓDULO 1: INTRODUCCIÓN Y MODELO DE NEGOCIO */}
          <section style={{ marginBottom: '2.2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <BookOpen size={20} color="#EF4444" /> 1. ¿Qué es Red Identidad Vive Juárez?
            </h3>
            <p>
              <strong>Red Identidad Vive Juárez</strong> es una plataforma digital de lealtad y descuentos directos creada para impulsar el consumo en comercios locales de Ciudad Juárez.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.1rem' }}>
                <strong style={{ color: '#FCA5A5', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>💳 Para los Clientes</strong>
                Acceso a descuentos inmediatos de hasta 15% en restaurantes, cafeterías, talleres y comercios aliados en toda la ciudad por solo <strong>$80 MXN al año</strong>.
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.1rem' }}>
                <strong style={{ color: '#4ADE80', display: 'block', marginBottom: '4px', fontSize: '1rem' }}>🏪 Para los Comercios Aliados</strong>
                Publicidad permanente en la aplicación móvil, atracción de nuevos clientes frecuentes y sistema digital para validar membresías en mostrador con PIN único y sin costo de terminal.
              </div>
            </div>
          </section>

          {/* MÓDULO 2: CAMPAÑA SEMANA GRATIS (7 DÍAS) */}
          <section style={{ marginBottom: '2.2rem', padding: '1.4rem', borderRadius: '18px', backgroundColor: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.6rem 0' }}>
              <Sparkles size={20} color="#EF4444" /> 2. Campaña de Lanzamiento: 7 Días de Membresía Gratis
            </h3>
            <p style={{ margin: 0, marginBottom: '0.8rem' }}>
              Durante la semana de arranque, los negocios aliados colocan en su mostrador el <strong>Cartel Oficial con Código QR</strong>. Cualquier cliente que visite el negocio puede escanearlo y llevarse su membresía de cortesía:
            </p>
            <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Paso 1 — Escaneo en Mostrador:</strong> El cliente apunta con la cámara de su celular al cartel del comercio (o ingresa a <code style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#FCA5A5' }}>/juarez/semana-gratis</code>).
              </li>
              <li>
                <strong>Paso 2 — Registro Rápido:</strong> Escribe su nombre completo y su número de WhatsApp (10 dígitos).
              </li>
              <li>
                <strong>Paso 3 — Activación Inmediata:</strong> Al instante la pantalla le entrega su <strong>Pase de Cortesía con reloj en vivo</strong> y contador de 7 días restantes.
              </li>
              <li>
                <strong>Paso 4 — Candado Anti-Duplicados:</strong> El sistema está blindado por número celular. Si un usuario intenta volver a registrarse, el sistema no duplica la cuenta: le muestra su pase existente con el tiempo restante exacto.
              </li>
              <li>
                <strong>Paso 5 — Conversión a Membresía Anual:</strong> Al concluir los 7 días, el pase expira automáticamente y redirige al usuario al área de compra para adquirir la membresía anual digital por <strong>$80 MXN</strong>.
              </li>
            </ol>
          </section>

          {/* MÓDULO 3: VALIDACIÓN EN COMERCIOS (CÓMO COBRAR / APLICAR DESCUENTO) */}
          <section style={{ marginBottom: '2.2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <Store size={20} color="#EF4444" /> 3. ¿Cómo valida el Comercio Aliado a un Cliente?
            </h3>
            <p>
              El personal de caja o mostrador de cada negocio tiene dos formas fáciles y rápidas de validar que un cliente tiene membresía activa:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.2rem' }}>
                <strong style={{ fontSize: '1rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={18} color="#4ADE80" /> Opción A: Escaneo con Cámara
                </strong>
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>El cajero entra en su celular a <code style={{ color: '#4ADE80' }}>redidentidad.vercel.app/comercio</code> con su PIN de aliado.</li>
                  <li>Pulsa el botón <strong>"Escanear QR de Cliente"</strong>.</li>
                  <li>Apunta al código QR que el cliente muestra en la pantalla de su teléfono.</li>
                  <li>La pantalla se pondrá <strong>VERDE en grande</strong> con el descuento a aplicar en la cuenta.</li>
                </ol>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.2rem' }}>
                <strong style={{ fontSize: '1rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <QrCode size={18} color="#38BDF8" /> Opción B: Validación Manual (Sin cámara)
                </strong>
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>Si la cámara no está disponible, el cajero escribe el <strong>código del cliente</strong> (ej. <code>VJ-0035</code> o <code>0035</code>) o su <strong>número de WhatsApp</strong>.</li>
                  <li>Presiona <strong>"Validar"</strong>.</li>
                  <li>El sistema confirma si la membresía está vigente y autoriza el beneficio de inmediato.</li>
                </ol>
              </div>
            </div>

            {/* Señales en pantalla */}
            <div style={{ marginTop: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.9rem 1.1rem', borderRadius: '12px', backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="#4ADE80" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem' }}><strong>PANTALLA VERDE:</strong> Membresía válida y vigente. Aplica el descuento pactado.</span>
              </div>
              <div style={{ padding: '0.9rem 1.1rem', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={24} color="#EF4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem' }}><strong>PANTALLA ROJA:</strong> Membresía vencida o no activada. Invita al cliente a renovar.</span>
              </div>
            </div>
          </section>

          {/* MÓDULO 4: GESTIÓN DE CÓDIGOS VJ (PARA EL OPERADOR EN JUÁREZ) */}
          <section style={{ marginBottom: '2.2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <ShieldCheck size={20} color="#EF4444" /> 4. Operación del Panel Local (Socio Juárez)
            </h3>
            <p>
              El operador local de Ciudad Juárez cuenta con su propio acceso al sistema para gestionar el primer lote de <strong>1,000 membresías digitales asignadas (VJ-0001 a VJ-1000)</strong>:
            </p>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.3rem' }}>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <li>
                  <strong>Ingreso al Panel:</strong> Entra a <code style={{ color: '#FCA5A5' }}>redidentidad.vercel.app/admin</code> e introduce el PIN de Operador Juárez: <strong><code>JUAREZ2024</code></strong>.
                </li>
                <li>
                  <strong>Pestaña "Estatus QR Juárez":</strong> Monitorea en vivo cuántos códigos se han entregado, cuántos ya fueron activados por clientes y cuántos siguen libres.
                </li>
                <li>
                  <strong>Entrega por WhatsApp en 1 Clic:</strong> Junto a cada código VJ tienes el botón <strong>"WhatsApp"</strong> que redacta automáticamente el mensaje para enviarle la membresía lista al cliente.
                </li>
                <li>
                  <strong>Descarga del QR en Imagen PNG:</strong> Al pulsar <strong>"Ver QR Digital"</strong>, se genera el código en alta definición para proyectarlo en pantalla o descargarlo como archivo de imagen.
                </li>
                <li>
                  <strong>Seguridad y Monopolio de Emisión:</strong> Por seguridad de la franquicia, el operador local no puede crear nuevos códigos ni borrarlos. Cuando el lote de 1,000 se acerque a su fin, solicita a la Dirección General la emisión del siguiente lote oficial.
                </li>
              </ul>
            </div>
          </section>

          {/* MÓDULO 5: ALTA DE NUEVOS COMERCIOS ALIADOS EN JUÁREZ */}
          <section style={{ marginBottom: '2.2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <FileText size={20} color="#EF4444" /> 5. ¿Cómo dar de Alta un Nuevo Comercio Aliado?
            </h3>
            <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>En el Panel de Operador, ingresa a la pestaña <strong>"Aliados Juárez"</strong>.</li>
              <li>Escribe el <strong>Nombre del Comercio</strong> (ej. <em>Tacos El Paisa Juárez</em>) y selecciona su categoría (Comida, Salud, Belleza, etc.).</li>
              <li>Agrega las promociones o descuentos (ej. <em>15% en consumo total</em> o <em>2x1 en postres</em>).</li>
              <li>
                <strong>Ubicación en el Mapa:</strong> Pulsa el botón de acceso rápido <strong>"🌵 Ciudad Juárez (31.6904, -106.4245)"</strong> o copia las coordenadas exactas de Google Maps.
              </li>
              <li>Asigna un <strong>PIN de Comercio de 4 dígitos</strong> para que el negocio pueda validar promociones en su propia caja.</li>
              <li>Presiona <strong>"Publicar en el Mapa"</strong>. ¡El comercio aparecerá al instante en la app de todos los juarenses!</li>
            </ol>
          </section>

          {/* MÓDULO 6: PREGUNTAS FRECUENTES Y SOPORTE */}
          <section style={{ marginBottom: '1.5rem', padding: '1.3rem', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.8rem 0' }}>
              <HelpCircle size={18} color="var(--accent-gold)" /> 6. Preguntas Frecuentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--accent-gold)' }}>¿Qué pasa si el cliente cambia de celular?</strong>
                <p style={{ margin: '2px 0 0 0', color: 'var(--text-dim)' }}>
                  No pierde nada. Al abrir la app en su nuevo teléfono, escribe su mismo número de WhatsApp en la pestaña Registro y su membresía se restaura de inmediato.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-gold)' }}>¿Se pueden hacer capturas de pantalla para prestar el QR?</strong>
                <p style={{ margin: '2px 0 0 0', color: 'var(--text-dim)' }}>
                  No. La credencial digital cuenta con un reloj anti-fraude en vivo y el código QR rota con dinamismo de verificación. Si el cajero detecta una imagen estática sin segundero activo, no aplica el beneficio.
                </p>
              </div>
              <div>
                <strong style={{ color: '#EF4444' }}>🛡️ ¿Qué pasa si alguien muestra un QR ajeno o una página maliciosa?</strong>
                <p style={{ margin: '2px 0 0 0', color: 'var(--text-dim)' }}>
                  El escáner de Red Identidad está blindado con <strong>Lista Blanca de Dominios Oficiales</strong>. Nuestro sistema <strong>NO abre navegadores ni ejecuta enlaces</strong>; solo lee el código y lo valida internamente. Si detecta un enlace ajeno, sospechoso o de otra página web, lo bloquea de inmediato mostrando <strong>PANTALLA ROJA (Código Externo Bloqueado)</strong>. <em>Regla para cajeros:</em> Validar siempre dentro de la terminal oficial de Red Identidad y nunca con la cámara libre del celular.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-gold)' }}>¿Cómo imprimir el cartel de mostrador para los negocios?</strong>
                <p style={{ margin: '2px 0 0 0', color: 'var(--text-dim)' }}>
                  Ingresa a <code style={{ color: '#FCA5A5' }}>/juarez/poster-mostrador</code> desde cualquier computadora conectada a una impresora y presiona Imprimir. Está calibrado exactamente para caber en una hoja tamaño carta portrait.
                </p>
              </div>
            </div>
          </section>

          {/* Pie de página oficial del manual */}
          <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.2rem',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-dim)'
          }}>
            Red Identidad México • Dirección General de Operaciones • Ciudad Juárez & San Francisco de Campeche
          </footer>
        </article>
      </main>

      {/* Estilos para Impresión Nítida en Papel Tamaño Carta */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #printable-juarez-manual, #printable-juarez-manual * {
            visibility: visible !important;
            color: #000000 !important;
            background: transparent !important;
          }
          #printable-juarez-manual {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
          }
          #printable-juarez-manual h1, 
          #printable-juarez-manual h2, 
          #printable-juarez-manual h3,
          #printable-juarez-manual strong {
            color: #111827 !important;
          }
          #printable-juarez-manual code {
            border: 1px solid #D1D5DB !important;
            background-color: #F3F4F6 !important;
            color: #1F2937 !important;
          }
          @page {
            size: letter portrait;
            margin: 14mm 12mm 14mm 12mm;
          }
        }
      `}</style>
    </div>
  );
};

export default JuarezManual;
