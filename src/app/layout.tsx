import type { Metadata } from 'next';
import './globals.css';
import { PlatformProvider } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AuraLocate — Premium Local Electronics Discovery & Real-Time Price Comparison',
  description:
    'Compare real-time offline electronics prices across verified local retail shops in Bangalore. Inspect sealed products in person and reserve with zero markup.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--atelier-bg)] text-[var(--atelier-text)] selection:bg-[var(--atelier-bronze-subtle)]">
        <PlatformProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PlatformProvider>
      </body>
    </html>
  );
}
