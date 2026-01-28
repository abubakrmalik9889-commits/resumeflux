
import React from 'react';
import { TemplateType, ResumeData } from '../types.ts';
import ResumePreview from './ResumePreview.tsx';

interface TemplatesGalleryProps {
  onSelect: (t: TemplateType) => void;
}

export default function TemplatesGallery({ onSelect }: TemplatesGalleryProps) {
  const templates: { id: TemplateType, name: string, desc: string, icon: string, color: string, badge: string }[] = [
    { id: 'modern', name: 'Modern Professional', desc: 'Our most popular template. Clean, sharp, and authoritative.', icon: 'fa-star', color: 'bg-teal/10 text-teal', badge: 'POPULAR' },
    { id: 'executive', name: 'Premium Executive', desc: 'Commanding presence for leadership roles. Bold headers and clear sectioning.', icon: 'fa-briefcase', color: 'bg-navy/10 text-navy', badge: 'MANAGEMENT' },
    { id: 'professional', name: 'Classic Pro', desc: 'Strictly professional layout with heavy emphasis on technical skills.', icon: 'fa-crown', color: 'bg-amber-100 text-amber-800', badge: 'PRO' },
    { id: 'minimal', name: 'Visual Designer', desc: 'Modern and airy. Perfect for creative roles where clarity is key.', icon: 'fa-palette', color: 'bg-rose-100 text-rose-500', badge: 'CREATIVE' },
    { id: 'simple', name: 'Safe Standard', desc: 'Ultra-compatible utilitarian design for entry-level applications.', icon: 'fa-check-double', color: 'bg-emerald-100 text-emerald-600', badge: 'SIMPLE' },
    { id: 'creative', name: 'Dynamic Flow', desc: 'Vibrant and energetic. For those who want to stand out instantly.', icon: 'fa-bolt', color: 'bg-teal/10 text-teal', badge: 'NEW' }
  ];

  const dummyData: ResumeData = {
    id: 'preview',
    title: 'Preview Resume',
    updatedAt: Date.now(),
    personalInfo: {
      fullName: 'Abubakr Malik',
      jobTitle: 'Senior Product Manager',
      email: 'abubakrmalik9889@gmail.com',
      phone: '03098709280',
      location: 'Pakistan',
      linkedin: 'linkedin.com/in/muhammad-abubakar-75b62626a',
      website: ''
    },
    summary: 'Strategic product leader with 10+ years experience in SaaS. Proven track record of scaling products from zero to $10M ARR.',
    workExperience: [
      {
        id: '1',
        company: 'TechCorp Solutions',
        role: 'Senior Product Manager',
        location: 'San Francisco, CA',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        description: 'Led a cross-functional team of 15 to launch a new enterprise dashboard. Increased user engagement by 45%.'
      }
    ],
    education: [
      { id: '1', school: 'Stanford University', degree: 'MBA', field: 'Business Strategy', location: 'Palo Alto, CA', graduationDate: '2018' }
    ],
    skills: [{ id: '1', name: 'Product Strategy', level: 'Expert' }, { id: '2', name: 'AI/ML Implementation', level: 'Advanced' }],
    template: 'modern',
    margin: 0.4
  };

  return (
    <div className="py-24 px-4 bg-slate-50 animate-fadeIn min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-6 py-2 bg-teal text-navy rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-10 shadow-xl shadow-teal/20">
            <i className="fas fa-layer-group mr-2"></i> Professional Templates
          </div>
          <h2 className="text-5xl font-black text-navy mb-8 tracking-tighter">Choose your winning style</h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Every template is meticulously crafted to be 100% ATS-compliant and recruiter-approved.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {templates.map((t) => (
            <div 
              key={t.id} 
              className="group cursor-pointer flex flex-col items-center" 
              onClick={() => onSelect(t.id)}
            >
              <div className="relative w-full aspect-[3/4.2] bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden transform group-hover:-translate-y-4 transition-all duration-500 ease-out">
                <div className="absolute inset-0 origin-top flex justify-center pt-8 bg-slate-50">
                   <div className="scale-[0.22] origin-top w-[210mm] shadow-2xl border border-gray-100 bg-white">
                      <ResumePreview data={{ ...dummyData, template: t.id }} />
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/80 flex flex-col items-center justify-center transition-all duration-500 backdrop-blur-0 group-hover:backdrop-blur-sm">
                  <div className="bg-teal text-navy px-10 py-4 rounded-2xl font-black text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl translate-y-8 group-hover:translate-y-0">
                    USE THIS TEMPLATE
                  </div>
                </div>

                <div className="absolute top-6 right-6">
                  <span className="bg-white text-navy px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest shadow-lg border border-gray-100">
                    {t.badge}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 text-center px-4 w-full">
                <h3 className="text-xl font-black text-navy mb-2 group-hover:text-teal transition-colors">{t.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
