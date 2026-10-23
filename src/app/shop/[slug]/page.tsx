'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Share2,
  ExternalLink,
  Store as StoreIcon,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { ReservationModal } from '@/components/ReservationModal';
import { CanonicalProduct, MerchantListing } from '@/types';

export default function MerchantStorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { stores, listings, products, formatPrice, calculateDistance } = usePlatform();

  const store = stores.find((s) => s.slug === slug);

  const [activeReservation, setActiveReservation] = useState<{
    product: CanonicalProduct;
    listing: MerchantListing;
  } | null>(null);

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[var(--atelier-text)]">Storefront Not Found</h1>
        <p className="text-sm text-[var(--atelier-muted)]">
          The requested merchant showroom does not exist on AuraLocate.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs uppercase tracking-wider font-semibold rounded-[3px]"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Get all listings for this store
  const storeListings = listings.filter((l) => l.storeId === store.id);
  const distance = calculateDistance(store.lat, store.lng);

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. STOREFRONT BANNER & PROFILE */}
      <section className="relative">
        <div className="h-64 sm:h-80 w-full overflow-hidden relative bg-[var(--atelier-text)]">
          <img
            src={store.bannerImage}
            alt={store.name}
            className="w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-black/40 backdrop-blur-md text-white text-xs hover:bg-black/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Floating Store Card Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-[4px] overflow-hidden border border-[var(--atelier-border)] bg-[var(--atelier-subtle)] flex-shrink-0">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--atelier-text)]">
                      {store.name}
                    </h1>
                    {store.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--atelier-success)] bg-[var(--atelier-success-bg)] px-2 py-0.5 rounded-[2px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Offline Dealer
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--atelier-muted)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--atelier-dim)]" />
                    <span>{store.address} • <strong className="text-[var(--atelier-text)]">{distance} km from you</strong></span>
                  </p>

                  <div className="text-xs text-[var(--atelier-dim)] mt-2 flex flex-wrap gap-4">
                    <span>Proprietor: <strong className="text-[var(--atelier-text)]">{store.ownerName}</strong></span>
                    <span>•</span>
                    <span>Hours: {store.openingHours}</span>
                    <span>•</span>
                    <span className="text-[var(--atelier-bronze)] font-semibold">★ {store.rating} ({store.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-[3px] border border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:bg-[var(--atelier-subtle)] text-xs font-semibold text-[var(--atelier-text)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--atelier-bronze)]" />
                  <span>Call {store.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Hello ${store.name}, I am viewing your digital storefront on AuraLocate.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-[3px] bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. STORE INVENTORY & LIVE LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[var(--atelier-border)] pb-4 flex items-baseline justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[var(--atelier-text)]">
              In-Stock Showroom Inventory ({storeListings.length})
            </h2>
            <p className="text-xs text-[var(--atelier-muted)] mt-1">
              Verified live pricing at {store.name}. Reserve your product to lock the price.
            </p>
          </div>
          <span className="text-xs text-[var(--atelier-dim)] font-mono">
            Pincode: {store.pincode}
          </span>
        </div>

        {storeListings.length === 0 ? (
          <div className="p-12 text-center bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px]">
            <p className="font-serif text-lg text-[var(--atelier-text)]">
              This merchant has not listed active stock items yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeListings.map((listing) => {
              const product = products.find((p) => p.id === listing.canonicalProductId);
              if (!product) return null;

              return (
                <div
                  key={listing.id}
                  className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-5 flex flex-col hover:border-[var(--atelier-bronze)] transition-all shadow-sm"
                >
                  <div className="h-44 bg-[var(--atelier-subtle)] rounded-[2px] p-4 flex items-center justify-center mb-4 relative">
                    <span className="absolute top-2 left-2 text-[10px] font-mono font-semibold uppercase text-[var(--atelier-bronze)] bg-[var(--atelier-surface)] px-1.5 py-0.5 rounded-[2px] border border-[var(--atelier-border)]">
                      {product.brand}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-36 max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div className="text-xs text-[var(--atelier-dim)] font-mono mb-1">
                    SKU: {product.modelNumber}
                  </div>

                  <Link href={`/product/${product.id}`} className="block mb-2">
                    <h3 className="font-serif text-base font-medium text-[var(--atelier-text)] hover:text-[var(--atelier-bronze)] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="text-[11px] text-[var(--atelier-muted)] mb-4">
                    {listing.warrantyTerms}
                  </div>

                  <div className="mt-auto pt-3 border-t border-[var(--atelier-border)] flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] uppercase text-[var(--atelier-muted)] block">
                        Store Offer
                      </span>
                      <span className="font-serif text-xl font-bold text-[var(--atelier-text)]">
                        {formatPrice(listing.sellingPrice)}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-[var(--atelier-success)]">
                      ● {listing.stockCount} in stock
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="py-2 text-center text-xs font-medium border border-[var(--atelier-border)] hover:bg-[var(--atelier-subtle)] rounded-[3px] transition-colors"
                    >
                      Compare Others
                    </Link>
                    <button
                      onClick={() => setActiveReservation({ product, listing })}
                      className="py-2 text-center text-xs font-semibold uppercase tracking-wider bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] rounded-[3px] transition-colors"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Reservation Modal */}
      {activeReservation && (
        <ReservationModal
          isOpen={true}
          onClose={() => setActiveReservation(null)}
          product={activeReservation.product}
          listing={activeReservation.listing}
          store={store}
        />
      )}

    </div>
  );
}
