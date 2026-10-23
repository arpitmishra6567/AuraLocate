'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Store,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';

export default function ReservationsPage() {
  const { reservations, products, stores, formatPrice, updateReservationStatus } = usePlatform();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[var(--atelier-border)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--atelier-bronze)] uppercase tracking-widest font-semibold mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[var(--atelier-text)]">
            My In-Store Reservations & Price Quotes
          </h1>
          <p className="text-xs text-[var(--atelier-muted)] mt-1">
            Review your held price quotes, showroom addresses, and retailer confirmation status.
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs uppercase tracking-wider font-semibold rounded-[3px] hover:bg-[var(--atelier-bronze)] transition-colors"
        >
          <span>Find More Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List of Held Bookings */}
      {reservations.length === 0 ? (
        <div className="p-16 text-center bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] space-y-4">
          <Bookmark className="w-10 h-10 text-[var(--atelier-dim)] mx-auto" />
          <h2 className="font-serif text-2xl font-medium text-[var(--atelier-text)]">
            No Active Store Reservations
          </h2>
          <p className="text-xs text-[var(--atelier-muted)] max-w-md mx-auto leading-relaxed">
            When you reserve a product quote on AuraLocate, your held price snapshot and booking code will appear here.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-[var(--atelier-bronze)] text-white text-xs uppercase tracking-wider font-semibold rounded-[3px]"
          >
            Explore Bangalore Showrooms
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const product = products.find((p) => p.id === res.canonicalProductId);
            const store = stores.find((s) => s.id === res.storeId);
            if (!product || !store) return null;

            return (
              <div
                key={res.id}
                className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 shadow-sm hover:border-[var(--atelier-bronze)] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Product & Ref info */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-[var(--atelier-subtle)] rounded-[3px] p-2 flex items-center justify-center flex-shrink-0 border border-[var(--atelier-border)]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[var(--atelier-bronze)] bg-[var(--atelier-bronze-subtle)] px-2 py-0.5 rounded-[2px]">
                          {res.bookingNumber}
                        </span>
                        
                        {/* Status Badge */}
                        {res.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--atelier-success)] bg-[var(--atelier-success-bg)] px-2 py-0.5 rounded-[2px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmed by Merchant
                          </span>
                        )}
                        {res.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-[2px]">
                            <Clock className="w-3 h-3" />
                            Awaiting Store Confirmation
                          </span>
                        )}
                        {res.status === 'fulfilled' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-[2px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed / Collected
                          </span>
                        )}
                        {res.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-[2px]">
                            <XCircle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                      </div>

                      <Link href={`/product/${product.id}`} className="hover:text-[var(--atelier-bronze)]">
                        <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="text-xs text-[var(--atelier-muted)] mt-1 flex flex-wrap gap-4">
                        <span>Booked: {new Date(res.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Mode: <strong className="capitalize">{res.deliveryPreference.replace('_', ' ')}</strong></span>
                      </div>

                      {res.merchantNotes && (
                        <div className="mt-2 text-xs p-2 bg-[var(--atelier-subtle)] rounded-[2px] border border-[var(--atelier-border)] text-[var(--atelier-text)]">
                          <strong>Note from Store:</strong> {res.merchantNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Store Details & Directions */}
                  <div className="p-4 bg-[var(--atelier-subtle)] rounded-[3px] border border-[var(--atelier-border)] text-xs space-y-1.5 min-w-[260px]">
                    <div className="font-serif font-semibold text-sm text-[var(--atelier-text)] flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-[var(--atelier-bronze)]" />
                      <span>{store.name}</span>
                    </div>
                    <div className="text-[var(--atelier-muted)] flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--atelier-dim)] flex-shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--atelier-border)]/60">
                      <a href={`tel:${store.phone}`} className="text-[var(--atelier-bronze)] font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {store.phone}
                      </a>
                      <Link href={`/shop/${store.slug}`} className="text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]">
                        Store profile →
                      </Link>
                    </div>
                  </div>

                  {/* Right: Locked Price & Actions */}
                  <div className="text-right flex flex-col justify-between items-end space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--atelier-muted)] block">
                        Locked In-Store Price
                      </span>
                      <span className="font-serif text-2xl font-bold text-[var(--atelier-text)]">
                        {formatPrice(res.agreedPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.status !== 'cancelled' && res.status !== 'fulfilled' && (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'cancelled')}
                          className="px-3 py-1.5 border border-[var(--atelier-border)] text-[var(--atelier-muted)] hover:text-red-500 hover:border-red-500 text-xs rounded-[3px] transition-colors"
                        >
                          Cancel Hold
                        </button>
                      )}

                      <a
                        href={`tel:${store.phone}`}
                        className="px-4 py-1.5 bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors"
                      >
                        Call Shop
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
