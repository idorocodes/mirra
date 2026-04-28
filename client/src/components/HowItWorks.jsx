const steps = [
  {
    n: "Step 01",
    title: "Paste any URL",
    desc: "Drop in a competitor's landing page or upload a CSV to sweep 30 sites at once. Works on SPAs, dynamic pages, any modern stack.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M13 3H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7.5L13 3z"/>
        <path d="M13 3v5h5M8 12h6M8 9h4"/>
      </svg>
    ),
  },
  {
    n: "Step 02",
    title: "AI labels everything",
    desc: "Every component identified and labeled at 85%+ accuracy. Nav, hero, CTAs, pricing, trust signals, forms — all mapped and scored.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="w-[22px] h-[22px]">
        <circle cx="11" cy="11" r="7"/>
        <path d="M11 5v3M11 13v3M5 11h3M13 11h3"/>
        <circle cx="11" cy="11" r="2"/>
      </svg>
    ),
  },
  {
    n: "Step 03",
    title: "Get your brief",
    desc: "Steal, exploit, or watch — every insight is actionable. Export as PDF or Figma JSON. Share in Slack or brief a client in minutes.",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M9 11l2.5 2.5 5-5"/>
        <path d="M5 3h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 max-w-[1160px] mx-auto">
      <p className="text-[11.5px] uppercase tracking-[1.2px] text-[#ABABAB] mb-3">How it works</p>
      <h2 className="font-serif font-light tracking-[-1.5px] leading-[1.1] mb-3.5 text-[#0A0A0A]"
        style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px,3.2vw,46px)" }}>
        URL to brief.<br/>
        <em className="font-extralight text-[#6A6A6A]" style={{ fontStyle: "italic" }}>15 seconds.</em>
      </h2>
      <p className="text-[15.5px] text-[#6A6A6A] font-light leading-[1.7] max-w-[520px] mb-14">
        No setup. No extensions. No integrations. Paste a URL and get a full competitive analysis you can act on today.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {steps.map((s) => (
          <div key={s.n}
            className="bg-white border border-[#E3E1DB] rounded-2xl p-8 transition-all hover:shadow-lg hover:border-[#CCCAC3]">
            <div className="text-[11px] text-[#ABABAB] uppercase tracking-[0.5px] mb-4">{s.n}</div>
            <div className="w-11 h-11 rounded-xl border border-[#E3E1DB] bg-[#F2F1ED] flex items-center justify-center mb-[18px] text-[#2C2C2C]">
              {s.icon}
            </div>
            <h3 className="text-[17px] font-medium tracking-[-0.3px] mb-2.5">{s.title}</h3>
            <p className="text-sm text-[#6A6A6A] leading-[1.7] font-light">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
