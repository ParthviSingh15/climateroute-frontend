import type {
  RouteData,
  RouteResponse,
  VehicleType,
  RouteType,
  HeatLevel,
  TrafficLevel,
  AirQualityLevel,
} from '@/types';
import { ROUTE_PATHS, BASE_ROUTES } from '@/data/mockData';

const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const routeMeta: Record<RouteType, { label: string; icon: string; color: string }> = {
  fastest: { label: 'Fastest', icon: '⚡', color: '#f97316' },
  coolest: { label: 'Coolest', icon: '🌳', color: '#16a34a' },
  efficient: { label: 'Efficient', icon: '🔋', color: '#14b8a6' },
};

const fallbackRoutes: Record<RouteType, RouteData> = {
  fastest: { ...BASE_ROUTES.fastest, path: ROUTE_PATHS.fastest },
  coolest: { ...BASE_ROUTES.coolest, path: ROUTE_PATHS.coolest },
  efficient: { ...BASE_ROUTES.efficient, path: ROUTE_PATHS.efficient },
};

function isRouteType(value: unknown): value is RouteType {
  return value === 'fastest' || value === 'coolest' || value === 'efficient';
}

function asHeat(value: unknown): HeatLevel {
  return value === 'Low' || value === 'Medium' || value === 'High' ? value : 'Medium';
}

function asTraffic(value: unknown): TrafficLevel {
  return value === 'Low' || value === 'Medium' || value === 'Heavy' ? value : 'Medium';
}

function asAir(value: unknown): AirQualityLevel {
  return value === 'Good' || value === 'Moderate' || value === 'Poor' ? value : 'Moderate';
}

function normalizeRoute(raw: Partial<RouteData> & { type?: unknown }, index: number): RouteData {
  const type: RouteType = isRouteType(raw.type) ? raw.type : (['fastest', 'coolest', 'efficient'][index] as RouteType);
  const fallback = fallbackRoutes[type];
  const meta = routeMeta[type];

  return {
    type,
    label: meta.label,
    icon: meta.icon,
    color: meta.color,
    time: Number(raw.time ?? fallback.time),
    distance: Number(raw.distance ?? fallback.distance),
    shade: Number(raw.shade ?? fallback.shade),
    heat: asHeat(raw.heat),
    traffic: asTraffic(raw.traffic),
    air_quality: asAir(raw.air_quality),
    energy: Number(raw.energy ?? fallback.energy),
    climate_score: Number(raw.climate_score ?? fallback.climate_score),
    // The current FastAPI MVP returns climate metrics, not road geometry.
    // Keep the polished prototype paths for the visual map until real geometry is added.
    path: raw.path && raw.path.length >= 2 ? raw.path : fallback.path,
  };
}

export async function fetchRoute(
  start: string,
  destination: string,
  vehicle: VehicleType,
  departureTime: string,
): Promise<RouteResponse> {
  const response = await fetch(`${API_URL}/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start: start.trim(),
      destination: destination.trim(),
      vehicle,
      departure_time: departureTime,
    }),
  });

  if (!response.ok) {
    let message = `Route API returned ${response.status}`;
    try {
      const error = await response.json();
      if (error?.detail) message = String(error.detail);
    } catch {
      // Keep the HTTP status message when the server doesn't return JSON.
    }
    throw new Error(message);
  }

  const data = await response.json();
  const routes = Array.isArray(data.routes)
    ? data.routes.map((route: Partial<RouteData> & { type?: unknown }, index: number) => normalizeRoute(route, index))
    : [];

  if (routes.length === 0) {
    throw new Error('The route API returned no route options.');
  }

  const recommendedRoute: RouteType = isRouteType(data.recommended_route)
    ? data.recommended_route
    : routes.reduce((best, route) => route.climate_score < best.climate_score ? route : best, routes[0]).type;

  return {
    start: String(data.start ?? start),
    destination: String(data.destination ?? destination),
    vehicle: (data.vehicle ?? vehicle) as VehicleType,
    departure_time: String(data.departure_time ?? departureTime),
    recommended_route: recommendedRoute,
    recommendation_reason: String(data.recommendation_reason ?? 'This route offers the best overall climate score.'),
    routes,
  };
}

export function getScoreBreakdown(route: RouteData, vehicle: VehicleType) {
  const vehicleFactor = vehicle === 'walking' || vehicle === 'bicycle' ? 1.05 : vehicle === 'ev' ? 1 : 0.95;
  const shade = Math.max(0, Math.min(100, route.shade));
  const heat = route.heat === 'Low' ? 90 : route.heat === 'Medium' ? 60 : 30;
  const traffic = route.traffic === 'Low' ? 90 : route.traffic === 'Medium' ? 60 : 30;
  const air = route.air_quality === 'Good' ? 90 : route.air_quality === 'Moderate' ? 60 : 30;
  const energy = Math.max(0, 100 - route.energy);

  return {
    shade: Math.round(shade * vehicleFactor),
    heat: Math.round(heat * vehicleFactor),
    air: Math.round(air * vehicleFactor),
    traffic: Math.round(traffic * vehicleFactor),
    energy: Math.round(energy * vehicleFactor),
  };
}

export function getOverallScore(route: RouteData): number {
  // Backend score is lower-is-better. Convert it to the UI's higher-is-better 0-100 scale.
  const maxScore = 20;
  return Math.round(100 - Math.max(0, Math.min(100, (route.climate_score / maxScore) * 100)));
}
