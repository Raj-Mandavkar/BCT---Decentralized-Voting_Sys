import React from 'react';

export default function StatsBar({ totalVotes, candidateCount, account, hasVoted }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Total Votes */}
      <div className="bg-white shadow-sm dark:bg-[#222222] border border-gray-200 dark:border-[#333333] p-5 rounded-2xl flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-neutral-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Total Votes Cast</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100 leading-none">{totalVotes}</p>
        </div>
      </div>

      {/* Total Candidates */}
      <div className="bg-white shadow-sm dark:bg-[#222222] border border-gray-200 dark:border-[#333333] p-5 rounded-2xl flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-neutral-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Candidates</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100 leading-none">{candidateCount}</p>
        </div>
      </div>

      {/* Your Status */}
      <div className="bg-white shadow-sm dark:bg-[#222222] border border-gray-200 dark:border-[#333333] p-5 rounded-2xl flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-500 dark:text-neutral-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Your Status</p>
          <p className={`text-2xl font-bold leading-none ${hasVoted ? 'text-green-600 dark:text-green-400' : account ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-neutral-100'}`}>
            {hasVoted ? 'Vote Cast' : account ? 'Ready' : 'Not Connected'}
          </p>
        </div>
      </div>
    </div>
  );
}
