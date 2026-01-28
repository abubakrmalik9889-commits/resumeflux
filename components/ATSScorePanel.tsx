
import React, { useState } from 'react';
import { ATSAnalysis } from '../types.ts';

interface ATSScorePanelProps {
  analysis: ATSAnalysis | null;
  jobDescription: string;
  onJobDescChange: (val: string) => void;
  onAnalyze: () => void;
  onFullReport: () => void;
  isLoading: boolean;
}

export default function ATSScorePanel({ 
  analysis, 
  jobDescription, 
  onJobDescChange, 
  onAnalyze, 
  onFullReport, 
  isLoading 
}: ATSScorePanelProps) {
  const [showJDInput, setShowJDInput] = useState(false);
  const score = analysis?.score || 0;
  
  const getStatus = (s: number) => {
    if (s >= 80) return { color: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-400', label: 'Strong' };
    if (s >= 60) return { color: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-400', label: 'Average' };
    return { color: 'text-rose-400', stroke: '#f43f5e', bg: 'bg-rose-400', label: 'Needs Work' };
  };

  const status = getStatus(score);
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl transition-all duration-500">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal flex items-center">
          <i className="fas fa-microchip mr-2 animate-pulse"></i> AI Auditor Pro
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowJDInput(!showJDInput)} 
            className={`text-xs transition-colors ${showJDInput ? 'text-teal' : 'text-white/40'}`}
            title="Target specific job description"
          >
            <i className="fas fa-bullseye"></i>
          </button>
          <button onClick={onAnalyze} disabled={isLoading} className="text-white/40 hover:text-white transition-all">
            <i className={`fas fa-sync-alt text-xs ${isLoading ? 'fa-spin text-teal' : ''}`}></i>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {showJDInput && (
          <div className="animate-slideDown">
            <label className="text-[9px] font-bold text-teal uppercase tracking-widest block mb-2">Target Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => onJobDescChange(e.target.value)}
              placeholder="Paste job description here for localized matching..."
              className="w-full h-24 bg-navy/50 border border-white/10 rounded-xl p-3 text-[10px] text-white/70 outline-none focus:border-teal/50 transition-colors custom-scrollbar"
            />
          </div>
        )}

        <div className="flex flex-col items-center relative py-2">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle 
              cx="48" 
              cy="48" 
              r={radius} 
              stroke={status.stroke} 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={circ} 
              style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className={`text-2xl font-black block leading-none ${status.color}`}>{score}</span>
            <span className="text-[7px] font-black text-white/30 uppercase tracking-tighter">ATS Score</span>
          </div>
        </div>

        {/* Linear Progress Bar Enhancement */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/30">
            <span>Overall Readiness</span>
            <span className={status.color}>{status.label}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${status.bg}`} 
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>

        {!analysis ? (
          <button onClick={onAnalyze} disabled={isLoading} className="w-full py-3 bg-teal text-navy rounded-xl text-xs font-black hover:brightness-110 active:scale-95 transition-all">
            {isLoading ? 'ANALYZING...' : 'RUN DEEP AUDIT'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
               <span>Matched: <span className="text-emerald-400">{analysis.matched_keywords?.length || 0}</span></span>
               <span>Missing: <span className="text-rose-400">{analysis.missing_keywords?.length || 0}</span></span>
            </div>

            {/* Strengths & Weaknesses Preview Enhancement */}
            <div className="space-y-3">
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="flex flex-col space-y-1.5">
                  <span className="text-[8px] font-black text-emerald-400/60 uppercase tracking-widest">Top Strength</span>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex items-start">
                    <i className="fas fa-check-circle text-emerald-400 text-[10px] mt-0.5 mr-2"></i>
                    <p className="text-[10px] text-white/70 leading-tight font-medium">{analysis.strengths[0]}</p>
                  </div>
                </div>
              )}

              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div className="flex flex-col space-y-1.5">
                  <span className="text-[8px] font-black text-rose-400/60 uppercase tracking-widest">Main Weakness</span>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 flex items-start">
                    <i className="fas fa-exclamation-triangle text-rose-400 text-[10px] mt-0.5 mr-2"></i>
                    <p className="text-[10px] text-white/70 leading-tight font-medium">{analysis.weaknesses[0]}</p>
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={onFullReport} className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
              Full AI Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
