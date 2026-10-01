const MEDAL = ["🥇", "🥈", "🥉"];

const AVATAR_COLORS = [
  "bg-avatar-pink",
  "bg-avatar-blue",
  "bg-avatar-green",
  "bg-avatar-teal"
];

const TRACK_COLORS = [
  "bg-avatar-pink",
  "bg-avatar-blue",
  "bg-avatar-green",
  "bg-avatar-teal"
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

  // Pick color based on ID (1-4)
  const colorIndex = (Number(id) - 1) % 4;
  const avatarClass = AVATAR_COLORS[colorIndex];
  const trackClass = TRACK_COLORS[colorIndex];

  return (
    <article className="light-card p-5 flex flex-col gap-4 bg-white">
      {/* ── Header row ────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg ${avatarClass}`}>
          {initials}
        </div>

        {/* Name + rank */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="font-semibold text-slate-800 text-[15px] truncate">
              {name}
            </h3>
            {rank <= 3 && totalVotes > 0 && (
              <span className="text-sm" title={`Rank #${rank}`}>{MEDAL[rank - 1]}</span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-0.5">Candidate #{id}</p>
        </div>

        {/* Vote count */}
        <div className="flex-shrink-0 text-right pt-1">
          <p className="font-bold text-[17px] text-slate-800 leading-tight">
            {voteCount.toLocaleString()}
          </p>
          <p className="text-slate-500 text-[10px] uppercase">votes</p>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="mt-2">
        <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
          <span>Vote share</span>
          <span>{pct}%</span>
        </div>
        <div className="vote-bar-track">
          <div
            className={`vote-bar-fill ${trackClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ── Vote button ───────────────────────────────────────────────────── */}
      <div className="mt-3">
        {hasVoted ? (
          <button
            className={`btn-vote ${userVotedHere ? "btn-voted" : ""}`}
            disabled
          >
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
            className="btn-vote"
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
