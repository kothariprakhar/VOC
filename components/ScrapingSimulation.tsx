import React, { useEffect, useState } from 'react';
import { Loader2, Check, Search, Database, BrainCircuit } from 'lucide-react';

const ScrapingSimulation: React.FC = () => {
  const [steps, setSteps] = useState([
    { id: 1, text: "Connecting to Reddit API...", status: "pending", icon: <Search className="w-4 h-4" /> },
    { id: 2, text: "Scanning Twitter threads...", status: "pending", icon: <Search className="w-4 h-4" /> },
    { id: 3, text: "Parsing Product Hunt comments...", status: "pending", icon: <Search className="w-4 h-4" /> },
    { id: 4, text: "Aggregating raw data...", status: "pending", icon: <Database className="w-4 h-4" /> },
    { id: 5, text: "Running Sentiment Analysis...", status: "pending", icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 6, text: "Categorizing insights...", status: "pending", icon: <BrainCircuit className="w-4 h-4" /> },
  ]);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        return;
      }

      setSteps(prev => prev.map((step, idx) => {
        if (idx === currentStep) return { ...step, status: "active" };
        if (idx < currentStep) return { ...step, status: "completed" };
        return step;
      }));
      
      currentStep++;
    }, 800); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto">
      <div className="w-full bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Gathering Intelligence</h2>
          <p className="text-slate-400 text-sm mt-2">Please wait while we simulate scraping and analyzing the web...</p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className={`flex items-center gap-3 transition-opacity duration-300 ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                  step.status === 'active' ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-700 text-slate-500'}
              `}>
                {step.status === 'completed' ? <Check className="w-3 h-3" /> : step.icon}
              </div>
              <span className={`text-sm ${step.status === 'active' ? 'text-blue-400 font-medium' : 'text-slate-300'}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrapingSimulation;
