import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Battery, Headphones, Smartphone, Cable, Layers, Truck, Shield, CreditCard, Award, MessageCircle, Star, ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Send, BadgeCheck, Quote, Clock, Flame, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories, reviews } from '../data/products';
import ProductCard from '../components/ProductCard';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const catIcons: Record<string, React.ReactNode> = { Zap: <Zap size={26} />, BatteryFull: <Battery size={26} />, Cable: <Cable size={26} />, Headphones: <Headphones size={26} />, Smartphone: <Smartphone size={26} />, Layers: <Layers size={26} /> };

// Minimal glowing particles for the hero background (static positions — cheap, GPU-only animations)
const HERO_PARTICLES = [
  { left: '12%', top: '22%', size: 4, dur: 4.5, delay: 0 },
  { left: '85%', top: '18%', size: 3, dur: 5.2, delay: 0.6 },
  { left: '92%', top: '62%', size: 5, dur: 4.8, delay: 1.1 },
  { left: '6%', top: '68%', size: 3, dur: 5.6, delay: 0.3 },
  { left: '48%', top: '10%', size: 3, dur: 4.2, delay: 0.9 },
  { left: '38%', top: '85%', size: 4, dur: 5.0, delay: 1.4 },
];

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`py-20 lg:py-28 ${className}`}>{children}</section>;
}
function SectionHeader({ sub, title, desc }: { sub?: string; title: string; desc?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
      {sub && <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-2">{sub}</p>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-gray-900 dark:text-white leading-tight">{title}</h2>
      {desc && <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto text-[15px] leading-relaxed">{desc}</p>}
    </motion.div>
  );
}

// Countdown timer
function Countdown() {
  const [time, setTime] = useState({ h: 11, m: 42, s: 37 });
  useEffect(() => {
    const iv = setInterval(() => setTime(p => {
      let { h, m, s } = p;
      s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; m = 59; s = 59; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex gap-2">{Object.entries(time).map(([k, v]) => (
      <div key={k} className="flex flex-col items-center">
        <span className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-lg font-black">{String(v).padStart(2, '0')}</span>
        <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">{k === 'h' ? 'Hrs' : k === 'm' ? 'Min' : 'Sec'}</span>
      </div>
    ))}</div>
  );
}

// Social proof toast
function SocialProofToast({ t: tr }: { t: (f: string, e: string) => string }) {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);
  const buyers = [
    { name: 'Ahmed B.', city: 'Casablanca', product: tr('Power Bank 20000mAh', 'Power Bank 20000mAh') },
    { name: 'Sara M.', city: 'Rabat', product: tr('Écouteurs Pro', 'Pro Earbuds') },
    { name: 'Karim A.', city: 'Marrakech', product: tr('Chargeur 65W', '65W Charger') },
  ];
  useEffect(() => {
    const show1 = setTimeout(() => setShow(true), 8000);
    const iv = setInterval(() => { setShow(false); setTimeout(() => { setCurrent(p => (p + 1) % buyers.length); setShow(true); }, 400); }, 12000);
    return () => { clearTimeout(show1); clearInterval(iv); };
  }, []);
  if (!show) return null;
  return (
    <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} className="fixed bottom-24 left-4 z-30 p-3 pr-5 rounded-2xl bg-white dark:bg-card-dark shadow-2xl border border-gray-100 dark:border-border-dark flex items-center gap-3 max-w-xs">
      <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center shrink-0"><Check size={18} /></div>
      <div>
        <p className="text-[12px] font-bold text-gray-900 dark:text-white">{buyers[current].name} — {buyers[current].city}</p>
        <p className="text-[11px] text-gray-500">{tr('vient d\'acheter', 'just purchased')} {buyers[current].product}</p>
        <p className="text-[10px] text-gray-400">{tr('il y a quelques minutes', 'a few minutes ago')}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { t, lang, isDark, products } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const heroProduct = products.find(p => p.slug === 'power-bank-20000mah') || products[0];
 if (!heroProduct) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Chargement...
    </div>
  );
}
  const featured = products.slice(0, 8);
  const bestSellers = products.filter(p => p.badge === 'BEST' || p.rating >= 4.7).slice(0, 8);
  const newArrivals = products.filter(p => p.badge === 'NEW');
  const flashDeals = products.filter(p => p.oldPrice).slice(0, 4);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 310, behavior: 'smooth' });
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div>
      <SocialProofToast t={t} />

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[680px] max-h-[1000px] flex items-center overflow-hidden hero-gradient">
        {/* Background — dark blue gradient (via .hero-gradient), soft radial lights, minimal particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[14%] left-[6%] w-[520px] h-[520px] bg-primary-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[10%] right-[6%] w-[440px] h-[440px] bg-accent/10 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/[0.05] rounded-full blur-[220px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
          {HERO_PARTICLES.map((p, i) => (
            <motion.span key={i} className="absolute rounded-full bg-white/60" style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ opacity: [0.1, 0.6, 0.1], y: [0, -14, 0] }} transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }} />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* LEFT — Text */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left order-2 lg:order-1">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-white/70 text-[12px] font-semibold mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                {t('Marque Tech Premium Marocaine', 'Premium Moroccan Tech Brand')}
              </motion.div>

              <h1 className="font-black text-white leading-[0.98] tracking-tight text-[3rem] sm:text-[3.8rem] lg:text-[4.5rem]">
                <motion.span variants={fadeUp} className="block">{t('Connectez.', 'Connect.')}</motion.span>
                <motion.span variants={fadeUp} className="block gradient-text">{t('Chargez.', 'Charge.')}</motion.span>
                <motion.span variants={fadeUp} className="block">{t('Partez.', 'Go.')}</motion.span>
              </h1>

              <motion.p variants={fadeUp} className="text-[15px] sm:text-base text-white/50 mt-6 mb-9 leading-relaxed max-w-md mx-auto lg:mx-0">
                {t('Accessoires de charge premium conçus pour un style de vie moderne. Chargeurs rapides, power banks et essentiels du quotidien.', 'Premium charging accessories designed for modern lifestyles. Fast charging, power banks and everyday essentials.')}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-9">
                <Link to="/products" className="group relative overflow-hidden flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-primary-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-[1.04] active:scale-[0.97]">
                  <span className="relative z-10 flex items-center gap-2">
                    {t('Voir la Collection', 'Shop Collection')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link to="/about" className="px-8 py-4 glass text-white/80 font-semibold text-sm rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.97]">
                  {t('En Savoir Plus', 'Learn More')}
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-white/40 text-[12.5px] font-medium">
                <span className="flex items-center gap-1.5"><Star size={13} className="fill-amber text-amber" /> 4.9/5 {t('Note', 'Rating')}</span>
                <span className="flex items-center gap-1.5"><Truck size={13} /> {t('Livraison Gratuite', 'Free Shipping')}</span>
                <span className="flex items-center gap-1.5"><Shield size={13} /> {t('Garantie 2 Ans', '2-Year Warranty')}</span>
                <span className="flex items-center gap-1.5"><Zap size={13} /> {t('Livraison Rapide', 'Fast Delivery')}</span>
              </motion.div>
            </motion.div>

            {/* RIGHT — Single floating hero product */}
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.8, ease: 'easeOut' }}
              className="relative order-1 lg:order-2 flex items-center justify-center h-[260px] sm:h-[380px] lg:h-[560px]">
              {/* premium lighting glow */}
              <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] bg-primary-500/20 rounded-full blur-[100px]" />
              <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] bg-accent/15 rounded-full blur-[80px] translate-x-8 translate-y-8" />

              {/* floating + subtle rotation */}
              <motion.div animate={{ y: [0, -18, 0], rotate: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
                <img
                  src={heroProduct.image}
                  alt={heroProduct.name[lang]}
                  loading="eager"
                  className="w-[180px] sm:w-[260px] lg:w-[380px] h-auto object-cover rounded-[28px] shadow-[0_35px_70px_rgba(0,0,0,0.55)]"
                />
                {/* soft light sweep for premium sheen */}
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/10 pointer-events-none" />
              </motion.div>

              {/* realistic ground shadow */}
              <div className="absolute bottom-2 sm:bottom-6 lg:bottom-10 w-[140px] sm:w-[200px] lg:w-[240px] h-6 sm:h-7 bg-black/40 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5">
          <span className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]">{t('Défiler', 'Scroll')}</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={18} className="text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sub={t('Catégories', 'Categories')} title={t('Explorez nos Catégories', 'Explore Categories')} desc={t('Trouvez exactement ce dont vous avez besoin', 'Find exactly what you need')} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link to={`/products?category=${cat.id}`} className="premium-card flex flex-col items-center gap-3 p-6 text-center group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: `${cat.color}10`, color: cat.color }}>{catIcons[cat.icon]}</div>
                  <div>
                    <p className="font-bold text-[13px] text-gray-900 dark:text-white">{cat.name[lang]}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{cat.count} {t('produits', 'products')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sub={t('Collection', 'Collection')} title={t('Produits en Vedette', 'Featured Products')} desc={t('Notre sélection des meilleurs accessoires premium', 'Our selection of the best premium accessories')} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-bold rounded-xl transition-all hover:scale-[1.03] shadow-lg">
              {t('Voir tout', 'View All')} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ FLASH DEALS ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-rose font-bold text-[13px] uppercase tracking-[0.15em] mb-1 flex items-center gap-1.5"><Flame size={14} /> {t('Offres Flash', 'Flash Deals')}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{t('Ventes Flash', 'Flash Sales')}</h2>
              <p className="text-gray-500 mt-2 text-[14px]">{t('Offres limitées — Ne les manquez pas !', 'Limited offers — Don\'t miss out!')}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Clock size={15} /> {t('Se termine dans', 'Ends in')}</span>
              <Countdown />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {flashDeals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </Section>

      {/* ══════════════ PROMO BANNER ══════════════ */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent p-10 sm:p-14 lg:p-16">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/10 rounded-full blur-2xl" />
            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-[11px] font-bold mb-4">{t('OFFRE LIMITÉE', 'LIMITED OFFER')}</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                {t('Jusqu\'à', 'Up to')} <span className="text-yellow-300">40%</span> {t('de réduction', 'off')}
              </h2>
              <p className="text-white/60 text-[14px] mb-7">{t('Sur notre collection Power Banks et Chargeurs.', 'On our Power Banks and Chargers collection.')}</p>
              <Link to="/products?category=power-banks" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-600 font-bold text-sm rounded-xl shadow-2xl hover:bg-gray-50 transition-all hover:scale-[1.03]">
                {t('Profiter maintenant', 'Shop Now')} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ BEST SELLERS ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-1">{t('Meilleures ventes', 'Best Sellers')}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{t('Les Plus Populaires', 'Most Popular')}</h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all text-gray-500"><ChevronLeft size={18} /></button>
              <button onClick={() => scroll(1)} className="w-10 h-10 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark flex items-center justify-center hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all text-gray-500"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory -mx-1 px-1">
            {bestSellers.map((p, i) => <div key={p.id} className="w-[260px] shrink-0 snap-start"><ProductCard product={p} index={i} /></div>)}
          </div>
        </div>
      </Section>

      {/* ══════════════ NEW ARRIVALS ══════════════ */}
      {newArrivals.length > 0 && (
        <Section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader sub={t('Nouveautés', 'New Arrivals')} title={t('Dernières Nouveautés', 'Latest Arrivals')} desc={t('Les derniers produits ajoutés à notre collection', 'The latest additions to our collection')} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">{newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        </Section>
      )}

      {/* ══════════════ BRAND STORY ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-2">AZOURA</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5">{t('Une marque née de la passion pour la technologie', 'A brand born from a passion for technology')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-[14px] leading-relaxed mb-5">{t('Fondée à Casablanca, AZOURA s\'engage à rendre la technologie premium accessible à tous au Maroc. Chaque produit est sélectionné pour sa qualité exceptionnelle.', 'Founded in Casablanca, AZOURA is committed to making premium technology accessible to everyone in Morocco. Every product is selected for its exceptional quality.')}</p>
              <Link to="/about" className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm hover:gap-3 transition-all">{t('En savoir plus', 'Learn more')} <ArrowRight size={15} /></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {[{ v: '10K+', l: t('Clients satisfaits', 'Happy customers'), icon: <MessageCircle size={18} /> }, { v: '50+', l: t('Produits premium', 'Premium products'), icon: <Award size={18} /> }, { v: '48h', l: t('Livraison rapide', 'Fast delivery'), icon: <Truck size={18} /> }, { v: '4.8★', l: t('Note moyenne', 'Average rating'), icon: <Star size={18} /> }].map((s, i) => (
                <div key={i} className="premium-card p-5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-3">{s.icon}</div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{s.v}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════════ WHY CHOOSE US ══════════════ */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sub="AZOURA" title={t('Pourquoi Nous Choisir ?', 'Why Choose Us?')} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: <Truck size={22} />, t1: t('Livraison Express', 'Express Delivery'), t2: t('24-48h au Maroc', '24-48h in Morocco'), c: '#2563EB' },
              { icon: <CreditCard size={22} />, t1: t('Paiement Flexible', 'Flexible Payment'), t2: t('Carte, COD, virement', 'Card, COD, transfer'), c: '#06B6D4' },
              { icon: <Shield size={22} />, t1: t('Garantie 2 Ans', '2 Year Warranty'), t2: t('Remplacement gratuit', 'Free replacement'), c: '#10B981' },
              { icon: <Award size={22} />, t1: t('Qualité Premium', 'Premium Quality'), t2: t('Certifié & testé', 'Certified & tested'), c: '#8B5CF6' },
              { icon: <MessageCircle size={22} />, t1: t('Support 24/7', '24/7 Support'), t2: t('WhatsApp & email', 'WhatsApp & email'), c: '#F43F5E' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="premium-card p-6 text-center group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" style={{ background: `${item.c}10`, color: item.c }}>{item.icon}</div>
                <h3 className="font-bold text-[13px] text-gray-900 dark:text-white mb-1">{item.t1}</h3>
                <p className="text-[11px] text-gray-500">{item.t2}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ REVIEWS ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sub={t('Témoignages', 'Testimonials')} title={t('Ce que disent nos Clients', 'What Customers Say')} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-5">
            {reviews.map(r => (
              <motion.div key={r.id} variants={fadeUp} className="premium-card p-6 relative">
                <Quote size={28} className="text-primary-100 dark:text-primary-500/10 absolute top-5 right-5" />
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={13} className={j < r.rating ? 'fill-amber text-amber' : 'text-gray-200'} />)}</div>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed mb-5">"{r.text[lang]}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent text-white font-bold text-[12px] flex items-center justify-center">{r.avatar}</div>
                  <div>
                    <p className="font-bold text-[13px] text-gray-900 dark:text-white">{r.name}</p>
                    {r.verified && <p className="text-[10px] text-primary-500 font-semibold flex items-center gap-0.5"><BadgeCheck size={11} /> {t('Acheteur vérifié', 'Verified')}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ BRANDS ══════════════ */}
      <Section className="!py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-8">{t('Compatible avec', 'Compatible with')}</p>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16 opacity-30">
            {['Apple', 'Samsung', 'Google', 'Xiaomi', 'Huawei', 'OnePlus'].map(b => <span key={b} className="text-xl sm:text-2xl font-black text-gray-400 dark:text-gray-600 tracking-tight">{b}</span>)}
          </div>
        </div>
      </Section>

      {/* ══════════════ INSTAGRAM ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sub="Instagram" title={t('Suivez @azoura.ma', 'Follow @azoura.ma')} />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
            {products.slice(0, 6).map((p, i) => (
              <motion.a key={i} href="#" initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="aspect-square rounded-2xl overflow-hidden group relative">
                <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/30 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl">♥</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════ NEWSLETTER ══════════════ */}
      <Section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-gray-800 p-10 sm:p-14 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/8 rounded-full -translate-y-1/2 blur-[100px]" />
            <div className="relative z-10 max-w-md mx-auto">
              <p className="text-primary-400 font-bold text-[12px] uppercase tracking-widest mb-2">Newsletter</p>
              <h2 className="text-3xl font-extrabold text-white mb-3">{t('Restez Informé', 'Stay Updated')}</h2>
              <p className="text-gray-400 text-[14px] mb-7">{t('Offres exclusives et nouveautés directement dans votre boîte mail.', 'Exclusive offers and new arrivals in your inbox.')}</p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald/10 text-emerald rounded-xl font-bold text-sm">✓ {t('Merci !', 'Thanks!')}</div>
              ) : (
                <div className="flex gap-2.5 max-w-sm mx-auto">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <button onClick={() => email && setSubscribed(true)} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center gap-1.5"><Send size={14} /></button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ FAQ ══════════════ */}
      <Section className="bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader sub="FAQ" title={t('Questions Fréquentes', 'Frequently Asked Questions')} />
          <FAQSection t={t} isDark={isDark} />
        </div>
      </Section>
    </div>
  );
}

function FAQSection({ t }: { t: (f: string, e: string) => string; isDark: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: t('Quels sont les délais de livraison ?', 'What are delivery times?'), a: t('24-48h pour les grandes villes, 3-5 jours pour les autres régions. Livraison gratuite dès 299 MAD.', '24-48h for major cities, 3-5 days for other regions. Free shipping over 299 MAD.') },
    { q: t('Comment fonctionne le paiement à la livraison ?', 'How does cash on delivery work?'), a: t('Vous payez en espèces au livreur à la réception de votre commande. Disponible partout au Maroc.', 'You pay cash to the courier upon receiving your order. Available across Morocco.') },
    { q: t('Quelle est votre politique de retour ?', 'What is your return policy?'), a: t('30 jours pour retourner un produit dans son emballage d\'origine. Remboursement complet garanti.', '30 days to return a product in its original packaging. Full refund guaranteed.') },
    { q: t('Les produits sont-ils sous garantie ?', 'Are products under warranty?'), a: t('Tous nos produits bénéficient d\'une garantie officielle de 2 ans avec remplacement gratuit.', 'All our products come with an official 2-year warranty with free replacement.') },
  ];
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className={`premium-card overflow-hidden`}>
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white pr-4">{f.q}</span>
            <ChevronRight size={16} className={`text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
          </button>
          {open === i && <div className="px-5 pb-4"><p className="text-[13px] text-gray-500 leading-relaxed">{f.a}</p></div>}
        </div>
      ))}
    </div>
  );
}
