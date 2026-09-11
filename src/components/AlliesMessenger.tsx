import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, Phone, ExternalLink, Save, CheckCircle2, 
  Search, RefreshCw, Store, AlertCircle, Edit2, Sparkles, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface AllyContact {
  id: string;
  name: string;
  category?: string;
  address?: string;
  phone?: string;
  facebook?: string;
  notes?: string;
  isOfficialStore?: boolean;
}

// Puntos de venta oficiales preconfigurados para Campeche
const DEFAULT_OFFICIAL_STORES: AllyContact[] = [
  {
    id: 'store-1',
    name: 'Maneki Neko',
    category: 'Comida / Restaurante',
    address: 'Plaza del Mar',
    phone: '',
    facebook: 'https://facebook.com',
    isOfficialStore: true
  },
  {
    id: 'store-2',
    name: 'Barbería Mdoce',
    category: 'Barbería / Cuidado Personal',
    address: 'Avenida Concordia',
    phone: '',
    facebook: 'https://facebook.com',
    isOfficialStore: true
  },
  {
    id: 'store-3',
    name: 'Lavadero Royal Shine',
    category: 'Auto / Lavado',
    address: 'Avenida Central',
    phone: '',
    facebook: 'https://facebook.com',
    isOfficialStore: true
  },
  {
    id: 'store-4',
    name: 'Refaccionaria Bahía',
    category: 'Auto / Refacciones',
    address: 'Avenida Hidalgo',
    phone: '',
    facebook: 'https://facebook.com',
    isOfficialStore: true
  },
  {
    id: 'store-5',
    name: 'Gesti+',
    category: 'Servicios / Trámites',
    address: 'Av. Ruiz Cortines (contra esquina del Palacio Federal)',
    phone: '',
    facebook: 'https://facebook.com',
    isOfficialStore: true
  }
];

