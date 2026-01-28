
import React, { useState } from 'react';

const FAQS = [
  { q: "What is an ATS, and why should I care?", a: "ATS stands for Applicant Tracking System. It's software used by 99% of Fortune 500 companies to filter and rank resumes. If your resume isn't ATS-friendly, it might never be seen by a human recruiter." },
  { q: "Is resumeflux really free?", a: "Yes! You can create, edit, and export your resume using our modern template for free. Premium features like advanced AI optimization and ATS scoring require a Pro subscription." },
  { q: "How secure is my data?", a: "Extremely. We use industry-standard encryption for all data storage and transit. We do not store your data on our servers longer than necessary if you're using our guest mode." },
  { q: "Can I download my resume in Word format?", a: "Yes. resumeflux Pro users can export their resumes in both high-fidelity PDF and editable DOCX formats." },
  { q: "Does the AI actually write my resume for me?", a: "It helps! Our AI acts as a co-pilot, suggesting stronger bullet points, identifying keyword gaps, and summarizing your experience to make it more impactful." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-slate-50 py-32 px-4 animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-navy mb-4 tracking-tighter">Help Center</h1>
          <p className="text-gray-500 font-medium">Answers to common questions about resumeflux and modern hiring.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-8 text-left flex justify-between items-center group"
              >
                <span className={`text-lg font-black transition-colors ${openIndex === i ? 'text-teal' : 'text-navy group-hover:text-teal'}`}>{faq.q}</span>
                <i className={`fas fa-chevron-${openIndex === i ? 'up' : 'down'} text-xs text-slate-300`}></i>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 animate-slideDown">
                  <p className="text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-navy rounded-[40px] text-center text-white relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">Still have questions?</h3>
              <p className="text-slate-400 mb-8">Our career experts are ready to help you land that job.</p>
              <button className="bg-teal text-navy px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
