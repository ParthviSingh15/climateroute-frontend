import { useState } from 'react';
import { Search, Car, Zap, Bike, Footprints, ChevronDown, Navigation2, Clock } from 'lucide-react';
import type { VehicleType } from '@/types';
import { VEHICLE_OPTIONS, DEPARTURE_OPTIONS } from '@/data/mockData';

interface JourneyPlannerProps {
  onFindRoute: (start: string, destination: string, vehicle: VehicleType, departure: string) => void;
  isLoading: boolean;
}

const VEHICLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Car,
  Zap,
  Bike,
  Footprints,
};

export default function JourneyPlanner({ onFindRoute, isLoading }: JourneyPlannerProps) {
  const [start, setStart] = useState('India Gate');
  const [destination, setDestination] = useState('Connaught Place');
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [departure, setDeparture] = useState('2pm');
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

  const selectedVehicle = VEHICLE_OPTIONS.find((v) => v.value === vehicle)!;
  const selectedDeparture = DEPARTURE_OPTIONS.find((d) => d.value === departure)!;
  const VehicleIcon = VEHICLE_ICONS[selectedVehicle.icon] || Car;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindRoute(start, destination, vehicle, departure);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 w-full sm:w-[340px] animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-forest-600 flex items-center justify-center">
          <Navigation2 className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-sm font-bold text-charcoal-900 tracking-wide uppercase">Journey Planner</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Start */}
        <div className="relative">
          <label className="text-[10px] font-semibold text-charcoal-700/60 uppercase tracking-wider mb-1 block">
            Start
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-forest-600 border-2 border-white z-10" />
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-sm bg-ivory-100/80 border border-ivory-300 rounded-xl text-charcoal-900 placeholder-charcoal-700/40 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500/30 transition-all"
              placeholder="Starting point"
            />
          </div>
        </div>

        {/* Connector line */}
        <div className="flex justify-center -my-1">
          <div className="w-px h-4 bg-ivory-300" />
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="text-[10px] font-semibold text-charcoal-700/60 uppercase tracking-wider mb-1 block">
            Destination
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-500 z-10" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-sm bg-ivory-100/80 border border-ivory-300 rounded-xl text-charcoal-900 placeholder-charcoal-700/40 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
              placeholder="Where to?"
            />
          </div>
        </div>

        {/* Vehicle & Departure row */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Vehicle dropdown */}
          <div className="relative">
            <label className="text-[10px] font-semibold text-charcoal-700/60 uppercase tracking-wider mb-1 block">
              Vehicle
            </label>
            <button
              type="button"
              onClick={() => { setVehicleOpen(!vehicleOpen); setDepartureOpen(false); }}
              className="w-full flex items-center justify-between pl-2.5 pr-2 py-2.5 text-sm bg-ivory-100/80 border border-ivory-300 rounded-xl text-charcoal-900 hover:border-forest-400 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <VehicleIcon className="w-3.5 h-3.5 text-forest-600" />
                <span className="text-xs font-medium">{selectedVehicle.label}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-charcoal-700/50 transition-transform ${vehicleOpen ? 'rotate-180' : ''}`} />
            </button>
            {vehicleOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 glass-panel rounded-xl py-1 z-[500] animate-scale-in">
                {VEHICLE_OPTIONS.map((opt) => {
                  const Icon = VEHICLE_ICONS[opt.icon] || Car;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setVehicle(opt.value); setVehicleOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-ivory-200 transition-colors ${
                        opt.value === vehicle ? 'text-forest-600 bg-ivory-100' : 'text-charcoal-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Departure dropdown */}
          <div className="relative">
            <label className="text-[10px] font-semibold text-charcoal-700/60 uppercase tracking-wider mb-1 block">
              Departure
            </label>
            <button
              type="button"
              onClick={() => { setDepartureOpen(!departureOpen); setVehicleOpen(false); }}
              className="w-full flex items-center justify-between pl-2.5 pr-2 py-2.5 text-sm bg-ivory-100/80 border border-ivory-300 rounded-xl text-charcoal-900 hover:border-forest-400 transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-forest-600" />
                <span className="text-xs font-medium">{selectedDeparture.label}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-charcoal-700/50 transition-transform ${departureOpen ? 'rotate-180' : ''}`} />
            </button>
            {departureOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 glass-panel rounded-xl py-1 z-[500] animate-scale-in">
                {DEPARTURE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setDeparture(opt.value); setDepartureOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-ivory-200 transition-colors ${
                      opt.value === departure ? 'text-forest-600 bg-ivory-100' : 'text-charcoal-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 bg-gradient-to-r from-forest-600 to-forest-500 text-white text-sm font-bold rounded-xl hover:from-forest-700 hover:to-forest-600 transition-all shadow-lg shadow-forest-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ANALYZING...
            </>
          ) : (
            <>
              FIND SMART ROUTE
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
