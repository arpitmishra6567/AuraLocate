'use client';

import React, { useState } from 'react';
import { MapPin, X, Check, Navigation } from 'lucide-react';
import { usePlatform } from '@/lib/store';
import { UserLocation } from '@/types';

const BANGALORE_HUBS: UserLocation[] = [
  { city: 'Bangalore', area: 'Indiranagar', pincode: '560038', lat: 12.9719, lng: 77.6412 },
  { city: 'Bangalore', area: 'Koramangala', pincode: '560034', lat: 12.9352, lng: 77.6245 },
  { city: 'Bangalore', area: 'Domlur', pincode: '560071', lat: 12.9610, lng: 77.6387 },
  { city: 'Bangalore', area: 'MG Road', pincode: '560001', lat: 12.9756, lng: 77.6067 },
  { city: 'Bangalore', area: 'Jayanagar', pincode: '560011', lat: 12.9298, lng: 77.5824 },
  { city: 'Bangalore', area: 'Whitefield', pincode: '560066', lat: 12.9698, lng: 77.7500 },
];

export const LocationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { userLocation, setUserLocation } = usePlatform();
  const [customPincode, setCustomPincode] = useState('');

  if (!isOpen) return null;

  const handleSelect = (loc: UserLocation) => {
    setUserLocation(loc);
    onClose();
  };

  const handleDetectCurrent = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            city: 'Bangalore',
            area: 'Detected Location',
            pincode: '560038',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          onClose();
        },
        () => {
          // Fallback to Indiranagar
          handleSelect(BANGALORE_HUBS[0]);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--atelier-surface)] border border-[var(--atelier-border)] rounded-[4px] max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[var(--atelier-muted)] hover:text-[var(--atelier-text)] rounded-[4px] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[4px] bg-[var(--atelier-subtle)] flex items-center justify-center text-[var(--atelier-bronze)]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-[var(--atelier-text)]">
              Select Your Local Shopping Hub
            </h3>
            <p className="text-xs text-[var(--atelier-muted)]">
              Compare live in-store prices and stock availability within your radius.
            </p>
          </div>
        </div>

        <button
          onClick={handleDetectCurrent}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[4px] border border-[var(--atelier-bronze)] bg-[var(--atelier-bronze-subtle)] text-[var(--atelier-bronze)] hover:opacity-90 font-medium text-xs transition-opacity mb-4"
        >
          <Navigation className="w-4 h-4" />
          Use My Precise Geolocation
        </button>

        <div className="space-y-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--atelier-muted)] block mb-1">
            Bangalore Retail Neighborhoods
          </span>
          {BANGALORE_HUBS.map((loc) => {
            const isSelected = userLocation.area === loc.area;
            return (
              <button
                key={loc.area}
                onClick={() => handleSelect(loc)}
                className={`w-full flex items-center justify-between p-3 rounded-[4px] border text-left text-sm transition-all ${
                  isSelected
                    ? 'border-[var(--atelier-bronze)] bg-[var(--atelier-subtle)] text-[var(--atelier-text)] font-semibold'
                    : 'border-[var(--atelier-border)] hover:bg-[var(--atelier-subtle)] text-[var(--atelier-muted)] hover:text-[var(--atelier-text)]'
                }`}
              >
                <div>
                  <div className="font-medium">{loc.area}, Bangalore</div>
                  <div className="text-xs text-[var(--atelier-dim)]">Pincode: {loc.pincode}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[var(--atelier-bronze)]" />}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-center text-[var(--atelier-muted)]">
          Live prices and store pickup estimates will adapt automatically.
        </p>
      </div>
    </div>
  );
};
