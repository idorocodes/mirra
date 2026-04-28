const CheckIcon = ({ green }) => (
  <svg viewBox="0 0 14 14" fill="none" className={`w-3.5 h-3.5 flex-shrink-0 mt-px ${green ? "text-[#0F9E52]" : "text-[#CCCAC3]"}`}>
    {green
      ? <path d="M2.5 7l3 3 6-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      : <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>}
  </svg>
);

const plans = [
  {
    tier: "Free",
    price: "$0",
    period: "Forever free · no card",
    hot: false,
    feats: [
      [true, "3 analyses / month"],
      [true, "Component labeling"],
      [true, "Shareable report card"],
      [false, "PDF export"],
      [false, "Batch analysis"],
    ],
    cta: "Start free",
  },
  {
    tier: "Pro",
    price: "$79",
    period: "per month · cancel anytime",
    hot: true,
    tag: "Most popular",
    feats: [
      [true, "Unlimited analyses"],
      [true, "Full AI brief"],
      [true, "PDF + Figma export"],
      [true, "Comparison mode"],
      [true, "History & saved analyses"],
    ],
    cta: "Start Pro",
  },
  {
    tier: "Agency",
    price: "$249",
    period: "per month · 5 seats",
    hot: false,
    feats: [
      [true, "Everything in Pro"],
      [true, "White-label reports"],
      [true, "Batch CSV (30 URLs)"],
      [true, "Client workspaces"],
      [true, "Priority support"],
    ],
    cta: "Start Agency",
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "Contact us · unlimited seats",
    hot: false,
    feats: [
      [true, "Everything in Agency"],
      [true, "Unlimited seats"],
      [true, "SSO / SAML"],
      [true, "Change detection"],
      [true, "Dedicated success manager"],
    ],
    cta: "Talk to sales",
    customPrice: true,
  },
];

export default function Pricing({ onSignup }) {
  return (
    <section id="pricing" className="bg-white border-t border-b border-[#E3E1DB] py-20 px-6">
      <div className="max-w-[1160px] mx-auto">
        <p className="text-[11.5px] uppercase tracking-[1.2px] text-[#ABABAB] mb-3">Pricing</p>
        <h2 className="font-serif font-light tracking-[-1.5px] leading-[1.1] mb-3.5 text-[#0A0A0A]"
          style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px,3.2vw,46px)" }}>
          Built for teams<br/>
          <em className="font-extralight text-[#6A6A6A]" style={{ fontStyle: "italic" }}>that move fast.</em>
        </h2>
        <p className="text-[15.5px] text-[#6A6A6A] font-light leading-[1.7] max-w-[520px] mb-3">
          Start free. Agencies make back the plan cost on a single client report.
        </p>
        <p className="text-[13.5px] text-[#6A6A6A] font-light mb-12">
          <strong className="text-[#2C2C2C] font-medium">The math:</strong> Agency plan = $249/mo. One client audit billed at $500. <strong className="text-[#2C2C2C] font-medium">Profitable from day one.</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {plans.map((p) => (
            <div key={p.tier}
              className={`border rounded-[20px] p-7 relative transition-shadow hover:shadow-lg ${
                p.hot ? "bg-[#0A0A0A] border-[#0A0A0A]" : "bg-[#F9F9F7] border-[#E3E1DB]"
              }`}>
              {p.tag && (
                <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-[#1D6AF8] text-white text-[11px] font-medium px-3.5 py-[3px] rounded-full whitespace-nowrap">
                  {p.tag}
                </div>
              )}
              <div className={`text-[11px] uppercase tracking-[0.9px] font-medium mb-3 ${p.hot ? "text-white/40" : "text-[#6A6A6A]"}`}>
                {p.tier}
              </div>
              <div className={`font-serif font-light leading-none mb-1 ${p.hot ? "text-white" : "text-[#0A0A0A]"} ${p.customPrice ? "text-[30px] tracking-[-1px]" : "text-[46px] tracking-[-2px]"}`}
                style={{ fontFamily: "'Fraunces', serif" }}>
                {!p.customPrice && <sup className="text-xl align-super tracking-normal">$</sup>}
                {p.customPrice ? "Custom" : p.price.replace("$", "")}
              </div>
              <div className={`text-[12.5px] mt-1 mb-5 ${p.hot ? "text-white/35" : "text-[#ABABAB]"}`}>
                {p.period}
              </div>
              <hr className={`mb-[18px] border-none h-px ${p.hot ? "bg-white/10" : "bg-[#E3E1DB]"}`}/>
              <ul className="list-none mb-6 flex flex-col gap-2">
                {p.feats.map(([yes, txt], i) => (
                  <li key={i} className={`text-[13px] flex items-start gap-2 leading-snug font-light ${p.hot ? "text-white/70" : "text-[#2C2C2C]"}`}>
                    {p.hot
                      ? <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 flex-shrink-0 mt-px">
                          <path d="M2.5 7l3 3 6-5.5" stroke="#86EFAC" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      : <CheckIcon green={yes}/>
                    }
                    {txt}
                  </li>
                ))}
              </ul>
              <button
                onClick={onSignup}
                className={`block w-full text-center py-2.5 rounded-lg font-sans text-[13.5px] font-medium cursor-pointer border transition-all hover:opacity-85 hover:-translate-y-px ${
                  p.hot
                    ? "bg-white text-[#0A0A0A] border-transparent"
                    : "bg-white text-[#0A0A0A] border-[#CCCAC3]"
                }`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
