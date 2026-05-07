import type { AnalysisResult } from '../../api/analyze';

const freqConfig = {
  High: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', bar: 'bg-red-400', width: 'w-full' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', bar: 'bg-amber-400', width: 'w-2/3' },
  Low: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', bar: 'bg-blue-400', width: 'w-1/3' },
} as const;

export default function CustomerAmmunition({ data }: { data: AnalysisResult['customerAmmunition'] }) {
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-1">Step 2 of 5</p>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Customer Ammunition</h2>
          <p className="text-sm text-gray-400 mt-1">Real complaints you can weaponize in your positioning.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-gray-900">{items.length}</span>
          <p className="text-xs text-gray-400">patterns found</p>
        </div>
      </div>

      {items.map((item, i) => {
        const freq = freqConfig[item.frequency] ?? freqConfig.Low;
        return (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200">
            {/* Frequency bar */}
            <div className="h-0.5 bg-gray-100">
              <div className={`h-full ${freq.bar} ${freq.width} transition-all`} />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{item.complaint}</p>
                </div>
                <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${freq.bg} ${freq.text} ${freq.border}`}>
                  {item.frequency}
                </span>
              </div>

              {/* Quote */}
              <div className="ml-10 mb-4">
                <blockquote className="relative pl-3 border-l-2 border-gray-200">
                  <p className="text-xs text-gray-400 italic leading-relaxed">"{item.quote}"</p>
                </blockquote>
              </div>

              {/* Your angle */}
              <div className="ml-10 bg-green-50 border border-green-100 rounded-xl p-3.5">
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1.5">Your Angle</p>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">{item.yourAngle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}