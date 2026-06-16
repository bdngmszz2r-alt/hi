import { useState, useEffect, FormEvent } from 'react';
import { generateDynamicResponses } from '../data/mockData';
import { HelpCircle, Sparkles, TrendingUp, ShieldAlert, Award, Radio, AlertCircle } from 'lucide-react';

interface ViralScoreTabProps {
  globalTopic: string;
  setGlobalTopic: (val: string) => void;
}

export function ViralScoreTab({ globalTopic, setGlobalTopic }: ViralScoreTabProps) {
  const [titleInput, setTitleInput] = useState(globalTopic || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [analysisResult, setAnalysisResult] = useState<{
    viralScore: number;
    competition: 'Low' | 'Medium' | 'High';
    engagementRating: 'Outstanding' | 'Very High' | 'High' | 'Steady';
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    if (globalTopic) {
      setTitleInput(globalTopic);
      triggerAnalysis(globalTopic);
    }
  }, [globalTopic]);

  const triggerAnalysis = (titleText: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const generated = generateDynamicResponses(titleText);
      
      // Formulate detailed customized recommendations depending on title characteristics
      const recommendations: string[] = [];
      const len = titleText.length;

      if (len > 60) {
        recommendations.push("Simplify length. Titles over 60 characters get cut off on mobile recommendation feeds. Aim for 45-55.");
      } else {
        recommendations.push("Perfect title length! Under 60 characters fits beautifully on mobile cards.");
      }

      const lower = titleText.toLowerCase();
      const hasNumber = /\d+/.test(titleText);
      const hasBrackets = /\[.*?\]|\(.*?\)/.test(titleText);
      const hasCuriosity = lower.includes("secret") || lower.includes("hidden") || lower.includes("impossible") || lower.includes("warn") || lower.includes("hack") || lower.includes("stop") || lower.includes("why");

      if (!hasNumber) {
        recommendations.push("Leverage numbers. Video titles containing a numerical baseline (e.g. '10 Habits' or 'Learn in 5 Days') carry 20% higher CTR.");
      }
      if (!hasBrackets) {
        recommendations.push("Leverage brackets! Case studies show packing (Real Guide) or [With Proof] boosts engagement by 14.8%.");
      }
      if (!hasCuriosity) {
        recommendations.push("Inject curiosity! Try incorporating power words like 'Secret', 'Mistake', 'Shocked', or 'Stop' to tease viewers' interest.");
      } else {
        recommendations.push("Excellent curiosity framing detected. Your title contains power vectors that drive natural action clicks.");
      }

      setAnalysisResult({
        viralScore: generated.viralScore,
        competition: generated.competition,
        engagementRating: generated.engagementRating,
        recommendations
      });
      setIsAnalyzing(false);
    }, 1100);
  };

  const handleAnalyze = (e: FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    setGlobalTopic(titleInput.trim());
    triggerAnalysis(titleInput.trim());
  };

  // SVG circular properties for radial gauge
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const currentScore = analysisResult?.viralScore || 0;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Intro details */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          📊 Title &amp; Concept Viral Score Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Review metrics beforehand. Run predicted metrics testing against title ideas, measuring predicted click-through curves, competitor saturated keywords, and readability grades.
        </p>
      </div>

      {/* Input title area */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold font-sans">
          Paste title or core concept to diagnose:
        </label>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="e.g. 5 Secret keyboard tricks that save you 100 hours of coding..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-sans"
          />

          <button 
            type="submit"
            disabled={isAnalyzing || !titleInput.trim()}
            className="glow-button bg-gradient-red-purple text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Evaluating Index Vectors...
              </>
            ) : (
              <>
                <TrendingUp className="h-4.5 w-4.5 text-yellow-300" />
                Analyze Score Projections
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analyzing state template */}
      {isAnalyzing && (
        <div className="glass-card rounded-2xl p-6 border border-white/5 animate-pulse flex flex-col items-center justify-center h-56 space-y-4">
          <Radio className="h-10 w-10 text-red-500 animate-ping" />
          <p className="text-xs text-gray-400 font-mono">Running competitive simulation algorithms...</p>
        </div>
      )}

      {/* Results dashboard block */}
      {!isAnalyzing && analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Circular Animated Meter */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group">
            {/* Glowing background behind ring */}
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-red-600/5 blur-3xl pointer-events-none rounded-full"></div>
            
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              Predicted Virality index
            </h3>

            {/* Circular Gauge */}
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="absolute transform -rotate-90" width="120" height="120" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth={strokeWidth}
                />
                {/* Colored Dynamic Value Arc */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="url(#viralGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />

                <defs>
                  <linearGradient id="viralGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8A2BE2" />
                    <stop offset="50%" stopColor="#FF0033" />
                    <stop offset="100%" stopColor="#FFDE00" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central text read percentage */}
              <div className="text-center">
                <span className="text-4xl font-extrabold text-white font-display">
                  {currentScore}
                </span>
                <span className="text-xs text-gray-400 block font-bold mt-[-4px]">/100</span>
              </div>
            </div>

            {/* Classification ranking status */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">
                Grade A- Viral Probability
              </span>
              <p className="text-[11px] text-gray-400 pt-1 leading-normal max-w-[200px]">
                Concept matches high retention markers seen in top 5% channels in the same niche.
              </p>
            </div>
          </div>

          {/* Core competitive stats panel */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              Saturated Competitive Analytics
            </h3>

            {/* Progress Bars benchmarks */}
            <div className="space-y-4">
              {/* Competition levels */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>Keyword Saturation</span>
                  <span className={`font-mono font-bold ${
                    analysisResult.competition === 'Low' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {analysisResult.competition}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-red-500 transition-all duration-1000"
                    style={{ width: analysisResult.competition === 'Low' ? '30%' : analysisResult.competition === 'Medium' ? '65%' : '90%' }}
                  ></div>
                </div>
              </div>

              {/* Predicted engagement level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>Predicted Click-Through Rate (CTR)</span>
                  <span className="font-mono text-purple-400 font-bold">8.4% - 11.2%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-[#FF0033] transition-all duration-1000"
                    style={{ width: '82%' }}
                  ></div>
                </div>
              </div>

              {/* Average session match retention */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>Audience Watch-time Retention</span>
                  <span className="font-mono text-emerald-400 font-bold">{analysisResult.engagementRating}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
                    style={{ width: '76%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick action checklist marker */}
            <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 items-center text-xs text-gray-400">
              <ShieldAlert className="h-4 w-4 text-yellow-400 shrink-0" />
              <span>Higher competition means thumbnail layout contrast is extremely critical.</span>
            </div>
          </div>

          {/* AI Critical Recommendation Checklist */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3 md:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Optimization Recommendations
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {analysisResult.recommendations.map((recText, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-300 p-2.5 bg-black/30 rounded-xl border border-white/5">
                  <AlertCircle className={`h-4.5 w-4.5 shrink-0 ${
                    recText.includes("Leverage") || recText.includes("Inject") ? 'text-yellow-400' : 'text-emerald-400'
                  }`} />
                  <p className="leading-normal">{recText}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Guide note when empty state holds */}
      {!isAnalyzing && !analysisResult && (
        <div className="rounded-xl border border-white/5 p-5 bg-white/5 flex gap-4 items-start animate-fade-in">
          <HelpCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs uppercase font-bold text-gray-300">How Does Virality Analytics Work?</h4>
            <p className="text-xs text-gray-400">
              Paste your planned YouTube title keyword structure above. The scoring algorithms score your sentence for high-frequency search keywords, title character bounds, visual emotional markers, and cognitive click motivators.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
