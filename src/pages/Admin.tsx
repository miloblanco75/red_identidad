import React, { useState } from 'react';
import { ShieldAlert, Download, Loader2, CheckCircle2, QrCode, Store, MapPin, Trash2, Printer, Pencil, X, BookOpen, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

import EnvelopeStickerDesigner from '../components/EnvelopeStickerDesigner';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'codes' | 'allies' | 'print' | 'envelope'>('codes');

  // Print states
  const [printStickers, setPrintStickers] = useState<any[]>([]);
  const [printCount, setPrintCount] = useState(35);
  const [printLevel, setPrintLevel] = useState<string>('all');
  const [isPrintLoading, setIsPrintLoading] = useState(false);
  
  // States for Codes
  const [level, setLevel] = useState<'white' | 'silver' | 'gold'>('white');
  const [codeType, setCodeType] = useState<'normal' | 'tesoro'>('normal');
  const [prefix, setPrefix] = useState('RED-');
  const [startNumber, setStartNumber] = useState(1);
  const [quantity, setQuantity] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // States for Allies
  const [allyName, setAllyName] = useState('');
  const [allyCategory, setAllyCategory] = useState('Comida');
  const [allyDiscount, setAllyDiscount] = useState('');
  const [allyLat, setAllyLat] = useState('');
  const [allyLng, setAllyLng] = useState('');
  const [allyFacebook, setAllyFacebook] = useState('');
  const [allyWebsite, setAllyWebsite] = useState('');
  const [allyLogo, setAllyLogo] = useState('');
  const [allyPin, setAllyPin] = useState('');
  const [isAddingAlly, setIsAddingAlly] = useState(false);
  const [savedAllies, setSavedAllies] = useState<any[]>([]);

  // States for Editing Ally
  const [editingAlly, setEditingAlly] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Comida');
  const [editDiscount, setEditDiscount] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editLogo, setEditLogo] = useState('');
  const [editPin, setEditPin] = useState('');

  // Manual state
  const [showAllyManual, setShowAllyManual] = useState(true);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ADMIN_PIN = 'RED2024';

  // Helper to process image file upload from device
  const handleFileUpload = async (file: File, setTargetUrl: (url: string) => void) => {
    try {
      // 1. Try uploading to Supabase Storage bucket 'allies-logos'
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('allies-logos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('allies-logos').getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          setTargetUrl(publicUrlData.publicUrl);
          return;
        }
      }

      // 2. Fallback: Convert to compressed Data URL (canvas max 400px width/height)
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setTargetUrl(compressedDataUrl);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing file:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('PIN incorrecto');
    }
  };



  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (quantity > 10000) throw new Error('Máximo 10,000 códigos por lote.');
      if (!prefix) throw new Error('Debes incluir un prefijo.');
      if (startNumber < 1) throw new Error('El número inicial debe ser 1 o mayor.');
      if (codeType === 'tesoro' && level !== 'gold') {
        throw new Error('Los Códigos del Tesoro deben ser Nivel Gold (VIP).');
      }

      const newStickers = [];
      const csvRows = ['CÓDIGO,ENLACE_QR,NIVEL,TIPO,NUMERO_MIEMBRO'];

      for (let i = 0; i < quantity; i++) {
        const num = startNumber + i;
        const numStr = String(num).padStart(4, '0');
        const uniqueCode = `${prefix.toUpperCase()}${numStr}`;
        newStickers.push({
          code: uniqueCode,
          level: level,
          member_number: num
        });

        const route = codeType === 'tesoro' ? 'tesoro' : 'registro';
        const link = `https://redidentidad.vercel.app/${route}?c=${uniqueCode}`;
        csvRows.push(`${uniqueCode},${link},${level},${codeType.toUpperCase()},${num}`);
      }

      const { error } = await supabase.from('stickers').insert(newStickers);
      if (error) throw error;

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const linkEl = document.createElement('a');
      linkEl.setAttribute('href', url);
      linkEl.setAttribute('download', `codigos_red_${level}_${quantity}_${new Date().getTime()}.csv`);
      document.body.appendChild(linkEl);
      linkEl.click();
      document.body.removeChild(linkEl);

      const firstCode = `${prefix.toUpperCase()}${String(startNumber).padStart(4, '0')}`;
      const lastCode = `${prefix.toUpperCase()}${String(startNumber + quantity - 1).padStart(4, '0')}`;
      setSuccessMsg(`¡${quantity} códigos secuenciales generados (${firstCode} a ${lastCode})!`);
      setStartNumber(startNumber + quantity);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al generar los códigos.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearUnclaimedCodes = async () => {
    if (confirm('¿Estás seguro de borrar TODOS los códigos sin reclamar (de prueba)? Las calcomanías activadas por usuarios NO se borrarán.')) {
      const { error } = await supabase.from('stickers').delete().is('phone', null);
      if (error) {
        setErrorMsg('Error al limpiar códigos: ' + error.message);
      } else {
        setSuccessMsg('Códigos de prueba sin reclamar eliminados correctamente.');
        setPrintStickers([]);
        setStartNumber(1);
      }
    }
  };

  const handleResetStickerOne = async () => {
    if (confirm('¿Estás seguro de liberar la Calcomanía #1? Se borrará el teléfono vinculado en la base de datos para que quede como nueva/sin activar.')) {
      const { error } = await supabase.from('stickers').update({ phone: null, claimed_at: null }).eq('member_number', 1);
      if (error) {
        setErrorMsg('Error al liberar Calcomanía #1: ' + error.message);
      } else {
        setSuccessMsg('Calcomanía #1 liberada correctamente y lista para ser activada nuevamente.');
      }
    }
  };

  const handleResetAllClaimedStickers = async () => {
    if (confirm('¿Estás seguro de desvincular TODAS las calcomanías activadas? Todas volverán a estado virgen/nuevo.')) {
      const { error } = await supabase.from('stickers').update({ phone: null, claimed_at: null }).not('phone', 'is', null);
      if (error) {
        setErrorMsg('Error al reiniciar calcomanías: ' + error.message);
      } else {
        setSuccessMsg('Todas las calcomanías han sido reiniciadas a estado nuevo/sin reclamar.');
      }
    }
  };


  const handleAddAlly = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAlly(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (!allyName || !allyCategory || !allyDiscount || !allyLat || !allyLng) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const { error } = await supabase.from('allies').insert([{
        name: allyName,
        category: allyCategory,
        discount: allyDiscount,
        lat: parseFloat(allyLat),
        lng: parseFloat(allyLng),
        facebook_url: allyFacebook || null,
        website_url: allyWebsite || null,
        logo_url: allyLogo || null,
        ally_pin: allyPin || null,
        promotions_given: 0
      }]);

      if (error) throw error;

      setSuccessMsg(`¡Aliado "${allyName}" agregado exitosamente a la Red!`);
      setAllyName('');
      setAllyDiscount('');
      setAllyLat('');
      setAllyLng('');
      setAllyFacebook('');
      setAllyWebsite('');
      setAllyLogo('');
      setAllyPin('');
      fetchSavedAllies(); // Refresh list
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el aliado.');
    } finally {
      setIsAddingAlly(false);
    }
  };

  const fetchSavedAllies = async () => {
    const { data } = await supabase.from('allies').select('*').order('created_at', { ascending: false });
    if (data) setSavedAllies(data);
  };

  const fetchPrintStickers = async () => {
    setIsPrintLoading(true);
    setErrorMsg('');
    try {
      let query = supabase
        .from('stickers')
        .select('code, level, member_number')
        .is('phone', null)
        .order('code', { ascending: true })
        .limit(printCount);
      if (printLevel !== 'all') {
        query = (query as any).eq('level', printLevel);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data) setPrintStickers(data);
    } catch (err: any) {
      setErrorMsg('Error al cargar los códigos. Verifica que la tabla stickers exista.');
    } finally {
      setIsPrintLoading(false);
    }
  };

  const handleDeleteAlly = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que quieres borrar a ${name}? Esta acción quitará el comercio del mapa y del sistema.`)) {
      const { error } = await supabase.from('allies').delete().eq('id', id);
      if (error) {
        setErrorMsg('Error al borrar aliado: ' + error.message);
      } else {
        setSuccessMsg(`Aliado "${name}" borrado exitosamente.`);
        fetchSavedAllies();
      }
    }
  };

  const openEditModal = (ally: any) => {
    setEditingAlly(ally);
    setEditName(ally.name || '');
    setEditCategory(ally.category || 'Comida');
    setEditDiscount(ally.discount || '');
    setEditLat(ally.lat ? String(ally.lat) : '');
    setEditLng(ally.lng ? String(ally.lng) : '');
    setEditFacebook(ally.facebook_url || '');
    setEditWebsite(ally.website_url || '');
    setEditLogo(ally.logo_url || '');
    setEditPin(ally.ally_pin || '');
  };

  const handleUpdateAlly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlly) return;
    setIsAddingAlly(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!editName || !editCategory || !editDiscount || !editLat || !editLng) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const { error } = await supabase.from('allies').update({
        name: editName,
        category: editCategory,
        discount: editDiscount,
        lat: parseFloat(editLat),
        lng: parseFloat(editLng),
        facebook_url: editFacebook || null,
        website_url: editWebsite || null,
        logo_url: editLogo || null,
        ally_pin: editPin || null,
      }).eq('id', editingAlly.id);

      if (error) throw error;

      setSuccessMsg(`¡Aliado "${editName}" actualizado exitosamente!`);
      setEditingAlly(null);
      fetchSavedAllies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al actualizar el aliado.');
    } finally {
      setIsAddingAlly(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'allies') {
      fetchSavedAllies();
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center', paddingTop: '4rem' }}>
        <ShieldAlert size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Acceso Restringido</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Panel Maestro</p>
        
        <form onSubmit={handleLogin} className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <input 
            type="password" 
            placeholder="PIN de Administrador"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1.2rem', outline: 'none', textAlign: 'center', letterSpacing: '0.2em', marginBottom: '1rem' }}
          />
          {errorMsg && <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{errorMsg}</p>}
          <button type="submit" style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--accent-gold)', color: '#121212', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Desbloquear Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', marginTop: '1rem' }}>Panel Maestro</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Administra tu Red Identidad.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => { setActiveTab('codes'); setSuccessMsg(''); setErrorMsg(''); }}
          style={{ flex: 1, minWidth: '90px', padding: '0.8rem 0.5rem', borderRadius: '12px', backgroundColor: activeTab === 'codes' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'codes' ? '#121212' : '#FFF', border: 'none', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <QrCode size={16} /> Códigos
        </button>
        <button 
          onClick={() => { setActiveTab('allies'); setSuccessMsg(''); setErrorMsg(''); }}
          style={{ flex: 1, minWidth: '90px', padding: '0.8rem 0.5rem', borderRadius: '12px', backgroundColor: activeTab === 'allies' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'allies' ? '#121212' : '#FFF', border: 'none', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Store size={16} /> Aliados
        </button>
        <button 
          onClick={() => { setActiveTab('print'); setSuccessMsg(''); setErrorMsg(''); setPrintStickers([]); }}
          style={{ flex: 1, minWidth: '90px', padding: '0.8rem 0.5rem', borderRadius: '12px', backgroundColor: activeTab === 'print' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'print' ? '#121212' : '#FFF', border: 'none', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Printer size={16} /> Tarjetas
        </button>
        <button 
          onClick={() => { setActiveTab('envelope'); setSuccessMsg(''); setErrorMsg(''); }}
          style={{ flex: 1, minWidth: '110px', padding: '0.8rem 0.5rem', borderRadius: '12px', backgroundColor: activeTab === 'envelope' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'envelope' ? '#121212' : '#FFF', border: 'none', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Printer size={16} /> Sobres (7x7)
        </button>
      </div>

      {errorMsg && (
        <div style={{ color: '#ff4444', fontSize: '0.8rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ color: '#4ade80', fontSize: '0.8rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Tab: Codes */}
      {activeTab === 'codes' && (
        <section className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <form onSubmit={handleGenerateCodes}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Propósito del Código</label>
              <select 
                value={codeType} 
                onChange={(e) => {
                  setCodeType(e.target.value as any);
                  if (e.target.value === 'tesoro') setLevel('gold');
                }}
                style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}
              >
                <option value="normal" style={{ color: '#000' }}>Para Sobres (Registro Normal)</option>
                <option value="tesoro" style={{ color: '#000' }}>Para Esconder (Tesoro VIP)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Nivel de Membresía</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value as any)}
                disabled={codeType === 'tesoro'}
                style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none', opacity: codeType === 'tesoro' ? 0.5 : 1 }}
              >
                <option value="white" style={{ color: '#000' }}>White (Esencial)</option>
                <option value="silver" style={{ color: '#000' }}>Silver (Colección)</option>
                <option value="gold" style={{ color: '#000' }}>Gold (VIP)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Prefijo</label>
                <input 
                  type="text" value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} required
                  style={{ width: '100%', padding: '0.9rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Inicio desde</label>
                <input 
                  type="number" value={startNumber} onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)} min="1" required
                  style={{ width: '100%', padding: '0.9rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Cantidad</label>
                <input 
                  type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} min="1" max="10000" required
                  style={{ width: '100%', padding: '0.9rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Vista previa de los códigos a generar */}
            <div style={{ padding: '0.8rem 1rem', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Vista previa de secuencia:</span>
              <strong style={{ color: 'var(--accent-gold)' }}>
                {prefix.toUpperCase()}{String(startNumber).padStart(4, '0')} ... {prefix.toUpperCase()}{String(startNumber + quantity - 1).padStart(4, '0')}
              </strong>
            </div>

            <button type="submit" disabled={isGenerating} style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: isGenerating ? 'rgba(255,255,255,0.1)' : 'var(--accent-gold)', color: isGenerating ? '#FFF' : '#121212', fontWeight: 700, border: 'none', display: 'flex', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
              {isGenerating ? <Loader2 className="animate-spin" /> : <Download />} Generar Lote Secuencial y CSV
            </button>
          </form>

          {/* Botón para limpiar pruebas y desvincular calcomanías */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Liberar solo Calcomanía #1 (Volver virgen):</span>
              <button
                onClick={handleResetStickerOne}
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.15)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={14} /> Liberar Calcomanía #1
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>¿Limpiar códigos no usados (en blanco)?</span>
              <button
                onClick={handleClearUnclaimedCodes}
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', backgroundColor: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.3)', color: '#FF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={14} /> Limpiar códigos no usados
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>¿Desvincular TODAS las calcomanías activadas?</span>
              <button
                onClick={handleResetAllClaimedStickers}
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', backgroundColor: 'rgba(255,68,68,0.2)', border: '1px solid #FF4444', color: '#FF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={14} /> Liberar TODAS las calcomanías
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Allies */}
      {activeTab === 'allies' && (
        <section className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          {/* Manual de Uso / Guía de Inicio */}
          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
            padding: '1.2rem',
            marginBottom: '2rem'
          }}>
            <div 
              onClick={() => setShowAllyManual(!showAllyManual)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={20} color="var(--accent-gold)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)', margin: 0 }}>
                  📘 Manual de Uso: Registro de Aliados y Redes Sociales
                </h4>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {showAllyManual ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {showAllyManual && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#DDD', lineHeight: 1.6, borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '0.8rem' }}>
                <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li>
                    <strong style={{ color: '#FFF' }}>📍 Coordenadas de Google Maps (Latitud y Longitud):</strong>
                    <br />
                    1. Entra a <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Google Maps</a> en tu computadora.
                    <br />
                    2. Busca el negocio o la dirección exacta y haz <strong>clic derecho</strong> sobre el marcador rojo.
                    <br />
                    3. Haz clic sobre los dos números que aparecen arriba (Ejemplo: <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>19.8438, -90.5312</code>) para copiarlos.
                    <br />
                    4. Pega el primer número en <strong>Latitud</strong> y el segundo en <strong>Longitud</strong>.
                  </li>

                  <li>
                    <strong style={{ color: '#FFF' }}>🌐 Enlaces de Facebook y Sitio Web:</strong>
                    <br />
                    • En <strong>Página de Facebook</strong>, pega el link completo (ej: <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>https://facebook.com/minegocio</code>).
                    <br />
                    • En <strong>Página Web</strong>, pega la URL oficial (ej: <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>https://minegocio.com</code>).
                    <br />
                    <em>Los usuarios verán botones directos en el mapa interactivo y lista de promociones.</em>
                  </li>

                  <li>
                    <strong style={{ color: '#FFF' }}>🔑 PIN del Aliado para su Portal:</strong>
                    <br />
                    Asigna una clave única para el comercio (ej: <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>TROMPOS24</code>). Con este PIN, el comercio iniciará sesión en su portal <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>/aliado-panel</code> para registrar los descuentos o cortesías entregados a miembros de la Red.
                  </li>

                  <li>
                    <strong style={{ color: '#FFF' }}>✏️ Modificar o Editar Aliados:</strong>
                    <br />
                    En la lista inferior (<em>"Tus Aliados Activos"</em>), presiona el botón de <strong>Lápiz (✏️)</strong> para actualizar los datos o corregir sus enlaces en cualquier momento.
                  </li>
                </ol>
              </div>
            )}
          </div>

          <form onSubmit={handleAddAlly}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Nombre del Negocio</label>
              <input type="text" value={allyName} onChange={(e) => setAllyName(e.target.value)} required placeholder="Ej. Restaurante Los Trompos" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Categoría</label>
              <select value={allyCategory} onChange={(e) => setAllyCategory(e.target.value)} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}>
                <option value="Comida" style={{ color: '#000' }}>Comida / Restaurantes</option>
                <option value="Servicios" style={{ color: '#000' }}>Servicios / Estética</option>
                <option value="Auto" style={{ color: '#000' }}>Auto / Lavados</option>
                <option value="Entretenimiento" style={{ color: '#000' }}>Entretenimiento / Bares</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Descuento / Promoción</label>
              <input type="text" value={allyDiscount} onChange={(e) => setAllyDiscount(e.target.value)} required placeholder="Ej. 15% OFF o Postre Gratis" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Página de Facebook</label>
                <input type="url" value={allyFacebook} onChange={(e) => setAllyFacebook(e.target.value)} placeholder="https://facebook.com/pagina" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Página Web</label>
                <input type="url" value={allyWebsite} onChange={(e) => setAllyWebsite(e.target.value)} placeholder="https://minegocio.com" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }} />
              </div>
            </div>

            {/* Logotipo del Aliado (Subir Archivo o URL) */}
            <div style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.6rem', letterSpacing: '0.1em' }}>
                Logotipo del Comercio
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                {allyLogo ? (
                  <img src={allyLogo} alt="Preview Logo" style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={24} color="var(--text-dim)" />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '10px 16px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(212,175,55,0.15)', 
                    color: 'var(--accent-gold)', 
                    border: '1px solid var(--accent-gold)', 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}>
                    <Upload size={18} /> Subir Imagen desde el Celular / PC
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], setAllyLogo);
                        }
                      }} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>Selecciona cualquier imagen PNG, JPG o WEBP de tu galería o archivos.</p>
                </div>
              </div>

              <details style={{ marginTop: '0.4rem' }}>
                <summary style={{ fontSize: '0.75rem', color: 'var(--text-dim)', cursor: 'pointer' }}>o ingresar enlace de URL manual</summary>
                <input 
                  type="url" 
                  value={allyLogo} 
                  onChange={(e) => setAllyLogo(e.target.value)} 
                  placeholder="https://ejemplo.com/logo-comercio.png" 
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#FFF', fontSize: '0.85rem', outline: 'none', marginTop: '0.5rem' }} 
                />
              </details>
            </div>

            {/* PIN del Aliado */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>PIN del Aliado (para su portal)</label>
              <input
                type="text"
                value={allyPin}
                onChange={(e) => setAllyPin(e.target.value.toUpperCase())}
                placeholder="Ej. TROMPOS24"
                style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', color: 'var(--accent-gold)', fontSize: '1rem', outline: 'none', letterSpacing: '0.1em', fontWeight: 600 }}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>El aliado usará este PIN para acceder a su portal y registrar promociones dadas.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Latitud</label>
                <input type="number" step="any" value={allyLat} onChange={(e) => setAllyLat(e.target.value)} required placeholder="19.8301" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Longitud</label>
                <input type="number" step="any" value={allyLng} onChange={(e) => setAllyLng(e.target.value)} required placeholder="-90.5349" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <strong>Tip:</strong> Busca el lugar en Google Maps en tu computadora, haz clic derecho en el punto rojo y verás los números de latitud y longitud para copiarlos aquí.
            </div>

            <button type="submit" disabled={isAddingAlly} style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: isAddingAlly ? 'rgba(255,255,255,0.1)' : 'var(--accent-gold)', color: isAddingAlly ? '#FFF' : '#121212', fontWeight: 700, border: 'none', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {isAddingAlly ? <Loader2 className="animate-spin" /> : <MapPin />} Publicar en el Mapa
            </button>
          </form>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>Tus Aliados Activos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedAllies.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textAlign: 'center' }}>No hay aliados registrados aún.</p>
            ) : (
              savedAllies.map(ally => (
                <div key={ally.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {ally.logo_url ? (
                      <img src={ally.logo_url} alt={ally.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Store size={20} color="var(--accent-gold)" />
                      </div>
                    )}
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>{ally.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ally.category} • {ally.discount}</span>
                      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: '#4ADE80', fontWeight: 600 }}>🎁 {ally.promotions_given ?? 0} promo(s)</span>
                        {ally.ally_pin && <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>PIN: {ally.ally_pin}</span>}
                        {ally.facebook_url && <span style={{ fontSize: '0.75rem', color: '#1877F2', fontWeight: 600 }}>🌐 Facebook</span>}
                        {ally.website_url && <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>🔗 Web</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      onClick={() => openEditModal(ally)}
                      title="Editar Aliado"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)', color: '#FFF', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAlly(ally.id, ally.name)}
                      title="Borrar Aliado"
                      style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Modal Edición de Aliado */}
      {editingAlly && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', borderRadius: '24px', position: 'relative', border: '1px solid var(--accent-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Editar Aliado: {editingAlly.name}</h3>
              <button onClick={() => setEditingAlly(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateAlly}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Nombre del Negocio</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.95rem', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Categoría</label>
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.95rem', outline: 'none' }}>
                  <option value="Comida" style={{ color: '#000' }}>Comida / Restaurantes</option>
                  <option value="Servicios" style={{ color: '#000' }}>Servicios / Estética</option>
                  <option value="Auto" style={{ color: '#000' }}>Auto / Lavados</option>
                  <option value="Entretenimiento" style={{ color: '#000' }}>Entretenimiento / Bares</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Descuento / Promoción</label>
                <input type="text" value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} required style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.95rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Página de Facebook</label>
                  <input type="url" value={editFacebook} onChange={(e) => setEditFacebook(e.target.value)} placeholder="https://facebook.com/pagina" style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Página Web</label>
                  <input type="url" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} placeholder="https://minegocio.com" style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.85rem', outline: 'none' }} />
                </div>
              </div>

              {/* Logotipo del Aliado (Subir Archivo o URL) */}
              <div style={{ marginBottom: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Logotipo del Comercio
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                  {editLogo ? (
                    <img src={editLogo} alt="Preview Logo" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={20} color="var(--text-dim)" />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '8px 12px', 
                      borderRadius: '10px', 
                      backgroundColor: 'rgba(212,175,55,0.15)', 
                      color: 'var(--accent-gold)', 
                      border: '1px solid var(--accent-gold)', 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}>
                      <Upload size={16} /> Subir Imagen desde el Celular / PC
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], setEditLogo);
                          }
                        }} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                </div>

                <details style={{ marginTop: '0.2rem' }}>
                  <summary style={{ fontSize: '0.7rem', color: 'var(--text-dim)', cursor: 'pointer' }}>o ingresar enlace de URL manual</summary>
                  <input 
                    type="url" 
                    value={editLogo} 
                    onChange={(e) => setEditLogo(e.target.value)} 
                    placeholder="https://ejemplo.com/logo.png" 
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#FFF', fontSize: '0.8rem', outline: 'none', marginTop: '0.4rem' }} 
                  />
                </details>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>PIN del Aliado</label>
                <input type="text" value={editPin} onChange={(e) => setEditPin(e.target.value.toUpperCase())} placeholder="Ej. TROMPOS24" style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', color: 'var(--accent-gold)', fontSize: '0.95rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Latitud</label>
                  <input type="number" step="any" value={editLat} onChange={(e) => setEditLat(e.target.value)} required style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.95rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Longitud</label>
                  <input type="number" step="any" value={editLng} onChange={(e) => setEditLng(e.target.value)} required style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="button" onClick={() => setEditingAlly(null)} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={isAddingAlly} style={{ flex: 2, padding: '0.8rem', borderRadius: '12px', backgroundColor: 'var(--accent-gold)', color: '#121212', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  {isAddingAlly ? <Loader2 className="animate-spin" size={18} /> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB: IMPRIMIR QR ─── */}
      {activeTab === 'print' && (
        <>
          {/* Estilos de impresión */}
          <style>{`
            @media print {
              body > * { visibility: hidden !important; }
              #qr-print-area, #qr-print-area * { visibility: visible !important; }
              #qr-print-area {
                position: fixed !important;
                top: 0; left: 0;
                width: 100% !important;
                padding: 0.4cm !important;
                background: white !important;
              }
              @page { size: A4 portrait; margin: 0.4cm; }
            }
          `}</style>

          {/* Controles */}
          <section className="glass" style={{ padding: '1.5rem', borderRadius: '20px', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 700 }}>Hoja de impresión de QR</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Cantidad de QR</label>
                <input
                  type="number"
                  value={printCount}
                  onChange={e => setPrintCount(Math.min(70, Math.max(1, parseInt(e.target.value) || 1)))}
                  min={1} max={70}
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Nivel</label>
                <select
                  value={printLevel}
                  onChange={e => setPrintLevel(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}
                >
                  <option value="all" style={{ color: '#000' }}>Todos los niveles</option>
                  <option value="white" style={{ color: '#000' }}>White (Esencial)</option>
                  <option value="silver" style={{ color: '#000' }}>Silver (Colección)</option>
                  <option value="gold" style={{ color: '#000' }}>Gold (VIP)</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '0.8rem', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '10px', marginBottom: '1.2rem', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--accent-gold)' }}>Formato A4:</strong> 5 columnas × QR de 3×3 cm — solo carga códigos sin registrar. Máx 70 por página.
            </div>

            <button
              onClick={fetchPrintStickers}
              disabled={isPrintLoading}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: isPrintLoading ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', color: '#FFF', fontWeight: 700, border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              {isPrintLoading ? <Loader2 className="animate-spin" size={18} /> : <QrCode size={18} />}
              {isPrintLoading ? 'Cargando...' : `Cargar ${printCount} códigos`}
            </button>
          </section>

          {/* Área de impresión */}
          {printStickers.length > 0 && (
            <>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
                {printStickers.length} códigos listos — revisa la vista previa y presiona Imprimir
              </p>

              <div
                id="qr-print-area"
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '0.4cm',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 3cm)',
                  gap: '0.35cm',
                  overflowX: 'auto',
                }}
              >
                {printStickers.map((sticker: any) => (
                  <div
                    key={sticker.code}
                    style={{
                      width: '3cm',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1mm',
                      breakInside: 'avoid' as any,
                    }}
                  >
                    <QRCodeSVG
                      value={`https://redidentidad.vercel.app/registro?c=${sticker.code}`}
                      size={95}
                      level="M"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <div style={{
                      fontSize: '5.5pt',
                      fontFamily: 'monospace',
                      color: '#000000',
                      marginTop: '1.5mm',
                      textAlign: 'center',
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                      wordBreak: 'break-all',
                    }}>
                      {sticker.code}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.print()}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#121212',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(212,175,55,0.3)',
                }}
              >
                <Printer size={20} /> Imprimir {printStickers.length} códigos QR
              </button>
            </>
          )}
        </>
      )}

      {/* ─── TAB: IMPRIMIR CALCOMANÍAS SOBRES (7x7 cm) ─── */}
      {activeTab === 'envelope' && (
        <EnvelopeStickerDesigner />
      )}
    </div>
  );
};

export default Admin;
