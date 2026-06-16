import { useState, useEffect, FormEvent } from 'react';
import { generateDynamicResponses } from '../data/mockData';
import { Sparkles, Copy, Check, Tags, FileText, RefreshCw, Send, HelpCircle } from 'lucide-react';

interface SeoGeneratorTabProps {
  onSelectIdea: (title: string, tab: 'script-gen' | 'viral-score') => void;
  globalTopic: string;
  setGlobalTopic: (val: string) => void;
}

export function SeoGeneratorTab({ onSelectIdea, globalTopic, setGlobalTopic }: SeoGeneratorTabProps) {
  const [topicInput, setTopicInput] = useState(globalTopic || '');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [seoResult, setSeoResult] = useState<{
    titles: string[];
    description: string;
    tags: string[];
  } | null>(null);

  // Copy success keys tracking to animate icons
  const [copiedKey, setCopiedKey] = useState<string>('');

  useEffect(() => {
    if (globalTopic) {
      setTopicInput(globalTopic);
      // Automatically generate if topic triggers
      triggerGeneration(globalTopic);
    }
  }, [globalTopic]);

  const triggerGeneration = (term: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateDynamicResponses(term);
      setSeoResult({
        titles: generated.titles,
        description: generated.description,
        tags: generated.tags
      });
      setIsGenerating(false);
    }, 1000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setGlobalTopic(topicInput);
    triggerGeneration(topicInput);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro info */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          🏷️ Title &amp; Description SEO Generator
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Convert basic keywords into YouTube search-friendly titles and search-indexed video Descriptions packed with engagement loops, and tags.
        </p>
      </div>

      {/* Input section */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold">
          Step 1: Enter your video concept or core summary topic
        </label>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. Master React in 10 minutes"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all"
          />

          <button 
            type="submit"
            disabled={isGenerating || !topicInput.trim()}
            className="glow-button bg-gradient-red-purple text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="h-4.5 w-4.5 text-white animate-spin" />
            ) : (
              <Sparkles className="h-4.5 w-4.5 text-yellow-300" />
            )}
            {isGenerating ? 'Optimizing Keywords...' : 'Optimize SEO Assets'}
          </button>
        </form>
      </div>

      {/* Generation loaders */}
      {isGenerating && (
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border border-white/5 animate-pulse space-y-4">
            <div className="h-5 bg-white/5 rounded w-1/4"></div>
            <div className="h-10 bg-white/5 rounded w-full"></div>
            <div className="h-10 bg-white/5 rounded w-5/6"></div>
          </div>
          <div className="glass-card rounded-xl p-6 border border-white/5 animate-pulse space-y-4">
            <div className="h-5 bg-white/5 rounded w-1/3"></div>
            <div className="h-32 bg-white/5 rounded w-full"></div>
          </div>
        </div>
      )}

      {/* Results details */}
      {!isGenerating && seoResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Titles and Descriptions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SEO Optimized Titles Box */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-500" />
                Ranked High-Click Titles
              </h3>

              <div className="space-y-3">
                {seoResult.titles.map((title, idx) => {
                  const itemKey = `title-${idx}`;
                  const isCopied = copiedKey === itemKey;
                  return (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-black/30 border border-white/5 hover:border-white/15 transition-all flex items-start justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded">
                            CTR Boost Opt #{idx + 1}
                          </span>
                          <span className="text-[10px] text-gray-500">Suggested under 60 chars</span>
                        </div>
                        <p className="text-sm font-semibold text-white tracking-tight">{title}</p>
                      </div>

                      {/* Title Actions */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopyText(title, itemKey)}
                          className={`p-2 rounded-lg transition-colors ${
                            isCopied ? 'bg-emerald-950 text-emerald-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                          title="Copy title"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => onSelectIdea(title, 'script-gen')}
                          className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
                          title="Send to Script generator"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Structured Video Description Box */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  SEO Structured Description
                </h3>
                <button
                  onClick={() => handleCopyText(seoResult.description, 'description')}
                  className={`text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all ${
                    copiedKey === 'description' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {copiedKey === 'description' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Description
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative">
                <pre className="text-xs text-gray-300 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto font-normal">
                  {seoResult.description}
                </pre>
              </div>
            </div>

          </div>

          {/* Column 3: Hashtags and workflow integration guides */}
          <div className="space-y-6">
            
            {/* Hashtag Section Box */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
                <Tags className="h-4 w-4 text-emerald-400" />
                Viral Tags &amp; Hashtags
              </h3>

              <p className="text-xs text-gray-400">
                Click on any hashtag to copy it immediately, or copy the entire consolidated list!
              </p>

              {/* Click tags */}
              <div className="flex flex-wrap gap-2">
                {seoResult.tags.map((tag, idx) => {
                  const tagKey = `tag-${idx}`;
                  const isCopied = copiedKey === tagKey;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCopyText(tag, tagKey)}
                      className={`text-xs py-1.5 px-2.5 rounded-lg border flex items-center gap-1 transition-all ${
                        isCopied 
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                          : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span>{tag}</span>
                      {isCopied && <Check className="h-3 w-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Copy entire tag list */}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => handleCopyText(seoResult.tags.join(', '), 'all-tags')}
                  className={`w-full text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    copiedKey === 'all-tags'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40'
                      : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20'
                  }`}
                >
                  {copiedKey === 'all-tags' ? (
                    <>
                      <Check className="h-4 w-4" />
                      All Tags Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Tags for Upload Tag Field
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Creator Academy Tips */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
              <h4 className="text-xs uppercase font-bold text-gray-400">SEO Score Optimizer Tips</h4>
              
              <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
                <li>Write main keywords in the <span className="text-white">first 150 characters</span> of your description for index crawlers.</li>
                <li>Add timestamps to boost Google Search video index embeddings.</li>
                <li>Write tags indicating common user search mistypings for additional reach coverage.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* Guide prompt */}
      {!isGenerating && !seoResult && (
        <div className="rounded-xl border border-white/5 p-5 bg-white/5 flex gap-4 items-start">
          <HelpCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs uppercase font-bold text-gray-300 font-display">Optimization Workflow Instructions</h4>
            <p className="text-xs text-gray-400">
              Input or select a video title above. The system will leverage pre-indexed optimization dictionaries to generate highly structured metadata, ready for copy-pasting directly into your YouTube Creator Studio backend.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
