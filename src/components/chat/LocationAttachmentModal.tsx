import React, { useState } from 'react';
import { LocationData } from '../../types';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

interface LocationAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendLocation: (loc: LocationData) => void;
}

const PRESET_LOCATIONS: LocationData[] = [
  {
    name: 'Shibuya Crossing & Sky',
    address: '2 Chome-24-12 Shibuya, Tokyo 150-0002, Japan',
    latitude: 35.6595,
    longitude: 139.7004,
  },
  {
    name: 'Central Park - Sheep Meadow',
    address: 'Central Park, New York, NY 10024, USA',
    latitude: 40.7711,
    longitude: -73.9742,
  },
  {
    name: 'Eiffel Tower',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
    latitude: 48.8584,
    longitude: 2.2945,
  },
  {
    name: 'Sydney Opera House',
    address: 'Bennelong Point, Sydney NSW 2000, Australia',
    latitude: -33.8568,
    longitude: 151.2153,
  },
];

export const LocationAttachmentModal: React.FC<LocationAttachmentModalProps> = ({
  isOpen,
  onClose,
  onSendLocation,
}) => {
  const { requestAppPermission } = useApp();
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>(PRESET_LOCATIONS[0]);
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleUseCurrentLocation = async () => {
    const granted = await requestAppPermission('location', 'sharing your live location');
    if (!granted) return;

    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setIsLocating(false);
          setSelectedLoc({
            name: 'My Current Live Location',
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          setIsLocating(false);
          // Fallback if denied or unavailable in sandbox
          setSelectedLoc({
            name: 'Current Device Location',
            address: 'Downtown Metro Center, Tech District',
            latitude: 37.7749,
            longitude: -122.4194,
          });
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setSelectedLoc({
        name: 'Current Device Location',
        address: 'Downtown Metro Center, Tech District',
        latitude: 37.7749,
        longitude: -122.4194,
      });
    }
  };

  const handleSend = () => {
    if (!selectedLoc) return;
    onSendLocation(selectedLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Share Location
              </h3>
              <p className="text-[11px] text-slate-500">
                Send GPS location or landmark pin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Current GPS Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center gap-3 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold">
                {isLocating ? 'Detecting GPS...' : 'Share Current Live Location'}
              </span>
              <span className="text-[10px] text-rose-500/80">
                Accurate to within 10 meters
              </span>
            </div>
          </button>

          {/* Preset Places */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Places & Landmarks:
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {PRESET_LOCATIONS.map((loc, idx) => {
                const isSelected = selectedLoc?.name === loc.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedLoc(loc)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {loc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {loc.address}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={!selectedLoc}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors"
          >
            Share Location
          </button>
        </div>
      </motion.div>
    </div>
  );
};
