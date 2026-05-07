const steps = [
  { label: 'Taking live screenshot', icon: '📸' },
  { label: 'Fetching customer reviews', icon: '⭐' },
  { label: 'Reading market signals', icon: '📡' },
  { label: 'Building intelligence report', icon: '🧠' },
];

export default function LoadingState({ domain }: { domain: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-10 px-6 pt-14">
      {/* Animated logo mark */}
      <div className="relative">
        <div className="w-14 h-14 border-2 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-violet-500 rounded-full opacity-20 animate-pulse" />
        </div>
      </div>

      <div className="text-center max-w-sm">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-3">Analyzing</p>
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">{domain}</h2>
        <p className="text-sm text-gray-400 font-light">Reading their website, reviews, and signals across the web.</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <span className="text-base">{step.icon}</span>
            <p className="text-sm text-gray-500 font-light">{step.label}</p>
            <div
              className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}