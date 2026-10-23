'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CanonicalProduct, MerchantListing, Store } from '@/types';
import { usePlatform } from '@/lib/store';

interface PriceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CanonicalProduct;
  listing: MerchantListing;
  store: Store;
}

export const PriceReportModal: React.FC<PriceReportModalProps> = ({
  isOpen,
  onClose,
  product,
  listing,
  store,
}) => {
  const { createPriceReport, formatPrice } = usePlatform();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reportedPrice, setReportedPrice] = useState(listing.sellingPrice.toString());
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPriceReport({
      listingId: listing.id,
      storeId: store.id,
      canonicalProductId: product.id,
      customerName: customerName || 'Anonymous Customer',
      customerPhone: customerPhone || 'Not provided',
      reportedPrice: parseFloat(reportedPrice) || listing.sellingPrice,
      comments: comments || 'Merchant quoted higher price offline during visit.',
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] rounded-[4px] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--atelier-success-bg)] text-[var(--atelier-success)] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[var(--atelier-text)]">
              Price Discrepancy Logged
            </h3>
            <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
              Thank you for keeping local commerce transparent. Our administration team has flagged this listing for immediate audit with <strong className="text-[var(--atelier-text)]">{store.name}</strong>.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs font-semibold uppercase tracking-wider rounded-[3px]"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 text-[var(--atelier-bronze)]">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Price Integrity Audit
              </span>
            </div>

            <h3 className="font-serif text-2xl font-medium text-[var(--atelier-text)]">
              Report Price Discrepancy
            </h3>
            <p className="text-xs text-[var(--atelier-muted)] mt-1 mb-6 leading-relaxed">
              Did <strong className="text-[var(--atelier-text)]">{store.name}</strong> quote a different price or state that stock was unavailable for <strong className="text-[var(--atelier-text)]">{product.name}</strong>?
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-[var(--atelier-subtle)] rounded-[3px] border border-[var(--atelier-border)] text-xs">
                <span className="text-[var(--atelier-muted)]">Current Website Listed Price: </span>
                <span className="font-serif font-bold text-[var(--atelier-text)]">
                  {formatPrice(listing.sellingPrice)}
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  Actual Price Quoted Offline (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={reportedPrice}
                  onChange={(e) => setReportedPrice(e.target.value)}
                  placeholder="e.g. 122000"
                  className="w-full h-10 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                  What Happened? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g. Shopkeeper said the price increased this morning or stock was reserved for someone else..."
                  className="w-full p-2.5 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Name"
                    className="w-full h-9 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                    Your Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full h-9 px-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-[var(--atelier-border)] text-xs font-medium rounded-[3px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--atelier-bronze)] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px]"
                >
                  Submit Audit Report
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
