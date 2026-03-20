import React from 'react';
import { Network, LineChart, Brain } from 'lucide-react';

export default function LandingPage({ onTryMe }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a]">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center pt-24 pb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          Predict crop yields with <br className="hidden sm:block" />
          <span className="text-emerald-600 dark:text-emerald-500">precision intelligence.</span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 dark:text-gray-400 mx-auto mb-10 text-balance leading-relaxed">
          Leverage our advanced machine learning infrastructure to project your farming outcomes based on real-world climatic and geographic inputs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onTryMe}
            className="w-full sm:w-auto saas-button-primary px-8 py-3 text-base"
          >
            Start Prediction
            <span className="ml-1 opacity-70">→</span>
          </button>
          <a href="#" className="w-full sm:w-auto saas-button-secondary px-8 py-3 text-base">
            Read the Docs
          </a>
        </div>
      </div>

      {/* Feature grid */}
      <div className="max-w-6xl mx-auto w-full pb-24 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={LineChart}
            title="Data-Driven Prediction"
            description="Our model crunches historical weather and pesticide data to give you highly accurate yield forecasts tailored to your region."
          />
          <FeatureCard 
            icon={Network}
            title="SHAP Explainability"
            description="We don't just give you a number. Our system breaks down the exact environmental factors driving your specific projection."
          />
          <FeatureCard 
            icon={Brain}
            title="AI Advisor Insights"
            description="Receive clear, human-readable analysis powered by Gemini, converting complex data metrics into actionable farming advice."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="saas-card p-6 hover:border-gray-300 dark:hover:border-[#444] transition-colors flex flex-col items-start text-left">
      <div className="p-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg text-emerald-600 dark:text-emerald-500 mb-4 border border-gray-200 dark:border-[#333]">
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
