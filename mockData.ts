import type {
  RouteData,
  ClimatePoint,
  VehicleOption,
  DepartureOption,
} from '@/types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { value: 'car', label: 'Car', icon: 'Car' },
  { value: 'ev', label: 'Electric Vehicle', icon: 'Zap' },
  { value: 'motorcycle', label: 'Motorcycle', icon: 'Bike' },
  { value: 'bicycle', label: 'Bicycle', icon: 'Bike' },
  { value: 'walking', label: 'Walking', icon: 'Footprints' },
];

export const DEPARTURE_OPTIONS: DepartureOption[] = [
  { value: 'now', label: 'Now', hour: 10 },
  { value: '12pm', label: '12 PM', hour: 12 },
  { value: '2pm', label: '2 PM', hour: 14 },
  { value: '4pm', label: '4 PM', hour: 16 },
  { value: '6pm', label: '6 PM', hour: 18 },
];

// India Gate coordinates
export const START_LOCATION: [number, number] = [28.6129, 77.2295];
// Connaught Place coordinates
export const DEST_LOCATION: [number, number] = [28.6315, 77.2167];

// Route paths — stylized curves between India Gate and CP
export const ROUTE_PATHS: Record<string, [number, number][]> = {
  fastest: [
    [28.6129, 77.2295],
    [28.6152, 77.2258],
    [28.6185, 77.2223],
    [28.6220, 77.2200],
    [28.6260, 77.2182],
    [28.6290, 77.2172],
    [28.6315, 77.2167],
  ],
  coolest: [
    [28.6129, 77.2295],
    [28.6145, 77.2272],
    [28.6168, 77.2240],
    [28.6190, 77.2255],
    [28.6215, 77.2270],
    [28.6240, 77.2260],
    [28.6270, 77.2240],
    [28.6295, 77.2210],
    [28.6315, 77.2167],
  ],
  efficient: [
    [28.6129, 77.2295],
    [28.6160, 77.2265],
    [28.6195, 77.2240],
    [28.6230, 77.2225],
    [28.6265, 77.2210],
    [28.6290, 77.2190],
    [28.6315, 77.2167],
  ],
};

// Climate overlay points around the map area
export const CLIMATE_POINTS: ClimatePoint[] = [
  // Heat zones (warm areas)
  { lat: 28.6160, lng: 77.2230, type: 'heat', intensity: 0.8, radius: 280 },
  { lat: 28.6200, lng: 77.2195, type: 'heat', intensity: 0.7, radius: 220 },
  { lat: 28.6180, lng: 77.2260, type: 'heat', intensity: 0.6, radius: 200 },
  { lat: 28.6240, lng: 77.2200, type: 'heat', intensity: 0.75, radius: 240 },

  // Shade / cooler zones (green spaces)
  { lat: 28.6170, lng: 77.2245, type: 'shade', intensity: 0.9, radius: 200 },
  { lat: 28.6215, lng: 77.2268, type: 'shade', intensity: 0.85, radius: 180 },
  { lat: 28.6265, lng: 77.2250, type: 'shade', intensity: 0.75, radius: 160 },

  // Air quality zones
  { lat: 28.6190, lng: 77.2210, type: 'air', intensity: 0.7, radius: 300 },
  { lat: 28.6250, lng: 77.2220, type: 'air', intensity: 0.8, radius: 260 },

  // Traffic zones
  { lat: 28.6155, lng: 77.2245, type: 'traffic', intensity: 0.9, radius: 180 },
  { lat: 28.6220, lng: 77.2198, type: 'traffic', intensity: 0.85, radius: 200 },
  { lat: 28.6280, lng: 77.2185, type: 'traffic', intensity: 0.6, radius: 160 },
];

// Base route data — these get modified by time and vehicle
export const BASE_ROUTES: Record<string, Omit<RouteData, 'path'>> = {
  fastest: {
    type: 'fastest',
    label: 'Fastest',
    icon: '⚡',
    time: 18,
    distance: 7.2,
    shade: 32,
    heat: 'High',
    traffic: 'Heavy',
    air_quality: 'Moderate',
    energy: 80,
    climate_score: 13.92,
    color: '#f97316',
  },
  coolest: {
    type: 'coolest',
    label: 'Coolest',
    icon: '🌳',
    time: 21,
    distance: 7.8,
    shade: 68,
    heat: 'Low',
    traffic: 'Medium',
    air_quality: 'Good',
    energy: 70,
    climate_score: 8.08,
    color: '#16a34a',
  },
  efficient: {
    type: 'efficient',
    label: 'Efficient',
    icon: '🔋',
    time: 20,
    distance: 7.5,
    shade: 51,
    heat: 'Medium',
    traffic: 'Low',
    air_quality: 'Good',
    energy: 60,
    climate_score: 8.36,
    color: '#14b8a6',
  },
};

// Time-based climate modifiers
export const TIME_MODIFIERS: Record<string, {
  heatMultiplier: number;
  shadeMultiplier: number;
  trafficMultiplier: number;
  solarIntensity: number;
}> = {
  now: { heatMultiplier: 0.75, shadeMultiplier: 1.0, trafficMultiplier: 0.8, solarIntensity: 0.5 },
  '12pm': { heatMultiplier: 1.15, shadeMultiplier: 0.85, trafficMultiplier: 1.1, solarIntensity: 1.0 },
  '2pm': { heatMultiplier: 1.3, shadeMultiplier: 0.8, trafficMultiplier: 0.9, solarIntensity: 1.0 },
  '4pm': { heatMultiplier: 0.9, shadeMultiplier: 0.95, trafficMultiplier: 1.2, solarIntensity: 0.7 },
  '6pm': { heatMultiplier: 0.6, shadeMultiplier: 1.1, trafficMultiplier: 1.4, solarIntensity: 0.3 },
};

// Vehicle weight presets for scoring
export const VEHICLE_WEIGHTS: Record<string, {
  traffic: number;
  energy: number;
  heat: number;
  shade: number;
  air: number;
  distance: number;
}> = {
  car: { traffic: 0.25, energy: 0.20, heat: 0.15, shade: 0.10, air: 0.10, distance: 0.20 },
  ev: { traffic: 0.20, energy: 0.30, heat: 0.10, shade: 0.05, air: 0.10, distance: 0.25 },
  motorcycle: { traffic: 0.20, energy: 0.15, heat: 0.20, shade: 0.15, air: 0.10, distance: 0.20 },
  bicycle: { traffic: 0.10, energy: 0.10, heat: 0.25, shade: 0.30, air: 0.20, distance: 0.05 },
  walking: { traffic: 0.05, energy: 0.05, heat: 0.25, shade: 0.35, air: 0.25, distance: 0.05 },
};
