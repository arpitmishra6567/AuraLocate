'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store as StoreIcon,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  Truck,
  AlertTriangle,
  ArrowLeft,
  Share2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { MerchantListing, Store } from '@/types';
import { ReservationModal } from '@/components/ReservationModal';
import { PriceReportModal } from '@/components/PriceReportModal';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    products,
    stores,
    listings,
    userLocation,
    calculateDistance,
    formatPrice,
    getPriceFreshness,
  } = usePlatform();

  const product = products.find((p) => p.id === productId);

  // States for Modals
  const [activeReservation, setActiveReservation] = useState<{
    listing: MerchantListing;
    store: Store;
  } | null>(null);

  const [activeReport, setActiveReport] = useState<{
    listing: MerchantListing;
    store: Store;
  } | null>(null);

  // Comparison Sorting & Filters
  const [compSort, setCompSort] = useState<'price' | 'distance'>('price');
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);
  const [filterHomeDelivery, setFilterHomeDelivery] = useState(false);

  // Fetch all store listings for this specific canonical product
  const productListings = useMemo(() => {
    return listings
      .filter((l) => l.canonicalProductId === productId)
      .filter((l) => (filterInStockOnly ? l.inStock : true))
      .filter((l) => (filterHomeDelivery ? l.deliveryAvailable : true))
      .sort((a, b) => {
        if (compSort === 'price') return a.sellingPrice - b.sellingPrice;
        // Sort by store distance
        const storeA = stores.find((s) => s.id === a.storeId);
        const storeB = stores.find((s) => s.id === b.storeId);
        const distA = storeA ? calculateDistance(storeA.lat, storeA.lng) : 999;
        const distB = storeB ? calculateDistance(storeB.lat, storeB.lng) : 999;
        return distA - distB;
      });
  }, [
    listings,
    productId,
    filterInStockOnly,
    filterHomeDelivery,
    compSort,
    stores,
    calculateDistance,
  ]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[var(--atelier-text)]">Product Model Not Found</h1>
        <p className="text-sm text-[var(--atelier-muted)]">
          The requested canonical electronics model does not exist in our index.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs uppercase tracking-wider font-semibold rounded-[3px]"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const lowestPrice =
    productListings.length > 0
      ? Math.min(...productListings.map((l) => l.sellingPrice))
      : product.mrp;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Breadcrumb & Return Nav */}
      <div className="flex items-center justify-between text-xs text-[var(--atelier-muted)]">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 hover:text-[var(--atelier-text)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Results</span>
        </button>

        <div className="flex items-center gap-2">
          <span>Canonical SKU:</span>
          <span className="font-mono text-[var(--atelier-text)] font-semibold bg-[var(--atelier-subtle)] px-2 py-0.5 rounded-[2px] border border-[var(--atelier-border)]">
            {product.modelNumber}
          </span>
        </div>
      </div>

      {/* 1. PRODUCT HEADER & SPECS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Product Image Stage (4 Cols) */}
        <div className="lg:col-span-5 bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 px-2 py-1 bg-[var(--atelier-subtle)] border border-[var(--atelier-border)] rounded-[2px] text-[10px] font-mono uppercase tracking-wider text-[var(--atelier-bronze)] font-semibold">
            {product.brand}
          </div>
          <img
            src={product.image}
            alt={product.name}
            className="max-h-80 max-w-full object-contain filter drop-shadow-xl"
          />
        </div>

        {/* Product Overview & Specs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--atelier-bronze)] font-semibold mb-1">
              Official Manufacturer Model
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[var(--atelier-text)] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[var(--atelier-dim)] font-mono mt-1">
              Model Number: {product.modelNumber} • Released {product.releaseYear}
            </p>
          </div>

          {/* Price Snapshot Summary */}
          <div className="p-4 bg-[var(--atelier-subtle)] border border-[var(--atelier-border)] rounded-[3px] flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--atelier-muted)] font-medium block">
                Lowest Available Local Price
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[var(--atelier-text)]">
                  {formatPrice(lowestPrice)}
                </span>
                {lowestPrice < product.mrp && (
                  <span className="text-sm text-[var(--atelier-dim)] line-through">
                    MRP: {formatPrice(product.mrp)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs font-semibold text-[var(--atelier-bronze)]">
                <StoreIcon className="w-3.5 h-3.5" />
                {productListings.length} Local Retailers Competing
              </span>
              <span className="block text-[11px] text-[var(--atelier-muted)] mt-1">
                Prices verified near {userLocation.area}
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)] block">
              Factory Specifications & Highlights
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--atelier-muted)]">
              {product.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--atelier-bronze)] flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Spec Sheet */}
          <div className="pt-4 border-t border-[var(--atelier-border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)] block mb-3">
              Full Technical Attributes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="p-2.5 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs"
                >
                  <span className="text-[10px] text-[var(--atelier-dim)] block uppercase tracking-wider">
                    {key}
                  </span>
                  <span className="font-medium text-[var(--atelier-text)] truncate block mt-0.5">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 2. THE MULTI-STORE PRICE COMPARISON TABLE */}
      <section className="space-y-6 pt-6 border-t border-[var(--atelier-border)]">
        
        {/* Table Controls & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--atelier-bronze)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)]">
                Local Availability Matrix
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--atelier-text)] mt-1">
              Store-by-Store Pricing & Inventory
            </h2>
            <p className="text-xs text-[var(--atelier-muted)] mt-1">
              Exact model match guaranteed. Never comparing differing storage or RAM variants.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCompSort('price')}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                compSort === 'price'
                  ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] font-semibold'
                  : 'bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-[var(--atelier-muted)]'
              }`}
            >
              Lowest Price First
            </button>
            <button
              onClick={() => setCompSort('distance')}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                compSort === 'distance'
                  ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] font-semibold'
                  : 'bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-[var(--atelier-muted)]'
              }`}
            >
              Closest Store First
            </button>
            <button
              onClick={() => setFilterInStockOnly(!filterInStockOnly)}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-medium transition-colors ${
                filterInStockOnly
                  ? 'bg-[var(--atelier-bronze)] text-white font-semibold'
                  : 'bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-[var(--atelier-muted)]'
              }`}
            >
              In Stock Only
            </button>
          </div>
        </div>

        {/* Responsive Table / Card View */}
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden shadow-sm">
          {productListings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-[var(--atelier-dim)] mx-auto" />
              <p className="font-serif text-lg text-[var(--atelier-text)]">
                No stores currently match the active filters.
              </p>
              <button
                onClick={() => {
                  setFilterInStockOnly(false);
                  setFilterHomeDelivery(false);
                }}
                className="text-xs text-[var(--atelier-bronze)] underline"
              >
                Reset filters to view all local stores
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)] text-[11px] font-semibold uppercase tracking-wider text-[var(--atelier-muted)]">
                    <th className="py-3 px-5">Certified Retailer & Distance</th>
                    <th className="py-3 px-5">Quoted Selling Price</th>
                    <th className="py-3 px-5">Stock & Box Condition</th>
                    <th className="py-3 px-5">Warranty & Delivery Terms</th>
                    <th className="py-3 px-5 text-right">Actions & Reservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--atelier-border)] text-xs">
                  {productListings.map((listing, index) => {
                    const store = stores.find((s) => s.id === listing.storeId);
                    if (!store) return null;

                    const distance = calculateDistance(store.lat, store.lng);
                    const freshness = getPriceFreshness(listing.updatedAt);
                    const isBestPrice = listing.sellingPrice === lowestPrice;

                    return (
                      <tr
                        key={listing.id}
                        className={`hover:bg-[var(--atelier-subtle)]/70 transition-colors ${
                          isBestPrice ? 'bg-[var(--atelier-subtle)]/30' : ''
                        }`}
                      >
                        {/* Store Info */}
                        <td className="py-4 px-5 align-top">
                          <div className="flex items-baseline gap-2">
                            <Link
                              href={`/shop/${store.slug}`}
                              className="font-serif text-sm font-semibold text-[var(--atelier-text)] hover:text-[var(--atelier-bronze)] transition-colors"
                            >
                              {store.name}
                            </Link>
                            {store.isVerified ? (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[var(--atelier-success)] bg-[var(--atelier-success-bg)] px-1.5 py-0.5 rounded-[2px]">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            ) : (
                              <span className="text-[9px] text-[var(--atelier-dim)] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded-[2px]">
                                Verification Pending
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-[var(--atelier-muted)] mt-1">
                            <MapPin className="w-3 h-3 text-[var(--atelier-dim)]" />
                            <span>
                              {store.area} •{' '}
                              <strong className="text-[var(--atelier-text)]">{distance} km away</strong>
                            </span>
                          </div>

                          <div className="text-[10px] text-[var(--atelier-dim)] mt-1">
                            Rating: ★ {store.rating} ({store.reviewCount} store reviews)
                          </div>
                        </td>

                        {/* Quoted Price */}
                        <td className="py-4 px-5 align-top whitespace-nowrap">
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`font-serif text-lg font-bold ${
                                isBestPrice
                                  ? 'text-[var(--atelier-text)]'
                                  : 'text-[var(--atelier-text)]'
                              }`}
                            >
                              {formatPrice(listing.sellingPrice)}
                            </span>
                            {isBestPrice && (
                              <span className="px-1.5 py-0.5 rounded-[2px] bg-[var(--atelier-bronze-subtle)] text-[var(--atelier-bronze)] text-[9px] font-bold tracking-wider uppercase">
                                Lowest Price
                              </span>
                            )}
                          </div>

                          {/* Freshness Badge */}
                          <div className="flex items-center gap-1 text-[11px] mt-1">
                            <Clock className="w-3 h-3 text-[var(--atelier-dim)]" />
                            <span
                              className={
                                freshness.isStale
                                  ? 'text-amber-600 font-medium'
                                  : 'text-[var(--atelier-muted)]'
                              }
                            >
                              {freshness.label}
                            </span>
                          </div>

                          {freshness.isStale && (
                            <span className="text-[10px] text-amber-600 block mt-0.5">
                              ⚠️ Call store to reconfirm quote
                            </span>
                          )}
                        </td>

                        {/* Stock & Condition */}
                        <td className="py-4 px-5 align-top">
                          {listing.inStock ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--atelier-success)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--atelier-success)]" />
                                {listing.stockCount} units available
                              </span>
                              <div className="text-[11px] text-[var(--atelier-muted)] mt-0.5">
                                {listing.condition}
                              </div>
                              <div className="text-[10px] text-[var(--atelier-dim)]">
                                Pickup ready in ~{listing.pickupReadyMins} mins
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[11px] font-medium text-red-500">
                                Out of Stock
                              </span>
                              <span className="text-[10px] text-[var(--atelier-dim)] block">
                                Enquire for next consignment arrival
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Warranty & Delivery */}
                        <td className="py-4 px-5 align-top">
                          <div className="font-medium text-[var(--atelier-text)]">
                            {listing.warrantyTerms}
                          </div>
                          <div className="text-[11px] text-[var(--atelier-muted)] mt-1 flex items-center gap-1">
                            <Truck className="w-3 h-3 text-[var(--atelier-dim)]" />
                            <span>
                              {listing.deliveryAvailable
                                ? listing.deliveryFee === 0
                                  ? 'Free Store Delivery Available'
                                  : `Delivery: ₹${listing.deliveryFee}`
                                : 'Store Pickup Only'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 align-top text-right space-y-2 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Direct Phone Call */}
                            <a
                              href={`tel:${store.phone}`}
                              className="p-2 border border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:bg-[var(--atelier-subtle)] text-[var(--atelier-text)] rounded-[3px] transition-colors"
                              title={`Call ${store.name}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp Enquiry */}
                            <a
                              href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                                `Hello ${store.name}, I am inquiring via AuraLocate about ${product.name} (Quoted ₹${listing.sellingPrice}). Is this unit in stock?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 border border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:bg-[var(--atelier-subtle)] text-[var(--atelier-text)] rounded-[3px] transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            {/* Reserve for In-Store Pickup Modal Trigger */}
                            <button
                              onClick={() => setActiveReservation({ listing, store })}
                              className="px-3.5 py-2 bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-[11px] font-semibold uppercase tracking-wider rounded-[3px] transition-colors"
                            >
                              Reserve Quote
                            </button>
                          </div>

                          <div>
                            <button
                              onClick={() => setActiveReport({ listing, store })}
                              className="text-[10px] text-[var(--atelier-dim)] hover:text-amber-600 transition-colors"
                            >
                              Report Incorrect Price
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>

      {/* Modals */}
      {activeReservation && (
        <ReservationModal
          isOpen={true}
          onClose={() => setActiveReservation(null)}
          product={product}
          listing={activeReservation.listing}
          store={activeReservation.store}
        />
      )}

      {activeReport && (
        <PriceReportModal
          isOpen={true}
          onClose={() => setActiveReport(null)}
          product={product}
          listing={activeReport.listing}
          store={activeReport.store}
        />
      )}

    </div>
  );
}
