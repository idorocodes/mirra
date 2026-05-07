import { useState } from "react";
import type { AnalysisResult } from "../api/analyze.ts";
import ReportHeader from "../components/report/ReportHeader.tsx";
import BeatThemBrief from "../components/report/BeatThemBrief.tsx";
import CustomerAmmunition from "../components/report/CustomerAmmunition";
import PriorityActions from "../components/report/PriorityActions";
import ExecutiveSummary from "../components/report/ExecutiveSummary";
import RecentMoves from "../components/report/RecentMoves";
import MomentumSignals from "../components/report/MomentumSignals";
import TrafficIntelligence from "../components/report/TrafficIntelligence.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  { id: "brief", shortLabel: "Brief", emoji: "⚔️", description: "Messaging & positioning", color: "violet" },
  { id: "ammunition", shortLabel: "Ammo", emoji: "🎯", description: "Real complaint patterns", color: "red" },
  { id: "actions", shortLabel: "Actions", emoji: "⚡", description: "What to do next", color: "amber" },
  { id: "momentum", shortLabel: "Signals", emoji: "📈", description: "Where they're headed", color: "blue" },
  { id: "intel", shortLabel: "Intel", emoji: "🔍", description: "Traffic & recent moves", color: "purple" },
  { id: "summary", shortLabel: "Summary", emoji: "📋", description: "Strengths & weaknesses", color: "green" },
];

const stepColors: Record<string, { active: string; done: string; dot: string; tab: string }> = {
  violet: { active: "border-violet-500 bg-violet-50/60", done: "border-green-400", dot: "bg-violet-500", tab: "text-violet-600" },
  red:    { active: "border-red-400 bg-red-50/60",       done: "border-green-400", dot: "bg-red-400",    tab: "text-red-500" },
  amber:  { active: "border-amber-400 bg-amber-50/60",   done: "border-green-400", dot: "bg-amber-400",  tab: "text-amber-600" },
  blue:   { active: "border-blue-400 bg-blue-50/60",     done: "border-green-400", dot: "bg-blue-400",   tab: "text-blue-600" },
  purple: { active: "border-purple-500 bg-purple-50/60", done: "border-green-400", dot: "bg-purple-500", tab: "text-purple-600" },
  green:  { active: "border-green-500 bg-green-50/60",   done: "border-green-400", dot: "bg-green-500",  tab: "text-green-600" },
};

export default function Report({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;
  const current = STEPS[currentStep];
  const colors = stepColors[current.color];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Report Header */}
      <div className="pt-14">
        <ReportHeader result={result} onReset={onReset} />
      </div>

      {/* Sticky stepper */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-stretch overflow-x-auto">
            {STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep;
              const c = stepColors[step.color];
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(i)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-5 py-3.5 border-b-2 transition-all duration-200 text-center min-w-[90px]
                    ${isActive ? c.active : isDone ? "border-green-400 bg-white hover:bg-gray-50" : "border-transparent bg-white hover:bg-gray-50"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                    ${isActive ? `${c.dot} text-white` : isDone ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {isDone ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-[11px] font-semibold leading-tight
                    ${isActive ? c.tab : isDone ? "text-green-600" : "text-gray-400"}`}
                  >
                    {step.shortLabel}
                  </span>
                </button>
              );
            })}
            <div className="ml-auto flex items-center px-4 text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Step label */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">{current.emoji}</span>
          <p className="text-xs text-gray-400 font-medium">{current.description}</p>
        </div>

        {/* Panel */}
        <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
          {currentStep === 0 && <BeatThemBrief data={result.beatThemBrief} />}
          {currentStep === 1 && <CustomerAmmunition data={result.customerAmmunition} />}
          {currentStep === 2 && <PriorityActions data={result.priorityActions} />}
          {currentStep === 3 && <MomentumSignals data={result.momentumSignals} />}
          {currentStep === 4 && (
            <div className="space-y-4">
              <TrafficIntelligence
                traffic={result.trafficData}
                intelligence={result.trafficIntelligence}
              />
              <RecentMoves moves={result.recentMoves || []} />
            </div>
          )}
          {currentStep === 5 && <ExecutiveSummary data={result.executiveSummary} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? `w-6 h-2 ${stepColors[step.color].dot}`
                    : i < currentStep
                    ? "w-2 h-2 bg-green-400"
                    : "w-2 h-2 bg-gray-200"
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-700 transition-all"
            >
              New Analysis
            </button>
          ) : (
            <button
              onClick={goNext}
              className={`flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-xl transition-all active:scale-95
                ${colors.dot} hover:opacity-90`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}