import { Sun, Trees, Wind, TrafficCone, Battery, Eye, Map } from 'lucide-react';
import type { ClimateViewMode } from '@/types';

interface ClimateViewToggleProps {
  mode: ClimateViewMode;
  onToggle: (mode: ClimateViewMode) => void;
}

export default function ClimateViewToggle({ mode, onToggle }: ClimateViewToggleProps) {
  return (
    <div className="glass-panel rounded-2xl p-1.5 flex gap-1 animate-fade-in">
      <button
        onClick={() => onToggle('normal')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          mode === 'normal'
            ? 'bg-white text-charcoal-900 shadow-sm'
            : 'text-charcoal-700/50 hover:text-charcoal-800'
        }`}
      >
        <Map className="w-3.5 h-3.5" />
        Standard
      </button>
      <button
        onClick={() => onToggle('climate')}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          mode === 'climate'
            ? 'bg-gradient-to-r from-forest-600 to-teal-500 text-white shadow-sm'
            : 'text-charcoal-700/50 hover:text-charcoal-800'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        Climate View
      </button>
    </div>
  );
}

export function ClimateLegend({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const items = [
    { icon: Sun, label: 'High Solar Exposure', color: '#f97316', bg: 'bg-orange-50' },
    { icon: Trees, label: 'Shade / Cooler', color: '#22c55e', bg: 'bg-forest-50' },
    { icon: Wind, label: 'Air Quality', color: '#38abf6', bg: 'bg-sky-50' },
    { icon: TrafficCone, label: 'Traffic', color: '#71717a', bg: 'bg-zinc-100' },
    { icon: Battery, label: 'Energy', color: '#14b8a6', bg: 'bg-teal-50' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-3 animate-fade-in-up">
      <h3 className="text-[10px] font-bold text-charcoal-700/60 uppercase tracking-wider mb-2">
        Climate Legend
      </h3>
      <div className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon className="w-2.5 h-2.5" style={{ color: item.color }} />
              </div>
              <span className="text-[10px] font-medium text-charcoal-800">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
