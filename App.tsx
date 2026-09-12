import { useState, useCallback, useMemo } from 'react';
import { Wind, Route as RouteIcon } from 'lucide-react';
import type { RouteData, RouteType, VehicleType, ClimateViewMode, ClimatePoint } from '@/types';
import { fetchRoute } from '@/services/routeService';
import { getClimatePoints } from '@/services/climateService';
import { BASE_ROUTES, ROUTE_PATHS } from '@/data/mockData';
import MapView from '@/components/MapView';
import JourneyPlanner from '@/components/JourneyPlanner';
import RouteSelector from '@/components/RouteSelector';
import ClimateScore from '@/components/ClimateScore';
import RouteExplanation from '@/components/RouteExplanation';
import CorsairAssistant from '@/components/CorsairAssistant';
import ClimateViewToggle, { ClimateLegend } from '@/components/ClimateView';
import TimeController from '@/components/TimeController';
import LoadingOverlay from '@/components/LoadingOverlay';

function getPreviewRoutes(): RouteData[] {
  return [
    { ...BASE_ROUTES.fastest, path: ROUTE_PATHS.fastest },
    { ...BASE_ROUTES.coolest, path: ROUTE_PATHS.coolest },
    { ...BASE_ROUTES.efficient, path: ROUTE_PATHS.efficient },
  ];
}

