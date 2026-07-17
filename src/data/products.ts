// ============================================================
// AZOURA PRODUCT DATA
// To replace images: update the URL strings below.
// All images use external URLs for easy replacement.
// ============================================================

export interface Product {
  id: number;
  slug: string;
  name: { fr: string; en: string };
  shortDesc: { fr: string; en: string };
  description: { fr: string; en: string };
  price: number;
  oldPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: 'NEW' | 'SALE' | 'BEST';
  inStock: boolean;
  colors?: { name: string; hex: string }[];
  specs: { label: string; value: string }[];
  features: { fr: string[]; en: string[] };
}

export interface Category {
  id: string;
  name: { fr: string; en: string };
  icon: string;
  count: number;
  color: string;
}

// ============================================================
// PRODUCT IMAGES — Replace these URLs with your own
// ============================================================
const IMG = {
  pb20k: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=600',
  pb10k: 'https://images.pexels.com/photos/4765366/pexels-photo-4765366.jpeg?auto=compress&cs=tinysrgb&w=600',
  pb30k: 'https://images.pexels.com/photos/18311089/pexels-photo-18311089.jpeg?auto=compress&cs=tinysrgb&w=600',
  ch65w: 'https://images.pexels.com/photos/12880803/pexels-photo-12880803.jpeg?auto=compress&cs=tinysrgb&w=600',
  ch45w: 'https://images.pexels.com/photos/19117855/pexels-photo-19117855.jpeg?auto=compress&cs=tinysrgb&w=600',
  wch15: 'https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg?auto=compress&cs=tinysrgb&w=600',
  mag: 'https://images.pexels.com/photos/29765810/pexels-photo-29765810.jpeg?auto=compress&cs=tinysrgb&w=600',
  cable2m: 'https://images.pexels.com/photos/18641665/pexels-photo-18641665.png?auto=compress&cs=tinysrgb&w=600',
  cable1m: 'https://images.pexels.com/photos/2657667/pexels-photo-2657667.jpeg?auto=compress&cs=tinysrgb&w=600',
  earbuds: 'https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?auto=compress&cs=tinysrgb&w=600',
  headphones: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
  earsport: 'https://images.pexels.com/photos/3756985/pexels-photo-3756985.jpeg?auto=compress&cs=tinysrgb&w=600',
  case14: 'https://images.pexels.com/photos/7989741/pexels-photo-7989741.jpeg?auto=compress&cs=tinysrgb&w=600',
  case15: 'https://images.pexels.com/photos/11120516/pexels-photo-11120516.jpeg?auto=compress&cs=tinysrgb&w=600',
  hub: 'https://images.pexels.com/photos/2657667/pexels-photo-2657667.jpeg?auto=compress&cs=tinysrgb&w=600',
  stand: 'https://images.pexels.com/photos/19117855/pexels-photo-19117855.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export const categories: Category[] = [
  { id: 'chargers', name: { fr: 'Chargeurs', en: 'Chargers' }, icon: 'Zap', count: 4, color: '#F59E0B' },
  { id: 'power-banks', name: { fr: 'Power Banks', en: 'Power Banks' }, icon: 'BatteryFull', count: 3, color: '#2563EB' },
  { id: 'cables', name: { fr: 'Câbles USB-C', en: 'USB-C Cables' }, icon: 'Cable', count: 2, color: '#06B6D4' },
  { id: 'audio', name: { fr: 'Audio', en: 'Audio' }, icon: 'Headphones', count: 3, color: '#8B5CF6' },
  { id: 'cases', name: { fr: 'Coques', en: 'Phone Cases' }, icon: 'Smartphone', count: 2, color: '#F43F5E' },
  { id: 'accessories', name: { fr: 'Accessoires', en: 'Accessories' }, icon: 'Layers', count: 2, color: '#10B981' },
];

