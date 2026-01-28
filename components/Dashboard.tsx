
import React, { useState } from 'react';
import { ResumeData, User } from '../types.ts';
import { downloadAllAsZip } from '../services/exportService.ts';

interface DashboardProps {
  user: User;
  onUpdateUser: (user: User) => void;
  resumes: ResumeData[];
  onCreate: (template?: any) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

type DashboardTab = 'resumes' | 'subscription' | 'settings';

export default function Dashboard({ user, onUpdateUser, resumes, onCreate, onSelect, onDelete }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('resumes');
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...user, name: editName, email: editEmail });
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  const handleDownloadWorkspace = async () => {
    if (!user.isPremium) {
      alert("ZIP Workspace Export is a Premium feature. Please upgrade your account.");
      setActiveTab('subscription');
      return;
    }
    setIsZipping(true);
    await downloadAllAsZip(resumes, user.name);
    setIsZipping(false);
  };

  const totalResumes = resumes.length;
  const planName = user.isPremium ? 'Premium' : 'Free';
  const resumeLimit = user.isPremium ? 'Unlimited' : '3';
  
  // Simulated AI usage based on resume content
  const aiWordsUsed = resumes.reduce((acc, r) => acc + (r.summary?.length || 0) / 5, 0);
  const aiLimit = user.isPremium ? 50000 : 5000;

  const renderResumes = () => (
    <div className="space-y-12 animate-fadeIn">
      {/* Stats Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Resumes</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-black text-navy">{totalResumes}</p>
              <span className="text-xs font-bold text-slate-300">/ {resumeLimit}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">AI Usage</p>
            <p className="text-3xl font-black text-teal">
              {Math.round(aiWordsUsed)} <span className="text-sm text-slate-300 font-bold">words</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Type</p>
            <p className="text-3xl font-black text-blue-500">{planName}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. ATS Score</p>
            <p className="text-3xl font-black text-navy">72%</p>
          </div>
        </div>
        
        {/* Workspace ZIP Button */}
        <button 
          onClick={handleDownloadWorkspace}
          disabled={isZipping}
          className="lg:w-64 bg-navy text-white p-6 rounded-3xl border border-navy shadow-lg hover:brightness-125 transition-all flex flex-col items-center justify-center space-y-2 group active:scale-95 disabled:opacity-50"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-teal group-hover:scale-110 transition-transform">
             <i className={`fas ${isZipping ? 'fa-spinner fa-spin' : 'fa-file-archive'} text-xl`}></i>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">Workspace .ZIP</p>
          <p className="text-[8px] font-bold text-slate-400">Download All Drafts</p>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumes.map((resume) => (
          <div key={resume.id} className="group bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full border-b-4 border-b-transparent hover:border-b-teal">
            <div className="absolute top-0 right-0 p-8">
              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm('Are you sure you want to delete this resume?')) onDelete(resume.id); }}
                className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                title="Delete Resume"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>

            <div className="w-16 h-16 bg-teal/10 text-teal rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
               <i className="fas fa-file-alt text-2xl"></i>
            </div>

            <h3 className="text-xl font-black text-navy mb-2 truncate pr-10">{resume.title || 'Untitled Resume'}</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10">
              Last saved: {new Date(resume.updatedAt).toLocaleDateString()}
            </p>

            <div className="mt-auto flex space-x-3">
              <button 
                onClick={() => onSelect(resume.id)}
                className="flex-1 py-3 bg-navy text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95"
              >
                Continue Editing
              </button>
              <button 
                onClick={() => onSelect(resume.id)}
                className="px-4 py-3 border border-gray-100 text-navy rounded-xl hover:bg-slate-50 transition-all active:scale-95"
              >
                <i className="fas fa-eye text-xs"></i>
              </button>
            </div>
          </div>
        ))}

        {(!user.isPremium && resumes.length >= 3) ? (
          <div className="group border-4 border-dashed border-slate-100 rounded-[40px] p-8 flex flex-col items-center justify-center text-slate-300 opacity-60">
             <i className="fas fa-lock text-3xl mb-4"></i>
             <p className="text-xs font-black uppercase tracking-widest">Free Limit Reached</p>
             <button onClick={() => setActiveTab('subscription')} className="mt-4 text-teal font-black text-[10px] uppercase tracking-widest hover:underline">Upgrade for more</button>
          </div>
        ) : (
          <button 
            onClick={() => onCreate()}
            className="group border-4 border-dashed border-slate-200 rounded-[40px] p-8 flex flex-col items-center justify-center text-slate-300 hover:border-teal/30 hover:bg-teal/5 transition-all min-h-[300px]"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal group-hover:text-white transition-all shadow-inner">
               <i className="fas fa-plus text-2xl"></i>
            </div>
            <span className="font-black text-xs uppercase tracking-[0.2em] group-hover:text-navy transition-colors">Create New Document</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="max-w-4xl animate-fadeIn space-y-12">
      <div className="bg-navy rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
          <i className="fas fa-gem text-[180px]"></i>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 bg-teal/20 text-teal rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-teal/30">
            {planName} Account
          </div>
          <h2 className="text-4xl font-black mb-4">
            {user.isPremium ? "You're all set with Premium!" : `Your current plan is ${planName}`}
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg font-medium">
            {user.isPremium 
              ? "Enjoy unlimited access to all AI features and templates." 
              : "Upgrade to Pro to unlock unlimited ATS checks, premium templates, and full AI optimization features."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resumes</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-teal" style={{ width: `${Math.min((resumes.length / (user.isPremium ? 50 : 3)) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs font-bold text-slate-400">{resumes.length} of {resumeLimit} used</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Word Limit</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-teal" style={{ width: `${Math.min((aiWordsUsed / aiLimit) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs font-bold text-slate-400">{Math.round(aiWordsUsed)} of {aiLimit} words</p>
            </div>
          </div>

          {!user.isPremium && (
            <button 
              onClick={() => onUpdateUser({ ...user, isPremium: true })}
              className="bg-teal text-navy px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Unlock Premium for $19/mo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-navy mb-8">Included in your plan</h3>
          <ul className="space-y-6">
            {[
              { icon: 'fa-infinity', text: user.isPremium ? 'Unlimited Resumes' : 'Up to 3 Resumes', active: true },
              { icon: 'fa-check-double', text: 'Daily ATS Score Checks', active: user.isPremium },
              { icon: 'fa-wand-magic-sparkles', text: 'AI Content Optimizer', active: true },
              { icon: 'fa-palette', text: 'Unlock All Templates', active: user.isPremium },
              { icon: 'fa-file-word', text: 'DOCX & PDF Export', active: user.isPremium }
            ].map((item, i) => (
              <li key={i} className={`flex items-center space-x-4 ${item.active ? '' : 'opacity-30'}`}>
                <div className={`w-8 h-8 ${item.active ? 'bg-teal/10 text-teal' : 'bg-slate-100 text-slate-400'} rounded-lg flex items-center justify-center shrink-0`}>
                  <i className={`fas ${item.icon} text-xs`}></i>
                </div>
                <span className="text-sm font-bold text-navy">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-credit-card text-3xl"></i>
          </div>
          <h3 className="text-lg font-black text-navy mb-2">Billing History</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-[200px] font-medium">
            {user.isPremium ? "Your next billing cycle starts next month." : "No active subscription found."}
          </p>
          <button className="text-teal font-black text-[10px] uppercase tracking-widest hover:underline">View Billing Details</button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl animate-fadeIn space-y-8">
      <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-navy mb-10">Account Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          <div className="flex items-center space-x-8 pb-8 border-b border-slate-50">
            <img src={user.avatar} className="w-24 h-24 rounded-[32px] shadow-xl" alt="profile" />
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Profile</p>
              <h4 className="text-2xl font-black text-navy">{user.name}</h4>
              <p className="text-sm text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold outline-none focus:bg-white focus:border-teal transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={editEmail} 
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-navy font-bold outline-none focus:bg-white focus:border-teal transition-all" 
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-navy text-white rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-125 transition-all shadow-lg active:scale-95"
            >
              {isSaving ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-navy mb-8">System Preferences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
            <div>
              <h4 className="font-black text-navy mb-1">Email Reports</h4>
              <p className="text-xs text-slate-400 font-medium">Get a monthly summary of your application progress.</p>
            </div>
            <div className="w-12 h-6 bg-teal rounded-full relative cursor-pointer">
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className={`flex items-center justify-between p-6 bg-slate-50 rounded-2xl ${user.isPremium ? '' : 'opacity-40'}`}>
            <div>
              <h4 className="font-black text-navy mb-1">Dark Interface</h4>
              <p className="text-xs text-slate-400 font-medium">{user.isPremium ? 'Switch to night mode experience.' : 'Upgrade to Pro for dark mode.'}</p>
            </div>
            <div className={`w-12 h-6 rounded-full relative ${user.isPremium ? 'bg-slate-300 cursor-pointer' : 'bg-slate-200 cursor-not-allowed'}`}>
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 p-12 rounded-[40px] border border-rose-100">
        <h3 className="text-xl font-black text-rose-600 mb-4">Danger Zone</h3>
        <p className="text-sm text-rose-400 mb-10 max-w-lg font-medium">Permanently delete your account and all {resumes.length} saved resumes. This action is irreversible.</p>
        <button 
          onClick={() => { if(confirm('Wait! This will delete all your resumes forever. Are you absolutely sure?')) { localStorage.clear(); location.reload(); } }} 
          className="px-8 py-4 border-2 border-rose-200 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
        >
          Delete Account Forever
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row animate-fadeIn">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 p-8 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="mb-12">
          <h1 className="text-2xl font-black text-navy mb-2 tracking-tighter">My Workspace</h1>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Career Hub v2.0</p>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'resumes', icon: 'fa-file-alt', label: 'My Resumes' },
            { id: 'subscription', icon: 'fa-gem', label: 'Subscription' },
            { id: 'settings', icon: 'fa-cog', label: 'Account Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-teal text-navy shadow-xl shadow-teal/10 font-black' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-navy'
              }`}
            >
              <i className={`fas ${item.icon} text-sm ${activeTab === item.id ? 'text-navy' : 'text-slate-300 group-hover:text-teal'}`}></i>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="flex items-center space-x-4 mb-4">
             <img src={user.avatar} className="w-10 h-10 rounded-xl" alt="avatar" />
             <div className="overflow-hidden">
               <h4 className="text-xs font-black text-navy truncate">{user.name}</h4>
               <p className="text-[9px] font-black text-teal uppercase tracking-widest">{planName}</p>
             </div>
          </div>
          <button 
            onClick={() => { if(confirm('Sign out?')) location.reload(); }} 
            className="w-full py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-navy mb-2 tracking-tighter">
                {activeTab === 'resumes' ? 'Your Documents' : activeTab === 'subscription' ? 'Manage Plan' : 'Profile Settings'}
              </h2>
              <p className="text-slate-400 font-medium">
                {activeTab === 'resumes' ? `You have ${totalResumes} active drafts.` : activeTab === 'subscription' ? 'Manage your features and usage limits.' : 'Update your personal details.'}
              </p>
            </div>
            {activeTab === 'resumes' && (
              <button 
                onClick={() => onCreate()}
                className="px-8 py-4 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center"
              >
                <i className="fas fa-plus mr-3 text-teal"></i> Create New Resume
              </button>
            )}
          </div>

          {activeTab === 'resumes' && renderResumes()}
          {activeTab === 'subscription' && renderSubscription()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
}
