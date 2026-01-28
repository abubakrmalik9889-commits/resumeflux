
import React, { useState, useEffect } from 'react';
import { 
  ResumeData, 
  ResumeStep, 
  ATSAnalysis,
  AppView,
  User
} from './types.ts';
import StepNavigator from './components/StepNavigator.tsx';
import ResumePreview from './components/ResumePreview.tsx';
import ATSScorePanel from './components/ATSScorePanel.tsx';
import ATSReport from './components/ATSReport.tsx';
import { optimizeContent, analyzeATS, getSkillSuggestions, generateCoverLetter } from './services/geminiService.ts';
import { downloadAsDocx } from './services/exportService.ts';
import LandingPage from './components/LandingPage.tsx';
import PricingPage from './components/PricingPage.tsx';
import TemplatesGallery from './components/TemplatesGallery.tsx';
import ContactPage from './components/ContactPage.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import ATSCheckerPage from './components/ATSCheckerPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import AboutPage from './components/AboutPage.tsx';
import FAQPage from './components/FAQPage.tsx';
import ResignationPage from './components/ResignationPage.tsx';
import { PrivacyPage, TermsPage } from './components/LegalPages.tsx';
import AuthPage from './components/AuthPage.tsx';

const INITIAL_RESUME: ResumeData = {
  id: 'default',
  title: 'My First Resume',
  updatedAt: Date.now(),
  personalInfo: { fullName: '', email: '', phone: '', linkedin: '', website: '', location: '', jobTitle: '' },
  workExperience: [],
  education: [],
  skills: [],
  summary: '',
  template: 'modern',
  jobDescription: '',
  margin: 0.4
};

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<ResumeStep>(ResumeStep.PERSONAL);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string>('default');

  useEffect(() => {
    // Load auth
    const savedUser = localStorage.getItem('resumeflux_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load resumes
    const savedResumes = localStorage.getItem('resumeflux_resumes');
    if (savedResumes) {
      try {
        const parsed = JSON.parse(savedResumes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResumes(parsed);
          setCurrentResumeId(parsed[0].id);
        } else {
          setResumes([INITIAL_RESUME]);
        }
      } catch (e) {
        setResumes([INITIAL_RESUME]);
      }
    } else {
      setResumes([INITIAL_RESUME]);
    }
  }, []);

  useEffect(() => {
    if (resumes.length > 0) {
      localStorage.setItem('resumeflux_resumes', JSON.stringify(resumes));
    }
  }, [resumes]);

  const currentResume = resumes.find(r => r.id === currentResumeId) || resumes[0] || INITIAL_RESUME;

  const handleUpdateResume = (updates: Partial<ResumeData>) => {
    setResumes(prev => prev.map(r => 
      r.id === currentResumeId 
        ? { ...r, ...updates, updatedAt: Date.now() } 
        : r
    ));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('resumeflux_user', JSON.stringify(updatedUser));
  };

  const handleCreateNewResume = (template: ResumeData['template'] = 'modern') => {
    const newResume: ResumeData = {
      ...INITIAL_RESUME,
      id: crypto.randomUUID(),
      title: `Resume ${resumes.length + 1}`,
      template,
      updatedAt: Date.now()
    };
    setResumes(prev => [...prev, newResume]);
    setCurrentResumeId(newResume.id);
    setView('builder');
    setCurrentStep(ResumeStep.PERSONAL);
  };

  const handleDeleteResume = (id: string) => {
    if (resumes.length <= 1) {
      const reset = { ...INITIAL_RESUME, id: crypto.randomUUID() };
      setResumes([reset]);
      setCurrentResumeId(reset.id);
      return;
    }
    const newResumes = resumes.filter(r => r.id !== id);
    setResumes(newResumes);
    if (currentResumeId === id) {
      setCurrentResumeId(newResumes[0].id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('resumeflux_user');
    setUser(null);
    setView('home');
  };

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setView('dashboard');
  };

  const handleMockLinkedInImport = async () => {
    setIsImporting(true);
    await new Promise(r => setTimeout(r, 2000));
    handleUpdateResume({
      personalInfo: {
        fullName: user?.name || 'Abubakr Malik',
        jobTitle: 'Senior Full Stack Engineer & AI Specialist',
        email: 'abubakrmalik9889@gmail.com',
        phone: '03098709280',
        location: 'Pakistan',
        linkedin: 'linkedin.com/in/muhammad-abubakar-75b62626a',
        website: 'abubakr.dev'
      },
      summary: 'High-performing Software Engineer with a specialization in building intelligent, scalable web architectures. Expert in React, Node.js, and Generative AI integration.',
      skills: [
        { id: 's1', name: 'TypeScript/React', level: 'Expert' },
        { id: 's2', name: 'Gemini AI Integration', level: 'Expert' },
        { id: 's3', name: 'Full Stack Development', level: 'Expert' },
        { id: 's4', name: 'System Optimization', level: 'Advanced' }
      ],
      workExperience: [
        {
          id: 'w1',
          company: 'AI Solutions Hub',
          role: 'Lead Full Stack Engineer',
          location: 'Remote',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          description: 'Architecting end-to-end AI applications using Google Gemini API. Reduced response latency by 40% and improved user engagement through personalized AI-driven content generation.'
        }
      ]
    });
    setIsImporting(false);
  };

  const handleOptimizePersonalInfo = async () => {
    if (!currentResume.personalInfo.jobTitle) return;
    setIsOptimizing(true);
    const optimized = await optimizeContent(currentResume.personalInfo.jobTitle, "High-impact professional job title");
    handleUpdateResume({ personalInfo: { ...currentResume.personalInfo, jobTitle: optimized } });
    setIsOptimizing(false);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const res = await analyzeATS(currentResume, currentResume.jobDescription);
    setAnalysis(res);
    setIsAnalyzing(false);
  };

  const handleDocxDownload = async () => {
    setIsExportingDocx(true);
    await downloadAsDocx(currentResume);
    setIsExportingDocx(false);
  };

  const handleCreateCoverLetter = async () => {
    setIsGeneratingCL(true);
    const cl = await generateCoverLetter(currentResume, currentResume.jobDescription || '');
    setCoverLetter(cl);
    setView('cover-letter');
    setIsGeneratingCL(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ResumeStep.PERSONAL:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-navy">Personal Details</h2>
                <p className="text-xs text-gray-400 font-medium">Your header is your first impression.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleMockLinkedInImport}
                  disabled={isImporting}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isImporting ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fab fa-linkedin mr-2"></i>} LinkedIn Import
                </button>
                <button 
                  onClick={handleOptimizePersonalInfo}
                  disabled={isOptimizing}
                  className="px-4 py-2 bg-teal/10 text-teal rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal hover:text-navy transition-all disabled:opacity-50"
                >
                  {isOptimizing ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-wand-magic-sparkles mr-2"></i>} AI Title
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input 
                    type="text" 
                    placeholder={`e.g. ${field === 'email' ? 'abubakrmalik9889@gmail.com' : field === 'phone' ? '03098709280' : field === 'linkedin' ? 'linkedin.com/in/muhammad-abubakar-75b62626a' : ''}`}
                    value={(currentResume.personalInfo as any)[field]} 
                    onChange={(e) => handleUpdateResume({ personalInfo: { ...currentResume.personalInfo, [field]: e.target.value } })} 
                    className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-teal outline-none transition-all font-bold"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case ResumeStep.EXPERIENCE:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy">Work History</h2>
              <button onClick={() => handleUpdateResume({ workExperience: [...currentResume.workExperience, { id: crypto.randomUUID(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' }] })} className="px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-xs"><i className="fas fa-plus mr-2"></i> ADD JOB</button>
            </div>
            {currentResume.workExperience.map((exp) => (
              <div key={exp.id} className="p-8 border-2 border-gray-100 bg-white rounded-3xl relative mb-4">
                <button onClick={() => handleUpdateResume({ workExperience: currentResume.workExperience.filter(e => e.id !== exp.id) })} className="absolute top-6 right-6 text-gray-300 hover:text-rose-500"><i className="fas fa-trash"></i></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <input placeholder="Job Title" value={exp.role} onChange={(e) => handleUpdateResume({ workExperience: currentResume.workExperience.map(item => item.id === exp.id ? { ...item, role: e.target.value } : item) })} className="p-3 bg-gray-50 rounded-xl outline-none font-bold" />
                  <input placeholder="Company" value={exp.company} onChange={(e) => handleUpdateResume({ workExperience: currentResume.workExperience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item) })} className="p-3 bg-gray-50 rounded-xl outline-none font-bold" />
                </div>
                <textarea rows={4} placeholder="Description..." value={exp.description} onChange={(e) => handleUpdateResume({ workExperience: currentResume.workExperience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item) })} className="w-full p-4 border border-gray-100 rounded-xl outline-none focus:border-teal font-medium" />
              </div>
            ))}
          </div>
        );
      case ResumeStep.EDUCATION:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy">Education</h2>
              <button onClick={() => handleUpdateResume({ education: [...currentResume.education, { id: crypto.randomUUID(), school: '', degree: '', field: '', location: '', graduationDate: '' }] })} className="px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-xs"><i className="fas fa-plus mr-2"></i> ADD SCHOOL</button>
            </div>
            {currentResume.education.map((edu) => (
              <div key={edu.id} className="p-8 border-2 border-gray-100 bg-white rounded-3xl relative mb-4">
                <button onClick={() => handleUpdateResume({ education: currentResume.education.filter(e => e.id !== edu.id) })} className="absolute top-6 right-6 text-gray-300 hover:text-rose-500"><i className="fas fa-trash"></i></button>
                <input placeholder="Institution" value={edu.school} onChange={(e) => handleUpdateResume({ education: currentResume.education.map(item => item.id === edu.id ? { ...item, school: e.target.value } : item) })} className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold" />
              </div>
            ))}
          </div>
        );
      case ResumeStep.SKILLS:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-navy">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentResume.skills.map((skill) => (
                <div key={skill.id} className="p-4 bg-white border-2 border-gray-100 rounded-2xl flex justify-between items-center">
                  <span className="text-sm font-bold text-navy">{skill.name}</span>
                  <button onClick={() => handleUpdateResume({ skills: currentResume.skills.filter(s => s.id !== skill.id) })} className="text-gray-300"><i className="fas fa-times"></i></button>
                </div>
              ))}
              <input 
                placeholder="Add skill..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const name = (e.target as HTMLInputElement).value;
                    if (name) handleUpdateResume({ skills: [...currentResume.skills, { id: crypto.randomUUID(), name, level: 'Intermediate' }] });
                    (e.target as HTMLInputElement).value = '';
                  }
                }} 
                className="p-4 border-2 border-dashed border-gray-200 rounded-2xl outline-none"
              />
            </div>
          </div>
        );
      case ResumeStep.SUMMARY:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-navy">Summary</h2>
            <textarea rows={8} value={currentResume.summary} onChange={(e) => handleUpdateResume({ summary: e.target.value })} className="w-full p-8 border-2 border-gray-100 rounded-3xl outline-none focus:border-teal text-lg font-medium" />
          </div>
        );
      case ResumeStep.FINISH:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-navy">Ready to export?</h2>
              <div className="flex space-x-3">
                <button onClick={() => window.print()} className="px-6 py-3 bg-navy text-white rounded-xl font-black">EXPORT PDF</button>
                <button 
                  onClick={handleDocxDownload} 
                  disabled={isExportingDocx}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black disabled:opacity-50"
                >
                  {isExportingDocx ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'EXPORT DOCX'}
                </button>
                <button 
                  onClick={handleCreateCoverLetter} 
                  disabled={isGeneratingCL}
                  className="px-6 py-3 bg-teal text-navy rounded-xl font-black disabled:opacity-50"
                >
                  {isGeneratingCL ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'COVER LETTER'}
                </button>
              </div>
            </div>
            <div className="bg-slate-200/50 rounded-[40px] p-20 overflow-auto flex justify-center">
               <ResumePreview data={currentResume} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  const steps = Object.values(ResumeStep);
  const currentStepIndex = steps.indexOf(currentStep);

  const renderView = () => {
    switch(view) {
      case 'login': return <AuthPage type="login" onAuthSuccess={handleAuthSuccess} onSwitch={setView} />;
      case 'signup': return <AuthPage type="signup" onAuthSuccess={handleAuthSuccess} onSwitch={setView} />;
      case 'dashboard': 
        if (!user) { setView('login'); return null; }
        return (
          <Dashboard 
            user={user}
            onUpdateUser={handleUpdateUser}
            resumes={resumes} 
            onCreate={handleCreateNewResume} 
            onSelect={(id) => { setCurrentResumeId(id); setView('builder'); }} 
            onDelete={handleDeleteResume} 
          />
        );
      case 'about': return <AboutPage />;
      case 'faq': return <FAQPage />;
      case 'resignation': return <ResignationPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      case 'ats-report': return <ATSReport analysis={analysis} onBack={() => setView('builder')} />;
      case 'ats-checker': return <ATSCheckerPage onBack={() => setView('home')} />;
      case 'templates': return <TemplatesGallery onSelect={(t) => { handleUpdateResume({ template: t }); setView('builder'); }} />;
      case 'pricing': return <PricingPage onSelect={() => { if(user) handleUpdateUser({...user, isPremium: true}); setView('builder'); }} />;
      case 'contact': return <ContactPage />;
      case 'cover-letter': return (
        <div className="flex-1 bg-softWhite p-12">
          <div className="max-w-4xl mx-auto bg-white p-16 rounded-[40px] shadow-2xl border border-gray-100 animate-slideUp">
            <button onClick={() => setView('builder')} className="text-navy font-bold text-sm mb-12 flex items-center">
              <i className="fas fa-arrow-left mr-2"></i> Back to Resume
            </button>
            <h1 className="text-4xl font-black text-navy mb-8">Cover Letter</h1>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-serif text-lg">{coverLetter}</div>
          </div>
        </div>
      );
      case 'builder': return (
        <div className="min-h-screen bg-softWhite flex flex-col md:flex-row">
          <aside className="w-full md:w-80 bg-navy text-white flex flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-20">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-navy/50 backdrop-blur-xl">
              <h1 className="text-2xl font-black text-teal cursor-pointer" onClick={() => setView('home')}>resumeflux</h1>
              <button onClick={() => setView('dashboard')} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                <i className="fas fa-th-large text-sm"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
              <StepNavigator currentStep={currentStep} onStepChange={setCurrentStep} />
              <div className="mt-8 mb-12 px-2">
                <ATSScorePanel 
                  analysis={analysis} 
                  jobDescription={currentResume.jobDescription || ''}
                  onJobDescChange={(val) => handleUpdateResume({ jobDescription: val })}
                  onAnalyze={handleRunAnalysis} 
                  onFullReport={() => setView('ats-report')} 
                  isLoading={isAnalyzing} 
                />
              </div>
            </div>
          </aside>
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between no-print shadow-sm z-10">
              <div className="flex items-center space-x-6">
                 <div className="h-2 w-48 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal transition-all duration-700" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}></div>
                 </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setView('templates')} className="text-navy font-black text-xs uppercase">Styles</button>
                <button onClick={() => setCurrentStep(ResumeStep.FINISH)} className="bg-navy text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase">Preview</button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 no-print custom-scrollbar max-w-5xl mx-auto w-full animate-slideUp">
              {renderStepContent()}
              <div className="flex justify-between pt-16 mt-16 border-t border-gray-100 mb-12">
                 <button disabled={currentStepIndex === 0} onClick={() => setCurrentStep(steps[currentStepIndex - 1])} className="px-6 py-3 font-black text-gray-300">BACK</button>
                 <button 
                  onClick={() => {
                    if (currentStepIndex < steps.length - 1) setCurrentStep(steps[currentStepIndex + 1]);
                    else handleRunAnalysis().then(() => setView('ats-report'));
                  }} 
                  className="px-14 py-4 bg-navy text-white rounded-2xl font-black shadow-2xl flex items-center"
                 >
                   {currentStepIndex < steps.length - 1 ? 'CONTINUE' : 'ANALYZE'}
                 </button>
              </div>
            </div>
          </main>
        </div>
      );
      default: return <LandingPage onStart={() => setView('builder')} onAtsCheck={() => setView('ats-checker')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {view !== 'builder' && view !== 'ats-report' && view !== 'cover-letter' && view !== 'login' && view !== 'signup' && (
        <Navbar 
          setView={setView} 
          currentView={view} 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
      <div className="flex-1">
        {renderView()}
      </div>
      {view !== 'builder' && view !== 'ats-report' && view !== 'cover-letter' && view !== 'login' && view !== 'signup' && (
        <Footer setView={setView} />
      )}
    </div>
  );
}
