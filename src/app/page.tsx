'use client';

/**
 * ============================================================================
 * AuraLocate — Main Homepage Experience
 * ============================================================================
 * 
 * Architectural Overview:
 * This page serves as the primary entry point for consumers and retailers in Bangalore.
 * It is structured around an "Editorial Discovery & Interactive Price Index" philosophy:
 * 
 * 1. HERO & REAL-TIME SEARCH:
 *    - Instant model discovery with canonical auto-suggestions.
 *    - Live system status metrics (active stores, indexed models, average savings).
 * 
 * 2. INTERACTIVE SAVINGS SIMULATOR (Online vs. AuraLocate):
 *    - Allows users to compare total cost, wait time, and delivery risk
 *      between traditional e-commerce and certified local showrooms.
 * 
 * 3. INTERACTIVE NEIGHBORHOOD EXPLORER:
 *    - Dynamic area hub selector (Indiranagar, Koramangala, HSR Layout, etc.)
 *      that dynamically recalculates geodesic store distances.
 * 
 * 4. DYNAMIC CATEGORY SHOWCASE:
 *    - Client-side filtered showcase of verified canonical electronics with
 *      instant category switching.
 * 
 * 5. COMPREHENSIVE ABOUT AURALOCATE SECTION:
 *    - In-depth, illustrative breakdown of why offline-first local commerce
 *      beats online delivery for high-ticket electronics (genuine seal inspection,
 *      zero marketplace commission, same-day immediate takeaway).
 * 
 * 6. INTERACTIVE 4-STEP WORKFLOW:
 *    - Visual walkthrough of how customers discover, reserve, inspect, and purchase.
 * 
 * 7. FEATURED BANGALORE RETAIL GUILD:
 *    - Certified brick-and-mortar storefronts with real showroom images and links.
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  ShieldCheck,
  Store,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Building2,
  Box,
  Truck,
  Percent,
  Check,
  AlertTriangle,
  Zap,
  Info,
  BadgeCheck,
  ArrowUpRight,
  RefreshCw,
  Award,
  Users,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { CATEGORIES } from '@/lib/mockData';
import { ProductCard } from '@/components/ProductCard';

export default function HomePage() {
  const router = useRouter();
  const {
    products,
    stores,
    listings,
    userLocation,
    setUserLocation,
    calculateDistance,
    formatPrice,
    getPriceFreshness,
    getBestPriceForProduct,
  } = usePlatform();

  // State: Hero Search Input
  const [heroSearch, setHeroSearch] = useState('');

  // State: Active Category Tab for Interactive Product Showcase
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');

  // State: Interactive Price Savings Simulator Selected Product ID
  const [selectedSimulatorProductId, setSelectedSimulatorProductId] = useState<string>('prod-iphone15-promax');

  // State: Interactive About Section Active Tab ('consumer' | 'merchant' | 'anti-counterfeit')
  const [activeAboutTab, setActiveAboutTab] = useState<'consumer' | 'merchant' | 'trust'>('consumer');

  /**
   * Handle Search Form Submission
   * Redirects user to the full catalogue search page with search query parameter.
   */
  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  /**
   * Popular Bangalore Retail Hubs for Interactive Area Switcher
   */
  const BANGALORE_HUBS = [
    { city: 'Bangalore', area: 'Indiranagar', pincode: '560038', lat: 12.9719, lng: 77.6412 },
    { city: 'Bangalore', area: 'Koramangala', pincode: '560034', lat: 12.9352, lng: 77.6245 },
    { city: 'Bangalore', area: 'HSR Layout', pincode: '560102', lat: 12.9115, lng: 77.6450 },
    { city: 'Bangalore', area: 'Jayanagar', pincode: '560041', lat: 12.9299, lng: 77.5838 },
    { city: 'Bangalore', area: 'Whitefield', pincode: '560066', lat: 12.9712, lng: 77.7214 },
    { city: 'Bangalore', area: 'Malleshwaram', pincode: '560003', lat: 13.0031, lng: 77.5701 },
  ];

  /**
   * Filtered products based on active interactive category tab
   */
  const filteredProducts = useMemo(() => {
    if (activeCategorySlug === 'all') return products.slice(0, 6);
    return products.filter((p) => p.categorySlug === activeCategorySlug).slice(0, 6);
  }, [products, activeCategorySlug]);

  /**
   * Recent price updates feed (Top 4 most recent merchant updates)
   */
  const recentListings = useMemo(() => {
    return [...listings]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 4);
  }, [listings]);

  /**
   * Active Product selected for the Interactive Savings Simulator
   */
  const simulatorProduct = useMemo(() => {
    return products.find((p) => p.id === selectedSimulatorProductId) || products[0];
  }, [products, selectedSimulatorProductId]);

  /**
   * Compute lowest local quoted price for the simulator product
   */
  const simulatorBestPrice = useMemo(() => {
    if (!simulatorProduct) return null;
    return getBestPriceForProduct(simulatorProduct.id);
  }, [simulatorProduct, getBestPriceForProduct]);

  // Online estimated retail price (MRP baseline or slight discount typical of e-commerce)
  const onlinePrice = simulatorProduct?.mrp || 0;
  const localPrice = simulatorBestPrice?.lowestPrice || Math.round(onlinePrice * 0.92);
  const potentialSavings = Math.max(0, onlinePrice - localPrice);
  const savingsPercent = Math.round((potentialSavings / onlinePrice) * 100);

  return (
    <div className="space-y-24 pb-24">
      
      {/* =========================================================================
          SECTION 1: EDITORIAL HERO & INTELLIGENT SEARCH BAR
          ========================================================================= */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-[var(--atelier-border)] bg-[var(--atelier-subtle)]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl">
            {/* Real-time Location Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-[var(--atelier-border)] bg-[var(--atelier-surface)] text-xs text-[var(--atelier-muted)] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--atelier-bronze)] animate-pulse" />
              <span className="font-medium text-[var(--atelier-text)]">Bangalore Offline Price Index</span>
              <span className="text-[var(--atelier-dim)]">•</span>
              <span>Hub: <strong className="text-[var(--atelier-bronze)] font-semibold">{userLocation.area} ({userLocation.pincode})</strong></span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[var(--atelier-text)] leading-[1.12]">
              Real-time In-Store Prices From Certified Local Retailers.
            </h1>

            {/* Sub-headline / Mission statement */}
            <p className="mt-6 text-base sm:text-lg text-[var(--atelier-muted)] leading-relaxed max-w-2xl font-normal">
              Skip the 4-day courier wait and unboxing anxieties. Compare exact canonical models, inspect sealed boxes in person, and unlock exclusive counter quotes from licensed electronics showrooms near you.
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleHeroSearchSubmit} className="mt-8 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-[var(--atelier-surface)] border-2 border-[var(--atelier-border)] rounded-[4px] shadow-lg focus-within:border-[var(--atelier-bronze)] transition-all">
                <div className="flex-1 flex items-center pl-3">
                  <Search className="w-5 h-5 text-[var(--atelier-dim)] flex-shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search Galaxy S24, Sony Bravia OLED, LG Washer, Daikin AC..."
                    className="w-full h-12 px-3 bg-transparent text-sm text-[var(--atelier-text)] placeholder-[var(--atelier-dim)] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 px-8 bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-xs font-semibold tracking-wider uppercase rounded-[3px] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Search Local</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Category Discovery Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--atelier-muted)]">
              <span className="font-medium text-[var(--atelier-text)]">Popular Searches:</span>
              <Link href="/search?category=smartphones" className="px-2.5 py-1 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] hover:border-[var(--atelier-bronze)] hover:text-[var(--atelier-text)] transition-colors">
                Flagship 5G Phones
              </Link>
              <Link href="/search?category=smart-tvs" className="px-2.5 py-1 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] hover:border-[var(--atelier-bronze)] hover:text-[var(--atelier-text)] transition-colors">
                Sony OLED 55"
              </Link>
              <Link href="/search?category=air-conditioners" className="px-2.5 py-1 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] hover:border-[var(--atelier-bronze)] hover:text-[var(--atelier-text)] transition-colors">
                Daikin 1.5T 5-Star AC
              </Link>
              <Link href="/search?category=washing-machines" className="px-2.5 py-1 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] hover:border-[var(--atelier-bronze)] hover:text-[var(--atelier-text)] transition-colors">
                LG 9kg Steam Washer
              </Link>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-[var(--atelier-border)] grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--atelier-text)]">
                {products.length}
              </div>
              <div className="text-xs text-[var(--atelier-muted)] mt-0.5">
                Canonical Specs Indexed
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--atelier-bronze)]">
                {stores.length}
              </div>
              <div className="text-xs text-[var(--atelier-muted)] mt-0.5">
                Verified Bangalore Stores
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--atelier-text)]">
                0%
              </div>
              <div className="text-xs text-[var(--atelier-muted)] mt-0.5">
                Marketplace Commission
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[var(--atelier-success)]">
                ₹12,400
              </div>
              <div className="text-xs text-[var(--atelier-muted)] mt-0.5">
                Average Local Savings
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 2: INTERACTIVE SAVINGS SIMULATOR (Online vs AuraLocate Local)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[6px] p-6 sm:p-10 shadow-sm">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-1">
              Interactive Price & Risk Calculator
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--atelier-text)]">
              Online Marketplace vs. Certified Local Showroom
            </h2>
            <p className="text-xs sm:text-sm text-[var(--atelier-muted)] mt-1">
              Select any flagship model below to test true delivered cost, turnaround time, and counterfeit risks.
            </p>
          </div>

          {/* Device Selector Buttons */}
          <div className="flex flex-wrap gap-2 pb-6 border-b border-[var(--atelier-border)]">
            {[
              { id: 'prod-iphone15-promax', label: 'iPhone 15 Pro Max' },
              { id: 'prod-s24-ultra', label: 'Samsung S24 Ultra' },
              { id: 'prod-sony-bravia-oled', label: 'Sony Bravia 55" OLED' },
              { id: 'prod-daikin-ac-15t', label: 'Daikin 1.5T 5-Star AC' },
              { id: 'prod-macbook-pro-m3', label: 'MacBook Pro 14" M3' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSimulatorProductId(item.id)}
                className={`px-3.5 py-1.5 rounded-[3px] text-xs font-medium transition-all ${
                  selectedSimulatorProductId === item.id
                    ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] font-semibold shadow-sm'
                    : 'bg-[var(--atelier-subtle)] text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] border border-[var(--atelier-border)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Side-by-Side Comparison Stage */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Product Visual Thumbnail */}
            <div className="lg:col-span-4 bg-[var(--atelier-subtle)]/60 border border-[var(--atelier-border)] rounded-[4px] p-6 flex flex-col items-center text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--atelier-bronze)] font-semibold mb-2">
                {simulatorProduct.brand} • {simulatorProduct.modelNumber}
              </span>
              <img
                src={simulatorProduct.image}
                alt={simulatorProduct.name}
                className="max-h-40 max-w-full object-contain filter drop-shadow-md my-3"
              />
              <h3 className="font-serif text-base font-medium text-[var(--atelier-text)] line-clamp-1">
                {simulatorProduct.name}
              </h3>
              <p className="text-xs text-[var(--atelier-muted)] mt-1">
                Official MRP: {formatPrice(simulatorProduct.mrp)}
              </p>
            </div>

            {/* Right: Comparative Breakdown Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Traditional E-Commerce Marketplace */}
              <div className="p-5 rounded-[4px] border border-[var(--atelier-border)] bg-[var(--atelier-subtle)]/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--atelier-border)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-muted)] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[var(--atelier-dim)]" />
                    Online Marketplace
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
                    3 - 5 Days Wait
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-[var(--atelier-dim)] font-medium">Typical Cart Price</div>
                  <div className="font-serif text-2xl font-semibold text-[var(--atelier-text)]">
                    {formatPrice(onlinePrice)}
                  </div>
                </div>

                <ul className="text-xs text-[var(--atelier-muted)] space-y-2 pt-2 border-t border-[var(--atelier-border)]">
                  <li className="flex items-start gap-2 text-rose-500/90 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Courier drop risk (open box delivery friction & return disputes)</span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--atelier-muted)]">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--atelier-dim)]" />
                    <span>Waiting for delivery slot; cannot inspect screen pixels prior to payment</span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--atelier-muted)]">
                    <Percent className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--atelier-dim)]" />
                    <span>Includes 12-18% platform commission baked into merchant margin</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Certified Local Store via AuraLocate */}
              <div className="p-5 rounded-[4px] border-2 border-[var(--atelier-bronze)] bg-[var(--atelier-surface)] space-y-4 relative shadow-md">
                <div className="absolute -top-3 right-4 px-2 py-0.5 bg-[var(--atelier-bronze)] text-white text-[10px] font-bold uppercase tracking-wider rounded-[2px]">
                  Recommended
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[var(--atelier-border)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-bronze)] flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[var(--atelier-bronze)]" />
                    AuraLocate Showroom
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--atelier-success-bg)] text-[var(--atelier-success)] border border-[var(--atelier-success)]/30 font-bold">
                    Immediate Takeaway
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-[var(--atelier-dim)] font-medium">Verified Counter Quote</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[var(--atelier-text)]">
                      {formatPrice(localPrice)}
                    </span>
                    <span className="text-xs font-bold text-[var(--atelier-success)]">
                      Save {formatPrice(potentialSavings)} ({savingsPercent}%)
                    </span>
                  </div>
                </div>

                <ul className="text-xs text-[var(--atelier-text)] space-y-2 pt-2 border-t border-[var(--atelier-border)]">
                  <li className="flex items-start gap-2 font-medium text-[var(--atelier-success)]">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Inspect factory seal, IMEI & boot screen in person before payment</span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--atelier-muted)]">
                    <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--atelier-bronze)]" />
                    <span>Walk in today; lock price for 24h with zero advance deposit</span>
                  </li>
                  <li className="flex items-start gap-2 text-[var(--atelier-muted)]">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--atelier-bronze)]" />
                    <span>Direct tax invoice & manufacturer warranty support</span>
                  </li>
                </ul>

                <Link
                  href={`/product/${simulatorProduct.id}`}
                  className="mt-3 block w-full py-2.5 bg-[var(--atelier-text)] hover:bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-xs font-semibold uppercase tracking-wider rounded-[3px] text-center transition-colors"
                >
                  Compare Quotes for This Model →
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 3: INTERACTIVE NEIGHBORHOOD EXPLORER (Bangalore Area Switcher)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[var(--atelier-border)] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-1">
                Hyperlocal Geodesic Radius
              </span>
              <h2 className="font-serif text-2xl font-medium text-[var(--atelier-text)]">
                Select Your Bangalore Shopping District
              </h2>
              <p className="text-xs text-[var(--atelier-muted)] mt-1">
                Click any neighborhood hub to instantly recalculate shop distances and inventory availability.
              </p>
            </div>

            <div className="text-xs text-[var(--atelier-dim)] font-mono">
              Active Geo-Anchor: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
            </div>
          </div>

          {/* Interactive Hub Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BANGALORE_HUBS.map((hub) => {
              const isSelected = userLocation.area === hub.area;
              // Count stores within 8km of this hub
              const nearbyCount = stores.filter((s) => {
                const R = 6371;
                const dLat = (s.lat - hub.lat) * (Math.PI / 180);
                const dLng = (s.lng - hub.lng) * (Math.PI / 180);
                const a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(hub.lat * (Math.PI / 180)) *
                    Math.cos(s.lat * (Math.PI / 180)) *
                    Math.sin(dLng / 2) *
                    Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c <= 12;
              }).length;

              return (
                <button
                  key={hub.area}
                  onClick={() => setUserLocation(hub)}
                  className={`p-3.5 rounded-[3px] border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--atelier-bronze)] bg-[var(--atelier-subtle)] ring-1 ring-[var(--atelier-bronze)]'
                      : 'border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:border-[var(--atelier-bronze)]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[var(--atelier-bronze)]' : 'text-[var(--atelier-dim)]'}`} />
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-[var(--atelier-bronze)] text-white rounded font-bold uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-serif text-sm font-medium text-[var(--atelier-text)]">
                      {hub.area}
                    </div>
                    <div className="text-[11px] text-[var(--atelier-muted)] mt-0.5">
                      {hub.pincode} • {nearbyCount} Stores
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 4: RECENT LIVE PRICE VERIFICATION TICKER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[var(--atelier-border)] gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--atelier-bronze)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--atelier-bronze)]"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)]">
                Live Store Price Updates
              </span>
              <span className="text-xs text-[var(--atelier-muted)] hidden md:inline">
                (Verified by Bangalore merchant dashboards)
              </span>
            </div>
            <Link href="/search" className="text-xs text-[var(--atelier-bronze)] hover:underline font-serif italic">
              View all 25+ local deals →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentListings.map((l) => {
              const product = products.find((p) => p.id === l.canonicalProductId);
              const store = stores.find((s) => s.id === l.storeId);
              const freshness = getPriceFreshness(l.updatedAt);
              if (!product || !store) return null;

              return (
                <Link
                  key={l.id}
                  href={`/product/${product.id}`}
                  className="p-3 rounded-[3px] bg-[var(--atelier-subtle)] hover:border-[var(--atelier-bronze)] border border-transparent transition-all block group"
                >
                  <div className="text-[11px] text-[var(--atelier-muted)] flex justify-between items-center mb-1">
                    <span className="font-medium text-[var(--atelier-text)] truncate max-w-[150px]">{store.name}</span>
                    <span className="text-[10px] text-[var(--atelier-dim)]">{freshness.label}</span>
                  </div>
                  <div className="text-xs font-medium text-[var(--atelier-text)] group-hover:text-[var(--atelier-bronze)] transition-colors truncate">
                    {product.name}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-base font-semibold text-[var(--atelier-text)]">
                      {formatPrice(l.sellingPrice)}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--atelier-surface)] text-[var(--atelier-muted)] border border-[var(--atelier-border)]">
                      {l.stockCount} in stock
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 5: INTERACTIVE CATEGORY SHOWCASE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-1">
              Curated Electronics Index
            </span>
            <h2 className="font-serif text-3xl font-medium text-[var(--atelier-text)]">
              Flagship Equipment In Stock Nearby
            </h2>
            <p className="text-sm text-[var(--atelier-muted)] mt-1">
              Exact manufacturer models matched across competing Bangalore retailers.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--atelier-text)] hover:text-[var(--atelier-bronze)] transition-colors"
          >
            <span>Explore Complete Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[var(--atelier-border)] scrollbar-none">
          <button
            onClick={() => setActiveCategorySlug('all')}
            className={`px-4 py-2 rounded-[2px] text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeCategorySlug === 'all'
                ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] shadow-sm'
                : 'bg-[var(--atelier-surface)] text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] border border-[var(--atelier-border)]'
            }`}
          >
            All Categories ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.categorySlug === cat.slug).length;
            const isSelected = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-4 py-2 rounded-[2px] text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[var(--atelier-text)] text-[var(--atelier-surface)] shadow-sm'
                    : 'bg-[var(--atelier-surface)] text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] border border-[var(--atelier-border)]'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-[var(--atelier-subtle)] text-[var(--atelier-dim)]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 6: COMPREHENSIVE ABOUT AURALOCATE SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about">
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[6px] p-8 sm:p-12 shadow-sm">
          
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-1">
              About The Platform
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[var(--atelier-text)] leading-tight">
              Why AuraLocate Exists: Reimagining Offline High-Value Electronics.
            </h2>
            <p className="text-sm sm:text-base text-[var(--atelier-muted)] mt-3 leading-relaxed">
              When buying a ₹1,50,000 OLED TV, a premium split AC, or a flagship titanium smartphone, relying on courier vans and faceless algorithmic marketplaces introduces unneeded anxiety. AuraLocate restores trust by creating an open discovery bridge between buyers and certified offline shops.
            </p>
          </div>

          {/* Interactive About Sub-Tabs */}
          <div className="flex border-b border-[var(--atelier-border)] mb-8 gap-6 text-sm">
            <button
              onClick={() => setActiveAboutTab('consumer')}
              className={`pb-3 font-serif transition-colors relative ${
                activeAboutTab === 'consumer'
                  ? 'text-[var(--atelier-bronze)] font-semibold border-b-2 border-[var(--atelier-bronze)]'
                  : 'text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
              }`}
            >
              The Consumer Advantage
            </button>
            <button
              onClick={() => setActiveAboutTab('merchant')}
              className={`pb-3 font-serif transition-colors relative ${
                activeAboutTab === 'merchant'
                  ? 'text-[var(--atelier-bronze)] font-semibold border-b-2 border-[var(--atelier-bronze)]'
                  : 'text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
              }`}
            >
              Empowering Local Retailers
            </button>
            <button
              onClick={() => setActiveAboutTab('trust')}
              className={`pb-3 font-serif transition-colors relative ${
                activeAboutTab === 'trust'
                  ? 'text-[var(--atelier-bronze)] font-semibold border-b-2 border-[var(--atelier-bronze)]'
                  : 'text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
              }`}
            >
              Anti-Counterfeit & Warranty Proof
            </button>
          </div>

          {/* Dynamic Content based on Active About Tab */}
          {activeAboutTab === 'consumer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Touch, Unbox & Inspect First
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Never sign for a delivery box without opening it. In the physical showroom, you inspect the holographic seal, verify the IMEI on official manufacturer portals, and confirm pristine zero-defect screens before money changes hands.
                </p>
              </div>

              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Zero Delivery Waiting Time
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Need a replacement laptop for work or an air conditioner installed before the heat wave? Walk into your nearest verified neighborhood merchant and walk out with your device in under 30 minutes.
                </p>
              </div>

              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Competitive Shopkeeper Quotes
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Because offline merchants have zero 15% marketplace commission to pay, they pass aggressive counter discounts, bundled accessories, and zero-cost EMI plans directly on to you.
                </p>
              </div>
            </div>
          )}

          {activeAboutTab === 'merchant' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Zero Commission Digital Storefront
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Every certified merchant receives a dedicated digital showroom link (e.g., <code className="text-[11px] bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">auralocate.in/shop/your-store</code>) without paying any listing fees or per-transaction commissions.
                </p>
              </div>

              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Qualified Footfall & Direct Buyers
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Customers arrive at your billing counter with a specific model code and reservation slip. No window shoppers—just high-intent local buyers ready to take inventory home today.
                </p>
              </div>

              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Real-time Price Agility
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Update inventory, change selling prices, and accept holds straight from your smartphone via the merchant workspace in less than 30 seconds.
                </p>
              </div>
            </div>
          )}

          {activeAboutTab === 'trust' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Only GST-Registered Retailers
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Every showroom in the AuraLocate guild undergoes strict physical verification, GST verification, and official brand distributorship checks before listings go live.
                </p>
              </div>

              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Official India Brand Warranties
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  Every product comes with a full manufacturer tax invoice eligible for direct service center claims at Apple, Samsung, Sony, LG, Daikin, and Bosch nationwide.
                </p>
              </div>

              <div className="p-5 bg-[var(--atelier-subtle)]/40 border border-[var(--atelier-border)] rounded-[4px] space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] flex items-center justify-center text-[var(--atelier-bronze)]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)]">
                  Community Price Auditing
                </h3>
                <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                  If a shopkeeper quotes a different price in person than shown on AuraLocate, our 1-click Price Discrepancy reporting system flags the store for immediate administrative compliance review.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>


      {/* =========================================================================
          SECTION 7: HOW IT WORKS — HIGH-TRUST 4-STEP OFFLINE FLOW
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-8 sm:p-12">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-1">
              Transparent Commerce
            </span>
            <h2 className="font-serif text-3xl font-medium text-[var(--atelier-text)]">
              How Local Discovery Protects Your Electronics Purchase
            </h2>
            <p className="text-sm text-[var(--atelier-muted)] mt-2">
              Buying high-ticket electronics offline doesn't mean paying more. It means getting guaranteed genuine products today with zero transit risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="font-serif text-3xl font-light text-[var(--atelier-bronze)]">
                01.
              </div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                Discover Nearby Stock
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                Search exact canonical model numbers. View real-time listed prices from licensed shops within 5-10 km of your address.
              </p>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-3xl font-light text-[var(--atelier-bronze)]">
                02.
              </div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                Lock 24hr Reservation
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                Click "Reserve for Pickup". The merchant receives your request and sets aside the sealed box at the agreed price quote with ₹0 advance.
              </p>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-3xl font-light text-[var(--atelier-bronze)]">
                03.
              </div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                Inspect In Person
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                Visit the physical showroom. Check the factory seal, verify serial numbers on the brand portal, and inspect screen pixels with the dealer.
              </p>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-3xl font-light text-[var(--atelier-bronze)]">
                04.
              </div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                Pay Shopkeeper Directly
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] leading-relaxed">
                Pay via Card, UPI, or Store EMI directly at the billing counter. Walk home with your brand-new device immediately.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 8: VERIFIED BANGALORE RETAIL GUILD (Merchant Cards)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-1">
              Bangalore Retail Guild
            </span>
            <h2 className="font-serif text-3xl font-medium text-[var(--atelier-text)]">
              Featured Verified Stores
            </h2>
            <p className="text-sm text-[var(--atelier-muted)] mt-1">
              Licensed brick-and-mortar dealers maintaining active stock updates on AuraLocate.
            </p>
          </div>
          <Link
            href="/merchant"
            className="text-xs font-semibold text-[var(--atelier-bronze)] hover:underline flex items-center gap-1"
          >
            <span>Merchant Portal Login</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.slice(0, 3).map((store) => {
            const distance = calculateDistance(store.lat, store.lng);
            const storeListingCount = listings.filter((l) => l.storeId === store.id).length;

            return (
              <div
                key={store.id}
                className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden hover:border-[var(--atelier-bronze)] transition-all flex flex-col shadow-sm"
              >
                <div className="h-44 relative bg-[var(--atelier-subtle)] overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--atelier-surface)]/95 backdrop-blur-sm border border-[var(--atelier-border)] rounded-[2px] text-[10px] font-semibold text-[var(--atelier-bronze)]">
                    ★ {store.rating} ({store.reviewCount} reviews)
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-serif text-lg font-medium text-[var(--atelier-text)] leading-snug">
                      {store.name}
                    </h3>
                    {store.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--atelier-success)] bg-[var(--atelier-success-bg)] px-2 py-0.5 rounded-[2px] flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--atelier-muted)] mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--atelier-dim)] flex-shrink-0" />
                    <span>{store.address} • <strong className="text-[var(--atelier-text)]">{distance} km away</strong></span>
                  </p>

                  <div className="text-xs text-[var(--atelier-dim)] mb-4">
                    Owner: {store.ownerName} • Hours: {store.openingHours}
                  </div>

                  <div className="mt-auto pt-4 border-t border-[var(--atelier-border)] flex items-center justify-between">
                    <span className="text-xs text-[var(--atelier-muted)] font-mono">
                      {storeListingCount} In-Stock Listings
                    </span>
                    <Link
                      href={`/shop/${store.slug}`}
                      className="text-xs font-semibold text-[var(--atelier-bronze)] hover:underline flex items-center gap-1"
                    >
                      <span>Visit Showroom</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* =========================================================================
          SECTION 9: MERCHANT ONBOARDING CALLOUT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--atelier-text)] text-[var(--atelier-surface)] rounded-[4px] p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--atelier-bronze)] block mb-2">
              For Offline Shopkeepers & Retailers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
              Bring Your Physical Showroom Online in Under 5 Minutes.
            </h2>
            <p className="text-sm text-[var(--atelier-muted)] mt-4 leading-relaxed">
              No complex coding or integration fees. Get a dedicated shareable digital storefront (<code className="text-xs bg-black/30 px-1 py-0.5 rounded text-white font-mono">auralocate.in/shop/your-store</code>), update prices directly from your mobile phone, and receive customer reservations without any transaction commissions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/merchant"
                className="px-6 py-3 bg-[var(--atelier-bronze)] hover:bg-[var(--atelier-bronze-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors shadow-sm"
              >
                Open Free Merchant Storefront
              </Link>
              <Link
                href="/shop/digital-oasis-indiranagar"
                className="px-6 py-3 border border-[var(--atelier-border)]/40 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors"
              >
                View Live Merchant Demo
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-12 -bottom-12 opacity-10 select-none pointer-events-none text-white">
            <svg width="260" height="260" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="15" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M9 15C9 10.0294 13.0294 6 18 6C22.9706 6 27 10.0294 27 15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M18 8C14.134 8 11 11.134 11 15C11 19.8 18 28 18 28C18 28 25 19.8 25 15C25 11.134 21.866 8 18 8Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </section>

    </div>
  );
}
