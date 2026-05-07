import type { AnalysisResult } from '../../api/analyze';

const trendConfig = {
  Growing: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', bar: 'bg-green-400' },
  Stable: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', bar: 'bg-blue-400' },
  Declining: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', bar: 'bg-red-400' },
  Unknown: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-100', bar: 'bg-gray-300' },
} as const;

export default function TrafficIntelligence({ traffic, intelligence }: {
  traffic: AnalysisResult['trafficData'];
  intelligence?: { summary: string; isGrowing: boolean; keyInsight: string };
}) {
  if (!traffic?.hasTrafficData) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
      <p className="text-sm text-gray-400">Traffic data unavailable for this domain.</p>
    </div>
  );

  const trend = (traffic.trend as keyof typeof trendConfig) ?? 'Unknown';
  const tc = trendConfig[trend] ?? trendConfig.Unknown;

  const stats = [
    { label: 'Monthly Visits', value: traffic.monthlyVisits ?? 'N/A' },
    { label: 'vs Last Month', value: traffic.changePercent ?? 'N/A' },
    { label: 'Bounce Rate', value: traffic.bounceRate ?? 'N/A' },
    { label: 'Pages / Visit', value: traffic.pagesPerVisit ?? 'N/A' },
    { label: 'Avg Duration', value: traffic.avgVisitDuration ?? 'N/A' },
    { label: 'Global Rank', value: traffic.globalRank ? `#${traffic.globalRank}` : 'N/A' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Traffic Intelligence</p>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Growth Signals</h2>
          <p className="text-sm text-gray-400 mt-1">Real traffic data from SimilarWeb.</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
          {trend}
        </span>
      </div>

      {/* Stats grid */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-all duration-200">
        <div className={`h-0.5 ${tc.bar}`} />
        <div className="grid grid-cols-3 divide-x divide-y divide-gray-100">
          {stats.map((stat, i) => (
            <div key={i} className="p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic sources */}
      {traffic.topSources && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-all duration-200">
          <div className="h-0.5 bg-gray-100" />
          <div className="p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Traffic Sources</p>
            <div className="space-y-3">
              {Object.entries(traffic.topSources).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 capitalize w-14 flex-shrink-0">{key}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: val }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-10 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key insight */}
      {intelligence?.keyInsight && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-2">Key Insight</p>
          <p className="text-sm font-medium text-gray-700 leading-relaxed">{intelligence.keyInsight}</p>
        </div>
      )}
    </div>
  );
}