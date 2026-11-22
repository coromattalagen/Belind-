import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Sparkle } from './Sparkle';
import { PERFUMES, type PerfumeItem } from '../data/perfumes';

interface PerfumeHeroProps {
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
}

const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INGREDIENT_RIBBON = [
  'الليمون المنعش',
  'المانجو الاستوائي',
  'الياسمين الأبيض',
  'العنبر الذهبي',
  'خشب العود',
  'المسك النقي',
  'حبوب التونكا',
  'القرفة الدافئة',
  'الخزامى الجبلي',
  'الفلفل الوردي',
];

export function PerfumeHero({ onSelectPerfume, onAddToCart }: PerfumeHeroProps) {
  const [featuredId, setFeaturedId] = useState<string>('legend-trio');

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const featured =
    PERFUMES.find((item) => item.id === featuredId) ?? PERFUMES[PERFUMES.length - 1];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate bg-[#FAF7F2] border-b border-stone-200/80 overflow-hidden"
    >
      {/* Full-bleed photograph (fades between editions) */}
      <motion.div aria-hidden="true" style={{ y: bgY }} className="absolute inset-0 -z-20 lg:right-auto lg:w-[70%]">
        <AnimatePresence initial={false}>
          <motion.img
            key={featured.id}
            src={featured.heroImage ?? featured.image}
            alt=""
            width={720}
            height={720}
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 1.09 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9, ease: 'easeInOut' }, scale: { duration: 7, ease: EASE_LUXURY } }}
            className="absolute inset-0 w-full h-full object-cover object-[50%_78%] lg:object-[50%_62%]"
          />
        </AnimatePresence>
      </motion.div>

      {/* Fade into the page colour on the text side */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/90 via-[38%] to-transparent lg:hidden" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden lg:block bg-gradient-to-l from-[#FAF7F2] from-[30%] via-[#FAF7F2]/80 via-[48%] to-[#FAF7F2]/0 to-[72%]" />
      {/* Progressive blur behind the copy */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 backdrop-blur-2xl lg:hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_34%,transparent_62%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_34%,transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block backdrop-blur-2xl [mask-image:linear-gradient(to_left,#000_0%,#000_30%,transparent_58%)] [-webkit-mask-image:linear-gradient(to_left,#000_0%,#000_30%,transparent_58%)]"
      />
      {/* Soft bottom fade into the ingredient strip */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 -z-10 bg-gradient-to-t from-[#FAF7F2]/70 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-20 lg:min-h-[720px] flex">
        <Sparkle className="absolute top-8 right-[7%]" size={18} delay={0.3} />
        <Sparkle className="absolute top-[40%] left-[24%] hidden lg:block" size={20} delay={0.8} color="#FFFFFF" />
        <Sparkle className="absolute top-[22%] left-[40%] hidden lg:block" size={11} delay={1.7} color="#E5C990" />
        <Sparkle className="absolute bottom-24 left-[12%] hidden lg:block" size={13} delay={2.3} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_LUXURY }}
              className="space-y-5 md:space-y-8"
            >
              <p className="font-head-sm text-sm text-[#8C6D3B]">
                دار عطور بلند · إصدارات نقية بتركيز Eau de Parfum
              </p>

              <h1 className="font-display-ar text-[2.05rem] sm:text-5xl lg:text-[4.2rem] text-[#1C1917] leading-[1.4]">
                عطورٌ تُصنع بصدق،{' '}
                <span className="text-gold-shimmer">وتُروى كأثرٍ لا يُنسى.</span>
              </h1>

              <p className="text-base md:text-xl text-stone-800 leading-[2] max-w-[34rem]">
                من قلب الشغف ببناء دار عطور عالمية من الصفر، نقدم في{' '}
                <span className="font-brand-latin text-xl text-stone-900" dir="ltr">
                  :BELIND
                </span>{' '}
                توليفات أصلية متوازنة بين الانتعاش الشرقي ودفء العنبر والعود في زجاجات مصقولة سعة ٥٠ مل.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.a
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  href="#collection"
                  className="btn-shine btn-shine-auto inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#26265E] hover:bg-[#1c1c48] text-white text-sm md:text-base font-medium transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  <span>تصفح المجموعة الكاملة</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </motion.a>

                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(featured)}
                  className="px-6 py-3 rounded-full glass hover:bg-white text-stone-900 text-sm md:text-base font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 border border-[#C5A46D]/30"
                >
                  أضف {featured.arabicName} للحقيبة ·{' '}
                  <span className="tabular-nums">${featured.priceUsd}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Interactive Signature Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE_LUXURY }}
              className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-stone-300/60"
            >
              <p className="text-xs font-medium text-stone-800 mb-3">
                معاينة الإصدارات المميزة
              </p>
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="اختيار الإصدار">
                {PERFUMES.map((perfume) => {
                  const isActive = perfume.id === featured.id;
                  return (
                    <button
                      key={perfume.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setFeaturedId(perfume.id)}
                      className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive ? 'text-[#26265E]' : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="hero-selector-bg"
                          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-white/90 border border-[#B89352]/60 shadow-xs"
                        />
                      )}
                      <span className="relative z-10">{perfume.arabicName}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Caption card floating over the photograph */}
          <div className="lg:col-span-6 flex lg:items-end lg:justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_LUXURY }}
                className="glass rounded-3xl p-4 md:p-6 w-full sm:max-w-sm flex items-center justify-between gap-5"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-800">
                    <span className="font-brand-latin text-base text-[#8C6D3B] uppercase tracking-wider" dir="ltr">
                      {featured.latinName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <bdi dir="ltr">{featured.volumeLabel}</bdi>
                  </div>
                  <h2 className="font-display-ar text-[1.65rem] sm:text-[2.1rem] text-stone-900 mt-1 leading-[1.5]">{featured.arabicName}</h2>
                  <p className="text-sm text-stone-700 mt-0.5">{featured.tagline}</p>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelectPerfume(featured)}
                  className="px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-stone-300 hover:border-[#26265E] text-sm font-medium text-stone-800 hover:text-[#26265E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  النوتات
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Subtle Raw Ingredients Atelier Marquee */}
      <div className="marquee-pause border-t border-white/60 glass py-3.5 overflow-hidden select-none" role="presentation">
        <div dir="ltr" className="animate-belind-marquee items-center text-xs md:text-sm text-stone-800 font-medium">
          <div className="flex items-center gap-8 px-4 shrink-0">
            {INGREDIENT_RIBBON.map((note) => (
              <span key={`a-${note}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span>{note}</span>
                <span aria-hidden="true" className="text-[#B89352]">
                  ✦
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-8 px-4 shrink-0" aria-hidden="true">
            {INGREDIENT_RIBBON.map((note) => (
              <span key={`b-${note}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                <span>{note}</span>
                <span className="text-[#B89352]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
