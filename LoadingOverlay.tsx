import { useEffect, useState } from 'react';
import { Sun, Thermometer, Wind, TrafficCone, Battery, Navigation2 } from 'lucide-react';

const LOADING_MESSAGES = [
  'Reading local climate conditions...',
  'Analyzing solar exposure...',
  'Comparing traffic patterns...',
  'Calculating vehicle efficiency...',
  'Finding your smartest route...',
];

const LOADING_ICONS = [Sun, Thermometer, Wind, TrafficCone, Battery];

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < LOADING_MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const CurrentIcon = LOADING_ICONS[messageIndex];

  return (
    <div className="absolute inset-0 z-[600] flex items-center justify-center bg-ivory-50/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        {/* Animated radar */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-forest-200" />
          <div className="absolute inset-3 rounded-full border-2 border-forest-300" />
          <div className="absolute inset-6 rounded-full border-2 border-forest-400" />
          <div className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(22, 163, 74, 0.3) 90deg, transparent 180deg)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center shadow-lg">
              <Navigation2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CurrentIcon className="w-4 h-4 text-forest-600 animate-pulse" />
            <p
              key={messageIndex}
              className="text-sm font-medium text-charcoal-900 animate-fade-in"
            >
              {LOADING_MESSAGES[messageIndex]}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i <= messageIndex ? 'bg-forest-600 w-4' : 'bg-ivory-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
