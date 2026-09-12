import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RouteData, ClimatePoint, RouteType } from '@/types';
import { START_LOCATION, DEST_LOCATION } from '@/data/mockData';

interface MapViewProps {
  routes: RouteData[];
  selectedRoute: RouteType | null;
  climatePoints: ClimatePoint[];
  climateView: boolean;
  routeAnalysisDone: boolean;
}

function createDivIcon(html: string, className: string): L.DivIcon {
  return L.divIcon({
    html,
    className,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const startIcon = createDivIcon(
  `<div class="relative flex items-center justify-center w-full h-full">
    <div class="marker-pulse-ring absolute w-8 h-8 rounded-full bg-forest-500/30"></div>
    <div class="w-4 h-4 rounded-full bg-forest-600 border-2 border-white shadow-lg z-10"></div>
  </div>`,
  'custom-marker-start',
);

const destIcon = createDivIcon(
  `<div class="relative flex items-center justify-center w-full h-full">
    <div class="marker-pulse-ring absolute w-8 h-8 rounded-full bg-orange-500/30"></div>
    <div class="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-lg z-10"></div>
  </div>`,
  'custom-marker-dest',
);

function getOverlayColor(type: ClimatePoint['type'], intensity: number): string {
  const alpha = intensity * 0.4;
  switch (type) {
    case 'heat':
      return `rgba(249, 115, 22, ${alpha})`;
    case 'shade':
      return `rgba(34, 197, 94, ${alpha})`;
    case 'air':
      return `rgba(56, 171, 246, ${alpha})`;
    case 'traffic':
      return `rgba(63, 63, 70, ${alpha * 0.8})`;
    default:
      return `rgba(200, 200, 200, ${alpha})`;
  }
}

function FitBounds({ routes, routeAnalysisDone }: { routes: RouteData[]; routeAnalysisDone: boolean }) {
  const map = useMap();
  const hasFit = useRef(false);

  useEffect(() => {
    if (!routeAnalysisDone || hasFit.current || routes.length === 0) return;

    const allPoints: [number, number][] = [
      START_LOCATION,
      DEST_LOCATION,
      ...routes.flatMap((r) => r.path),
    ];

    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, { padding: [120, 120], maxZoom: 15 });
    hasFit.current = true;
  }, [routeAnalysisDone, routes, map]);

  return null;
}

export default function MapView({
  routes,
  selectedRoute,
  climatePoints,
  climateView,
  routeAnalysisDone,
}: MapViewProps) {
  const tileUrl = climateView
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Determine recommended route (lowest climate score)
  const recommendedType: RouteType | null =
    routes.length > 0
      ? routes.reduce((min, r) => (r.climate_score < min.climate_score ? r : min)).type
      : null;

  return (
    <MapContainer
      center={[28.6215, 77.223]}
      zoom={14}
      zoomControl={false}
      attributionControl={true}
      className="w-full h-full"
      style={{ background: '#e9e1d0' }}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />

      <FitBounds routes={routes} routeAnalysisDone={routeAnalysisDone} />

      {/* Climate overlay circles */}
      {(climateView || routeAnalysisDone) &&
        climatePoints.map((point, i) => (
          <CircleMarker
            key={`climate-${i}-${point.type}`}
            center={[point.lat, point.lng]}
            radius={point.radius / 8}
            pathOptions={{
              color: getOverlayColor(point.type, point.intensity),
              fillColor: getOverlayColor(point.type, point.intensity),
              fillOpacity: climateView ? point.intensity * 0.45 : point.intensity * 0.18,
              weight: 0,
            }}
          />
        ))}

      {/* Route ribbons — glow + main + flow highlight */}
      {routes.map((route) => {
        const isSelected = selectedRoute === route.type;
        const isRecommended = recommendedType === route.type && !isSelected;

        return (
          <PolylineGroup
            key={route.type}
            positions={route.path}
            color={route.color}
            isSelected={isSelected}
            isRecommended={isRecommended}
          />
        );
      })}

      {/* Start & destination markers with labels */}
      <Marker position={START_LOCATION} icon={startIcon}>
        <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent={false}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#15803d' }}>India Gate</span>
        </Tooltip>
      </Marker>
      <Marker position={DEST_LOCATION} icon={destIcon}>
        <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent={false}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#f97316' }}>Connaught Place</span>
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}

function PolylineGroup({
  positions,
  color,
  isSelected,
  isRecommended,
}: {
  positions: [number, number][];
  color: string;
  isSelected: boolean;
  isRecommended: boolean;
}) {
  return (
    <>
      {/* Glow layer */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: color,
          weight: isSelected ? 14 : 10,
          opacity: isSelected ? 0.15 : 0.06,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Main route line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: color,
          weight: isSelected ? 7 : isRecommended ? 5 : 4,
          opacity: isSelected ? 1.0 : isRecommended ? 0.7 : 0.35,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Flowing highlight for selected route */}
      {isSelected && (
        <Polyline
          positions={positions}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            opacity: 0.7,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: '10, 14',
            className: 'route-flow',
          }}
        />
      )}
    </>
  );
}
