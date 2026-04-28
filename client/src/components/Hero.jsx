import { useEffect, useState } from "react";

const LockIcon = () => (
  <svg viewBox="0 0 13 13" fill="none" className="w-3 h-3 flex-shrink-0">
    <rect x="2.5" y="5.5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M4.5 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
    <circle cx="6" cy="6" r="4"/>
    <path d="M10 10l2.5 2.5"/>
  </svg>
);

const avatarColors = ["#7C3AED","#0891B2","#16A34A","#D97706","#DC2626"];
const avatarLetters = ["A","S","M","R","K"];

export default function Hero({ onSignup }) {
  const [url, setUrl] = useState("");
  const [dotOn, setDotOn] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setDotOn(v => !v), 1000);
    return () => clearInterval(t);
  }, []);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    onSignup();
  };

  return (
    <section className="relative overflow-hidden flex flex-col items-center text-center pt-24 pb-16 px-6"
      style={{ minHeight: "100vh" }}>
      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 75% 55% at 50% -5%,rgba(29,106,248,0.07) 0%,transparent 65%), radial-gradient(ellipse 40% 35% at 85% 75%,rgba(107,63,212,0.04) 0%,transparent 55%)"
      }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.022) 1px,transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%,black 30%,transparent 80%)"
      }}/>

      {/* Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 bg-white border border-[#E3E1DB] rounded-full px-4 py-1.5 text-[12.5px] text-[#6A6A6A] mb-8"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#1D6AF8]"
          style={{ animation: "pulse 2s infinite" }}/>
        AI-powered competitive UI intelligence
      </div>

      {/* Headline */}
      <h1 className="relative z-10 font-serif font-light tracking-[-2.5px] leading-[1.04] mb-6 max-w-3xl text-[#0A0A0A]"
        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(44px,6.5vw,88px)" }}>
        Your competitors are<br/>hiding something.<br/>
        <em className="font-extralight text-[#6A6A6A] not-italic"
          style={{ fontStyle: "italic" }}>Mirra sees it.</em>
      </h1>

      {/* Subhead */}
      <p className="relative z-10 text-[#6A6A6A] leading-[1.7] max-w-[480px] mb-9 font-light"
        style={{ fontSize: "clamp(15.5px,1.8vw,18px)" }}>
        Paste any URL. Get a complete AI breakdown of their UI — every component labeled, every weakness exposed, every opportunity mapped.
      </p>

      {/* Input */}
      <div className="relative z-10 w-full max-w-[520px] mb-3.5">
        <div className="flex bg-white border-[1.5px] border-[#CCCAC3] rounded-2xl overflow-hidden transition-all"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.7) inset" }}
          onFocusCapture={e => e.currentTarget.style.borderColor = "#1D6AF8"}
          onBlurCapture={e => e.currentTarget.style.borderColor = "#CCCAC3"}>
          <input
            className="flex-1 border-none outline-none bg-transparent px-[18px] py-4 font-sans text-[14.5px] text-[#0A0A0A] font-light min-w-0"
            style={{ "::placeholder": { color: "#ABABAB" } }}
            type="url"
            placeholder="https://competitor.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            className="bg-[#0A0A0A] text-white border-none px-5 font-sans text-sm font-medium cursor-pointer whitespace-nowrap transition-colors hover:bg-[#1a1a1a] flex items-center gap-1.5 m-1.5 rounded-[10px]"
          >
            <SearchIcon />
            Analyze now
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="relative z-10 text-[12.5px] text-[#ABABAB] flex items-center gap-1.5">
        <LockIcon />
        Free · No credit card · Results in 15 seconds
      </div>

      {/* Social proof */}
      <div className="relative z-10 flex items-center gap-3 mt-7">
        <div className="flex">
          {avatarLetters.map((l, i) => (
            <span key={i}
              className="w-[26px] h-[26px] rounded-full border-[2.5px] border-[#F9F9F7] flex items-center justify-center text-[10.5px] font-semibold text-white"
              style={{ background: avatarColors[i], marginLeft: i === 0 ? 0 : "-7px" }}>
              {l}
            </span>
          ))}
        </div>
        <div className="text-[12.5px] text-[#6A6A6A]">
          Trusted by <strong className="text-[#2C2C2C] font-medium">1,200+ agencies &amp; growth teams</strong>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </section>
  );
}