export default function App() {
  const [routes, setRoutes] = useState<RouteData[]>(() => getPreviewRoutes());
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
  const [recommendedRoute, setRecommendedRoute] = useState<RouteType>('coolest');
  const [recommendationReason, setRecommendationReason] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [departure, setDeparture] = useState('2pm');
  const [climateViewMode, setClimateViewMode] = useState<ClimateViewMode>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [routeAnalysisDone, setRouteAnalysisDone] = useState(false);
  const [currentStart, setCurrentStart] = useState('');
  const [currentDest, setCurrentDest] = useState('');
  const [apiError, setApiError] = useState('');

  const climatePoints: ClimatePoint[] = useMemo(
    () => getClimatePoints(departure, climateViewMode === 'climate'),
    [departure, climateViewMode],
  );

  const selectedRouteData = routes.find((r) => r.type === selectedRoute) || null;

  const handleFindRoute = useCallback(
    async (start: string, destination: string, veh: VehicleType, dep: string) => {
      setIsLoading(true);
      setApiError('');
      setRouteAnalysisDone(false);
      setVehicle(veh);
      setDeparture(dep);
      setCurrentStart(start);
      setCurrentDest(destination);

      try {
        // Keep the cinematic loading state while the real FastAPI request runs.
        const [result] = await Promise.all([
          fetchRoute(start, destination, veh, dep),
          new Promise((resolve) => setTimeout(resolve, 2200)),
        ]);

        setRoutes(result.routes);
        setRecommendedRoute(result.recommended_route);
        setRecommendationReason(result.recommendation_reason);
        setSelectedRoute(result.recommended_route);
        setRouteAnalysisDone(true);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : 'Unable to calculate routes.');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // When departure time changes after routes are loaded, re-fetch routes
  const handleDepartureChange = useCallback(
    async (newDeparture: string) => {
      setDeparture(newDeparture);
      if (routeAnalysisDone && currentStart && currentDest) {
        setApiError('');
        try {
          const result = await fetchRoute(currentStart, currentDest, vehicle, newDeparture);
          setRoutes(result.routes);
          setRecommendedRoute(result.recommended_route);
          setRecommendationReason(result.recommendation_reason);
          setSelectedRoute(result.recommended_route);
        } catch (error) {
          setApiError(error instanceof Error ? error.message : 'Unable to refresh routes.');
        }
      }
    },
    [routeAnalysisDone, currentStart, currentDest, vehicle],
  );

  const showResults = routeAnalysisDone && routes.length > 0 && selectedRouteData;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ivory-100">
      {/* Map — full screen, always present */}
      <div className="absolute inset-0 z-0">
        <MapView
          routes={routes}
          selectedRoute={selectedRoute}
          climatePoints={climatePoints}
          climateView={climateViewMode === 'climate'}
          routeAnalysisDone={routeAnalysisDone}
        />
      </div>

      {/* Top bar — logo + tagline + climate view toggle */}
      <div className="absolute top-0 left-0 right-0 z-[400] flex items-center justify-between p-3 sm:p-4 pointer-events-none">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-forest-600 to-teal-500 flex items-center justify-center shadow-lg">
            <RouteIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-charcoal-900 leading-tight tracking-tight">
              Climate<span className="text-forest-600">Route</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-charcoal-700/50 font-medium tracking-wide">
              Navigate smarter. Travel better.
            </p>
          </div>
        </div>

        {/* Climate View toggle */}
        <div className="pointer-events-auto">
          <ClimateViewToggle mode={climateViewMode} onToggle={setClimateViewMode} />
        </div>
      </div>

      {/* Left panel (desktop) — Journey Planner + Route Selector + Route Explanation */}
      <div className="hidden lg:flex absolute top-20 left-4 z-[400] flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto pointer-events-auto pb-4">
        <JourneyPlanner onFindRoute={handleFindRoute} isLoading={isLoading} />

        {showResults && (
          <>
            <RouteSelector
              routes={routes}
              selectedRoute={selectedRoute!}
              recommendedRoute={recommendedRoute}
              onSelectRoute={setSelectedRoute}
            />
            <RouteExplanation
              selectedRoute={selectedRouteData}
              recommendedRoute={recommendedRoute}
              reason={recommendationReason}
              routes={routes}
            />
          </>
        )}
      </div>

      {/* Right panel (desktop) — Climate Score + Corsair + Legend */}
      <div className="hidden lg:flex absolute top-20 right-4 z-[400] flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto pointer-events-auto pb-4">
        {showResults && (
          <>
            <ClimateScore route={selectedRouteData} vehicle={vehicle} />
            <CorsairAssistant
              routes={routes}
              recommendedRoute={recommendedRoute}
              reason={recommendationReason}
              vehicle={vehicle}
            />
          </>
        )}

        {/* Climate Legend — visible in climate view mode */}
        <ClimateLegend visible={climateViewMode === 'climate'} />
      </div>

      {/* Bottom center (desktop) — Time Controller */}
      <div className="hidden lg:block absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-auto">
        <div className="w-[420px]">
          <TimeController
            departure={departure}
            onDepartureChange={handleDepartureChange}
            disabled={!routeAnalysisDone}
          />
        </div>
      </div>

      {/* Mobile bottom sheet — Journey Planner (always visible) */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 z-[400] pointer-events-auto">
        <div className="glass-panel rounded-t-2xl p-3 max-h-[70vh] overflow-y-auto">
          {/* Drag handle */}
          <div className="flex justify-center mb-2">
            <div className="w-10 h-1 rounded-full bg-ivory-300" />
          </div>
          <JourneyPlanner onFindRoute={handleFindRoute} isLoading={isLoading} />
          {showResults && (
            <div className="mt-3 space-y-3">
              <RouteSelector
                routes={routes}
                selectedRoute={selectedRoute!}
                recommendedRoute={recommendedRoute}
                onSelectRoute={setSelectedRoute}
              />
              <ClimateScore route={selectedRouteData} vehicle={vehicle} />
              <RouteExplanation
                selectedRoute={selectedRouteData}
                recommendedRoute={recommendedRoute}
                reason={recommendationReason}
                routes={routes}
              />
              <CorsairAssistant
                routes={routes}
                recommendedRoute={recommendedRoute}
                reason={recommendationReason}
                vehicle={vehicle}
              />
              <TimeController
                departure={departure}
                onDepartureChange={handleDepartureChange}
                disabled={!routeAnalysisDone}
              />
              <ClimateLegend visible={climateViewMode === 'climate'} />
            </div>
          )}
        </div>
      </div>

      {/* Initial state hint — shown when no routes yet (desktop only) */}
      {!routeAnalysisDone && !isLoading && (
        <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] pointer-events-none items-center">
          <div className="glass-panel rounded-2xl px-6 py-4 flex items-center gap-3 animate-float">
            <Wind className="w-5 h-5 text-forest-600" />
            <p className="text-sm font-medium text-charcoal-800">
              Plan your journey to reveal climate-smart routes
            </p>
          </div>
        </div>
      )}

      {/* API error */}
      {apiError && !isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[700] max-w-[calc(100%-2rem)]">
          <div className="glass-panel rounded-xl border border-orange-200 px-4 py-3 text-xs text-charcoal-800 shadow-lg">
            <strong className="text-orange-600">Route service unavailable.</strong>{' '}
            Start the FastAPI backend and try again.
          </div>
        </div>
      )}

      {/* Loading overlay */}
      <LoadingOverlay visible={isLoading} />
    </div>
  );
}
