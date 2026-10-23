export type Role = 'customer' | 'merchant' | 'admin';

export interface Store {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  openingHours: string;
  rating: number;
  reviewCount: number;
  image: string;
  bannerImage: string;
  createdAt: string;
  deliveryOffered: boolean;
  deliveryMaxKm?: number;
  deliveryFeeFlat?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
}

export interface CanonicalProduct {
  id: string;
  name: string;
  brand: string;
  modelNumber: string;
  categorySlug: string;
  mrp: number;
  specs: Record<string, string>;
  image: string;
  gallery: string[];
  highlights: string[];
  releaseYear: number;
}

export interface MerchantListing {
  id: string;
  storeId: string;
  canonicalProductId: string;
  sellingPrice: number;
  inStock: boolean;
  stockCount: number;
  condition: 'Brand New Sealed' | 'Open Box' | 'Display Unit';
  warrantyTerms: string;
  deliveryAvailable: boolean;
  deliveryFee: number; // 0 = free
  pickupReadyMins: number; // e.g. 30 mins
  updatedAt: string; // ISO string for freshness calculation
}

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'fulfilled' | 'cancelled';

export interface BookingReservation {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  storeId: string;
  listingId: string;
  canonicalProductId: string;
  agreedPrice: number;
  status: ReservationStatus;
  deliveryPreference: 'pickup' | 'home_delivery';
  address?: string;
  notes?: string;
  merchantNotes?: string;
  createdAt: string;
  expiresAt: string;
}

export type PriceReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface PriceReport {
  id: string;
  listingId: string;
  storeId: string;
  canonicalProductId: string;
  customerName: string;
  customerPhone: string;
  reportedPrice: number;
  comments: string;
  status: PriceReportStatus;
  createdAt: string;
}

export interface UserLocation {
  city: string;
  area: string;
  pincode: string;
  lat: number;
  lng: number;
}
