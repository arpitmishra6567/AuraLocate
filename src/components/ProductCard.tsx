'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store, ChevronRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { CanonicalProduct } from '@/types';
import { usePlatform } from '@/lib/store';

export const ProductCard: React.FC<{ product: CanonicalProduct }> = ({ product }) => {
  const { getBestPriceForProduct, formatPrice, calculateDistance } = usePlatform();
  const bestInfo = getBestPriceForProduct(product.id);

  const lowestPrice = bestInfo ? bestInfo.lowestPrice : product.mrp;
  const storeCount = bestInfo ? bestInfo.storeCount : 0;
  const discountPercent = Math.round(((product.mrp - lowestPrice) / product.mrp) * 100);

  const nearestDistance =
    bestInfo && bestInfo.bestStore
      ? calculateDistance(bestInfo.bestStore.lat, bestInfo.bestStore.lng)
      : null;

  return (
    <div className="group bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden flex flex-col hover:border-[var(--atelier-bronze)] hover:shadow-lg transition-all duration-300">
      
      {/* Product Image Frame */}
      <Link href={`/product/${product.id}`} className="relative h-56 bg-[var(--atelier-subtle)] flex items-center justify-center p-6 overflow-hidden border-b border-[var(--atelier-border)]">
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-[10px] font-semibold uppercase tracking-wider rounded-[2px]">
            Save {discountPercent}%
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[var(--atelier-surface)]/90 backdrop-blur-sm border border-[var(--atelier-border)] text-[10px] font-medium text-[var(--atelier-text)] rounded-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--atelier-success)]" />
          <span>In Stock</span>
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="max-h-44 max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Brand & Model */}
        <div className="flex items-center justify-between text-xs text-[var(--atelier-muted)] mb-1">
          <span className="font-semibold uppercase tracking-wider text-[var(--atelier-bronze)]">
            {product.brand}
          </span>
          <span className="font-mono text-[11px] text-[var(--atelier-dim)]">
            {product.modelNumber}
          </span>
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`} className="block mb-3">
          <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)] group-hover:text-[var(--atelier-bronze)] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Highlight Spec Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Object.entries(product.specs)
            .slice(0, 2)
            .map(([key, val]) => (
              <span
                key={key}
                className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[var(--atelier-subtle)] text-[var(--atelier-muted)] border border-[var(--atelier-border)]"
              >
                {val}
              </span>
            ))}
        </div>

        {/* Pricing & Local Stores Summary */}
        <div className="mt-auto pt-4 border-t border-[var(--atelier-border)]">
          <div className="flex items-baseline justify-between mb-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--atelier-muted)] font-medium block">
                Lowest Local Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-semibold text-[var(--atelier-text)]">
                  {formatPrice(lowestPrice)}
                </span>
                {lowestPrice < product.mrp && (
                  <span className="text-xs text-[var(--atelier-dim)] line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--atelier-bronze)] bg-[var(--atelier-bronze-subtle)] px-2 py-1 rounded-[2px]">
                <Store className="w-3 h-3" />
                {storeCount} {storeCount === 1 ? 'Store' : 'Stores'}
              </span>
            </div>
          </div>

          {nearestDistance !== null && (
            <div className="flex items-center gap-1 text-[11px] text-[var(--atelier-muted)] mt-1 mb-3">
              <MapPin className="w-3 h-3 text-[var(--atelier-dim)]" />
              <span>Nearest verified shop: <strong className="text-[var(--atelier-text)]">{nearestDistance} km away</strong></span>
            </div>
          )}

          {/* Action Button */}
          <Link
            href={`/product/${product.id}`}
            className="w-full h-10 rounded-[3px] bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-xs font-medium tracking-wide uppercase flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>Compare Live Quotes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
