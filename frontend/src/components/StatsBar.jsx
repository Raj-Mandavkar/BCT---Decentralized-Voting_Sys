export default function StatsBar({ totalVotes, candidateCount, account, hasVoted }) {
  const StatCard = ({ icon, label, value, bgColor, iconColor }) => (
    <div className="light-card p-5 flex items-center gap-4 flex-1 min-w-[200px]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className="font-bold text-slate-800 text-2xl leading-none">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard
        label="Total Votes Cast"
        value={totalVotes.toLocaleString()}
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
        icon={
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
           </svg>
        }
      />
      <StatCard
        label="Candidates"
        value={candidateCount}
        bgColor="bg-green-100"
        iconColor="text-green-600"
        icon={
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
           </svg>
        }
      />
      <StatCard
        label="Your Status"
        value={!account ? "Not Connected" : hasVoted ? "Vote Cast" : "Eligible"}
        bgColor="bg-blue-100"
        iconColor="text-blue-500"
        icon={
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
           </svg>
        }
      />
    </div>
  );
}
