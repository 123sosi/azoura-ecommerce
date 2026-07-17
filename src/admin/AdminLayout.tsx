import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Star, Settings, Bell, Menu, Search, ExternalLink, Layers, Truck, CreditCard, Globe, BarChart3, Sun, Moon, X, AlertTriangle, CheckCircle, Award, TrendingUp, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_SECTIONS = [
  { title: null, items: [
    { to: '/admin', icon: <LayoutDashboard size={17} />, label: 'Dashboard', end: true as const },
    { to: '/admin/analytics', icon: <TrendingUp size={17} />, label: 'Analytics' },
  ]},
  { title: 'Catalogue', items: [
    { to: '/admin/products', icon: <Package size={17} />, label: 'Produits' },
    { to: '/admin/categories', icon: <Layers size={17} />, label: 'Catégories' },
    { to: '/admin/brands', icon: <Award size={17} />, label: 'Marques' },
    { to: '/admin/inventory', icon: <BarChart3 size={17} />, label: 'Inventaire' },
  ]},
  { title: 'Ventes', items: [
    { to: '/admin/orders', icon: <ShoppingBag size={17} />, label: 'Commandes' },
    { to: '/admin/customers', icon: <Users size={17} />, label: 'Clients' },
    { to: '/admin/coupons', icon: <Tag size={17} />, label: 'Coupons' },
  ]},
  { title: 'Contenu', items: [
    { to: '/admin/reviews', icon: <Star size={17} />, label: 'Avis' },
  ]},
  { title: 'Configuration', items: [
    { to: '/admin/shipping', icon: <Truck size={17} />, label: 'Livraison' },
    { to: '/admin/payments', icon: <CreditCard size={17} />, label: 'Paiements' },
    { to: '/admin/seo', icon: <Globe size={17} />, label: 'SEO' },
    { to: '/admin/settings', icon: <Settings size={17} />, label: 'Paramètres' },
  ]},
];

export default function AdminLayout() {
  const { notifications, markNotificationRead, clearNotifications, isDark, toggleTheme, adminProducts, logoutAdmin } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const unread = notifications.filter(n => !n.read).length;
  const lowStock = adminProducts.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length;
  const outOfStock = adminProducts.filter(p => p.stock === 0).length;

  useEffect(() => { setSidebarOpen(false); setNotifOpen(false); }, [location.pathname]);

  const notifIcon = (t: string) => {
    if (t === 'order') return <ShoppingBag size={13} className="text-primary-500" />;
    if (t === 'stock') return <AlertTriangle size={13} className="text-amber" />;
    if (t === 'review') return <Star size={13} className="text-yellow-500" />;
    return <CheckCircle size={13} className="text-emerald" />;
  };

  return (
    <div className="flex h-screen bg-[#f8f9fb] dark:bg-surface-dark overflow-hidden">
      {/* Sidebar */}
      <aside className={`w-[240px] shrink-0 flex flex-col fixed inset-y-0 left-0 z-40 lg:static transition-transform duration-300 bg-white dark:bg-card-dark border-r border-gray-100 dark:border-border-dark ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-14 flex items-center gap-2 px-4 border-b border-gray-100 dark:border-border-dark shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center"><span className="text-white font-black text-[10px]">A</span></div>
            <span className="text-[15px] font-extrabold text-gray-900 dark:text-white tracking-tight">AZOURA</span>
          </Link>
          <span className="ml-auto px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[8px] font-bold rounded">ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded text-gray-400"><X size={16} /></button>
        </div>

        <nav className="flex-1 py-2 px-2.5 overflow-y-auto no-scrollbar space-y-4">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              {section.title && <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{section.title}</p>}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isEnd = 'end' in item && item.end;
                  const active = isEnd ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== '/admin';
                  const isExact = isEnd && location.pathname === item.to;
                  const show = active || isExact;
                  return (
                    <Link key={item.to} to={item.to}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-all relative ${show ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-hover-dark hover:text-gray-900 dark:hover:text-white'}`}>
                      <span className={show ? 'text-primary-500' : ''}>{item.icon}</span>
                      {item.label}
                      {item.label === 'Inventaire' && (lowStock + outOfStock) > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 bg-amber/10 text-amber text-[9px] font-bold rounded">{lowStock + outOfStock}</span>
                      )}
                      {item.label === 'Avis' && (
                        <span className="ml-auto px-1.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-500 text-[9px] font-bold rounded">3</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-2.5 border-t border-gray-100 dark:border-border-dark space-y-1 shrink-0">
          <Link to="/" target="_blank" className="flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-hover-dark hover:text-gray-900 dark:hover:text-white transition-all">
            <ExternalLink size={15} /> Voir la boutique
          </Link>
          <button onClick={() => { logoutAdmin(); navigate('/admin/login'); }} className="w-full flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] font-medium text-gray-500 dark:text-gray-400 hover:bg-rose/5 hover:text-rose transition-all">
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white dark:bg-card-dark border-b border-gray-100 dark:border-border-dark flex items-center gap-3 px-3 lg:px-5 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-500"><Menu size={18} /></button>

          <div className="relative flex-1 max-w-sm hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Rechercher produits, commandes, clients..." className="w-full pl-8 pr-3 py-[7px] rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 relative transition-colors">
                <Bell size={16} />
                {unread > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose text-white text-[8px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity:0, y:6, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:6, scale:0.97 }} transition={{ duration:0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-[340px] bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-border-dark flex items-center justify-between">
                      <span className="text-[13px] font-bold text-gray-900 dark:text-white">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unread > 0 && <span className="text-[9px] bg-rose/10 text-rose px-1.5 py-0.5 rounded font-bold">{unread} nouvelles</span>}
                        <button onClick={clearNotifications} className="text-[10px] text-primary-500 font-semibold hover:underline">Tout lire</button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-border-dark">
                      {notifications.slice(0, 8).map(n => (
                        <button key={n.id} onClick={() => markNotificationRead(n.id)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-hover-dark transition-colors flex gap-2.5 ${!n.read ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`}>
                          <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>
                          <div className="min-w-0">
                            <p className={`text-[12px] leading-relaxed ${!n.read ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>{n.text}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-gray-100 dark:border-border-dark">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-[9px]">AD</div>
              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold text-gray-900 dark:text-white leading-tight">Admin</p>
                <p className="text-[9px] text-gray-400 leading-tight">Administrateur</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
