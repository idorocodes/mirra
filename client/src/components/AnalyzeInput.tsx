import { useState } from 'react';
import { ArrowRight, Globe } from 'lucide-react';

export default function AnalyzeInput({ onAnalyze, loading }: {
  onAnalyze: (url: string) => void;
  loading: boolean;
}) {
  const [url, setUrl] = useState('');

  const handle = () => {
    if (url.trim()) onAnalyze(url.trim());
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-violet-400 focus-within:shadow-lg focus-within:shadow-violet-100 transition-all duration-300">
        <div className="pl-4 text-gray-300">
          <Globe className="w-4 h-4" />
        </div>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          placeholder="notion.so, paystack.com, linear.app..."
          className="flex-1 px-3 py-4 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 font-light"
        />
        <button
          onClick={handle}
          disabled={loading || !url.trim()}
          className="bg-gray-900 text-white px-5 py-2.5 m-1.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              Analyze
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">Paste any competitor URL · Takes ~15 seconds</p>
    </div>
  );
}