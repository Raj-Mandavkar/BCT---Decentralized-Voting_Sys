import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import Navbar        from "./components/Navbar.jsx";
import Sidebar       from "./components/Sidebar.jsx";
import StatsBar      from "./components/StatsBar.jsx";
import CandidateCard from "./components/CandidateCard.jsx";
import Toast         from "./components/Toast.jsx";
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "./contracts/VotingData.js";

function sortedByVotes(candidates) {
  return [...candidates].sort((a, b) => b.voteCount - a.voteCount);
}

// Simple hash generator for mock Voter ID
function generateVoterHash(address) {
  if (!address) return "N/A";
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0; 
  }
  return "VID-" + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

export default function App() {
  const [account,      setAccount]      = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [candidates,   setCandidates]   = useState([]);
  const [hasVoted,     setHasVoted]     = useState(false);
  const [votedFor,     setVotedFor]     = useState(null); // Not stored on chain natively per-user in this simple contract, but kept for UI
  const [isTxPending,  setIsTxPending]  = useState(false);
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState('home');
  
  // Ethers state
  const [contract, setContract] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);
  const leaderboard = sortedByVotes(candidates);

  // ── Fetch Live Data ────────────────────────────────────────────────────────
  const fetchCandidates = useCallback(async (votingContract) => {
    try {
      const data = await votingContract.getAllCandidates();
      
      // Map Solidity struct to JS object, converting BigInts
      const formattedCandidates = data.map((candidate) => ({
        id: Number(candidate.id),
        name: candidate.name,
        voteCount: Number(candidate.voteCount),
      }));
      
      setCandidates(formattedCandidates);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      showToast("Failed to load candidates from the blockchain.", "error");
    }
  }, [showToast]);

  // Initial load using a read-only provider (no wallet needed just to view)
  useEffect(() => {
    const initReadOnly = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const readOnlyContract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider);
        await fetchCandidates(readOnlyContract);
      } catch (err) {
        console.error("Read-only init error:", err);
      }
    };
    initReadOnly();
  }, [fetchCandidates]);

  // ── Web3 Initialization ────────────────────────────────────────────────────
  const ensureCorrectNetwork = async () => {
    if (!window.ethereum) return false;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x7a69') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7a69' }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x7a69',
                  chainName: 'Localhost 8545',
                  rpcUrls: ['http://127.0.0.1:8545'],
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                },
              ],
            });
          } catch (addError) {
            console.error("Error adding network:", addError);
            return false;
          }
        } else {
          console.error("Error switching network:", switchError);
          return false;
        }
      }
    }
    return true;
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      showToast("MetaMask not detected. Please install it first.", "error");
      return;
    }
    
    try {
      setIsConnecting(true);
      
      const isCorrectNetwork = await ensureCorrectNetwork();
      if (!isCorrectNetwork) {
        showToast("Please switch to the Localhost network.", "error");
        setIsConnecting(false);
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      
      // Initialize contract with signer for write operations
      const votingContract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer);
      setContract(votingContract);
      
      // Check if user has already voted
      const userHasVoted = await votingContract.hasVoted(address);
      setHasVoted(userHasVoted);
      
      // Refresh candidates list just in case
      await fetchCandidates(votingContract);
      
      showToast("Wallet connected successfully!", "success");
    } catch (err) {
      console.error("Connect error:", err);
      if (err.code === 4001) {
        showToast("Connection rejected by user.", "error");
      } else {
        showToast("Failed to connect wallet.", "error");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // ── Execute Transactions ───────────────────────────────────────────────────
  const handleVote = async (candidateId) => {
    if (!account || !contract) {
      showToast("Please connect your wallet first.", "info");
      return;
    }
    if (hasVoted) {
      showToast("You have already cast your vote.", "error");
      return;
    }

    try {
      const isCorrectNetwork = await ensureCorrectNetwork();
      if (!isCorrectNetwork) {
        showToast("Please switch to the Localhost network to vote.", "error");
        return;
      }

      setIsTxPending(true);
      
      // Call smart contract vote function
      const tx = await contract.vote(candidateId);
      
      showToast("Transaction submitted. Waiting for confirmation...", "info");
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Update local state
      setHasVoted(true);
      setVotedFor(candidateId);
      
      // Re-fetch live data to update progress bars
      await fetchCandidates(contract);
      
      const winner = candidates.find((c) => c.id === candidateId);
      showToast(`✅ Vote confirmed for ${winner?.name}!`, "success");
      
    } catch (err) {
      console.error("Vote error:", err);
      if (err.code === "ACTION_REJECTED" || err.info?.error?.code === 4001) {
        showToast("Transaction rejected in MetaMask.", "error");
      } else if (err.message.includes("already voted")) {
        showToast("Your address has already voted.", "error");
        setHasVoted(true);
      } else {
        showToast("Transaction failed. Check console for details.", "error");
      }
    } finally {
      setIsTxPending(false);
    }
  };

  // Handle account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // If already connected, re-init with new account
          if (account) handleConnect();
        } else {
          // Disconnected
          setAccount(null);
          setContract(null);
          setHasVoted(false);
          setVotedFor(null);
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, [account]);

  // ── Sub-views ──────────────────────────────────────────────────────────────

  const renderHomeView = () => (
    <>
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
         
         <div className="absolute right-8 top-12 text-right hidden sm:block z-10">
            <p className="italic font-bold text-slate-800 text-2xl font-serif">“Every vote counts”</p>
            <div className="flex justify-end mt-2 gap-1">
               <div className="w-4 h-1.5 bg-orange-500 rounded-sm"></div>
               <div className="w-4 h-1.5 bg-yellow-400 rounded-sm"></div>
               <div className="w-4 h-1.5 bg-green-500 rounded-sm"></div>
            </div>
         </div>
         
         <div className="absolute right-0 bottom-0 h-full w-2/3 opacity-30 pointer-events-none" 
              style={{ background: 'radial-gradient(circle at 70% 50%, rgba(93, 95, 239, 0.15) 0%, transparent 60%)' }}>
            <svg className="absolute right-[20%] bottom-0 h-[120%] text-slate-300" viewBox="0 0 100 100" fill="currentColor">
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
          {leaderboard.length === 0 ? (
             <div className="col-span-full py-8 text-center text-slate-500">
                Loading candidates from blockchain...
             </div>
          ) : (
            leaderboard.map((candidate, idx) => (
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
            ))
          )}
        </div>
      </section>
    </>
  );

  const renderVoterDetails = () => {
    const formatAddress = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

    return (
      <div className="light-card bg-white p-8 max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">My Voter Details</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
               </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Web3 Identity</p>
              <p className="text-xl font-bold text-slate-800">
                {account ? formatAddress(account) : "Anonymous Voter"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm text-slate-500 mb-1">Voter ID Hash</p>
              <p className="font-mono text-slate-800 font-medium bg-white px-3 py-1.5 rounded border border-slate-200 inline-block">
                {generateVoterHash(account)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Connected Wallet</p>
              <p className="font-mono text-brand-600 font-medium bg-brand-50 px-3 py-1.5 rounded border border-brand-100 truncate" title={account || "Not Connected"}>
                {account ? `${account.slice(0,8)}...${account.slice(-6)}` : "Not Connected"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500 mb-2">Voting Status</p>
              {hasVoted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm border border-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Vote Successfully Cast
                </span>
              ) : account ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm border border-blue-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  Eligible to Vote
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm border border-orange-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  Connection Required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderElectoralRoll = () => {
    // Static mock data for now, could be dynamic events tracking if contract supported it
    const mockRoll = [
      { id: 1, hash: "0x1A2B...3C4D", status: "Registered" },
      { id: 2, hash: "0x5E6F...7A8B", status: "Registered" },
      { id: 3, hash: "0x9C0D...1E2F", status: "Registered" },
      { id: 4, hash: "0x3A4B...5C6D", status: "Registered" },
      { id: 5, hash: "0x7E8F...9A0B", status: "Registered" },
    ];
    
    if (account) {
       mockRoll.unshift({ id: 0, hash: `${account.slice(0,6)}...${account.slice(-4)}`, status: "Registered (You)" });
    }

    return (
      <div className="light-card bg-white p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Public Electoral Roll</h2>
        <p className="text-slate-500 mb-6">Transparent ledger of all registered voting addresses on the blockchain.</p>
        
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wide">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Voter Wallet Hash</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRoll.map((row, i) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                  <td className="px-6 py-4 font-mono text-slate-800">{row.hash}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderHelpSupport = () => (
    <div className="light-card bg-white p-8 max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Help & Support
      </h2>
      
      <div className="space-y-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-2">How do I vote?</h3>
          <p className="text-slate-600 leading-relaxed">
            Ensure you have the MetaMask extension installed. Click the <strong>"Connect Wallet"</strong> button on the top right. Once connected, navigate to the Home dashboard, select your preferred candidate, and click <strong>"Cast Vote"</strong>. You will need to confirm the transaction in your MetaMask wallet.
          </p>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-2">Can I vote twice?</h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>No.</strong> The smart contract strictly enforces a one-vote-per-wallet policy. Once your transaction is confirmed on the blockchain, your address is permanently marked as having voted, and any subsequent attempts will be rejected by the network.
          </p>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-2">Is my vote secret?</h3>
          <p className="text-slate-600 leading-relaxed">
            Your vote is tied to your public wallet address on the blockchain. While your real-world identity is not explicitly linked unless you expose it, the ledger is entirely transparent and immutable, ensuring anyone can verify the integrity of the election results.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fb]">
      <Navbar account={account} onConnect={handleConnect} isConnecting={isConnecting} />
      
      <div className="flex flex-1 pt-[72px]">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-8">
          {activeView === 'home' && renderHomeView()}
          {activeView === 'voter-details' && renderVoterDetails()}
          {activeView === 'electoral-roll' && renderElectoralRoll()}
          {activeView === 'help' && renderHelpSupport()}
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
