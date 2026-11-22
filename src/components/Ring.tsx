import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue, type PanInfo } from 'motion/react';
import { ShoppingBag, Eye } from 'lucide-react';
import type { PerfumeItem } from '../data/perfumes';
import { Sparkle } from './Sparkle';

const mod = (a: number, n: number) => ((a % n) + n) % n;
const wrap = (o: number, n: number) => mod(o + n / 2, n) - n / 2;
const SPRING = { type: 'spring' as const, stiffness: 150, damping: 24, mass: 0.9 };

interface RingProps {
  items: PerfumeItem[];
  active: number;
  radius: number;
  onActiveChange: (index: number) => void;
  onSelect: (perfume: PerfumeItem) => void;
  onAdd: (perfume: PerfumeItem) => void;
}

/** Continuous 3D ring: the finger/mouse drives a fractional rotation, release snaps with inertia. */
export function Ring({ items, active, radius, onActiveChange, onSelect, onAdd }: RingProps) {
  const n = items.length;
  const rot = useMotionValue(0);
  const dragged = useRef(false);
  const spacing = Math.max(120, radius * 0.85);

  // Keep rotation in sync with buttons / dial / autoplay (shortest path).
  useEffect(() => {
    if (n < 2) return;
    const base = Math.round(rot.get());
    const diff = wrap(active - base, n);
    if (diff !== 0) animate(rot, base + diff, SPRING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const onPan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (n < 2) return;
    if (Math.abs(info.offset.x) > 6) dragged.current = true;
    rot.stop();
    rot.set(rot.get() + info.delta.x / spacing);
  };

  const onPanEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (n < 2) return;
    const base = Math.round(rot.get());
    const projected = Math.round(rot.get() + (info.velocity.x * 0.22) / spacing);
    const target = Math.max(base - 2, Math.min(base + 2, projected));
    animate(rot, target, SPRING);
    onActiveChange(mod(target, n));
    window.setTimeout(() => (dragged.current = false), 80);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onPan={onPan}
      onPanEnd={onPanEnd}
      style={{ perspective: 1400, touchAction: 'pan-y' }}
      className="relative h-[440px] sm:h-[565px] select-none cursor-grab active:cursor-grabbing overflow-visible"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] max-w-[920px] h-[270px] rounded-[50%] border border-[#C5A46D]/30 shadow-[inset_0_0_70px_rgba(197,164,109,0.14)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-[55%] max-w-[520px] h-10 rounded-[50%] bg-[#26265E]/15 blur-2xl"
      />
      {items.map((perfume, index) => (
        <RingCard
          key={perfume.id}
          perfume={perfume}
          index={index}
          n={n}
          rot={rot}
          radius={radius}
          active={active}
          dragged={dragged}
          onActiveChange={onActiveChange}
          onSelect={onSelect}
          onAdd={onAdd}
        />
      ))}
    </motion.div>
  );
}

interface RingCardProps extends Omit<RingProps, 'items' | 'active'> {
  perfume: PerfumeItem;
  index: number;
  n: number;
  rot: MotionValue<number>;
  active: number;
  dragged: React.MutableRefObject<boolean>;
}

function RingCard({ perfume, index, n, rot, radius, active, dragged, onActiveChange, onSelect, onAdd }: RingCardProps) {
  const theta = (v: number) => (wrap(index - v, n) * 2 * Math.PI) / Math.max(n, 4);
  const depth = (v: number) => (Math.cos(theta(v)) + 1) / 2;
  const x = useTransform(rot, (v) => -Math.sin(theta(v)) * radius);
  const z = useTransform(rot, (v) => (Math.cos(theta(v)) - 1) * radius * 0.9);
  const rotateY = useTransform(rot, (v) => (theta(v) * 180) / Math.PI);
  const scale = useTransform(rot, (v) => 0.72 + depth(v) * 0.28);
  const opacity = useTransform(rot, (v) => 0.2 + depth(v) * 0.8);
  const zIndex = useTransform(rot, (v) => Math.round(depth(v) * 30));

  const isCenter = index === active;
  const interactive = n < 3 || Math.abs(wrap(index - active, n)) <= 1;

  const glare = (e: ReactPointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
      <motion.article
        style={{ x, z, rotateY, scale, opacity, zIndex, transformStyle: 'preserve-3d' }}
        aria-hidden={interactive ? undefined : true}
        onPointerMove={glare}
        onClick={() => {
          if (dragged.current) return;
          if (!isCenter) onActiveChange(index);
        }}
        className={`group relative w-[238px] sm:w-[310px] md:w-[350px] rounded-3xl p-3 sm:p-4 glass will-change-transform ${
          interactive ? 'pointer-events-auto' : 'pointer-events-none'
        } ${isCenter ? 'ring-1 ring-[#C5A46D]/55' : 'cursor-pointer'}`}
      >
        <span aria-hidden="true" className="card-glare pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <button
            type="button"
            tabIndex={isCenter ? 0 : -1}
            onClick={(e) => {
              if (!isCenter) return;
              e.stopPropagation();
              onSelect(perfume);
            }}
            aria-label={`عرض تفاصيل عطر ${perfume.arabicName}`}
            className="relative block w-full aspect-square overflow-hidden rounded-2xl bg-[#F3EDE3] border border-white/70"
          >
            <img
              src={perfume.image}
              alt={`عطر ${perfume.arabicName} — ${perfume.latinName}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              width={720}
              height={720}
              draggable={false}
              className={`w-full h-full ${perfume.cropClass} transition-transform duration-700 ease-out ${isCenter ? 'group-hover:scale-[1.06]' : ''}`}
            />
            {isCenter && (
              <>
                <Sparkle className="absolute top-3 right-3 z-20" size={18} delay={0.1} />
                <Sparkle className="absolute top-[38%] left-4 z-20" size={11} delay={1.2} color="#FFFFFF" />
                <Sparkle className="absolute bottom-6 right-[30%] z-20" size={13} delay={2} />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              </>
            )}
          </button>

          <div className="pt-3 sm:pt-5 px-1 space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs text-stone-700">
              <span>{perfume.categoryLabel} · <bdi dir="ltr">{perfume.volumeLabel}</bdi></span>
              <span className="font-brand-latin tracking-wider uppercase text-[#8C6D3B] font-semibold" dir="ltr">{perfume.latinName}</span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display-ar text-[1.5rem] sm:text-[1.9rem] text-stone-900">{perfume.arabicName}</h3>
              <span className="text-lg font-semibold text-[#26265E] tabular-nums">${perfume.priceUsd}</span>
            </div>
            <p className="text-sm text-stone-800 line-clamp-1">{perfume.tagline}</p>
          </div>
        </div>

        <div className="relative z-10 pt-4 mt-4 border-t border-stone-200/70 flex items-center gap-2.5 px-1">
          <button
            type="button"
            tabIndex={isCenter ? 0 : -1}
            onClick={(e) => {
              if (!isCenter) return;
              e.stopPropagation();
              onAdd(perfume);
            }}
            className="btn-shine flex-1 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#26265E] text-white text-sm font-medium cursor-pointer whitespace-nowrap active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>أضف للحقيبة</span>
          </button>
          <button
            type="button"
            tabIndex={isCenter ? 0 : -1}
            onClick={(e) => {
              if (!isCenter) return;
              e.stopPropagation();
              onSelect(perfume);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white border border-stone-200 text-stone-800 text-sm font-medium cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>المكونات</span>
          </button>
        </div>
      </motion.article>
    </div>
  );
}
