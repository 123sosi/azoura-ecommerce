import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, Upload, Download, Copy, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';

export default function AdminProducts() {
  const { adminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct, adminCategories, adminBrands } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [toast, setToast] = useState('');
  const importRef = useRef<HTMLInputElement>(null);
  const perPage = 8;

  const filtered = adminProducts.filter(p => {
    if (catFilter && p.category !== catFilter) return false;
    if (brandFilter && p.brand !== brandFilter) return false;
    if (search) { const q = search.toLowerCase(); return p.nameFr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q); }
    return true;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const editProduct = editId !== null ? adminProducts.find(p => p.id === editId) : null;

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(p => p.id));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDelete = (id: number) => { deleteAdminProduct(id); setDeleteId(null); showToast('Produit supprimé'); };
  const handleBulkDelete = () => { selected.forEach(id => deleteAdminProduct(id)); setSelected([]); showToast(`${selected.length} produits supprimés`); };
  const handleBulkToggle = (active: boolean) => { selected.forEach(id => updateAdminProduct(id, { active })); setSelected([]); showToast(`${selected.length} produits ${active ? 'activés' : 'désactivés'}`); };

  const handleAddProduct = () => {
    const newId = Math.max(0, ...adminProducts.map(p => p.id)) + 1;
    addAdminProduct({ id: newId, slug: `product-${newId}`, nameFr: 'Nouveau Produit', nameEn: 'New Product', descFr: '', descEn: '', price: 0, costPrice: 0, category: 'chargers', brand: '', sku: `AZ-NEW-${newId}`, barcode: '', stock: 0, lowStockThreshold: 10, weight: 0, images: [], variants: [], active: false, featured: false });
    setEditId(newId);
    showToast('Produit créé — modifiez les détails');
  };

  const exportExcel = () => {
    const rows = adminProducts.map(p => ({
      ID: p.id, SKU: p.sku, Barcode: p.barcode, NomFR: p.nameFr, NomEN: p.nameEn,
      Prix: p.price, AncienPrix: p.oldPrice || '', Cout: p.costPrice, Stock: p.stock,
      SeuilStock: p.lowStockThreshold, Categorie: p.category, Actif: p.active ? 'TRUE' : 'FALSE', Images: p.images.join('|'),
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'azoura-products.xlsx');
    showToast('Export Excel téléchargé');
  };

  const importExcel = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws);
    rows.forEach((row, idx) => {
      const id = Number(row.ID) || Math.max(0, ...adminProducts.map(p => p.id)) + idx + 1;
      const payload = {
        id,
        slug: String(row.NomFR || `product-${id}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        nameFr: String(row.NomFR || `Produit ${id}`),
        nameEn: String(row.NomEN || row.NomFR || `Product ${id}`),
        descFr: '', descEn: '',
        price: Number(row.Prix) || 0,
        oldPrice: row.AncienPrix ? Number(row.AncienPrix) : undefined,
        costPrice: Number(row.Cout) || 0,
        category: String(row.Categorie || 'chargers'),
        sku: String(row.SKU || `AZ-IMP-${id}`),
        barcode: String(row.Barcode || ''),
        stock: Number(row.Stock) || 0,
        lowStockThreshold: Number(row.SeuilStock) || 10,
        weight: 0,
        images: String(row.Images || '').split('|').filter(Boolean),
        variants: [],
        active: String(row.Actif || 'TRUE').toUpperCase() !== 'FALSE',
        featured: false,
      };
      const existing = adminProducts.find(p => p.id === id);
      if (existing) updateAdminProduct(id, payload);
      else addAdminProduct(payload);
    });
    showToast(`${rows.length} lignes importées`);
  };

  const uploadImages = async (files: FileList | null, id: number) => {
    if (!files?.length) return;
    const urls = await Promise.all(Array.from(files).map(file => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    const product = adminProducts.find(p => p.id === id);
    if (product) updateAdminProduct(id, { images: [...product.images, ...urls] });
    showToast(`${urls.length} image(s) ajoutée(s)`);
  };

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* Toast */}
      <AnimatePresence>{toast && <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-[12px] font-semibold rounded-xl shadow-2xl"><Check size={14} className="text-emerald" />{toast}</motion.div>}</AnimatePresence>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Produits</h1><p className="text-[12px] text-gray-500">{adminProducts.length} produits • {adminProducts.filter(p => p.active).length} actifs</p></div>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-hover-dark transition-colors"><Download size={13} /> Excel</button>
          <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => e.target.files?.[0] && importExcel(e.target.files[0])} />
          <button onClick={() => importRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-hover-dark transition-colors"><Upload size={13} /> Import</button>
          <button onClick={handleAddProduct} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm transition-all"><Plus size={13} /> Ajouter produit</button>
        </div>
      </div>

      {/* Filters + Bulk */}
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl p-3 flex flex-wrap gap-2.5 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher produit, SKU..." className="w-full pl-8 pr-3 py-[7px] rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} className="px-3 py-[7px] rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer">
          <option value="">Toutes catégories</option>
          {adminCategories.map(c => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
        </select>
        <select value={brandFilter} onChange={e => { setBrandFilter(e.target.value); setPage(1); }} className="px-3 py-[7px] rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer">
          <option value="">Toutes marques</option>
          {adminBrands.map(b => <option key={b.id} value={b.id}>{b.nameFr}</option>)}
        </select>
        {selected.length > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-bold text-primary-500">{selected.length} sélectionné(s)</span>
            <button onClick={() => handleBulkToggle(true)} className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald/10 text-emerald hover:bg-emerald/20">Activer</button>
            <button onClick={() => handleBulkToggle(false)} className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-surface-dark text-gray-500 hover:bg-gray-200">Désactiver</button>
            <button onClick={handleBulkDelete} className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-rose/10 text-rose hover:bg-rose/20">Supprimer</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-border-dark bg-gray-50/60 dark:bg-surface-dark/60">
              <th className="w-10 px-3 py-2"><input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="accent-primary-500 rounded" /></th>
              <th className="text-left px-3 py-2 font-semibold">Produit</th>
              <th className="text-left px-3 py-2 font-semibold hidden md:table-cell">SKU</th>
              <th className="text-left px-3 py-2 font-semibold">Prix</th>
              <th className="text-left px-3 py-2 font-semibold">Stock</th>
              <th className="text-left px-3 py-2 font-semibold hidden lg:table-cell">Catégorie</th>
              <th className="text-left px-3 py-2 font-semibold hidden lg:table-cell">Marque</th>
              <th className="text-left px-3 py-2 font-semibold hidden lg:table-cell">Statut</th>
              <th className="text-right px-3 py-2 font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className={`border-b border-gray-50 dark:border-border-dark last:border-0 hover:bg-gray-50/50 dark:hover:bg-hover-dark transition-colors ${selected.includes(p.id) ? 'bg-primary-50/30 dark:bg-primary-500/5' : ''}`}>
                  <td className="px-3 py-2.5"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-primary-500 rounded" /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={p.images[0] || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23f1f5f9" width="40" height="40" rx="8"/></svg>'} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 dark:bg-surface-dark shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">{p.nameFr}</p>
                        {p.badge && <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${p.badge === 'NEW' ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' : p.badge === 'SALE' ? 'bg-rose/10 text-rose' : 'bg-amber/10 text-amber'}`}>{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell"><span className="text-[11px] font-mono text-gray-500 bg-gray-50 dark:bg-surface-dark px-1.5 py-0.5 rounded">{p.sku}</span></td>
                  <td className="px-3 py-2.5">
                    <span className="text-[12px] font-bold text-gray-900 dark:text-white">{p.price}</span>
                    {p.oldPrice && <span className="text-[10px] text-gray-400 line-through ml-1">{p.oldPrice}</span>}
                    <p className="text-[9px] text-gray-400">Coût: {p.costPrice} MAD</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[11px] font-bold ${p.stock === 0 ? 'text-rose' : p.stock <= p.lowStockThreshold ? 'text-amber' : 'text-emerald'}`}>{p.stock}</span>
                    {p.stock === 0 && <p className="text-[8px] font-bold text-rose">Rupture</p>}
                    {p.stock > 0 && p.stock <= p.lowStockThreshold && <p className="text-[8px] font-bold text-amber">Faible</p>}
                  </td>
                  <td className="px-3 py-2.5 hidden lg:table-cell"><span className="text-[11px] text-gray-500 capitalize">{adminCategories.find(c => c.id === p.category)?.nameFr || p.category}</span></td>
                  <td className="px-3 py-2.5 hidden lg:table-cell"><span className="text-[11px] text-gray-500">{adminBrands.find(b => b.id === p.brand)?.nameFr || '—'}</span></td>
                  <td className="px-3 py-2.5 hidden lg:table-cell">
                    <button onClick={() => updateAdminProduct(p.id, { active: !p.active })} className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${p.active ? 'bg-emerald/10 text-emerald hover:bg-emerald/20' : 'bg-gray-100 dark:bg-surface-dark text-gray-400 hover:bg-gray-200'}`}>{p.active ? 'Actif' : 'Inactif'}</button>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => setEditId(p.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 hover:text-primary-500 transition-colors" title="Modifier"><Edit size={14} /></button>
                      <button onClick={() => { navigator.clipboard.writeText(p.sku); showToast('SKU copié'); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400 hover:text-gray-600 transition-colors" title="Copier SKU"><Copy size={14} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-rose/5 text-gray-400 hover:text-rose transition-colors" title="Supprimer"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-border-dark bg-gray-50/40 dark:bg-surface-dark/40">
            <span className="text-[11px] text-gray-400">{filtered.length} résultats • Page {page}/{totalPages}</span>
            <div className="flex gap-1">{Array.from({ length: totalPages }, (_, i) => <button key={i} onClick={() => setPage(i+1)} className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-colors ${page === i+1 ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-hover-dark'}`}>{i+1}</button>)}</div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editProduct && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-[5vh] overflow-y-auto" onClick={() => setEditId(null)}>
            <motion.div initial={{ scale:0.97, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.97, opacity:0 }} className="bg-white dark:bg-card-dark rounded-xl w-full max-w-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-border-dark">
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Modifier : {editProduct.nameFr}</h2>
                <button onClick={() => setEditId(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-400"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom (FR)</label><input defaultValue={editProduct.nameFr} onBlur={e => updateAdminProduct(editProduct.id, { nameFr: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Nom (EN)</label><input defaultValue={editProduct.nameEn} onBlur={e => updateAdminProduct(editProduct.id, { nameEn: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Prix (MAD)</label><input type="number" defaultValue={editProduct.price} onBlur={e => updateAdminProduct(editProduct.id, { price: +e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Ancien prix</label><input type="number" defaultValue={editProduct.oldPrice || ''} onBlur={e => updateAdminProduct(editProduct.id, { oldPrice: +e.target.value || undefined })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Coût</label><input type="number" defaultValue={editProduct.costPrice} onBlur={e => updateAdminProduct(editProduct.id, { costPrice: +e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Catégorie</label><select defaultValue={editProduct.category} onChange={e => updateAdminProduct(editProduct.id, { category: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer">{adminCategories.map(c => <option key={c.id} value={c.id}>{c.nameFr}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Marque</label><select defaultValue={editProduct.brand || ''} onChange={e => updateAdminProduct(editProduct.id, { brand: e.target.value || undefined })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer"><option value="">Aucune</option>{adminBrands.map(b => <option key={b.id} value={b.id}>{b.nameFr}</option>)}</select></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">SKU</label><input defaultValue={editProduct.sku} onBlur={e => updateAdminProduct(editProduct.id, { sku: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] font-mono bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Code-barres</label><input defaultValue={editProduct.barcode} onBlur={e => updateAdminProduct(editProduct.id, { barcode: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] font-mono bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Stock</label><input type="number" defaultValue={editProduct.stock} onBlur={e => updateAdminProduct(editProduct.id, { stock: +e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Poids (g)</label><input type="number" defaultValue={editProduct.weight} onBlur={e => updateAdminProduct(editProduct.id, { weight: +e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                </div>
                <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Images (URLs séparées par des virgules)</label><textarea defaultValue={editProduct.images.join(', ')} onBlur={e => updateAdminProduct(editProduct.id, { images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} rows={2} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none" /></div>
                <label onDrop={e => { e.preventDefault(); uploadImages(e.dataTransfer.files, editProduct.id); }} onDragOver={e => e.preventDefault()} className="block border-2 border-dashed border-gray-200 dark:border-border-dark rounded-xl p-5 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/40 dark:hover:bg-primary-500/5 transition-all">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">Glisser-déposer des images ou cliquer pour uploader</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={e => uploadImages(e.target.files, editProduct.id)} />
                </label>
                {editProduct.images.length > 0 && <div className="flex gap-2 flex-wrap">{editProduct.images.map((img, i) => <div key={i} className="relative group"><img src={img} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-border-dark" /><button onClick={() => updateAdminProduct(editProduct.id, { images: editProduct.images.filter((_, idx) => idx !== i) })} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose text-white text-[10px] opacity-0 group-hover:opacity-100">×</button></div>)}</div>}
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Badge</label><select defaultValue={editProduct.badge || ''} onChange={e => updateAdminProduct(editProduct.id, { badge: e.target.value || undefined })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer"><option value="">Aucun</option><option value="NEW">NEW</option><option value="SALE">SALE</option><option value="BEST">BEST</option></select></div>
                  <div className="flex items-end gap-3"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editProduct.active} onChange={() => updateAdminProduct(editProduct.id, { active: !editProduct.active })} className="accent-primary-500 rounded" /><span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">Actif</span></label></div>
                  <div className="flex items-end gap-3"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editProduct.featured} onChange={() => updateAdminProduct(editProduct.id, { featured: !editProduct.featured })} className="accent-primary-500 rounded" /><span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">En vedette</span></label></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Meta title</label><input defaultValue={editProduct.metaTitle || editProduct.nameFr} onBlur={e => updateAdminProduct(editProduct.id, { metaTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                  <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Meta description</label><input defaultValue={editProduct.metaDescription || editProduct.descFr} onBlur={e => updateAdminProduct(editProduct.id, { metaDescription: e.target.value })} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40" /></div>
                </div>
                <div><label className="block text-[11px] font-semibold text-gray-500 mb-1">Variantes (format: Couleur=Noir|Blanc; Taille=1m|2m)</label><textarea defaultValue={editProduct.variants.map(v => `${v.name}=${v.options.join('|')}`).join('; ')} onBlur={e => updateAdminProduct(editProduct.id, { variants: e.target.value.split(';').map(raw => raw.trim()).filter(Boolean).map(raw => { const [name, opts = ''] = raw.split('='); return { name: name.trim(), options: opts.split('|').map(o => o.trim()).filter(Boolean) }; }) })} rows={2} className="w-full px-3 py-2 rounded-lg text-[12px] bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none" /></div>
              </div>
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100 dark:border-border-dark">
                <button onClick={() => setEditId(null)} className="px-4 py-2 rounded-lg text-[12px] font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-hover-dark">Fermer</button>
                <button onClick={() => { setEditId(null); showToast('Modifications enregistrées'); }} className="px-4 py-2 rounded-lg text-[12px] font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-sm">Sauvegarder</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-white dark:bg-card-dark rounded-xl p-5 w-full max-w-xs text-center" onClick={e => e.stopPropagation()}>
              <div className="w-11 h-11 rounded-xl bg-rose/10 text-rose flex items-center justify-center mx-auto mb-3"><Trash2 size={20} /></div>
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">Supprimer ce produit ?</h3>
              <p className="text-[12px] text-gray-500 mb-4">Cette action est irréversible.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg text-[12px] font-semibold text-gray-500 bg-gray-100 dark:bg-surface-dark hover:bg-gray-200">Annuler</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 rounded-lg text-[12px] font-bold bg-rose text-white hover:bg-rose/90">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
