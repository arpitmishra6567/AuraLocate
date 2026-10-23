'use client';

import React from 'react';

interface AuraLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Bespoke Aura Beacon Icon: Concentric Aura Waves + Location Pinpoint + Diamond Core */}
      <div
        className={`${iconSizeClasses} rounded-[4px] bg-[var(--atelier-text)] flex items-center justify-center relative overflow-hidden flex-shrink-0 group-hover:bg-[var(--atelier-bronze)] transition-colors duration-300 shadow-sm`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6"
        >
          {/* Subtle Outer Aura Ring */}
          <circle
            cx="18"
            cy="15"
            r="12"
            stroke="var(--atelier-bronze)"
            strokeWidth="1.25"
            strokeDasharray="2 2"
            className="opacity-60"
          />
          {/* Inner Radiant Aura Arc */}
          <path
            d="M9 15C9 10.0294 13.0294 6 18 6C22.9706 6 27 10.0294 27 15"
            stroke="var(--atelier-surface)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Stylized Precision Location Beacon / AL Pin */}
          <path
            d="M18 8C14.134 8 11 11.134 11 15C11 19.8 18 28 18 28C18 28 25 19.8 25 15C25 11.134 21.866 8 18 8Z"
            fill="var(--atelier-surface)"
            className="transition-colors"
          />
          {/* Core Jewel Aperture */}
          <circle
            cx="18"
            cy="14.5"
            r="3"
            fill="var(--atelier-bronze)"
          />
          {/* Base Anchor Indicator */}
          <circle
            cx="18"
            cy="31"
            r="1.25"
            fill="var(--atelier-bronze)"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="leading-tight">
          <span
            className={`font-serif ${textSizes} font-medium tracking-tight text-[var(--atelier-text)] block leading-none`}
          >
            AURA<span className="font-light italic text-[var(--atelier-bronze)] ml-1">Locate</span>
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--atelier-muted)] font-medium block mt-0.5">
            Verified Local Commerce
          </span>
        </div>
      )}
    </div>
  );
};
