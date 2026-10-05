import React from 'react';
import { 
  X, Printer, BookOpen, ShieldCheck, QrCode, Store, Smartphone, 
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, FileText
} from 'lucide-react';

interface JuarezManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JuarezManualModal: React.FC<JuarezManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="manual-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="manual-modal-container"
        style={{
          backgroundColor: '#121216',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(239,68,68,0.15)',
          overflow: 'hidden',
          color: '#F3F4F6'
        }}
      >
        {/* Header no imprimible en pantalla / barra de controles */}
        <div 
          className="no-print"
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(20,20,26,0.95)',
            flexWrap: 'wrap',
            gap: '0.8rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🌵</span>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                Manual de Uso y Operaciones — Vive Juárez
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Guía completa para Socios, Administradores, Comercios Aliados y Clientes
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#DC2626',
                color: '#FFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(220,38,38,0.4)'
              }}
            >
              <Printer size={16} /> Imprimir / Guardar PDF
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contenido del Manual (Scrollable en pantalla, fluido en papel) */}
        <div 
          id="printable-juarez-manual"
          style={{
            padding: '2rem',
            overflowY: 'auto',
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: '#E5E7EB'
          }}
        >
          {/* Portada / Membrete Oficial */}
          <div style={{
            borderBottom: '2px solid #EF4444',
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
                RED IDENTIDAD • SISTEMA DE LEALTAD Y BENEFICIOS
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0', color: '#FFF' }}>
                🌵 MANUAL DE OPERACIONES — CIUDAD JUÁREZ
              </h1>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Versión Oficial 2.0 • Plaza Fronteriza Ciudad Juárez, Chihuahua • Vigencia 2026
              </div>
            </div>
            <div style={{
              padding: '0.6rem 1rem',
              backgroundColor: 'rgba(239,68,68,0.12)',
              border: '1.5px solid #EF4444',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#FCA5A5', textTransform: 'uppercase', fontWeight: 800 }}>LOTE AUTORIZADO</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFF' }}>VJ-0001 a VJ-1000</div>
            </div>
          </div>

          {/* MÓDULO 1: INTRODUCCIÓN Y MODELO DE NEGOCIO */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <BookOpen size={20} color="#EF4444" /> 1. ¿Qué es Red Identidad Vive Juárez?
            </h3>
            <p>
              <strong>Red Identidad Vive Juárez</strong> es una plataforma digital de lealtad y descuentos directos creada para incentivar el consumo en comercios locales de Ciudad Juárez.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1rem' }}>
                <strong style={{ color: '#FCA5A5', display: 'block', marginBottom: '4px' }}>💳 Para los Clientes</strong>
                Acceso a descuentos inmediatos de hasta 15% en restaurantes, cafeterías, talleres y comercios aliados en toda la ciudad por solo <strong>$80 MXN al año</strong>.
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1rem' }}>
                <strong style={{ color: '#4ADE80', display: 'block', marginBottom: '4px' }}>🏪 Para los Comercios Aliados</strong>
                Publicidad gratuita en la aplicación móvil, aumento de clientes frecuentes y sistema digital para validar membresías en mostrador con PIN único y sin costo de terminal.
              </div>
            </div>
          </section>

          {/* MÓDULO 2: CAMPAÑA SEMANA GRATIS (7 DÍAS) */}
          <section style={{ marginBottom: '2rem', padding: '1.3rem', borderRadius: '18px', backgroundColor: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.6rem 0' }}>
              <Sparkles size={20} color="#EF4444" /> 2. Campaña de Lanzamiento: 7 Días de Membresía Gratis
            </h3>
            <p style={{ margin: 0, marginBottom: '0.8rem' }}>
              Durante la semana de arranque, los negocios aliados tienen en su mostrador el <strong>Cartel Oficial con Código QR</strong>. Cualquier cliente que visite el negocio puede escanearlo y llevarse su membresía de cortesía.
            </p>
            <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Paso 1 — Escaneo en Mostrador:</strong> El cliente apunta con la cámara de su celular al cartel del comercio (o ingresa a <code style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#FCA5A5' }}>/juarez/semana-gratis</code>).
              </li>
              <li>
                <strong>Paso 2 — Registro Rápido:</strong> Escribe su nombre y su número de WhatsApp (10 dígitos).
              </li>
              <li>
                <strong>Paso 3 — Activación Inmediata:</strong> Al instante la pantalla le entrega su <strong>Pase de Cortesía con reloj en vivo</strong> y contador de 7 días restantes.
              </li>
              <li>
                <strong>Paso 4 — Candado Anti-Duplicados:</strong> El sistema está protegido por número celular. Si un usuario intenta volver a registrarse, el sistema no duplica la cuenta: le muestra su pase existente con el tiempo restante.
              </li>
              <li>
                <strong>Paso 5 — Conversión a Membresía Anual:</strong> Al concluir los 7 días, el pase expira automáticamente y redirige al usuario al área de compra para adquirir la membresía anual digital por <strong>$80 MXN</strong>.
              </li>
            </ol>
          </section>

          {/* MÓDULO 3: VALIDACIÓN EN COMERCIOS (CÓMO COBRAR / APLICAR DESCUENTO) */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
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
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>Si el cliente dejó el auto afuera o la cámara está ocupada, el cajero puede escribir el <strong>código del cliente</strong> (ej. <code>VJ-0035</code> o <code>0035</code>) o su <strong>número de WhatsApp</strong>.</li>
                  <li>Presiona <strong>"Validar"</strong>.</li>
                  <li>El sistema confirma si la membresía está vigente y autoriza el beneficio de inmediato.</li>
                </ol>
              </div>
            </div>

            {/* Señales en pantalla */}
            <div style={{ marginTop: '1.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.8rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={24} color="#4ADE80" />
                <span style={{ fontSize: '0.82rem' }}><strong>PANTALLA VERDE:</strong> Membresía válida y vigente. Aplica el descuento pactado.</span>
              </div>
              <div style={{ padding: '0.8rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={24} color="#EF4444" />
                <span style={{ fontSize: '0.82rem' }}><strong>PANTALLA ROJA:</strong> Membresía vencida o no activada. Invita al cliente a renovar.</span>
              </div>
            </div>
          </section>

          {/* MÓDULO 4: GESTIÓN DE CÓDIGOS VJ (PARA EL OPERADOR EN JUÁREZ) */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
              <ShieldCheck size={20} color="#EF4444" /> 4. Operación del Panel Local (Socio Juárez)
            </h3>
            <p>
              El operador local de Ciudad Juárez cuenta con su propio acceso al sistema para gestionar el primer lote de <strong>1,000 membresías digitales asignadas (VJ-0001 a VJ-1000)</strong>:
            </p>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem' }}>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
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
          <section style={{ marginBottom: '1.5rem', padding: '1.2rem', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 0.8rem 0' }}>
              <HelpCircle size={18} color="var(--accent-gold)" /> 6. Preguntas Frecuentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: 'var(--accent-gold)' }}>¿Qué pasa si el cliente cambia de celular?</strong>
                <p style={{ margin: '2px 0 0 0', color: 'var(--text-dim)' }}>
                  No pierde nada. Al abrir la app en su nuevo teléfono, escribe su mismo número de WhatsApp en la pestaña Registro y su membresía se restaura de inmediato.
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-gold)' }}>¿Se pueden hacer capturas de pantalla para prestar el QR?</strong>
                <p style={{ margin: '2px 0 0 0', color: 'var(--text-dim)' }}>
                  No. La credencial digital cuenta con un reloj anti-fraude en vivo y el código QR rota criptográficamente cada 60 segundos. Si el cajero detecta una imagen estática sin segundero activo, no aplica el beneficio.
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
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-dim)'
          }}>
            Red Identidad México • Dirección General de Operaciones • Ciudad Juárez & San Francisco de Campeche
          </div>
        </div>
      </div>

      {/* Estilos específicos para Impresión en Papel */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .manual-modal-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            z-index: 999999 !important;
          }
          .manual-modal-container {
            border: none !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            max-width: 100% !important;
            max-height: none !important;
            border-radius: 0 !important;
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-juarez-manual, #printable-juarez-manual * {
            visibility: visible !important;
            color: #000000 !important;
            background: transparent !important;
          }
          #printable-juarez-manual h1, 
          #printable-juarez-manual h2, 
          #printable-juarez-manual h3,
          #printable-juarez-manual strong {
            color: #111827 !important;
          }
          #printable-juarez-manual code {
            border: 1px solid #D1D5DB !important;
            color: #1F2937 !important;
          }
          @page {
            size: letter portrait;
            margin: 15mm 12mm 15mm 12mm;
          }
        }
      `}</style>
    </div>
  );
};

export default JuarezManualModal;
