import { useEffect, useState } from 'react';
import { Sun, Thermometer, Wind, TrafficCone, Battery } from 'lucide-react';
import type { RouteData } from '@/types';
import { getOverallScore, getScoreBreakdown } from '@/services/routeService';
import type { VehicleType } from '@/types';

interface ClimateScoreProps {
  route: RouteData;
  vehicle: VehicleType;
}

function useAnimatedNumber(target: number, duration: number = 800): number {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    const start = current;
    const diff = target - start;
    const startTime = performance.now();

    let frame: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return current;
}

export default function ClimateScore({ route, vehicle }: ClimateScoreProps) {
  const score = getOverallScore(route);
  const animatedScore = useAnimatedNumber(score);
  const breakdown = getScoreBreakdown(route, vehicle);

  // Dial properties
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  // Score color
  const scoreColor = score >= 75 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#f97316';
  const scoreLabel = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Moderate';

  // Indicator segments around the dial
  const indicators = [
    { label: 'Shade', icon: Sun, value: breakdown.shade, color: '#22c55e', angle: -90 },
    { label: 'Heat', icon: Thermometer, value: breakdown.heat, color: '#f97316', angle: -30 },
    { label: 'Air', icon: Wind, value: breakdown.air, color: '#38abf6', angle: 30 },
    { label: 'Traffic', icon: TrafficCone, value: breakdown.traffic, color: '#71717a', angle: 90 },
    { label: 'Energy', icon: Battery, value: breakdown.energy, color: '#14b8a6', angle: 150 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 w-full sm:w-[340px] animate-fade-in-up">
      <h3 className="text-[10px] font-bold text-charcoal-700/60 uppercase tracking-wider mb-2 text-center">
        Climate Score
      </h3>

      <div className="relative flex items-center justify-center mb-3">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#f3eee2"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease' }}
          />
          {/* Tick marks for indicators */}
          {indicators.map((ind, i) => {
            const tickAngle = (ind.angle - 90) * (Math.PI / 180);
            const x1 = 70 + Math.cos(tickAngle) * (radius + 6);
            const y1 = 70 + Math.sin(tickAngle) * (radius + 6);
            const x2 = 70 + Math.cos(tickAngle) * (radius + 12);
            const y2 = 70 + Math.sin(tickAngle) * (radius + 12);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={ind.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-4xl font-bold number-transition"
            style={{ color: scoreColor }}
          >
            {animatedScore}
          </div>
          <div className="text-[9px] font-semibold text-charcoal-700/50 uppercase tracking-wider">
            {scoreLabel}
          </div>
        </div>
      </div>

      {/* Indicator pills */}
      <div className="flex justify-between gap-1">
        {indicators.map((ind) => {
          const Icon = ind.icon;
          return (
            <div
              key={ind.label}
              className="flex flex-col items-center gap-0.5 flex-1"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${ind.color}15` }}
              >
                <Icon className="w-3 h-3" style={{ color: ind.color }} />
              </div>
              <div className="text-[9px] font-bold text-charcoal-800 number-transition">
                {Math.round(ind.value)}
              </div>
              <div className="text-[7px] text-charcoal-700/40 font-medium uppercase">
                {ind.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
