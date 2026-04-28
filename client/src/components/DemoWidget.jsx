import { useEffect, useRef } from "react";

const defaultInsights = [
  {
    type: "steal",
    title: "Steal this",
    text: "Hero headline leads with the outcome not the product. Conversion-first copywriting.",
    pill: "↑ Copy the approach",
    pillColor: "text-[#0F9E52] bg-[rgba(15,158,82,0.09)]",
  },
  {
    type: "steal", 
    title: "Steal this",
    text: "Clean 5-item nav with a clear hierarchy. No dropdown complexity above the fold.",
    pill: "↑ Nav structure",
    pillColor: "text-[#0F9E52] bg-[rgba(15,158,82,0.09)]",
  },
  {
    type: "gap",
    title: "Their gap",
    text: "No pricing visible from the landing page — forces sign-up before cost is revealed. High friction for B2B buyers.",
    pill: "↓ Easy to exploit",
    pillColor: "text-[#D93030] bg-[rgba(217,48,48,0.09)]",
  },
  {
    type: "gap",
    title: "Their gap",
    text: "Social proof is customer logos only — no testimonial quotes with names near the CTA.",
    pill: "↓ Outdo with real quotes",
    pillColor: "text-[#D93030] bg-[rgba(217,48,48,0.09)]",
  },
  {
    type: "watch",
    title: "Watch",
    text: "Product demo video is below the fold on mobile — check if that affects their conversion rate.",
    pill: "→ Monitor",
    pillColor: "text-[#C07A00] bg-[rgba(192,122,0,0.09)]",
  },
];

const chips = [
  { label: "Navigation", cls: "top-[10px] left-[10px] text-[#1D6AF8] bg-[rgba(29,106,248,0.12)] border-[rgba(29,106,248,0.22)]" },
  { label: "Logo mark", cls: "top-[10px] left-[96px] text-[#C07A00] bg-[rgba(192,122,0,0.12)] border-[rgba(192,122,0,0.22)]" },
  { label: "Hero section", cls: "top-[52px] left-[10px] text-[#6B3FD4] bg-[rgba(107,63,212,0.12)] border-[rgba(107,63,212,0.22)]" },
  { label: "Primary CTA", cls: "top-[155px] left-[10px] text-[#D93030] bg-[rgba(217,48,48,0.12)] border-[rgba(217,48,48,0.22)]" },
  { label: "Hero visual", cls: "top-[56px] right-[10px] text-[#0F9E52] bg-[rgba(15,158,82,0.12)] border-[rgba(15,158,82,0.22)]" },
  { label: "Trust signals", cls: "top-[210px] left-[10px] text-[#C07A00] bg-[rgba(192,122,0,0.12)] border-[rgba(192,122,0,0.22)]" },
];

