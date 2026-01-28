
import React from 'react';

export default function AboutPage() {
  return (
    <div className="animate-fadeIn">
      <section className="bg-navy py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1ABC9C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-6xl font-black mb-8 tracking-tighter">Human Intelligence,<br/><span className="text-teal">AI Precision.</span></h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed">resumeflux was founded on a simple premise: Everyone deserves a fair shot at their dream career, regardless of how well they can navigate Applicant Tracking Systems.</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black text-navy mb-8">Breaking the barrier between talent and opportunity.</h2>
            <p className="text-gray-500 mb-6 text-lg leading-relaxed">In the modern hiring landscape, 75% of resumes are rejected by robots before a human ever sees them. We built resumeflux to put the power back in your hands.</p>
            <p className="text-gray-500 text-lg leading-relaxed">Our proprietary AI auditing engine, built on Google Gemini, simulates how major ATS platforms (Workday, Greenhouse, Lever) parse and score documents.</p>
          </div>
          <div className="bg-slate-50 p-12 rounded-[60px] border border-slate-100 relative">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal rounded-full blur-3xl opacity-20"></div>
             <div className="space-y-8">
                {[
                  { icon: 'fa-brain', title: 'Gemini 3 Integration', text: 'Leveraging the world\'s most capable reasoning models to optimize your content.' },
                  { icon: 'fa-microscope', title: 'Recruiter Logic', text: 'We analyzed 100k+ successful hires to build our keyword extraction engine.' },
                  { icon: 'fa-lock', title: 'Privacy First', text: 'Your data is encrypted and never sold to third parties. Period.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white text-teal rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-teal/5">
                       <i className={`fas ${item.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-black text-navy mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.text}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
