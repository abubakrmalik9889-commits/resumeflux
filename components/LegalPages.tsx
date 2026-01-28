
import React from 'react';

const Container = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="bg-slate-50 py-32 px-4 animate-fadeIn min-h-screen">
    <div className="max-w-4xl mx-auto bg-white p-16 rounded-[48px] shadow-2xl border border-gray-100">
      <h1 className="text-5xl font-black text-navy mb-12 tracking-tighter">{title}</h1>
      <div className="prose prose-slate max-w-none text-gray-500 leading-relaxed font-medium space-y-8">
        {children}
      </div>
    </div>
  </div>
);

export const PrivacyPage = () => (
  <Container title="Privacy Policy">
    <section>
      <h2 className="text-2xl font-black text-navy mb-4">1. Data Collection</h2>
      <p>We only collect information that is necessary to provide you with the services offered on resumeflux. This includes resume data you input, account credentials, and basic usage analytics to improve our AI models.</p>
    </section>
    <section>
      <h2 className="text-2xl font-black text-navy mb-4">2. AI Data Usage</h2>
      <p>Your resume content is processed using the Google Gemini API. This data is used solely to generate suggestions, summaries, and ATS audits for you. Your data is never used to train global AI models without your explicit consent.</p>
    </section>
    <section>
      <h2 className="text-2xl font-black text-navy mb-4">3. Your Rights</h2>
      <p>You have the right to access, export, or delete your data at any time through your dashboard. Since we use localStorage for guest users, clearing your browser data will also remove your local resumes.</p>
    </section>
  </Container>
);

export const TermsPage = () => (
  <Container title="Terms of Service">
    <section>
      <h2 className="text-2xl font-black text-navy mb-4">1. Acceptance of Terms</h2>
      <p>By using resumeflux, you agree to these terms. We provide AI-assisted career tools intended for professional development and job seeking purposes.</p>
    </section>
    <section>
      <h2 className="text-2xl font-black text-navy mb-4">2. Pro Subscription</h2>
      <p>Pro features are provided on a subscription basis. You may cancel at any time. Refunds are handled in accordance with our refund policy found in the Help Center.</p>
    </section>
    <section>
      <h2 className="text-2xl font-black text-navy mb-4">3. Disclaimer</h2>
      <p>While our AI is highly advanced, we do not guarantee employment. resumeflux is a tool to improve your chances, but final hiring decisions are made by employers.</p>
    </section>
  </Container>
);
