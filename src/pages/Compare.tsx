import { Link } from 'react-router-dom';
import { GitCompareArrows, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Compare() {
  const { t, lang, compareList, toggleCompare, addToCart, products } = useApp();
  const items = compareList.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;

  if (!items.length) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50/60 dark:bg-surface-dark px-4">
        <div className="premium-card p-8 text-center max-w-md">
          <GitCompareArrows className="mx-auto text-primary-500 mb-4" size={46} />
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Comparaison vide', 'Compare is empty')}</h1>
          <p className="text-sm text-gray-500 mb-6">{t('Ajoutez jusqu’à 4 produits pour comparer leurs caractéristiques.', 'Add up to 4 products to compare specs.')}</p>
          <Link to="/products" className="inline-flex px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-bold">{t('Voir les produits', 'Browse products')}</Link>
        </div>
      </div>
    );
  }

  const rows = [
    { label: t('Prix', 'Price'), get: (p: (typeof items)[number]) => `${p.price} MAD` },
    { label: t('Catégorie', 'Category'), get: (p: (typeof items)[number]) => p.category },
    { label: t('Note', 'Rating'), get: (p: (typeof items)[number]) => `${p.rating}/5 (${p.reviewCount})` },
    { label: t('Stock', 'Stock'), get: (p: (typeof items)[number]) => p.inStock ? t('Disponible', 'Available') : t('Rupture', 'Out of stock') },
    { label: t('Description', 'Description'), get: (p: (typeof items)[number]) => p.shortDesc[lang] },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/60 dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-primary-500 text-xs font-bold uppercase tracking-widest">AZOURA</p>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('Comparer les produits', 'Compare products')}</h1>
        </div>

        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr>
                  <th className="w-40 p-4 text-left text-xs text-gray-400 uppercase tracking-wider">{t('Produit', 'Product')}</th>
                  {items.map(p => (
                    <th key={p.id} className="p-4 text-left align-top border-l border-gray-100 dark:border-border-dark">
                      <div className="relative">
                        <button onClick={() => toggleCompare(p.id)} className="absolute top-0 right-0 p-1.5 rounded-lg bg-gray-100 dark:bg-surface-dark text-gray-400 hover:text-rose"><X size={14} /></button>
                        <img src={p.image} alt={p.name[lang]} className="w-28 h-28 object-cover rounded-2xl mb-3" />
                        <Link to={`/products/${p.slug}`} className="block text-sm font-black text-gray-900 dark:text-white hover:text-primary-500 line-clamp-1 pr-8">{p.name[lang]}</Link>
                        <button onClick={() => addToCart({ id: p.id, name: p.name[lang], price: p.price, image: p.image })} className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 bg-primary-500 text-white text-xs font-bold rounded-xl"><ShoppingCart size={13} /> {t('Ajouter', 'Add')}</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.label} className="border-t border-gray-100 dark:border-border-dark">
                    <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/70 dark:bg-surface-dark/60">{row.label}</td>
                    {items.map(p => <td key={p.id} className="p-4 text-sm text-gray-700 dark:text-gray-300 border-l border-gray-100 dark:border-border-dark">{row.get(p)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
