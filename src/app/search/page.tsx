'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search as SearchIcon,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  Check,
  RotateCcw,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { CATEGORIES } from '@/lib/mockData';
import { ProductCard } from '@/components/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const { products, userLocation, getBestPriceForProduct, calculateDistance } = usePlatform();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name'>('price_asc');
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Text Search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchModel = p.modelNumber.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchModel) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
        return false;
      }

      // 3. Brand
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // 4. In Stock & Distance
      const best = getBestPriceForProduct(p.id);
      if (onlyInStock && !best) {
        return false;
      }

      if (best && best.bestStore) {
        const dist = calculateDistance(best.bestStore.lat, best.bestStore.lng);
        if (dist > maxDistance) return false;
      }

      return true;
    }).sort((a, b) => {
      const bestA = getBestPriceForProduct(a.id)?.lowestPrice || a.mrp;
      const bestB = getBestPriceForProduct(b.id)?.lowestPrice || b.mrp;

      if (sortBy === 'price_asc') return bestA - bestB;
      if (sortBy === 'price_desc') return bestB - bestA;
      return a.name.localeCompare(b.name);
    });
  }, [
    products,
    query,
    selectedCategory,
    selectedBrand,
    maxDistance,
    onlyInStock,
    sortBy,
    getBestPriceForProduct,
    calculateDistance,
  ]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxDistance(15);
    setSortBy('price_asc');
    setOnlyInStock(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Location Banner */}
      <div className="border-b border-[var(--atelier-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--atelier-muted)] mb-1">
            <span>Catalogue Search</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[var(--atelier-text)] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[var(--atelier-bronze)]" />
              {userLocation.area}, Bangalore (Radius: {maxDistance} km)
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[var(--atelier-text)]">
            Canonical Electronics Index
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-[3px] border border-[var(--atelier-border)] text-xs font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 px-3 bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[3px] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
          >
            <option value="price_asc">Price: Lowest Local First</option>
            <option value="price_desc">Price: Highest First</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--atelier-border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)]">
              Refine Search
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-[var(--atelier-bronze)] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search within results */}
          <div>
            <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-2">
              Model or Keyword
            </label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--atelier-dim)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name..."
                className="w-full h-9 pl-9 pr-3 rounded-[3px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)] focus:outline-none focus:border-[var(--atelier-bronze)]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-2">
              Equipment Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[2px] transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] font-medium'
                    : 'text-[var(--atelier-muted)] hover:bg-[var(--atelier-subtle)]'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[2px] transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] font-medium'
                        : 'text-[var(--atelier-muted)] hover:bg-[var(--atelier-subtle)]'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-2">
              Manufacturer Brand
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[2px] transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-[var(--atelier-subtle)] text-[var(--atelier-text)] font-semibold border-l-2 border-[var(--atelier-bronze)]'
                    : 'text-[var(--atelier-muted)] hover:bg-[var(--atelier-subtle)]'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[2px] transition-colors ${
                    selectedBrand === b
                      ? 'bg-[var(--atelier-subtle)] text-[var(--atelier-text)] font-semibold border-l-2 border-[var(--atelier-bronze)]'
                      : 'text-[var(--atelier-muted)] hover:bg-[var(--atelier-subtle)]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Maximum Distance Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-[var(--atelier-muted)]">
                Store Proximity Radius
              </label>
              <span className="text-xs font-mono font-semibold text-[var(--atelier-text)]">
                Within {maxDistance} km
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-[var(--atelier-bronze)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--atelier-dim)] mt-1 font-mono">
              <span>2 km</span>
              <span>10 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* In-Stock Only */}
          <div className="pt-2 border-t border-[var(--atelier-border)]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--atelier-text)]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[var(--atelier-bronze)] rounded"
              />
              <span>In-stock verified units only</span>
            </label>
          </div>
        </aside>

        {/* Product Listing Main Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-[var(--atelier-muted)] pb-2 border-b border-[var(--atelier-border)]">
            <span>
              Showing <strong className="text-[var(--atelier-text)]">{filteredProducts.length}</strong> matching canonical models
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] space-y-4">
              <p className="font-serif text-xl text-[var(--atelier-text)]">
                No local electronics match the active filter criteria.
              </p>
              <p className="text-xs text-[var(--atelier-muted)] max-w-md mx-auto leading-relaxed">
                Try widening your proximity radius slider, clearing brand restrictions, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs font-medium uppercase tracking-wider rounded-[3px] hover:bg-[var(--atelier-bronze)] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in">
          <div className="w-full max-w-xs bg-[var(--atelier-surface)] p-6 ml-auto h-full overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--atelier-border)] pb-3">
              <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                Search Filters
              </h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-[var(--atelier-muted)]" />
              </button>
            </div>

            {/* Distance */}
            <div>
              <label className="text-xs font-medium text-[var(--atelier-muted)] block mb-1">
                Distance: {maxDistance} km
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-[var(--atelier-bronze)]"
              />
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 bg-[var(--atelier-bronze)] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px]"
            >
              Apply ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-serif">Loading search index...</div>}>
      <SearchContent />
    </Suspense>
  );
}
