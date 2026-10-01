import React from 'react';

export default function Sidebar({ activeView, setActiveView }) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'voter-details',
      label: 'My Voter Details',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'electoral-roll',
      label: 'Electoral Roll',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#222222] border-r border-gray-200 dark:border-[#333333] hidden lg:flex flex-col h-screen sticky top-0 transition-colors">
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-neutral-800/80 dark:text-indigo-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-[#333333]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-neutral-100 leading-tight">Your Vote</p>
            <p className="text-xs font-bold text-gray-900 dark:text-neutral-100 leading-tight">Your Voice</p>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 leading-tight">Our Democracy</p>
          </div>
          {/* Tricolor flag motif */}
          <div className="flex flex-col w-7 h-5 overflow-hidden rounded-sm shadow-sm">
            <div className="flex-1 bg-orange-500"></div>
            <div className="flex-1 bg-white dark:bg-neutral-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full border border-blue-800"></div>
            </div>
            <div className="flex-1 bg-green-600"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
