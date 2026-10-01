import { useState, useCallback } from "react";
import Navbar        from "./components/Navbar.jsx";
import Sidebar       from "./components/Sidebar.jsx";
import StatsBar      from "./components/StatsBar.jsx";
import CandidateCard from "./components/CandidateCard.jsx";
import Toast         from "./components/Toast.jsx";

// ── Mock data ────────────────
const MOCK_CANDIDATES = [
  { id: 1, name: "Alice Johnson",   voteCount: 42 },
  { id: 2, name: "Bob Martinez",    voteCount: 35 },
  { id: 3, name: "Carol Williams",  voteCount: 28 },
  { id: 4, name: "David Lee",       voteCount: 19 },
];

function sortedByVotes(candidates) {
  return [...candidates].sort((a, b) => b.voteCount - a.voteCount);
}

export default function App() {
  const [account,      setAccount]      = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [candidates,   setCandidates]   = useState(MOCK_CANDIDATES);
  const [hasVoted,     setHasVoted]     = useState(false);
  const [votedFor,     setVotedFor]     = useState(null);
  const [isTxPending,  setIsTxPending]  = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);
  const leaderboard = sortedByVotes(candidates);

  const handleConnect = async () => {
    if (!window.ethereum) {
      showToast("MetaMask not detected. Please install it first.", "error");
      return;
    }
    try {
      setIsConnecting(true);
      await new Promise((r) => setTimeout(r, 1200)); 
      const mockAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      setAccount(mockAddress);
      showToast("Wallet connected successfully!", "success");
    } catch (err) {
      showToast("Connection rejected by user.", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVote = async (candidateId) => {
    if (!account) {
      showToast("Please connect your wallet first.", "info");
      return;
    }
    if (hasVoted) {
      showToast("You have already cast your vote.", "error");
      return;
    }

    try {
      setIsTxPending(true);
      await new Promise((r) => setTimeout(r, 1800)); 
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
        )
      );
      setHasVoted(true);
      setVotedFor(candidateId);
      const winner = candidates.find((c) => c.id === candidateId);
      showToast(`✅ Vote cast for ${winner?.name}!`, "success");
    } catch (err) {
      showToast("Transaction failed. Please try again.", "error");
    } finally {
      setIsTxPending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fb]">
      <Navbar account={account} onConnect={handleConnect} isConnecting={isConnecting} />
      
      <div className="flex flex-1 pt-[72px]">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-8">
          
          {/* ── Hero Banner ───────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 relative">
             <div className="p-8 pb-10 sm:w-2/3">
                <p className="font-semibold text-slate-800 text-lg mb-1">Welcome to the</p>
                <h2 className="font-bold text-4xl sm:text-5xl text-slate-800 leading-tight mb-2">
                  Voter <span className="text-brand-500">Portal</span>
                </h2>
                <div className="flex gap-3 text-brand-600 font-semibold mb-6">
                   <span>Register</span>
                   <span>•</span>
                   <span>Verify</span>
                   <span>•</span>
                   <span>Participate</span>
                </div>
                <p className="text-slate-500 font-medium">A step towards a stronger democracy</p>
             </div>
             
             {/* Mock visual elements from the design */}
             <div className="absolute right-8 top-12 text-right hidden sm:block z-10">
                <p className="italic font-bold text-slate-800 text-2xl font-serif">“Every vote counts”</p>
                <div className="flex justify-end mt-2 gap-1">
                   <div className="w-4 h-1.5 bg-orange-500 rounded-sm"></div>
                   <div className="w-4 h-1.5 bg-yellow-400 rounded-sm"></div>
                   <div className="w-4 h-1.5 bg-green-500 rounded-sm"></div>
                </div>
             </div>
             
             {/* Abstract flag overlay / hand SVG placeholder */}
             <div className="absolute right-0 bottom-0 h-full w-2/3 opacity-30 pointer-events-none" 
                  style={{ background: 'radial-gradient(circle at 70% 50%, rgba(93, 95, 239, 0.15) 0%, transparent 60%)' }}>
                <svg className="absolute right-[20%] bottom-0 h-[120%] text-slate-300" viewBox="0 0 100 100" fill="currentColor">
                   {/* Simplified Hand/Finger Motif */}
                   <path d="M50 80 Q50 60 45 40 Q40 20 45 10 Q50 0 55 10 Q60 20 55 40 Q50 60 50 80 Z" opacity="0.5"/>
                   <circle cx="50" cy="20" r="2" fill="#2d2ea3" opacity="0.8"/>
                </svg>
             </div>
          </div>

          {/* ── Stats bar ─────────────────────────────────────────────────────── */}
          <div className="mb-6">
            <StatsBar
              totalVotes={totalVotes}
              candidateCount={candidates.length}
              account={account}
              hasVoted={hasVoted}
            />
          </div>

          {/* ── Connect-wallet prompt ────────────────────────────────────────── */}
          {!account && (
            <div className="light-card p-6 mb-8 flex flex-col sm:flex-row items-center gap-5 justify-between bg-white border-orange-200">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0 shadow-sm">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                   </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Connect your wallet to vote</h3>
                  <p className="text-slate-500 text-sm mt-0.5">
                    You can view results without connecting, but voting requires MetaMask.
                  </p>
                </div>
              </div>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="btn-primary flex-shrink-0 w-full sm:w-auto bg-brand-500 hover:bg-brand-600 shadow-[0_4px_14px_rgba(93,95,239,0.3)] px-6 py-2.5 rounded-lg font-semibold"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {isConnecting ? "Connecting…" : "Connect MetaMask"}
                </div>
              </button>
            </div>
          )}

          {/* ── Candidate grid ────────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-slate-800">Candidates</h3>
                <span className="text-brand-500 font-semibold bg-brand-50 px-2 py-0.5 rounded-md text-sm">
                  ({candidates.length})
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm cursor-pointer hover:text-slate-800">
                 Sorted by vote count
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                 </svg>
              </div>
            </div>

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {leaderboard.map((candidate, idx) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  totalVotes={totalVotes}
                  hasVoted={hasVoted}
                  votedFor={votedFor}
                  onVote={handleVote}
                  isLoading={isTxPending}
                  rank={idx + 1}
                />
              ))}
            </div>
          </section>

        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
