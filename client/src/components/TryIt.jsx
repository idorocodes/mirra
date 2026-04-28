import { useState } from "react";

export default function TryIt({ onSignup }) {
  const [url, setUrl] = useState("");

  const handleAnalyze = () => {
    if (!url.trim()) return;
    onSignup();
  };

  return (
    <section id="try-it" className="bg-white border-t border-b border-[#E3E1DB] py-20 px-6 text-center">
      <div className="max-w-[600px] mx-auto">
        <p className="text-[11.5px] uppercase tracking-[1.2px] text-[#ABABAB] mb-3.5">Try Mirra now</p>
        <h2 className="font-serif font-light tracking-[-1.5px] leading-[1.1] mb-3.5 text-[#0A0A0A]"
          style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,3.5vw,44px)" }}>
          Analyze any URL.<br/>
          <em className="font-extralight text-[#6A6A6A]" style={{ fontStyle: "italic" }}>Free, instantly.</em>
        </h2>
        <p className="text-[15px] text-[#6A6A6A] font-light mb-8">
          No account needed. Paste a URL and see what Mirra finds in seconds.
        </p>
        <div
          className="flex bg-white border-[1.5px] border-[#CCCAC3] rounded-xl overflow-hidden max-w-[480px] mx-auto mb-3 transition-all"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
          onFocusCapture={e => e.currentTarget.style.borderColor = "#1D6AF8"}
          onBlurCapture={e => e.currentTarget.style.borderColor = "#CCCAC3"}
        >
          <input
            className="flex-1 border-none outline-none bg-transparent px-4 py-3.5 font-sans text-[14.5px] text-[#0A0A0A] font-light min-w-0"
            type="url"
            placeholder="https://yourcompetitor.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            className="bg-[#1D6AF8] text-white border-none px-6 py-3 font-sans text-sm font-medium cursor-pointer whitespace-nowrap transition-colors hover:bg-[#1558e0]"
          >
            Analyze →
          </button>
        </div>
        <p className="text-[12px] text-[#ABABAB]">
          Free plan includes 3 analyses/month. No credit card required.
        </p>
      </div>
    </section>
  );
}
