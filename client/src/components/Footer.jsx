const EyeIcon = () => (
  <svg viewBox="0 0 17 17" fill="none" className="w-[14px] h-[14px]">
    <path d="M1.5 8.5c0 0 2.8-5 7-5s7 5 7 5-2.8 5-7 5-7-5-7-5z" stroke="white" strokeWidth="1.4" fill="none"/>
    <circle cx="8.5" cy="8.5" r="2.2" fill="white"/>
    <circle cx="8.5" cy="8.5" r=".85" fill="#0A0A0A"/>
  </svg>
);

const cols = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Changelog", "API Docs"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "GDPR"],
  },
];

const badges = [
  { label: "SOC 2", icon: <svg viewBox="0 0 12 12" fill="none" className="w-[11px] h-[11px]"><rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg> },
  { label: "GDPR", icon: <svg viewBox="0 0 12 12" fill="none" className="w-[11px] h-[11px]"><path d="M6 1L2 2.5v3.5C2 9 3.8 10.8 6 11c2.2-.2 4-2 4-4.5V2.5L6 1z" stroke="currentColor" strokeWidth="1"/></svg> },
  { label: "99.9% Uptime", icon: <svg viewBox="0 0 12 12" fill="none" className="w-[11px] h-[11px]"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1"/><path d="M6 3.5v2.5l1.5 1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E3E1DB] px-10 pt-12 pb-9">
      <div className="max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-11">
          <div>
            <div className="flex items-center gap-2.5 mb-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-6 h-6 bg-[#0A0A0A] rounded-[6px] flex items-center justify-center flex-shrink-0">
                <EyeIcon/>
              </div>
              <span className="font-serif text-[16px] font-normal tracking-[-0.4px] text-[#0A0A0A]"
                style={{ fontFamily: "'Fraunces', serif" }}>Mirra</span>
            </div>
            <p className="text-[13px] text-[#6A6A6A] leading-[1.65] max-w-[210px] font-light">
              Competitive UI intelligence for agencies and growth teams who move fast.
            </p>
            <div className="text-[12px] text-[#ABABAB] leading-[1.9] mt-3 font-light">
              hello@mirra.io<br/>
              Mirra Technologies Inc.<br/>
              2261 Market St, San Francisco CA
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.8px] mb-3.5 text-[#2C2C2C]">{col.title}</p>
              <ul className="list-none flex flex-col gap-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-[#6A6A6A] no-underline font-light transition-colors hover:text-[#0A0A0A]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E3E1DB] pt-5 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px] text-[#ABABAB]">© 2026 Mirra Technologies Inc. All rights reserved.</p>
          <div className="flex gap-1.5 flex-wrap">
            {badges.map(b => (
              <span key={b.label} className="flex items-center gap-[5px] text-[11px] text-[#ABABAB] border border-[#E3E1DB] rounded-[5px] px-2.5 py-[3px]">
                {b.icon}
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
