export default function Navbar({ account, onConnect, isConnecting }) {
  // Shorten a full address to "0x1234...abcd"
  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  return (
    <nav className="header-border fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 bg-white">
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Checkmark Shield Logo */}
        <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center text-white flex-shrink-0">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
           </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-xl text-slate-800 leading-tight tracking-tight">
            Voter <span className="text-brand-500">Portal</span>
          </h1>
          <p className="text-[9px] text-slate-500 leading-none tracking-widest uppercase font-semibold">
            ELECTION COMMISSION OF INDIA
          </p>
        </div>
      </div>

      {/* ── Right side controls ────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
           </svg>
           <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile / Connect Wallet */}
        {account ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
             </div>
             <div className="hidden sm:block">
               <p className="text-sm font-semibold text-slate-800 leading-tight">{shortAddress(account)}</p>
               <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Verified Identity</p>
             </div>
             <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="btn-primary"
          >
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}
