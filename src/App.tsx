import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, X, MessageCircle, GitCompareArrows } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Compare = lazy(() => import('./pages/Compare'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/AdminProducts'));
const AdminOrdersPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminOrders })));
const AdminCustomersPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminCustomers })));
const AdminCategoriesPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminCategories })));
const AdminBrandsPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminBrands })));
const AdminInventoryPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminInventory })));
const AdminReviewsPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminReviews })));
const AdminCouponsPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminCoupons })));
const AdminShippingPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminShipping })));
const AdminPaymentsPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminPayments })));
const AdminAnalyticsPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminAnalytics })));
const AdminSEOPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminSEO })));
const AdminSettingsPage = lazy(() => import('./admin/AdminPages').then(m => ({ default: m.AdminSettings })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-dark">
      <div className="flex flex-col items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center animate-pulse">
          <span className="text-white font-black text-sm">A</span>
        </div>
        <div className="flex gap-1">
          {[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
        </div>
      </div>
    </div>
  );
}

function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => { const fn = () => setShow(window.scrollY > 500); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-2xl flex items-center justify-center transition-colors">
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function WhatsAppButton() {
  return (
    <motion.a href="https://wa.me/212522123456?text=Bonjour%20AZOURA%20!" target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5 }}
      className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-2xl shadow-green-500/20 flex items-center justify-center transition-all hover:scale-110" title="WhatsApp">
      <MessageCircle size={22} />
    </motion.a>
  );
}

function CompareFloatingButton() {
  const { compareList, t } = useApp();
  if (!compareList.length) return null;
  return (
    <motion.a href="#/compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark text-gray-900 dark:text-white shadow-2xl text-xs font-black hover:text-primary-500 transition-colors">
      <GitCompareArrows size={16} /> {t('Comparer', 'Compare')} ({compareList.length})
    </motion.a>
  );
}

function CookieBanner() {
  const { t, showCookie, acceptCookies, isDark } = useApp();
  return (
    <AnimatePresence>
      {showCookie && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${isDark ? 'bg-card-dark/95 border-t border-border-dark' : 'bg-white/95 border-t border-gray-100'} backdrop-blur-xl`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <p className="flex-1 text-[13px] text-gray-600 dark:text-gray-300">
              🍪 {t('Ce site utilise des cookies pour améliorer votre expérience.', 'This site uses cookies to improve your experience.')}
            </p>
            <div className="flex gap-2 shrink-0">
              <button onClick={acceptCookies} className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-[12px] font-bold rounded-lg transition-all">{t('Accepter', 'Accept')}</button>
              <button onClick={acceptCookies} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-hover-dark"><X size={16} /></button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {loading && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 z-[100] bg-white dark:bg-surface-dark flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0.3 }} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary-500/20">
              <span className="text-white font-black text-2xl">A</span>
            </div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-0.5">AZOURA</h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-[0.2em]">CONNECT · CHARGE · GO</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StoreLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
      <CompareFloatingButton />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}

function ProtectedAdminRoute() {
  const { isAdminAuth } = useApp();
  const location = useLocation();
  if (!isAdminAuth) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  return <AdminLayout />;
}

function AdminRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (!isAdmin) return null;
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="shipping" element={<AdminShippingPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="seo" element={<AdminSEOPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function Layout() {
  return (
    <div className="bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <LoadingScreen />
      <ScrollToTop />
      <StoreLayout />
      <AdminRoutes />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </AppProvider>
  );
}
