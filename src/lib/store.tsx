'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Store,
  CanonicalProduct,
  MerchantListing,
  BookingReservation,
  PriceReport,
  UserLocation,
} from '@/types';
import {
  INITIAL_STORES,
  CANONICAL_PRODUCTS,
  INITIAL_LISTINGS,
  INITIAL_RESERVATIONS,
  INITIAL_REPORTS,
} from './mockData';

interface PlatformContextType {
  stores: Store[];
  products: CanonicalProduct[];
  listings: MerchantListing[];
  reservations: BookingReservation[];
  reports: PriceReport[];
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;

  // Actions
  createReservation: (data: Omit<BookingReservation, 'id' | 'bookingNumber' | 'status' | 'createdAt' | 'expiresAt'>) => BookingReservation;
  updateReservationStatus: (id: string, status: BookingReservation['status'], merchantNotes?: string) => void;
  updateListingPrice: (listingId: string, newPrice: number, stockCount: number, inStock: boolean, warrantyTerms?: string) => void;
  createListing: (data: Omit<MerchantListing, 'id' | 'updatedAt'>) => MerchantListing;
  createPriceReport: (data: Omit<PriceReport, 'id' | 'status' | 'createdAt'>) => PriceReport;
  updateReportStatus: (id: string, status: PriceReport['status']) => void;
  toggleStoreVerification: (storeId: string) => void;
  createStore: (store: Omit<Store, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Store;

  // Helpers
  calculateDistance: (storeLat: number, storeLng: number) => number;
  formatPrice: (price: number) => string;
  getPriceFreshness: (updatedAt: string) => { label: string; isStale: boolean; isVeryFresh: boolean };
  getBestPriceForProduct: (productId: string) => { lowestPrice: number; storeCount: number; bestListing?: MerchantListing; bestStore?: Store } | null;
}

const DEFAULT_LOCATION: UserLocation = {
  city: 'Bangalore',
  area: 'Indiranagar',
  pincode: '560038',
  lat: 12.9719,
  lng: 77.6412,
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [products, setProducts] = useState<CanonicalProduct[]>(CANONICAL_PRODUCTS);
  const [listings, setListings] = useState<MerchantListing[]>(INITIAL_LISTINGS);
  const [reservations, setReservations] = useState<BookingReservation[]>(INITIAL_RESERVATIONS);
  const [reports, setReports] = useState<PriceReport[]>(INITIAL_REPORTS);
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage with smart dataset merge
  useEffect(() => {
    try {
      const DATASET_VERSION = 'v3_verified_accurate_images';
      const savedVersion = localStorage.getItem('auralocate_dataset_version');

      const savedStores = localStorage.getItem('auralocate_stores');
      const savedListings = localStorage.getItem('auralocate_listings');
      const savedReservations = localStorage.getItem('auralocate_reservations');
      const savedReports = localStorage.getItem('auralocate_reports');
      const savedLoc = localStorage.getItem('auralocate_location');

      if (savedVersion !== DATASET_VERSION) {
        // Automatically upgrade to full 12 merchants and 16 canonical products
        setStores(INITIAL_STORES);
        setProducts(CANONICAL_PRODUCTS);
        setListings(INITIAL_LISTINGS);
        localStorage.setItem('auralocate_dataset_version', DATASET_VERSION);
      } else {
        if (savedStores) {
          const parsedStores: Store[] = JSON.parse(savedStores);
          const mergedStores = [...parsedStores];
          INITIAL_STORES.forEach((is) => {
            if (!mergedStores.some((s) => s.id === is.id)) mergedStores.push(is);
          });
          setStores(mergedStores);
        }
        if (savedListings) {
          const parsedListings: MerchantListing[] = JSON.parse(savedListings);
          const mergedListings = [...parsedListings];
          INITIAL_LISTINGS.forEach((il) => {
            if (!mergedListings.some((l) => l.id === il.id)) mergedListings.push(il);
          });
          setListings(mergedListings);
        }
      }

      if (savedReservations) setReservations(JSON.parse(savedReservations));
      if (savedReports) setReports(JSON.parse(savedReports));
      if (savedLoc) setUserLocation(JSON.parse(savedLoc));
    } catch (e) {
      console.warn('LocalStorage load error, using mock data:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('auralocate_stores', JSON.stringify(stores));
      localStorage.setItem('auralocate_listings', JSON.stringify(listings));
      localStorage.setItem('auralocate_reservations', JSON.stringify(reservations));
      localStorage.setItem('auralocate_reports', JSON.stringify(reports));
      localStorage.setItem('auralocate_location', JSON.stringify(userLocation));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [stores, listings, reservations, reports, userLocation, isLoaded]);

  // Haversine Distance formula in Kilometers
  const calculateDistance = (storeLat: number, storeLng: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (storeLat - userLocation.lat) * (Math.PI / 180);
    const dLng = (storeLng - userLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * (Math.PI / 180)) *
        Math.cos(storeLat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return parseFloat(distance.toFixed(1));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPriceFreshness = (updatedAt: string) => {
    const diffMs = Date.now() - new Date(updatedAt).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (3600 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

    let label = '';
    if (diffMins < 60) {
      label = `Updated ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      label = `Updated ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays === 1) {
      label = 'Updated yesterday';
    } else {
      label = `Updated ${diffDays} days ago`;
    }

    return {
      label,
      isStale: diffHours >= 24,
      isVeryFresh: diffHours < 4,
    };
  };

  const getBestPriceForProduct = (productId: string) => {
    const productListings = listings.filter(
      (l) => l.canonicalProductId === productId && l.inStock
    );
    if (productListings.length === 0) return null;

    const sorted = [...productListings].sort((a, b) => a.sellingPrice - b.sellingPrice);
    const bestListing = sorted[0];
    const bestStore = stores.find((s) => s.id === bestListing.storeId);

    return {
      lowestPrice: bestListing.sellingPrice,
      storeCount: productListings.length,
      bestListing,
      bestStore,
    };
  };

  const createReservation = (
    data: Omit<BookingReservation, 'id' | 'bookingNumber' | 'status' | 'createdAt' | 'expiresAt'>
  ): BookingReservation => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newReservation: BookingReservation = {
      ...data,
      id: `res-${Date.now()}`,
      bookingNumber: `AL-${randomSuffix}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);
    return newReservation;
  };

  const updateReservationStatus = (
    id: string,
    status: BookingReservation['status'],
    merchantNotes?: string
  ) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, status, merchantNotes: merchantNotes || res.merchantNotes } : res
      )
    );
  };

  const updateListingPrice = (
    listingId: string,
    newPrice: number,
    stockCount: number,
    inStock: boolean,
    warrantyTerms?: string
  ) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? {
              ...item,
              sellingPrice: newPrice,
              stockCount,
              inStock,
              warrantyTerms: warrantyTerms || item.warrantyTerms,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const createListing = (data: Omit<MerchantListing, 'id' | 'updatedAt'>): MerchantListing => {
    const newListing: MerchantListing = {
      ...data,
      id: `list-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const createPriceReport = (
    data: Omit<PriceReport, 'id' | 'status' | 'createdAt'>
  ): PriceReport => {
    const newReport: PriceReport = {
      ...data,
      id: `rep-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (id: string, status: PriceReport['status']) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status } : rep))
    );
  };

  const toggleStoreVerification = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, isVerified: !s.isVerified } : s))
    );
  };

  const createStore = (storeData: Omit<Store, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Store => {
    const newStore: Store = {
      ...storeData,
      id: `store-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 1,
    };
    setStores((prev) => [...prev, newStore]);
    return newStore;
  };

  return (
    <PlatformContext.Provider
      value={{
        stores,
        products,
        listings,
        reservations,
        reports,
        userLocation,
        setUserLocation,
        createReservation,
        updateReservationStatus,
        updateListingPrice,
        createListing,
        createPriceReport,
        updateReportStatus,
        toggleStoreVerification,
        createStore,
        calculateDistance,
        formatPrice,
        getPriceFreshness,
        getBestPriceForProduct,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
