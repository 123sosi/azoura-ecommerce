import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check, ChevronRight, GitCompareArrows, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang, isDark, addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, addRecentlyViewed, recentlyViewed, products } = useApp();
  const product = products.find(p => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'faq'>('desc');
  const [zoom, setZoom] = useState(false);

  useEffect(() => { if (product) addRecentlyViewed(product.id); window.scrollTo(0, 0); }, [product, addRecentlyViewed]);

  if (!product) return (
    <div className="min-h-screen pt-32 text-center"><p className="text-5xl mb-4">😕</p>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('Produit non trouvé', 'Product not found')}</h2>
      <Link to="/products" className="text-primary-500 font-semibold hover:underline">{t('Voir les produits', 'View products')}</Link>
    </div>
  );

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recentProducts = recentlyViewed.filter(id => id !== product.id).slice(0, 4).map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-[13px] text-gray-400 mb-7 flex-wrap">
          <Link to="/" className="hover:text-primary-500 transition-colors">{t('Accueil', 'Home')}</Link><ChevronRight size={12} />
          <Link to="/products" className="hover:text-primary-500 transition-colors">{t('Produits', 'Products')}</Link><ChevronRight size={12} />
          <span className="text-gray-700 dark:text-gray-200 font-medium">{product.name[lang]}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
            <div className={`relative aspect-square rounded-3xl overflow-hidden mb-4 cursor-zoom-in ${isDark ? 'bg-card-dark' : 'bg-gray-50'}`} onClick={() => setZoom(!zoom)}>
              <img src={product.images[selectedImage]} alt={product.name[lang]} className={`w-full h-full object-cover transition-transform duration-500 ${zoom ? 'scale-150' : 'scale-100'}`} />
              {product.badge && <div className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[11px] font-bold ${product.badge === 'NEW' ? 'bg-primary-500 text-white' : product.badge === 'SALE' ? 'bg-rose text-white' : 'bg-amber text-white'}`}>{product.badge === 'SALE' ? `-${discount}%` : product.badge}</div>}
            </div>
            <div className="flex gap-2.5">{product.images.map((img, i) => (
              <button key={i} onClick={() => { setSelectedImage(i); setZoom(false); }} className={`w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary-500 shadow-md shadow-primary-500/20' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600 opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}</div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={15} className={i < Math.floor(product.rating) ? 'fill-amber text-amber' : 'text-gray-200 dark:text-gray-700'} />)}</div>
              <span className="text-[13px] text-gray-500 font-medium">{product.rating} ({product.reviewCount} {t('avis', 'reviews')})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{product.name[lang]}</h1>
            <p className="text-gray-500 text-[14px] mb-5">{product.shortDesc[lang]}</p>

            <div className="flex items-baseline gap-3 mb-7">
              <span className="text-3xl font-black text-gray-900 dark:text-white">{product.price} <span className="text-base font-bold text-gray-400">MAD</span></span>
              {product.oldPrice && <><span className="text-lg text-gray-400 line-through">{product.oldPrice}</span><span className="px-2.5 py-0.5 bg-rose/10 text-rose text-[12px] font-bold rounded-lg">-{discount}%</span></>}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2.5">{t('Couleur', 'Color')}: <span className="text-gray-400 font-normal">{product.colors[selectedColor].name}</span></p>
                <div className="flex gap-2">{product.colors.map((c, i) => (
                  <button key={i} onClick={() => setSelectedColor(i)} className={`w-9 h-9 rounded-xl border-2 transition-all ${selectedColor === i ? 'border-primary-500 ring-2 ring-primary-500/20 scale-110' : 'border-gray-200 dark:border-gray-600 hover:scale-105'}`} style={{ background: c.hex }} />
                ))}</div>
              </div>
            )}

            {/* Qty + Actions */}
            <div className="flex flex-wrap gap-2.5 mb-7">
              <div className={`flex items-center rounded-xl border ${isDark ? 'border-border-dark' : 'border-gray-200'}`}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 dark:hover:bg-hover-dark rounded-l-xl"><Minus size={15} /></button>
                <span className="w-10 text-center font-bold text-gray-900 dark:text-white text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50 dark:hover:bg-hover-dark rounded-r-xl"><Plus size={15} /></button>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => addToCart({ id: product.id, name: product.name[lang], price: product.price, image: product.image }, quantity)}
                className="flex-1 flex items-center justify-center gap-2 px-7 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 transition-all">
                <ShoppingCart size={17} /> {t('Ajouter au panier', 'Add to Cart')}
              </motion.button>
              <button onClick={() => toggleWishlist(product.id)} className={`p-3 rounded-xl border transition-all ${inWish ? 'bg-rose/10 border-rose/20 text-rose' : 'border-gray-200 dark:border-border-dark text-gray-400 hover:text-rose'}`}><Heart size={18} fill={inWish ? 'currentColor' : 'none'} /></button>
              <button onClick={() => toggleCompare(product.id)} className={`p-3 rounded-xl border transition-all ${inComp ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20 text-primary-500' : 'border-gray-200 dark:border-border-dark text-gray-400 hover:text-primary-500'}`}><GitCompareArrows size={17} /></button>
              <button className="p-3 rounded-xl border border-gray-200 dark:border-border-dark text-gray-400 hover:text-gray-600 transition-all"><Share2 size={17} /></button>
            </div>

            {/* Trust */}
            <div className={`grid grid-cols-3 gap-2 p-4 rounded-2xl mb-7 ${isDark ? 'bg-card-dark border border-border-dark' : 'bg-gray-50 border border-gray-100'}`}>
              {[{ icon: <Truck size={16} />, l: t('Livraison 24-48h', '24-48h Delivery') }, { icon: <Shield size={16} />, l: t('Garantie 2 ans', '2Y Warranty') }, { icon: <RotateCcw size={16} />, l: t('Retour 30 jours', '30 Day Return') }].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5"><div className="text-primary-500">{item.icon}</div><span className="text-[10px] font-semibold text-gray-500">{item.l}</span></div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-1.5">{product.features[lang].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-300"><Check size={15} className="text-emerald shrink-0" /> {f}</div>
            ))}</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className={`flex gap-1 p-1 rounded-xl w-fit mb-7 ${isDark ? 'bg-card-dark' : 'bg-gray-100'}`}>
            {([['desc', t('Description', 'Description')], ['specs', t('Spécifications', 'Specs')], ['reviews', t('Avis', 'Reviews')], ['faq', 'FAQ']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setActiveTab(k)} className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === k ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>{l}</button>
            ))}
          </div>
          {activeTab === 'desc' && <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">{product.description[lang]}</p>}
          {activeTab === 'specs' && (
            <div className="premium-card !rounded-2xl overflow-hidden max-w-2xl">{product.specs.map((s, i) => (
              <div key={i} className={`flex px-5 py-3 text-[13px] ${i % 2 === 0 ? 'bg-gray-50 dark:bg-surface-dark' : ''} ${i < product.specs.length - 1 ? 'border-b border-gray-100 dark:border-border-dark' : ''}`}>
                <span className="w-40 font-semibold text-gray-900 dark:text-white">{s.label}</span><span className="text-gray-500">{s.value}</span>
              </div>
            ))}</div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-3 max-w-2xl">{[{ n: 'Mohammed K.', r: 5, t2: t('Excellent produit !', 'Excellent product!') }, { n: 'Sara L.', r: 4, t2: t('Bon rapport qualité/prix.', 'Good value.') }, { n: 'Omar B.', r: 5, t2: t('Qualité premium. Je recommande.', 'Premium quality.') }].map((rv, i) => (
              <div key={i} className="premium-card !rounded-2xl p-5">
                <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, j) => <Star key={j} size={13} className={j < rv.r ? 'fill-amber text-amber' : 'text-gray-200'} />)}</div>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-2">"{rv.t2}"</p>
                <p className="text-[12px] font-bold text-gray-900 dark:text-white">{rv.n}</p>
              </div>
            ))}</div>
          )}
          {activeTab === 'faq' && (
            <div className="space-y-3 max-w-2xl">
              {[{ q: t('Ce produit est-il sous garantie ?', 'Is this product under warranty?'), a: t('Oui, garantie 2 ans avec remplacement gratuit.', 'Yes, 2 year warranty with free replacement.') },
                { q: t('Livraison disponible partout au Maroc ?', 'Delivery available across Morocco?'), a: t('Oui, livraison 24-48h dans les grandes villes.', 'Yes, 24-48h delivery in major cities.') }
              ].map((f, i) => (<div key={i} className="premium-card !rounded-2xl p-5"><p className="font-semibold text-[13px] text-gray-900 dark:text-white mb-1">{f.q}</p><p className="text-[13px] text-gray-500">{f.a}</p></div>))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-7">{t('Produits similaires', 'Related Products')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">{related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-7">{t('Récemment consultés', 'Recently Viewed')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">{recentProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
