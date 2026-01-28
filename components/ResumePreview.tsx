
import React from 'react';
import { ResumeData } from '../types.ts';

interface ResumePreviewProps {
  data: ResumeData;
  id?: string;
  scale?: number;
}

export default function ResumePreview({ data, id = "resume-canvas", scale = 1 }: ResumePreviewProps) {
  const { personalInfo, workExperience, education, skills, summary, template = 'modern', margin = 0.4 } = data;

  const renderHeader = () => {
    switch (template) {
      case 'modern':
        const contactParts = [
          personalInfo.email,
          personalInfo.phone,
          personalInfo.location,
          personalInfo.linkedin
        ].filter(Boolean);

        return (
          <header className="text-center border-b-2 border-navy/10 pb-6 mb-10">
            <h1 className="text-[24pt] font-black text-navy uppercase tracking-tight leading-tight mb-1">
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            <p className="text-teal font-bold text-lg tracking-[0.1em] uppercase mb-4">
              {personalInfo.jobTitle || 'Professional Role'}
            </p>
            <div className="flex justify-center items-center flex-wrap gap-x-3 text-[10pt] font-medium text-gray-600">
              {contactParts.map((part, index) => (
                <React.Fragment key={index}>
                  <span>{part}</span>
                  {index < contactParts.length - 1 && <span className="text-gray-300 font-light">|</span>}
                </React.Fragment>
              ))}
            </div>
          </header>
        );
      case 'professional':
        return (
          <header className="mb-10 text-center">
            <h1 className="text-[32pt] font-black text-navy uppercase tracking-tight leading-none mb-3">
              {personalInfo.fullName || 'NAME SURNAME'}
            </h1>
            <p className="text-[16pt] font-bold text-navy/70 mb-5 uppercase tracking-[0.3em]">
              {personalInfo.jobTitle || 'EXECUTIVE LEADER'}
            </p>
            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-[10pt] text-gray-600 border-t border-b border-gray-100 py-4">
              {personalInfo.email && <span className="flex items-center"><i className="fas fa-envelope mr-2 text-navy/40"></i> {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center"><i className="fas fa-phone mr-2 text-navy/40"></i> {personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center"><i className="fas fa-map-marker-alt mr-2 text-navy/40"></i> {personalInfo.location}</span>}
            </div>
          </header>
        );
      case 'executive':
        return (
          <header className="mb-12 text-center">
            <h1 className="text-[24pt] font-black text-navy uppercase mb-3 tracking-tight">
              {personalInfo.fullName || 'FULL NAME'}
            </h1>
            <div className="flex justify-center items-center gap-x-4 text-[10pt] text-gray-500 font-medium">
              <span>{personalInfo.email || 'email@example.com'}</span>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.phone || '000.000.0000'}</span>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.location || 'Location'}</span>
            </div>
          </header>
        );
      case 'creative':
        return (
          <header className="mb-12 flex items-end justify-between border-b-8 border-navy pb-8">
            <div className="max-w-[60%]">
              <h1 className="text-7xl font-black text-navy tracking-tighter leading-[0.8]">
                {personalInfo.fullName?.split(' ')[0] || 'FIRST'}<br/>
                <span className="text-teal">{personalInfo.fullName?.split(' ')[1] || 'LAST'}</span>
              </h1>
            </div>
            <div className="text-right flex flex-col items-end space-y-1">
              <span className="bg-navy text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase mb-4">{personalInfo.jobTitle || 'CREATIVE DIRECTOR'}</span>
              <span className="text-xs font-bold text-gray-400">{personalInfo.email}</span>
              <span className="text-xs font-bold text-gray-400">{personalInfo.phone}</span>
              <span className="text-xs font-bold text-gray-400">{personalInfo.location}</span>
            </div>
          </header>
        );
      case 'minimal':
        return (
          <header className="mb-20 text-left">
            <h1 className="text-7xl font-thin text-gray-900 tracking-tighter mb-6">
              {personalInfo.fullName || 'Name'}
            </h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
              <span className="text-gray-900">{personalInfo.jobTitle}</span>
              <span className="hidden md:inline text-gray-200">/</span>
              <span>{personalInfo.location}</span>
              <span className="hidden md:inline text-gray-200">/</span>
              <span>{personalInfo.email}</span>
            </div>
          </header>
        );
      case 'simple':
      default:
        return (
          <header className="border-b-2 border-black pb-6 mb-10 text-left">
            <h1 className="text-4xl font-bold text-black uppercase mb-2 tracking-tighter">
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            <div className="flex flex-wrap gap-x-6 text-xs font-bold text-black uppercase tracking-widest">
              <span>{personalInfo.email}</span>
              <span>{personalInfo.phone}</span>
              <span>{personalInfo.location}</span>
            </div>
          </header>
        );
    }
  };

  const getSectionHeadingClass = () => {
    switch (template) {
      case 'modern': return "text-base font-black text-navy uppercase tracking-[0.25em] border-l-8 border-teal pl-4 mb-8 mt-14 first:mt-0 text-left";
      case 'executive': return "bg-[#2b547e] text-white text-[12pt] font-bold uppercase py-2 px-4 mb-6 mt-10 first:mt-0 text-center";
      case 'professional': return "bg-navy text-white text-[12pt] font-black uppercase tracking-[0.3em] px-6 py-2.5 mb-8 mt-12 first:mt-0 w-full text-left";
      case 'creative': return "text-2xl font-black text-navy mb-6 mt-12 first:mt-0 flex items-center after:content-[''] after:flex-1 after:h-[2px] after:bg-navy/10 after:ml-6";
      case 'minimal': return "text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-10 mt-16 first:mt-0 border-b border-gray-100 pb-4";
      default: return "text-lg font-black text-black uppercase border-b-2 border-black pb-1.5 mb-6 mt-12 first:mt-0 text-left";
    }
  };

  const paddingMm = margin * 25.4;

  const content = (
    <div className="text-left">
      {summary && (
        <section className="mb-10">
          <h2 className={getSectionHeadingClass()}>Profile</h2>
          <p className={`leading-[1.7] text-gray-800 text-justify ${template === 'executive' || template === 'simple' ? 'text-[10pt]' : 'text-[14px]'} ${template === 'minimal' ? 'font-light text-gray-500' : ''}`}>
            {summary}
          </p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-10">
          <h2 className={getSectionHeadingClass()}>Expertise</h2>
          <div className={`
            ${template === 'executive' ? 'grid grid-cols-3 gap-y-2' : 
              template === 'minimal' ? 'grid grid-cols-2 gap-4' :
              'flex flex-wrap gap-3'}
          `}>
            {skills.map((skill) => (
              <span key={skill.id} className={`
                ${template === 'executive' ? 'text-[10pt] font-bold text-navy flex items-center' : 
                  template === 'minimal' ? 'text-[11px] font-bold text-gray-800 py-1' :
                  template === 'creative' ? 'px-3 py-1 bg-navy text-white text-[9px] font-black uppercase tracking-widest rounded-sm' :
                  'px-4 py-2 bg-slate-50 border border-slate-100 text-navy font-black text-[10px] uppercase tracking-widest rounded-lg'}
              `}>
                {template === 'executive' && <span className="w-1.5 h-1.5 bg-navy rounded-full mr-2"></span>}
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {workExperience.length > 0 && (
        <section className="mb-10">
          <h2 className={getSectionHeadingClass()}>Experience</h2>
          <div className="space-y-10">
            {workExperience.map((exp) => (
              <div key={exp.id} className="text-left group">
                <div className={`flex justify-between items-baseline mb-2 ${template === 'minimal' ? 'flex-col md:flex-row' : ''}`}>
                  <h3 className={`font-black text-navy uppercase tracking-tight ${template === 'executive' ? 'text-[10pt]' : 'text-[15px]'}`}>
                    {exp.role}{template === 'minimal' ? '' : ','} <span className="text-gray-500 font-bold">{exp.company}</span>
                  </h3>
                  <span className={`font-bold text-gray-700 whitespace-nowrap ${template === 'minimal' ? 'text-[10px] uppercase tracking-widest text-blue-500 mt-1' : 'text-[10pt] ml-6'}`}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {template !== 'executive' && template !== 'simple' && (
                  <div className="text-[10px] text-teal font-black uppercase tracking-[0.2em] mb-3">
                    {exp.location}
                  </div>
                )}
                <p className={`text-gray-700 whitespace-pre-wrap leading-[1.6] text-justify ${template === 'executive' || template === 'simple' ? 'text-[10pt]' : 'text-[14px]'} ${template === 'minimal' ? 'font-light text-gray-500 border-l-2 border-gray-50 pl-6' : ''}`}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-10">
          <h2 className={getSectionHeadingClass()}>Education</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-left">
                <div>
                  <h3 className={`font-bold text-navy mb-1 ${template === 'executive' || template === 'simple' ? 'text-[10pt]' : 'text-[14px]'}`}>{edu.degree} {edu.field && <span className="text-gray-400 font-medium">in {edu.field}</span>}</h3>
                  <p className="text-[10pt] text-gray-500 font-medium">{edu.school}, {edu.location}</p>
                </div>
                <span className="text-[10pt] text-gray-500 font-bold whitespace-nowrap ml-6">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return (
    <div 
      id={id}
      className="bg-white mx-auto shadow-2xl relative overflow-hidden text-left"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        padding: `${paddingMm}mm`,
        boxSizing: 'border-box',
        color: '#1F2A44',
        fontFamily: template === 'minimal' ? 'Inter, sans-serif' : template === 'creative' ? 'Inter, sans-serif' : 'Inter, sans-serif',
        transform: scale !== 1 ? `scale(${scale})` : 'none',
        transformOrigin: 'top center'
      }}
    >
      {renderHeader()}
      {content}
      
      <style>{`
        @media print {
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          #${id} { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important; 
            height: auto !important; 
            padding: ${paddingMm}mm !important; 
            border: none !important; 
            transform: none !important;
          }
        }
        #${id} h1, #${id} h2, #${id} h3 { page-break-after: avoid; }
        #${id} section { page-break-inside: avoid; margin-bottom: 1.5rem; }
        #${id} p { word-wrap: break-word; }
      `}</style>
    </div>
  );
}
