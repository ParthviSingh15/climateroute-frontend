import { useState } from 'react';
import { Sparkles, ChevronDown, X, Send } from 'lucide-react';
import type { RouteData, RouteType, VehicleType } from '@/types';
import { getCorsairResponse } from '@/services/climateService';

interface CorsairAssistantProps {
  routes: RouteData[];
  recommendedRoute: RouteType;
  reason: string;
  vehicle: VehicleType;
}

const QUICK_QUESTIONS = [
  'Why shouldn\'t I take the fastest route?',
  'What happens if I leave 30 minutes later?',
  'Which route is best for my EV?',
  'Can I prioritize shade?',
];

export default function CorsairAssistant({
  routes,
  recommendedRoute,
  reason,
  vehicle,
}: CorsairAssistantProps) {
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const recommended = routes.find((r) => r.type === recommendedRoute);
  const fastest = routes.find((r) => r.type === 'fastest');

  if (!recommended || !fastest) return null;

  const timeDiff = recommended.time - fastest.time;
  const shadeDiff = recommended.shade - fastest.shade;
  const heatReduction = fastest.heat === 'High' ? 36 : 22;

  const handleQuestion = (q: string) => {
    const response = getCorsairResponse(q, routes, recommendedRoute, reason, vehicle);
    setAnswer(response);
    setShowAnswer(true);
    setQuestion('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      handleQuestion(question.trim());
    }
  };

  return (
    <>
      {/* Floating Corsair badge */}
      {!chatOpen && (
        <div
          className="glass-panel rounded-2xl p-3 w-full sm:w-[300px] animate-slide-in-right cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setChatOpen(true)}
        >
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-forest-600 to-teal-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-charcoal-900 uppercase tracking-wider">Corsair</span>
                <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-charcoal-800 leading-snug mb-2">
                I found a better climate trade-off.
              </p>

              {/* Quick stats */}
              <div className="flex gap-1.5 mb-2">
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  +{timeDiff} min
                </span>
                <span className="text-[9px] font-bold text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded-md">
                  +{shadeDiff}% shade
                </span>
                <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md">
                  ↓ {heatReduction}% heat
                </span>
              </div>

              {/* WHY toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="flex items-center gap-1 text-[10px] font-bold text-forest-600 hover:text-forest-700 transition-colors"
              >
                WHY?
                <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>

              {expanded && (
                <p className="text-[10px] text-charcoal-700/70 leading-relaxed mt-2 animate-fade-in">
                  {reason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {chatOpen && (
        <div className="glass-panel rounded-2xl w-full sm:w-[320px] animate-scale-in flex flex-col max-h-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-ivory-300">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-forest-600 to-teal-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-900 uppercase tracking-wider">Corsair</span>
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse inline-block" />
              </div>
            </div>
            <button
              onClick={() => { setChatOpen(false); setShowAnswer(false); }}
              className="w-6 h-6 rounded-lg hover:bg-ivory-200 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-charcoal-700/60" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3 overflow-y-auto flex-1 space-y-2">
            {!showAnswer ? (
              <>
                <p className="text-[11px] text-charcoal-700/70 mb-2">
                  Ask me about your route:
                </p>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuestion(q)}
                    className="w-full text-left text-[11px] text-charcoal-800 bg-ivory-100 hover:bg-ivory-200 rounded-lg px-3 py-2 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </>
            ) : (
              <div className="animate-fade-in">
                <div className="bg-forest-50 rounded-lg p-2.5 mb-2">
                  <p className="text-[11px] text-charcoal-800 leading-relaxed">{answer}</p>
                </div>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="text-[10px] font-bold text-forest-600 hover:text-forest-700 transition-colors"
                >
                  ← Ask another question
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-2 border-t border-ivory-300">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your route..."
                className="flex-1 text-[11px] bg-ivory-100/80 border border-ivory-300 rounded-lg px-2.5 py-2 text-charcoal-900 placeholder-charcoal-700/40 focus:outline-none focus:border-forest-400 transition-all"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-lg bg-forest-600 hover:bg-forest-700 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
