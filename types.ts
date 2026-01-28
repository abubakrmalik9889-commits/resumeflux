
export type TemplateType = 'modern' | 'professional' | 'minimal' | 'executive' | 'creative' | 'simple';

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  avatar?: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  location: string;
  jobTitle: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: number;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  summary: string;
  template: TemplateType;
  jobDescription?: string;
  margin?: number; // Margin in inches
}

export interface ATSAnalysis {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  section_feedback: {
    Summary: string;
    Experience: string;
    Skills: string;
    Formatting: string;
  };
  ai_suggestions: {
    Experience: string[];
    Summary: string[];
  };
  match_score?: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export enum ResumeStep {
  PERSONAL = 'Personal',
  EXPERIENCE = 'Experience',
  EDUCATION = 'Education',
  SKILLS = 'Skills',
  SUMMARY = 'Summary',
  FINISH = 'Preview & Finish'
}

export type AppView = 'home' | 'pricing' | 'templates' | 'contact' | 'builder' | 'ats-report' | 'cover-letter' | 'ats-checker' | 'dashboard' | 'about' | 'faq' | 'resignation' | 'privacy' | 'terms' | 'login' | 'signup';
