import { useState } from 'react';
import { TrendingUp, Flame, Globe, Hash, ArrowUpRight, HelpCircle, Copy, Check, MessageSquare } from 'lucide-react';

const trendNiches = [
  { id: "tr1", topic: "AI Voice Agents (Custom Retort)", velocity: "+340% (Extreme)", saturation: "Low", category: "Technology" },
  { id: "tr2", topic: "30-Day Zero Sugar Calisthenics Challenge", velocity: "+180% (Rising)", saturation: "Medium", category: "Health & Fitness" },
  { id: "tr3", topic: "PostgreSQL Database Sharding Tactics", velocity: "+110% (Steady)", saturation: "Low", category: "Coding & Dev" },
  { id: "tr4", topic: "Living on $1.50 a Day Food Challenge", velocity: "+225% (Viral)", saturation: "High", category: "Entertainment" },
  { id: "tr5", topic: "Smart Contracts Auditing Secrets", velocity: "+95% (Steady)", saturation: "Low", category: "Finance & Crypto" }
];

const trendingHashtags = [
  "#AIcoding", "#calisthenics30", "#databasesharding", "#softwareengineer", "#creatorsecrets", "#retentionFormula", "#algorithmHack", "#growthHurdles"
];

export function TrendingTab() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedTag, setCopiedTag] = useState('');

  const filterNiches = activeCategory === 'All' 
    ? trendNiches 
    : trendNiches.filter(n => n.category === activeCategory);

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(''), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          🔥 Viral Topics &amp; Saturated Trends Loader
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Query current viral search curves. Discover fresh breakthrough niches, rising topics, and seasonal video concepts before they saturate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Category filtering + Niches */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex flex-wrap gap-2">
              {['All', 'Technology', 'Health & Fitness', 'Coding & Dev', 'Finance & Crypto'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    activeCategory === cat 
                      ? 'bg-red-600 text-white border-red-500' 
                      : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Globe className="h-4.5 w-4.5 text-gray-500 animate-pulse hidden sm:block" />
          </div>

          <div className="space-y-3">
            {filterNiches.map((nch, idx) => (
              <div 
                key={nch.id}
                className="glass-card rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-red-500/25 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold bg-purple-950/40 text-purple-300 border border-purple-900/30 px-1.5 py-0.5 rounded">
                      Trend #{idx + 1}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{nch.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{nch.topic}</h3>
                </div>

                <div className="flex items-center gap-6 text-xs text-right">
                  <div className="space-y-0.5">
                    <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-bold">Velocity Curve</span>
                    <strong className="text-red-400 font-mono">{nch.velocity}</strong>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-bold">Saturation</span>
                    <strong className={`font-mono ${nch.saturation === 'Low' ? 'text-emerald-400' : 'text-yellow-400'}`}>{nch.saturation}</strong>
                  </div>

                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Popular Hashtags & Tips */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-purple-400" />
              Live Viral Hashtags
            </h3>

            <p className="text-xs text-gray-400">
              Copy trending hashtags to paste directly into your YouTube description line. This anchors indexing.
            </p>

            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map(tag => {
                const isCopied = copiedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => copyTag(tag)}
                    className={`text-xs py-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                      isCopied 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 font-semibold' 
                        : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <span>{tag}</span>
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 text-gray-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-yellow-500" />
              Trend Identification Tips
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
              <li>Upload within 48 hours of a sudden search velocity spike to ride the algorithm curve.</li>
              <li>Always merge a high-velocity trend topic with your core niche framework to retain your loyal base.</li>
              <li>Incorporate trending tags inside the first three lines of your description to raise category association.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
