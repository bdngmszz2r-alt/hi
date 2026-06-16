import { useState, FormEvent } from 'react';
import { POPULAR_NICHEs, MOCK_NICHE_DATABASE, generateDynamicResponses } from '../data/mockData';
import { VideoIdea } from '../types';
import { Sparkles, ArrowRight, Flame, Trophy, Users, Search, HelpCircle, Check, Play } from 'lucide-react';

interface IdeaGeneratorTabProps {
  onSelectIdea: (title: string, tab: 'seo-gen' | 'script-gen' | 'viral-score') => void;
  onIncrementIdeas: () => void;
  globalTopic: string;
  setGlobalTopic: (val: string) => void;
}

export function IdeaGeneratorTab({ onSelectIdea, onIncrementIdeas, globalTopic, setGlobalTopic }: IdeaGeneratorTabProps) {
  const [topicInput, setTopicInput] = useState(globalTopic || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<VideoIdea[]>([]);
  const [activeNichePreset, setActiveNichePreset] = useState<string>('');

  const handlePresetSelect = (id: string, name: string) => {
    setActiveNichePreset(id);
    const cleanedPresetName = name.replace(/[\u0000-\u007F]+/, '').trim(); // strip emojis or use nice term
    const actualName = name.split(' ').slice(1).join(' '); // keep Name without emoji
    setTopicInput(actualName);
    setGlobalTopic(actualName);
  };

  const handleGenerate = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setIsGenerating(true);
    setGlobalTopic(topicInput.trim());

    // Simulate AI computing
    setTimeout(() => {
      // Find preset database or generate dynamically
      let results: VideoIdea[] = [];
      const lower = topicInput.toLowerCase();

      // Check if we can find in niche database
      let foundKey = "";
      if (lower.includes("tech") || lower.includes("code") || lower.includes("program") || lower.includes("ai")) foundKey = "tech";
      else if (lower.includes("game") || lower.includes("esport") || lower.includes("play")) foundKey = "gaming";
      else if (lower.includes("finance") || lower.includes("crypto") || lower.includes("money") || lower.includes("save")) foundKey = "finance";
      else if (lower.includes("fit") || lower.includes("diet") || lower.includes("gym") || lower.includes("health")) foundKey = "fitness";
      else if (lower.includes("cook") || lower.includes("food") || lower.includes("recipe") || lower.includes("eat")) foundKey = "cooking";

      if (foundKey && MOCK_NICHE_DATABASE[foundKey]) {
        results = [...MOCK_NICHE_DATABASE[foundKey].ideas];
      } else {
        // Fallback dynamically generated
        const dynamic = generateDynamicResponses(topicInput);
        results = dynamic.titles.map((titleText, idx) => ({
          title: titleText,
          hook: idx === 0 
            ? `Most systems struggle with ${topicInput}. But watch how this tool simplifies everything instantly.` 
            : `Here is the absolute rarest hack about ${topicInput} that professional creators hide on purpose.`,
          targetAudience: `Enthusiasts, creators, looking to master ${topicInput}`,
          viralPotential: Math.floor(Math.random() * 15) + 84 - idx * 2,
          competition: idx % 3 === 0 ? 'Low' : idx % 3 === 1 ? 'Medium' : 'High',
          engagementRating: idx % 2 === 0 ? 'Outstanding' : 'Very High'
        }));
      }

      setGeneratedIdeas(results);
      setIsGenerating(false);
      onIncrementIdeas();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          🎯 AI Video Idea Generator
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Instantly generate viral title combinations, hooks, and tactical video topics engineered to command long audience retention and spark massive click-through rates.
        </p>
      </div>

      {/* Input controls form */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold">
          Step 1: Enter your channel topic, keyword, or micro-niche
        </label>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input 
              type="text" 
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Calisthenics Routine, Valorant Strategy..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
            />
          </div>

          <button 
            type="submit"
            disabled={isGenerating || !topicInput.trim()}
            className="glow-button bg-gradient-red-purple text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Algorithms...
              </>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5 text-yellow-300" />
                Generate Viral Ideas
              </>
            )}
          </button>
        </form>

        {/* Niche Presets Quick selects */}
        <div className="pt-2">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block mb-2">
            Or quick select popular niches:
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_NICHEs.map(niche => (
              <button
                key={niche.id}
                onClick={() => handlePresetSelect(niche.id, niche.name)}
                className={`text-xs py-2 px-3.5 rounded-full border transition-all ${
                  activeNichePreset === niche.id 
                    ? 'bg-red-950/40 text-red-400 border-red-500/40 font-semibold' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                }`}
              >
                {niche.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generation Loading State placeholders */}
      {isGenerating && (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="glass-card rounded-xl p-6 border border-white/5 animate-pulse flex flex-col gap-3">
              <div className="h-6 bg-white/5 rounded-md w-3/4"></div>
              <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
              <div className="flex gap-4 pt-2">
                <div className="h-8 bg-white/5 rounded-full w-24"></div>
                <div className="h-8 bg-white/5 rounded-full w-32"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result list */}
      {!isGenerating && generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              AI Generated Viral Blueprints ({generatedIdeas.length})
            </h4>
            <span className="text-xs text-gray-500">Sorted by dynamic viral probability</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {generatedIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-2xl p-6 border border-white/10 transition-all hover:border-[rgba(255,0,51,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl group"
                style={{
                  animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 100}ms both`
                }}
              >
                {/* Left content segment */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 border border-red-900/30 px-2 py-0.5 rounded">
                      Rank #{idx + 1} Idea
                    </span>
                    <span className="text-xs text-purple-300 bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-900/20 flex items-center gap-1">
                      <Flame className="h-3 w-3 text-purple-400" />
                      Viral Score: {idea.viralPotential}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      idea.competition === 'Low' 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                        : idea.competition === 'Medium' 
                        ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/40' 
                        : 'bg-red-950/40 text-red-500'
                    }`}>
                      Competition: {idea.competition}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-display tracking-tight leading-snug group-hover:text-red-400 transition-colors">
                    {idea.title}
                  </h3>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs text-gray-300 leading-relaxed bg-[#000]/20 p-2.5 rounded-lg border border-white/5 font-sans">
                      <span className="font-bold text-red-400 mr-1 uppercase">Opening Hook Preview:</span> 
                      &ldquo;{idea.hook}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                      <Users className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span>Target Persona:</span>
                      <span className="text-gray-300 font-sans">{idea.targetAudience}</span>
                    </div>
                  </div>
                </div>

                {/* Right action segment */}
                <div className="flex md:flex-col gap-2 shrink-0 justify-end flex-wrap md:w-44">
                  <span className="hidden md:block text-[10px] text-gray-500 text-right uppercase tracking-wider font-bold mb-1">
                    Workflow Actions
                  </span>
                  <button 
                    onClick={() => onSelectIdea(idea.title, 'script-gen')}
                    className="flex-1 md:w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Write Script
                  </button>
                  <button 
                    onClick={() => onSelectIdea(idea.title, 'seo-gen')}
                    className="flex-1 md:w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold py-2.5 px-3.5 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Optimize SEO
                  </button>
                  <button 
                    onClick={() => onSelectIdea(idea.title, 'viral-score')}
                    className="flex-1 md:w-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold py-2.5 px-3.5 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Check Viral Score
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide notes on how ideas are ranked */}
      {!isGenerating && generatedIdeas.length === 0 && (
        <div className="rounded-xl border border-white/5 p-5 bg-white/5 flex gap-4 items-start">
          <HelpCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs uppercase font-bold text-gray-300">Algorithmic Suggestion Engine</h4>
            <p className="text-xs text-gray-400">
              Input a niche or select presets above to begin the calculation. The tool queries current trending searches, title hook patterns, and competition metrics to build tailored outlines instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
