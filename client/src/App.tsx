import { useState } from "react";
import Navbar from "./components/NavBar";
import AnalyzeInput from "./components/AnalyzeInput";
import LoadingState from "./components/LoadingState";
import Report from "./pages/Report";
import { analyze, type AnalysisResult } from "./api/analyze";

type State = "landing" | "loading" | "report";

const exampleCompetitors = [
  "notion.so",
  "linear.app",
  "paystack.com",
  "vercel.com",
];

export default function App() {
  const [state, setState] = useState<State>("landing");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
    const d = url.replace(/^https?:\/\//, "").split("/")[0];
    setDomain(d);
    setError("");
    setState("loading");
    try {
      const data = await analyze(url);
      setResult(data);
      setState("report");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setState("landing");
    }
  };

  const reset = () => {
    setState("landing");
    setResult(null);
    setDomain("");
    setError("");
  };

  if (state === "loading") {
    return (
      <>
        <Navbar onLogoClick={reset} />
        <LoadingState domain={domain} />
      </>
    );
  }

  if (state === "report" && result) {
    return (
      <>
        <Navbar onLogoClick={reset} />
        <Report result={result} onReset={reset} />
      </>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLogoClick={reset} />

      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-50 to-transparent opacity-70" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundRepeat: "repeat",
              width: "100%",
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-[1.04] mb-6">
            Your competitors
            <br />
            are hiding something.
            <br />
            <span className="text-gray-300 italic">Mirra sees it.</span>
          </h1>

          <p className="text-lg text-gray-400 font-light leading-relaxed mb-10 max-w-xl mx-auto">
            Paste any competitor URL. Get real customer complaints, momentum
            signals, and an exact playbook to beat them.
          </p>

          {/* Input */}
          <div className="flex justify-center mb-6">
            <AnalyzeInput
              onAnalyze={handleAnalyze}
              loading={state === "loading"}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 inline-block mb-6">
              {error}
            </p>
          )}

          {/* Example chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-gray-300">Try:</span>
            {exampleCompetitors.map((ex) => (
              <button
                key={ex}
                onClick={() => handleAnalyze(ex)}
                className="text-xs text-gray-400 border cursor-pointer border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 hover:text-gray-600 transition-all bg-white"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </main>
    </div>
  );
}
