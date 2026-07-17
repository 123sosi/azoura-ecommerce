import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag, Truck, Shield, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { t, isDark, cart, removeFromCart, updateQuantity, cartTotal, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const shipping = cartTotal >= 299 ? 0 : 29;
  const tax = Math.round(cartTotal * 0.2);
  const couponDiscount = appliedCoupon ? (appliedCoupon.type === 'percent' ? Math.round(cartTotal * appliedCoupon.discount / 100) : appliedCoupon.discount) : 0;
  const total = cartTotal + shipping + tax - couponDiscount;

  const handleCoupon = () => {
    setCouponError('');
    if (!applyCoupon(couponInput)) setCouponError(t('Code invalide ou conditions non remplies', 'Invalid code or conditions not met'));
  };

  if (cart.length === 0) return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 dark:bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-5"><ShoppingCart size={36} /></div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Panier vide', 'Cart is empty')}</h2>
        <p className="text-gray-500 text-sm mb-7">{t('Découvrez nos produits premium', 'Explore our premium products')}</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 transition-all">{t('Voir les produits', 'Browse')} <ArrowRight size={16} /></Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50 dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('Mon Panier', 'My Cart')}</h1><p className="text-gray-500 text-sm mt-0.5">{cart.length} {t('article(s)', 'item(s)')}</p></div>
          <button onClick={clearCart} className="text-[13px] text-rose hover:underline font-semibold">{t('Vider', 'Clear')}</button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.04 }} className="premium-card flex gap-4 p-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-surface-dark shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div><h3 className="font-semibold text-[14px] text-gray-900 dark:text-white line-clamp-1">{item.name}</h3><p className="text-primary-500 font-extrabold text-lg mt-0.5">{item.price} MAD</p></div>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`flex items-center rounded-lg border ${isDark ? 'border-border-dark' : 'border-gray-200'}`}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50 dark:hover:bg-hover-dark rounded-l-lg"><Minus size={13} /></button>
                        <span className="w-8 text-center text-[13px] font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50 dark:hover:bg-hover-dark rounded-r-lg"><Plus size={13} /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm hidden sm:block">{item.price * item.quantity} MAD</span>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 rounded-lg text-gray-400 hover:text-rose hover:bg-rose/5 transition-all"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="premium-card p-5 sticky top-28">
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-5">{t('Résumé', 'Summary')}</h3>

              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative flex-1"><Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder={t('Code promo', 'Coupon')} disabled={!!appliedCoupon} className={`w-full pl-8 pr-3 py-2.5 rounded-lg text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-surface-dark text-white border border-border-dark' : 'bg-gray-50 border border-gray-200'}`} />
                  </div>
                  {appliedCoupon ? <button onClick={removeCoupon} className="px-3 py-2.5 rounded-lg text-[12px] font-bold bg-rose/10 text-rose">✕</button> : <button onClick={handleCoupon} className="px-4 py-2.5 rounded-lg text-[12px] font-bold bg-primary-500 text-white hover:bg-primary-600">{t('OK', 'Apply')}</button>}
                </div>
                {appliedCoupon && <p className="text-[11px] text-emerald mt-1.5 font-semibold">✓ {appliedCoupon.code} — {appliedCoupon.discount}{appliedCoupon.type === 'percent' ? '%' : ' MAD'} {t('de réduction', 'off')}</p>}
                {couponError && <p className="text-[11px] text-rose mt-1.5 font-semibold">{couponError}</p>}
                {!appliedCoupon && !couponError && <p className="text-[10px] text-gray-400 mt-1">{t('Essayez AZOURA10 ou WELCOME20', 'Try AZOURA10 or WELCOME20')}</p>}
              </div>

              <div className="space-y-2.5 text-[13px] mb-5">
                <div className="flex justify-between"><span className="text-gray-500">{t('Sous-total', 'Subtotal')}</span><span className="font-semibold text-gray-900 dark:text-white">{cartTotal} MAD</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('Livraison', 'Shipping')}</span><span className={`font-semibold ${shipping === 0 ? 'text-emerald' : 'text-gray-900 dark:text-white'}`}>{shipping === 0 ? t('Gratuit', 'Free') : `${shipping} MAD`}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{t('TVA (20%)', 'Tax (20%)')}</span><span className="font-semibold text-gray-900 dark:text-white">{tax} MAD</span></div>
                {couponDiscount > 0 && <div className="flex justify-between"><span className="text-emerald">{t('Réduction', 'Discount')}</span><span className="font-semibold text-emerald">-{couponDiscount} MAD</span></div>}
                <div className="border-t border-gray-100 dark:border-border-dark pt-2.5 flex justify-between"><span className="font-bold text-gray-900 dark:text-white">{t('Total', 'Total')}</span><span className="text-xl font-black text-primary-500">{total} MAD</span></div>
              </div>

              <Link to="/checkout" className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 transition-all mb-3">
                <Lock size={15} /> {t('Commander', 'Checkout')} — {total} MAD
              </Link>

              <div className="flex items-center justify-center gap-3 text-gray-400 text-[10px]">
                <span className="flex items-center gap-1"><Truck size={11} /> {t('Livraison rapide', 'Fast delivery')}</span>
                <span className="flex items-center gap-1"><Shield size={11} /> {t('Paiement sécurisé', 'Secure')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
