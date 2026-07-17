import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle, Star, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { orders, customers, adminProducts, adminReviews } = useApp();
  const totalRevenue = orders.reduce((s, o) => o.status !== 'cancelled' ? s + o.total : s, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const lowStock = adminProducts.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStock = adminProducts.filter(p => p.stock === 0).length;
  const pendingReviews = adminReviews.filter(r => r.status === 'pending').length;
  /* reserved for future analytics */

  const stats = [
    { label: 'Chiffre d\'affaires', value: `${totalRevenue.toLocaleString()}`, unit: 'MAD', change: '+12.5%', up: true, icon: <DollarSign size={18} />, color: '#2563EB', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { label: 'Commandes', value: orders.length.toString(), unit: '', change: '+8.2%', up: true, icon: <ShoppingBag size={18} />, color: '#10B981', bg: 'bg-emerald/10' },
    { label: 'Clients', value: customers.length.toString(), unit: '', change: '+15.3%', up: true, icon: <Users size={18} />, color: '#8B5CF6', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Taux de conversion', value: '3.8', unit: '%', change: '+0.4%', up: true, icon: <TrendingUp size={18} />, color: '#F59E0B', bg: 'bg-amber/10' },
  ];

  const chartData = [
    { m:'Jan', v:4200, o:18 }, { m:'Fév', v:5800, o:24 }, { m:'Mar', v:4900, o:20 }, { m:'Avr', v:7200, o:31 },
    { m:'Mai', v:6100, o:26 }, { m:'Jun', v:8400, o:35 }, { m:'Jul', v:7800, o:33 },
  ];
  const maxV = Math.max(...chartData.map(d => d.v));

  const recentOrders = orders.slice(0, 6);
  const SC: Record<string, string> = { pending:'bg-amber/10 text-amber', processing:'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400', shipped:'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400', delivered:'bg-emerald/10 text-emerald', cancelled:'bg-rose/10 text-rose' };
  const SL: Record<string, string> = { pending:'En attente', processing:'En cours', shipped:'Expédié', delivered:'Livré', cancelled:'Annulé' };

  return (
    <div className="space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Dashboard</h1><p className="text-[12px] text-gray-500">Vue d'ensemble de votre boutique AZOURA</p></div>
        <span className="text-[11px] text-gray-400 hidden sm:block">Dernière mise à jour : aujourd'hui</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
            className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
            <div className="flex items-start justify-between mb-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`} style={{ color:s.color }}>{s.icon}</div>
              <span className={`flex items-center gap-0.5 text-[11px] font-bold ${s.up ? 'text-emerald' : 'text-rose'}`}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{s.change}
              </span>
            </div>
            <p className="text-[22px] font-black text-gray-900 dark:text-white leading-none">{s.value}<span className="text-[11px] font-bold text-gray-400 ml-1">{s.unit}</span></p>
            <p className="text-[11px] text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Alerts */}
      {(pendingOrders + lowStock + outOfStock + pendingReviews > 0) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {pendingOrders > 0 && <Link to="/admin/orders" className="flex items-center gap-2.5 p-3 rounded-xl bg-amber/5 border border-amber/15 hover:border-amber/30 transition-colors"><ShoppingBag size={16} className="text-amber shrink-0" /><div><p className="text-[12px] font-bold text-gray-900 dark:text-white">{pendingOrders} en attente</p><p className="text-[10px] text-gray-500">À traiter</p></div></Link>}
          {processingOrders > 0 && <Link to="/admin/orders" className="flex items-center gap-2.5 p-3 rounded-xl bg-primary-50/50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/15 hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors"><Truck size={16} className="text-primary-500 shrink-0" /><div><p className="text-[12px] font-bold text-gray-900 dark:text-white">{processingOrders} à expédier</p><p className="text-[10px] text-gray-500">En cours</p></div></Link>}
          {(lowStock + outOfStock) > 0 && <Link to="/admin/inventory" className="flex items-center gap-2.5 p-3 rounded-xl bg-rose/5 border border-rose/15 hover:border-rose/30 transition-colors"><AlertTriangle size={16} className="text-rose shrink-0" /><div><p className="text-[12px] font-bold text-gray-900 dark:text-white">{lowStock + outOfStock} alertes stock</p><p className="text-[10px] text-gray-500">{outOfStock} en rupture</p></div></Link>}
          {pendingReviews > 0 && <Link to="/admin/reviews" className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/15 hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors"><Star size={16} className="text-purple-500 shrink-0" /><div><p className="text-[12px] font-bold text-gray-900 dark:text-white">{pendingReviews} avis en attente</p><p className="text-[10px] text-gray-500">À modérer</p></div></Link>}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Revenus mensuels</h3><p className="text-[11px] text-gray-400">Jan — Jul 2025</p></div>
            <div className="flex gap-3 text-[10px] text-gray-400"><span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-primary-500" />Revenus</span><span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-200 dark:bg-gray-700" />Commandes</span></div>
          </div>
          <div className="flex items-end gap-2.5 h-44">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-gray-400">{(d.v / 1000).toFixed(1)}k</span>
                <motion.div initial={{ height:0 }} animate={{ height:`${(d.v / maxV) * 100}%` }} transition={{ delay:i*0.06, duration:0.5 }}
                  className="w-full rounded-md bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px] relative group cursor-pointer">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.v.toLocaleString()} MAD • {d.o} cmd</div>
                </motion.div>
                <span className="text-[10px] text-gray-400">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Boxes */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Top Produits</h3>
            <div className="space-y-2.5">
              {adminProducts.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                  <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">{p.nameFr}</p><p className="text-[9px] text-gray-400">{p.sku} • Stock: {p.stock}</p></div>
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white shrink-0">{p.price} MAD</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Villes populaires</h3>
            <div className="space-y-2">
              {[{c:'Casablanca',pct:38},{c:'Rabat',pct:22},{c:'Marrakech',pct:15},{c:'Tanger',pct:13},{c:'Fès',pct:12}].map(c => (
                <div key={c.c} className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 w-20 truncate">{c.c}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-surface-dark rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full transition-all" style={{ width:`${c.pct}%` }} /></div>
                  <span className="text-[10px] font-bold text-gray-500 w-8 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-border-dark flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Commandes récentes</h3>
          <Link to="/admin/orders" className="text-[11px] text-primary-500 font-semibold hover:underline">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50 dark:border-border-dark">
              <th className="text-left px-4 py-2 font-semibold">ID</th><th className="text-left px-4 py-2 font-semibold">Client</th><th className="text-left px-4 py-2 font-semibold hidden md:table-cell">Ville</th><th className="text-left px-4 py-2 font-semibold">Total</th><th className="text-left px-4 py-2 font-semibold">Paiement</th><th className="text-left px-4 py-2 font-semibold">Statut</th><th className="text-left px-4 py-2 font-semibold hidden lg:table-cell">Date</th>
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark transition-colors">
                  <td className="px-4 py-2.5 text-[12px] font-bold text-primary-500">#{o.id}</td>
                  <td className="px-4 py-2.5"><p className="text-[12px] font-medium text-gray-900 dark:text-white">{o.customer.name}</p></td>
                  <td className="px-4 py-2.5 text-[12px] text-gray-500 hidden md:table-cell">{o.customer.city}</td>
                  <td className="px-4 py-2.5 text-[12px] font-bold text-gray-900 dark:text-white">{o.total} MAD</td>
                  <td className="px-4 py-2.5"><span className="text-[10px] font-semibold">{o.paymentMethod === 'cod' ? '💵 COD' : '💳 Carte'}</span></td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${SC[o.status]}`}>{SL[o.status]}</span></td>
                  <td className="px-4 py-2.5 text-[11px] text-gray-400 hidden lg:table-cell">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
