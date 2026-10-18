export interface BusinessSettings {
  id?: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  googleMapsPlusCode: string;
  googleMapsUrl: string;
  googleRating: number;
  googleReviewsCount: number;
  priceRange: string;
  service: string;
  closingTime: string;
  scheduleNote: string;
  glovoUrl: string;
  instagramUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  storyText: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset?: string;
  logoUrl?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  priceOnRequest: boolean;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  imageAlt: string;
  isAvailable: boolean;
  isFeatured: boolean;
  dietary?: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: 'dishes' | 'atmosphere' | 'seafood' | 'dessert';
  altText: string;
  isFeatured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewTheme {
  title: string;
  description: string;
  tag: string;
}
