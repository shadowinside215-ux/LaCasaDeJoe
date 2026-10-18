import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase.ts';
import { BusinessSettings, MenuCategory, MenuItem, GalleryItem } from '../types/restaurant.ts';
import { SEAFOOD_ASSETS } from './cloudinary.ts';
import { compressDataUriIfNeeded } from './cloudinaryUpload.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Default verified restaurant details supplied by client
export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  name: 'La Casa De Joe',
  type: 'Seafood restaurant',
  address: 'Immeuble C, Résidence Romana 3, Magasin 11, Avenue Hassan II, Sala Al Jadida 11000, Morocco',
  phone: '+212 688-939826',
  googleMapsPlusCode: 'X7X6+6P, Sala Al Jadida',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Casa+De+Joe+Sala+Al+Jadida',
  googleRating: 4.8,
  googleReviewsCount: 82,
  priceRange: 'MAD 50–100 per person',
  service: 'Dine-in',
  closingTime: '9:00 PM',
  scheduleNote: 'Reported closing time is 9 PM. Complete weekly schedule should be confirmed with the restaurant before publication.',
  glovoUrl: 'https://glovoapp.com/fr/ma/technopolis/stores/la-casa-de-joe-tec?utm_medium=organic&utm_campaign=google_reserve_place_order_action&utm_source=google',
  instagramUrl: 'https://www.instagram.com/la_casa_de_joe/?hl=en',
  heroHeadline: 'A Taste of the Mediterranean.',
  heroSubheadline: 'Discover the flavors of the sea at La Casa De Joe. Fresh seafood specialties and an authentic Mediterranean dining experience in Sala Al Jadida.',
  storyText: 'At La Casa De Joe, the flavors of the sea meet the warmth of Mediterranean hospitality. Inspired by Spanish culinary traditions and a love of seafood, the restaurant offers a welcoming place to gather around good food and enjoy a memorable meal in Sala Al Jadida.',
  cloudinaryCloudName: 'demo',
  updatedAt: new Date().toISOString()
};

// Initial proposed categories
export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'starters', name: 'Starters', slug: 'starters', order: 1, description: 'Traditional Mediterranean tapas and seafood appetizers', isActive: true },
  { id: 'seafood-specialties', name: 'Seafood Specialties', slug: 'seafood-specialties', order: 2, description: 'Signature coastal dishes cooked with authentic olive oil and seasonings', isActive: true },
  { id: 'fish-grilled', name: 'Fish & Grilled Dishes', slug: 'fish-grilled', order: 3, description: 'Fresh catch grilled to perfection over flame', isActive: true },
  { id: 'seafood-platters', name: 'Seafood Platters', slug: 'seafood-platters', order: 4, description: 'Generous seafood feasts meant for gathering and sharing', isActive: true },
  { id: 'rice-risotto', name: 'Rice & Risotto', slug: 'rice-risotto', order: 5, description: 'Rich Mediterranean rice and seafood risotto infusions', isActive: true },
  { id: 'desserts', name: 'Desserts', slug: 'desserts', order: 6, description: 'Handcrafted Spanish and Mediterranean sweets', isActive: true },
  { id: 'drinks', name: 'Drinks', slug: 'drinks', order: 7, description: 'Refreshing beverages, sparkling waters, and fresh infusions', isActive: true },
];

// Verified real menu items supplied by user (with no pictures)
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'pan-con-tomate',
    name: 'Pan Con Tomate',
    description: 'Pain grillé, tomate râpée et anchois.',
    price: 28,
    priceOnRequest: false,
    categoryId: 'starters',
    categoryName: 'Starters',
    imageUrl: '',
    imageAlt: '',
    isAvailable: true,
    isFeatured: true,
    dietary: ['Tapas', 'Anchois'],
    order: 1
  },
  {
    id: 'patatas-bravas',
    name: 'Patatas Bravas',
    description: 'Pommes de terre, mayonnaise à l’ail, marinade maison et paprika fumé.',
    price: 20,
    priceOnRequest: false,
    categoryId: 'starters',
    categoryName: 'Starters',
    imageUrl: '',
    imageAlt: '',
    isAvailable: true,
    isFeatured: true,
    dietary: ['Tapas', 'Sauce Maison'],
    order: 2
  },
  {
    id: 'plateaux-de-pecheurs-a-partager',
    name: 'Plateaux De Pêcheurs À Partager',
    description: 'Calamars, merlan, sole',
    price: 120,
    priceOnRequest: false,
    categoryId: 'seafood-platters',
    categoryName: 'Seafood Platters',
    imageUrl: '',
    imageAlt: '',
    isAvailable: true,
    isFeatured: true,
    dietary: ['Fruits de Mer', 'À Partager'],
    order: 3
  }
];

