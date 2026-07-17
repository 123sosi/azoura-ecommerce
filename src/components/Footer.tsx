import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Trust bar */}
      <div className="border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={22} />, t1: t('Livraison Rapide', 'Fast Delivery'), t2: t('24-48h au Maroc', '24-48h in Morocco') },
            { icon: <Shield size={22} />, t1: t('Garantie 2 Ans', '2 Year Warranty'), t2: t('Remplacement gratuit', 'Free replacement') },
            { icon: <CreditCard size={22} />, t1: t('Paiement Sécurisé', 'Secure Payment'), t2: t('Carte & COD', 'Card & COD') },
            { icon: <RotateCcw size={22} />, t1: t('Retour 30 Jours', '30 Day Return'), t2: t('Satisfaction garantie', 'Satisfaction guaranteed') },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-primary-400">{b.icon}</div>
              <div><p className="text-sm font-semibold text-white">{b.t1}</p><p className="text-[11px] text-gray-500">{b.t2}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-[11px] bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center"><span className="text-white font-black text-sm">A</span></div>
              <span className="text-xl font-extrabold text-white tracking-tight">AZOURA</span>
            </Link>
            <p className="text-[13px] leading-relaxed text-gray-500 mb-5">{t('Accessoires mobiles premium conçus pour le style de vie moderne. Qualité, innovation et design.', 'Premium mobile accessories designed for the modern lifestyle.')}</p>
            <div className="flex gap-2">
              {['Fb', 'Ig', 'Tw', 'Yt'].map(s => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-gray-800/50 hover:bg-primary-500 text-gray-500 hover:text-white flex items-center justify-center transition-all text-[11px] font-bold">{s}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-[13px] mb-4 uppercase tracking-wider">{t('Navigation', 'Navigation')}</h4>
            <ul className="space-y-2.5">
              {[{ to: '/', l: t('Accueil', 'Home') }, { to: '/products', l: t('Produits', 'Products') }, { to: '/about', l: t('À propos', 'About') }, { to: '/contact', l: 'Contact' }].map(link => (
                <li key={link.to}><Link to={link.to} className="text-[13px] hover:text-primary-400 transition-colors flex items-center gap-1 group"><ArrowRight size={10} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />{link.l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-[13px] mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {[t('Centre d\'aide', 'Help Center'), t('Livraison', 'Shipping'), t('Retours', 'Returns'), t('Garantie', 'Warranty'), t('Conditions', 'Terms'), t('Confidentialité', 'Privacy')].map(l => (
                <li key={l}><a href="#" className="text-[13px] hover:text-primary-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-[13px] mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2"><MapPin size={14} className="text-primary-500 mt-0.5 shrink-0" /><span className="text-[13px]">123 Bd Mohammed V, Casablanca</span></li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary-500 shrink-0" /><span className="text-[13px]">+212 522 123 456</span></li>
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary-500 shrink-0" /><span className="text-[13px]">contact@azoura.ma</span></li>
            </ul>
            <div className="mt-5">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">{t('Paiement sécurisé', 'Secure Payment')}</p>
              <div className="flex gap-1.5">{['VISA', 'MC', 'CMI', 'COD'].map(m => (<div key={m} className="px-2.5 py-1 rounded-md bg-gray-800/50 text-[9px] font-bold text-gray-500 border border-gray-800">{m}</div>))}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-600">© 2025 AZOURA. {t('Tous droits réservés.', 'All rights reserved.')}</p>
          <p className="text-[11px] text-gray-600">{t('Conçu avec', 'Designed with')} 💙 {t('au Maroc', 'in Morocco')} 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
