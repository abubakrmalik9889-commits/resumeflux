
import React from 'react';
import { AppView } from '../types.ts';

export default function Footer({ setView }: { setView: (v: AppView) => void }) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-20 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <span className="text-white text-2xl font-black block">resumeflux</span>
          <p className="text-sm leading-relaxed">The world's most advanced AI resume builder. Empowering job seekers with deep tech and human-centered design.</p>
          <div className="flex space-x-5 text-lg">
            <i className="fab fa-twitter hover:text-teal cursor-pointer transition-colors"></i>
            <i className="fab fa-linkedin hover:text-teal cursor-pointer transition-colors"></i>
            <i className="fab fa-instagram hover:text-teal cursor-pointer transition-colors"></i>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Products</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => setView('builder')} className="hover:text-teal transition-colors">AI Resume Builder</button></li>
            <li><button onClick={() => setView('templates')} className="hover:text-teal transition-colors">Templates Gallery</button></li>
            <li><button onClick={() => setView('ats-checker')} className="hover:text-teal transition-colors">ATS Auditor</button></li>
            <li><button onClick={() => setView('resignation')} className="hover:text-teal transition-colors">Resignation Letter AI</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => setView('about')} className="hover:text-teal transition-colors">About Our AI</button></li>
            <li><button onClick={() => setView('pricing')} className="hover:text-teal transition-colors">Pricing Plans</button></li>
            <li><button onClick={() => setView('contact')} className="hover:text-teal transition-colors">Contact Support</button></li>
            <li><button onClick={() => setView('faq')} className="hover:text-teal transition-colors">Help Center / FAQ</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => setView('privacy')} className="hover:text-teal transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => setView('terms')} className="hover:text-teal transition-colors">Terms of Service</button></li>
            <li><button onClick={() => setView('contact')} className="hover:text-teal transition-colors">Cookie Policy</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-20 pt-10 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} resumeflux Technologies. All rights reserved. Built with Gemini AI.
      </div>
    </footer>
  );
}
