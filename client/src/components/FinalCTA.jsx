import { useState } from "react";

export default function FinalCTA({ onSignup }) {
  const [url, setUrl] = useState("");

  const handleGo = () => {
    if (!url.trim()) return;
    onSignup();
  };

  return (
    <section className="py-20 px-6 max-w-[920px] mx-auto text-center">
      <div className="bg-[#0A0A0A] rounded-3xl px-8 sm:px-16 py-16 sm:py-[72px] relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute pointer-events-none"
          style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(29,106,248,0.22),transparent 65%)", top: -100, right: -100 }}/>
        <div className="absolute pointer-events-none"
          style={{ width: 320, height: 320, background: "radial-gradient(circle,rgba(107,63,212,0.14),transparent 65%)", bottom: -80, left: -80 }}/>

        <p className="text-[11.5px] uppercase tracking-[1.2px] text-white/30 mb-3.5 relative z-10">Get started today</p>
        <h2 className="font-serif font-light tracking-[-2px] leading-[1.08] text-white mb-3 relative z-10"
          style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px,3.8vw,52px)" }}>
          Stop guessing.<br/>
          <em className="font-extralight text-white/40" style={{ fontStyle: "italic" }}>Start seeing.</em>
        </h2>
        <p className="text-[15px] text-white/45 font-light mb-8 relative z-10">
          Analyze your first competitor URL free. No credit card. 15 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 max-w-[440px] mx-auto mb-3 relative z-10">
          <input
            className="flex-1 bg-white/10 border border-white/20 rounded-lg text-white font-sans text-sm px-4 py-3.5 outline-none placeholder-white/30 transition-colors focus:border-white/40 font-light min-w-0"
            type="url"
            placeholder="https://yourcompetitor.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGo()}
          />
          <button
            onClick={handleGo}
            className="bg-white text-[#0A0A0A] border-none px-6 py-3.5 rounded-lg font-sans text-sm font-medium cursor-pointer transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            Analyze free →
          </button>
        </div>
        <p className="text-[12px] text-white/25 relative z-10">
          Join 1,200+ agencies and growth teams already using Mirra
        </p>
      </div>
    </section>
  );
}
