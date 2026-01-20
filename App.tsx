import React, { useState } from 'react';
import { AppState, ProductAnalysis } from './types';
import { analyzeProduct } from './services/geminiService';
import ScrapingSimulation from './components/ScrapingSimulation';
import SentimentChart from './components/SentimentChart';
import ReviewFeed from './components/ReviewFeed';
import FeatureMatrix from './components/FeatureMatrix';
import { Search, Zap, Bug, Activity, BarChart3, ArrowRight, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('LANDING');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDesc.trim()) return;
    
    setState('SCRAPING');
    setError(null);

    try {
      // Wait for visual simulation to have some time to play (min 3 seconds), then fetch
      const [result] = await Promise.all([
        analyzeProduct(productName, productDesc),
        new Promise(resolve => setTimeout(resolve, 4800)) // Sync with animation
      ]);
      
      setAnalysis(result);
      setState('DASHBOARD');
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      setState('ERROR');
    }
  };

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full text-center z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/20">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            VoC Analytics
          </h1>
        </div>
        
        <p className="text-lg text-slate-400 mb-12 leading-relaxed">
          Simulate scraping product reviews from <span className="text-orange-500 font-medium">Reddit</span>, <span className="text-sky-400 font-medium">Twitter</span>, and <span className="text-orange-600 font-medium">Product Hunt</span>. 
          Instantly categorize feedback, spot bugs, and prioritize features with AI.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-2xl">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Acme Task Manager"
              required
            />
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-300 mb-2">Product Description</label>
            <textarea
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe what your product does so the AI can simulate relevant user feedback..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
          >
            <Search className="w-5 h-5" />
            Analyze Public Sentiment
          </button>
        </form>
        
        <p className="mt-6 text-xs text-slate-600">
          Powered by Google Gemini 2.5 • Simulates external data sources
        </p>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (!analysis) return null;

    const bugCount = analysis.reviews.filter(r => r.category === 'Bug Report').length;
    const featureCount = analysis.reviews.filter(r => r.category === 'Feature Request').length;
    const totalReviews = analysis.reviews.length;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <header className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="text-blue-500" /> {analysis.productName} Report
              </h1>
              <p className="text-slate-400 text-sm mt-1">Simulated Analysis from Reddit, Twitter, Product Hunt</p>
            </div>
            <button 
              onClick={() => setState('LANDING')}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Analyze Another Product
            </button>
          </header>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs uppercase font-bold mb-2">Total Simulated Reviews</p>
              <p className="text-3xl font-bold text-white">{totalReviews}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs uppercase font-bold mb-2">Sentiment Score</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-emerald-400">
                  {Math.round((analysis.sentimentStats.positive / totalReviews) * 100)}%
                </p>
                <span className="text-sm text-slate-400 mb-1">Positive</span>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs uppercase font-bold mb-2">Critical Bugs</p>
              <div className="flex items-center gap-2">
                <Bug className="text-red-500 w-5 h-5" />
                <p className="text-3xl font-bold text-white">{bugCount}</p>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs uppercase font-bold mb-2">Feature Requests</p>
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-500 w-5 h-5" />
                <p className="text-3xl font-bold text-white">{featureCount}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Charts */}
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
                   <BarChart3 className="w-4 h-4 text-slate-400" /> Sentiment Distribution
                </h3>
                <SentimentChart stats={analysis.sentimentStats} />
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                 <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-slate-400" /> Top Features to Build
                </h3>
                <div className="space-y-3">
                  {analysis.features.slice(0, 4).map(feature => (
                    <div key={feature.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${feature.priority === 'High' ? 'bg-violet-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                          {feature.priority} Priority
                        </span>
                        <span className="text-xs text-slate-500">Impact: {feature.impactScore}/10</span>
                      </div>
                      <p className="text-sm font-medium text-white">{feature.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Matrix */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                 <h3 className="text-slate-100 font-semibold mb-4">Prioritization Matrix</h3>
                 <p className="text-sm text-slate-400 mb-4">Visualizing features by <span className="text-slate-200">Effort</span> (X) vs <span className="text-slate-200">Impact</span> (Y).</p>
                 <FeatureMatrix features={analysis.features} />
               </div>

               <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-100 font-semibold">Live Review Feed</h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Real-time Simulation</span>
                </div>
                <ReviewFeed reviews={analysis.reviews} />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {state === 'LANDING' && renderLanding()}
      {state === 'SCRAPING' && <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><ScrapingSimulation /></div>}
      {state === 'DASHBOARD' && renderDashboard()}
      {state === 'ERROR' && (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md">
             <h2 className="text-2xl font-bold text-red-500 mb-2">Generation Error</h2>
             <p className="text-slate-300 mb-6">{error}</p>
             <button onClick={() => setState('LANDING')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors">
               Try Again
             </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;