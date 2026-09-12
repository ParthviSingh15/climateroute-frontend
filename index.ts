export type VehicleType = 'car' | 'ev' | 'motorcycle' | 'bicycle' | 'walking';
export type RouteType = 'fastest' | 'coolest' | 'efficient';
export type HeatLevel = 'Low' | 'Medium' | 'High';
export type TrafficLevel = 'Low' | 'Medium' | 'Heavy';
export type AirQualityLevel = 'Good' | 'Moderate' | 'Poor';

export interface RouteData {
  type: RouteType;
  label: string;
  icon: string;
  time: number;
  distance: number;
  shade: number;
  heat: HeatLevel;
  traffic: TrafficLevel;
  air_quality: AirQualityLevel;
  energy: number;
  climate_score: number;
  color: string;
  path: [number, number][];
}

export interface RouteResponse {
  start: string;
  destination: string;
  vehicle: VehicleType;
  departure_time: string;
  recommended_route: RouteType;
  recommendation_reason: string;
  routes: RouteData[];
}

export interface ClimatePoint {
  lat: number;
  lng: number;
  type: 'heat' | 'shade' | 'air' | 'traffic';
  intensity: number;
  radius: number;
}

export interface VehicleOption {
  value: VehicleType;
  label: string;
  icon: string;
}

export interface DepartureOption {
  value: string;
  label: string;
  hour: number;
}

export interface ScoreBreakdown {
  shade: number;
  heat: number;
  air: number;
  traffic: number;
  energy: number;
}

export type ClimateViewMode = 'normal' | 'climate';
