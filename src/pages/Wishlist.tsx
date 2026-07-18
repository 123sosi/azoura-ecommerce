import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Wishlist() {
  const { t, lang, wishlist, toggleWishlist, addToCart, products } = useApp();
  const items = products.filter(p => wishlist.includes(p.id));

  if (items.length === 0) return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-3xl bg-rose/10 text-rose flex items-center justify-center mx-auto mb-5"><Heart size={36} /></div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Liste de souhaits vide', 'Wishlist is empty')}</h2>
        <p className="text-gray-500 text-sm mb-7">{t('Ajoutez vos coups de cœur', 'Add your favorites')}</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20">{t('Explorer', 'Browse')} <ArrowRight size={16} /></Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50 dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('Mes Favoris', 'My Wishlist')}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} {t('article(s)', 'item(s)')}</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {items.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="premium-card group overflow-hidden">
                <Link to={`/products/${p.slug}`} className="block aspect-square overflow-hidden bg-gray-50 dark:bg-surface-dark relative">
                  <img src={p.image} alt={p.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {p.badge && <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold ${p.badge === 'NEW' ? 'bg-primary-500 text-white' : p.badge === 'SALE' ? 'bg-rose text-white' : 'bg-amber text-white'}`}>{p.badge}</span>}
                </Link>
                <div className="p-4">
                  <Link to={`/products/${p.slug}`}><h3 className="font-semibold text-[13px] text-gray-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-1">{p.name[lang]}</h3></Link>
                  <div className="flex gap-0.5 mt-1.5">{[...Array(5)].map((_, j) => <Star key={j} size={11} className={j < Math.floor(p.rating) ? 'fill-amber text-amber' : 'text-gray-200'} />)}<span className="text-[10px] text-gray-400 ml-1">({p.reviewCount})</span></div>
                  <div className="flex items-baseline gap-2 mt-2"><span className="text-lg font-extrabold text-gray-900 dark:text-white">{p.price} <span className="text-[11px] text-gray-400">MAD</span></span>{p.oldPrice && <span className="text-[12px] text-gray-400 line-through">{p.oldPrice}</span>}</div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { addToCart({ id: p.id, name: p.name[lang], price: p.price, image: p.image }); toggleWishlist(p.id); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold rounded-lg transition-all"><ShoppingCart size={13} /> {t('Ajouter', 'Add')}</button>
                    <button onClick={() => toggleWishlist(p.id)} className="p-2.5 rounded-lg bg-rose/10 text-rose hover:bg-rose/20 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
