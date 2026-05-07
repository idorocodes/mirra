import type { AnalysisResult } from '../../api/analyze';

const effortConfig = {
  Low: { label: 'Low Effort', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
  Medium: { label: 'Med Effort', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  High: { label: 'High Effort', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
};

const impactConfig = {
  Low: { label: 'Low Impact', bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100' },
  Medium: { label: 'Med Impact', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  High: { label: 'High Impact', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
};

export default function PriorityActions({ data }: { data: AnalysisResult['priorityActions'] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">Step 3 of 5</p>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Priority Actions</h2>
          <p className="text-sm text-gray-400 mt-1">Ranked by impact and feasibility — start at the top.</p>
        </div>
      </div>

      {data.map((item, i) => {
        const effort = effortConfig[item.effort] ?? effortConfig.Medium;
        const impact = impactConfig[item.impact] ?? impactConfig.Medium;
        const isTop = i === 0;

        return (
          <div
            key={i}
            className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-sm
              ${isTop ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-100 hover:border-gray-200'}`}
          >
            {isTop && (
              <div className="absolute -top-2.5 left-5">
                <span className="text-[9px] font-bold bg-amber-400 text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                  Start Here
                </span>
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
                  ${isTop ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 mb-1.5 leading-snug">{item.action}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">{item.why}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${effort.bg} ${effort.text} ${effort.border}`}>
                      {effort.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${impact.bg} ${impact.text} ${impact.border}`}>
                      {impact.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}