import { createContext, useContext, useReducer, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { products as staticCatalog, type Product } from '../data/products';
import { supabase } from '../lib/supabaseClient';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: { name: string; email: string; phone: string; city: string };
  date: string;
  paymentMethod: 'cod' | 'card';
  shippingAddress: string;
  notes?: string;
  trackingNumber?: string;
  timeline: { status: string; date: string; note: string }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  minOrder: number;
  maxUses: number;
  used: number;
  active: boolean;
  expiresAt: string;
}

export interface AdminProduct {
  id: number;
  slug: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  price: number;
  oldPrice?: number;
  costPrice: number;
  category: string;
  brand?: string;
  sku: string;
  barcode: string;
  stock: number;
  lowStockThreshold: number;
  weight: number;
  badge?: string;
  images: string[];
  variants: { name: string; options: string[] }[];
  metaTitle?: string;
  metaDescription?: string;
  active: boolean;
  featured: boolean;
}

export interface AdminReview {
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
}

export interface AdminNotification {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'order' | 'stock' | 'review' | 'system';
}

export interface ShippingZone {
  id: string;
  name: string;
  cities: string;
  rate: number;
  freeAbove: number;
  estimatedDays: string;
  active: boolean;
}

export interface AdminCategory {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  icon: string;
  color: string;
  productCount: number;
  active: boolean;
  order: number;
}

export interface AdminBrand {
  id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
  logo: string;
  active: boolean;
  order: number;
}