export const AlliesMessenger: React.FC = () => {
  const [alliesList, setAlliesList] = useState<AllyContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'withPhone' | 'withoutPhone' | 'official'>('all');

  // Mensaje actual a enviar
  const [messageText, setMessageText] = useState<string>(
    '¡Hola! 👋 Te escribo de la coordinación de Red Identidad.\n\nQueremos coordinar detalles del programa de beneficios y los próximos sorteos mensuales para nuestros miembros. ¿Cómo te encuentras hoy?'
  );

  // Modal para editar teléfono y redes de un aliado
  const [editingAlly, setEditingAlly] = useState<AllyContact | null>(null);
  const [editPhone, setEditPhone] = useState<string>('');
  const [editFacebook, setEditFacebook] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState<string>('');

  useEffect(() => {
    loadAlliesContacts();
  }, []);

  const loadAlliesContacts = async () => {
    setIsLoading(true);
    try {
      // 1. Leer contactos guardados en localStorage
      let localContactsMap: Record<string, Partial<AllyContact>> = {};
      try {
        const saved = localStorage.getItem('red_identidad_allies_contacts');
        if (saved) {
          localContactsMap = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Error al leer contactos locales:', e);
      }

      // 2. Cargar aliados de la base de datos Supabase
      const { data: dbAllies, error } = await supabase
        .from('allies')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Error al consultar tabla allies:', error.message);
      }

      // 3. Fusionar puntos oficiales + aliados de base de datos
      const mergedList: AllyContact[] = [];

      // Agregar puntos oficiales
      DEFAULT_OFFICIAL_STORES.forEach(official => {
        const overrides = localContactsMap[official.id] || {};
        mergedList.push({
          ...official,
          phone: overrides.phone !== undefined ? overrides.phone : official.phone,
          facebook: overrides.facebook !== undefined ? overrides.facebook : official.facebook,
          notes: overrides.notes || ''
        });
      });

      // Agregar aliados de Supabase
      if (dbAllies && dbAllies.length > 0) {
        dbAllies.forEach(dbA => {
          // Evitar duplicar si el nombre ya coincide con uno oficial
          const alreadyExists = mergedList.some(
            m => m.name.toLowerCase().trim() === dbA.name?.toLowerCase().trim()
          );
          if (!alreadyExists) {
            const overrides = localContactsMap[dbA.id] || {};
            mergedList.push({
              id: dbA.id,
              name: dbA.name || 'Aliado sin nombre',
              category: dbA.category || 'Comercio Aliado',
              address: dbA.discount ? `Descuento: ${dbA.discount}` : '',
              phone: overrides.phone !== undefined ? overrides.phone : (dbA.phone || ''),
              facebook: overrides.facebook !== undefined ? overrides.facebook : (dbA.facebook_url || ''),
              notes: overrides.notes || '',
              isOfficialStore: false
            });
          }
        });
      }

      setAlliesList(mergedList);
    } catch (err) {
      console.error('Error general al cargar aliados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = () => {
    if (!editingAlly) return;

    const updatedList = alliesList.map(a => {
      if (a.id === editingAlly.id) {
        return {
          ...a,
          phone: editPhone.trim(),
          facebook: editFacebook.trim(),
          notes: editNotes.trim()
        };
      }
      return a;
    });

    setAlliesList(updatedList);

    // Guardar en localStorage para persistencia garantizada
    try {
      const contactsMap: Record<string, any> = {};
      updatedList.forEach(a => {
        contactsMap[a.id] = {
          phone: a.phone,
          facebook: a.facebook,
          notes: a.notes
        };
      });
      localStorage.setItem('red_identidad_allies_contacts', JSON.stringify(contactsMap));
    } catch (e) {
      console.warn('Error al guardar en storage:', e);
    }

    setSavedFeedback(`¡Contacto de "${editingAlly.name}" actualizado!`);
    setTimeout(() => setSavedFeedback(''), 3000);
    setEditingAlly(null);
  };

  const openEditModal = (ally: AllyContact) => {
    setEditingAlly(ally);
    setEditPhone(ally.phone || '');
    setEditFacebook(ally.facebook || '');
    setEditNotes(ally.notes || '');
  };

  // Filtrado de aliados
  const filteredAllies = alliesList.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.address && a.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'withPhone') return Boolean(a.phone && a.phone.trim());
    if (selectedFilter === 'withoutPhone') return !a.phone || !a.phone.trim();
    if (selectedFilter === 'official') return Boolean(a.isOfficialStore);
    return true;
  });

  const getPersonalizedWhatsAppLink = (ally: AllyContact) => {
    if (!ally.phone || !ally.phone.trim()) return '#';
    const rawPhone = ally.phone.replace(/\D/g, '');
    const phone = rawPhone.length === 10 ? `52${rawPhone}` : rawPhone;
    
    // Reemplaza etiqueta {nombre} por el nombre del negocio
    const customized = messageText.replace(/\{nombre\}/gi, ally.name);
    return `https://wa.me/${phone}?text=${encodeURIComponent(customized)}`;
  };

  const setTemplate = (type: 'sorteo' | 'beneficios' | 'calcomanias' | 'general') => {
    switch (type) {
      case 'sorteo':
        setMessageText(
          '¡Hola {nombre}! 🎁 Te escribimos de Red Identidad.\n\nQueremos avisarte que este mes realizaremos el gran sorteo para todos los conductores y usuarios que portan su distintivo oficial. ¿Te gustaría sumarte como patrocinador o tener mención especial durante la transmisión en vivo?'
        );
        break;
      case 'beneficios':
        setMessageText(
          '¡Hola {nombre}! 🌟 Te contactamos de Red Identidad para confirmar la vigencia de tu promoción en nuestra app y mapa oficial. ¿Deseas mantener tu descuento actual o agregar una nueva promoción para atraer más clientes?'
        );
        break;
      case 'calcomanias':
        setMessageText(
          '¡Hola {nombre}! 🚗 Te escribimos de Red Identidad para checar la existencia de calcomanías oficiales en tu sucursal. ¿Cuentan con suficiente inventario o pasamos a surtirles más sobres y distintivos?'
        );
        break;
      case 'general':
      default:
        setMessageText(
          '¡Hola {nombre}! 👋 Te saluda el equipo de Red Identidad. ¿Cómo van las ventas con los clientes que presentan su distintivo oficial? Quedamos a tus órdenes para cualquier duda o apoyo.'
        );
        break;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#FFF' }}>
      
      {/* ── Encabezado Principal ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37,211,102,0.15) 0%, rgba(20,25,22,0.95) 100%)',
        border: '1.5px solid rgba(37,211,102,0.35)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'rgba(37,211,102,0.2)',
            border: '1px solid #25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#25D366'
          }}>
            <MessageSquare size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', margin: 0 }}>
              Centro de Comunicación con Aliados
            </h2>
            <p style={{ margin: '2px 0 0', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              Comunícate directamente por WhatsApp y Facebook con los puntos de venta y comercios de la Red.
            </p>
          </div>
        </div>

        <button
          onClick={loadAlliesContacts}
          disabled={isLoading}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Actualizar Lista
        </button>
      </div>

      {savedFeedback && (
        <div style={{
          backgroundColor: 'rgba(37,211,102,0.15)',
          border: '1px solid rgba(37,211,102,0.4)',
          color: '#4ADE80',
          padding: '0.85rem 1.2rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} /> {savedFeedback}
        </div>
      )}

      {/* ── Redactor de Mensaje & Plantillas de Difusión ── */}
      <div style={{
        backgroundColor: '#16161E',
        borderRadius: '20px',
        padding: '1.4rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Mensaje a Enviar por WhatsApp
          </label>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Tip: Usa <strong>{'{nombre}'}</strong> para personalizar con el nombre del negocio.
          </span>
        </div>

        {/* Plantillas Rápidas */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center', marginRight: '4px' }}>Plantillas:</span>
          <button
            onClick={() => setTemplate('sorteo')}
            style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            🎁 Aviso de Sorteo
          </button>
          <button
            onClick={() => setTemplate('calcomanias')}
            style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#93C5FD', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            📦 Surtido de Calcomanías
          </button>
          <button
            onClick={() => setTemplate('beneficios')}
            style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#C4B5FD', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            ⭐ Revisión de Promociones
          </button>
          <button
            onClick={() => setTemplate('general')}
            style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            💬 Saludo General
          </button>
        </div>

        <textarea
          rows={3}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Escribe aquí el mensaje que deseas enviar a los aliados..."
          style={{
            width: '100%',
            padding: '0.9rem',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            color: '#FFF',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* ── Filtros y Buscador de Aliados ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        {/* Buscador */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Buscar aliado por nombre, giro o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.4rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              color: '#FFF',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedFilter('all')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: selectedFilter === 'all' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
              color: selectedFilter === 'all' ? '#121212' : '#FFF',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Todos ({alliesList.length})
          </button>
          <button
            onClick={() => setSelectedFilter('official')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: selectedFilter === 'official' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
              color: selectedFilter === 'official' ? '#121212' : '#FFF',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Puntos de Venta (5)
          </button>
          <button
            onClick={() => setSelectedFilter('withPhone')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: selectedFilter === 'withPhone' ? '#25D366' : 'rgba(255,255,255,0.06)',
              color: selectedFilter === 'withPhone' ? '#121212' : '#FFF',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Con WhatsApp ({alliesList.filter(a => a.phone && a.phone.trim()).length})
          </button>
          <button
            onClick={() => setSelectedFilter('withoutPhone')}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: selectedFilter === 'withoutPhone' ? '#F87171' : 'rgba(255,255,255,0.06)',
              color: selectedFilter === 'withoutPhone' ? '#121212' : '#FFF',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Sin WhatsApp ({alliesList.filter(a => !a.phone || !a.phone.trim()).length})
          </button>
        </div>
      </div>

      {/* ── Lista de Tarjetas de Aliados ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {filteredAllies.map((ally) => {
          const hasPhone = Boolean(ally.phone && ally.phone.trim());
          const hasFacebook = Boolean(ally.facebook && ally.facebook.trim());

          return (
            <div
              key={ally.id}
              style={{
                backgroundColor: '#16161E',
                border: ally.isOfficialStore ? '1.5px solid rgba(212,175,55,0.35)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '1.1rem 1.3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
            >
              {/* Información del Aliado */}
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>
                    {ally.name}
                  </h3>
                  {ally.isOfficialStore && (
                    <span style={{
                      backgroundColor: 'rgba(212,175,55,0.18)',
                      color: 'var(--accent-gold)',
                      border: '1px solid rgba(212,175,55,0.4)',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      Punto de Venta
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {ally.category && <span>{ally.category}</span>}
                  {ally.address && (
                    <>
                      <span>•</span>
                      <span>📍 {ally.address}</span>
                    </>
                  )}
                </div>

                {/* Estatus de Contacto */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center', fontSize: '0.75rem' }}>
                  {hasPhone ? (
                    <span style={{ color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Phone size={13} /> {ally.phone}
                    </span>
                  ) : (
                    <span style={{ color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <AlertCircle size={13} /> Sin WhatsApp asignado
                    </span>
                  )}

                  {hasFacebook && (
                    <span style={{ color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🌐 Facebook disponible
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de Acción Inmediata */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Botón WhatsApp con Mensaje */}
                {hasPhone ? (
                  <a
                    href={getPersonalizedWhatsAppLink(ally)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Enviar mensaje por WhatsApp"
                    style={{
                      padding: '0.65rem 1.1rem',
                      borderRadius: '10px',
                      backgroundColor: '#25D366',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      boxShadow: '0 2px 10px rgba(37,211,102,0.35)',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={14} /> Enviar WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={() => openEditModal(ally)}
                    style={{
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37,211,102,0.12)',
                      border: '1px dashed #25D366',
                      color: '#4ADE80',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    + Asignar WhatsApp
                  </button>
                )}

                {/* Botón Facebook */}
                {hasFacebook && (
                  <a
                    href={ally.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir página de Facebook"
                    style={{
                      padding: '0.65rem 0.8rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(24,119,242,0.15)',
                      border: '1px solid rgba(24,119,242,0.3)',
                      color: '#60A5FA',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> Facebook
                  </a>
                )}

                {/* Botón Editar / Configurar */}
                <button
                  onClick={() => openEditModal(ally)}
                  title="Editar número o redes"
                  style={{
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#FFF',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit2 size={13} /> {hasPhone ? 'Editar' : 'Configurar'}
                </button>
              </div>
            </div>
          );
        })}

        {filteredAllies.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.1)',
            color: 'var(--text-dim)'
          }}>
            <Store size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#CBD5E1' }}>
              No se encontraron aliados con el filtro seleccionado
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL DE EDICIÓN DE TELÉFONO / REDES ── */}
      {editingAlly && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: '#161622',
            borderRadius: '20px',
            border: '1.5px solid rgba(37,211,102,0.4)',
            padding: '1.5rem',
            color: '#FFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  Configurar Contacto
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                  {editingAlly.name}
                </p>
              </div>
              <button
                onClick={() => setEditingAlly(null)}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: '#4ADE80', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  📱 Teléfono / WhatsApp (10 Dígitos)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 9811234567"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
                  Ingresa los 10 dígitos (ej. 981 123 4567). La app agrega el prefijo de México automáticamente.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  🌐 Enlace de Página de Facebook
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/nombredelnegocio"
                  value={editFacebook}
                  onChange={(e) => setEditFacebook(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  📝 Nota interna (Opcional - Ej: Nombre del encargado)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Contactar con Don Roberto después de las 2pm"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#FFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingAlly(null)}
                style={{
                  padding: '0.75rem 1.2rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveContact}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  backgroundColor: '#25D366',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(37,211,102,0.3)'
                }}
              >
                <Save size={16} /> Guardar Contacto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AlliesMessenger;
