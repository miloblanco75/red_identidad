import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  Smartphone, 
  Car, 
  Lock, 
  Unlock, 
  CheckCircle, 
  ArrowLeft, 
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface StickerInfo {
  id: string;
  name: string;
  category: 'campechano' | 'campechana' | 'carmelita';
  colorName: string;
  colorType: 'black' | 'white' | 'gold' | 'pink';
  rarity: 'essential' | 'special' | 'vip';
  imagePath: string;
  description: string;
  perk: string;
}

const STICKERS_DATA: StickerInfo[] = [
  // Campechano Soy
  {
    id: 'campechano-negra',
    name: 'Campechano Soy (Negro Mate)',
    category: 'campechano',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/campechano_negra_publicidad.png',
    description: 'Edición Esencial en corte vinil negro mate. Elegancia y sobriedad para cualquier superficie.',
    perk: 'Acceso a la Red de Aliados y 10% de descuento general.'
  },
  {
    id: 'campechano-blanca',
    name: 'Campechano Soy (Blanco Brillante)',
    category: 'campechano',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/campechano_negra_publicidad.png',
    description: 'Edición Esencial en blanco brillante. Máximo contraste y visibilidad en vidrios templados.',
    perk: 'Acceso a la Red de Aliados y 10% de descuento general.'
  },

  // Campechana Soy
  {
    id: 'campechana-rosada',
    name: 'Campechana Soy (Rosa Edición Especial)',
    category: 'campechana',
    colorName: 'Rosada',
    colorType: 'pink',
    rarity: 'special',
    imagePath: '/campechana_rosada.png',
    description: 'Edición Especial en rosa pastel brillante. Inspirada en los atardeceres campechanos y el patrimonio histórico.',
    perk: '15% de descuento en comercios de repostería, moda y spas aliados.'
  },
  {
    id: 'campechana-dorada',
    name: 'Campechana Soy (Oro VIP)',
    category: 'campechana',
    colorName: 'Dorada',
    colorType: 'gold',
    rarity: 'vip',
    imagePath: '/campechana_oro.png',
    description: 'Edición VIP de colección en oro texturizado. Símbolo de orgullo peninsular y estatus máximo en la Red.',
    perk: 'Edición Limitada (Próximamente): Acceso al Salón VIP Dorado, tratos preferenciales y preventas exclusivas.'
  },

  // Carmelita Soy
  {
    id: 'carmelita-negra',
    name: 'Carmelita Soy (Negro Mate)',
    category: 'carmelita',
    colorName: 'Negra',
    colorType: 'black',
    rarity: 'essential',
    imagePath: '/carmelita_negra_publicidad.png',
    description: 'Edición Esencial con el emblemático camarón de Carmen en negro mate.',
    perk: 'Acceso a la Red de Aliados y beneficios exclusivos en la isla.'
  },
  {
    id: 'carmelita-blanca',
    name: 'Carmelita Soy (Blanco Brillante)',
    category: 'carmelita',
    colorName: 'Blanca',
    colorType: 'white',
    rarity: 'essential',
    imagePath: '/carmelita_negra_publicidad.png',
    description: 'Edición Esencial en blanco brillante. Destaca tu orgullo carmelita en tu automóvil.',
    perk: 'Acceso a la Red de Aliados y beneficios exclusivos en la isla.'
  },
  {
    id: 'carmelita-rosada',
    name: 'Carmelita Soy (Rosa Especial)',
    category: 'carmelita',
    colorName: 'Rosada',
    colorType: 'pink',
    imagePath: '/carmelita_rosada.png',
    rarity: 'special',
    description: 'Edición Especial en rosa orquídea con el emblemático camarón de la Laguna de Términos.',
    perk: '15% de descuento en aliados seleccionados en Ciudad del Carmen.'
  },
  {
    id: 'carmelita-dorada',
    name: 'Carmelita Soy (Oro VIP)',
    category: 'carmelita',
    colorName: 'Dorada',
    colorType: 'gold',
    rarity: 'vip',
    imagePath: '/carmelita_oro.png',
    description: 'Edición VIP de colección en oro cepillado. El máximo estatus para los fundadores y aliados de la isla de Carmen.',
    perk: 'Edición Limitada (Próximamente): Salón VIP Dorado, tratos preferenciales y eventos especiales.'
  }
];

