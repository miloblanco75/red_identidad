import React, { useState, useEffect } from 'react';
import { Crown, Printer, RefreshCw, Copy, Check, Download, Trash2, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import StickerQRCode from './StickerQRCode';

export interface PressPass {
  id?: string;
  code: string;
  member_number: number;
  level: string;
  phone: string | null;
  claimed_at: string | null;
}

export const PressPassesManager: React.FC = () => {
  const [passes, setPasses] = useState<PressPass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://redidentidad.vercel.app';

  // 1. Cargar pases de prensa desde Supabase
  const fetchPressPasses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stickers')
        .select('*')
        .or('code.ilike.PRENSA-%,level.eq.prensa')
        .order('code', { ascending: true });

      if (error) throw error;
      setPasses(data || []);
    } catch (err: any) {
      console.error('Error al cargar pases de prensa:', err);
      setFeedback('Error al consultar los pases de prensa: ' + (err.message || 'Verifica la conexión.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPressPasses();
  }, []);

  // 2. Generar o sincronizar los 25 códigos exactos (PRENSA-001 a PRENSA-025)
  const handleGenerate25Passes = async () => {
    setIsGenerating(true);
    setFeedback(null);
    try {
      // Consultar existentes para no duplicar
      const { data: existing, error: fetchErr } = await supabase
        .from('stickers')
        .select('code')
        .or('code.ilike.PRENSA-%,level.eq.prensa');

      if (fetchErr) throw fetchErr;

      const existingCodes = new Set((existing || []).map(p => (p.code || '').toUpperCase()));
      const toInsert: any[] = [];

      for (let i = 1; i <= 25; i++) {
        const code = `PRENSA-${String(i).padStart(3, '0')}`;
        if (!existingCodes.has(code)) {
          toInsert.push({
            code,
            member_number: 900 + i, // Número de socio honorífico 901 a 925
            level: 'prensa',
            phone: null,
            claimed_at: null
          });
        }
      }

      if (toInsert.length > 0) {
        const { error: insertErr } = await supabase.from('stickers').insert(toInsert);
        if (insertErr) throw insertErr;
        setFeedback(`¡Se crearon ${toInsert.length} pases de prensa con éxito! Lote de 25 completo.`);
      } else {
        setFeedback('Los 25 pases de prensa ya se encuentran registrados en la base de datos.');
      }

      await fetchPressPasses();
    } catch (err: any) {
      console.error('Error al generar pases de prensa:', err);
      setFeedback('Error al generar pases: ' + (err.message || 'Verifica los permisos en Supabase.'));
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Reiniciar / Liberar un pase individual
  const handleResetPass = async (pass: PressPass) => {
    if (!confirm(`¿Deseas reiniciar el pase ${pass.code}? Su teléfono y fecha de canje serán eliminados para que pueda volver a ser entregado.`)) {
      return;
    }
    try {
      const { error } = await supabase
        .from('stickers')
        .update({ phone: null, claimed_at: null })
        .eq('code', pass.code);

      if (error) throw error;
      setFeedback(`El pase ${pass.code} ha sido liberado exitosamente.`);
      await fetchPressPasses();
    } catch (err: any) {
      alert('Error al reiniciar pase: ' + err.message);
    }
  };

  // 4. Copiar enlace de activación
  const handleCopyLink = (code: string) => {
    const link = `${origin}/registro?c=${code}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // 5. Exportar CSV
  const handleExportCSV = () => {
    if (passes.length === 0) return;
    const rows = [
      ['Folio', 'Estado', 'WhatsApp Canjeado', 'Fecha de Activacion', 'Enlace Directo'],
      ...passes.map(p => [
        p.code,
        p.phone ? 'CANJEADO' : 'DISPONIBLE',
        p.phone || 'Sin canjear',
        p.claimed_at ? new Date(p.claimed_at).toLocaleString('es-MX') : 'N/A',
        `${origin}/registro?c=${p.code}`
      ])
    ];

    const csvContent = '\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pases_prensa_red_identidad_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const claimedCount = passes.filter(p => !!p.phone).length;
  const availableCount = passes.filter(p => !p.phone).length;

  return (
    <div style={{ color: '#FFF' }}>
      {/* Estilos para impresión de las 25 tarjetas en Hoja Carta / A4 */}
      <style>{`
        @media print {
          html, body {
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          header, nav, footer, button, input, select, .no-print, .admin-header, .admin-tabs {
            display: none !important;
          }
          body, #root, #root > div, main {
            visibility: visible !important;
            background: #FFFFFF !important;
          }
          #press-cards-print-area {
            display: grid !important;
            grid-template-columns: repeat(2, 8.5cm) !important;
            gap: 0.6cm !important;
            padding: 0.8cm !important;
            justify-content: center !important;
            background: #FFFFFF !important;
            color: #000000 !important;
            visibility: visible !important;
          }
          .press-card-item {
            width: 8.5cm !important;
            height: 5.5cm !important;
            border: 1.5px dashed #555555 !important;
            border-radius: 8px !important;
            padding: 0.4cm !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          @page {
            size: letter portrait;
            margin: 0.5cm;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(20, 20, 25, 0.9) 100%)',
        border: '1.5px solid #F59E0B',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1.5px solid #F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={28} color="#F59E0B" />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
              🎙️ 25 Pases VIP de Prensa (Lanzamiento)
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
              Lote cerrado de cortesías digitales de uso único para reporteros, medios e invitados de honor.
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="no-print" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={fetchPressPasses}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Actualizar
          </button>

          {passes.length < 25 && (
            <button
              onClick={handleGenerate25Passes}
              disabled={isGenerating}
              style={{
                padding: '0.75rem 1.2rem',
                borderRadius: '12px',
                backgroundColor: '#F59E0B',
                border: 'none',
                color: '#121212',
                fontWeight: 900,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Sparkles size={16} />
              {isGenerating ? 'Generando...' : 'Generar los 25 Pases en Supabase'}
            </button>
          )}

          {passes.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid #38BDF8',
                  color: '#38BDF8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Download size={16} /> Exportar Excel
              </button>

              <button
                onClick={() => window.print()}
                style={{
                  padding: '0.75rem 1.3rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-gold)',
                  border: 'none',
                  color: '#121212',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                }}
              >
                <Printer size={18} /> Imprimir Tarjetas VIP (25)
              </button>
            </>
          )}
        </div>
      </div>

      {feedback && (
        <div style={{
          backgroundColor: feedback.includes('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          border: feedback.includes('Error') ? '1px solid #EF4444' : '1px solid #22C55E',
          color: feedback.includes('Error') ? '#FCA5A5' : '#86EFAC',
          borderRadius: '12px',
          padding: '0.9rem 1.2rem',
          marginBottom: '1.5rem',
          fontSize: '0.88rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {feedback.includes('Error') ? <AlertCircle size={18} /> : <Check size={18} />}
          {feedback}
        </div>
      )}

      {/* Contadores */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            Total Autorizados
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>
            {passes.length} / 25
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#4ADE80', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            🟢 Disponibles para Entregar
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4ADE80' }}>
            {availableCount}
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#FBBF24', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
            🔴 Canjeados por Periodistas
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FBBF24' }}>
            {claimedCount}
          </div>
        </div>
      </div>

      {/* Switcher de Vista */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: viewMode === 'cards' ? '#F59E0B' : 'transparent',
              color: viewMode === 'cards' ? '#121212' : '#FFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            📇 Vista de Tarjetas VIP ({passes.length})
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: viewMode === 'table' ? '#F59E0B' : 'transparent',
              color: viewMode === 'table' ? '#121212' : '#FFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            📊 Bitácora de Canjes
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          💡 Cada pase de prensa es de <strong>uso único estricto</strong>. Una vez canjeado con WhatsApp, nadie más puede usarlo.
        </div>
      </div>

      {passes.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Crown size={48} color="#F59E0B" style={{ opacity: 0.6, marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>Aún no se han generado los 25 Pases de Prensa</h3>
          <p style={{ color: 'var(--text-dim)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.88rem' }}>
            Haz clic en el botón de abajo para inicializar el lote oficial de los 25 códigos únicos (PRENSA-001 al PRENSA-025) en Supabase.
          </p>
          <button
            onClick={handleGenerate25Passes}
            disabled={isGenerating}
            style={{
              padding: '0.9rem 1.8rem',
              backgroundColor: '#F59E0B',
              color: '#121212',
              fontWeight: 900,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {isGenerating ? 'Generando...' : 'Generar los 25 Pases Oficiales Ahora'}
          </button>
        </div>
      )}

      {/* VISTA 1: TARJETAS VIP (Pantalla y Modo Impresión) */}
      <div id="press-cards-print-area" style={{
        display: viewMode === 'cards' ? 'grid' : 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.2rem',
        marginBottom: '2rem'
      }}>
        {passes.map(pass => {
          const directUrl = `${origin}/registro?c=${pass.code}`;
          const isClaimed = !!pass.phone;

          return (
            <div
              key={pass.code}
              className="press-card-item"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderRadius: '16px',
                padding: '1.2rem',
                border: isClaimed ? '2px solid #CBD5E1' : '2px solid #F59E0B',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                boxSizing: 'border-box',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Información izquierda */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    backgroundColor: '#1E293B',
                    color: '#FBBF24',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em'
                  }}>
                    🎙️ PRENSA OFICIAL
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>
                    RED IDENTIDAD
                  </span>
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: '2px 0 4px' }}>
                  {pass.code}
                </div>

                <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#475569', lineHeight: 1.3 }}>
                  Membresía Digital Oficial de cortesía para cobertura del Lanzamiento.
                </p>

                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#334155' }}>
                  {isClaimed ? (
                    <span style={{ color: '#DC2626', fontWeight: 900 }}>
                      🔴 Canjeado ({pass.phone?.slice(0, 2)}••••{pass.phone?.slice(-4)})
                    </span>
                  ) : (
                    <span style={{ color: '#16A34A', fontWeight: 900 }}>
                      🟢 Pase Disponible • Uso Único
                    </span>
                  )}
                </div>

                {/* Botones de acción en pantalla (ocultos en impresión) */}
                <div className="no-print" style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleCopyLink(pass.code)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      color: '#334155',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Copiar enlace para WhatsApp"
                  >
                    {copiedCode === pass.code ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                    {copiedCode === pass.code ? 'Copiado' : 'Copiar'}
                  </button>

                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      color: '#334155',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none'
                    }}
                    title="Probar enlace"
                  >
                    <ExternalLink size={12} /> Probar
                  </a>

                  {isClaimed && (
                    <button
                      onClick={() => handleResetPass(pass)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #FCA5A5',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Liberar pase para volver a usar"
                    >
                      <Trash2 size={12} /> Liberar
                    </button>
                  )}
                </div>
              </div>

              {/* QR en el lado derecho */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  padding: '6px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <StickerQRCode value={directUrl} size={90} />
                </div>
                <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Escanea con tu Celular
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* VISTA 2: TABLA DE MONITOREO Y CANJES */}
      {viewMode === 'table' && passes.length > 0 && (
        <div className="no-print" style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem' }}>Folio</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>WhatsApp Canjeado</th>
                <th style={{ padding: '1rem' }}>Fecha de Canje</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {passes.map(p => {
                const isClaimed = !!p.phone;
                return (
                  <tr key={p.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 900, color: '#FFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Crown size={16} color="#F59E0B" />
                        {p.code}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {isClaimed ? (
                        <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                          🔴 Canjeado
                        </span>
                      ) : (
                        <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#86EFAC', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                          🟢 Disponible
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', color: isClaimed ? '#FFF' : 'var(--text-dim)' }}>
                      {p.phone ? p.phone : '—'}
                    </td>
                    <td style={{ padding: '1rem', color: isClaimed ? 'var(--text-dim)' : 'rgba(255,255,255,0.2)' }}>
                      {p.claimed_at ? new Date(p.claimed_at).toLocaleString('es-MX') : '—'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleCopyLink(p.code)}
                          style={{
                            padding: '6px 10px',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '8px',
                            color: '#FFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {copiedCode === p.code ? '✓ Copiado' : 'Copiar Link'}
                        </button>
                        {isClaimed && (
                          <button
                            onClick={() => handleResetPass(p)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '8px',
                              color: '#F87171',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Liberar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PressPassesManager;
