import { motion } from 'framer-motion';
import { Award, Heart, Target, Users, Globe, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function About() {
  const { t } = useApp();
  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 glass rounded-full text-white/70 text-[12px] font-bold mb-6">🇲🇦 {t('Notre Histoire', 'Our Story')}</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
              {t('L\'avenir de la', 'The Future of')}<br /><span className="gradient-text">{t('Tech Mobile', 'Mobile Tech')}</span>
            </h1>
            <p className="text-white/50 text-[15px] max-w-xl mx-auto">{t('AZOURA rend la technologie premium accessible à tous au Maroc et en Afrique.', 'AZOURA makes premium technology accessible to everyone in Morocco and Africa.')}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-2">{t('Notre Mission', 'Our Mission')}</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-5">Connect. Charge. Go.</h2>
            <p className="text-gray-500 text-[14px] leading-relaxed mb-4">{t('Chez AZOURA, nous croyons que chaque personne mérite des accessoires mobiles premium. Notre mission : offrir des produits de qualité supérieure à des prix accessibles.', 'At AZOURA, we believe everyone deserves premium mobile accessories. Our mission: offer superior quality products at accessible prices.')}</p>
            <p className="text-gray-500 text-[14px] leading-relaxed mb-6">{t('Fondée à Casablanca, AZOURA s\'est imposée comme la référence des accessoires mobiles au Maroc.', 'Founded in Casablanca, AZOURA has established itself as the reference for mobile accessories in Morocco.')}</p>
            <Link to="/products" className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm hover:gap-3 transition-all">{t('Découvrir nos produits', 'Discover our products')} <ArrowRight size={15} /></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {[{ v: '10K+', l: t('Clients', 'Customers'), icon: <Users size={18} /> }, { v: '50+', l: t('Produits', 'Products'), icon: <Award size={18} /> }, { v: '48h', l: t('Livraison', 'Delivery'), icon: <Zap size={18} /> }, { v: '15+', l: t('Villes', 'Cities'), icon: <Globe size={18} /> }].map((s, i) => (
              <div key={i} className="premium-card p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-3">{s.icon}</div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{s.v}</p><p className="text-[11px] text-gray-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-2">{t('Nos Valeurs', 'Our Values')}</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('Ce qui nous définit', 'What Defines Us')}</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {[{ icon: <Award size={26} />, t1: t('Qualité Premium', 'Premium Quality'), t2: t('Tests rigoureux, matériaux de premier choix, durabilité garantie.', 'Rigorous testing, top-tier materials, guaranteed durability.'), c: '#2563EB' },
              { icon: <Heart size={26} />, t1: t('Passion Client', 'Customer Passion'), t2: t('Satisfaction prioritaire, support 24/7, écoute active.', 'Priority satisfaction, 24/7 support, active listening.'), c: '#F43F5E' },
              { icon: <Target size={26} />, t1: t('Innovation', 'Innovation'), t2: t('Technologies de pointe, design moderne, performance optimale.', 'Cutting-edge tech, modern design, optimal performance.'), c: '#06B6D4' },
            ].map((v, i) => (
              <motion.div key={i} variants={fadeUp} className="premium-card p-7 text-center group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: `${v.c}10`, color: v.c }}>{v.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{v.t1}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{v.t2}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50/50 dark:bg-card-dark">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-2">{t('Parcours', 'Journey')}</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('Étapes clés', 'Milestones')}</h2>
          </motion.div>
          <div className="space-y-4">
            {[{ y: '2022', t1: t('Création d\'AZOURA', 'AZOURA Founded'), t2: t('Lancement à Casablanca — 10 produits', 'Launch in Casablanca — 10 products') },
              { y: '2023', t1: t('Expansion nationale', 'National Expansion'), t2: t('15 villes — 5000 clients', '15 cities — 5000 customers') },
              { y: '2024', t1: t('Collection Premium', 'Premium Collection'), t2: t('Audio & accessoires premium', 'Premium audio & accessories') },
              { y: '2025', t1: t('Leader du marché', 'Market Leader'), t2: t('10K+ clients — Expansion Afrique du Nord', '10K+ customers — North Africa expansion') },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="premium-card flex gap-5 p-5 items-start">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shrink-0"><span className="text-white font-black text-[12px]">{m.y}</span></div>
                <div><h3 className="font-bold text-gray-900 dark:text-white text-[14px] mb-0.5">{m.t1}</h3><p className="text-[13px] text-gray-500">{m.t2}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