const Galeria: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'campechano' | 'campechana' | 'carmelita'>('todos');
  const [selectedSticker, setSelectedSticker] = useState<StickerInfo>(STICKERS_DATA[0]); // Default to first sticker
  const [simulatorMode, setSimulatorMode] = useState<'car' | 'phone'>('car');
  
  // Simulator state variables for sticker adjustments
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Holographic card shine state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  // Determine if user has unlocked a specific sticker
  const isUnlocked = (sticker: StickerInfo) => {
    if (!user) return false; // Guest mode - show all as locked (demo mode available)
    
    // Admin or Founders have all unlocked
    if (user.code.toUpperCase().includes('FD') || user.level === 'gold') {
      return true;
    }

    // Normal user logic
    if (user.level === 'silver') {
      return sticker.rarity === 'essential' || sticker.rarity === 'special';
    }

    if (user.level === 'white') {
      return sticker.rarity === 'essential';
    }

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

  // CSS Filter Helper - Drop shadows & clean color tinting for transparent PNGs
  const getFilterStyle = (colorType: 'black' | 'white' | 'gold' | 'pink') => {
    switch (colorType) {
      case 'black':
        return {
          filter: 'brightness(0) drop-shadow(0 4px 10px rgba(0,0,0,0.8))',
          background: 'none'
        };
      case 'white':
        return {
          filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(255,255,255,0.7))',
          background: 'none'
        };
      case 'pink':
        return {
          filter: 'drop-shadow(0 4px 10px rgba(244,143,177,0.45))',
          background: 'none'
        };
      case 'gold':
        return {
          filter: 'drop-shadow(0 6px 14px rgba(212,175,55,0.5))',
          background: 'none'
        };
    }
  };

  const getRarityBadge = (rarity: 'essential' | 'special' | 'vip') => {
    switch (rarity) {
      case 'vip':
        return (
          <span style={{
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--accent-gold)',
            border: '1px solid var(--accent-gold)',
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '100px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            ORO VIP (PRÓXIMAMENTE)
          </span>
        );
      case 'special':
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
            Especial
          </span>
        );
      case 'essential':
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
    }
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
            border: '1px solid var(--glass-border)'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.1 }}>Galería Pass</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Colección de estampas phygitales de la Red</p>
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Álbum de Identidad</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
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
          <span>Progreso de Colección</span>
          <span>{Math.round((unlockedCount / STICKERS_DATA.length) * 100)}% Completado</span>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="glass" style={{ padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent-gold)" /> Simulador Phygital
          </h3>
          {/* Controls to toggle simulator background */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '100px' }}>
            <button 
              onClick={() => setSimulatorMode('car')}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                backgroundColor: simulatorMode === 'car' ? 'var(--accent-white)' : 'transparent',
                color: simulatorMode === 'car' ? '#121212' : 'var(--text-dim)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s'
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
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.3s'
              }}
            >
              <Smartphone size={14} /> Celular
            </button>
          </div>
        </div>

        {/* Visual Mockup Container */}
        <div style={{ 
          position: 'relative', 
          height: '240px', 
          backgroundColor: '#0c0c0e', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
        }}>
          {simulatorMode === 'car' ? (
            /* CAR GLASS MOCKUP */
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {/* Car Roof & Rear Hatch silhouette */}
              <div style={{ position: 'absolute', top: 0, width: '100%', height: '30px', backgroundColor: '#1a1a20', borderBottom: '2px solid #2a2a35' }}></div>
              {/* Glass area */}
              <div style={{ width: '85%', height: '70%', backgroundColor: '#141e24', border: '3px solid #222', borderRadius: '12px', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {/* Windshield defroster lines */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ width: '100%', height: '1px', backgroundColor: '#ff8800' }}></div>)}
                </div>
                {/* Glass reflection */}
                <div style={{ position: 'absolute', top: 0, left: '-50%', width: '200%', height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)', transform: 'skewX(-30deg)', pointerEvents: 'none' }}></div>
                
                {/* Simulated Sticker (Draggable!) */}
                <motion.div 
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -60, bottom: 60 }}
                  style={{ 
                    cursor: 'grab', 
                    touchAction: 'none', 
                    scale: scale,
                    rotate: `${rotation}deg`,
                    width: '100px',
                    height: '100px',
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
                
                {/* Drag Tip */}
                <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
                  Arrastra el sticker para acomodarlo
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '35px', backgroundColor: '#1c1c24', borderTop: '2px solid #2e2e3a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* Simulated car wiper */}
                <div style={{ width: '40%', height: '4px', backgroundColor: '#111', borderRadius: '2px', transform: 'rotate(-15deg)', marginRight: '20px' }}></div>
              </div>
            </div>
          ) : (
            /* PHONE CASE MOCKUP */
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Premium Phone Body */}
              <div style={{ 
                width: '120px', 
                height: '210px', 
                backgroundColor: '#1E1E22', 
                borderRadius: '24px', 
                border: '4px solid #3A3A3C', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Apple / Premium camera module */}
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  left: '10px', 
                  width: '44px', 
                  height: '44px', 
                  backgroundColor: '#151518', 
                  borderRadius: '10px',
                  border: '1px solid #2C2C2E',
                  padding: '4px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2px'
                }}>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%', border: '2px solid #222' }}></div>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%', border: '2px solid #222' }}></div>
                  <div style={{ width: '14px', height: '14px', backgroundColor: '#000', borderRadius: '50%', border: '2px solid #222' }}></div>
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#555', borderRadius: '50%', margin: '4px auto 0' }}></div>
                </div>

                {/* Glass reflection on case */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }}></div>

                {/* Draggable Sticker on Case */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <motion.div 
                    drag
                    dragConstraints={{ left: -30, right: 30, top: -40, bottom: 40 }}
                    style={{ 
                      cursor: 'grab', 
                      touchAction: 'none', 
                      scale: scale * 0.8,
                      rotate: `${rotation}deg`,
                      width: '75px',
                      height: '75px',
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

        {/* Sticker adjustment slider controls */}
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
              style={{ flex: 1, accentColor: 'var(--accent-gold)', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
            <button 
              onClick={() => setScale(1)}
              style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600 }}
            >
              Reset
            </button>
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
              style={{ flex: 1, accentColor: 'var(--accent-gold)', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
            <button 
              onClick={() => setRotation(0)}
              style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600 }}
            >
              Reset
            </button>
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
            border: `1px solid ${selectedSticker.rarity === 'vip' ? 'rgba(212,175,55,0.3)' : 'var(--glass-border)'}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedSticker.name}</h3>
                {isUnlocked(selectedSticker) ? (
                  <CheckCircle size={16} color="#4ade80" />
                ) : (
                  <Lock size={14} color="var(--text-dim)" />
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {selectedSticker.category === 'carmelita' ? 'Laguna de Términos (Isla)' : 'Campeche Histórico'}
              </span>
            </div>
            {getRarityBadge(selectedSticker.rarity)}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-white)', lineHeight: 1.5, marginBottom: '1rem' }}>
            {selectedSticker.description}
          </p>

          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            padding: '1rem', 
            borderRadius: '12px', 
            borderLeft: `3px solid ${selectedSticker.rarity === 'vip' ? 'var(--accent-gold)' : selectedSticker.rarity === 'special' ? '#F48FB1' : 'var(--accent-white)'}`,
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <Info size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>Beneficio Físico Activo</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-white)' }}>{selectedSticker.perk}</p>
            </div>
          </div>

          {!isUnlocked(selectedSticker) && (
            <button 
              onClick={() => navigate('/registro')}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: selectedSticker.rarity === 'vip' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                color: selectedSticker.rarity === 'vip' ? '#121212' : '#FFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                marginTop: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Unlock size={16} /> Registrar Código para Desbloquear
            </button>
          )}
        </motion.section>
      </AnimatePresence>

      {/* Category Tabs */}
      <section style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
          {(['todos', 'campechana', 'carmelita'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? '#121212' : 'var(--text-dim)',
                border: selectedCategory === cat ? 'none' : '1px solid var(--glass-border)',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
                transition: 'all 0.3s'
              }}
            >
              {cat === 'todos' ? 'Todas' : cat === 'carmelita' ? 'Carmelita Soy' : 'Campechana Soy'}
            </button>
          ))}
        </div>
      </section>

      {/* Sticker Catalog Grid */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {filteredStickers.map(sticker => {
            const unlocked = isUnlocked(sticker);
            const isSelected = selectedSticker.id === sticker.id;
            const isHovered = activeHoverId === sticker.id;

            return (
              <motion.div
                key={sticker.id}
                onClick={() => {
                  setSelectedSticker(sticker);
                  // Reset adjustment offsets when changing stickers
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
                    borderRadius: '20px',
                    padding: '1.2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '170px',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(40,40,40,0.95) 0%, rgba(20,20,20,0.95) 100%)' 
                      : 'linear-gradient(135deg, rgba(30,30,30,0.7) 0%, rgba(15,15,15,0.85) 100%)',
                    border: isSelected 
                      ? `2px solid ${sticker.rarity === 'vip' ? 'var(--accent-gold)' : sticker.rarity === 'special' ? '#F48FB1' : 'var(--accent-white)'}` 
                      : '1px solid var(--glass-border)',
                    boxShadow: isSelected 
                      ? `0 8px 24px rgba(0,0,0,0.6)` 
                      : 'none',
                    transformStyle: 'preserve-3d',
                    transform: isHovered 
                      ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` 
                      : 'rotateX(0deg) rotateY(0deg)',
                    transition: isHovered ? 'none' : 'transform 0.5s ease'
                  }}
                >
                  {/* Holographic reflection effect for hover */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)`,
                      pointerEvents: 'none',
                      zIndex: 3
                    }} />
                  )}

                  {/* Lock Overlay for locked stickers */}
                  {!unlocked && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '4px',
                      borderRadius: '50%',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={12} color="var(--text-dim)" />
                    </div>
                  )}

                  {/* Sticker Graphic Container */}
                  <div style={{
                    width: '75px',
                    height: '75px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: unlocked ? 1 : 0.25,
                    filter: unlocked ? 'none' : 'grayscale(1) contrast(0.8)',
                    transition: 'all 0.5s ease',
                    marginBottom: '1rem',
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

                  {/* Sticker details */}
                  <div style={{ 
                    textAlign: 'center', 
                    width: '100%',
                    transform: 'translateZ(10px)'
                  }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: unlocked ? 'var(--accent-white)' : 'var(--text-dim)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {sticker.category === 'carmelita' ? 'Carmelita' : sticker.category === 'campechana' ? 'Campechana' : 'Campechano'}
                    </div>
                    <div style={{ 
                      fontSize: '0.65rem', 
                      color: sticker.rarity === 'vip' ? 'var(--accent-gold)' : sticker.rarity === 'special' ? '#F48FB1' : 'var(--text-dim)', 
                      fontWeight: 600,
                      marginTop: '2px'
                    }}>
                      {sticker.colorName}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Galeria;
