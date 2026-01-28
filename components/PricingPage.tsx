
import React from 'react';

export default function PricingPage({ onSelect }: { onSelect: () => void }) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["1 Active Resume", "Modern Template", "Basic AI Editor", "Standard PDF Export"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      features: ["Unlimited Resumes", "All Templates", "Full AI Optimization", "ATS Score Checker", "LinkedIn Import"],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Ultimate",
      price: "$39",
      features: ["Everything in Pro", "Cover Letter Builder", "Priority AI Tokens", "Expert Review Session", "Custom Domain"],
      cta: "Get Ultimate",
      popular: false
    }
  ];

  return (
    <div className="py-24 bg-gray-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-500 mb-16">Choose the plan that's right for your career stage.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-blue-600 shadow-2xl relative scale-105' : 'border-gray-100 shadow-sm'} flex flex-col`}>
              {plan.popular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold py-1 px-4 rounded-full">MOST POPULAR</span>}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center mb-8">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-gray-400 ml-1">/mo</span>
              </div>
              <ul className="text-left space-y-4 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onSelect} className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
