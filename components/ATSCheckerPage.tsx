
import React, { useState, useRef } from 'react';
import { analyzeATSWithFile } from '../services/geminiService.ts';
import { ATSAnalysis } from '../types.ts';

export default function ATSCheckerPage({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysis | null>(null);
  const [loadingStep, setLoadingStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Restrict to PDF as it is the only document format supported natively for layout analysis by the AI
      if (selectedFile.type !== 'application/pdf') {
        alert("Please upload a PDF file. PDF is required for accurate layout and structural analysis by the ATS auditor.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCheck = async () => {
    if (!file || !jobDesc) {
      alert("Please upload your resume (PDF) and paste the job description.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    try {
      setLoadingStep('Initializing Secure Link...');
      const base64 = await fileToBase64(file);
      
      setLoadingStep('Parsing Document Structure...');
      // Small delay to simulate the complexity of a deep-scan ATS audit
      await new Promise(r => setTimeout(r, 1200));
      
      setLoadingStep('Running AI Recruiter Logic...');
      const analysis = await analyzeATSWithFile(base64, file.type, jobDesc);
      
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. This usually happens with encrypted PDFs or unsupported formats. Please ensure your file is a standard PDF.");
    } finally {
      setIsAnalyzing(false);
      setLoadingStep('');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <button onClick={onBack} className="text-navy font-bold flex items-center hover:translate-x-[-4px] transition-transform">
            <i className="fas fa-arrow-left mr-2"></i> Back to Home
          </button>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Enterprise Audit Mode</span>
          </div>
        </header>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-navy mb-4 tracking-tighter">AI-Powered ATS Auditor</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            Upload your resume in <strong>PDF format</strong> for a high-fidelity audit of keywords, layout, and structural parsability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* File Upload Zone */}
          <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xl font-black text-navy mb-6 flex items-center">
              <i className="fas fa-file-pdf text-rose-500 mr-3"></i> 1. Upload Resume (PDF)
            </h3>
            
            <div 
              onClick={triggerFileSelect}
              className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group ${
                file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="application/pdf" 
              />
              
              {!file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <i className="fas fa-file-pdf text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-navy">Click to Upload PDF</p>
                    <p className="text-sm text-slate-400 font-medium">Layout analysis requires PDF format</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-scaleIn">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-navy truncate px-4">{file.name}</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Document Secured</p>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-xs text-rose-500 font-bold hover:underline">Replace file</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* JD Input Area */}
          <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xl font-black text-navy mb-6 flex items-center">
              <i className="fas fa-bullseye text-blue-500 mr-3"></i> 2. Target Job Description
            </h3>
            <textarea 
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job title and requirements here for keyword gap analysis..."
              className="w-full h-[220px] p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:border-blue-200 focus:bg-white transition-all text-sm leading-relaxed custom-scrollbar"
            />
          </div>
        </div>

        <div className="flex justify-center mb-20">
          <button 
            onClick={handleCheck} 
            disabled={isAnalyzing}
            className="group relative px-16 py-6 bg-navy text-white rounded-[24px] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center">
              {isAnalyzing ? (
                <><i className="fas fa-spinner fa-spin mr-3"></i> {loadingStep}</>
              ) : (
                <><i className="fas fa-search mr-3 text-teal"></i> RUN ATS SCAN</>
              )}
            </span>
          </button>
        </div>

        {result && (
          <div className="animate-slideUp space-y-10">
            {/* Optimization Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col items-center text-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">ATS Compatibility Score</h4>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="84" stroke="#F1F5F9" strokeWidth="16" fill="transparent" />
                    <circle 
                      cx="96" 
                      cy="96" 
                      r="84" 
                      stroke={result.match_score && result.match_score >= 70 ? '#10B981' : '#F59E0B'} 
                      strokeWidth="16" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 84} 
                      strokeDashoffset={2 * Math.PI * 84 * (1 - (result.match_score || result.score)/100)} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-6xl font-black text-navy">{(result.match_score || result.score)}</span>
                    <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
                  </div>
                </div>
                <div className="mt-10 px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {result.match_score && result.match_score >= 80 ? 'Optimized for Top-Tier ATS' : 'Technical Hurdles Detected'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-12 rounded-[40px] shadow-2xl border border-slate-100">
                <h3 className="text-2xl font-black text-navy mb-6">Structural Audit Verdict</h3>
                <p className="text-slate-500 leading-relaxed text-lg mb-10 italic border-l-4 border-blue-100 pl-6">
                  {result.match_score && result.match_score >= 80 
                    ? "Exceptional structural integrity. Our AI recruiter simulated a standard ATS parse and your document maintained perfect hierarchy and keyword indexing." 
                    : "The auditor identified critical barriers to parsing. Non-standard headers or complex multi-column layouts might be confusing automated screening systems."}
                </p>
                
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full mb-2">High-Priority Keywords Missing</span>
                  {result.missing_keywords.length > 0 ? result.missing_keywords.map((k, i) => (
                    <span key={i} className="px-4 py-2 bg-rose-50 text-rose-600 text-[11px] font-bold rounded-xl border border-rose-100">
                      {k}
                    </span>
                  )) : <span className="text-emerald-500 font-black flex items-center"><i className="fas fa-check-circle mr-2"></i> All critical skill-keywords accounted for</span>}
                </div>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[32px] shadow-lg border border-slate-50">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8">Competitive Strengths</h4>
                <div className="space-y-6">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start group">
                      <div className="w-6 h-6 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <i className="fas fa-check text-[10px]"></i>
                      </div>
                      <span className="ml-4 text-slate-600 font-medium leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[32px] shadow-lg border border-slate-50">
                <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-8">Parsing Vulnerabilities</h4>
                <div className="space-y-6">
                  {result.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start group">
                      <div className="w-6 h-6 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <i className="fas fa-times text-[10px]"></i>
                      </div>
                      <span className="ml-4 text-slate-600 font-medium leading-relaxed">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strategic Roadmap */}
            <div className="bg-navy p-16 rounded-[48px] text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <i className="fas fa-chess-knight text-[120px]"></i>
              </div>
              <h3 className="text-3xl font-black mb-10 flex items-center text-teal">
                <i className="fas fa-route mr-4"></i> Strategy to reach 100% Match
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all flex items-start space-x-6">
                    <span className="w-10 h-10 bg-teal/20 text-teal rounded-full flex items-center justify-center shrink-0 font-black text-xs">
                      {i + 1}
                    </span>
                    <p className="text-slate-300 leading-relaxed text-sm">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
