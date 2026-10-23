'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Store,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  Search,
} from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { Store as StoreType, PriceReport } from '@/types';

export default function AdminDashboardPage() {
  const {
    stores,
    products,
    listings,
    reservations,
    reports,
    toggleStoreVerification,
    updateReportStatus,
    formatPrice,
  } = usePlatform();

  const [activeAdminTab, setActiveAdminTab] = useState<'stores' | 'reports' | 'catalogue'>('stores');
  const [storeSearch, setStoreSearch] = useState('');

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.area.toLowerCase().includes(storeSearch.toLowerCase())
  );

  const pendingReportsCount = reports.filter((r) => r.status === 'open' || r.status === 'investigating').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. ADMIN HEADER */}
      <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[var(--atelier-text)] text-[var(--atelier-surface)] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[var(--atelier-bronze)]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--atelier-bronze)]">
                Platform Governance & Compliance
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--atelier-text)]">
                AuraLocate Administration Console
              </h1>
              <p className="text-xs text-[var(--atelier-muted)] mt-0.5">
                Bangalore pilot retail verification, price discrepancy disputes, and catalogue moderation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-[2px] bg-[var(--atelier-subtle)] border border-[var(--atelier-border)] text-xs font-mono text-[var(--atelier-text)]">
              Admin Role: SUPER_AUDITOR
            </span>
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--atelier-border)]">
          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Total Onboarded Stores
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-text)]">
              {stores.length} Retailers
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Verified Merchant Ratio
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-success)]">
              {Math.round((stores.filter((s) => s.isVerified).length / stores.length) * 100)}%
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Canonical Products
            </span>
            <span className="font-serif text-2xl font-bold text-[var(--atelier-text)]">
              {products.length} Models
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[var(--atelier-muted)] uppercase tracking-wider block">
              Open Price Disputes
            </span>
            <span className={`font-serif text-2xl font-bold ${pendingReportsCount > 0 ? 'text-amber-600' : 'text-[var(--atelier-text)]'}`}>
              {pendingReportsCount} Audits
            </span>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTROLS */}
      <div className="flex border-b border-[var(--atelier-border)] gap-6 text-sm">
        <button
          onClick={() => setActiveAdminTab('stores')}
          className={`pb-3 font-serif font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeAdminTab === 'stores'
              ? 'border-[var(--atelier-bronze)] text-[var(--atelier-text)] font-semibold'
              : 'border-transparent text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Merchant Showrooms & Verification ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`pb-3 font-serif font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeAdminTab === 'reports'
              ? 'border-[var(--atelier-bronze)] text-[var(--atelier-text)] font-semibold'
              : 'border-transparent text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Price Discrepancy Audits ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('catalogue')}
          className={`pb-3 font-serif font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
            activeAdminTab === 'catalogue'
              ? 'border-[var(--atelier-bronze)] text-[var(--atelier-text)] font-semibold'
              : 'border-transparent text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Canonical Catalogue Standards ({products.length})</span>
        </button>
      </div>

      {/* 3. TAB PANELS */}

      {/* TAB A: MERCHANT VERIFICATION MANAGEMENT */}
      {activeAdminTab === 'stores' && (
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden shadow-sm">
          <div className="p-4 bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)]">
              Retailer Verification Queue
            </span>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--atelier-dim)]" />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Search shop or owner..."
                className="w-full h-8 pl-8 pr-3 rounded-[2px] bg-[var(--atelier-surface)] border border-[var(--atelier-border)] text-xs text-[var(--atelier-text)]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--atelier-surface)] border-b border-[var(--atelier-border)] text-[11px] font-semibold uppercase tracking-wider text-[var(--atelier-muted)]">
                  <th className="py-3 px-5">Showroom Name & Proprietor</th>
                  <th className="py-3 px-5">Location & Area</th>
                  <th className="py-3 px-5">Listed Inventory</th>
                  <th className="py-3 px-5">Verification State</th>
                  <th className="py-3 px-5 text-right">Moderation Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--atelier-border)] text-xs">
                {filteredStores.map((store) => {
                  const storeListingCount = listings.filter((l) => l.storeId === store.id).length;

                  return (
                    <tr key={store.id} className="hover:bg-[var(--atelier-subtle)]/40 transition-colors">
                      <td className="py-4 px-5">
                        <Link href={`/shop/${store.slug}`} className="font-serif font-semibold text-sm text-[var(--atelier-text)] hover:text-[var(--atelier-bronze)]">
                          {store.name}
                        </Link>
                        <div className="text-[11px] text-[var(--atelier-muted)] mt-0.5">
                          Owner: {store.ownerName} • Phone: {store.phone}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-[var(--atelier-muted)]">
                        <div>{store.address}</div>
                        <div className="text-[11px] text-[var(--atelier-dim)]">{store.city} - {store.pincode}</div>
                      </td>

                      <td className="py-4 px-5 font-mono text-[var(--atelier-text)]">
                        {storeListingCount} models active
                      </td>

                      <td className="py-4 px-5">
                        {store.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--atelier-success)] bg-[var(--atelier-success-bg)] px-2 py-0.5 rounded-[2px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Showroom
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-[2px]">
                            <Clock className="w-3 h-3" />
                            Pending Admin Audit
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => toggleStoreVerification(store.id)}
                          className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors ${
                            store.isVerified
                              ? 'border border-[var(--atelier-border)] text-[var(--atelier-muted)] hover:text-red-500 hover:border-red-500'
                              : 'bg-[var(--atelier-bronze)] text-white hover:bg-[var(--atelier-bronze-hover)]'
                          }`}
                        >
                          {store.isVerified ? 'Revoke Badge' : 'Grant Verified Badge'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB B: PRICE DISCREPANCY AUDITS */}
      {activeAdminTab === 'reports' && (
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] overflow-hidden shadow-sm">
          <div className="p-4 bg-[var(--atelier-subtle)] border-b border-[var(--atelier-border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)]">
              Customer Offline Price Discrepancy Reports
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--atelier-muted)]">
              No price discrepancy reports logged by customers.
            </div>
          ) : (
            <div className="divide-y divide-[var(--atelier-border)]">
              {reports.map((report) => {
                const store = stores.find((s) => s.id === report.storeId);
                const product = products.find((p) => p.id === report.canonicalProductId);

                return (
                  <div key={report.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--atelier-subtle)]/30 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${
                          report.status === 'open'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : report.status === 'resolved'
                            ? 'bg-[var(--atelier-success-bg)] text-[var(--atelier-success)]'
                            : 'bg-[var(--atelier-subtle)] text-[var(--atelier-muted)]'
                        }`}>
                          Status: {report.status}
                        </span>
                        <span className="font-serif font-semibold text-base text-[var(--atelier-text)]">
                          {store?.name}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--atelier-muted)]">
                        Product: <strong className="text-[var(--atelier-text)]">{product?.name}</strong> • Reported by: {report.customerName} ({report.customerPhone})
                      </div>

                      <div className="text-xs p-2.5 bg-[var(--atelier-subtle)] rounded-[2px] border border-[var(--atelier-border)] text-[var(--atelier-text)]">
                        <strong>Customer Comment:</strong> "{report.comments}"
                      </div>

                      <div className="text-[11px] text-[var(--atelier-dim)]">
                        Reported Offline Quote: <strong className="text-red-500 font-serif text-sm">{formatPrice(report.reportedPrice)}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status !== 'resolved' && (
                        <button
                          onClick={() => updateReportStatus(report.id, 'resolved')}
                          className="px-3.5 py-1.5 bg-[var(--atelier-success)] text-white text-xs font-semibold rounded-[2px] hover:opacity-90"
                        >
                          Resolve & Correct Listing
                        </button>
                      )}
                      {report.status !== 'dismissed' && (
                        <button
                          onClick={() => updateReportStatus(report.id, 'dismissed')}
                          className="px-3 py-1.5 border border-[var(--atelier-border)] text-xs text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] rounded-[2px]"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB C: CANONICAL CATALOGUE AUDIT */}
      {activeAdminTab === 'catalogue' && (
        <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--atelier-border)] pb-3">
            <div>
              <h3 className="font-serif text-xl font-medium text-[var(--atelier-text)]">
                Canonical Electronics Standard Models ({products.length})
              </h3>
              <p className="text-xs text-[var(--atelier-muted)]">
                Strict single canonical entity per model prevents fragmented duplicates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => {
              const matchedListings = listings.filter((l) => l.canonicalProductId === p.id);
              return (
                <div key={p.id} className="p-4 bg-[var(--atelier-subtle)] rounded-[3px] border border-[var(--atelier-border)] flex items-start gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-contain" />
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-[var(--atelier-bronze)]">{p.brand}</span>
                    <h4 className="font-serif text-sm font-semibold text-[var(--atelier-text)]">{p.name}</h4>
                    <div className="text-[11px] text-[var(--atelier-muted)] font-mono">Model: {p.modelNumber} • MRP: {formatPrice(p.mrp)}</div>
                    <div className="text-[11px] text-[var(--atelier-success)] font-medium mt-1">
                      {matchedListings.length} local shop quotes linked
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
