export default function Navbar({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 flex items-center px-6 justify-between bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <button onClick={onLogoClick} className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center group-hover:bg-gray-700 transition-colors">
          <svg viewBox="0 0 17 17" fill="none" className="w-4 h-4">
            <path d="M1.5 8.5c0 0 2.8-5 7-5s7 5 7 5-2.8 5-7 5-7-5-7-5z" stroke="white" strokeWidth="1.3" fill="none"/>
            <circle cx="8.5" cy="8.5" r="2.2" fill="white"/>
            <circle cx="8.5" cy="8.5" r=".9" fill="#0A0A0A"/>
          </svg>
        </div>
        <span className="font-semibold text-gray-900 tracking-tight text-lg">Mirra</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
          Competitor Intelligence
        </span>
      </div>
    </nav>
  );
}