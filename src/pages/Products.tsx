import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { t, lang, isDark, searchQuery, setSearchQuery, products } = useApp();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [stockOnly, setStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 9;
  const activeCategory = params.get('category') || '';

  const filtered = useMemo(() => {
    let r = [...products];
    if (activeCategory) r = r.filter(p => p.category === activeCategory);
    if (searchQuery) { const q = searchQuery.toLowerCase(); r = r.filter(p => p.name.fr.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q) || p.shortDesc.fr.toLowerCase().includes(q) || p.shortDesc.en.toLowerCase().includes(q)); }
    r = r.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (stockOnly) r = r.filter(p => p.inStock);
    switch (sort) { case 'price-asc': r.sort((a, b) => a.price - b.price); break; case 'price-desc': r.sort((a, b) => b.price - a.price); break; case 'rating': r.sort((a, b) => b.rating - a.rating); break; case 'newest': r.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0)); break; }
    return r;
  }, [activeCategory, searchQuery, sort, priceRange, stockOnly]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const setCat = (c: string) => { if (c) params.set('category', c); else params.delete('category'); setParams(params); setPage(1); };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{activeCategory ? categories.find(c => c.id === activeCategory)?.name[lang] || t('Produits', 'Products') : t('Tous les Produits', 'All Products')}</h1>
          <p className="text-gray-500 mt-1 text-sm">{filtered.length} {t('produits', 'products')}</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="premium-card !rounded-2xl flex flex-wrap gap-3 items-center justify-between p-3 mb-7">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }} placeholder={t('Rechercher...', 'Search...')} className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-surface-dark text-white placeholder-gray-500 border border-border-dark' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select value={sort} onChange={e => setSort(e.target.value)} className={`appearance-none pl-3 pr-8 py-2.5 rounded-xl text-[13px] font-medium focus:outline-none cursor-pointer ${isDark ? 'bg-surface-dark text-white border border-border-dark' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                <option value="featured">{t('En vedette', 'Featured')}</option>
                <option value="price-asc">{t('Prix ↑', 'Price ↑')}</option>
                <option value="price-desc">{t('Prix ↓', 'Price ↓')}</option>
                <option value="rating">{t('Mieux notés', 'Top Rated')}</option>
                <option value="newest">{t('Nouveautés', 'Newest')}</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className={`flex rounded-xl overflow-hidden border ${isDark ? 'border-border-dark' : 'border-gray-200'}`}>
              <button onClick={() => setView('grid')} className={`p-2.5 ${view === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-surface-dark text-gray-400'}`}><Grid3X3 size={15} /></button>
              <button onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-50 dark:bg-surface-dark text-gray-400'}`}><List size={15} /></button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2.5 rounded-xl bg-primary-500 text-white"><SlidersHorizontal size={15} /></button>
          </div>
        </motion.div>

        <div className="flex gap-7">
          {/* Sidebar */}
          <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className={`w-60 shrink-0 ${showFilters ? 'fixed inset-0 z-50 w-full bg-black/50 lg:static lg:bg-transparent flex' : 'hidden lg:block'}`}>
            <div className={`premium-card !rounded-2xl p-5 space-y-6 ${showFilters ? 'w-80 h-full overflow-y-auto' : ''}`}>
              {showFilters && <div className="flex items-center justify-between lg:hidden"><h3 className="font-bold text-gray-900 dark:text-white">{t('Filtres', 'Filters')}</h3><button onClick={() => setShowFilters(false)}><X size={18} /></button></div>}

              <div>
                <h4 className="font-bold text-[12px] text-gray-900 dark:text-white mb-3 uppercase tracking-wider">{t('Catégories', 'Categories')}</h4>
                <div className="space-y-1">
                  <button onClick={() => setCat('')} className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${!activeCategory ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-hover-dark'}`}>{t('Tous', 'All')} ({products.length})</button>
                  {categories.map(c => <button key={c.id} onClick={() => setCat(c.id)} className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${activeCategory === c.id ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-hover-dark'}`}>{c.name[lang]} ({products.filter(p => p.category === c.id).length})</button>)}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[12px] text-gray-900 dark:text-white mb-3 uppercase tracking-wider">{t('Prix', 'Price')}</h4>
                <input type="range" min={0} max={1000} value={priceRange[1]} onChange={e => { setPriceRange([0, +e.target.value]); setPage(1); }} className="w-full accent-primary-500" />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1"><span>0 MAD</span><span className="font-bold text-primary-500">{priceRange[1]} MAD</span></div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={stockOnly} onChange={e => { setStockOnly(e.target.checked); setPage(1); }} className="accent-primary-500 rounded" />
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{t('En stock uniquement', 'In stock only')}</span>
                </label>
              </div>
            </div>
            {showFilters && <div className="flex-1 lg:hidden" onClick={() => setShowFilters(false)} />}
          </motion.aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="text-center py-20"><p className="text-5xl mb-4">🔍</p><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('Aucun produit trouvé', 'No products found')}</h3><p className="text-gray-500 text-sm">{t('Essayez de modifier vos filtres', 'Try adjusting your filters')}</p></div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">{paginated.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
            ) : (
              <div className="space-y-3">{paginated.map((p, i) => <ProductCard key={p.id} product={p} index={i} listView />)}</div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">{Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25' : 'bg-gray-50 dark:bg-card-dark text-gray-500 border border-gray-200 dark:border-border-dark hover:border-primary-300'}`}>{i + 1}</button>
              ))}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
