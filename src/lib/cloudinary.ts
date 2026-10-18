/**
 * Cloudinary image optimization and transformation utilities
 * for La Casa De Joe Seafood Restaurant
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'limit';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  gravity?: 'auto' | 'center' | 'faces';
}

const DEFAULT_CLOUD_NAME = 'demo';

/**
 * Builds an optimized Cloudinary delivery URL with automatic format and compression
 */
export function buildCloudinaryUrl(
  imagePathOrUrl: string,
  options: CloudinaryTransformOptions = {},
  cloudName: string = DEFAULT_CLOUD_NAME
): string {
  if (!imagePathOrUrl) return getFallbackImage('seafood');

  // If already a full URL
  if (imagePathOrUrl.startsWith('http://') || imagePathOrUrl.startsWith('https://')) {
    // If it's a Cloudinary URL, we can inject transformations
    if (imagePathOrUrl.includes('cloudinary.com')) {
      const parts = imagePathOrUrl.split('/upload/');
      if (parts.length === 2) {
        const transforms = buildTransformationString(options);
        return `${parts[0]}/upload/${transforms ? `${transforms}/` : ''}${parts[1]}`;
      }
    }
    return imagePathOrUrl;
  }

  // If it's a Cloudinary public ID
  const transforms = buildTransformationString(options);
  const cleanId = imagePathOrUrl.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${cloudName || DEFAULT_CLOUD_NAME}/image/upload/${transforms ? `${transforms}/` : ''}${cleanId}`;
}

function buildTransformationString(options: CloudinaryTransformOptions): string {
  const parts: string[] = [];

  // Default to auto quality and format for modern browsers (WebP/AVIF)
  parts.push(`f_${options.format || 'auto'}`);
  parts.push(`q_${options.quality || 'auto'}`);

  if (options.width) parts.push(`w_${options.width}`);
  if (options.height) parts.push(`h_${options.height}`);
  if (options.crop) parts.push(`c_${options.crop}`);
  if (options.gravity) parts.push(`g_${options.gravity}`);

  return parts.join(',');
}

/**
 * High-quality Cloudinary seafood assets with CDN optimization
 */
export const SEAFOOD_ASSETS = {
  hero: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
  gambas: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
  calamari: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1200&q=80',
  risotto: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80',
  platter: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=1200&q=80',
  octopus: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80',
  cremaCatalana: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
  restaurantInterior: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  tableSetting: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
  grilledFish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  paella: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80',
  seafoodSoup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80'
};

/**
 * Reliable fallback placeholder generators ensuring zero broken image frames
 */
export function getFallbackImage(type: 'seafood' | 'interior' | 'dessert' | 'drinks' = 'seafood'): string {
  switch (type) {
    case 'interior':
      return SEAFOOD_ASSETS.restaurantInterior;
    case 'dessert':
      return SEAFOOD_ASSETS.cremaCatalana;
    case 'drinks':
      return SEAFOOD_ASSETS.tableSetting;
    case 'seafood':
    default:
      return SEAFOOD_ASSETS.gambas;
  }
}
