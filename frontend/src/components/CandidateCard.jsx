import React from 'react';

const MEDAL = ["🥇", "🥈", "🥉"];

const AVATAR_COLORS = [
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
];

const TRACK_COLORS = [
  "bg-pink-500 dark:bg-pink-400",
  "bg-blue-500 dark:bg-blue-400",
  "bg-green-500 dark:bg-green-400",
  "bg-orange-500 dark:bg-orange-400"
];

export default function CandidateCard({
  candidate,
  totalVotes,
  hasVoted,
  votedFor,
  onVote,
  isLoading,
  rank,
}) {
  const { id, name, voteCount } = candidate;
  const pct = totalVotes > 0 ? Math.round((Number(voteCount) / totalVotes) * 100) : 0;
  const userVotedHere = votedFor === id;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colorIndex = (Number(id) - 1) % 4;
  const avatarClass = AVATAR_COLORS[colorIndex];
  const trackClass = TRACK_COLORS[colorIndex];

  const getButtonClass = () => {
    const base = "w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors text-sm border";
    
    if (hasVoted) {
      if (userVotedHere) {
        return `${base} bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500/50 dark:text-indigo-400 cursor-default`;
      } else {
        return `${base} bg-gray-100 text-gray-400 border-transparent cursor-not-allowed dark:bg-neutral-800/50 dark:text-neutral-600`;
      }
    }
    
    return `${base} bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-[#161616] dark:border-[#333333] dark:text-neutral-300 dark:hover:bg-neutral-800/80 cursor-pointer`;
  };

  return (
    <article className="bg-white shadow-sm dark:bg-[#222222] border border-gray-200 dark:border-[#333333] p-5 flex flex-col gap-4 rounded-2xl transition-colors">
      {/* ── Header row ────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${avatarClass}`}>
          {initials}
        </div>

        {/* Name + rank */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-neutral-100 text-[15px] truncate">
              {name}
            </h3>
            {rank <= 3 && totalVotes > 0 && (
              <span className="text-sm" title={`Rank #${rank}`}>{MEDAL[rank - 1]}</span>
            )}
          </div>
          <p className="text-gray-500 dark:text-neutral-400 text-xs mt-0.5">Candidate #{id}</p>
        </div>

        {/* Vote count */}
        <div className="flex-shrink-0 text-right pt-1">
          <p className="font-bold text-[17px] text-gray-900 dark:text-neutral-100 leading-tight">
            {voteCount.toLocaleString()}
          </p>
          <p className="text-gray-500 dark:text-neutral-400 text-[10px] uppercase">votes</p>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="mt-2">
        <div className="flex justify-between text-[11px] text-gray-500 dark:text-neutral-400 mb-1.5 font-medium">
          <span>Vote share</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${trackClass}`}
            style={{ width: `${pct}%`, transition: 'width 0.5s ease-in-out' }}
          />
        </div>
      </div>

      {/* ── Vote button ───────────────────────────────────────────────────── */}
      <div className="mt-3">
        {hasVoted ? (
          <button className={getButtonClass()} disabled>
            {userVotedHere ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Voted
              </>
            ) : "Cast Vote"}
          </button>
        ) : (
          <button
            onClick={() => onVote(id)}
            disabled={isLoading}
            className={getButtonClass()}
          >
            {isLoading ? "Confirming…" : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cast Vote
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
