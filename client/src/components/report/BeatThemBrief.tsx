import type { AnalysisResult } from '../../api/analyze';

const rows = [
  { label: 'Headline', key: 'headline', icon: '✦' },
  { label: 'Offer Angle', key: 'offerAngle', icon: '◈' },
  { label: 'CTA', key: 'cta', icon: '→' },
  { label: 'Where to Find Customers', key: 'whereToFindCustomers', icon: '◎' },
  { label: 'How to Persuade', key: 'persuasionAngle', icon: '◆' },
] as const;

export default function BeatThemBrief({ data }: { data: AnalysisResult['beatThemBrief'] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-1">Step 1 of 5</p>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Beat Them Brief</h2>
          <p className="text-sm text-gray-400 mt-1">Your ready-to-use competitive messaging — deploy it today.</p>
        </div>
        <span className="text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 rounded-full px-3 py-1.5 uppercase tracking-widest">Use This Today</span>
      </div>

      {rows.map((row) => (
        <div
          key={row.key}
          className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 text-sm flex-shrink-0 group-hover:bg-purple-50 group-hover:border-purple-100 group-hover:text-purple-500 transition-all">
              {row.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{row.label}</p>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">{data[row.key]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}