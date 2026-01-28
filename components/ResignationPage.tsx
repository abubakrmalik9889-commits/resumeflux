
import React, { useState } from 'react';
import { optimizeContent } from '../services/geminiService.ts';

export default function ResignationPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [lastDay, setLastDay] = useState('');
  const [reason, setReason] = useState('');
  const [tone, setTone] = useState('Professional');
  const [letter, setLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!name || !company || !role) {
      alert("Please fill in at least Name, Company, and Role.");
      return;
    }
    setIsGenerating(true);
    const prompt = `Write a ${tone} resignation letter for ${name} leaving ${company} as ${role}. Last day is ${lastDay}. Reason (if provided): ${reason}. Include a thank you for the opportunity and a commitment to helping with the transition.`;
    const res = await optimizeContent('', prompt);
    setLetter(res);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-rose-100">
             Moving On
          </div>
          <h1 className="text-5xl font-black text-navy mb-4 tracking-tighter">AI Resignation Generator</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">Leave on a high note with a perfectly crafted professional resignation letter.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xl font-black text-navy mb-8">Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</label>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Day</label>
                  <input type="text" placeholder="e.g. June 30th" value={lastDay} onChange={(e) => setLastDay(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Leaving (Optional)</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-teal transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Letter Tone</label>
                <div className="flex flex-wrap gap-2">
                  {['Professional', 'Graceful', 'Direct', 'Emotional'].map((t) => (
                    <button key={t} onClick={() => setTone(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${tone === t ? 'bg-navy text-white border-navy' : 'bg-white text-gray-400 border-gray-100 hover:border-teal'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-navy text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                {isGenerating ? <><i className="fas fa-spinner fa-spin mr-2"></i> Thinking...</> : <><i className="fas fa-magic mr-2"></i> Generate Letter</>}
              </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-black text-navy mb-8">Generated Result</h3>
            <div className="flex-1 bg-slate-50 rounded-3xl p-8 overflow-y-auto custom-scrollbar relative border border-slate-100">
               {letter ? (
                 <div className="whitespace-pre-wrap text-slate-700 font-serif leading-relaxed text-lg animate-fadeIn">{letter}</div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <i className="fas fa-envelope-open text-4xl mb-4"></i>
                    <p className="font-bold">Your letter will appear here.</p>
                 </div>
               )}
            </div>
            {letter && (
              <div className="mt-8 flex space-x-4">
                <button onClick={() => navigator.clipboard.writeText(letter)} className="flex-1 py-3 border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Copy to Clipboard</button>
                <button onClick={() => window.print()} className="flex-1 py-3 bg-teal text-navy rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Download PDF</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
