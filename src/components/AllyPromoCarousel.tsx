import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, Sparkles } from 'lucide-react';
import { parsePromotions } from '../lib/promotionsHelper';

interface AllyPromoCarouselProps {
  promotions?: string[] | string;
  autoPlayInterval?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AllyPromoCarousel: React.FC<AllyPromoCarouselProps> = ({
  promotions: rawPromotions,
  autoPlayInterval = 5000,
  style
}) => {
  const promos: string[] = Array.isArray(rawPromotions)
    ? rawPromotions
    : parsePromotions(rawPromotions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = promos.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % total);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, autoPlayInterval]);

  // Si no hay promociones o solo hay 1, mostrar de forma limpia sin carrusel
  if (total === 0) {
    return (
      <p className="gold-text" style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.6rem', ...style }}>
        Descuento exclusivo Red Identidad
      </p>
    );
  }

  if (total === 1) {
    return (
      <p className="gold-text" style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.6rem', ...style }}>
        {promos[0]}
      </p>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % total);
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 35 : -35,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -35 : 35,
      opacity: 0
    })
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        backgroundColor: 'rgba(212, 175, 55, 0.07)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: '16px',
        padding: '0.75rem 0.9rem',
        marginBottom: '0.8rem',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Barra superior de control: Badge de cantidad y puntos */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '100px',
          backgroundColor: 'rgba(212, 175, 55, 0.2)',
          color: 'var(--accent-gold)',
          fontSize: '0.68rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={11} color="var(--accent-gold)" /> Promo {currentIndex + 1} de {total}
        </div>

        {/* Puntos de navegación */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {promos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => handleDotClick(i, e)}
              aria-label={`Ir a promoción ${i + 1}`}
              style={{
                width: i === currentIndex ? '16px' : '6px',
                height: '6px',
                borderRadius: '100px',
                backgroundColor: i === currentIndex ? 'var(--accent-gold)' : 'rgba(255,255,255,0.25)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Área del texto de la promoción con transición animada */}
      <div style={{ position: 'relative', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ width: '100%' }}
          >
            <p
              className="gold-text"
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                lineHeight: 1.25,
                margin: 0,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px'
              }}
            >
              <Tag size={18} style={{ flexShrink: 0, marginTop: '2px', opacity: 0.85 }} />
              <span>{promos[currentIndex]}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flechas de navegación prev/next */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '6px',
        marginTop: '0.4rem',
        paddingTop: '0.4rem',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginRight: 'auto' }}>
          Toca las flechas para ver más beneficios
        </span>

        <button
          type="button"
          onClick={handlePrev}
          aria-label="Promoción anterior"
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente promoción"
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212,175,55,0.2)',
            border: '1px solid rgba(212,175,55,0.4)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AllyPromoCarousel;
