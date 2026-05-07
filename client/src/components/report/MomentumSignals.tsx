import type { AnalysisResult } from '../../api/analyze';

const overallConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Accelerating: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: '↑ Accelerating' },
  Stable: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: '→ Stable' },
  Slowing: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', label: '↓ Slowing' },
  Unknown: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: '? Unknown' },
};

export default function MomentumSignals({ data }: { data: AnalysisResult['momentumSignals'] }) {
  const overall = overallConfig[data.overall] ?? overallConfig.Unknown;

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Step 5 of 5</p>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Momentum Signals</h2>
        <p className="text-sm text-gray-400 mt-1">Where they're headed — and what it means for you.</p>
      </div>

      {/* Overall badge */}
      <div className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border ${overall.bg} ${overall.text} ${overall.border}`}>
        {overall.label}
      </div>

      {/* Signals */}
      <div className="space-y-2">
        {data.signals.map((s, i) => (
          <div key={i} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-all">
            <span className="text-xl flex-shrink-0 w-8 text-center">{s.emoji}</span>
            <p className="text-sm text-gray-600 leading-relaxed font-light">{s.text}</p>
          </div>
        ))}
      </div>

      {/* What it means */}
      <div className="bg-gray-900 rounded-2xl p-5">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">What This Means For You</p>
        <p className="text-sm text-white font-medium leading-relaxed">{data.whatItMeans}</p>
      </div>
    </div>
  );
}