import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, X, Eye, Star, Check, Mail, Phone, MapPin, Package, Truck, Edit, AlertTriangle, TrendingUp, Users, Percent, DollarSign, ShoppingBag } from 'lucide-react';
import jsPDF from 'jspdf';
import { useApp } from '../context/AppContext';
import type { AdminBrand } from '../context/AppContext';

/* ============================================ */
/* ORDERS PAGE                                  */
/* ============================================ */
const SC: Record<string,string> = { pending:'bg-amber/10 text-amber', processing:'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400', shipped:'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400', delivered:'bg-emerald/10 text-emerald', cancelled:'bg-rose/10 text-rose' };
const SL: Record<string,string> = { pending:'En attente', processing:'En cours', shipped:'Expédié', delivered:'Livré', cancelled:'Annulé' };

function downloadInvoicePDF(order: any) {
  const doc = new jsPDF();
  doc.setFontSize(22); doc.setTextColor(37, 99, 235); doc.text('AZOURA', 20, 22);
  doc.setFontSize(10); doc.setTextColor(100); doc.text('Connect. Charge. Go.', 20, 28);
  doc.setFontSize(14); doc.setTextColor(20); doc.text(`Facture #${order.id}`, 140, 22);
  doc.setFontSize(10); doc.text(`Date: ${order.date}`, 140, 29);
  doc.line(20, 36, 190, 36);
  doc.setFontSize(12); doc.text('Client', 20, 48); doc.setFontSize(10);
  doc.text(order.customer.name, 20, 56); doc.text(order.customer.email, 20, 62); doc.text(order.customer.phone, 20, 68); doc.text(order.shippingAddress, 20, 74);
  doc.setFontSize(12); doc.text('Articles', 20, 90); doc.setFontSize(10);
  let y = 100;
  order.items.forEach((item: any) => { doc.text(`${item.name} x${item.quantity}`, 22, y); doc.text(`${item.price * item.quantity} MAD`, 160, y); y += 8; });
  doc.line(20, y + 2, 190, y + 2); y += 12;
  doc.setFontSize(13); doc.setTextColor(37, 99, 235); doc.text(`Total: ${order.total} MAD`, 140, y);
  doc.setTextColor(100); doc.setFontSize(9); doc.text('Merci pour votre confiance. Paiement et livraison geres par AZOURA Maroc.', 20, 280);
  doc.save(`facture-${order.id}.pdf`);
}

