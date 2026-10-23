import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Store, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuraLogo } from './AuraLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--atelier-surface)] border-t border-[var(--atelier-border)] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Value Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[var(--atelier-border)]">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-subtle)] flex items-center justify-center flex-shrink-0 text-[var(--atelier-bronze)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                100% Brand Sealed & Tested
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] mt-1 leading-relaxed">
                Walk into certified local showrooms. Verify the manufacturer seal, IMEI, and test the screen before hand-off.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-subtle)] flex items-center justify-center flex-shrink-0 text-[var(--atelier-bronze)]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                Local Shopkeeper Direct Pricing
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] mt-1 leading-relaxed">
                No middleman marketplace cut. Local retailers compete directly on stock availability, bundle deals, and personal service.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-subtle)] flex items-center justify-center flex-shrink-0 text-[var(--atelier-bronze)]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-[var(--atelier-text)]">
                Instant Same-Day Takeaway
              </h4>
              <p className="text-xs text-[var(--atelier-muted)] mt-1 leading-relaxed">
                Zero waiting for courier delivery or dealing with shipping damage. Hold stock for 24 hours with one click.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[var(--atelier-border)]">
          <div>
            <AuraLogo size="md" className="mb-3" />
            <p className="text-xs text-[var(--atelier-muted)] leading-relaxed mb-4">
              An editorial discovery & price verification index connecting discerning buyers with verified electronics retailers across Bangalore.
            </p>
            <div className="text-[11px] text-[var(--atelier-dim)]">
              Operational Hub: Indiranagar, Bangalore - 560038
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)] mb-3">
              Electronics Categories
            </h5>
            <ul className="space-y-2 text-xs text-[var(--atelier-muted)]">
              <li><Link href="/search?category=smartphones" className="hover:text-[var(--atelier-bronze)]">Flagship 5G Smartphones</Link></li>
              <li><Link href="/search?category=smart-tvs" className="hover:text-[var(--atelier-bronze)]">4K OLED & Cinema Screens</Link></li>
              <li><Link href="/search?category=washing-machines" className="hover:text-[var(--atelier-bronze)]">AI Inverter Front Load Washers</Link></li>
              <li><Link href="/search?category=refrigerators" className="hover:text-[var(--atelier-bronze)]">Double Door Frost-Free Fridges</Link></li>
              <li><Link href="/search?category=laptops" className="hover:text-[var(--atelier-bronze)]">Pro Ultrabooks & Workstations</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)] mb-3">
              Retailer Network
            </h5>
            <ul className="space-y-2 text-xs text-[var(--atelier-muted)]">
              <li><Link href="/merchant" className="hover:text-[var(--atelier-bronze)]">Merchant Workspace Login</Link></li>
              <li><Link href="/merchant" className="hover:text-[var(--atelier-bronze)]">Register an Offline Electronics Store</Link></li>
              <li><Link href="/shop/digital-oasis-indiranagar" className="hover:text-[var(--atelier-bronze)]">Sample Digital Storefront</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--atelier-bronze)]">Merchant Verification Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-text)] mb-3">
              Trust & Transparency
            </h5>
            <ul className="space-y-2 text-xs text-[var(--atelier-muted)]">
              <li><span className="text-[var(--atelier-muted)]">Real-time Timestamp Badging</span></li>
              <li><span className="text-[var(--atelier-muted)]">Zero Commission Policy</span></li>
              <li><span className="text-[var(--atelier-muted)]">Price Reporting & Discrepancy Audits</span></li>
              <li><Link href="/reservations" className="hover:text-[var(--atelier-bronze)]">Track Held Reservations</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--atelier-dim)] gap-4">
          <div>
            © {new Date().getFullYear()} AuraLocate. Designed for high-trust offline commerce.
          </div>
          <div className="flex gap-6">
            <span>Bangalore Pilot</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Local Purchase</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
