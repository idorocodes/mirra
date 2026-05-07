import type { AnalysisResult } from '../../api/analyze';
import { RefreshCw } from 'lucide-react';

const threatConfig = {
  High: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  Low: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
};

const positionConfig = {
  Growing: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  Plateau: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  Declining: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

export default function ReportHeader({ result, onReset }: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const threat = threatConfig[result.threatLevel] ?? threatConfig.Medium;
  const position = positionConfig[result.marketPosition] ?? positionConfig.Plateau;

  const gapPercent = Math.min(100, Math.max(0, result.gapScore));

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          {/* Left: domain + badges */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Competitor Intelligence Report</p>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-4">{result.domain}</h1>

            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${threat.bg} ${threat.text} ${threat.border}`}>
                {result.threatLevel} Threat
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${position.bg} ${position.text} ${position.border}`}>
                {result.marketPosition}
              </span>
            </div>

            {/* Gap score bar */}
            <div className="max-w-xs">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gap Score</p>
                <p className="text-xs font-bold text-gray-700">{result.gapScore}/100</p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
                  style={{ width: `${gapPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: score ring + reset */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f3f4f6" strokeWidth="4"/>
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="#7c3aed" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.overallScore / 100) * 213.6} 213.6`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 leading-none">{result.overallScore}</span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">Score</span>
                </div>
              </div>
            </div>

            <button
              onClick={onReset}
              className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}