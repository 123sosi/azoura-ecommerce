import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotFound() {
  const { t } = useApp();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-dark px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }} className="text-[120px] sm:text-[160px] font-black leading-none gradient-text mb-2">404</motion.div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Page non trouvée', 'Page Not Found')}</h1>
        <p className="text-gray-500 text-sm mb-7">{t('Cette page n\'existe pas ou a été déplacée.', 'This page doesn\'t exist or has been moved.')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:scale-[1.03]"><Home size={16} /> {t('Accueil', 'Home')}</Link>
          <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 border border-gray-200 dark:border-border-dark text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-hover-dark transition-all">{t('Produits', 'Products')} <ArrowRight size={16} /></Link>
        </div>
      </motion.div>
    </div>
  );
}
