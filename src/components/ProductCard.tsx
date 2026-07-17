import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, GitCompareArrows, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Product } from '../data/products';

interface Props { product: Product; index?: number; listView?: boolean; }

export default function ProductCard({ product, index = 0, listView }: Props) {
  const { t, lang, addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useApp();
  const [quickOpen, setQuickOpen] = useState(false);
  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const stockLabel = product.inStock
    ? product.id % 3 === 0
      ? { text: t('⚡ 3 restants', '⚡ 3 left'), color: 'text-amber' }
      : { text: t('En stock', 'In Stock'), color: 'text-emerald' }
    : { text: t('Rupture', 'Out of Stock'), color: 'text-rose' };

  if (listView) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}
        className={`premium-card flex gap-5 p-4 group`}>
        <Link to={`/products/${product.slug}`} className="w-36 h-36 shrink-0 rounded-2xl overflow-hidden bg-gray-50 dark:bg-surface-dark">
          <img src={product.image} alt={product.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {product.badge && <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${product.badge === 'NEW' ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300' : product.badge === 'SALE' ? 'bg-rose/10 text-rose' : 'bg-amber/10 text-amber'}`}>{product.badge === 'SALE' ? `-${discount}%` : product.badge}</span>}
              <span className={`text-[11px] font-semibold ${stockLabel.color}`}>{stockLabel.text}</span>
            </div>
            <Link to={`/products/${product.slug}`} className="font-bold text-gray-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-1">{product.name[lang]}</Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{product.shortDesc[lang]}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-amber text-amber' : 'text-gray-200 dark:text-gray-700'} />)}</div>
              <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">{product.price} <span className="text-xs font-bold text-gray-400">MAD</span></span>
              {product.oldPrice && <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>}
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => toggleWishlist(product.id)} className={`p-2 rounded-lg transition-all ${inWish ? 'bg-rose/10 text-rose' : 'bg-gray-100 dark:bg-surface-dark text-gray-400 hover:text-rose'}`}><Heart size={15} fill={inWish ? 'currentColor' : 'none'} /></button>
              <button onClick={() => addToCart({ id: product.id, name: product.name[lang], price: product.price, image: product.image })} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-lg transition-all hover:shadow-md">{t('Ajouter', 'Add')}</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05, duration: 0.45 }}
      className="premium-card group overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-900/40">
        <Link to={`/products/${product.slug}`}>
          <img src={product.image} alt={product.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        </Link>

        {/* Top row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {product.badge && (
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
                product.badge === 'NEW' ? 'bg-primary-500 text-white' :
                product.badge === 'SALE' ? 'bg-rose text-white' :
                'bg-amber text-white'
              }`}>
                {product.badge === 'SALE' ? `-${discount}%` : product.badge === 'BEST' ? '🔥 BEST' : product.badge}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <button onClick={() => toggleWishlist(product.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm backdrop-blur-md ${inWish ? 'bg-rose text-white' : 'bg-white/80 dark:bg-black/30 text-gray-500 hover:text-rose'}`}>
              <Heart size={14} fill={inWish ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => toggleCompare(product.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm backdrop-blur-md ${inComp ? 'bg-primary-500 text-white' : 'bg-white/80 dark:bg-black/30 text-gray-500 hover:text-primary-500'}`}>
              <GitCompareArrows size={13} />
            </button>
          </div>
        </div>

        {/* Quick View */}
        <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button onClick={() => setQuickOpen(true)} className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl text-[12px] font-bold text-gray-900 dark:text-white hover:bg-primary-500 hover:text-white transition-colors shadow-lg">
            <Eye size={13} /> {t('Aperçu rapide', 'Quick View')}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'fill-amber text-amber' : 'text-gray-200 dark:text-gray-700'} />)}</div>
          <span className="text-[10px] text-gray-400 font-medium">({product.reviewCount})</span>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-[13px] text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">{product.name[lang]}</h3>
        </Link>
        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{product.shortDesc[lang]}</p>

        <div className="flex items-center gap-1.5 mt-1">
          <span className={`text-[10px] font-semibold ${stockLabel.color}`}>● {stockLabel.text}</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-border-dark">
          <div>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">{product.price}</span>
            <span className="text-[11px] font-bold text-gray-400 ml-1">MAD</span>
            {product.oldPrice && <span className="text-[12px] text-gray-400 line-through ml-2">{product.oldPrice}</span>}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart({ id: product.id, name: product.name[lang], price: product.price, image: product.image })}
            className="w-9 h-9 rounded-xl bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-500/20 transition-all">
            <ShoppingCart size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
    <AnimatePresence>
      {quickOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setQuickOpen(false)}>
          <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 12 }} className="bg-white dark:bg-card-dark rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square bg-gray-50 dark:bg-surface-dark">
                <img src={product.image} alt={product.name[lang]} className="w-full h-full object-cover" />
                <button onClick={() => setQuickOpen(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-black/40 text-gray-500 hover:text-rose backdrop-blur-md"><X size={18} /></button>
              </div>
              <div className="p-6 flex flex-col">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-amber text-amber' : 'text-gray-200 dark:text-gray-700'} />)}<span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span></div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{product.name[lang]}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description[lang]}</p>
                <div className="mt-5 flex items-baseline gap-2"><span className="text-3xl font-black text-primary-500">{product.price} MAD</span>{product.oldPrice && <span className="text-gray-400 line-through">{product.oldPrice} MAD</span>}</div>
                <div className="mt-auto pt-6 flex gap-3">
                  <button onClick={() => addToCart({ id: product.id, name: product.name[lang], price: product.price, image: product.image })} className="flex-1 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-black">{t('Ajouter au panier', 'Add to cart')}</button>
                  <Link to={`/products/${product.slug}`} className="px-5 py-3.5 rounded-xl border border-gray-200 dark:border-border-dark text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500">{t('Détails', 'Details')}</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
