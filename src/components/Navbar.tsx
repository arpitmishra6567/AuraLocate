'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Store as StoreIcon,
  ShieldCheck,
  Bookmark,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { LocationModal } from './LocationModal';
import { AuraLogo } from './AuraLogo';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { userLocation, products, reservations } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  const filteredProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.modelNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const pendingReservationsCount = reservations.filter(
    (r) => r.status === 'pending' || r.status === 'confirmed'
  ).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push(`/product/${productId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--atelier-bg)]/95 backdrop-blur-md border-b border-[var(--atelier-border)] transition-colors">
        {/* Top Editorial Ribbon */}
        <div className="bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)] py-1.5 px-4 text-[11px] text-[var(--atelier-muted)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--atelier-bronze)]" />
              <span>Real-time in-store electronics price verification platform for Bangalore</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>Zero-fee offline retail network</span>
              <span>•</span>
              <span>Inspect sealed box in person before payment</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <AuraLogo size="md" />
          </Link>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--atelier-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search flagship phones, OLED TVs, model numbers (e.g. S24 Ultra, XR-55A80L)..."
                  className="w-full h-11 pl-10 pr-24 rounded-[4px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-sm text-[var(--atelier-text)] placeholder-[var(--atelier-dim)] focus:outline-none focus:border-[var(--atelier-bronze)] focus:ring-1 focus:ring-[var(--atelier-bronze)] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-[3px] bg-[var(--atelier-text)] text-[var(--atelier-surface)] text-xs font-medium hover:bg-[var(--atelier-bronze)] transition-colors"
                >
                  Compare
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showSuggestions && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] shadow-xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="px-3 py-2 bg-[var(--atelier-subtle)] text-[11px] font-semibold uppercase tracking-wider text-[var(--atelier-muted)] border-b border-[var(--atelier-border)]">
                  Canonical Products in Bangalore Stores
                </div>
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)]/50 last:border-b-0 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-[var(--atelier-text)]">{p.name}</div>
                      <div className="text-[11px] text-[var(--atelier-muted)] font-mono">
                        Model: {p.modelNumber} • {p.brand}
                      </div>
                    </div>
                    <span className="text-xs text-[var(--atelier-bronze)] font-serif italic">
                      Compare Prices →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Button */}
          <button
            onClick={() => setIsLocationOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-[4px] border border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:bg-[var(--atelier-subtle)] text-xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--atelier-bronze)]" />
            <div className="text-left leading-tight">
              <span className="text-[10px] text-[var(--atelier-muted)] block uppercase tracking-wider">
                Area Hub
              </span>
              <span className="font-semibold text-[var(--atelier-text)]">
                {userLocation.area}, {userLocation.city}
              </span>
            </div>
          </button>

          {/* Action Links & Portals */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/#about"
              className="hidden lg:inline-flex items-center text-xs font-medium text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] transition-colors px-2.5 py-1.5"
            >
              About
            </Link>

            <Link
              href="/reservations"
              className="relative p-2 text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] rounded-[4px] transition-colors"
              title="My Reservations"
            >
              <Bookmark className="w-4 h-4" />
              {pendingReservationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--atelier-bronze)] text-[var(--atelier-surface)] text-[9px] font-bold flex items-center justify-center">
                  {pendingReservationsCount}
                </span>
              )}
            </Link>

            <Link
              href="/merchant"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:bg-[var(--atelier-subtle)] text-xs font-medium text-[var(--atelier-text)] transition-colors"
            >
              <StoreIcon className="w-3.5 h-3.5 text-[var(--atelier-bronze)]" />
              <span>Merchant Workspace</span>
            </Link>

            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border border-[var(--atelier-border)] bg-[var(--atelier-subtle)] hover:border-[var(--atelier-bronze)] text-xs font-medium text-[var(--atelier-text)] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--atelier-text)]" />
              <span>Admin</span>
            </Link>

            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[var(--atelier-text)]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--atelier-border)] bg-[var(--atelier-surface)] p-4 space-y-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--atelier-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or models..."
                  className="w-full h-10 pl-9 pr-4 rounded-[4px] bg-[var(--atelier-subtle)] border border-[var(--atelier-border)] text-sm text-[var(--atelier-text)]"
                />
              </div>
            </form>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLocationOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-[4px] bg-[var(--atelier-subtle)] text-xs"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--atelier-bronze)]" />
                <span>Location: {userLocation.area}, Bangalore</span>
              </div>
              <span className="text-[var(--atelier-bronze)] font-semibold">Change</span>
            </button>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--atelier-border)]">
              <Link
                href="/#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center p-2 rounded-[4px] border border-[var(--atelier-border)] text-xs font-medium text-center"
              >
                About Platform
              </Link>
              <Link
                href="/merchant"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-[4px] border border-[var(--atelier-border)] text-xs font-medium"
              >
                <StoreIcon className="w-3.5 h-3.5" />
                Merchant Portal
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-[4px] border border-[var(--atelier-border)] text-xs font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </header>

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  );
};
