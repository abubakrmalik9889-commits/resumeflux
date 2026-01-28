
import React from 'react';

export default function LandingPage({ onStart, onAtsCheck }: { onStart: () => void, onAtsCheck: () => void }) {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/3 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 bg-teal/10 text-teal rounded-full text-xs font-black uppercase tracking-widest mb-8">
                <i className="fas fa-sparkles mr-2"></i> AI-Powered Resume Builder
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-navy mb-8 leading-[1.05] tracking-tighter">
                Land your dream job <span className="text-teal">faster.</span>
              </h1>
              <p className="text-xl text-gray-500 mb-12 max-w-lg leading-relaxed font-medium">
                Create a high-performing, ATS-optimized resume in minutes with the power of Gemini AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onStart} className="px-10 py-5 bg-navy text-white rounded-2xl font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                  Start Building Now <i className="fas fa-arrow-right ml-3 text-teal"></i>
                </button>
                <button onClick={onAtsCheck} className="px-10 py-5 bg-white border-2 border-gray-100 text-navy rounded-2xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center">
                  Check ATS Score
                </button>
              </div>
              <div className="mt-12 flex items-center space-x-6 text-gray-400">
                <div className="flex items-center"><i className="fas fa-check-circle text-teal mr-2"></i> No login required</div>
                <div className="flex items-center"><i className="fas fa-check-circle text-teal mr-2"></i> Free templates</div>
              </div>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-teal/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1000" alt="Resume Preview" className="rounded-[32px] w-full" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-softWhite py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12">Trusted by professionals at top companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
             <i className="fab fa-google text-4xl"></i>
             <i className="fab fa-microsoft text-4xl"></i>
             <i className="fab fa-amazon text-4xl"></i>
             <i className="fab fa-apple text-4xl"></i>
             <i className="fab fa-meta text-4xl"></i>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
             <h2 className="text-4xl font-black text-navy mb-6">Built for Modern Recruitment</h2>
             <p className="text-gray-500 font-medium">Everything you need to beat the "rejection robots" and get hired.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: 'fa-magic', title: 'AI Content Generation', desc: 'Optimize bullet points and summaries instantly with industry-specific keywords.' },
               { icon: 'fa-bullseye', title: 'Real-time ATS Scoring', desc: 'Know exactly how well your resume matches the job description before you apply.' },
               { icon: 'fa-file-export', title: 'Professional Export', desc: 'Download in ATS-friendly PDF and Word formats, perfectly formatted every time.' }
             ].map((f, i) => (
               <div key={i} className="p-10 rounded-[32px] bg-softWhite hover:bg-white border border-transparent hover:border-gray-100 transition-all hover:shadow-xl group">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-teal text-xl mb-8 shadow-sm group-hover:scale-110 transition-transform">
                   <i className={`fas ${f.icon}`}></i>
                 </div>
                 <h3 className="text-xl font-black text-navy mb-4">{f.title}</h3>
                 <p className="text-gray-500 leading-relaxed">{f.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
