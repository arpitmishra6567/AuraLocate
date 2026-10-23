'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store as StoreIcon,
  Plus,
  Edit2,
  Check,
  X,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  TrendingUp,
  Inbox,
  Package,
  Sliders,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { MerchantListing, BookingReservation } from '@/types';

export default function MerchantDashboardPage() {
  const {
    stores,
    products,
    listings,
    reservations,
    updateListingPrice,
    createListing,
    updateReservationStatus,
    formatPrice,
    getPriceFreshness,
  } = usePlatform();

  // Active Merchant Store Switcher (defaults to store-1: Digital Oasis)
  const [activeStoreId, setActiveStoreId] = useState<string>(stores[0]?.id || 'store-1');
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'reservations' | 'add_product'>('inventory');

  // Editing state for an existing listing
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');
  const [editInStock, setEditInStock] = useState<boolean>(true);
  const [editWarranty, setEditWarranty] = useState<string>('');

  // Add new listing form state
  const [newSelectedProductId, setNewSelectedProductId] = useState<string>(products[0]?.id || '');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newStockCount, setNewStockCount] = useState<string>('3');
  const [newWarranty, setNewWarranty] = useState<string>('1 Year Official Brand Warranty');
  const [newDeliveryAvailable, setNewDeliveryAvailable] = useState<boolean>(true);
  const [newDeliveryFee, setNewDeliveryFee] = useState<string>('0');
  const [listingSuccessMsg, setListingSuccessMsg] = useState<string | null>(null);

  // Filter listings & reservations for current active store
  const storeListings = listings.filter((l) => l.storeId === activeStore.id);
  const storeReservations = reservations.filter((r) => r.storeId === activeStore.id);

  // Handlers for Editing
  const startEditing = (listing: MerchantListing) => {
    setEditingListingId(listing.id);
    setEditPrice(listing.sellingPrice.toString());
    setEditStock(listing.stockCount.toString());
    setEditInStock(listing.inStock);
    setEditWarranty(listing.warrantyTerms);
  };

  const saveEdit = (listingId: string) => {
    const priceNum = parseFloat(editPrice);
    const stockNum = parseInt(editStock, 10);
    if (!isNaN(priceNum) && !isNaN(stockNum)) {
      updateListingPrice(
        listingId,
        priceNum,
        stockNum,
        stockNum > 0 && editInStock,
        editWarranty
      );
    }
    setEditingListingId(null);
  };

  // Handler for Creating New Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    const stockNum = parseInt(newStockCount, 10);
    if (!priceNum || isNaN(priceNum)) return;

    createListing({
      storeId: activeStore.id,
      canonicalProductId: newSelectedProductId,
      sellingPrice: priceNum,
      inStock: stockNum > 0,
      stockCount: stockNum,
      condition: 'Brand New Sealed',
      warrantyTerms: newWarranty,
      deliveryAvailable: newDeliveryAvailable,
      deliveryFee: parseFloat(newDeliveryFee) || 0,
      pickupReadyMins: 30,
    });

    setListingSuccessMsg('Product successfully listed with real-time price timestamp!');
    setNewPrice('');
    setTimeout(() => {
      setListingSuccessMsg(null);
      setActiveTab('inventory');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. TOP HEADER & STORE PROFILE SWITCHER */}
      <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[4px] bg-[var(--atelier-text)] text-[var(--atelier-surface)] flex items-center justify-center font-serif text-2xl font-bold">
              <StoreIcon className="w-7 h-7 text-[var(--atelier-bronze)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--atelier-bronze)]">
                  Merchant Workspace
                </span>
                {activeStore.isVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[var(--atelier-success)] bg-[var(--atelier-success-bg)] px-1.5 py-0.5 rounded-[2px]">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified Store
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--atelier-text)]">
                {activeStore.name}
              </h1>

              <p className="text-xs text-[var(--atelier-muted)] mt-0.5">
                {activeStore.address} • Pincode: {activeStore.pincode}
              </p>
            </div>
          </div>

          {/* Quick Stats & Store Switcher */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-3 bg-[var(--atelier-subtle)] border border-[var(--atelier-border)] rounded-[3px] text-xs">
              <span className="text-[var(--atelier-dim)] block text-[10px] uppercase">
                Active Switcher
              </span>
              <select
                value={activeStoreId}
                onChange={(e) => setActiveStoreId(e.target.value)}
                className="bg-transparent font-semibold text-[var(--atelier-text)] focus:outline-none"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.area})
                  </option>
                ))}
              </select>
            </div>

            <Link
              href={`/shop/${activeStore.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-3 border border-[var(--atelier-border)] hover:bg-[var(--atelier-subtle)] text-xs font-semibold text-[var(--atelier-text)] rounded-[3px] transition-colors"
            >
              <span>Public Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--atelier-bronze)]" />
            </Link>
          </div>

        </div>

        {/* Dashboard Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--atelier-border)]">
          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Active Listed Models
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-text)]">
              {storeListings.length}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Held Customer Reservations
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-bronze)]">
              {storeReservations.filter((r) => r.status === 'pending' || r.status === 'confirmed').length}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Direct Enquiry Volume
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-text)]">
              38 Calls / Wk
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Commission Due
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-success)]">
              ₹0 (Free MVP)
            </span>
          </div>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="flex border-b border-[var(--atelier-border)] gap-6 text-sm">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 font-serif font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'inventory'
              ? 'border-[var(--atelier-bronze)] text-[var(--atelier-text)] font-semibold'
              : 'border-transparent text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Showroom Inventory & Live Prices ({storeListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 font-serif font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'reservations'
              ? 'border-[var(--atelier-bronze)] text-[var(--atelier-text)] font-semibold'
              : 'border-transparent text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Customer Holds Queue ({storeReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add_product')}
          className={`pb-3 font-serif font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'add_product'
              ? 'border-[var(--atelier-bronze)] text-[var(--atelier-text)] font-semibold'
              : 'border-transparent text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Product from Catalogue</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden shadow-sm">
          <div className="p-4 bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)]">
              Real-Time Stock & Pricing Control
            </span>
            <span className="text-xs text-[var(--atelier-muted)]">
              Edits update customer comparison tables instantaneously.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--atelier-surface)] border-b border-[var(--atelier-border)] text-[11px] font-semibold uppercase tracking-wider text-[var(--atelier-muted)]">
                  <th className="py-3 px-5">Model & Canonical SKU</th>
                  <th className="py-3 px-5">Selling Price</th>
                  <th className="py-3 px-5">Stock Units</th>
                  <th className="py-3 px-5">Status & Freshness</th>
                  <th className="py-3 px-5">Warranty Info</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--atelier-border)] text-xs">
                {storeListings.map((listing) => {
                  const product = products.find((p) => p.id === listing.canonicalProductId);
                  if (!product) return null;

                  const isEditing = editingListingId === listing.id;
                  const freshness = getPriceFreshness(listing.updatedAt);

                  return (
                    <tr key={listing.id} className="hover:bg-[var(--atelier-subtle)]/50 transition-colors">
                      
                      {/* Product SKU */}
                      <td className="py-4 px-5 align-top">
                        <div className="font-serif font-semibold text-sm text-[var(--atelier-text)]">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-[var(--atelier-dim)] font-mono mt-0.5">
                          SKU: {product.modelNumber} • {product.brand}
                        </div>
                      </td>

                      {/* Selling Price */}
                      <td className="py-4 px-5 align-top">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-serif">₹</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 h-8 px-2 rounded-[2px] border border-[var(--atelier-bronze)] bg-[var(--atelier-surface)] text-xs font-serif font-bold text-[var(--atelier-text)]"
                            />
                          </div>
                        ) : (
                          <div className="font-serif text-base font-bold text-[var(--atelier-text)]">
                            {formatPrice(listing.sellingPrice)}
                          </div>
                        )}
                      </td>

                      {/* Stock Units */}
                      <td className="py-4 px-5 align-top">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-16 h-8 px-2 rounded-[2px] border border-[var(--atelier-bronze)] bg-[var(--atelier-surface)] text-xs font-mono"
                          />
                        ) : (
                          <span className="font-mono text-xs font-semibold text-[var(--atelier-text)]">
                            {listing.stockCount} units
                          </span>
                        )}
                      </td>

                      {/* Status & Freshness */}
                      <td className="py-4 px-5 align-top">
                        <div>
                          {listing.inStock ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--atelier-success)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--atelier-success)]" />
                              Active In Stock
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-red-500">
                              Out of Stock
                            </span>
                          )}
                          <div className="text-[10px] text-[var(--atelier-dim)] mt-0.5">
                            {freshness.label}
                          </div>
                        </div>
                      </td>

                      {/* Warranty */}
                      <td className="py-4 px-5 align-top text-[var(--atelier-muted)] max-w-xs truncate">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editWarranty}
                            onChange={(e) => setEditWarranty(e.target.value)}
                            className="w-full h-8 px-2 rounded-[2px] border border-[var(--atelier-bronze)] bg-[var(--atelier-surface)] text-xs"
                          />
                        ) : (
                          listing.warrantyTerms
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 align-top text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => saveEdit(listing.id)}
                              className="p-1.5 bg-[var(--atelier-success)] text-white rounded-[2px]"
                              title="Save Changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingListingId(null)}
                              className="p-1.5 bg-[var(--atelier-dim)] text-white rounded-[2px]"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(listing)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] border border-[var(--atelier-border)] hover:border-[var(--atelier-bronze)] text-[11px] font-medium transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-[var(--atelier-bronze)]" />
                            <span>Quick Update</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB B: CUSTOMER RESERVATIONS QUEUE */}
      {activeTab === 'reservations' && (
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden shadow-sm">
          <div className="p-4 bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)] flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)]">
              Incoming Customer Price Locks & In-Store Pickups
            </span>
          </div>

          {storeReservations.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--atelier-muted)]">
              No customer reservation holds received yet for this store location.
            </div>
          ) : (
            <div className="divide-y divide-[var(--atelier-border)]">
              {storeReservations.map((res) => {
                const product = products.find((p) => p.id === res.canonicalProductId);
                if (!product) return null;

                return (
                  <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--atelier-subtle)]/30 transition-colors">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--atelier-bronze)] bg-[var(--atelier-bronze-subtle)] px-2 py-0.5 rounded-[2px]">
                          {res.bookingNumber}
                        </span>
                        <span className="font-serif font-semibold text-base text-[var(--atelier-text)]">
                          {product.name}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--atelier-muted)] flex flex-wrap gap-4">
                        <span>Customer: <strong className="text-[var(--atelier-text)]">{res.customerName}</strong></span>
                        <span>Phone: <a href={`tel:${res.customerPhone}`} className="text-[var(--atelier-bronze)] font-mono">{res.customerPhone}</a></span>
                        <span>Mode: <strong className="capitalize">{res.deliveryPreference.replace('_', ' ')}</strong></span>
                      </div>

                      {res.notes && (
                        <div className="text-xs text-[var(--atelier-dim)] italic">
                          "Customer Note: {res.notes}"
                        </div>
                      )}
                    </div>

                    {/* Price Snapshot & Merchant Status Controls */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] text-[var(--atelier-muted)] uppercase block">
                          Agreed Hold Price
                        </span>
                        <span className="font-serif text-xl font-bold text-[var(--atelier-text)]">
                          {formatPrice(res.agreedPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {res.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateReservationStatus(res.id, 'confirmed', 'Unit box set aside at counter.')}
                              className="px-3 py-1.5 bg-[var(--atelier-success)] text-white text-xs font-semibold rounded-[3px] hover:opacity-90"
                            >
                              Confirm Hold
                            </button>
                            <button
                              onClick={() => updateReservationStatus(res.id, 'rejected', 'Stock sold out before hold.')}
                              className="px-3 py-1.5 border border-[var(--atelier-border)] text-red-500 text-xs rounded-[3px] hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'fulfilled', 'Customer visited store and purchased.')}
                            className="px-3 py-1.5 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs font-semibold rounded-[3px] hover:bg-[var(--atelier-bronze)]"
                          >
                            Mark Picked Up
                          </button>
                        )}

                        {res.status === 'fulfilled' && (
                          <span className="text-xs font-semibold text-[var(--atelier-success)] flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </span>
                        )}

                        {res.status === 'cancelled' && (
                          <span className="text-xs font-semibold text-red-500">
                            Cancelled Hold
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB C: ADD PRODUCT FROM CANONICAL CATALOGUE */}
      {activeTab === 'add_product' && (
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 sm:p-8 max-w-2xl shadow-sm">
          <h3 className="font-serif text-2xl font-medium text-[var(--atelier-text)] mb-2">
            List a Product in Your Showroom
          </h3>
          <p className="text-xs text-[var(--atelier-muted)] mb-6">
            Choose from our pre-verified canonical electronics catalogue. Customers in Bangalore will immediately see your store offer in comparison results.
          </p>

          {listingSuccessMsg && (
            <div className="p-3 bg-[var(--atelier-success-bg)] text-[var(--atelier-success)] text-xs font-semibold rounded-[3px] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{listingSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateListing} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                Select Canonical Product Model *
              </label>
              <select
                value={newSelectedProductId}
                onChange={(e) => setNewSelectedProductId(e.target.value)}
                className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.brand}] {p.name} (SKU: {p.modelNumber} - MRP {formatPrice(p.mrp)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  Your Showroom Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. 118500"
                  className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  Physical In-Stock Count *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newStockCount}
                  onChange={(e) => setNewStockCount(e.target.value)}
                  className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                Warranty & Local Store Perks
              </label>
              <input
                type="text"
                value={newWarranty}
                onChange={(e) => setNewWarranty(e.target.value)}
                placeholder="e.g. 1 Year Official Warranty + Complimentary Screen Protector"
                className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
              />
            </div>

            <div className="pt-2 border-t border-[var(--atelier-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--atelier-muted)]">
                Listing updates with live timestamp.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--atelier-bronze)] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px] hover:bg-[var(--atelier-bronze-hover)] transition-colors"
              >
                Publish Live In-Store Offer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