export const products: Product[] = [
  {
    id: 1, slug: 'power-bank-20000mah',
    name: { fr: 'Power Bank 20000mAh', en: '20000mAh Power Bank' },
    shortDesc: { fr: 'Charge rapide USB-C 22.5W', en: 'USB-C 22.5W Fast Charging' },
    description: { fr: 'Notre power bank phare avec une capacité massive de 20000mAh. Rechargez votre smartphone jusqu\'à 5 fois avec une seule charge. Compatible avec tous les appareils USB-C et USB-A.', en: 'Our flagship power bank with a massive 20000mAh capacity. Recharge your smartphone up to 5 times on a single charge. Compatible with all USB-C and USB-A devices.' },
    price: 249, oldPrice: 349, category: 'power-banks', rating: 4.8, reviewCount: 342,
    image: IMG.pb20k, images: [IMG.pb20k, IMG.pb10k, IMG.pb30k],
    badge: 'BEST', inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Blanc', hex: '#f5f5f5' }, { name: 'Bleu', hex: '#0066FF' }],
    specs: [{ label: 'Capacité', value: '20000mAh' }, { label: 'Entrée', value: 'USB-C 22.5W' }, { label: 'Sortie', value: 'USB-C + USB-A' }, { label: 'Poids', value: '350g' }, { label: 'Dimensions', value: '148 × 72 × 25mm' }],
    features: { fr: ['Charge rapide 22.5W', 'Double sortie USB-C + USB-A', 'Écran LED digital', 'Protection contre la surchauffe', 'Boîtier en aluminium premium'], en: ['22.5W Fast Charging', 'Dual USB-C + USB-A output', 'Digital LED display', 'Overheat protection', 'Premium aluminum casing'] },
  },
  {
    id: 2, slug: 'chargeur-rapide-65w',
    name: { fr: 'Chargeur Rapide 65W GaN', en: '65W GaN Fast Charger' },
    shortDesc: { fr: 'Technologie GaN III compacte', en: 'Compact GaN III Technology' },
    description: { fr: 'Chargeur mural ultra-compact avec technologie GaN III. Charge votre MacBook, iPad et iPhone simultanément. 65W de puissance dans un format de poche.', en: 'Ultra-compact wall charger with GaN III technology. Charge your MacBook, iPad, and iPhone simultaneously. 65W of power in a pocket-sized format.' },
    price: 199, oldPrice: 299, category: 'chargers', rating: 4.9, reviewCount: 518,
    image: IMG.ch65w, images: [IMG.ch65w, IMG.ch45w, IMG.wch15],
    badge: 'NEW', inStock: true,
    colors: [{ name: 'Blanc', hex: '#f5f5f5' }, { name: 'Noir', hex: '#1a1a1a' }],
    specs: [{ label: 'Puissance', value: '65W' }, { label: 'Ports', value: '2× USB-C + 1× USB-A' }, { label: 'Technologie', value: 'GaN III' }, { label: 'Poids', value: '120g' }],
    features: { fr: ['Technologie GaN III', '3 ports de charge', 'Compatible MacBook/iPad/iPhone', 'Protection intelligente', 'Design ultra-compact'], en: ['GaN III Technology', '3 charging ports', 'MacBook/iPad/iPhone compatible', 'Smart protection', 'Ultra-compact design'] },
  },
  {
    id: 3, slug: 'cable-usb-c-2m',
    name: { fr: 'Câble USB-C Tressé 2m', en: '2m Braided USB-C Cable' },
    shortDesc: { fr: 'Nylon tressé 100W PD', en: '100W PD Braided Nylon' },
    description: { fr: 'Câble USB-C de qualité supérieure avec gaine en nylon tressé. Supporte la charge rapide jusqu\'à 100W et le transfert de données à 480Mbps.', en: 'Premium USB-C cable with braided nylon sheath. Supports fast charging up to 100W and 480Mbps data transfer.' },
    price: 89, category: 'cables', rating: 4.7, reviewCount: 890,
    image: IMG.cable2m, images: [IMG.cable2m, IMG.cable1m],
    inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Gris', hex: '#888' }, { name: 'Rouge', hex: '#e74c3c' }],
    specs: [{ label: 'Longueur', value: '2 mètres' }, { label: 'Puissance', value: '100W PD' }, { label: 'Données', value: '480Mbps' }, { label: 'Matériau', value: 'Nylon tressé' }],
    features: { fr: ['Nylon tressé ultra-résistant', 'Charge rapide 100W PD', 'Connecteurs renforcés', '10000+ flexions testées', 'Compatible universel'], en: ['Ultra-durable braided nylon', '100W PD fast charging', 'Reinforced connectors', '10000+ bend tested', 'Universal compatible'] },
  },
  {
    id: 4, slug: 'ecouteurs-sans-fil-pro',
    name: { fr: 'Écouteurs Sans Fil Pro', en: 'Pro Wireless Earbuds' },
    shortDesc: { fr: 'ANC + 36h d\'autonomie', en: 'ANC + 36h Battery Life' },
    description: { fr: 'Écouteurs true wireless avec réduction de bruit active. Son Hi-Fi avec codec LDAC. 36 heures d\'autonomie totale avec le boîtier de charge.', en: 'True wireless earbuds with active noise cancellation. Hi-Fi sound with LDAC codec. 36 hours total battery life with charging case.' },
    price: 499, oldPrice: 699, category: 'audio', rating: 4.8, reviewCount: 267,
    image: IMG.earbuds, images: [IMG.earbuds, IMG.headphones, IMG.earsport],
    badge: 'NEW', inStock: true,
    colors: [{ name: 'Blanc', hex: '#f5f5f5' }, { name: 'Noir', hex: '#1a1a1a' }],
    specs: [{ label: 'Type', value: 'True Wireless' }, { label: 'ANC', value: 'Oui - Hybride' }, { label: 'Autonomie', value: '8h + 28h boîtier' }, { label: 'Codec', value: 'LDAC, AAC, SBC' }, { label: 'Bluetooth', value: '5.3' }],
    features: { fr: ['Réduction de bruit active hybride', 'Son Hi-Fi LDAC', '36h d\'autonomie totale', 'IPX5 résistant à l\'eau', 'Mode transparence'], en: ['Hybrid Active Noise Cancellation', 'Hi-Fi LDAC Sound', '36h total battery life', 'IPX5 water resistant', 'Transparency mode'] },
  },
  {
    id: 5, slug: 'chargeur-sans-fil-15w',
    name: { fr: 'Chargeur Sans Fil 15W', en: '15W Wireless Charger' },
    shortDesc: { fr: 'Qi2 compatible MagSafe', en: 'Qi2 MagSafe Compatible' },
    description: { fr: 'Chargeur sans fil magnétique compatible Qi2 et MagSafe. Alignement parfait avec aimants intégrés. Charge rapide 15W pour iPhone et Samsung.', en: 'Magnetic wireless charger compatible with Qi2 and MagSafe. Perfect alignment with built-in magnets. 15W fast charging for iPhone and Samsung.' },
    price: 199, oldPrice: 249, category: 'chargers', rating: 4.6, reviewCount: 156,
    image: IMG.wch15, images: [IMG.wch15, IMG.mag],
    badge: 'SALE', inStock: true,
    specs: [{ label: 'Puissance', value: '15W' }, { label: 'Standard', value: 'Qi2 / MagSafe' }, { label: 'LED', value: 'Indicateur de charge' }],
    features: { fr: ['Compatible Qi2 et MagSafe', 'Alignement magnétique parfait', 'LED indicateur de charge', 'Protection multi-couches', 'Design ultra-fin'], en: ['Qi2 and MagSafe compatible', 'Perfect magnetic alignment', 'Charging LED indicator', 'Multi-layer protection', 'Ultra-thin design'] },
  },
  {
    id: 6, slug: 'coque-iphone-premium',
    name: { fr: 'Coque iPhone Premium', en: 'Premium iPhone Case' },
    shortDesc: { fr: 'MagSafe + Protection militaire', en: 'MagSafe + Military Protection' },
    description: { fr: 'Coque de protection premium avec certification militaire MIL-STD-810G. Compatible MagSafe avec aimants intégrés. Polycarbonate + TPU pour une protection maximale.', en: 'Premium protective case with MIL-STD-810G military certification. MagSafe compatible with built-in magnets. Polycarbonate + TPU for maximum protection.' },
    price: 149, category: 'cases', rating: 4.5, reviewCount: 423,
    image: IMG.case14, images: [IMG.case14, IMG.case15],
    inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Transparent', hex: '#e0e0e0' }, { name: 'Bleu Navy', hex: '#1a237e' }, { name: 'Vert', hex: '#2e7d32' }],
    specs: [{ label: 'Matériau', value: 'PC + TPU' }, { label: 'MagSafe', value: 'Oui' }, { label: 'Certification', value: 'MIL-STD-810G' }],
    features: { fr: ['Protection militaire MIL-STD-810G', 'Compatible MagSafe', 'Bords surélevés pour l\'écran', 'Grip anti-dérapant', 'Boutons tactiles précis'], en: ['MIL-STD-810G military protection', 'MagSafe compatible', 'Raised edges for screen', 'Anti-slip grip', 'Precise tactile buttons'] },
  },
  {
    id: 7, slug: 'casque-bluetooth-anc',
    name: { fr: 'Casque Bluetooth ANC', en: 'ANC Bluetooth Headphones' },
    shortDesc: { fr: 'Hi-Res Audio + 60h', en: 'Hi-Res Audio + 60h' },
    description: { fr: 'Casque circum-aural avec réduction de bruit active avancée. Certification Hi-Res Audio. 60 heures d\'autonomie pour une écoute sans interruption.', en: 'Over-ear headphones with advanced active noise cancellation. Hi-Res Audio certified. 60 hours of battery life for uninterrupted listening.' },
    price: 699, oldPrice: 899, category: 'audio', rating: 4.9, reviewCount: 189,
    image: IMG.headphones, images: [IMG.headphones, IMG.earbuds, IMG.earsport],
    badge: 'BEST', inStock: true,
    colors: [{ name: 'Blanc', hex: '#f5f5f5' }, { name: 'Noir', hex: '#1a1a1a' }],
    specs: [{ label: 'Type', value: 'Circum-aural' }, { label: 'ANC', value: 'Avancé hybride' }, { label: 'Autonomie', value: '60 heures' }, { label: 'Driver', value: '40mm' }, { label: 'Bluetooth', value: '5.3 multipoint' }],
    features: { fr: ['ANC avancé hybride', 'Hi-Res Audio certifié', '60h d\'autonomie', 'Bluetooth 5.3 multipoint', 'Coussinets mémoire de forme'], en: ['Advanced hybrid ANC', 'Hi-Res Audio certified', '60h battery life', 'Bluetooth 5.3 multipoint', 'Memory foam ear cushions'] },
  },
  {
    id: 8, slug: 'chargeur-voiture-45w',
    name: { fr: 'Chargeur Voiture 45W', en: '45W Car Charger' },
    shortDesc: { fr: 'Double USB-C PD', en: 'Dual USB-C PD' },
    description: { fr: 'Chargeur allume-cigare compact avec double port USB-C. Puissance combinée de 45W pour charger deux appareils simultanément en route.', en: 'Compact cigarette lighter charger with dual USB-C ports. Combined 45W power to charge two devices simultaneously on the go.' },
    price: 149, category: 'chargers', rating: 4.7, reviewCount: 234,
    image: IMG.ch45w, images: [IMG.ch45w, IMG.ch65w],
    inStock: true,
    specs: [{ label: 'Puissance', value: '45W' }, { label: 'Ports', value: '2× USB-C' }, { label: 'Protocole', value: 'PD 3.0 / QC 4.0' }],
    features: { fr: ['Double USB-C PD', 'Charge rapide 45W', 'Design compact aluminium', 'LED indicateur discret', 'Protection contre les courts-circuits'], en: ['Dual USB-C PD', '45W fast charging', 'Compact aluminum design', 'Discreet LED indicator', 'Short circuit protection'] },
  },
  {
    id: 9, slug: 'power-bank-10000mah',
    name: { fr: 'Power Bank Slim 10000mAh', en: 'Slim 10000mAh Power Bank' },
    shortDesc: { fr: 'Ultra-fin 15mm', en: 'Ultra-thin 15mm' },
    description: { fr: 'Power bank ultra-fin et léger. Parfait pour les déplacements quotidiens. Se glisse facilement dans votre poche ou sac.', en: 'Ultra-thin and lightweight power bank. Perfect for daily commutes. Easily slips into your pocket or bag.' },
    price: 149, oldPrice: 199, category: 'power-banks', rating: 4.6, reviewCount: 567,
    image: IMG.pb10k, images: [IMG.pb10k, IMG.pb20k],
    badge: 'SALE', inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Blanc', hex: '#f5f5f5' }, { name: 'Rose', hex: '#e91e63' }],
    specs: [{ label: 'Capacité', value: '10000mAh' }, { label: 'Épaisseur', value: '15mm' }, { label: 'Poids', value: '180g' }, { label: 'Sortie', value: 'USB-C 20W' }],
    features: { fr: ['Ultra-fin 15mm', 'Léger 180g', 'Charge rapide 20W', 'Design premium aluminium', 'Indicateur LED 4 niveaux'], en: ['Ultra-thin 15mm', 'Lightweight 180g', '20W fast charging', 'Premium aluminum design', '4-level LED indicator'] },
  },
  {
    id: 10, slug: 'cable-usb-c-1m',
    name: { fr: 'Câble USB-C 1m', en: '1m USB-C Cable' },
    shortDesc: { fr: '60W charge rapide', en: '60W Fast Charging' },
    description: { fr: 'Câble USB-C court et pratique pour une utilisation quotidienne. Parfait avec votre chargeur mural ou en voiture.', en: 'Short and practical USB-C cable for daily use. Perfect with your wall or car charger.' },
    price: 59, category: 'cables', rating: 4.5, reviewCount: 1203,
    image: IMG.cable1m, images: [IMG.cable1m, IMG.cable2m],
    inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Blanc', hex: '#f5f5f5' }],
    specs: [{ label: 'Longueur', value: '1 mètre' }, { label: 'Puissance', value: '60W' }, { label: 'Données', value: '480Mbps' }],
    features: { fr: ['Charge rapide 60W', 'Connecteurs renforcés', 'Nylon tressé', 'Compact et portable', 'Compatible universel'], en: ['60W fast charging', 'Reinforced connectors', 'Braided nylon', 'Compact and portable', 'Universal compatible'] },
  },
  {
    id: 11, slug: 'chargeur-magsafe-duo',
    name: { fr: 'Chargeur MagSafe Duo', en: 'MagSafe Duo Charger' },
    shortDesc: { fr: 'iPhone + Apple Watch', en: 'iPhone + Apple Watch' },
    description: { fr: 'Station de charge 2-en-1 pour iPhone et Apple Watch. Design pliable pour voyager. Alignement magnétique parfait.', en: '2-in-1 charging station for iPhone and Apple Watch. Foldable design for travel. Perfect magnetic alignment.' },
    price: 299, category: 'chargers', rating: 4.7, reviewCount: 98,
    image: IMG.mag, images: [IMG.mag, IMG.wch15],
    badge: 'NEW', inStock: true,
    specs: [{ label: 'Puissance iPhone', value: '15W' }, { label: 'Puissance Watch', value: '5W' }, { label: 'Design', value: 'Pliable' }],
    features: { fr: ['2-en-1 iPhone + Apple Watch', 'Design pliable compact', 'Alignement MagSafe', 'Charge rapide 15W', 'Revêtement premium'], en: ['2-in-1 iPhone + Apple Watch', 'Compact foldable design', 'MagSafe alignment', '15W fast charging', 'Premium coating'] },
  },
  {
    id: 12, slug: 'support-telephone',
    name: { fr: 'Support Téléphone Ajustable', en: 'Adjustable Phone Stand' },
    shortDesc: { fr: 'Aluminium CNC', en: 'CNC Aluminum' },
    description: { fr: 'Support téléphone en aluminium usiné CNC. Angle ajustable de 0° à 60°. Compatible avec tous les smartphones et tablettes jusqu\'à 12.9".', en: 'CNC machined aluminum phone stand. Adjustable angle from 0° to 60°. Compatible with all smartphones and tablets up to 12.9".' },
    price: 99, oldPrice: 129, category: 'accessories', rating: 4.4, reviewCount: 312,
    image: IMG.stand, images: [IMG.stand, IMG.hub],
    badge: 'SALE', inStock: true,
    colors: [{ name: 'Argent', hex: '#c0c0c0' }, { name: 'Gris Sidéral', hex: '#4a4a4a' }],
    specs: [{ label: 'Matériau', value: 'Aluminium CNC' }, { label: 'Angle', value: '0° - 60°' }, { label: 'Compatibilité', value: 'Jusqu\'à 12.9"' }],
    features: { fr: ['Aluminium CNC premium', 'Angle ajustable 0-60°', 'Base anti-dérapante', 'Compatible tablettes', 'Design minimaliste'], en: ['Premium CNC aluminum', 'Adjustable angle 0-60°', 'Anti-slip base', 'Tablet compatible', 'Minimalist design'] },
  },
  {
    id: 13, slug: 'hub-usb-c-7en1',
    name: { fr: 'Hub USB-C 7-en-1', en: '7-in-1 USB-C Hub' },
    shortDesc: { fr: 'HDMI 4K + SD + USB 3.0', en: 'HDMI 4K + SD + USB 3.0' },
    description: { fr: 'Hub USB-C multifonction avec sortie HDMI 4K@60Hz, lecteur de carte SD/microSD, 2 ports USB 3.0 et charge PD 100W pass-through.', en: 'Multifunction USB-C hub with HDMI 4K@60Hz output, SD/microSD card reader, 2 USB 3.0 ports, and 100W PD pass-through charging.' },
    price: 349, oldPrice: 449, category: 'accessories', rating: 4.6, reviewCount: 145,
    image: IMG.hub, images: [IMG.hub, IMG.cable2m],
    badge: 'SALE', inStock: true,
    specs: [{ label: 'Ports', value: '7 ports' }, { label: 'HDMI', value: '4K@60Hz' }, { label: 'USB', value: '2× USB 3.0' }, { label: 'PD', value: '100W pass-through' }],
    features: { fr: ['HDMI 4K@60Hz', 'Lecteur SD/microSD', '2× USB 3.0', 'PD 100W pass-through', 'Plug & Play'], en: ['HDMI 4K@60Hz', 'SD/microSD reader', '2× USB 3.0', '100W PD pass-through', 'Plug & Play'] },
  },
  {
    id: 14, slug: 'ecouteurs-sport',
    name: { fr: 'Écouteurs Sport IPX7', en: 'IPX7 Sport Earbuds' },
    shortDesc: { fr: 'Crochets d\'oreille + 48h', en: 'Ear hooks + 48h' },
    description: { fr: 'Écouteurs sport avec crochets d\'oreille sécurisés et certification IPX7. Parfaits pour la course, la salle de sport et les activités intenses.', en: 'Sport earbuds with secure ear hooks and IPX7 certification. Perfect for running, gym workouts, and intense activities.' },
    price: 299, oldPrice: 399, category: 'audio', rating: 4.5, reviewCount: 178,
    image: IMG.earsport, images: [IMG.earsport, IMG.earbuds],
    inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Orange', hex: '#ff6b35' }],
    specs: [{ label: 'IPX', value: 'IPX7' }, { label: 'Autonomie', value: '10h + 38h boîtier' }, { label: 'Bluetooth', value: '5.3' }, { label: 'Driver', value: '12mm' }],
    features: { fr: ['IPX7 waterproof', 'Crochets d\'oreille sécurisés', '48h d\'autonomie totale', 'Son Bass Boost', 'Charge rapide 10min = 2h'], en: ['IPX7 waterproof', 'Secure ear hooks', '48h total battery', 'Bass Boost sound', 'Quick charge 10min = 2h'] },
  },
  {
    id: 15, slug: 'power-bank-30000mah',
    name: { fr: 'Power Bank 30000mAh', en: '30000mAh Power Bank' },
    shortDesc: { fr: '100W PD + Écran LCD', en: '100W PD + LCD Display' },
    description: { fr: 'Notre plus grande capacité. 30000mAh avec charge PD 100W capable de recharger votre laptop. Écran LCD pour un suivi précis de la batterie.', en: 'Our largest capacity. 30000mAh with 100W PD charging capable of recharging your laptop. LCD display for precise battery tracking.' },
    price: 399, oldPrice: 499, category: 'power-banks', rating: 4.7, reviewCount: 89,
    image: IMG.pb30k, images: [IMG.pb30k, IMG.pb20k, IMG.pb10k],
    badge: 'NEW', inStock: true,
    colors: [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Bleu', hex: '#0066FF' }],
    specs: [{ label: 'Capacité', value: '30000mAh' }, { label: 'Sortie Max', value: '100W PD' }, { label: 'Ports', value: '2× USB-C + 1× USB-A' }, { label: 'Écran', value: 'LCD couleur' }, { label: 'Poids', value: '580g' }],
    features: { fr: ['100W PD - Charge laptop', 'Écran LCD couleur', '3 ports de sortie', 'Charge bidirectionnelle', 'Mode basse consommation'], en: ['100W PD - Laptop charging', 'Color LCD display', '3 output ports', 'Bidirectional charging', 'Low power mode'] },
  },
  {
    id: 16, slug: 'coque-magsafe-transparente',
    name: { fr: 'Coque MagSafe Transparente', en: 'Clear MagSafe Case' },
    shortDesc: { fr: 'Anti-jaunissement + MagSafe', en: 'Anti-yellowing + MagSafe' },
    description: { fr: 'Coque transparente premium avec technologie anti-jaunissement. Aimants MagSafe intégrés pour une compatibilité parfaite avec tous les accessoires magnétiques.', en: 'Premium clear case with anti-yellowing technology. Built-in MagSafe magnets for perfect compatibility with all magnetic accessories.' },
    price: 119, category: 'cases', rating: 4.3, reviewCount: 534,
    image: IMG.case15, images: [IMG.case15, IMG.case14],
    inStock: true,
    specs: [{ label: 'Matériau', value: 'TPU premium' }, { label: 'MagSafe', value: 'Oui' }, { label: 'Anti-jaunissement', value: 'Oui' }],
    features: { fr: ['Anti-jaunissement garanti', 'MagSafe intégré', 'Protection chutes 2m', 'Transparent crystal clear', 'Bords surélevés caméra'], en: ['Guaranteed anti-yellowing', 'Built-in MagSafe', '2m drop protection', 'Crystal clear transparent', 'Raised camera edges'] },
  },
];

export const reviews = [
  { id: 1, name: 'Ahmed B.', avatar: 'AB', rating: 5, text: { fr: 'Qualité exceptionnelle ! Le power bank a une finition premium et la charge est ultra rapide. Je recommande vivement AZOURA.', en: 'Exceptional quality! The power bank has a premium finish and charging is ultra fast. I highly recommend AZOURA.' }, verified: true, date: '2024-12-15' },
  { id: 2, name: 'Fatima Z.', avatar: 'FZ', rating: 5, text: { fr: 'Les écouteurs sont incroyables ! Le son est cristallin et la réduction de bruit est impressionnante. Meilleur achat de l\'année.', en: 'The earbuds are incredible! The sound is crystal clear and noise cancellation is impressive. Best purchase of the year.' }, verified: true, date: '2025-01-08' },
  { id: 3, name: 'Youssef M.', avatar: 'YM', rating: 5, text: { fr: 'Service client au top et livraison en 24h à Casablanca. Le chargeur 65W est compact et puissant. Bravo AZOURA !', en: 'Top customer service and 24h delivery in Casablanca. The 65W charger is compact and powerful. Bravo AZOURA!' }, verified: true, date: '2025-02-20' },
];
