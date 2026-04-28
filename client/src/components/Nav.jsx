import { useState } from "react";

const EyeIcon = () => (
  <svg viewBox="0 0 17 17" fill="none" className="w-4 h-4">
    <path d="M1.5 8.5c0 0 2.8-5 7-5s7 5 7 5-2.8 5-7 5-7-5-7-5z" stroke="white" strokeWidth="1.4" fill="none"/>
    <circle cx="8.5" cy="8.5" r="2.2" fill="white"/>
    <circle cx="8.5" cy="8.5" r=".85" fill="#0A0A0A"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
    <path d="M2.5 6h7M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Nav({ onLogin, onSignup }) {
  const [mobOpen, setMobOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 md:px-8 justify-between border-b border-edge/80 bg-cream/90 backdrop-blur-xl saturate-150 shadow-s1">
        <a
          href="#"
          className="flex items-center gap-2 no-underline cursor-pointer group"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <EyeIcon />
          </div>
          <span className="font-fraunces text-lg font-normal tracking-[-0.4px] text-ink">
            Mirra
          </span>
        </a>

        <ul className="hidden md:flex gap-0.5 list-none">
          {[["How it works","how-it-works"],["Pricing","pricing"],["Try free","try-it"]].map(([label, id]) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="text-[13.5px] text-ink-3 px-3 py-1.5 rounded-lg transition-all hover:text-ink hover:bg-cream-2 border-none bg-transparent cursor-pointer font-geist focus:outline-none focus:ring-2 focus:ring-ink/10"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onLogin}
            className="bg-transparent border-none text-[13.5px] text-ink-3 px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:text-ink hover:bg-cream-2 font-geist focus:outline-none focus:ring-2 focus:ring-ink/10"
          >
            Sign in
          </button>
          <button
            onClick={onSignup}
            className="bg-ink text-white border-none text-[13.5px] font-medium px-[18px] py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all hover:bg-ink-2 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink font-geist tracking-[-0.1px]"
          >
            Get started
            <ArrowIcon />
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1.5 rounded-lg transition-colors hover:bg-cream-2 focus:outline-none focus:ring-2 focus:ring-ink/10"
          onClick={() => setMobOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={mobOpen}
          aria-controls="mobile-menu"
        >
          <span className="block w-[18px] h-[1.5px] bg-ink rounded-sm"/>
          <span className="block w-[18px] h-[1.5px] bg-ink rounded-sm"/>
          <span className="block w-[18px] h-[1.5px] bg-ink rounded-sm"/>
        </button>
      </nav>

      {/* Mobile nav */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-edge px-4 pb-4 pt-2 flex flex-col gap-0.5 shadow-s3 transition-all duration-300 ease-out ${mobOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        {[["How it works","how-it-works"],["Pricing","pricing"],["Try free","try-it"]].map(([label,id]) => (
          <button key={id} onClick={() => scrollTo(id)}
            className="text-[15px] text-ink-2 text-left px-3.5 py-3 rounded-lg transition-colors hover:bg-cream-2 border-none bg-transparent cursor-pointer font-geist focus:outline-none focus:ring-2 focus:ring-ink/10">
            {label}
          </button>
        ))}
        <div className="h-px bg-edge my-1.5"/>
        <button onClick={() => { onLogin(); setMobOpen(false); }}
          className="text-[15px] text-ink-2 text-left px-3.5 py-3 rounded-lg transition-colors hover:bg-cream-2 border-none bg-transparent cursor-pointer font-geist focus:outline-none focus:ring-2 focus:ring-ink/10">
          Sign in
        </button>
        <button onClick={() => { onSignup(); setMobOpen(false); }}
          className="bg-ink text-white border-none py-3.5 rounded-xl font-geist text-[15px] font-medium cursor-pointer mt-1 transition-all hover:bg-ink-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink">
          Get started free
        </button>
      </div>
    </>
  );
}

