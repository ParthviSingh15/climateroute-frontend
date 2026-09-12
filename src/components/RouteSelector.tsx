import { Sun, Thermometer, Wind, TrafficCone, Battery, Clock, MapPin } from 'lucide-react';
import type { RouteData, RouteType } from '@/types';

interface RouteSelectorProps {
  routes: RouteData[];
  selectedRoute: RouteType;
  recommendedRoute: RouteType;
  onSelectRoute: (type: RouteType) => void;
}

function levelColor(heat: string): string {
  if (heat === 'High') return 'text-orange-500';
  if (heat === 'Medium') return 'text-amber-500';
  return 'text-forest-600';
}

function trafficColor(traffic: string): string {
  if (traffic === 'Heavy') return 'text-orange-500';
  if (traffic === 'Medium') return 'text-amber-500';
  return 'text-forest-600';
}

function airColor(air: string): string {
  if (air === 'Good') return 'text-forest-600';
  if (air === 'Moderate') return 'text-amber-500';
  return 'text-orange-500';
}

export default function RouteSelector({
  routes,
  selectedRoute,
  recommendedRoute,
  onSelectRoute,
}: RouteSelectorProps) {
  return (
    <div className="glass-panel rounded-2xl p-4 w-full sm:w-[340px] animate-slide-in-right">
      <h3 className="text-[10px] font-bold text-charcoal-700/60 uppercase tracking-wider mb-3">
        Smart Route Options
      </h3>

      <div className="space-y-2">
        {routes.map((route) => {
          const isSelected = selectedRoute === route.type;
          const isRecommended = recommendedRoute === route.type;

          return (
            <button
              key={route.type}
              onClick={() => onSelectRoute(route.type)}
              className={`w-full text-left rounded-xl p-3 transition-all duration-300 border-2 ${
                isSelected
                  ? 'bg-white shadow-md'
                  : 'bg-ivory-100/50 hover:bg-ivory-100 border-transparent'
              }`}
              style={{ borderColor: isSelected ? route.color : 'transparent' }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{route.icon}</span>
                  <span className="text-sm font-bold text-charcoal-900 uppercase tracking-wide">
                    {route.label}
                  </span>
                  {isRecommended && (
                    <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full bg-forest-600 uppercase tracking-wide">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-charcoal-900 leading-none">
                    {route.time}<span className="text-[10px] font-medium text-charcoal-700/60 ml-0.5">min</span>
                  </div>
                  <div className="text-[10px] text-charcoal-700/50 font-medium">
                    {route.distance} km
                  </div>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-5 gap-1.5">
                <Metric icon={<Sun className="w-2.5 h-2.5" />} label="Shade" value={`${route.shade}%`} color="text-forest-600" />
                <Metric icon={<Thermometer className="w-2.5 h-2.5" />} label="Heat" value={route.heat} color={levelColor(route.heat)} />
                <Metric icon={<TrafficCone className="w-2.5 h-2.5" />} label="Traffic" value={route.traffic} color={trafficColor(route.traffic)} />
                <Metric icon={<Wind className="w-2.5 h-2.5" />} label="Air" value={route.air_quality} color={airColor(route.air_quality)} />
                <Metric icon={<Battery className="w-2.5 h-2.5" />} label="Energy" value={`${route.energy}`} color="text-teal-500" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-ivory-300 flex items-center gap-1.5">
        <div className="text-[9px] font-medium text-charcoal-700/40 italic">
          Climate data is estimated
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`${color} flex items-center`}>{icon}</div>
      <div className={`text-[9px] font-semibold ${color} leading-tight text-center`}>
        {value}
      </div>
    </div>
  );
}
