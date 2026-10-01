import React from 'react';

export default function Sidebar({ activeView, setActiveView }) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'voter-details',
      label: 'My Voter Details',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'electoral-roll',
      label: 'Electoral Roll',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex sticky top-0 h-screen">
      
      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto mt-[72px]">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>

      {/* Footer Branding */}
      <div className="p-6 border-t border-slate-100 flex flex-col items-center mt-auto">
         <div className="flex flex-col items-start w-full relative mb-4">
            <div className="text-sm font-bold text-slate-700 leading-tight">Your Vote</div>
            <div className="text-sm font-bold text-slate-700 leading-tight">Your Voice</div>
            <div className="text-sm font-bold text-brand-600 leading-tight">Our Democracy</div>
            {/* Simple CSS representation of the flag motif */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col w-8 h-6 skew-x-[-15deg] overflow-hidden rounded-sm">
                <div className="flex-1 bg-orange-500"></div>
                <div className="flex-1 bg-white flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full border border-blue-800"></div>
                </div>
                <div className="flex-1 bg-green-600"></div>
            </div>
         </div>
         {/* Parliament Building silhouette placeholder */}
         <div className="w-full h-12 border-b-2 border-brand-200 flex items-end justify-center opacity-40">
            <div className="w-4/5 h-8 bg-brand-100 rounded-t-full flex justify-center items-end px-2 pb-1 gap-1">
                 <div className="w-2 h-4 bg-brand-200 rounded-t-sm"></div>
                 <div className="w-2 h-5 bg-brand-200 rounded-t-sm"></div>
                 <div className="w-2 h-6 bg-brand-200 rounded-t-sm"></div>
                 <div className="w-2 h-5 bg-brand-200 rounded-t-sm"></div>
                 <div className="w-2 h-4 bg-brand-200 rounded-t-sm"></div>
            </div>
         </div>
      </div>
    </aside>
  );
}
