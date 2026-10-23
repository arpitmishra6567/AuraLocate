'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Phone, Calendar, Clock, ArrowRight } from 'lucide-react';
import { CanonicalProduct, MerchantListing, Store, BookingReservation } from '@/types';
import { usePlatform } from '@/lib/store';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CanonicalProduct;
  listing: MerchantListing;
  store: Store;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  product,
  listing,
  store,
}) => {
  const { createReservation, formatPrice } = usePlatform();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryPreference, setDeliveryPreference] = useState<'pickup' | 'home_delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<BookingReservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);

    const reservation = createReservation({
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@auralocate.in',
      storeId: store.id,
      listingId: listing.id,
      canonicalProductId: product.id,
      agreedPrice: listing.sellingPrice,
      deliveryPreference,
      address: deliveryPreference === 'home_delivery' ? address : undefined,
      notes,
    });

    setIsSubmitting(false);
    setConfirmedReservation(reservation);
  };

  const handleClose = () => {
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] rounded-[4px] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedReservation ? (
          /* Confirmation State */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[var(--atelier-success-bg)] text-[var(--atelier-success)] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--atelier-bronze)] font-semibold block">
                Quote Reserved Successfully
              </span>
              <h3 className="font-serif text-2xl font-medium text-[var(--atelier-text)] mt-1">
                Booking Reference: {confirmedReservation.bookingNumber}
              </h3>
              <p className="text-xs text-[var(--atelier-muted)] mt-2">
                Held for 24 hours at <strong className="text-[var(--atelier-text)]">{store.name}</strong>.
              </p>
            </div>

            {/* Summary Details */}
            <div className="p-4 bg-[var(--atelier-subtle)] border border-[var(--atelier-border)] rounded-[3px] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--atelier-muted)]">Product:</span>
                <span className="font-medium text-[var(--atelier-text)]">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--atelier-muted)]">Locked In-Store Price:</span>
                <span className="font-serif text-base font-bold text-[var(--atelier-text)]">
                  {formatPrice(confirmedReservation.agreedPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--atelier-muted)]">Fulfillment:</span>
                <span className="font-medium text-[var(--atelier-text)] capitalize">
                  {confirmedReservation.deliveryPreference.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--atelier-muted)]">Store Location:</span>
                <span className="text-[var(--atelier-text)] text-right">{store.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--atelier-muted)]">Store Phone:</span>
                <a href={`tel:${store.phone}`} className="font-mono text-[var(--atelier-bronze)] font-semibold">
                  {store.phone}
                </a>
              </div>
            </div>

            <div className="p-3 bg-[var(--atelier-bronze-subtle)] border border-[var(--atelier-bronze)]/30 rounded-[3px] text-[11px] text-[var(--atelier-text)] text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--atelier-bronze)] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> Visit the store counter, quote <strong>{confirmedReservation.bookingNumber}</strong>, inspect the factory box seal, and pay directly via Card/UPI.
              </span>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs font-semibold uppercase tracking-wider rounded-[3px] hover:bg-[var(--atelier-bronze)] transition-colors"
            >
              Done & Return to Product
            </button>
          </div>
        ) : (
          /* Reservation Form */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-[2px] bg-[var(--atelier-bronze-subtle)] text-[var(--atelier-bronze)]">
                24hr Price Lock
              </span>
              <span className="text-xs text-[var(--atelier-muted)]">• Zero Deposit Required</span>
            </div>

            <h3 className="font-serif text-2xl font-medium text-[var(--atelier-text)]">
              Reserve for In-Store Pickup
            </h3>
            <p className="text-xs text-[var(--atelier-muted)] mt-1 mb-6">
              Lock in <strong className="text-[var(--atelier-text)]">{formatPrice(listing.sellingPrice)}</strong> for{' '}
              <strong className="text-[var(--atelier-text)]">{product.name}</strong> at {store.name}.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                    Mobile Phone * (For SMS/WhatsApp Confirmation)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                  />
                </div>
              </div>

              {/* Delivery Preference */}
              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  Fulfillment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryPreference('pickup')}
                    className={`p-3 rounded-[3px] border text-left text-xs transition-all ${
                      deliveryPreference === 'pickup'
                        ? 'border-[var(--atelier-bronze)] bg-[var(--atelier-subtle)] text-[var(--atelier-text)] font-semibold'
                        : 'border-[var(--atelier-border)] text-[var(--atelier-muted)]'
                    }`}
                  >
                    <div className="font-medium text-[var(--atelier-text)]">Physical Store Pickup</div>
                    <div className="text-[10px] text-[var(--atelier-dim)] mt-0.5">Ready in 30 mins (Free)</div>
                  </button>

                  <button
                    type="button"
                    disabled={!store.deliveryOffered}
                    onClick={() => setDeliveryPreference('home_delivery')}
                    className={`p-3 rounded-[3px] border text-left text-xs transition-all ${
                      deliveryPreference === 'home_delivery'
                        ? 'border-[var(--atelier-bronze)] bg-[var(--atelier-subtle)] text-[var(--atelier-text)] font-semibold'
                        : store.deliveryOffered
                        ? 'border-[var(--atelier-border)] text-[var(--atelier-muted)]'
                        : 'border-[var(--atelier-border)] opacity-50 cursor-not-allowed text-[var(--atelier-dim)]'
                    }`}
                  >
                    <div className="font-medium text-[var(--atelier-text)]">Store Home Delivery</div>
                    <div className="text-[10px] text-[var(--atelier-dim)] mt-0.5">
                      {store.deliveryOffered ? `Fee: ₹${store.deliveryFeeFlat || 0}` : 'Store Pickup Only'}
                    </div>
                  </button>
                </div>
              </div>

              {deliveryPreference === 'home_delivery' && (
                <div>
                  <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                    Delivery Address in Bangalore *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apartment, Street, Area, Bangalore..."
                    className="w-full p-2.5 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  Customer Note for Merchant (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Will come between 5 PM - 6 PM after office"
                  className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                />
              </div>

              {/* Price Freeze Assurance */}
              <div className="pt-2 border-t border-[var(--atelier-border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--atelier-muted)] font-medium block">
                    Total Due at Store
                  </span>
                  <span className="font-serif text-xl font-bold text-[var(--atelier-text)]">
                    {formatPrice(listing.sellingPrice + (deliveryPreference === 'home_delivery' ? (store.deliveryFeeFlat || 0) : 0))}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors flex items-center gap-2"
                >
                  <span>Confirm Reservation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
