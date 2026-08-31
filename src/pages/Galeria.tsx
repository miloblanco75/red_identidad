import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  Smartphone, 
  Car, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  Info,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UploadStickerPhotoModal } from '../components/UploadStickerPhotoModal';

interface StickerInfo {
  id: string;
  name: string;
  category: 'campechano' | 'campechana' | 'carmelita';
  colorName: string;
  colorType: 'black' | 'white' | 'pink';
  rarity: 'essential' | 'special';
  imagePath: string;
  description: string;
  perk: string;
}

// Catálogo exacto especificado por el cliente (7 opciones reales)
const STICKERS_DATA: StickerInfo[] = [
  // Campechano Soy
  {
    id: 'campechano-blanca',
    name: 'Campechano Soy (Blanca)',
    category: 'campechano',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/campechano_oficial.svg',
    description: 'Edición Blanca oficial de Puerta de Tierra en vinil de alta resistencia para vehículo o cristal.',
    perk: 'Acceso a la Red de Aliados y beneficios en todo el estado.'
  },
  {
    id: 'campechano-negra',
    name: 'Campechano Soy (Negra)',
    category: 'campechano',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/campechano_oficial.svg',
    description: 'Edición Negra mate oficial de Puerta de Tierra con corte de precisión.',
    perk: 'Acceso a la Red de Aliados y beneficios en todo el estado.'
  },

  // Carmelita Soy
  {
    id: 'carmelita-blanca',
    name: 'Carmelita Soy (Blanca)',
    category: 'carmelita',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/carmelita_rosada.png',
    description: 'Edición Carmelita Blanca con el símbolo emblemático del Camarón de la Isla de Carmen.',
    perk: 'Acceso a la Red de Aliados y beneficios en la isla.'
  },
  {
    id: 'carmelita-negra',
    name: 'Carmelita Soy (Negra)',
    category: 'carmelita',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/carmelita_rosada.png',
    description: 'Edición Carmelita Negra mate de alta resistencia.',
    perk: 'Acceso a la Red de Aliados y beneficios en la isla.'
  },
  {
    id: 'carmelita-rosa',
    name: 'Carmelita Soy (Rosa)',
    category: 'carmelita',
    colorName: 'Rosa',
    colorType: 'pink',
    rarity: 'special',
    imagePath: '/carmelita_rosada.png',
    description: 'Edición Carmelita Rosa en vinil pastel con corte de precisión.',
    perk: 'Acceso a la Red de Aliados y promociones especiales en Ciudad del Carmen.'
  },

  // Campechana Soy
  {
    id: 'campechana-negra',
    name: 'Campechana Soy (Negra)',
    category: 'campechana',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/qr_campechana_negra.png',
    description: 'Edición Campechana Negra mate en corte vinil con QR oficial integrado.',
    perk: 'Acceso a la Red de Aliados y descuentos en todo el estado.'
  },
  {
    id: 'campechana-rosa',
    name: 'Campechana Soy (Rosa)',
    category: 'campechana',
    colorName: 'Rosa',
    colorType: 'pink',
    rarity: 'special',
    imagePath: '/qr_campechana_rosa.png',
    description: 'Edición Campechana Rosa de colección con QR oficial inspirada en la calidez campechana.',
    perk: 'Acceso a la Red de Aliados y descuentos en todo el estado.'
  }
];

