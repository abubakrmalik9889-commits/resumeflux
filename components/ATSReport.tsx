
import React from 'react';
import { ATSAnalysis } from '../types.ts';

export default function ATSReport({ analysis, onBack }: { analysis: ATSAnalysis | null, onBack: () => void }) {
  if (!analysis) return null;

  // Helper to split feedback text into meaningful bullet points
  const formatFeedback = (text: string) => {
    if (!text) return [];
    return text
      .split(/[.!?]|\n|•/)
      .map(s => s.trim())
      .filter(s => s.length > 10); // Filter out very short strings/empty parts
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16 animate-fadeIn pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <button onClick={onBack} className="flex items-center text-navy font-black text-sm hover:translate-x-[-4px] transition-transform">
            <i className="fas fa-arrow-left mr-2"></i> Back to Builder
          </button>
          <div className="flex items-center space-x-3">
             <div className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
               <i className="fas fa-check-circle mr-2"></i> JobMentis Pro Audit Unlocked
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Score & Summary */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border border-slate-100">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10">ATS Compliance Score</h2>
              <div className="relative w-48 h-48 flex items-center justify-center mb-10">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                   <circle 
                     cx="96" 
                     cy="96" 
                     r="80" 
                     stroke={analysis.score >= 80 ? '#10b981' : analysis.score >= 60 ? '#f59e0b' : '#f43f5e'} 
                     strokeWidth="16" 
                     fill="transparent" 
                     strokeDasharray={2 * Math.PI * 80} 
                     strokeDashoffset={2 * Math.PI * 80 * (1 - (analysis.score)/100)} 
                     strokeLinecap="round" 
                     className="transition-all duration-1000"
                   />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-6xl font-black text-navy leading-none">{analysis.score}</span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">% Score</span>
                 </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 w-full mb-8">
                <p className="text-[11px] font-black text-navy uppercase tracking-widest leading-relaxed">
                  {analysis.score >= 80 ? 'Highly Optimized' : analysis.score >= 60 ? 'Competitive' : 'Action Required'}
                </p>
              </div>
              <button onClick={() => window.print()} className="w-full py-4 bg-navy text-white rounded-2xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all">
                <i className="fas fa-file-pdf mr-2"></i> Save Report
              </button>
            </div>
          </div>

          {/* Detailed Audit */}
          <div className="lg:col-span-3 space-y-8">
            {/* Keyword Analysis */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-navy mb-8 flex items-center">
                <i className="fas fa-bullseye text-blue-500 mr-3"></i> Keyword Matrix
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center">
                    Matched Keywords <span className="ml-2 bg-emerald-100 px-2 py-0.5 rounded text-emerald-700">{analysis.matched_keywords?.length || 0}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matched_keywords?.map((k, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-emerald-100">
                        <i className="fas fa-check mr-1.5 opacity-50"></i> {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center">
                    Missing Keywords <span className="ml-2 bg-rose-100 px-2 py-0.5 rounded text-rose-700">{analysis.missing_keywords?.length || 0}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords?.map((k, i) => (
                      <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-lg border border-rose-100">
                        <i className="fas fa-plus mr-1.5 opacity-50"></i> {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Section Feedback */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
              <h3 className="text-xl font-black text-navy mb-8 flex items-center">
                <i className="fas fa-clipboard-check text-teal mr-3"></i> Expert Section Audit
              </h3>
              <div className="grid grid-cols-1 gap-8">
                {analysis.section_feedback && Object.entries(analysis.section_feedback).map(([section, feedback], i) => {
                  const points = formatFeedback(feedback);
                  return (
                    <div key={i} className="group border-b border-slate-50 last:border-0 pb-8 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[12px] font-black text-navy uppercase tracking-[0.2em] flex items-center">
                          <span className="w-8 h-8 bg-slate-50 text-teal rounded-lg flex items-center justify-center mr-3 group-hover:bg-teal group-hover:text-white transition-all shadow-sm">
                            <i className={`fas ${section === 'Summary' ? 'fa-user' : section === 'Experience' ? 'fa-briefcase' : section === 'Skills' ? 'fa-bolt' : 'fa-font'} text-[10px]`}></i>
                          </span>
                          {section}
                        </h4>
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Section Scan</span>
                      </div>
                      
                      {points.length > 0 ? (
                        <ul className="space-y-3 pl-11">
                          {points.map((point, idx) => (
                            <li key={idx} className="flex items-start text-xs text-slate-600 leading-relaxed font-medium">
                              <i className="fas fa-arrow-right text-[8px] text-teal/40 mt-1.5 mr-3 shrink-0"></i>
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 leading-relaxed font-medium pl-11 italic">
                          {feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Optimization Suggestions */}
            <div className="bg-navy rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
               <h3 className="text-2xl font-black text-teal mb-10 flex items-center">
                 <i className="fas fa-wand-magic-sparkles mr-4"></i> AI Optimization Roadmap
               </h3>
               <div className="space-y-10 relative z-10">
                  {analysis.ai_suggestions?.Experience?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-teal uppercase tracking-widest">Rewritten Experience Bullets</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {analysis.ai_suggestions.Experience.map((s, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 italic text-sm text-slate-300 leading-relaxed border-l-4 border-l-teal hover:bg-white/[0.08] transition-colors">
                            "{s}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.ai_suggestions?.Summary?.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-teal uppercase tracking-widest">High-Impact Summary Revision</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {analysis.ai_suggestions.Summary.map((s, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 italic text-sm text-slate-300 leading-relaxed border-l-4 border-l-blue-400 hover:bg-white/[0.08] transition-colors">
                            "{s}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
