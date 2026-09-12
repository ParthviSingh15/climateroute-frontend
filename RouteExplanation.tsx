import { TrendingUp, TrendingDown, Clock, Sun, Thermometer } from 'lucide-react';
import type { RouteData, RouteType } from '@/types';

interface RouteExplanationProps {
  selectedRoute: RouteData;
  recommendedRoute: RouteType;
  reason: string;
  routes: RouteData[];
}

export default function RouteExplanation({
  selectedRoute,
  recommendedRoute,
  reason,
  routes,
}: RouteExplanationProps) {
  const isRecommended = selectedRoute.type === recommendedRoute;
  const fastest = routes.find((r) => r.type === 'fastest')!;
  const recommended = routes.find((r) => r.type === recommendedRoute)!;

  const timeDiff = selectedRoute.time - fastest.time;
  const shadeDiff = selectedRoute.shade - fastest.shade;
  const heatReduction = fastest.heat === 'High'
    ? 36
    : fastest.heat === 'Medium'
      ? 22
      : 10;

  return (
    <div className="glass-panel rounded-2xl p-4 w-full sm:w-[340px] animate-slide-in-right">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-forest-600" />
        <h3 className="text-[10px] font-bold text-charcoal-700/60 uppercase tracking-wider">
          Why This Route?
        </h3>
      </div>

      <p className="text-xs text-charcoal-800 leading-relaxed mb-3">
        {isRecommended ? reason : `${selectedRoute.label} selected. ${reason}`}
      </p>

      {/* Visual comparison */}
      <div className="grid grid-cols-3 gap-2">
        <ComparisonItem
          icon={<Clock className="w-3 h-3" />}
          label="Time"
          value={timeDiff > 0 ? `+${timeDiff} min` : `-${Math.abs(timeDiff)} min`}
          color={timeDiff > 0 ? 'text-amber-600' : 'text-forest-600'}
          bg={timeDiff > 0 ? 'bg-amber-50' : 'bg-forest-50'}
        />
        <ComparisonItem
          icon={<Sun className="w-3 h-3" />}
          label="Shade"
          value={`${shadeDiff > 0 ? '+' : ''}${shadeDiff}%`}
          color="text-forest-600"
          bg="bg-forest-50"
        />
        <ComparisonItem
          icon={<Thermometer className="w-3 h-3" />}
          label="Heat"
          value={`↓ ${heatReduction}%`}
          color="text-orange-500"
          bg="bg-orange-50"
        />
      </div>

      {/* Trade-off bar */}
      <div className="mt-3 pt-3 border-t border-ivory-300">
        <div className="flex items-center justify-between text-[10px] font-medium text-charcoal-700/50 mb-1.5">
          <span>Fastest</span>
          <span>{selectedRoute.label}</span>
        </div>
        <div className="relative h-2 rounded-full bg-ivory-200 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-forest-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min((selectedRoute.shade / 100) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-charcoal-700/40">{fastest.shade}% shade</span>
          <span className="text-[9px] font-bold text-forest-600">{selectedRoute.shade}% shade</span>
        </div>
      </div>
    </div>
  );
}

function ComparisonItem({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-2.5 flex flex-col items-center gap-1`}>
      <div className={`${color} flex items-center`}>{icon}</div>
      <div className={`text-xs font-bold ${color}`}>{value}</div>
      <div className="text-[8px] text-charcoal-700/40 font-medium uppercase">{label}</div>
    </div>
  );
}
