export default function RecentMoves({ moves }: {
  moves: { headline: string; whatItMeans: string }[]
}) {
  if (!moves?.length) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
      <p className="text-sm text-gray-400">No recent news found for this competitor.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-1">Recent Moves</p>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Last 30 Days</h2>
          <p className="text-sm text-gray-400 mt-1">What they've been up to and what it means for you.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-gray-900">{moves.length}</span>
          <p className="text-xs text-gray-400">signals</p>
        </div>
      </div>

      {moves.map((move, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200">
          <div className="h-0.5 bg-gray-100">
            <div className="h-full bg-purple-400 w-full" />
          </div>
          <div className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{move.headline}</p>
            </div>
            <div className="ml-10 bg-purple-50 border border-purple-100 rounded-xl p-3.5">
              <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-1.5">What This Means</p>
              <p className="text-xs font-medium text-gray-700 leading-relaxed">{move.whatItMeans}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}