interface AppState {
  products: Product[];
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  compareList: number[];
  toggleCompare: (id: number) => void;
  isInCompare: (id: number) => boolean;
  isDark: boolean;
  toggleTheme: () => void;
  lang: 'fr' | 'en';
  setLang: (l: 'fr' | 'en') => void;
  t: (fr: string, en: string) => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentlyViewed: number[];
  addRecentlyViewed: (id: number) => void;
  showCookie: boolean;
  acceptCookies: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  customers: Customer[];
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  updateCoupon: (id: string, c: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  notifications: AdminNotification[];
  addNotification: (n: Omit<AdminNotification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  adminProducts: AdminProduct[];
  addAdminProduct: (p: AdminProduct) => void;
  updateAdminProduct: (id: number, data: Partial<AdminProduct>) => void;
  deleteAdminProduct: (id: number) => void;
  adminReviews: AdminReview[];
  updateReview: (id: string, data: Partial<AdminReview>) => void;
  shippingZones: ShippingZone[];
  updateShippingZone: (id: string, data: Partial<ShippingZone>) => void;
  addShippingZone: (z: ShippingZone) => void;
  deleteShippingZone: (id: string) => void;
  adminCategories: AdminCategory[];
  addAdminCategory: (c: AdminCategory) => void;
  updateAdminCategory: (id: string, data: Partial<AdminCategory>) => void;
  deleteAdminCategory: (id: string) => void;
  siteSettings: Record<string, string>;
  updateSiteSettings: (data: Record<string, string>) => void;
  adminBrands: AdminBrand[];
  addAdminBrand: (b: AdminBrand) => void;
  updateAdminBrand: (id: string, data: Partial<AdminBrand>) => void;
  deleteAdminBrand: (id: string) => void;
  isAdminAuth: boolean;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const Ctx = createContext<AppState | null>(null);

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'>; qty: number }
  | { type: 'REMOVE'; id: number }
  | { type: 'QTY'; id: number; qty: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const idx = state.findIndex(i => i.id === action.item.id);
      if (idx >= 0) return state.map((it, i) => i === idx ? { ...it, quantity: it.quantity + action.qty } : it);
      return [...state, { ...action.item, quantity: action.qty }];
    }
    case 'REMOVE': return state.filter(i => i.id !== action.id);
    case 'QTY': return state.map(i => i.id === action.id ? { ...i, quantity: Math.max(1, action.qty) } : i);
    case 'CLEAR': return [];
    default: return state;
  }
}

function loadJSON<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

// Maps a Supabase `products` row (snake_case) to the app's AdminProduct shape (camelCase).
function rowToAdminProduct(row: any): AdminProduct {
  return {
    id: row.id,
    slug: row.slug,
    nameFr: row.name_fr,
    nameEn: row.name_en,
    descFr: row.desc_fr,
    descEn: row.desc_en,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    costPrice: row.cost_price,
    category: row.category,
    brand: row.brand ?? undefined,
    sku: row.sku ?? '',
    barcode: row.barcode ?? '',
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold,
    weight: row.weight,
    badge: row.badge ?? undefined,
    images: row.images ?? [],
    variants: row.variants ?? [],
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    active: row.active,
    featured: row.featured,
  };
}

// Maps a (partial) AdminProduct back to Supabase row shape for insert/update.
function adminProductToRow(p: Partial<AdminProduct>): Record<string, any> {
  const row: Record<string, any> = {};
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.nameFr !== undefined) row.name_fr = p.nameFr;
  if (p.nameEn !== undefined) row.name_en = p.nameEn;
  if (p.descFr !== undefined) row.desc_fr = p.descFr;
  if (p.descEn !== undefined) row.desc_en = p.descEn;
  if (p.price !== undefined) row.price = p.price;
  if (p.oldPrice !== undefined) row.old_price = p.oldPrice;
  if (p.costPrice !== undefined) row.cost_price = p.costPrice;
  if (p.category !== undefined) row.category = p.category;
  if (p.brand !== undefined) row.brand = p.brand;
  if (p.sku !== undefined) row.sku = p.sku;
  if (p.barcode !== undefined) row.barcode = p.barcode;
  if (p.stock !== undefined) row.stock = p.stock;
  if (p.lowStockThreshold !== undefined) row.low_stock_threshold = p.lowStockThreshold;
  if (p.weight !== undefined) row.weight = p.weight;
  if (p.badge !== undefined) row.badge = p.badge;
  if (p.images !== undefined) row.images = p.images;
  if (p.variants !== undefined) row.variants = p.variants;
  if (p.metaTitle !== undefined) row.meta_title = p.metaTitle;
  if (p.metaDescription !== undefined) row.meta_description = p.metaDescription;
  if (p.active !== undefined) row.active = p.active;
  if (p.featured !== undefined) row.featured = p.featured;
  return row;
}
// Converts an admin-edited product into the public-facing Product shape,
// falling back to the static catalog entry (by id) for display-only fields
// that the admin panel doesn't manage (rating, specs, features, colors...).
function adminToProduct(ap: AdminProduct, reviews: AdminReview[]): Product {
  const base = staticCatalog.find(p => p.id === ap.id);
  const approved = reviews.filter(r => r.productId === ap.id && r.status === 'approved');
  const rating = approved.length
    ? +(approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
    : (base?.rating ?? 4.5);
  const reviewCount = approved.length || base?.reviewCount || 0;
  return {
    id: ap.id,
    slug: ap.slug,
    name: { fr: ap.nameFr, en: ap.nameEn },
    shortDesc: base?.shortDesc ?? { fr: ap.descFr, en: ap.descEn },
    description: { fr: ap.descFr, en: ap.descEn },
    price: ap.price,
    oldPrice: ap.oldPrice,
    category: ap.category,
    rating,
    reviewCount,
    image: ap.images[0] || base?.image || '',
    images: ap.images.length ? ap.images : (base?.images ?? []),
    badge: (ap.badge as Product['badge']) || undefined,
    inStock: ap.stock > 0,
    colors: base?.colors,
    specs: base?.specs ?? [],
    features: base?.features ?? { fr: [], en: [] },
  };
}
const mkTimeline = (status: string, date: string): Order['timeline'] => {
  const t: Order['timeline'] = [{ status: 'pending', date, note: 'Commande reçue' }];
  if (['processing','shipped','delivered'].includes(status)) t.push({ status:'processing', date, note:'En préparation' });
  if (['shipped','delivered'].includes(status)) t.push({ status:'shipped', date, note:'Colis expédié' });
  if (status === 'delivered') t.push({ status:'delivered', date, note:'Livré au client' });
  if (status === 'cancelled') t.push({ status:'cancelled', date, note:'Annulée par le client' });
  return t;
};

const DEMO_ORDERS: Order[] = [
  { id:'AZ-1001', items:[{id:1,name:'Power Bank 20000mAh',price:249,image:'',quantity:2}], total:498, status:'delivered', customer:{name:'Ahmed Benali',email:'ahmed@email.com',phone:'+212 661 234 567',city:'Casablanca'}, date:'2025-01-15', paymentMethod:'cod', shippingAddress:'45 Rue Ibn Batouta, Casablanca', trackingNumber:'MA123456789', timeline: mkTimeline('delivered','2025-01-15') },
  { id:'AZ-1002', items:[{id:2,name:'Chargeur 65W GaN',price:199,image:'',quantity:1},{id:3,name:'Câble USB-C 2m',price:89,image:'',quantity:3}], total:466, status:'shipped', customer:{name:'Fatima Zahra',email:'fatima@email.com',phone:'+212 622 345 678',city:'Rabat'}, date:'2025-01-18', paymentMethod:'card', shippingAddress:'12 Avenue Hassan II, Rabat', trackingNumber:'MA987654321', timeline: mkTimeline('shipped','2025-01-18') },
  { id:'AZ-1003', items:[{id:4,name:'Écouteurs Pro',price:499,image:'',quantity:1}], total:499, status:'processing', customer:{name:'Youssef Mokhtar',email:'youssef@email.com',phone:'+212 633 456 789',city:'Marrakech'}, date:'2025-01-20', paymentMethod:'cod', shippingAddress:'88 Derb Sidi Ahmed, Marrakech', timeline: mkTimeline('processing','2025-01-20') },
  { id:'AZ-1004', items:[{id:7,name:'Casque ANC',price:699,image:'',quantity:1}], total:699, status:'pending', customer:{name:'Sara Lahlou',email:'sara@email.com',phone:'+212 644 567 890',city:'Tanger'}, date:'2025-01-22', paymentMethod:'card', shippingAddress:'5 Rue de la Liberté, Tanger', timeline: mkTimeline('pending','2025-01-22') },
  { id:'AZ-1005', items:[{id:9,name:'Power Bank Slim',price:149,image:'',quantity:2}], total:298, status:'delivered', customer:{name:'Karim Alaoui',email:'karim@email.com',phone:'+212 655 678 901',city:'Fès'}, date:'2025-01-10', paymentMethod:'cod', shippingAddress:'33 Bab Boujloud, Fès', trackingNumber:'MA456789123', timeline: mkTimeline('delivered','2025-01-10') },
  { id:'AZ-1006', items:[{id:5,name:'Chargeur Sans Fil',price:199,image:'',quantity:1}], total:199, status:'cancelled', customer:{name:'Nadia Berrada',email:'nadia@email.com',phone:'+212 666 789 012',city:'Agadir'}, date:'2025-01-08', paymentMethod:'card', shippingAddress:'77 Avenue du Prince, Agadir', timeline: mkTimeline('cancelled','2025-01-08') },
  { id:'AZ-1007', items:[{id:1,name:'Power Bank 20000mAh',price:249,image:'',quantity:1},{id:10,name:'Câble USB-C 1m',price:59,image:'',quantity:2}], total:367, status:'delivered', customer:{name:'Omar Tazi',email:'omar@email.com',phone:'+212 677 888 999',city:'Casablanca'}, date:'2025-01-05', paymentMethod:'cod', shippingAddress:'10 Bd Zerktouni, Casablanca', trackingNumber:'MA111222333', timeline: mkTimeline('delivered','2025-01-05') },
  { id:'AZ-1008', items:[{id:15,name:'Power Bank 30000mAh',price:399,image:'',quantity:1}], total:399, status:'pending', customer:{name:'Leila Fassi',email:'leila@email.com',phone:'+212 688 999 000',city:'Meknès'}, date:'2025-01-24', paymentMethod:'cod', shippingAddress:'22 Av. des Forces Armées, Meknès', timeline: mkTimeline('pending','2025-01-24') },
];

const DEMO_CUSTOMERS: Customer[] = [
  { id:'C001', name:'Ahmed Benali', email:'ahmed@email.com', phone:'+212 661 234 567', city:'Casablanca', orders:5, totalSpent:2450, joinDate:'2024-06-15', status:'active' },
  { id:'C002', name:'Fatima Zahra', email:'fatima@email.com', phone:'+212 622 345 678', city:'Rabat', orders:3, totalSpent:1580, joinDate:'2024-08-20', status:'active' },
  { id:'C003', name:'Youssef Mokhtar', email:'youssef@email.com', phone:'+212 633 456 789', city:'Marrakech', orders:2, totalSpent:998, joinDate:'2024-10-05', status:'active' },
  { id:'C004', name:'Sara Lahlou', email:'sara@email.com', phone:'+212 644 567 890', city:'Tanger', orders:1, totalSpent:699, joinDate:'2024-11-12', status:'active' },
  { id:'C005', name:'Karim Alaoui', email:'karim@email.com', phone:'+212 655 678 901', city:'Fès', orders:4, totalSpent:1890, joinDate:'2024-07-01', status:'active' },
  { id:'C006', name:'Nadia Berrada', email:'nadia@email.com', phone:'+212 666 789 012', city:'Agadir', orders:2, totalSpent:750, joinDate:'2024-09-18', status:'inactive' },
  { id:'C007', name:'Omar Tazi', email:'omar@email.com', phone:'+212 677 888 999', city:'Casablanca', orders:3, totalSpent:1120, joinDate:'2024-05-10', status:'active' },
  { id:'C008', name:'Leila Fassi', email:'leila@email.com', phone:'+212 688 999 000', city:'Meknès', orders:1, totalSpent:399, joinDate:'2025-01-20', status:'active' },
];

const DEMO_COUPONS: Coupon[] = [
  { id:'CP1', code:'AZOURA10', discount:10, type:'percent', minOrder:200, maxUses:100, used:34, active:true, expiresAt:'2025-06-30' },
  { id:'CP2', code:'WELCOME20', discount:20, type:'percent', minOrder:300, maxUses:50, used:12, active:true, expiresAt:'2025-12-31' },
  { id:'CP3', code:'SHIP50', discount:50, type:'fixed', minOrder:500, maxUses:200, used:89, active:true, expiresAt:'2025-03-31' },
  { id:'CP4', code:'FLASH30', discount:30, type:'percent', minOrder:400, maxUses:30, used:5, active:true, expiresAt:'2025-02-28' },
];

const DEMO_NOTIFICATIONS: AdminNotification[] = [
  { id:'N1', text:'Nouvelle commande AZ-1008 — Leila Fassi — 399 MAD', time:'Il y a 12 min', read:false, type:'order' },
  { id:'N2', text:'Stock faible : Câble USB-C 2m — 5 restants', time:'Il y a 2 heures', read:false, type:'stock' },
  { id:'N3', text:'Nouvelle commande AZ-1004 — Sara Lahlou — 699 MAD', time:'Il y a 6 heures', read:false, type:'order' },
  { id:'N4', text:'Nouvel avis 5★ sur Écouteurs Sans Fil Pro', time:'Il y a 1 jour', read:true, type:'review' },
  { id:'N5', text:'Commande AZ-1002 expédiée avec succès', time:'Il y a 1 jour', read:true, type:'system' },
  { id:'N6', text:'Stock faible : Chargeur 65W GaN — 3 restants', time:'Il y a 2 jours', read:true, type:'stock' },
];

const DEMO_REVIEWS: AdminReview[] = [
  { id:'R1', productId:1, productName:'Power Bank 20000mAh', customerName:'Ahmed B.', rating:5, text:'Qualité exceptionnelle ! Charge ultra rapide.', date:'2024-12-15', status:'approved', verified:true },
  { id:'R2', productId:4, productName:'Écouteurs Sans Fil Pro', customerName:'Fatima Z.', rating:5, text:'Son cristallin et ANC impressionnant.', date:'2025-01-08', status:'approved', verified:true },
  { id:'R3', productId:2, productName:'Chargeur 65W GaN', customerName:'Youssef M.', rating:5, text:'Compact et puissant. Bravo AZOURA !', date:'2025-02-20', status:'approved', verified:true },
  { id:'R4', productId:7, productName:'Casque Bluetooth ANC', customerName:'Karim A.', rating:4, text:'Très bon casque, le confort est top.', date:'2025-01-25', status:'pending', verified:true },
  { id:'R5', productId:3, productName:'Câble USB-C 2m', customerName:'Nadia B.', rating:3, text:'Correct mais un peu rigide.', date:'2025-01-20', status:'pending', verified:false },
  { id:'R6', productId:5, productName:'Chargeur Sans Fil 15W', customerName:'Sara L.', rating:5, text:'Fonctionne parfaitement avec mon iPhone.', date:'2025-01-28', status:'pending', verified:true },
];

const DEMO_SHIPPING: ShippingZone[] = [
  { id:'SZ1', name:'Casablanca & Rabat', cities:'Casablanca, Mohammedia, Rabat, Salé, Kénitra', rate:0, freeAbove:0, estimatedDays:'24h', active:true },
  { id:'SZ2', name:'Grandes Villes', cities:'Marrakech, Fès, Tanger, Agadir, Meknès, Oujda', rate:29, freeAbove:299, estimatedDays:'24-48h', active:true },
  { id:'SZ3', name:'Autres Régions', cities:'Toutes les autres villes du Maroc', rate:39, freeAbove:499, estimatedDays:'3-5 jours', active:true },
];

const DEMO_ADMIN_CATS: AdminCategory[] = [
  { id:'chargers', nameFr:'Chargeurs', nameEn:'Chargers', slug:'chargers', icon:'Zap', color:'#F59E0B', productCount:4, active:true, order:1 },
  { id:'power-banks', nameFr:'Power Banks', nameEn:'Power Banks', slug:'power-banks', icon:'BatteryFull', color:'#2563EB', productCount:3, active:true, order:2 },
  { id:'cables', nameFr:'Câbles USB-C', nameEn:'USB-C Cables', slug:'cables', icon:'Cable', color:'#06B6D4', productCount:2, active:true, order:3 },
  { id:'audio', nameFr:'Audio', nameEn:'Audio', slug:'audio', icon:'Headphones', color:'#8B5CF6', productCount:3, active:true, order:4 },
  { id:'cases', nameFr:'Coques', nameEn:'Phone Cases', slug:'cases', icon:'Smartphone', color:'#F43F5E', productCount:2, active:true, order:5 },
  { id:'accessories', nameFr:'Accessoires', nameEn:'Accessories', slug:'accessories', icon:'Layers', color:'#10B981', productCount:2, active:true, order:6 },
];

const DEMO_BRANDS: AdminBrand[] = [
  { id:'azoura', nameFr:'AZOURA', nameEn:'AZOURA', slug:'azoura', logo:'', active:true, order:1 },
  { id:'anker', nameFr:'Anker', nameEn:'Anker', slug:'anker', logo:'', active:true, order:2 },
  { id:'ugreen', nameFr:'UGREEN', nameEn:'UGREEN', slug:'ugreen', logo:'', active:true, order:3 },
  { id:'baseus', nameFr:'Baseus', nameEn:'Baseus', slug:'baseus', logo:'', active:true, order:4 },
  { id:'apple', nameFr:'Apple', nameEn:'Apple', slug:'apple', logo:'', active:true, order:5 },
  { id:'samsung', nameFr:'Samsung', nameEn:'Samsung', slug:'samsung', logo:'', active:true, order:6 },
];


const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: 'AZOURA', tagline: 'Connect. Charge. Go.', email: 'contact@azoura.ma', phone: '+212 522 123 456', address: '123 Boulevard Mohammed V, Casablanca, Maroc', currency: 'MAD', taxRate: '20', metaTitle: 'AZOURA | Connect. Charge. Go.', metaDesc: 'Accessoires mobiles premium au Maroc.', ogImage: '', whatsapp: '+212522123456', instagram: 'azoura.ma', facebook: 'azoura.ma', maintenanceMode: 'false', codEnabled: 'true', cardEnabled: 'true',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => loadJSON<CartItem[]>('az-cart', []));
  const [wishlist, setWishlist] = useState<number[]>(() => loadJSON('az-wish', []));
  const [compareList, setCompareList] = useState<number[]>(() => loadJSON('az-compare', []));
  const [isDark, setIsDark] = useState(() => { const s = localStorage.getItem('az-theme'); return s ? s === 'dark' : false; });
  const [lang, setLang] = useState<'fr' | 'en'>(() => (localStorage.getItem('az-lang') as 'fr' | 'en') || 'fr');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => loadJSON('az-recent', []));
  const [showCookie, setShowCookie] = useState(() => !localStorage.getItem('az-cookie'));
  const [orders, setOrders] = useState<Order[]>(() => loadJSON('az-orders', DEMO_ORDERS));
  const [customers, setCustomers] = useState<Customer[]>(() => loadJSON('az-customers', DEMO_CUSTOMERS));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadJSON('az-coupons', DEMO_COUPONS));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => loadJSON('az-notif', DEMO_NOTIFICATIONS));
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([]);
  const [adminReviews, setAdminReviews] = useState<AdminReview[]>(() => loadJSON('az-admin-rev', DEMO_REVIEWS));
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(() => loadJSON('az-shipping', DEMO_SHIPPING));
  const [adminCategories, setAdminCategories] = useState<AdminCategory[]>(() => loadJSON('az-admin-cats', DEMO_ADMIN_CATS));
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(() => loadJSON('az-settings', DEFAULT_SETTINGS));
  const [adminBrands, setAdminBrands] = useState<AdminBrand[]>(() => loadJSON('az-admin-brands', DEMO_BRANDS));
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(false);

  // Keep isAdminAuth in sync with the real Supabase session (not sessionStorage anymore).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdminAuth(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuth(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Fetch products from Supabase. Anonymous visitors only get active=true rows (RLS),
  // logged-in admins get everything — so this refetches whenever admin auth changes.
  useEffect(() => {
    let mounted = true;
    supabase.from('products').select('*').order('id').then(({ data, error }) => {
      if (!mounted) return;
      if (error) { console.error('Failed to load products from Supabase:', error.message); return; }
      setAdminProducts((data ?? []).map(rowToAdminProduct));
    });
    return () => { mounted = false; };
  }, [isAdminAuth]);

  const products = useMemo(
    () => adminProducts.filter(p => p.active).map(p => adminToProduct(p, adminReviews)),
    [adminProducts, adminReviews]
  );

  useEffect(() => { localStorage.setItem('az-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('az-wish', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('az-compare', JSON.stringify(compareList)); }, [compareList]);
  useEffect(() => { localStorage.setItem('az-theme', isDark ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', isDark); }, [isDark]);
  useEffect(() => { localStorage.setItem('az-lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('az-recent', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem('az-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('az-customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('az-coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('az-notif', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('az-admin-rev', JSON.stringify(adminReviews)); }, [adminReviews]);
  useEffect(() => { localStorage.setItem('az-shipping', JSON.stringify(shippingZones)); }, [shippingZones]);
  useEffect(() => { localStorage.setItem('az-admin-cats', JSON.stringify(adminCategories)); }, [adminCategories]);
  useEffect(() => { localStorage.setItem('az-settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('az-admin-brands', JSON.stringify(adminBrands)); }, [adminBrands]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => dispatch({ type:'ADD', item, qty }), []);
  const removeFromCart = useCallback((id: number) => dispatch({ type:'REMOVE', id }), []);
  const updateQuantity = useCallback((id: number, qty: number) => dispatch({ type:'QTY', id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type:'CLEAR' }), []);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const toggleWishlist = useCallback((id: number) => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const isInWishlist = useCallback((id: number) => wishlist.includes(id), [wishlist]);
  const toggleCompare = useCallback((id: number) => setCompareList(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 4 ? [...p, id] : p), []);
  const isInCompare = useCallback((id: number) => compareList.includes(id), [compareList]);
  const toggleTheme = useCallback(() => setIsDark(p => !p), []);
  const t = useCallback((fr: string, en: string) => lang === 'fr' ? fr : en, [lang]);
  const addRecentlyViewed = useCallback((id: number) => setRecentlyViewed(p => [id, ...p.filter(x => x !== id)].slice(0, 12)), []);
  const acceptCookies = useCallback(() => { setShowCookie(false); localStorage.setItem('az-cookie', '1'); }, []);
  const addOrder = useCallback((order: Order) => setOrders(p => [order, ...p]), []);
  const updateOrder = useCallback((id: string, data: Partial<Order>) => setOrders(p => p.map(o => o.id === id ? { ...o, ...data } : o)), []);
  const deleteOrder = useCallback((id: string) => setOrders(p => p.filter(o => o.id !== id)), []);
  const updateCustomer = useCallback((id: string, data: Partial<Customer>) => setCustomers(p => p.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const addCoupon = useCallback((c: Coupon) => setCoupons(p => [...p, c]), []);
  const updateCoupon = useCallback((id: string, partial: Partial<Coupon>) => setCoupons(p => p.map(c => c.id === id ? { ...c, ...partial } : c)), []);
  const deleteCoupon = useCallback((id: string) => setCoupons(p => p.filter(c => c.id !== id)), []);
  const applyCouponFn = useCallback((code: string) => {
    const c = coupons.find(x => x.code.toUpperCase() === code.toUpperCase() && x.active);
    if (c && cartTotal >= c.minOrder && c.used < c.maxUses) { setAppliedCoupon(c); return true; }
    return false;
  }, [coupons, cartTotal]);
  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);
  const addNotification = useCallback((n: Omit<AdminNotification, 'id'>) => setNotifications(p => [{ ...n, id: `N${Date.now()}` }, ...p]), []);
  const markNotificationRead = useCallback((id: string) => setNotifications(p => p.map(n => n.id === id ? { ...n, read:true } : n)), []);
  const clearNotifications = useCallback(() => setNotifications(p => p.map(n => ({ ...n, read:true }))), []);
  const addAdminProduct = useCallback((p: AdminProduct) => {
    setAdminProducts(prev => [...prev, p]); // optimistic
    supabase.from('products').insert(adminProductToRow(p)).select().single().then(({ data, error }) => {
      if (error) { console.error('Insert product failed:', error.message); setAdminProducts(prev => prev.filter(x => x !== p)); return; }
      setAdminProducts(prev => prev.map(x => x === p ? rowToAdminProduct(data) : x));
    });
  }, []);
  const updateAdminProduct = useCallback((id: number, data: Partial<AdminProduct>) => {
    setAdminProducts(p => p.map(x => x.id === id ? { ...x, ...data } : x)); // optimistic
    supabase.from('products').update(adminProductToRow(data)).eq('id', id).then(({ error }) => {
      if (error) console.error('Update product failed:', error.message);
    });
  }, []);
  const deleteAdminProduct = useCallback((id: number) => {
    setAdminProducts(p => p.filter(x => x.id !== id)); // optimistic
    supabase.from('products').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Delete product failed:', error.message);
    });
  }, []);
  const updateReview = useCallback((id: string, data: Partial<AdminReview>) => setAdminReviews(p => p.map(r => r.id === id ? { ...r, ...data } : r)), []);
  const updateShippingZone = useCallback((id: string, data: Partial<ShippingZone>) => setShippingZones(p => p.map(z => z.id === id ? { ...z, ...data } : z)), []);
  const addShippingZone = useCallback((z: ShippingZone) => setShippingZones(p => [...p, z]), []);
  const deleteShippingZone = useCallback((id: string) => setShippingZones(p => p.filter(z => z.id !== id)), []);
  const addAdminCategory = useCallback((c: AdminCategory) => setAdminCategories(p => [...p, c]), []);
  const updateAdminCategory = useCallback((id: string, data: Partial<AdminCategory>) => setAdminCategories(p => p.map(c => c.id === id ? { ...c, ...data } : c)), []);
  const deleteAdminCategory = useCallback((id: string) => setAdminCategories(p => p.filter(c => c.id !== id)), []);
  const updateSiteSettings = useCallback((data: Record<string, string>) => setSiteSettings(p => ({ ...p, ...data })), []);
  const addAdminBrand = useCallback((b: AdminBrand) => setAdminBrands(p => [...p, b]), []);
  const updateAdminBrand = useCallback((id: string, data: Partial<AdminBrand>) => setAdminBrands(p => p.map(b => b.id === id ? { ...b, ...data } : b)), []);
  const deleteAdminBrand = useCallback((id: string) => setAdminBrands(p => p.filter(b => b.id !== id)), []);
  const loginAdmin = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return !error;
  }, []);
  const logoutAdmin = useCallback(() => { supabase.auth.signOut(); }, []);

  return (
    <Ctx.Provider value={{ products, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, wishlist, toggleWishlist, isInWishlist, compareList, toggleCompare, isInCompare, isDark, toggleTheme, lang, setLang, t, searchQuery, setSearchQuery, recentlyViewed, addRecentlyViewed, showCookie, acceptCookies, orders, addOrder, updateOrder, deleteOrder, customers, updateCustomer, coupons, addCoupon, updateCoupon, deleteCoupon, appliedCoupon, applyCoupon:applyCouponFn, removeCoupon, notifications, addNotification, markNotificationRead, clearNotifications, adminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct, adminReviews, updateReview, shippingZones, updateShippingZone, addShippingZone, deleteShippingZone, adminCategories, addAdminCategory, updateAdminCategory, deleteAdminCategory, siteSettings, updateSiteSettings, adminBrands, addAdminBrand, updateAdminBrand, deleteAdminBrand, isAdminAuth, loginAdmin, logoutAdmin }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => { const c = useContext(Ctx); if (!c) throw new Error('useApp requires AppProvider'); return c; };
