
import React, { useState } from 'react';
import { AppView, User } from '../types.ts';

interface AuthPageProps {
  type: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onSwitch: (view: AppView) => void;
}

export default function AuthPage({ type, onAuthSuccess, onSwitch }: AuthPageProps) {
  const [email, setEmail] = useState(type === 'login' ? 'abubakrmalik9889@gmail.com' : '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(type === 'login' ? 'Abubakr Malik' : '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating API call with the user's provided details
    setTimeout(() => {
      const mockUser: User = {
        id: 'user_123456',
        name: name || 'Abubakr Malik',
        email: email || 'abubakrmalik9889@gmail.com',
        isPremium: true, // Unlocking premium by default for the user
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'abubakr'}`
      };
      
      localStorage.setItem('resumeflux_user', JSON.stringify(mockUser));
      onAuthSuccess(mockUser);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-softWhite flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-navy mb-2 tracking-tighter">resumeflux</h1>
          <p className="text-slate-500 font-medium">
            {type === 'login' ? 'Welcome back, professional.' : 'Start your journey to success.'}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {type === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-teal transition-all font-bold"
                  placeholder="Abubakr Malik"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-teal transition-all font-bold"
                placeholder="abubakrmalik9889@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-teal transition-all font-bold"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-125 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : type === 'login' ? 'Sign In to Workspace' : 'Create Premium Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <button 
              onClick={() => onSwitch(type === 'login' ? 'signup' : 'login')}
              className="text-sm font-bold text-teal hover:underline"
            >
              {type === 'login' ? "New here? Create your account" : "Already registered? Sign in here"}
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <button className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-navy hover:scale-110 transition-transform">
            <i className="fab fa-google"></i>
          </button>
          <button className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center text-navy hover:scale-110 transition-transform">
            <i className="fab fa-linkedin-in"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
