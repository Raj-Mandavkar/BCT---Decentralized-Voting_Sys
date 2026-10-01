import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex sticky top-0 h-screen">
      
      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto mt-[72px]">
        <div className="nav-item active">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </div>
        <div className="nav-item">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          My Voter Details
        </div>
        <div className="nav-item flex justify-between items-center">
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Apply for Services
          </div>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="nav-item">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Track Application
        </div>
        <div className="nav-item">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Electoral Roll
        </div>
        <div className="nav-item">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Polling Station
        </div>
        <div className="nav-item">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Help & Support
        </div>
      </nav>

      {/* Footer Branding */}
      <div className="p-6 border-t border-slate-100 flex flex-col items-center">
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
