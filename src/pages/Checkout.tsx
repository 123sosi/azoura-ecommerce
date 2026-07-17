import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Lock, MapPin, Phone, ShoppingBag, Truck } from 'lucide-react';
import { useApp, type Order } from '../context/AppContext';

const MOROCCAN_CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fes', 'Agadir', 'Meknes', 'Oujda', 'Tetouan', 'Kenitra', 'Mohammedia', 'Safi'];

export default function Checkout() {
  const navigate = useNavigate();
  const { t, cart, cartTotal, clearCart, addOrder, appliedCoupon, removeCoupon, adminProducts, updateAdminProduct, siteSettings } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>(siteSettings.codEnabled === 'true' ? 'cod' : 'card');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: 'Casablanca', address: '', notes: '' });

  const shipping = cartTotal >= 299 ? 0 : 29;
  const tax = Math.round(cartTotal * 0.2);
  const discount = appliedCoupon ? (appliedCoupon.type === 'percent' ? Math.round(cartTotal * appliedCoupon.discount / 100) : appliedCoupon.discount) : 0;
  const total = cartTotal + shipping + tax - discount;
  const disabledByStock = useMemo(() => cart.some(item => (adminProducts.find(p => p.id === item.id)?.stock ?? 999) < item.quantity), [adminProducts, cart]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t('Nom requis', 'Name is required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('Email invalide', 'Invalid email');
    if (!/^\+?212|0[5-7]/.test(form.phone.replace(/\s/g, ''))) next.phone = t('Téléphone marocain invalide', 'Invalid Moroccan phone');
    if (!form.address.trim() || form.address.length < 8) next.address = t('Adresse complète requise', 'Full address required');
    if (disabledByStock) next.stock = t('Un article dépasse le stock disponible', 'An item exceeds available stock');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const order: Order = {
      id: `AZ-${Math.floor(100000 + Math.random() * 899999)}`,
      items: cart,
      total,
      status: 'pending',
      customer: { name: form.name, email: form.email, phone: form.phone, city: form.city },
      date: now.toISOString().slice(0, 10),
      paymentMethod,
      shippingAddress: `${form.address}, ${form.city}, Maroc`,
      notes: form.notes,
      timeline: [{ status: 'pending', date: now.toISOString().slice(0, 16).replace('T', ' '), note: 'Commande confirmée' }],
    };

    cart.forEach(item => {
      const product = adminProducts.find(p => p.id === item.id);
      if (product) updateAdminProduct(product.id, { stock: Math.max(0, product.stock - item.quantity) });
    });
    addOrder(order);
    setPlacedOrder(order);
    clearCart();
    removeCoupon();
  };

  if (!cart.length && !placedOrder) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50/60 dark:bg-surface-dark px-4">
        <div className="premium-card p-8 text-center max-w-md">
          <ShoppingBag className="mx-auto text-primary-500 mb-4" size={44} />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Votre panier est vide', 'Your cart is empty')}</h1>
          <p className="text-sm text-gray-500 mb-6">{t('Ajoutez des produits avant de passer commande.', 'Add products before checkout.')}</p>
          <Link to="/products" className="inline-flex px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-bold">{t('Voir les produits', 'Browse products')}</Link>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50/60 dark:bg-surface-dark px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-8 text-center max-w-lg">
          <CheckCircle className="mx-auto text-emerald mb-4" size={56} />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Commande confirmée', 'Order confirmed')}</h1>
          <p className="text-sm text-gray-500 mb-5">{t('Merci pour votre achat. Notre équipe vous contactera sous peu pour confirmer la livraison.', 'Thank you for your purchase. Our team will contact you shortly to confirm delivery.')}</p>
          <div className="rounded-2xl bg-gray-50 dark:bg-surface-dark p-4 text-left mb-6">
            <p className="text-xs text-gray-400">{t('Numéro de commande', 'Order number')}</p>
            <p className="font-mono font-black text-primary-500">#{placedOrder.id}</p>
            <p className="text-xs text-gray-400 mt-3">{t('Total', 'Total')}</p>
            <p className="font-black text-gray-900 dark:text-white">{placedOrder.total} MAD</p>
          </div>
          <button onClick={() => navigate('/products')} className="px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-bold">{t('Continuer mes achats', 'Continue shopping')}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/60 dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-primary-500 text-xs font-bold uppercase tracking-widest">AZOURA Checkout</p>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('Finaliser la commande', 'Secure checkout')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('Paiement à la livraison disponible partout au Maroc.', 'Cash on delivery available across Morocco.')}</p>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-5">
            <div className="premium-card p-5">
              <h2 className="font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MapPin size={18} className="text-primary-500" />{t('Informations de livraison', 'Shipping information')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('Nom complet', 'Full name')} error={errors.name}><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="az-input" /></Field>
                <Field label="Email" error={errors.email}><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="az-input" /></Field>
                <Field label={t('Téléphone', 'Phone')} error={errors.phone}><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="06 12 34 56 78" className="az-input" /></Field>
                <Field label={t('Ville', 'City')}><select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="az-input">{MOROCCAN_CITIES.map(c => <option key={c}>{c}</option>)}</select></Field>
                <div className="sm:col-span-2"><Field label={t('Adresse complète', 'Full address')} error={errors.address}><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={3} className="az-input resize-none" /></Field></div>
                <div className="sm:col-span-2"><Field label={t('Notes de livraison', 'Delivery notes')}><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="az-input resize-none" /></Field></div>
              </div>
            </div>

            <div className="premium-card p-5">
              <h2 className="font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><CreditCard size={18} className="text-primary-500" />{t('Paiement', 'Payment')}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {siteSettings.codEnabled === 'true' && <PaymentOption active={paymentMethod === 'cod'} onClick={() => setPaymentMethod('cod')} title={t('Paiement à la livraison', 'Cash on delivery')} subtitle={t('Payez au livreur à la réception', 'Pay when you receive your order')} icon="💵" />}
                {siteSettings.cardEnabled === 'true' && <PaymentOption active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} title={t('Carte bancaire', 'Bank card')} subtitle={t('Paiement sécurisé CMI', 'Secure CMI payment')} icon="💳" />}
              </div>
            </div>
          </div>

          <div className="premium-card p-5 h-fit sticky top-28">
            <h2 className="font-extrabold text-gray-900 dark:text-white mb-4">{t('Résumé', 'Summary')}</h2>
            <div className="space-y-3 max-h-64 overflow-auto pr-1 mb-4">
              {cart.map(item => {
                const stock = adminProducts.find(p => p.id === item.id)?.stock ?? 999;
                return (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity} • {item.price} MAD</p>
                      {stock < item.quantity && <p className="text-[11px] text-rose font-bold">{t('Stock insuffisant', 'Insufficient stock')}</p>}
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
            <SummaryLine label={t('Sous-total', 'Subtotal')} value={`${cartTotal} MAD`} />
            <SummaryLine label={t('Livraison', 'Shipping')} value={shipping === 0 ? t('Gratuit', 'Free') : `${shipping} MAD`} />
            <SummaryLine label={t('TVA', 'Tax')} value={`${tax} MAD`} />
            {discount > 0 && <SummaryLine label={t('Réduction', 'Discount')} value={`-${discount} MAD`} accent />}
            <div className="border-t border-gray-100 dark:border-border-dark my-3 pt-3 flex justify-between">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-black text-primary-500">{total} MAD</span>
            </div>
            {errors.stock && <p className="text-xs text-rose font-bold mb-3">{errors.stock}</p>}
            <button disabled={disabledByStock} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-black shadow-lg shadow-primary-500/20">
              <Lock size={16} /> {t('Confirmer la commande', 'Place order')}
            </button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 mt-4">
              <span className="flex items-center gap-1"><Truck size={12} /> 24-48h</span>
              <span className="flex items-center gap-1"><Phone size={12} /> WhatsApp</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">{label}</span>{children}{error && <span className="block text-[11px] text-rose font-bold mt-1">{error}</span>}</label>;
}

function PaymentOption({ active, title, subtitle, icon, onClick }: { active: boolean; title: string; subtitle: string; icon: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`text-left p-4 rounded-2xl border transition-all ${active ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-gray-200 dark:border-border-dark hover:border-primary-200'}`}><span className="text-2xl block mb-2">{icon}</span><span className="block text-sm font-black text-gray-900 dark:text-white">{title}</span><span className="block text-xs text-gray-500 mt-0.5">{subtitle}</span></button>;
}

function SummaryLine({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex justify-between text-sm py-1"><span className={accent ? 'text-emerald' : 'text-gray-500'}>{label}</span><span className={`font-bold ${accent ? 'text-emerald' : 'text-gray-900 dark:text-white'}`}>{value}</span></div>;
}