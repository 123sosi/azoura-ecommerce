import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingCart, Menu, X, Sun, Moon, ChevronDown, Zap, Battery, Headphones, Cable, Smartphone, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/products';

const ANNOUNCEMENTS_FR = [
  '🚚 Livraison gratuite à partir de 299 DH',
  '💳 Paiement à la livraison disponible partout au Maroc',
  '🔒 Paiement 100% sécurisé — Visa, Mastercard, CMI',
  '⭐ Garantie officielle de 2 ans sur tous les produits',
  '⚡ Livraison express 24-48h — Casablanca, Rabat, Marrakech',
];
const ANNOUNCEMENTS_EN = [
  '🚚 Free shipping on orders over 299 DH',
  '💳 Cash on delivery available across Morocco',
  '🔒 100% Secure payment — Visa, Mastercard, CMI',
  '⭐ Official 2-year warranty on all products',
  '⚡ Express delivery 24-48h — Casablanca, Rabat, Marrakech',
];

const catIconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={18} />, BatteryFull: <Battery size={18} />, Cable: <Cable size={18} />,
  Headphones: <Headphones size={18} />, Smartphone: <Smartphone size={18} />, Layers: <Layers size={18} />,
};

export default function Navbar() {
  const { isDark, toggleTheme, lang, setLang, t, cartCount, wishlist, searchQuery, setSearchQuery } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [annIndex, setAnnIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); setMegaOpen(false); }, [location]);
  useEffect(() => {
    const iv = setInterval(() => setAnnIndex(p => (p + 1) % ANNOUNCEMENTS_FR.length), 4000);
    return () => clearInterval(iv);
  }, []);

  const navLinks = [
    { to: '/', label: t('Accueil', 'Home') },
    { to: '/products', label: t('Produits', 'Products'), mega: true },
    { to: '/about', label: t('À propos', 'About') },
    { to: '/contact', label: 'Contact' },
  ];

  const navBg = scrolled
    ? isDark
      ? 'bg-card-dark/95 backdrop-blur-2xl border-b border-border-dark/60'
      : 'bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
    : isHome
      ? 'bg-transparent'
      : isDark
        ? 'bg-card-dark/80 backdrop-blur-xl'
        : 'bg-white/80 backdrop-blur-xl';

  const textColor = isHome && !scrolled ? 'text-white' : isDark ? 'text-gray-100' : 'text-gray-800';
  const subTextColor = isHome && !scrolled ? 'text-white/70' : isDark ? 'text-gray-400' : 'text-gray-500';
  const hoverBg = isHome && !scrolled ? 'hover:bg-white/10' : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate('/products'); setSearchOpen(false); }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className={`bg-gradient-to-r from-primary-600 via-primary-500 to-accent text-white text-center transition-all duration-500 overflow-hidden ${scrolled ? 'h-0' : 'h-9'}`}>
        <div className="h-9 flex items-center justify-center px-4 relative">
          <AnimatePresence mode="wait">
            <motion.span key={annIndex} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35 }} className="text-xs sm:text-[13px] font-medium absolute">
              {lang === 'fr' ? ANNOUNCEMENTS_FR[annIndex] : ANNOUNCEMENTS_EN[annIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${navBg}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[64px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-[11px] bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                <span className="text-white font-black text-sm tracking-tighter">A</span>
              </div>
              <span className={`text-[22px] font-extrabold tracking-tight ${textColor}`}>AZOURA</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <div key={link.to} className="relative" onMouseEnter={() => link.mega && setMegaOpen(true)} onMouseLeave={() => link.mega && setMegaOpen(false)}>
                  <Link to={link.to} className={`flex items-center gap-1 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${location.pathname === link.to ? 'text-primary-500' : subTextColor} ${hoverBg}`}>
                    {link.label}
                    {link.mega && <ChevronDown size={13} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Mega Menu */}
                  {link.mega && (
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} className={`absolute top-full left-1/2 -translate-x-1/2 w-[520px] mt-2 p-5 rounded-2xl border shadow-2xl ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-100 shadow-gray-200/60'}`}>
                          <div className="grid grid-cols-2 gap-1.5">
                            {categories.map(cat => (
                              <Link key={cat.id} to={`/products?category=${cat.id}`} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDark ? 'hover:bg-hover-dark' : 'hover:bg-gray-50'} group`}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors" style={{ background: `${cat.color}12`, color: cat.color }}>
                                  {catIconMap[cat.icon] || <Layers size={18} />}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{cat.name[lang]}</p>
                                  <p className="text-[11px] text-gray-400">{cat.count} {t('produits', 'products')}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-border-dark">
                            <Link to="/products" className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-colors">
                              {t('Voir tous les produits', 'View all products')} →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)} className={`p-2.5 rounded-xl transition-all ${subTextColor} ${hoverBg}`} aria-label="Search"><Search size={19} /></button>

              <Link to="/wishlist" className={`p-2.5 rounded-xl transition-all relative ${subTextColor} ${hoverBg}`} aria-label="Wishlist">
                <Heart size={19} />
                {wishlist.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </Link>

              <Link to="/cart" className={`p-2.5 rounded-xl transition-all relative ${subTextColor} ${hoverBg}`} aria-label="Cart">
                <ShoppingCart size={19} />
                {cartCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</motion.span>}
              </Link>

              <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className={`hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all ${subTextColor} ${hoverBg}`}>
                {lang === 'fr' ? '🇫🇷' : '🇬🇧'} {lang.toUpperCase()}
              </button>

              <button onClick={toggleTheme} className={`hidden sm:flex p-2.5 rounded-xl transition-all ${subTextColor} ${hoverBg}`} aria-label="Theme">
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <Link to="/products" className="hidden lg:flex items-center px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-[13px] font-bold rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-all hover:scale-[1.03] active:scale-[0.97] ml-1">
                {t('Acheter', 'Shop Now')}
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2.5 rounded-xl transition-all ${textColor} ${hoverBg}`} aria-label="Menu">
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-gray-100 dark:border-border-dark">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3">
                <div className="relative">
                  <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('Rechercher des produits...', 'Search products...')} className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-surface-dark text-white placeholder-gray-500 border border-border-dark' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'}`} autoFocus />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`lg:hidden overflow-hidden border-t ${isDark ? 'bg-card-dark border-border-dark' : 'bg-white border-gray-100'}`}>
              <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === link.to ? 'text-primary-500 bg-primary-50 dark:bg-primary-500/10' : isDark ? 'text-gray-300 hover:bg-hover-dark' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 mt-2 border-t border-gray-100 dark:border-border-dark space-y-2">
                  <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{t('Catégories', 'Categories')}</p>
                  {categories.map(cat => (
                    <Link key={cat.id} to={`/products?category=${cat.id}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${isDark ? 'text-gray-400 hover:bg-hover-dark' : 'text-gray-500 hover:bg-gray-50'}`}>
                      <span style={{ color: cat.color }}>{catIconMap[cat.icon]}</span>
                      {cat.name[lang]}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-border-dark">
                  <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="flex-1 py-3 rounded-xl text-sm font-bold text-center bg-gray-50 dark:bg-surface-dark text-gray-700 dark:text-gray-300">{lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</button>
                  <button onClick={toggleTheme} className="flex-1 py-3 rounded-xl text-sm font-bold text-center bg-gray-50 dark:bg-surface-dark text-gray-700 dark:text-gray-300">{isDark ? '☀️ Light' : '🌙 Dark'}</button>
                </div>
                <Link to="/products" className="block text-center py-3.5 bg-primary-500 text-white text-sm font-bold rounded-xl mt-2">{t('Acheter Maintenant', 'Shop Now')} →</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