export function AdminOrders() {
  const { orders, updateOrder } = useApp();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');
  const [viewId, setViewId] = useState<string|null>(null);
  const filtered = orders.filter(o => { if (statusF && o.status !== statusF) return false; if (search) { const q = search.toLowerCase(); return o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q); } return true; });
  const detail = viewId ? orders.find(o => o.id === viewId) : null;
  const tl = [{s:'pending',l:'Reçue',i:<Package size={12}/>},{s:'processing',l:'Préparation',i:<Package size={12}/>},{s:'shipped',l:'Expédié',i:<Truck size={12}/>},{s:'delivered',l:'Livré',i:<Check size={12}/>}];
  const tlIdx = (s: string) => tl.findIndex(t => t.s === s);

  return (
    <div className="space-y-4 max-w-[1400px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Commandes</h1><p className="text-[12px] text-gray-500">{orders.length} commandes</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">{Object.entries(SL).map(([k,v]) => { const c = orders.filter(o => o.status === k).length; return (<button key={k} onClick={() => setStatusF(statusF === k ? '' : k)} className={`p-3 rounded-xl text-center border transition-all ${statusF === k ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-500/10' : 'border-gray-100 dark:border-border-dark bg-white dark:bg-card-dark hover:border-gray-200'}`}><span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mb-1 ${SC[k]}`}>{v}</span><p className="text-lg font-black text-gray-900 dark:text-white">{c}</p></button>);})}</div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-3"><div className="relative max-w-sm"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher ID ou client..." className="w-full pl-8 pr-3 py-[7px] rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div></div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60"><th className="text-left px-4 py-2 font-semibold">ID</th><th className="text-left px-4 py-2 font-semibold">Client</th><th className="text-left px-4 py-2 font-semibold hidden md:table-cell">Articles</th><th className="text-left px-4 py-2 font-semibold">Total</th><th className="text-left px-4 py-2 font-semibold hidden md:table-cell">Paiement</th><th className="text-left px-4 py-2 font-semibold">Statut</th><th className="text-left px-4 py-2 font-semibold hidden lg:table-cell">Date</th><th className="text-right px-4 py-2 font-semibold">Actions</th></tr></thead><tbody>{filtered.map(o => (<tr key={o.id} className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark transition-colors"><td className="px-4 py-2.5 text-[12px] font-bold text-primary-500">#{o.id}</td><td className="px-4 py-2.5"><p className="text-[12px] font-medium text-gray-900 dark:text-white">{o.customer.name}</p><p className="text-[10px] text-gray-400">{o.customer.city}</p></td><td className="px-4 py-2.5 text-[11px] text-gray-500 hidden md:table-cell">{o.items.reduce((s,i) => s+i.quantity, 0)} article(s)</td><td className="px-4 py-2.5 text-[12px] font-bold text-gray-900 dark:text-white">{o.total} MAD</td><td className="px-4 py-2.5 hidden md:table-cell"><span className="text-[10px] font-semibold">{o.paymentMethod === 'cod' ? '💵 COD' : '💳 Carte'}</span></td><td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${SC[o.status]}`}>{SL[o.status]}</span></td><td className="px-4 py-2.5 text-[11px] text-gray-400 hidden lg:table-cell">{o.date}</td><td className="px-4 py-2.5 text-right"><button onClick={() => setViewId(o.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 hover:text-primary-500"><Eye size={14} /></button></td></tr>))}</tbody></table></div></div>
      <AnimatePresence>{detail && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-[3vh] overflow-y-auto" onClick={() => setViewId(null)}>
          <motion.div initial={{scale:0.97}} animate={{scale:1}} exit={{scale:0.97}} className="bg-white dark:bg-card-dark rounded-xl w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-border-dark"><div><h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Commande #{detail.id}</h2><p className="text-[11px] text-gray-400">{detail.date}</p></div><button onClick={() => setViewId(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400"><X size={16} /></button></div>
            <div className="p-5 space-y-5">
              {/* Timeline */}
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Suivi de commande</p>
                <div className="flex items-center">{tl.map((step, i) => { const aIdx = tlIdx(detail.status); const done = detail.status !== 'cancelled' && i <= aIdx; return (<div key={step.s} className="flex-1 flex flex-col items-center relative"><div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 text-white ${done ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700 !text-gray-400'}`}>{step.i}</div><p className={`text-[9px] font-semibold mt-1 ${done ? 'text-primary-500' : 'text-gray-400'}`}>{step.l}</p>{i < tl.length-1 && <div className={`absolute top-3.5 left-[55%] w-[90%] h-0.5 ${done && i < aIdx ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}</div>);})}</div>
                {detail.status === 'cancelled' && <p className="text-center text-[11px] text-rose font-bold mt-2">❌ Commande annulée</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-dark"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Client</p><p className="text-[12px] font-semibold text-gray-900 dark:text-white">{detail.customer.name}</p><p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10} />{detail.customer.email}</p><p className="text-[11px] text-gray-500 flex items-center gap-1"><Phone size={10} />{detail.customer.phone}</p></div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-surface-dark"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Livraison</p><p className="text-[12px] text-gray-700 dark:text-gray-300 flex items-start gap-1"><MapPin size={11} className="mt-0.5 shrink-0" />{detail.shippingAddress}</p>{detail.trackingNumber && <p className="text-[11px] text-primary-500 font-mono mt-1">📦 {detail.trackingNumber}</p>}</div>
              </div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Articles</p>{detail.items.map((item, i) => (<div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-surface-dark mb-1.5"><div className="flex items-center gap-2"><Package size={14} className="text-gray-400" /><div><p className="text-[12px] font-semibold text-gray-900 dark:text-white">{item.name}</p><p className="text-[10px] text-gray-400">Qté: {item.quantity}</p></div></div><span className="text-[12px] font-bold text-gray-900 dark:text-white">{item.price * item.quantity} MAD</span></div>))}</div>
              <div className="border-t border-gray-100 dark:border-border-dark pt-3 flex justify-between"><span className="text-[13px] font-bold text-gray-500">Total</span><span className="text-lg font-black text-primary-500">{detail.total} MAD</span></div>
            </div>
            <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 dark:border-border-dark bg-gray-50/40 dark:bg-surface-dark/40 rounded-b-xl">
              <button onClick={() => downloadInvoicePDF(detail)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-hover-dark">📄 Facture PDF</button>
              <select value={detail.status} onChange={e => { updateOrder(detail.id, { status: e.target.value as any }); }} className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-primary-500 text-white cursor-pointer focus:outline-none"><option value="pending">En attente</option><option value="processing">En cours</option><option value="shipped">Expédié</option><option value="delivered">Livré</option><option value="cancelled">Annulé</option></select>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

/* ============================================ */
/* CUSTOMERS PAGE                               */
/* ============================================ */
export function AdminCustomers() {
  const { customers, updateCustomer } = useApp();
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c => { if (!search) return true; const q = search.toLowerCase(); return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q); });
  return (
    <div className="space-y-4 max-w-[1400px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Clients</h1><p className="text-[12px] text-gray-500">{customers.length} clients</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[{l:'Clients actifs',v:customers.filter(c=>c.status==='active').length},{l:'Total dépensé',v:`${customers.reduce((s,c)=>s+c.totalSpent,0).toLocaleString()} MAD`},{l:'Commandes totales',v:customers.reduce((s,c)=>s+c.orders,0)},{l:'Panier moyen',v:`${Math.round(customers.reduce((s,c)=>s+c.totalSpent,0)/Math.max(1,customers.reduce((s,c)=>s+c.orders,0)))} MAD`}].map((s,i)=>(<div key={i} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-3.5"><p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{s.l}</p><p className="text-xl font-black text-gray-900 dark:text-white mt-1">{s.v}</p></div>))}</div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-3"><div className="relative max-w-sm"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher client..." className="w-full pl-8 pr-3 py-[7px] rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div></div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60"><th className="text-left px-4 py-2 font-semibold">Client</th><th className="text-left px-4 py-2 font-semibold hidden md:table-cell">Contact</th><th className="text-left px-4 py-2 font-semibold">Ville</th><th className="text-left px-4 py-2 font-semibold">Commandes</th><th className="text-left px-4 py-2 font-semibold">Dépensé</th><th className="text-left px-4 py-2 font-semibold hidden lg:table-cell">Statut</th></tr></thead><tbody>{filtered.map(c=>(<tr key={c.id} className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark"><td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-[9px] shrink-0">{c.name.split(' ').map(n=>n[0]).join('')}</div><div><p className="text-[12px] font-semibold text-gray-900 dark:text-white">{c.name}</p><p className="text-[10px] text-gray-400">{c.id}</p></div></div></td><td className="px-4 py-2.5 hidden md:table-cell"><p className="text-[11px] text-gray-500">{c.email}</p><p className="text-[11px] text-gray-500">{c.phone}</p></td><td className="px-4 py-2.5 text-[12px] text-gray-500">{c.city}</td><td className="px-4 py-2.5 text-[12px] font-medium text-gray-700 dark:text-gray-300">{c.orders}</td><td className="px-4 py-2.5 text-[12px] font-bold text-gray-900 dark:text-white">{c.totalSpent.toLocaleString()} MAD</td><td className="px-4 py-2.5 hidden lg:table-cell"><button onClick={() => updateCustomer(c.id, { status: c.status === 'active' ? 'inactive' : 'active' })} className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.status === 'active' ? 'bg-emerald/10 text-emerald' : 'bg-gray-100 dark:bg-surface-dark text-gray-400'}`}>{c.status === 'active' ? 'Actif' : 'Inactif'}</button></td></tr>))}</tbody></table></div></div>
    </div>
  );
}

/* ============================================ */
/* CATEGORIES PAGE                              */
/* ============================================ */
export function AdminCategories() {
  const { adminCategories, addAdminCategory, updateAdminCategory, deleteAdminCategory } = useApp();
  const [editId, setEditId] = useState<string|null>(null);
  const handleAdd = () => { const id = `cat-${Date.now()}`; addAdminCategory({ id, nameFr:'Nouvelle Catégorie', nameEn:'New Category', slug:id, icon:'Layers', color:'#6B7280', productCount:0, active:true, order:adminCategories.length+1 }); setEditId(id); };
  const cat = editId ? adminCategories.find(c => c.id === editId) : null;
  return (
    <div className="space-y-4 max-w-[1000px]">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Catégories</h1><p className="text-[12px] text-gray-500">{adminCategories.length} catégories</p></div><button onClick={handleAdd} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm"><Plus size={13} /> Ajouter</button></div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden"><table className="w-full"><thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60"><th className="text-left px-4 py-2 font-semibold">Catégorie</th><th className="text-left px-4 py-2 font-semibold">Slug</th><th className="text-left px-4 py-2 font-semibold">Produits</th><th className="text-left px-4 py-2 font-semibold">Statut</th><th className="text-right px-4 py-2 font-semibold">Actions</th></tr></thead><tbody>{adminCategories.map(c=>(<tr key={c.id} className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark"><td className="px-4 py-2.5"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{background:`${c.color}15`,color:c.color}}>●</div><div><p className="text-[12px] font-semibold text-gray-900 dark:text-white">{c.nameFr}</p><p className="text-[10px] text-gray-400">{c.nameEn}</p></div></div></td><td className="px-4 py-2.5 text-[11px] font-mono text-gray-500">{c.slug}</td><td className="px-4 py-2.5 text-[12px] text-gray-600 dark:text-gray-300">{c.productCount}</td><td className="px-4 py-2.5"><button onClick={()=>updateAdminCategory(c.id,{active:!c.active})} className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.active?'bg-emerald/10 text-emerald':'bg-gray-100 dark:bg-surface-dark text-gray-400'}`}>{c.active?'Active':'Inactive'}</button></td><td className="px-4 py-2.5 text-right"><button onClick={()=>setEditId(c.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 hover:text-primary-500"><Edit size={13}/></button><button onClick={()=>deleteAdminCategory(c.id)} className="p-1.5 rounded-lg hover:bg-rose/5 text-gray-400 hover:text-rose"><Trash2 size={13}/></button></td></tr>))}</tbody></table></div>
      <AnimatePresence>{cat && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setEditId(null)}><motion.div initial={{scale:0.97}} animate={{scale:1}} exit={{scale:0.97}} className="bg-white dark:bg-card-dark rounded-xl w-full max-w-md shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-border-dark"><h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Modifier catégorie</h2><button onClick={()=>setEditId(null)}><X size={16} className="text-gray-400"/></button></div><div className="p-5 space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom FR</label><input defaultValue={cat.nameFr} onBlur={e=>updateAdminCategory(cat.id,{nameFr:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom EN</label><input defaultValue={cat.nameEn} onBlur={e=>updateAdminCategory(cat.id,{nameEn:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Couleur</label><input type="color" defaultValue={cat.color} onChange={e=>updateAdminCategory(cat.id,{color:e.target.value})} className="w-full h-9 rounded-lg cursor-pointer" /></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Icône</label><select defaultValue={cat.icon} onChange={e=>updateAdminCategory(cat.id,{icon:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer"><option value="Zap">Zap</option><option value="BatteryFull">Battery</option><option value="Cable">Cable</option><option value="Headphones">Headphones</option><option value="Smartphone">Smartphone</option><option value="Layers">Layers</option></select></div></div></div><div className="flex justify-end px-5 py-3 border-t border-gray-100 dark:border-border-dark"><button onClick={()=>setEditId(null)} className="px-4 py-2 rounded-lg text-[12px] font-bold bg-primary-500 text-white hover:bg-primary-600">Sauvegarder</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}

/* ============================================ */
/* BRANDS PAGE                                  */
/* ============================================ */
export function AdminBrands() {
  const { adminBrands, addAdminBrand, updateAdminBrand, deleteAdminBrand, adminProducts } = useApp();
  const [editId, setEditId] = useState<string|null>(null);
  const handleAdd = () => {
    const id = `brand-${Date.now()}`;
    const newBrand: AdminBrand = { id, nameFr:'Nouvelle Marque', nameEn:'New Brand', slug:id, logo:'', active:true, order:adminBrands.length+1 };
    addAdminBrand(newBrand);
    setEditId(id);
  };
  const brand = editId ? adminBrands.find(b => b.id === editId) : null;
  const countFor = (id: string) => adminProducts.filter(p => p.brand === id).length;
  return (
    <div className="space-y-4 max-w-[1000px]">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Marques</h1><p className="text-[12px] text-gray-500">{adminBrands.length} marques</p></div><button onClick={handleAdd} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm"><Plus size={13} /> Ajouter</button></div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden">
        <table className="w-full"><thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60"><th className="text-left px-4 py-2 font-semibold">Marque</th><th className="text-left px-4 py-2 font-semibold">Slug</th><th className="text-left px-4 py-2 font-semibold">Produits</th><th className="text-left px-4 py-2 font-semibold">Statut</th><th className="text-right px-4 py-2 font-semibold">Actions</th></tr></thead>
          <tbody>{[...adminBrands].sort((a,b)=>a.order-b.order).map(b => (
            <tr key={b.id} className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark">
              <td className="px-4 py-2.5"><div className="flex items-center gap-2.5">{b.logo ? <img src={b.logo} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100 dark:bg-surface-dark" /> : <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-black text-[10px]">{b.nameFr[0]}</div>}<div><p className="text-[12px] font-semibold text-gray-900 dark:text-white">{b.nameFr}</p><p className="text-[10px] text-gray-400">{b.nameEn}</p></div></div></td>
              <td className="px-4 py-2.5 text-[11px] font-mono text-gray-500">{b.slug}</td>
              <td className="px-4 py-2.5 text-[12px] text-gray-600 dark:text-gray-300">{countFor(b.id)}</td>
              <td className="px-4 py-2.5"><button onClick={()=>updateAdminBrand(b.id,{active:!b.active})} className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.active?'bg-emerald/10 text-emerald':'bg-gray-100 dark:bg-surface-dark text-gray-400'}`}>{b.active?'Active':'Inactive'}</button></td>
              <td className="px-4 py-2.5 text-right"><button onClick={()=>setEditId(b.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 hover:text-primary-500"><Edit size={13}/></button><button onClick={()=>deleteAdminBrand(b.id)} className="p-1.5 rounded-lg hover:bg-rose/5 text-gray-400 hover:text-rose"><Trash2 size={13}/></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <AnimatePresence>{brand && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setEditId(null)}>
          <motion.div initial={{scale:0.97}} animate={{scale:1}} exit={{scale:0.97}} className="bg-white dark:bg-card-dark rounded-xl w-full max-w-md shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-border-dark"><h2 className="text-[14px] font-bold text-gray-900 dark:text-white">Modifier marque</h2><button onClick={()=>setEditId(null)}><X size={16} className="text-gray-400"/></button></div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom FR</label><input defaultValue={brand.nameFr} onBlur={e=>updateAdminBrand(brand.id,{nameFr:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom EN</label><input defaultValue={brand.nameEn} onBlur={e=>updateAdminBrand(brand.id,{nameEn:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
              </div>
              <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Slug</label><input defaultValue={brand.slug} onBlur={e=>updateAdminBrand(brand.id,{slug:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] font-mono bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
              <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Logo (URL)</label><input defaultValue={brand.logo} onBlur={e=>updateAdminBrand(brand.id,{logo:e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
            </div>
            <div className="flex justify-end px-5 py-3 border-t border-gray-100 dark:border-border-dark"><button onClick={()=>setEditId(null)} className="px-4 py-2 rounded-lg text-[12px] font-bold bg-primary-500 text-white hover:bg-primary-600">Sauvegarder</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

/* ============================================ */
/* INVENTORY PAGE                               */
/* ============================================ */
export function AdminInventory() {
  const { adminProducts, updateAdminProduct } = useApp();
  const sorted = [...adminProducts].sort((a,b) => a.stock - b.stock);
  const outOfStock = sorted.filter(p => p.stock === 0);
  const lowStock = sorted.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const inStock = sorted.filter(p => p.stock > p.lowStockThreshold);
  return (
    <div className="space-y-4 max-w-[1400px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Inventaire & Stock</h1><p className="text-[12px] text-gray-500">{adminProducts.length} produits suivis</p></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 text-center"><p className="text-2xl font-black text-rose">{outOfStock.length}</p><p className="text-[11px] text-gray-500">En rupture</p></div>
        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 text-center"><p className="text-2xl font-black text-amber">{lowStock.length}</p><p className="text-[11px] text-gray-500">Stock faible</p></div>
        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 text-center"><p className="text-2xl font-black text-emerald">{inStock.length}</p><p className="text-[11px] text-gray-500">En stock</p></div>
      </div>
      {outOfStock.length > 0 && <div className="bg-rose/5 border border-rose/15 rounded-xl p-4"><p className="text-[12px] font-bold text-rose mb-2 flex items-center gap-1.5"><AlertTriangle size={14} /> Rupture de stock</p>{outOfStock.map(p => <StockRow key={p.id} p={p} update={updateAdminProduct} />)}</div>}
      {lowStock.length > 0 && <div className="bg-amber/5 border border-amber/15 rounded-xl p-4"><p className="text-[12px] font-bold text-amber mb-2 flex items-center gap-1.5"><AlertTriangle size={14} /> Stock faible (≤ seuil)</p>{lowStock.map(p => <StockRow key={p.id} p={p} update={updateAdminProduct} />)}</div>}
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden"><div className="px-4 py-2.5 border-b border-gray-100 dark:border-border-dark"><p className="text-[13px] font-bold text-gray-900 dark:text-white">Tous les produits</p></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60"><th className="text-left px-4 py-2 font-semibold">Produit</th><th className="text-left px-4 py-2 font-semibold">SKU</th><th className="text-left px-4 py-2 font-semibold">Stock</th><th className="text-left px-4 py-2 font-semibold">Seuil</th><th className="text-left px-4 py-2 font-semibold">Valeur stock</th><th className="text-left px-4 py-2 font-semibold">Ajuster</th></tr></thead><tbody>{sorted.map(p => <StockTableRow key={p.id} p={p} update={updateAdminProduct} />)}</tbody></table></div></div>
    </div>
  );
}

function StockRow({ p, update }: { p: any; update: any }) {
  return (<div className="flex items-center justify-between py-1.5"><div className="flex items-center gap-2"><img src={p.images[0]||''} alt="" className="w-7 h-7 rounded-lg object-cover bg-gray-100" /><div><p className="text-[11px] font-semibold text-gray-900 dark:text-white">{p.nameFr}</p><p className="text-[9px] text-gray-400">{p.sku}</p></div></div><div className="flex items-center gap-2"><span className="text-[11px] font-bold text-gray-500">Stock: {p.stock}</span><input type="number" defaultValue={p.stock} onBlur={e => update(p.id, { stock: +e.target.value })} className="w-16 px-2 py-1 rounded-lg text-[11px] text-center bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div></div>);
}

function StockTableRow({ p, update }: { p: any; update: any }) {
  return (<tr className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark"><td className="px-4 py-2.5"><div className="flex items-center gap-2"><img src={p.images[0]||''} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0" /><p className="text-[12px] font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">{p.nameFr}</p></div></td><td className="px-4 py-2.5 text-[11px] font-mono text-gray-500">{p.sku}</td><td className="px-4 py-2.5"><span className={`text-[12px] font-bold ${p.stock===0?'text-rose':p.stock<=p.lowStockThreshold?'text-amber':'text-emerald'}`}>{p.stock}</span></td><td className="px-4 py-2.5 text-[12px] text-gray-500">{p.lowStockThreshold}</td><td className="px-4 py-2.5 text-[12px] font-medium text-gray-700 dark:text-gray-300">{(p.stock * p.costPrice).toLocaleString()} MAD</td><td className="px-4 py-2.5"><input type="number" defaultValue={p.stock} onBlur={e => update(p.id, { stock: Math.max(0, +e.target.value) })} className="w-20 px-2.5 py-1.5 rounded-lg text-[11px] text-center bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></td></tr>);
}

/* ============================================ */
/* REVIEWS, COUPONS, SHIPPING, PAYMENTS, SEO, SETTINGS */
/* ============================================ */
export function AdminReviews() {
  const { adminReviews, updateReview } = useApp();
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const filtered = filter === 'all' ? adminReviews : adminReviews.filter(r => r.status === filter);
  return (
    <div className="space-y-4 max-w-[1000px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Modération des Avis</h1><p className="text-[12px] text-gray-500">{adminReviews.filter(r=>r.status==='pending').length} en attente</p></div>
      <div className="flex gap-2">{(['all','pending','approved','rejected'] as const).map(f => <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter===f?'bg-primary-500 text-white shadow-sm':'bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-gray-500 hover:bg-gray-50 dark:hover:bg-hover-dark'}`}>{f==='all'?`Tous (${adminReviews.length})`:f==='pending'?`En attente (${adminReviews.filter(r=>r.status==='pending').length})`:f==='approved'?`Approuvés (${adminReviews.filter(r=>r.status==='approved').length})`:`Rejetés (${adminReviews.filter(r=>r.status==='rejected').length})`}</button>)}</div>
      <div className="space-y-2.5">{filtered.map(r => (
        <div key={r.id} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent text-white font-bold text-[10px] flex items-center justify-center shrink-0">{r.customerName.split(' ').map(n=>n[0]).join('')}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span className="text-[12px] font-bold text-gray-900 dark:text-white">{r.customerName}</span><div className="flex">{[...Array(5)].map((_,i)=><Star key={i} size={10} className={i<r.rating?'fill-amber text-amber':'text-gray-200 dark:text-gray-700'}/>)}</div>{r.verified && <span className="text-[8px] bg-primary-50 dark:bg-primary-500/10 text-primary-500 px-1.5 py-0.5 rounded font-bold">Vérifié</span>}</div><span className="text-[10px] text-gray-400 shrink-0">{r.date}</span></div>
            <p className="text-[12px] text-gray-600 dark:text-gray-300 mb-0.5">{r.text}</p>
            <p className="text-[10px] text-gray-400 mb-2">Produit: {r.productName}</p>
            <div className="flex gap-1.5">
              {r.status === 'pending' && <><button onClick={()=>updateReview(r.id,{status:'approved'})} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald/10 text-emerald hover:bg-emerald/20"><Check size={11}/>Approuver</button><button onClick={()=>updateReview(r.id,{status:'rejected'})} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose/10 text-rose hover:bg-rose/20"><X size={11}/>Rejeter</button></>}
              {r.status === 'approved' && <span className="text-[10px] font-bold text-emerald bg-emerald/10 px-2 py-0.5 rounded">✓ Approuvé</span>}
              {r.status === 'rejected' && <span className="text-[10px] font-bold text-rose bg-rose/10 px-2 py-0.5 rounded">✕ Rejeté</span>}
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  );
}

export function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ code:'', discount:10, type:'percent' as 'percent'|'fixed', minOrder:200, maxUses:100, expiresAt:'2025-12-31' });
  const handleAdd = () => { addCoupon({ ...form, id:`CP${Date.now()}`, used:0, active:true }); setShowNew(false); setForm({ code:'', discount:10, type:'percent', minOrder:200, maxUses:100, expiresAt:'2025-12-31' }); };
  return (
    <div className="space-y-4 max-w-[1000px]">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Coupons</h1><p className="text-[12px] text-gray-500">{coupons.length} codes promotionnels</p></div><button onClick={()=>setShowNew(!showNew)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm"><Plus size={13}/>Nouveau</button></div>
      <AnimatePresence>{showNew && <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden"><div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4"><div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-3"><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Code</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="EX: SUMMER20" className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Réduction</label><input type="number" value={form.discount} onChange={e=>setForm({...form,discount:+e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer"><option value="percent">% Pourcentage</option><option value="fixed">MAD Fixe</option></select></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Min. commande</label><input type="number" value={form.minOrder} onChange={e=>setForm({...form,minOrder:+e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Max utilisations</label><input type="number" value={form.maxUses} onChange={e=>setForm({...form,maxUses:+e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div><div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Expiration</label><input type="date" value={form.expiresAt} onChange={e=>setForm({...form,expiresAt:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div></div><div className="flex gap-2"><button onClick={()=>setShowNew(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-hover-dark">Annuler</button><button onClick={handleAdd} disabled={!form.code} className="px-4 py-1.5 rounded-lg text-[11px] font-bold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 shadow-sm">Créer</button></div></div></motion.div>}</AnimatePresence>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden"><table className="w-full"><thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60"><th className="text-left px-4 py-2 font-semibold">Code</th><th className="text-left px-4 py-2 font-semibold">Réduction</th><th className="text-left px-4 py-2 font-semibold">Min.</th><th className="text-left px-4 py-2 font-semibold">Utilisé</th><th className="text-left px-4 py-2 font-semibold">Expire</th><th className="text-left px-4 py-2 font-semibold">Statut</th><th className="text-right px-4 py-2 font-semibold">Actions</th></tr></thead><tbody>{coupons.map(c=>(<tr key={c.id} className="border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark"><td className="px-4 py-2.5 text-[12px] font-bold font-mono text-primary-500">{c.code}</td><td className="px-4 py-2.5 text-[12px] font-semibold text-gray-900 dark:text-white">{c.discount}{c.type==='percent'?'%':' MAD'}</td><td className="px-4 py-2.5 text-[11px] text-gray-500">{c.minOrder} MAD</td><td className="px-4 py-2.5 text-[11px] text-gray-500">{c.used}/{c.maxUses}</td><td className="px-4 py-2.5 text-[11px] text-gray-400">{c.expiresAt}</td><td className="px-4 py-2.5"><button onClick={()=>updateCoupon(c.id,{active:!c.active})} className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.active?'bg-emerald/10 text-emerald':'bg-gray-100 dark:bg-surface-dark text-gray-400'}`}>{c.active?'Actif':'Inactif'}</button></td><td className="px-4 py-2.5 text-right"><button onClick={()=>deleteCoupon(c.id)} className="p-1.5 rounded-lg hover:bg-rose/5 text-gray-400 hover:text-rose"><Trash2 size={13}/></button></td></tr>))}</tbody></table></div>
    </div>
  );
}

export function AdminShipping() {
  const { shippingZones, updateShippingZone, addShippingZone, deleteShippingZone } = useApp();
  const handleAdd = () => addShippingZone({ id:`SZ${Date.now()}`, name:'Nouvelle zone', cities:'', rate:0, freeAbove:0, estimatedDays:'', active:true });
  return (
    <div className="space-y-4 max-w-[1000px]">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Livraison</h1><p className="text-[12px] text-gray-500">Gérez vos zones de livraison</p></div><button onClick={handleAdd} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm"><Plus size={13}/>Zone</button></div>
      <div className="space-y-3">{shippingZones.map(z => (
        <div key={z.id} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
          <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Truck size={16} className="text-primary-500" /><input defaultValue={z.name} onBlur={e=>updateShippingZone(z.id,{name:e.target.value})} className="text-[13px] font-bold text-gray-900 dark:text-white bg-transparent focus:outline-none border-b border-transparent focus:border-primary-500" /></div><div className="flex items-center gap-2"><button onClick={()=>updateShippingZone(z.id,{active:!z.active})} className={`px-2 py-0.5 rounded text-[9px] font-bold ${z.active?'bg-emerald/10 text-emerald':'bg-gray-100 text-gray-400'}`}>{z.active?'Active':'Inactive'}</button><button onClick={()=>deleteShippingZone(z.id)} className="p-1 rounded-lg hover:bg-rose/5 text-gray-400 hover:text-rose"><Trash2 size={13}/></button></div></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><label className="block text-[10px] font-semibold text-gray-400 mb-1">Villes</label><input defaultValue={z.cities} onBlur={e=>updateShippingZone(z.id,{cities:e.target.value})} className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-400 mb-1">Frais (MAD)</label><input type="number" defaultValue={z.rate} onBlur={e=>updateShippingZone(z.id,{rate:+e.target.value})} className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-400 mb-1">Gratuit à partir de</label><input type="number" defaultValue={z.freeAbove} onBlur={e=>updateShippingZone(z.id,{freeAbove:+e.target.value})} className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-400 mb-1">Délai estimé</label><input defaultValue={z.estimatedDays} onBlur={e=>updateShippingZone(z.id,{estimatedDays:e.target.value})} className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
          </div>
        </div>
      ))}</div>
    </div>
  );
}

export function AdminPayments() {
  const { siteSettings, updateSiteSettings } = useApp();
  return (
    <div className="space-y-4 max-w-[800px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Paiements</h1><p className="text-[12px] text-gray-500">Configurez les méthodes de paiement</p></div>
      <div className="space-y-3">
        {[{key:'codEnabled',label:'Paiement à la livraison (COD)',desc:'Les clients paient en espèces à la réception',icon:'💵'},{key:'cardEnabled',label:'Carte bancaire',desc:'Visa, Mastercard via CMI',icon:'💳'}].map(m => (
          <div key={m.key} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="text-2xl">{m.icon}</span><div><p className="text-[13px] font-bold text-gray-900 dark:text-white">{m.label}</p><p className="text-[11px] text-gray-500">{m.desc}</p></div></div>
            <button onClick={()=>updateSiteSettings({[m.key]:siteSettings[m.key]==='true'?'false':'true'})} className={`w-11 h-6 rounded-full relative transition-colors ${siteSettings[m.key]==='true'?'bg-primary-500':'bg-gray-200 dark:bg-gray-700'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${siteSettings[m.key]==='true'?'left-6':'left-1'}`}/></button>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 space-y-3">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white">Paramètres fiscaux</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Devise</label><select defaultValue={siteSettings.currency} onChange={e=>updateSiteSettings({currency:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer"><option>MAD</option><option>EUR</option><option>USD</option></select></div>
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Taux TVA (%)</label><input defaultValue={siteSettings.taxRate} onBlur={e=>updateSiteSettings({taxRate:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
        </div>
      </div>
    </div>
  );
}

export function AdminSEO() {
  const { siteSettings, updateSiteSettings } = useApp();
  return (
    <div className="space-y-4 max-w-[800px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">SEO</h1><p className="text-[12px] text-gray-500">Optimisation pour les moteurs de recherche</p></div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 space-y-3">
        <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Meta Title</label><input defaultValue={siteSettings.metaTitle} onBlur={e=>updateSiteSettings({metaTitle:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
        <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Meta Description</label><textarea defaultValue={siteSettings.metaDesc} onBlur={e=>updateSiteSettings({metaDesc:e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none" /></div>
        <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">OG Image URL</label><input defaultValue={siteSettings.ogImage} onBlur={e=>updateSiteSettings({ogImage:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
        <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">robots.txt</label><textarea defaultValue={"User-agent: *\nAllow: /\nSitemap: https://azoura.ma/sitemap.xml"} rows={3} className="w-full px-3 py-2 rounded-lg text-[12px] font-mono bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none" /></div>
      </div>
    </div>
  );
}

/* ============================================ */
/* ANALYTICS PAGE                               */
/* ============================================ */
export function AdminAnalytics() {
  const { orders, customers, adminProducts, adminCategories } = useApp();
  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((s, o) => s + o.total, 0);
  const totalProfit = validOrders.reduce((s, o) => s + o.items.reduce((si, it) => {
    const p = adminProducts.find(ap => ap.id === it.id);
    return si + (p ? (it.price - p.costPrice) * it.quantity : 0);
  }, 0), 0);
  const avgOrder = validOrders.length ? Math.round(totalRevenue / validOrders.length) : 0;
  const conversionRate = 3.8;
  const visitors = Math.round(validOrders.length / (conversionRate / 100));

  const monthly = [
    { m:'Jan', v:4200, o:18 }, { m:'Fév', v:5800, o:24 }, { m:'Mar', v:4900, o:20 }, { m:'Avr', v:7200, o:31 },
    { m:'Mai', v:6100, o:26 }, { m:'Jun', v:8400, o:35 }, { m:'Jul', v:7800, o:33 },
  ];
  const maxV = Math.max(...monthly.map(d => d.v));

  const catSales = adminCategories.map(c => {
    const productsInCat = adminProducts.filter(p => p.category === c.id).map(p => p.id);
    const qty = validOrders.reduce((s, o) => s + o.items.filter(it => productsInCat.includes(it.id)).reduce((si, it) => si + it.quantity, 0), 0);
    const rev = validOrders.reduce((s, o) => s + o.items.filter(it => productsInCat.includes(it.id)).reduce((si, it) => si + it.price * it.quantity, 0), 0);
    return { ...c, qty, rev };
  }).sort((a, b) => b.rev - a.rev);
  const maxCatRev = Math.max(1, ...catSales.map(c => c.rev));

  const productSalesMap = new Map<number, { qty: number; rev: number }>();
  validOrders.forEach(o => o.items.forEach(it => {
    const cur = productSalesMap.get(it.id) || { qty: 0, rev: 0 };
    cur.qty += it.quantity; cur.rev += it.price * it.quantity;
    productSalesMap.set(it.id, cur);
  }));
  const topProducts = adminProducts
    .map(p => ({ p, sales: productSalesMap.get(p.id) || { qty: 0, rev: 0 } }))
    .sort((a, b) => b.sales.rev - a.sales.rev)
    .slice(0, 5);

  const stats = [
    { label:'Chiffre d\'affaires', value:`${totalRevenue.toLocaleString()} MAD`, icon:<DollarSign size={18}/>, color:'#2563EB', bg:'bg-primary-50 dark:bg-primary-500/10' },
    { label:'Bénéfice estimé', value:`${totalProfit.toLocaleString()} MAD`, icon:<TrendingUp size={18}/>, color:'#10B981', bg:'bg-emerald/10' },
    { label:'Panier moyen', value:`${avgOrder} MAD`, icon:<ShoppingBag size={18}/>, color:'#F59E0B', bg:'bg-amber/10' },
    { label:'Taux de conversion', value:`${conversionRate}%`, icon:<Percent size={18}/>, color:'#8B5CF6', bg:'bg-purple-50 dark:bg-purple-500/10' },
  ];

  return (
    <div className="space-y-5 max-w-[1400px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Analytics</h1><p className="text-[12px] text-gray-500">Performance détaillée de la boutique</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${s.bg}`} style={{ color:s.color }}>{s.icon}</div>
            <p className="text-[19px] font-black text-gray-900 dark:text-white leading-none">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="text-[14px] font-bold text-gray-900 dark:text-white">Évolution des ventes</h3><p className="text-[11px] text-gray-400">Jan — Jul 2025</p></div>
          </div>
          <div className="flex items-end gap-2.5 h-44">
            {monthly.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-gray-400">{(d.v / 1000).toFixed(1)}k</span>
                <motion.div initial={{ height:0 }} animate={{ height:`${(d.v / maxV) * 100}%` }} transition={{ delay:i*0.06, duration:0.5 }} className="w-full rounded-md bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px]" />
                <span className="text-[10px] text-gray-400">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Visiteurs & Conversion</h3>
          <div className="flex items-center gap-3 mb-4">
            <Users size={22} className="text-primary-500" />
            <div><p className="text-lg font-black text-gray-900 dark:text-white leading-none">{visitors.toLocaleString()}</p><p className="text-[10px] text-gray-400">Visiteurs estimés</p></div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-surface-dark rounded-full overflow-hidden mb-1"><div className="h-full bg-primary-500 rounded-full" style={{ width:`${conversionRate * 10}%` }} /></div>
          <p className="text-[10px] text-gray-400">{conversionRate}% de conversion en commandes</p>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-border-dark space-y-2">
            {[{c:'Casablanca',pct:38},{c:'Rabat',pct:22},{c:'Marrakech',pct:15},{c:'Tanger',pct:13},{c:'Fès',pct:12}].map(c => (
              <div key={c.c} className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 w-20 truncate">{c.c}</span>
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-surface-dark rounded-full overflow-hidden"><div className="h-full bg-primary-500 rounded-full" style={{ width:`${c.pct}%` }} /></div>
                <span className="text-[10px] font-bold text-gray-500 w-8 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Top catégories (par revenu)</h3>
          <div className="space-y-2.5">
            {catSales.slice(0, 6).map(c => (
              <div key={c.id}>
                <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{c.nameFr}</span><span className="text-[11px] font-bold text-gray-900 dark:text-white">{c.rev.toLocaleString()} MAD</span></div>
                <div className="h-1.5 bg-gray-100 dark:bg-surface-dark rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:`${(c.rev / maxCatRev) * 100}%`, background:c.color }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Produits les plus vendus</h3>
          <div className="space-y-2.5">
            {topProducts.map(({ p, sales }) => (
              <div key={p.id} className="flex items-center gap-2.5">
                <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100 dark:bg-surface-dark shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">{p.nameFr}</p><p className="text-[9px] text-gray-400">{sales.qty} vendu(s)</p></div>
                <span className="text-[11px] font-bold text-gray-900 dark:text-white shrink-0">{sales.rev.toLocaleString()} MAD</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l:'Clients actifs', v: customers.filter(c => c.status === 'active').length },
          { l:'Commandes totales', v: orders.length },
          { l:'Total produits actifs', v: adminProducts.filter(p => p.active).length },
          { l:'Valeur stock totale', v: `${adminProducts.reduce((s,p)=>s+p.stock*p.costPrice,0).toLocaleString()} MAD` },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-3.5"><p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{s.l}</p><p className="text-xl font-black text-gray-900 dark:text-white mt-1">{s.v}</p></div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettings() {
  const { siteSettings, updateSiteSettings } = useApp();
  return (
    <div className="space-y-4 max-w-[800px]">
      <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Paramètres Généraux</h1><p className="text-[12px] text-gray-500">Configuration de la boutique</p></div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 space-y-3">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white">Informations de la boutique</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom</label><input defaultValue={siteSettings.siteName} onBlur={e=>updateSiteSettings({siteName:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Slogan</label><input defaultValue={siteSettings.tagline} onBlur={e=>updateSiteSettings({tagline:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Email</label><input defaultValue={siteSettings.email} onBlur={e=>updateSiteSettings({email:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Téléphone</label><input defaultValue={siteSettings.phone} onBlur={e=>updateSiteSettings({phone:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
        </div>
        <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Adresse</label><input defaultValue={siteSettings.address} onBlur={e=>updateSiteSettings({address:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
      </div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4 space-y-3">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white">Réseaux sociaux</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">WhatsApp</label><input defaultValue={siteSettings.whatsapp} onBlur={e=>updateSiteSettings({whatsapp:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
          <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Instagram</label><input defaultValue={siteSettings.instagram} onBlur={e=>updateSiteSettings({instagram:e.target.value})} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
        </div>
      </div>
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div><p className="text-[13px] font-bold text-gray-900 dark:text-white">Mode maintenance</p><p className="text-[11px] text-gray-500">Désactiver temporairement la boutique</p></div>
          <button onClick={()=>updateSiteSettings({maintenanceMode:siteSettings.maintenanceMode==='true'?'false':'true'})} className={`w-11 h-6 rounded-full relative transition-colors ${siteSettings.maintenanceMode==='true'?'bg-rose':'bg-gray-200 dark:bg-gray-700'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${siteSettings.maintenanceMode==='true'?'left-6':'left-1'}`}/></button>
        </div>
      </div>
    </div>
  );
}
