import React, { useState } from 'react';
import { ShieldAlert, Download, Loader2, CheckCircle2, QrCode, Store, MapPin, Trash2, Printer, Pencil, X, BookOpen, ChevronDown, ChevronUp, Upload, Activity, Search, RotateCcw, Smartphone, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import StickerQRCode from '../components/StickerQRCode';

import EnvelopeStickerDesigner from '../components/EnvelopeStickerDesigner';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'codes' | 'allies' | 'print' | 'envelope' | 'status'>('codes');

  // Print states
  const [printStickers, setPrintStickers] = useState<any[]>([]);
  const [printCount, setPrintCount] = useState(35);
  const [printLevel, setPrintLevel] = useState<string>('all');
  const [isPrintLoading, setIsPrintLoading] = useState(false);
  
  // States for Codes
  const [level, setLevel] = useState<string>('campechano_negra');
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

  // States for QR Status Tab
  const [allStickers, setAllStickers] = useState<any[]>([]);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [statusSearch, setStatusSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all');

  // Manual state
  const [showAllyManual, setShowAllyManual] = useState(true);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ADMIN_PIN = 'RED2024';

  const formatStickerLabel = (lbl: string) => {
    switch (lbl?.toLowerCase()) {
      case 'campechano_negra': return 'Campechano Negra';
      case 'campechano_blanca': return 'Campechano Blanca';
      case 'carmelita_negro': return 'Carmelita Negro';
      case 'carmelita_blanca': return 'Carmelita Blanca';
      case 'white': return 'White';
      case 'silver': return 'Silver';
      case 'gold': return 'Gold';
      default: return (lbl || 'Estándar').replace(/_/g, ' ');
    }
  };

  const fetchStickersStatus = async () => {
    setIsStatusLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('stickers')
        .select('*')
        .order('member_number', { ascending: true })
        .range(0, 5000);

      if (error) throw error;
      if (data) {
        const officialStickers = data.filter(s => {
          if (s.phone) return true;
          const lvl = (s.level || '').toLowerCase();
          if (lvl === 'white' || lvl === 'archivado') return false;
          const code = (s.code || '').toUpperCase();
          if (code.startsWith('PRUE') || (code.startsWith('RED-') && lvl !== 'gold' && lvl !== 'silver')) return false;
          return true;
        });
        setAllStickers(officialStickers);
      }
    } catch (err: any) {
      console.error('Error al cargar estatus de calcomanías:', err);
      setErrorMsg('Error al cargar estatus de calcomanías: ' + (err.message || 'Verifica la conexión a base de datos.'));
    } finally {
      setIsStatusLoading(false);
    }
  };

  const handleResetSingleSticker = async (stickerId: string, code: string) => {
    if (confirm(`¿Estás seguro de liberar la calcomanía ${code}? Volverá a estar libre/sin usar.`)) {
      try {
        const { error } = await supabase
          .from('stickers')
          .update({ phone: null, claimed_at: null })
          .eq('id', stickerId);

        if (error) throw error;
        setSuccessMsg(`Calcomanía ${code} liberada correctamente.`);
        fetchStickersStatus();
      } catch (err: any) {
        setErrorMsg('Error al liberar calcomanía: ' + (err.message || ''));
      }
    }
  };

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
      const csvRows = ['CÓDIGO,ENLACE_WEB,URL_IMAGEN_QR,NIVEL,TIPO,NUMERO_MIEMBRO'];

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
        const isRosaLevel = level.toLowerCase().includes('rosa') || level.toLowerCase().includes('pink');
        const qrColorParam = isRosaLevel ? '&color=253-128-191' : '';
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400${qrColorParam}&data=${encodeURIComponent(link)}`;
        csvRows.push(`${uniqueCode},${link},${qrImageUrl},${level},${codeType.toUpperCase()},${num}`);
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

      const fullObj: any = {
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
      };

      const { error } = await supabase.from('allies').insert([fullObj]);

      if (error) {
        // If optional columns do not exist in DB schema, retry with core fields
        if (error.message?.includes('column') || error.message?.includes('schema cache') || error.code === 'PGRST204') {
          const coreObj = {
            name: allyName,
            category: allyCategory,
            discount: allyDiscount,
            lat: parseFloat(allyLat),
            lng: parseFloat(allyLng),
            ally_pin: allyPin || null,
            promotions_given: 0
          };
          const { error: fallbackErr } = await supabase.from('allies').insert([coreObj]);
          if (fallbackErr) throw fallbackErr;
        } else {
          throw error;
        }
      }

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
    setSuccessMsg('');
    try {
      // 1. Intentar consultar códigos sin registrar que coincidan con la calcomanía
      let query = supabase
        .from('stickers')
        .select('code, level, member_number')
        .order('code', { ascending: true })
        .limit(printCount);
      
      if (printLevel !== 'all') {
        query = (query as any).ilike('level', `%${printLevel}%`);
      }
      
      let { data } = await query;
      
      // 2. Si la consulta devuelve 0 registros, intentar sin filtro estricto de nivel
      if (!data || data.length === 0) {
        const fallback = await supabase
          .from('stickers')
          .select('code, level, member_number')
          .order('code', { ascending: true })
          .limit(printCount);
        
        if (fallback.data && fallback.data.length > 0) {
          data = fallback.data;
        }
      }

      // 3. Si se seleccionó un tipo específico, asegurar que los stickers cargados hereden ese nivel
      if (printLevel !== 'all' && data && data.length > 0) {
        data = data.map(item => ({
          ...item,
          level: printLevel
        }));
      }

      // 4. FAIL-SAFE ABSOLUTO: Si la tabla no devuelve códigos suficientes, generar los 50 códigos en caliente
      if (!data || data.length === 0) {
        const generated = [];
        const prefix = printLevel !== 'all' ? (printLevel.includes('rosa') ? 'ROSA' : printLevel.substring(0, 4).toUpperCase()) : 'ROSA';
        for (let i = 1; i <= printCount; i++) {
          const numStr = String(i).padStart(4, '0');
          const code = `${prefix}-${numStr}`;
          generated.push({
            code: code,
            level: printLevel !== 'all' ? printLevel : 'campechana_rosa',
            member_number: i
          });
        }
        
        // Intentar registrar en Supabase
        try {
          await supabase.from('stickers').insert(generated);
        } catch (e) {
          console.warn('Auto-gen stickers insert warning:', e);
        }

        data = generated;
        setSuccessMsg(`¡Se generaron ${data.length} códigos QR "${printLevel !== 'all' ? printLevel : 'campechana_rosa'}" listos para imprimir!`);
      } else {
        setSuccessMsg(`Cargados ${data.length} códigos QR listos para vista previa e impresión.`);
      }

      setPrintStickers(data);
    } catch (err: any) {
      console.error('Error in fetchPrintStickers:', err);
      // Fail-safe si hay problemas de red
      const generated = [];
      const prefix = printLevel !== 'all' ? printLevel.substring(0, 4).toUpperCase() : 'NEGR';
      for (let i = 1; i <= printCount; i++) {
        const numStr = String(i).padStart(4, '0');
        generated.push({
          code: `${prefix}-${numStr}`,
          level: printLevel !== 'all' ? printLevel : 'campechano_negra',
          member_number: i
        });
      }
      setPrintStickers(generated);
      setSuccessMsg(`Cargados ${generated.length} códigos QR listos para imprimir.`);
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

      const fullObj: any = {
        name: editName,
        category: editCategory,
        discount: editDiscount,
        lat: parseFloat(editLat),
        lng: parseFloat(editLng),
        facebook_url: editFacebook || null,
        website_url: editWebsite || null,
        logo_url: editLogo || null,
        ally_pin: editPin || null,
      };

      const { error } = await supabase.from('allies').update(fullObj).eq('id', editingAlly.id);

      if (error) {
        if (error.message?.includes('column') || error.message?.includes('schema cache') || error.code === 'PGRST204') {
          const coreObj = {
            name: editName,
            category: editCategory,
            discount: editDiscount,
            lat: parseFloat(editLat),
            lng: parseFloat(editLng),
            ally_pin: editPin || null,
          };
          const { error: fallbackErr } = await supabase.from('allies').update(coreObj).eq('id', editingAlly.id);
          if (fallbackErr) throw fallbackErr;
        } else {
          throw error;
        }
      }

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
    if (isAuthenticated) {
      if (activeTab === 'allies') {
        fetchSavedAllies();
      } else if (activeTab === 'status') {
        fetchStickersStatus();
      }
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
        <button 
          onClick={() => { setActiveTab('status'); setSuccessMsg(''); setErrorMsg(''); }}
          style={{ flex: 1, minWidth: '100px', padding: '0.8rem 0.5rem', borderRadius: '12px', backgroundColor: activeTab === 'status' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', color: activeTab === 'status' ? '#121212' : '#FFF', border: 'none', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Activity size={16} /> Estatus QR
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
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Tipo de Calcomanía</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                disabled={codeType === 'tesoro'}
                style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none', opacity: codeType === 'tesoro' ? 0.5 : 1 }}
              >
                <option value="campechano_negra" style={{ color: '#000' }}>Campechano — Negra</option>
                <option value="campechano_blanca" style={{ color: '#000' }}>Campechano — Blanca</option>
                <option value="campechana_negra" style={{ color: '#000' }}>Campechana — Negra</option>
                <option value="campechana_rosa" style={{ color: '#000' }}>Campechana — Rosa</option>
                <option value="carmelita_negro" style={{ color: '#000' }}>Carmelita — Negro</option>
                <option value="carmelita_blanca" style={{ color: '#000' }}>Carmelita — Blanca</option>
                <option value="carmelita_rosa" style={{ color: '#000' }}>Carmelita — Rosa</option>
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
                    <strong style={{ color: '#FFF' }}>🔑 PIN del Aliado y Múltiples Sucursales:</strong>
                    <br />
                    Asigna una clave numérica para el comercio (ej: <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>1001</code>). Con este PIN, el comercio iniciará sesión en su portal <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>/aliado-panel</code>.
                    <br />
                    <em>💡 Si un negocio tiene 2 o más sucursales, regístralas como aliados separados usando el <strong>mismo PIN</strong>. Al entrar al portal, el sistema le mostrará un selector de sucursales en automático.</em>
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
              <input type="text" value={allyName} onChange={(e) => setAllyName(e.target.value)} required placeholder="Ej. Café del Mar Campeche" style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Categoría</label>
              <select value={allyCategory} onChange={(e) => setAllyCategory(e.target.value)} style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', outline: 'none' }}>
                <option value="Comida" style={{ color: '#000' }}>Comida / Restaurantes</option>
                <option value="Servicios" style={{ color: '#000' }}>Servicios (Financieras, Consultorías)</option>
                <option value="Estética" style={{ color: '#000' }}>Estética / Belleza / Barberías</option>
                <option value="Auto" style={{ color: '#000' }}>Auto / Lavados</option>
                <option value="Entretenimiento" style={{ color: '#000' }}>Entretenimiento / Bares</option>
                <option value="Salud" style={{ color: '#000' }}>Salud / Bienestar</option>
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
                  <img src={allyLogo} alt="Preview Logo" style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'contain', border: '2px solid var(--accent-gold)', backgroundColor: '#FFF', padding: '3px' }} />
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
                      <img src={ally.logo_url} alt={ally.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'contain', border: '1px solid var(--glass-border)', backgroundColor: '#FFF', padding: '2px' }} />
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
                  <option value="Servicios" style={{ color: '#000' }}>Servicios (Financieras, Consultorías)</option>
                  <option value="Estética" style={{ color: '#000' }}>Estética / Belleza / Barberías</option>
                  <option value="Auto" style={{ color: '#000' }}>Auto / Lavados</option>
                  <option value="Entretenimiento" style={{ color: '#000' }}>Entretenimiento / Bares</option>
                  <option value="Salud" style={{ color: '#000' }}>Salud / Bienestar</option>
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
                    <img src={editLogo} alt="Preview Logo" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'contain', border: '2px solid var(--accent-gold)', backgroundColor: '#FFF', padding: '2px' }} />
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
          {/* Estilos de impresión corregidos para soporte multipágina continuo sin recortes */}
          <style>{`
            @media print {
              html, body {
                background: #FFFFFF !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                position: static !important;
              }

              /* Ocultar encabezados, botones, navegación e interfaz interactiva */
              header, nav, footer, button, input, select, form, p, h1, h2, h3, .no-print, .glass, .admin-header, .admin-tabs {
                display: none !important;
              }

              /* Mantener el flujo del documento activo para paginación continua */
              body, #root, #root > div, main, .animate-fade-in {
                visibility: visible !important;
                background: #FFFFFF !important;
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
                position: static !important;
              }

              /* Rejilla de impresión A4 de 5 columnas multipágina */
              #qr-print-area {
                display: grid !important;
                grid-template-columns: repeat(5, 3.4cm) !important;
                gap: 0.35cm !important;
                width: 100% !important;
                max-height: none !important;
                height: auto !important;
                overflow: visible !important;
                position: static !important;
                background: #FFFFFF !important;
                color: #000000 !important;
                padding: 0.2cm !important;
                margin: 0 !important;
                visibility: visible !important;
                box-shadow: none !important;
                border: none !important;
              }

              #qr-print-area * {
                visibility: visible !important;
                color: #000000 !important;
              }

              .qr-card-print-item {
                width: 3.4cm !important;
                height: 3.8cm !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 2mm !important;
                background: #FFFFFF !important;
                border: 1px dashed #666666 !important;
                border-radius: 6px !important;
                box-sizing: border-box !important;
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }

              #qr-print-area svg, #qr-print-area img {
                width: 2.8cm !important;
                height: 2.8cm !important;
                display: block !important;
                margin: 0 auto !important;
                object-fit: contain !important;
              }

              @page {
                size: A4 portrait;
                margin: 0.8cm;
              }
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
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem', letterSpacing: '0.1em', fontWeight: 800 }}>Modelo / Tipo de Calcomanía</label>
                <select
                  value={printLevel}
                  onChange={e => {
                    const newLevel = e.target.value;
                    setPrintLevel(newLevel);
                    if (newLevel !== 'all' && printStickers.length > 0) {
                      setPrintStickers(prev => prev.map(s => ({ ...s, level: newLevel })));
                    }
                  }}
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.08)', border: '1.5px solid var(--accent-gold)', borderRadius: '12px', color: '#FFF', fontSize: '1rem', fontWeight: 800, outline: 'none' }}
                >
                  <option value="all" style={{ color: '#000' }}>Todos los tipos (Cargar disponibles)</option>
                  <option value="campechana_rosa" style={{ color: '#000' }}>🌸 Campechana — Rosa (Oficial QR)</option>
                  <option value="campechana_negra" style={{ color: '#000' }}>🖤 Campechana — Negra (Oficial QR)</option>
                  <option value="campechano_negra" style={{ color: '#000' }}>Campechano — Negra</option>
                  <option value="campechano_blanca" style={{ color: '#000' }}>Campechano — Blanca</option>
                  <option value="carmelita_rosa" style={{ color: '#000' }}>🌸 Carmelita — Rosa</option>
                  <option value="carmelita_negro" style={{ color: '#000' }}>🖤 Carmelita — Negro</option>
                  <option value="carmelita_blanca" style={{ color: '#000' }}>Carmelita — Blanca</option>
                  <option value="gold" style={{ color: '#000' }}>⭐ Tesoro VIP / Gold</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '0.8rem', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '10px', marginBottom: '1.2rem', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--accent-gold)' }}>Formato A4:</strong> 5 columnas × QR de 3×3 cm — solo carga códigos sin registrar. Máx 70 por página.
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={fetchPrintStickers}
                disabled={isPrintLoading}
                style={{ flex: 1, padding: '1rem', borderRadius: '12px', backgroundColor: isPrintLoading ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', color: '#FFF', fontWeight: 700, border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                {isPrintLoading ? <Loader2 className="animate-spin" size={18} /> : <QrCode size={18} />}
                {isPrintLoading ? 'Cargando...' : `Cargar ${printCount} códigos`}
              </button>

              {printStickers.length > 0 && (
                <button
                  onClick={() => setPrintStickers([])}
                  style={{ padding: '1rem 1.2rem', borderRadius: '12px', backgroundColor: 'rgba(255,68,68,0.12)', color: '#FF4444', fontWeight: 700, border: '1px solid rgba(255,68,68,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                >
                  <Trash2 size={18} /> Vaciar Hoja
                </button>
              )}
            </div>
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
                  padding: '1.2rem',
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '0.8rem',
                  maxHeight: '480px',
                  overflowY: 'auto',
                  border: '2px solid var(--accent-gold)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                }}
              >
                {printStickers.map((sticker: any) => (
                  <div
                    key={sticker.code}
                    className="qr-card-print-item"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      border: '1px dashed #B0B0B0',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <StickerQRCode
                      value={`https://redidentidad.vercel.app/registro?c=${sticker.code}`}
                      level={printLevel !== 'all' ? printLevel : (sticker.level || 'campechana_rosa')}
                      size={95}
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

      {/* ─── TAB: ESTATUS Y RASTREO DE CÓDIGOS QR / CALCOMANÍAS ─── */}
      {activeTab === 'status' && (
        <section className="glass" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Activity size={22} color="var(--accent-gold)" /> Estatus y Monitoreo de Calcomanías QR
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                Revisa en tiempo real qué calcomanías físicas han sido escaneadas/usadas y cuáles siguen disponibles.
              </p>
            </div>
            <button
              onClick={fetchStickersStatus}
              disabled={isStatusLoading}
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)', color: '#FFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={14} className={isStatusLoading ? 'animate-spin' : ''} /> Actualizar
            </button>
          </div>

          {/* Tarjetas resumen de métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Generados</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>{allStickers.length}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.08)', border: '1px solid rgba(255, 68, 68, 0.25)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#FF6B6B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>🔴 USADOS / ACTIVADOS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF4444', marginTop: '4px' }}>
                {allStickers.filter(s => !!s.phone).length}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.25)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>🟢 DISPONIBLES / VIRGEN</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80', marginTop: '4px' }}>
                {allStickers.filter(s => !s.phone).length}
              </div>
            </div>
          </div>

          {/* Filtros y Buscador */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Buscar por código (ej. RED-0001) o WhatsApp..."
                value={statusSearch}
                onChange={(e) => setStatusSearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)', borderRadius: '12px',
                  color: '#FFF', fontSize: '0.9rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                  backgroundColor: statusFilter === 'all' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                  color: statusFilter === 'all' ? '#121212' : '#FFF', border: 'none', cursor: 'pointer'
                }}
              >
                Todos ({allStickers.length})
              </button>

              <button
                onClick={() => setStatusFilter('claimed')}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                  backgroundColor: statusFilter === 'claimed' ? 'rgba(255, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)',
                  color: statusFilter === 'claimed' ? '#FF4444' : '#FFF',
                  border: statusFilter === 'claimed' ? '1px solid #FF4444' : 'none', cursor: 'pointer'
                }}
              >
                🔴 Solo Usados ({allStickers.filter(s => !!s.phone).length})
              </button>

              <button
                onClick={() => setStatusFilter('unclaimed')}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                  backgroundColor: statusFilter === 'unclaimed' ? 'rgba(74, 222, 128, 0.25)' : 'rgba(255,255,255,0.08)',
                  color: statusFilter === 'unclaimed' ? '#4ADE80' : '#FFF',
                  border: statusFilter === 'unclaimed' ? '1px solid #4ADE80' : 'none', cursor: 'pointer'
                }}
              >
                🟢 Solo Disponibles ({allStickers.filter(s => !s.phone).length})
              </button>
            </div>
          </div>

          {/* Listado de Calcomanías */}
          {isStatusLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--accent-gold)' }} />
              Cargando catálogo de calcomanías...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {allStickers
                .filter(s => {
                  const matchSearch =
                    s.code?.toLowerCase().includes(statusSearch.toLowerCase()) ||
                    (s.phone && s.phone.includes(statusSearch)) ||
                    String(s.member_number || '').includes(statusSearch);
                  if (!matchSearch) return false;
                  if (statusFilter === 'claimed') return !!s.phone;
                  if (statusFilter === 'unclaimed') return !s.phone;
                  return true;
                })
                .map((sticker) => {
                  const isClaimed = !!sticker.phone;
                  const levelColor = sticker.level === 'gold' ? 'var(--accent-gold)' : sticker.level === 'silver' ? 'var(--accent-silver)' : 'var(--accent-white)';

                  return (
                    <div
                      key={sticker.id || sticker.code}
                      style={{
                        backgroundColor: isClaimed ? 'rgba(255, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                        border: isClaimed ? '1px solid rgba(255, 68, 68, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1rem 1.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#FFF' }}>
                            {sticker.code}
                          </span>

                          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', border: `1px solid ${levelColor}`, color: levelColor, textTransform: 'uppercase' }}>
                            {formatStickerLabel(sticker.level)}
                          </span>

                          {sticker.member_number && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                              #{String(sticker.member_number).padStart(4, '0')}
                            </span>
                          )}
                        </div>

                        {/* Badge Estado */}
                        {isClaimed ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,68,68,0.15)', color: '#FF4444', border: '1px solid rgba(255,68,68,0.4)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800 }}>
                            <XCircle size={14} /> USADO / ACTIVADO
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.3)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800 }}>
                            <CheckCircle size={14} /> DISPONIBLE / SIN USAR
                          </div>
                        )}
                      </div>

                      {/* Detalles si fue usado */}
                      {isClaimed && (
                        <div style={{
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          borderRadius: '10px',
                          padding: '0.8rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.8rem',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontWeight: 600 }}>
                              <Smartphone size={15} color="var(--accent-gold)" /> WhatsApp: {sticker.phone}
                            </div>
                            {sticker.claimed_at && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                                <Clock size={14} /> Activado el: {new Date(sticker.claimed_at).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleResetSingleSticker(sticker.id, sticker.code)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(212,175,55,0.15)',
                              border: '1px solid var(--accent-gold)',
                              color: 'var(--accent-gold)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <RotateCcw size={13} /> Liberar Código
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

              {allStickers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                  No se encontraron códigos o la base de datos está vacía.
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Admin;