// Empty initial gallery per user request - only the hero image is shown on the site
export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [];

// Firestore Operations
export async function getBusinessSettings(): Promise<BusinessSettings> {
  const path = 'settings/business';
  try {
    const docRef = doc(db, 'settings', 'business');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as BusinessSettings;
      return {
        ...INITIAL_BUSINESS_SETTINGS,
        ...data,
        instagramUrl: data.instagramUrl || 'https://www.instagram.com/la_casa_de_joe/?hl=en',
      };
    }
    return INITIAL_BUSINESS_SETTINGS;
  } catch (error) {
    console.warn('Could not read settings from Firestore, using initial dataset:', error);
    return INITIAL_BUSINESS_SETTINGS;
  }
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<void> {
  const path = 'settings/business';
  try {
    const docRef = doc(db, 'settings', 'business');
    let safeSettings = { ...settings };

    // Prevent Firestore document size limit error (1MB) if large data URI was pasted or uploaded
    if (safeSettings.logoUrl && safeSettings.logoUrl.startsWith('data:image/') && safeSettings.logoUrl.length > 150000) {
      safeSettings.logoUrl = await compressDataUriIfNeeded(safeSettings.logoUrl, 120000);
    }

    const payload = {
      ...safeSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser?.uid || 'admin'
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const path = 'menuCategories';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as MenuCategory));
    }
    return INITIAL_CATEGORIES;
  } catch (error) {
    console.warn('Could not read categories from Firestore, using defaults:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function saveMenuCategory(category: MenuCategory): Promise<void> {
  const path = `menuCategories/${category.id}`;
  try {
    const docRef = doc(db, 'menuCategories', category.id);
    await setDoc(docRef, {
      ...category,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMenuCategory(categoryId: string): Promise<void> {
  const path = `menuCategories/${categoryId}`;
  try {
    await deleteDoc(doc(db, 'menuCategories', categoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const path = 'menuItems';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as MenuItem));
    }
    return INITIAL_MENU_ITEMS;
  } catch (error) {
    console.warn('Could not read menu items from Firestore, using defaults:', error);
    return INITIAL_MENU_ITEMS;
  }
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  const path = `menuItems/${item.id}`;
  try {
    const docRef = doc(db, 'menuItems', item.id);
    let safeItem = { ...item };
    if (safeItem.imageUrl && safeItem.imageUrl.startsWith('data:image/') && safeItem.imageUrl.length > 150000) {
      safeItem.imageUrl = await compressDataUriIfNeeded(safeItem.imageUrl, 120000);
    }
    await setDoc(docRef, {
      ...safeItem,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  const path = `menuItems/${itemId}`;
  try {
    await deleteDoc(doc(db, 'menuItems', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const path = 'gallery';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as GalleryItem));
    }
    return INITIAL_GALLERY_ITEMS;
  } catch (error) {
    console.warn('Could not read gallery items from Firestore, using defaults:', error);
    return INITIAL_GALLERY_ITEMS;
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const path = `gallery/${item.id}`;
  try {
    const docRef = doc(db, 'gallery', item.id);
    let safeGallery = { ...item };
    if (safeGallery.imageUrl && safeGallery.imageUrl.startsWith('data:image/') && safeGallery.imageUrl.length > 150000) {
      safeGallery.imageUrl = await compressDataUriIfNeeded(safeGallery.imageUrl, 120000);
    }
    await setDoc(docRef, {
      ...safeGallery,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGalleryItem(itemId: string): Promise<void> {
  const path = `gallery/${itemId}`;
  try {
    await deleteDoc(doc(db, 'gallery', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Seed initial restaurant data to Firestore so admin can immediately manage live documents
 */
export async function seedInitialDataIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'business'));
    if (!settingsDoc.exists()) {
      const batch = writeBatch(db);

      // 1. Settings
      batch.set(doc(db, 'settings', 'business'), INITIAL_BUSINESS_SETTINGS);

      // 2. Categories
      INITIAL_CATEGORIES.forEach(cat => {
        batch.set(doc(db, 'menuCategories', cat.id), cat);
      });

      // 3. Menu items
      INITIAL_MENU_ITEMS.forEach(item => {
        batch.set(doc(db, 'menuItems', item.id), item);
      });

      // 4. Gallery items
      INITIAL_GALLERY_ITEMS.forEach(item => {
        batch.set(doc(db, 'gallery', item.id), item);
      });

      await batch.commit();
      return { seeded: true, message: 'Initial restaurant data successfully written to Firestore.' };
    }
    return { seeded: false, message: 'Firestore already populated with business data.' };
  } catch (error) {
    console.error('Seeding check/write note:', error);
    return { seeded: false, message: error instanceof Error ? error.message : String(error) };
  }
}