const Galeria: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'campechano' | 'campechana' | 'carmelita'>('todos');
  const [selectedSticker, setSelectedSticker] = useState<StickerInfo>(STICKERS_DATA[0]);
  const [simulatorMode, setSimulatorMode] = useState<'car' | 'phone'>('car');
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  
  // Simulator adjustment states
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Holographic 3D hover states
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const isUnlocked = (sticker: StickerInfo) => {
    if (!user) return false;
    if (user.code.toUpperCase().includes('FD') || user.level === 'gold') return true;
    if (user.level === 'silver') return true;
    if (user.level === 'white') return sticker.rarity === 'essential';
    return false;
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    setRotateX((yc - y) / 10);
    setRotateY((x - xc) / 10);
    setShineX((x / rect.width) * 100);
    setShineY((y / rect.height) * 100);
    setActiveHoverId(id);
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setActiveHoverId(null);
  };

  // Helper CSS Filter for sticker colors
  const getFilterStyle = (colorType: 'black' | 'white' | 'pink') => {
    switch (colorType) {
      case 'black':
        return {
          filter: 'brightness(0) drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          background: 'none'
        };
      case 'white':
        return {
          filter: 'brightness(0) invert(1) drop-shadow(0 2px 10px rgba(255,255,255,0.7))',
          background: 'none'
        };
      case 'pink':
        return {
          filter: 'drop-shadow(0 2px 8px rgba(244,143,177,0.45))',
          background: 'none'
        };
    }
  };

  // Dynamic card background color so black stickers NEVER get lost!
  const getCardStyle = (colorType: 'black' | 'white' | 'pink', isSelected: boolean) => {
    if (colorType === 'black') {
      return {
        background: isSelected 
          ? 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)' 
          : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
        border: isSelected ? '3px solid #000000' : '2px solid #CBD5E1',
        textColor: '#000000',
        subTextColor: '#334155',
        badgeBg: '#000000',
        badgeText: '#FFFFFF'
      };
    }
    if (colorType === 'pink') {
      return {
        background: isSelected 
          ? 'linear-gradient(135deg, #351C2B 0%, #1A0D15 100%)' 
          : 'linear-gradient(135deg, #25131E 0%, #0E070B 100%)',
        border: isSelected ? '3px solid #F48FB1' : '2px solid rgba(244,143,177,0.4)',
        textColor: '#FFFFFF',
        subTextColor: '#F48FB1',
        badgeBg: 'rgba(244,143,177,0.2)',
        badgeText: '#F48FB1'
      };
    }
    // white
    return {
      background: isSelected 
        ? 'linear-gradient(135deg, #1E1E24 0%, #0F0F14 100%)' 
        : 'linear-gradient(135deg, #141418 0%, #08080A 100%)',
      border: isSelected ? '3px solid var(--accent-gold)' : '2px solid rgba(255,255,255,0.2)',
      textColor: '#FFFFFF',
      subTextColor: 'var(--text-dim)',
      badgeBg: 'rgba(255,255,255,0.15)',
      badgeText: '#FFFFFF'
    };
  };

  const getRarityBadge = (rarity: 'essential' | 'special') => {
    if (rarity === 'special') {
      return (
        <span style={{
          backgroundColor: 'rgba(244, 143, 177, 0.15)',
          color: '#F48FB1',
          border: '1px solid #F48FB1',
          fontSize: '0.65rem',
          padding: '2px 8px',
          borderRadius: '100px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Edición Rosa
        </span>
      );
    }
    return (
      <span style={{
        backgroundColor: 'rgba(245, 245, 247, 0.1)',
        color: 'var(--accent-white)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontSize: '0.65rem',
        padding: '2px 8px',
        borderRadius: '100px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Esencial
      </span>
    );
  };

  const filteredStickers = selectedCategory === 'todos' 
    ? STICKERS_DATA 
    : STICKERS_DATA.filter(s => s.category === selectedCategory);

  const unlockedCount = STICKERS_DATA.filter(isUnlocked).length;

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', paddingBottom: '100px', maxWidth: '500px', margin: '0 auto' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            padding: '0.6rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1 }}>Galería de Distintivos</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Catálogo oficial de diseños disponibles</p>
        </div>
      </header>

      {/* Album Collection Progress */}
      <section className="glass premium-glow-gold" style={{ 
        padding: '1.5rem', 
        borderRadius: '24px', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(20,20,20,0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Colección Estatal</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {unlockedCount} / {STICKERS_DATA.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>obtenidas</span>
            </h2>
          </div>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '50%' }}>
            <Trophy color="var(--accent-gold)" size={24} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.8rem' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / STICKERS_DATA.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent-silver) 0%, var(--accent-gold) 100%)',
              borderRadius: '10px'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>Progreso</span>
          <span>{Math.round((unlockedCount / STICKERS_DATA.length) * 100)}% Completado</span>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="glass" style={{ padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent-gold)" /> Simulador en Vehículo/Celular
          </h3>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '100px' }}>
            <button 
              onClick={() => setSimulatorMode('car')}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                backgroundColor: simulatorMode === 'car' ? 'var(--accent-white)' : 'transparent',
                color: simulatorMode === 'car' ? '#121212' : 'var(--text-dim)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Car size={14} /> Auto
            </button>
            <button 
              onClick={() => setSimulatorMode('phone')}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                backgroundColor: simulatorMode === 'phone' ? 'var(--accent-white)' : 'transparent',
                color: simulatorMode === 'phone' ? '#121212' : 'var(--text-dim)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Smartphone size={14} /> Celular
            </button>
          </div>
        </div>

        {/* Visual Mockup Container with dynamic background according to colorType */}
        <div style={{ 
          position: 'relative', 
          height: '240px', 
          backgroundColor: selectedSticker.colorType === 'black' ? '#F1F5F9' : '#0c0c0e', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
          transition: 'background-color 0.4s ease'
        }}>
          {simulatorMode === 'car' ? (
            /* CAR GLASS MOCKUP */
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                width: '100%', 
                height: '30px', 
                backgroundColor: selectedSticker.colorType === 'black' ? '#CBD5E1' : '#1a1a20', 
                borderBottom: '2px solid #94A3B8' 
              }}></div>
              
              {/* Glass area: light glass if sticker is black, dark glass if white/pink */}
              <div style={{ 
                width: '85%', 
                height: '70%', 
                backgroundColor: selectedSticker.colorType === 'black' ? '#E2E8F0' : selectedSticker.colorType === 'pink' ? '#231822' : '#141e24', 
                border: '3px solid #64748B', 
                borderRadius: '12px', 
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden', 
                position: 'relative',
                transition: 'background-color 0.4s ease'
              }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ width: '100%', height: '1px', backgroundColor: selectedSticker.colorType === 'black' ? '#475569' : '#ff8800' }}></div>)}
                </div>
                
                {/* Simulated Sticker (Draggable) */}
                <motion.div 
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -60, bottom: 60 }}
                  style={{ 
                    cursor: 'grab', 
                    touchAction: 'none', 
                    scale: scale,
                    rotate: `${rotation}deg`,
                    width: '110px',
                    height: '110px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <img 
                    src={selectedSticker.imagePath} 
                    alt="Sticker Preview"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      ...getFilterStyle(selectedSticker.colorType)
                    }}
                  />
                </motion.div>
                
                <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.65rem', color: selectedSticker.colorType === 'black' ? '#475569' : 'rgba(255,255,255,0.4)', pointerEvents: 'none', fontWeight: 600 }}>
                  Arrastra el distintivo para acomodarlo
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '35px', backgroundColor: selectedSticker.colorType === 'black' ? '#CBD5E1' : '#1c1c24', borderTop: '2px solid #94A3B8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '40%', height: '4px', backgroundColor: '#334155', borderRadius: '2px', transform: 'rotate(-15deg)', marginRight: '20px' }}></div>
              </div>
            </div>
          ) : (
            /* PHONE CASE MOCKUP */
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                width: '125px', 
                height: '210px', 
                backgroundColor: selectedSticker.colorType === 'black' ? '#FFFFFF' : selectedSticker.colorType === 'pink' ? '#2D1D27' : '#1E1E22', 
                borderRadius: '24px', 
                border: selectedSticker.colorType === 'black' ? '4px solid #CBD5E1' : '4px solid #3A3A3C', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'background-color 0.4s ease'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  left: '10px', 
                  width: '44px', 
                  height: '44px', 
                  backgroundColor: selectedSticker.colorType === 'black' ? '#E2E8F0' : '#151518', 
                  borderRadius: '10px',
                  border: '1px solid #94A3B8',
                  padding: '4px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px'
                }}>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%' }}></div>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%' }}></div>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%' }}></div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <motion.div 
                    drag
                    dragConstraints={{ left: -30, right: 30, top: -40, bottom: 40 }}
                    style={{ 
                      cursor: 'grab', 
                      touchAction: 'none', 
                      scale: scale * 0.85,
                      rotate: `${rotation}deg`,
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      marginTop: '30px'
                    }}
                  >
                    <img 
                      src={selectedSticker.imagePath} 
                      alt="Sticker Preview"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        ...getFilterStyle(selectedSticker.colorType)
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sliders */}
        <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: '60px' }}>Tamaño</span>
            <input 
              type="range" 
              min="0.6" 
              max="1.6" 
              step="0.05"
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-gold)', height: '4px', borderRadius: '2px' }}
            />
            <button onClick={() => setScale(1)} style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>Reset</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: '60px' }}>Rotación</span>
            <input 
              type="range" 
              min="-180" 
              max="180" 
              step="5"
              value={rotation} 
              onChange={(e) => setRotation(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-gold)', height: '4px', borderRadius: '2px' }}
            />
            <button onClick={() => setRotation(0)} style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>Reset</button>
          </div>
        </div>
      </section>

      {/* Selected Sticker Info Card */}
      <AnimatePresence mode="wait">
        <motion.section 
          key={selectedSticker.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="glass" 
          style={{ 
            padding: '1.5rem', 
            borderRadius: '24px', 
            marginBottom: '2rem',
            border: `1px solid ${selectedSticker.colorType === 'pink' ? 'rgba(244,143,177,0.3)' : 'var(--glass-border)'}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedSticker.name}</h3>
                {isUnlocked(selectedSticker) ? (
                  <CheckCircle size={16} color="#4ade80" />
                ) : (
                  <Lock size={14} color="var(--text-dim)" />
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                {selectedSticker.category === 'carmelita' ? 'Laguna de Términos (Isla)' : 'Campeche Histórico'}
              </span>
            </div>
            {getRarityBadge(selectedSticker.rarity)}
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-white)', lineHeight: 1.55, marginBottom: '1rem' }}>
            {selectedSticker.description}
          </p>

          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            padding: '1rem', 
            borderRadius: '12px', 
            borderLeft: `3px solid ${selectedSticker.colorType === 'pink' ? '#F48FB1' : 'var(--accent-gold)'}`,
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <Info size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>Beneficio Activo</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--accent-white)', fontWeight: 600 }}>{selectedSticker.perk}</p>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Category Filter Tabs */}
      <section style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {(['todos', 'campechano', 'campechana', 'carmelita'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '9px 16px',
                borderRadius: '100px',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? '#121212' : 'var(--text-dim)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--glass-border)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {cat === 'todos' ? 'Todas' : cat === 'campechano' ? 'Campechano Soy' : cat === 'campechana' ? 'Campechana Soy' : 'Carmelita Soy'}
            </button>
          ))}
        </div>
      </section>

      {/* Sticker Catalog Grid with DYNAMIC LIGHT/DARK CARDS */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {filteredStickers.map(sticker => {
            const unlocked = isUnlocked(sticker);
            const isSelected = selectedSticker.id === sticker.id;
            const isHovered = activeHoverId === sticker.id;
            const cardTheme = getCardStyle(sticker.colorType, isSelected);

            return (
              <motion.div
                key={sticker.id}
                onClick={() => {
                  setSelectedSticker(sticker);
                  setScale(1);
                  setRotation(0);
                }}
                onMouseMove={(e) => handleCardMouseMove(e, sticker.id)}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  perspective: 1000,
                  cursor: 'pointer'
                }}
              >
                <motion.div
                  style={{
                    borderRadius: '22px',
                    padding: '1.2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '175px',
                    background: cardTheme.background,
                    border: cardTheme.border,
                    boxShadow: isSelected 
                      ? '0 10px 28px rgba(0,0,0,0.5)' 
                      : 'none',
                    transformStyle: 'preserve-3d',
                    transform: isHovered 
                      ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` 
                      : 'rotateX(0deg) rotateY(0deg)',
                    transition: isHovered ? 'none' : 'transform 0.5s ease'
                  }}
                >
                  {/* Holographic reflection */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`,
                      pointerEvents: 'none',
                      zIndex: 3
                    }} />
                  )}

                  {/* Lock Overlay */}
                  {!unlocked && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      padding: '4px',
                      borderRadius: '50%',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={12} color={cardTheme.subTextColor} />
                    </div>
                  )}

                  {/* Sticker Graphic Container */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: unlocked ? 1 : 0.35,
                    marginBottom: '0.8rem',
                    transform: 'translateZ(20px)'
                  }}>
                    <img
                      src={sticker.imagePath}
                      alt={sticker.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        ...getFilterStyle(sticker.colorType)
                      }}
                    />
                  </div>

                  {/* Details with Contrast Colors */}
                  <div style={{ 
                    textAlign: 'center', 
                    width: '100%',
                    transform: 'translateZ(10px)'
                  }}>
                    <div style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 800, 
                      color: cardTheme.textColor,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {sticker.category === 'carmelita' ? 'Carmelita' : sticker.category === 'campechana' ? 'Campechana' : 'Campechano'}
                    </div>
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: cardTheme.subTextColor, 
                      fontWeight: 700,
                      marginTop: '2px'
                    }}>
                      Edición {sticker.colorName}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Banner CTA para subir foto del distintivo */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="glass premium-glow-gold"
          style={{
            marginTop: '2rem',
            padding: '1.4rem',
            borderRadius: '20px',
            textAlign: 'center',
            border: '1px solid rgba(212,175,55,0.3)',
            backgroundColor: 'rgba(20,20,22,0.85)'
          }}
        >
          <Camera size={26} color="var(--accent-gold)" style={{ margin: '0 auto 8px' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
            ¿Ya pegaste tu distintivo en tu coche, laptop o teléfono?
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', marginBottom: '1.2rem', maxWidth: '420px', margin: '0 auto 1.2rem' }}>
            Muestra tu orgullo campechano a toda la comunidad. Sube tu foto y forma parte de nuestra galería.
          </p>
          <button
            onClick={() => setShowUploadPhotoModal(true)}
            style={{
              padding: '0.9rem 1.4rem',
              borderRadius: '14px',
              backgroundColor: 'var(--accent-gold)',
              color: '#121212',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={16} /> Subir Mi Foto 📸
          </button>
        </motion.div>
      </section>

      <UploadStickerPhotoModal isOpen={showUploadPhotoModal} onClose={() => setShowUploadPhotoModal(false)} />
    </div>
  );
};

export default Galeria;
