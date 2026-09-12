import { Clock } from 'lucide-react';
import { DEPARTURE_OPTIONS } from '@/data/mockData';

interface TimeControllerProps {
  departure: string;
  onDepartureChange: (departure: string) => void;
  disabled: boolean;
}

export default function TimeController({ departure, onDepartureChange, disabled }: TimeControllerProps) {
  return (
    <div className="glass-panel rounded-2xl p-3 animate-fade-in w-full">
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className="w-3 h-3 text-charcoal-700/50" />
        <h3 className="text-[10px] font-bold text-charcoal-700/60 uppercase tracking-wider">
          Departure Time
        </h3>
      </div>

      <div className="flex gap-1 bg-ivory-100/80 rounded-xl p-1">
        {DEPARTURE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => !disabled && onDepartureChange(opt.value)}
            disabled={disabled}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${
              departure === opt.value
                ? 'bg-white text-charcoal-900 shadow-sm'
                : 'text-charcoal-700/50 hover:text-charcoal-800'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