function InsightRow({ ins, idx }) {
  const iconColor = ins.type === "steal" ? "var(--green,#0F9E52)" : ins.type === "gap" ? "var(--red,#D93030)" : "var(--amber,#C07A00)";
  const bgColor = ins.type === "steal" ? "rgba(15,158,82,0.09)" : ins.type === "gap" ? "rgba(217,48,48,0.09)" : "rgba(192,122,0,0.09)";
  const typeLabel = ins.type === "steal" ? "STEAL THIS" : ins.type === "gap" ? "THEIR GAP" : "WATCH";

  const iconPath = ins.type === "steal"
    ? <path d="M7 2v10M3 6l4-4 4 4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    : ins.type === "gap"
    ? <path d="M7 12V2M3 8l4 4 4-4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    : <><circle cx="7" cy="7" r="5" stroke={iconColor} strokeWidth="1.5"/><path d="M7 4.5v3l1.5 1.2" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/></>;

  return (
    <div className="flex gap-3 items-start py-3 border-b border-[#E3E1DB] last:border-b-0 last:pb-0"
      style={{ animation: `insRow 0.4s ${idx * 0.15}s both` }}>
      <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: bgColor }}>
        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">{iconPath}</svg>
      </div>
      <div className="flex-1">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.6px] mb-1" style={{ color: iconColor }}>
          {typeLabel}
        </div>
        <div className="text-[13px] text-[#2C2C2C] leading-[1.55] font-light">{ins.text}</div>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-md mt-1.5 ${ins.pillColor}`}>
          {ins.pill}
        </span>
      </div>
    </div>
  );
}

export default function DemoWidget() {
  const fillRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = "71%";
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText("https://mirra.io").catch(() => {});
  };

  const shareX = () => {
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent("Just analyzed a competitor with Mirra 👀\n\nFree to try:") + "&url=" + encodeURIComponent("https://mirra.io"), "_blank");
  };

  const shareLinkedIn = () => {
    window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent("https://mirra.io"), "_blank");
  };

  return (
    <div className="px-6 pb-24 flex flex-col items-center">
      {/* Eyebrow */}
      <div className="text-[11.5px] uppercase tracking-[1.2px] text-[#ABABAB] mb-5 flex items-center gap-2.5">
        <span className="h-px bg-[#E3E1DB] w-12"/>
        Live demo — try it with any URL below
        <span className="h-px bg-[#E3E1DB] w-12"/>
      </div>

      <div className="w-full max-w-[920px] bg-white border border-[#E3E1DB] rounded-[20px] overflow-hidden"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.11), 0 8px 24px rgba(0,0,0,0.06)" }}>

        {/* Chrome bar */}
        <div className="bg-[#F2F1ED] border-b border-[#E3E1DB] px-4 py-3 flex items-center gap-3">
          <div className="flex gap-[5px]">
            <span className="w-[11px] h-[11px] rounded-full bg-[#FF5F57]"/>
            <span className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E]"/>
            <span className="w-[11px] h-[11px] rounded-full bg-[#28C840]"/>
          </div>
          <div className="flex-1 bg-white border border-[#E3E1DB] rounded-lg py-1.5 px-3.5 text-[12.5px] text-[#6A6A6A] text-center mx-3 flex items-center justify-center gap-1.5 overflow-hidden">
            <svg viewBox="0 0 12 12" fill="none" className="w-[11px] h-[11px] text-[#0F9E52] flex-shrink-0">
              <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1"/>
              <path d="M4 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="truncate max-w-[300px]">notion.so — being analyzed</span>
          </div>
          <div className="text-[11.5px] font-medium px-3 py-1 rounded-full bg-[rgba(29,106,248,0.09)] text-[#1D6AF8] flex items-center gap-[5px] whitespace-nowrap">
            <span className="w-[5px] h-[5px] rounded-full bg-[#1D6AF8]" style={{ animation: "pulse 1.2s infinite" }}/>
            Analyzing
          </div>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-[1.15fr_1fr]" style={{ minHeight: "460px" }}>
          {/* Left: preview */}
          <div className="border-r border-[#E3E1DB] bg-[#F5F4F1] relative overflow-hidden">
            {/* Scan beam */}
            <div className="absolute left-0 right-0 h-[3px] pointer-events-none z-10"
              style={{
                background: "linear-gradient(90deg,transparent 0%,rgba(29,106,248,0) 10%,rgba(29,106,248,0.5) 40%,rgba(29,106,248,0.8) 50%,rgba(29,106,248,0.5) 60%,rgba(29,106,248,0) 90%,transparent 100%)",
                animation: "scan 2.8s ease-in-out infinite"
              }}/>
            <div className="absolute left-0 right-0 h-[60px] pointer-events-none z-[9]"
              style={{
                background: "linear-gradient(180deg,rgba(29,106,248,0.06) 0%,transparent 100%)",
                animation: "scanGlow 2.8s ease-in-out infinite"
              }}/>

            {/* Fake site skeleton */}
            <div className="bg-white h-[42px] border-b border-[#eee] flex items-center px-3.5 gap-2.5">
              <div className="w-[54px] h-2 bg-[#111] rounded-sm"/>
              <div className="flex gap-2 ml-auto">
                <div className="w-[26px] h-1.5 bg-[#ddd] rounded-sm"/>
                <div className="w-[26px] h-1.5 bg-[#ddd] rounded-sm"/>
                <div className="w-[26px] h-1.5 bg-[#ddd] rounded-sm"/>
              </div>
              <div className="w-[46px] h-5 bg-[#111] rounded-[4px] ml-2"/>
            </div>
            <div className="grid grid-cols-2 gap-3.5 p-4 pb-0 items-center">
              <div>
                <div className="w-[110px] h-[11px] bg-[#1c1c1c] rounded-sm mb-1.5"/>
                <div className="w-[82px] h-[11px] bg-[#1c1c1c] rounded-sm mb-3.5"/>
                <div className="w-[140px] h-1.5 bg-[#d0d0d0] rounded-sm mb-1"/>
                <div className="w-[110px] h-1.5 bg-[#d0d0d0] rounded-sm mb-4"/>
                <div className="flex gap-1.5">
                  <div className="w-[66px] h-6 bg-[#111] rounded-[4px]"/>
                  <div className="w-[52px] h-6 border-[1.5px] border-[#ccc] rounded-[4px]"/>
                </div>
              </div>
              <div className="rounded-lg h-[110px]" style={{ background: "linear-gradient(145deg,#e5e3df,#d5d3cd)" }}/>
            </div>
            <div className="flex gap-2.5 px-4 py-3.5 items-center">
              {[55,40,55,30].map((w,i) => (
                <div key={i} className="h-[5px] rounded-sm" style={{ width: w, background: i%2===0?"#e0e0e0":"#bbb" }}/>
              ))}
            </div>
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="bg-white rounded-[6px] p-2 border border-[#eee]">
                  <div className="w-4 h-4 bg-[#e8e8e8] rounded-[3px] mb-1"/>
                  <div className="w-[44px] h-1.5 bg-[#ccc] rounded-sm mb-1"/>
                  <div className="w-9 h-[5px] bg-[#e0e0e0] rounded-sm"/>
                </div>
              ))}
            </div>

            {/* AI chips */}
            {chips.map((c, i) => (
              <span key={i}
                className={`absolute text-[9.5px] font-medium px-2 py-[3.5px] rounded-[6px] whitespace-nowrap pointer-events-none flex items-center gap-1 border ${c.cls}`}
                style={{ animation: `chipIn 0.3s ${0.6 + i * 0.4}s both` }}>
                <span className="w-[5px] h-[5px] rounded-full bg-current flex-shrink-0"/>
                {c.label}
              </span>
            ))}

            {/* Score bar */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-[#E3E1DB] px-4 py-3 flex items-center gap-2.5"
              style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)" }}>
              <div className="flex items-center gap-1.5 bg-[rgba(192,122,0,0.09)] border border-[rgba(192,122,0,0.18)] rounded-lg px-3 py-[5px] flex-shrink-0">
                <span className="font-serif text-[19px] font-normal tracking-[-0.5px] text-[#C07A00] leading-none" style={{ fontFamily: "'Fraunces', serif" }}>71</span>
                <span className="text-[9.5px] text-[#6A6A6A] uppercase tracking-[0.4px]">UI Score</span>
              </div>
              <span className="text-[12px] text-[#6A6A6A]">8 components found</span>
              <div className="flex-1 h-1 bg-[#E3E1DB] rounded-sm overflow-hidden">
                <div ref={fillRef} className="h-full rounded-sm transition-all duration-[2s]"
                  style={{ background: "linear-gradient(90deg,#1D6AF8,#6B3FD4)", width: "0%" }}/>
              </div>
              <span className="text-[12px] font-medium text-[#6A6A6A] whitespace-nowrap">71%</span>
            </div>
          </div>

          {/* Right: insights */}
          <div className="hidden lg:flex flex-col p-[22px] overflow-y-auto" style={{ maxHeight: "460px" }}>
            <div className="mb-4">
              <div className="text-sm font-semibold tracking-[-0.2px] mb-0.5">AI Insights — notion.so</div>
              <div className="text-[12px] text-[#6A6A6A] font-light">5 findings · analyzed just now</div>
            </div>
            <div>
              {defaultInsights.map((ins, i) => (
                <InsightRow key={i} ins={ins} idx={i}/>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E3E1DB] bg-[#F2F1ED] px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[13px] text-[#6A6A6A] font-light">
            This is a <strong className="text-[#0A0A0A] font-medium">real Mirra analysis</strong> · Generated in 14s · <span>notion.so</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={copyLink}
              className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-full border-[1.5px] border-[#1D6AF8] text-[#1D6AF8] bg-white cursor-pointer transition-all hover:bg-[#1D6AF8] hover:text-white hover:-translate-y-px font-sans">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M5.5 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-2.5M8.5 1h4v4M12.5 1L7 6.5"/>
              </svg>
              Copy link
            </button>
            <button onClick={shareX}
              className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-full border-[1.5px] border-[#CCCAC3] bg-white text-[#2C2C2C] cursor-pointer transition-all hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] hover:-translate-y-px font-sans">
              <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10.9 1h2.1L8.6 6.1 14 13H9.4L6 8.4 2.1 13H0l4.7-5.4L0 1h4.7l3 4.3L10.9 1z"/>
              </svg>
              Share on X
            </button>
            <button onClick={shareLinkedIn}
              className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-full border-[1.5px] border-[#CCCAC3] bg-white text-[#2C2C2C] cursor-pointer transition-all hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] hover:-translate-y-px font-sans">
              <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M1.6 3.2a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM0 4.7h3.2V14H0V4.7zM5.2 4.7H8v1.3h.04C8.5 5.2 9.6 4.5 11 4.5c3.2 0 3.8 2.1 3.8 4.9V14h-3.1v-4c0-1 0-2.2-1.3-2.2-1.3 0-1.5 1-1.5 2.1V14H5.2V4.7z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan { 0%{top:-5px;opacity:0} 8%{opacity:1} 88%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes scanGlow { 0%{top:-60px} 100%{top:100%} }
        @keyframes chipIn { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
        @keyframes insRow { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>
    </div>
  );
}
