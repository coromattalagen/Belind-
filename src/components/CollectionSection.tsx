import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Ring } from './Ring';
import { Sparkle } from './Sparkle';
import {
  CATEGORY_FILTERS,
  PERFUMES,
  type FragranceCategory,
  type PerfumeItem,
} from '../data/perfumes';

interface CollectionSectionProps {
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
}

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CollectionSection({
  onSelectPerfume,
  onAddToCart,
}: CollectionSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FragranceCategory>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepSpacing, setStepSpacing] = useState(300);

  const filteredPerfumes =
    activeCategory === 'all'
      ? PERFUMES
      : PERFUMES.filter((item) => item.category === activeCategory);

  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const total = filteredPerfumes.length;
  const safeActiveIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;

  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 640) {
        setStepSpacing(138);
      } else if (window.innerWidth < 1024) {
        setStepSpacing(250);
      } else {
        setStepSpacing(315);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, []);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (paused || total <= 1 || reduced.current) return;
    const id = window.setInterval(() => setActiveIndex((p) => (p + 1) % total), 5200);
    return () => window.clearInterval(id);
  }, [paused, total, activeIndex]);

  const handleCategoryChange = (catId: FragranceCategory) => {
    setActiveCategory(catId);
    setActiveIndex(0);
  };

  const rotateNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const rotatePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  return (
    <section
      id="collection"
      className="relative py-14 md:py-36 px-4 sm:px-6 md:px-8 bg-[#FAF7F2] overflow-hidden"
    >
      {/* Subtle static ambient light for glossy glass depth without runtime cost */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(197,164,109,0.16)_0%,rgba(38,38,94,0.06)_48%,transparent_72%)]"
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE_LUXURY }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 px-2 md:px-0"
        >
          <div className="relative space-y-3 max-w-xl">
            <Sparkle className="absolute -top-3 right-40" size={14} delay={0.5} />
            <Sparkle className="absolute top-12 -left-4 hidden sm:block" size={9} delay={1.6} color="#B89352" />
            <p className="font-head-sm text-sm text-[#8C6D3B]">
              كتالوج <bdi dir="ltr">:BELIND</bdi> الدوّار
            </p>
            <h2 className="font-display-ar text-[1.75rem] md:text-5xl text-[#1C1917]">
              استعرض التوقيعات العطرية في حلقة العرض
            </h2>
            <p className="text-sm md:text-base text-stone-800">
              مرّر أو أدر الرينج لاختيار عطرك ومراجعة نفحاته وإضافته للحقيبة مباشرة.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="تصنيف العطور"
            className="flex flex-wrap items-center gap-1 p-1.5 glass rounded-2xl self-start lg:self-auto"
          >
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'text-white'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="collection-active-tab"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-[#26265E] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 3D Rotating Ring Stage */}
        <div
          className="relative"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="دولاب عرض عطور بلند"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') rotateNext();
            if (e.key === 'ArrowRight') rotatePrev();
          }}
        >
          <Ring
            key={activeCategory}
            items={filteredPerfumes}
            active={safeActiveIndex}
            radius={stepSpacing * 1.55}
            onActiveChange={setActiveIndex}
            onSelect={onSelectPerfume}
            onAdd={onAddToCart}
          />

          {/* Ring Controls & Quick Perfume Dial */}
          {total > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-full">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={rotatePrev}
                  aria-label="العطر السابق"
                  className="p-2.5 rounded-full bg-white/85 hover:bg-white border border-stone-200 hover:border-[#B89352] text-stone-800 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </motion.button>

                <div className="flex flex-wrap items-center justify-center gap-1 px-2 py-1.5 rounded-2xl sm:rounded-full bg-white/80 border border-stone-200/80 shadow-xs">
                  {filteredPerfumes.map((item, idx) => {
                    const active = idx === safeActiveIndex;
                    const dialLabel =
                      item.id === 'legend-trio' ? 'الأساطير' : item.arabicName;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`الانتقال إلى ${item.arabicName}`}
                        aria-current={active ? 'true' : undefined}
                        className={`relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'text-white'
                            : 'text-stone-800 hover:text-stone-900'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="ring-dial-pill"
                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                            className="absolute inset-0 rounded-full bg-[#26265E]"
                          />
                        )}
                        <span className="relative z-10">{dialLabel}</span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={rotateNext}
                  aria-label="العطر التالي"
                  className="p-2.5 rounded-full bg-white/85 hover:bg-white border border-stone-200 hover:border-[#B89352] text-stone-800 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
