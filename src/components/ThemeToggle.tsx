'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('auralocate_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;

    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('auralocate_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('auralocate_theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-[4px] border border-[var(--atelier-border)] bg-[var(--atelier-surface)] ${className}`} />
    );
  }

  return (
    <button
      onClick={toggle}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-[4px] border border-[var(--atelier-border)] bg-[var(--atelier-surface)] hover:bg-[var(--atelier-subtle)] text-[var(--atelier-text)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--atelier-bronze)] ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle visual theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[var(--atelier-bronze)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--atelier-muted)]" />
      )}
    </button>
  );
};
