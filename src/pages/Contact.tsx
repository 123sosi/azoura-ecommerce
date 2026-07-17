import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, ChevronUp, MessageCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const { t, isDark } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t('Requis', 'Required');
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t('Email invalide', 'Invalid');
    if (!form.message.trim()) e.message = t('Requis', 'Required');
    setErrors(e); return Object.keys(e).length === 0;
  };

  const faqs = [
    { q: t('Délais de livraison ?', 'Delivery times?'), a: t('24-48h grandes villes, 3-5 jours autres régions. Gratuit dès 299 MAD.', '24-48h major cities, 3-5 days other regions. Free over 299 MAD.') },
    { q: t('Comment fonctionne la garantie ?', 'How does warranty work?'), a: t('2 ans de garantie, remplacement gratuit en cas de défaut.', '2 year warranty, free replacement for defects.') },
    { q: t('Modes de paiement ?', 'Payment methods?'), a: t('Carte bancaire, COD, virement. Paiement 100% sécurisé.', 'Card, COD, transfer. 100% secure payment.') },
    { q: t('Politique de retour ?', 'Return policy?'), a: t('30 jours pour retourner. Remboursement complet garanti.', '30 days to return. Full refund guaranteed.') },
    { q: t('Livraison hors Maroc ?', 'Delivery outside Morocco?'), a: t('Prochainement — expansion Afrique du Nord prévue 2025.', 'Coming soon — North Africa expansion planned 2025.') },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50/50 dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-primary-500 font-bold text-[13px] uppercase tracking-[0.15em] mb-2">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{t('Contactez-nous', 'Get in Touch')}</h1>
          <p className="text-gray-500 text-[14px]">{t('Notre équipe répond sous 24h', 'Our team responds within 24h')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[{ icon: <MapPin size={20} />, t1: t('Adresse', 'Address'), t2: '123 Bd Mohammed V, Casablanca', c: '#2563EB' },
            { icon: <Phone size={20} />, t1: t('Téléphone', 'Phone'), t2: '+212 522 123 456', c: '#06B6D4' },
            { icon: <Mail size={20} />, t1: 'Email', t2: 'contact@azoura.ma', c: '#10B981' },
            { icon: <Clock size={20} />, t1: t('Horaires', 'Hours'), t2: t('Lun-Sam 9h-18h', 'Mon-Sat 9am-6pm'), c: '#8B5CF6' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="premium-card p-5 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${c.c}10`, color: c.c }}>{c.icon}</div>
              <h3 className="font-bold text-[13px] text-gray-900 dark:text-white mb-0.5">{c.t1}</h3>
              <p className="text-[13px] text-gray-500">{c.t2}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="premium-card p-7">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-5">{t('Envoyez un message', 'Send a message')}</h2>
              {sent ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                  <CheckCircle size={48} className="text-emerald mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('Envoyé !', 'Sent!')}</h3>
                  <p className="text-[13px] text-gray-500">{t('Réponse sous 24h', 'Response within 24h')}</p>
                </motion.div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (validate()) setSent(true); }} className="space-y-4">
                  {[{ k: 'name', l: t('Nom', 'Name'), ph: t('Votre nom', 'Your name'), req: true },
                    { k: 'email', l: 'Email', ph: 'email@example.com', req: true },
                    { k: 'subject', l: t('Sujet', 'Subject'), ph: t('Sujet', 'Subject'), req: false },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{f.l}{f.req ? ' *' : ''}</label>
                      <input type={f.k === 'email' ? 'email' : 'text'} value={(form as Record<string, string>)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} className={`w-full px-4 py-3 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'bg-surface-dark text-white border border-border-dark' : 'bg-gray-50 text-gray-900 border border-gray-200'} ${(errors as Record<string, string>)[f.k] ? 'ring-2 ring-rose' : ''}`} placeholder={f.ph} />
                      {(errors as Record<string, string>)[f.k] && <p className="text-[11px] text-rose mt-1">{(errors as Record<string, string>)[f.k]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} className={`w-full px-4 py-3 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${isDark ? 'bg-surface-dark text-white border border-border-dark' : 'bg-gray-50 text-gray-900 border border-gray-200'} ${errors.message ? 'ring-2 ring-rose' : ''}`} placeholder={t('Votre message...', 'Your message...')} />
                    {errors.message && <p className="text-[11px] text-rose mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/20 transition-all">
                    <Send size={16} /> {t('Envoyer', 'Send')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="premium-card overflow-hidden h-56">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53400!2d-7.65!3d33.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca!5e0!3m2!1sfr!2sma!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="AZOURA" />
            </div>
            <div className="premium-card p-5">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MessageCircle size={18} className="text-primary-500" /> FAQ</h3>
              <div className="space-y-2">
                {faqs.map((f, i) => (
                  <div key={i} className={`rounded-xl border overflow-hidden ${isDark ? 'border-border-dark' : 'border-gray-100'}`}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-[13px] font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-hover-dark transition-colors">
                      {f.q} {openFaq === i ? <ChevronUp size={14} className="text-primary-500 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                    </button>
                    <AnimatePresence>{openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p className="px-4 pb-3 text-[13px] text-gray-500 leading-relaxed">{f.a}</p></motion.div>
                    )}</AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
