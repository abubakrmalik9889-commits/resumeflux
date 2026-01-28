
import React, { useState } from 'react';
import { AppView, User } from '../types.ts';

interface NavbarProps {
  setView: (v: AppView) => void;
  currentView: string;
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ setView, currentView, user, onLogout }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const activeClass = "text-teal font-black border-b-2 border-teal pb-1";
  const inactiveClass = "text-navy/60 font-bold hover:text-navy transition-colors";

  const navLinks: { label: string, view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Templates', view: 'templates' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'About', view: 'about' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
            <span className="text-[24px] font-black text-navy flex items-center group-hover:scale-105 transition-transform tracking-tighter">
              resumeflux<span className="text-teal text-[10px] ml-1 bg-teal/10 px-1.5 py-0.5 rounded-full">AI</span>
            </span>
          </div>
          
          <div className="hidden lg:flex space-x-8 text-[11px] font-black uppercase tracking-widest">
            {navLinks.map(link => (
              <button key={link.view} onClick={() => setView(link.view)} className={currentView === link.view ? activeClass : inactiveClass}>
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setView('login')} 
                  className="text-navy font-black text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setView('signup')} 
                  className="bg-navy text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-125 transition-all"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-1.5 pr-4 rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-xl shadow-sm" />
                  <span className="text-[10px] font-black text-navy uppercase tracking-widest hidden md:block">Dashboard</span>
                  <i className="fas fa-chevron-down text-[8px] text-slate-300"></i>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 animate-fadeIn overflow-hidden">
                    <div className="p-4 border-b border-slate-50 mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-xs font-bold text-navy truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { setView('dashboard'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-navy hover:bg-slate-50 rounded-xl transition-all flex items-center">
                      <i className="fas fa-th-large mr-3 text-teal"></i> My Documents
                    </button>
                    <button onClick={() => { setView('builder'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-navy hover:bg-slate-50 rounded-xl transition-all flex items-center">
                      <i className="fas fa-plus-circle mr-3 text-teal"></i> New Resume
                    </button>
                    <button onClick={onLogout} className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex items-center mt-2 border-t border-slate-50 pt-3">
                      <i className="fas fa-sign-out-alt mr-3"></i> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button 
              className="lg:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-navy"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <i className={`fas fa-${showMobileMenu ? 'times' : 'bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-slate-100 p-4 space-y-2 animate-slideDown">
          {navLinks.map(link => (
            <button 
              key={link.view} 
              onClick={() => { setView(link.view); setShowMobileMenu(false); }} 
              className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-navy hover:bg-slate-50 rounded-xl"
            >
              {link.label}
            </button>
          ))}
          <button onClick={() => { setView('ats-checker'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-teal hover:bg-teal/5 rounded-xl">
            ATS Score Checker
          </button>
        </div>
      )}
    </nav>
  );
}
