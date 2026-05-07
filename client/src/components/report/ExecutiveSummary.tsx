import type { AnalysisResult } from '../../api/analyze';

const verdictConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Serious threat': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
  'Beatable': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  'Opportunity': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-400' },
};

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return [val];
  return [];
}

export default function ExecutiveSummary({ data }: { data: AnalysisResult['executiveSummary'] }) {
  const strengths = toArray(data.strengths);
  const weaknesses = toArray(data.weaknesses);
  const verdict = verdictConfig[data.verdict] ?? { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Step 4 of 5</p>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Executive Summary</h2>
        <p className="text-sm text-gray-400 mt-1">The full picture in one view.</p>
      </div>

      {/* What they do */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">What They Do</p>
        <p className="text-sm text-gray-600 leading-relaxed font-light">{data.what}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-3">Strengths</p>
          <ul className="space-y-2.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-xs text-gray-600 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3">Weaknesses</p>
          <ul className="space-y-2.5">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M2 2L6 6M6 2L2 6" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="text-xs text-gray-600 leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verdict */}
      <div className={`flex items-center gap-3 border rounded-2xl px-5 py-4 ${verdict.bg} ${verdict.border}`}>
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${verdict.dot}`} />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Verdict</p>
          <p className={`text-sm font-semibold ${verdict.text}`}>{data.verdict}</p>
        </div>
      </div>
    </div>
  );
}