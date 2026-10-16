import React, { useState, useEffect } from 'react';
import { 
  Eye, Smartphone, TrendingUp, RefreshCw, Download, 
  MapPin, Building2, Sparkles, Clock, AlertCircle
} from 'lucide-react';
import { getQrCampaignStats, type QrCampaignStats } from '../lib/qrScanService';

interface Props {
  initialCity?: 'campeche' | 'juarez' | 'all';
}

export const QrCampaignMetricsCard: React.FC<Props> = ({ initialCity = 'all' }) => {
  const [cityFilter, setCityFilter] = useState<'all' | 'campeche' | 'juarez'>(initialCity);
  const [stats, setStats] = useState<QrCampaignStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getQrCampaignStats(cityFilter);
      setStats(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error('Error al cargar métricas QR:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresco suave cada 60 segundos si el admin tiene la pantalla abierta
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [cityFilter]);

  const handleExportCsv = () => {
    if (!stats || stats.recentScans.length === 0) {
      alert('Aún no hay escaneos registrados para exportar.');
      return;
    }

    const headers = ['ID_ESCÁNEO,CIUDAD,ORIGEN_DETALLE,TIPO_CANAL,FECHA_HORA'];
    const rows = stats.recentScans.map(s => {
      const dateStr = new Date(s.timestamp).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
      return `"${s.code}","${s.city === 'juarez' ? 'Ciudad Juárez' : 'Campeche'}","${s.sourceLabel}","${s.source}","${dateStr}"`;
    });

    const csvContent = [headers.join('\n'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metricas_escaneos_qr_${cityFilter}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #18181B 0%, #0F0F12 100%)',
      border: '1.5px solid rgba(245, 158, 11, 0.35)',
      borderRadius: '20px',
      padding: '1.5rem',
      color: '#FFFFFF',
      boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
      marginBottom: '2rem'
    }}>
      {/* Encabezado con estado en vivo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '1rem',
        marginBottom: '1.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#121212',
            fontWeight: 900
          }}>
            <Eye size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFF' }}>
                Métricas en Vivo: Campaña "¿YA LA TRAES?"
              </h4>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#4ADE80',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  animation: 'pulse 2s infinite'
                }}></span>
                EN VIVO
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#9CA3AF' }}>
              Rastreo automático de cada persona que abre el QR con su cámara (incluye los stickers ya pegados en la calle).
            </p>
          </div>
        </div>

        {/* Filtros y Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {(['all', 'campeche', 'juarez'] as const).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCityFilter(c)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: cityFilter === c ? 800 : 500,
                  cursor: 'pointer',
                  backgroundColor: cityFilter === c ? '#F59E0B' : 'transparent',
                  color: cityFilter === c ? '#121212' : '#9CA3AF',
                  transition: 'all 0.15s ease'
                }}
              >
                {c === 'all' ? 'Todas' : c === 'campeche' ? 'Campeche' : 'Cd. Juárez'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            title="Refrescar métricas ahora"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            title="Descargar bitácora en Excel/CSV"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#FCD34D',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Download size={13} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas Clave */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.9rem',
        marginBottom: '1.4rem'
      }}>
        {/* Total Escaneos */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '1rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Escaneos de Cámara
            </span>
            <Eye size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#FFF', margin: '6px 0 2px' }}>
            {stats?.totalScans ?? 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={11} /> Personas abrieron el QR
          </span>
        </div>

        {/* Escaneos en Calle (Stickers Pegados) */}
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '14px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stickers en Calle / Paradas
            </span>
            <MapPin size={16} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#93C5FD', margin: '6px 0 2px' }}>
            {stats?.streetScans ?? 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#BFDBFE' }}>
            Pegados físicamente sin cambios
          </span>
        </div>

        {/* Escaneos Galerías Campeche */}
        <div style={{
          backgroundColor: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '14px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#D8B4FE', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Galerías Campeche
            </span>
            <Building2 size={16} color="#C084FC" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#E9D5FF', margin: '6px 0 2px' }}>
            {stats?.galeriasScans ?? 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#D8B4FE' }}>
            Banner / Tótem en Plaza
          </span>
        </div>

        {/* Membresías Activadas & Tasa de Conversión */}
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '14px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#86EFAC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pases 7D Activados
            </span>
            <Smartphone size={16} color="#4ADE80" />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#4ADE80', margin: '6px 0 2px' }}>
            {stats?.totalTrials ?? 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#A7F3D0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> {stats?.conversionRate ?? '0.0%'} de conversión
          </span>
        </div>
      </div>

      {/* Explicación de cómo funciona el rastreo con los stickers ya pegados */}
      <div style={{
        backgroundColor: 'rgba(245, 158, 11, 0.06)',
        border: '1px dashed rgba(245, 158, 11, 0.3)',
        borderRadius: '12px',
        padding: '0.8rem 1rem',
        marginBottom: '1.2rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <AlertCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.78rem', color: '#E5E7EB', lineHeight: 1.45 }}>
          <strong style={{ color: '#FCD34D' }}>Stickers Físicos en la Calle: </strong>
          No tuviste que reimprimir nada. Cualquier calcomanía que ya esté pegada en paradas o postes dirige a la página oficial; cuando la persona apunta su cámara, el sistema la reconoce como <span style={{ color: '#60A5FA', fontWeight: 700 }}>"Sticker en Calle"</span> y la suma automáticamente aquí en milisegundos.
        </div>
      </div>

      {/* Bitácora de Últimos Escaneos en Vivo */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.6rem'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E5E7EB', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#9CA3AF" />
            Últimos Escaneos Registrados ({stats?.recentScans.length ?? 0})
          </span>
          <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
            Actualizado: {lastUpdated.toLocaleTimeString('es-MX')}
          </span>
        </div>

        {stats && stats.recentScans.length > 0 ? (
          <div style={{
            overflowX: 'auto',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(0,0,0,0.25)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '8px 12px' }}>Folio Evento</th>
                  <th style={{ padding: '8px 12px' }}>Ciudad</th>
                  <th style={{ padding: '8px 12px' }}>Canal de Captura</th>
                  <th style={{ padding: '8px 12px' }}>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentScans.map((scan) => {
                  const dateStr = new Date(scan.timestamp).toLocaleString('es-MX', { 
                    dateStyle: 'short', 
                    timeStyle: 'medium',
                    timeZone: 'America/Mexico_City'
                  });
                  const isGalerias = scan.source.includes('galeria');
                  const isCalle = scan.source.includes('calle') || scan.source.includes('parada');

                  return (
                    <tr key={scan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#FCD34D' }}>
                        {scan.code}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          padding: '2px 7px',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: scan.city === 'juarez' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: scan.city === 'juarez' ? '#FCA5A5' : '#93C5FD'
                        }}>
                          {scan.city === 'juarez' ? 'Cd. Juárez' : 'Campeche'}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: isGalerias ? '#C084FC' : isCalle ? '#60A5FA' : '#E5E7EB',
                          fontWeight: 600
                        }}>
                          {isGalerias ? <Building2 size={13} /> : isCalle ? <MapPin size={13} /> : <Sparkles size={13} />}
                          {scan.sourceLabel}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', color: '#9CA3AF' }}>
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '1.8rem',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '10px',
            color: '#6B7280',
            fontSize: '0.8rem'
          }}>
            Aún no se registran escaneos en este filtro. En cuanto un usuario apunte su cámara a los stickers, aparecerá aquí inmediatamente.
          </div>
        )}
      </div>
    </div>
  );
};
