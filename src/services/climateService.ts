import type { ClimatePoint, RouteData } from '@/types';
import { CLIMATE_POINTS, TIME_MODIFIERS } from '@/data/mockData';

export function getClimatePoints(
  departureTime: string,
  climateView: boolean,
): ClimatePoint[] {
  const mod = TIME_MODIFIERS[departureTime] || TIME_MODIFIERS.now;

  return CLIMATE_POINTS.map((point) => {
    let intensity = point.intensity;

    if (point.type === 'heat') {
      intensity = clamp(point.intensity * mod.heatMultiplier, 0.1, 1.0);
    } else if (point.type === 'shade') {
      intensity = clamp(point.intensity * mod.shadeMultiplier, 0.1, 1.0);
    } else if (point.type === 'traffic') {
      intensity = clamp(point.intensity * mod.trafficMultiplier, 0.1, 1.0);
    }

    return {
      ...point,
      intensity: climateView ? intensity : intensity * 0.4,
    };
  });
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function getCorsairResponse(
  question: string,
  routes: RouteData[],
  recommendedType: string,
  reason: string,
  vehicle: string,
): string {
  const q = question.toLowerCase();
  const recommended = routes.find((r) => r.type === recommendedType);
  const fastest = routes.find((r) => r.type === 'fastest');
  const coolest = routes.find((r) => r.type === 'coolest');
  const efficient = routes.find((r) => r.type === 'efficient');

  if (!recommended || !fastest) return "I'm analyzing the route data. Please try asking again.";

  if (q.includes('fastest') && (q.includes('why') || q.includes('not') || q.includes("shouldn't"))) {
    const timeDiff = recommended.time - fastest.time;
    const heatWord = fastest.heat === 'High' ? 'high heat exposure' : fastest.heat === 'Medium' ? 'moderate heat' : 'low heat';
    return `The fastest route saves ${Math.abs(timeDiff)} minutes but has ${heatWord} with only ${fastest.shade}% shade coverage and ${fastest.traffic.toLowerCase()} traffic. The ${recommended.label} route adds just ${timeDiff} minutes while significantly reducing your climate exposure. For a ${vehicle} journey, that trade-off is worth it.`;
  }

  if (q.includes('better') || q.includes('why') && q.includes('route')) {
    return reason;
  }

  if (q.includes('30 min') || q.includes('later') || q.includes('time')) {
    return `Departing 30 minutes later would shift solar exposure and traffic patterns. At peak hours (12-2 PM), heat exposure increases by ~15% but traffic may ease. The recommended route could change — the Coolest route becomes even more advantageous as shade coverage becomes critical.`;
  }

  if (q.includes('ev') || q.includes('electric') || q.includes('battery')) {
    const eff = efficient || recommended;
    return `For your EV, the Efficient route minimizes energy consumption with an energy score of ${eff?.energy}. It avoids heavy traffic segments that drain battery through regenerative braking losses, and maintains a moderate speed profile for optimal motor efficiency.`;
  }

  if (q.includes('shade') || q.includes('cool')) {
    return `The Coolest route maximizes shade coverage at ${coolest?.shade}% compared to ${fastest.shade}% on the fastest path. It routes through tree-lined avenues and park-adjacent streets, reducing your direct solar exposure by approximately ${Math.round(((coolest?.shade || 0) - fastest.shade) / fastest.shade * 100)}%.`;
  }

  if (q.includes('air') || q.includes('pollution') || q.includes('quality')) {
    return `Air quality varies across routes. The ${recommended.label} route passes through areas with ${recommended.air_quality.toLowerCase()} air quality, avoiding the high-traffic corridors where particulate matter concentrates. This is especially important for bicycles and walking.`;
  }

  if (q.includes('traffic')) {
    return `Traffic conditions: Fastest route has ${fastest.traffic.toLowerCase()} traffic, while the ${recommended.label} route has ${recommended.traffic.toLowerCase()} traffic. The climate-aware recommendation balances time savings against traffic-related stress and emissions.`;
  }

  return reason;
}
