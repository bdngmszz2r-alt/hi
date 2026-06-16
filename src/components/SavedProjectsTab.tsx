import { useState, useEffect } from 'react';
import { Folder, Sparkles, Tags, FileText, Trash2, Copy, Check, Info, HelpCircle } from 'lucide-react';
import { getSavedIdeas, getSavedScripts, getSavedSEOReports, deleteIdea, deleteScript, deleteSEOReport } from '../lib/firebaseStore';

const sampleIdeas = [
  { id: "id1", title: "I Tried Calisthenics for 30 Days (And Grew 5Lbs of Muscle)", hook: "Most workout splits are designed to keep you gym-buying. But here is the raw reality of gravity formulas...", targetAudience: "Fitness beginners", viralPotential: 92, competition: "Medium" }
];

const sampleScripts = [
  { id: "scr1", title: "Master React in 2026: Roadmap Guidelines", content: "HOST: Stop struggling with Redux or legacy prop-drilling! In exactly 3 minutes, witness how standard Context and state vectors simplify React apps forever..." }
];

const sampleSeo = [
  { id: "seo1", query: "artificial intelligence startup manual", titles: ["How I Broke the AI Algorithm", "5 Secrets of Artificial Intelligence Startups"], tags: ["ai startup", "artificial intelligence blueprint", "tech entrepreneurship"], seoScore: 94 }
];

export function SavedProjectsTab({ userId }: { userId?: string }) {
  const [ideas, setIdeas] = useState<any[]>(sampleIdeas);
  const [scripts, setScripts] = useState<any[]>(sampleScripts);
  const [seoReports, setSeoReports] = useState<any[]>(sampleSeo);

  const [copiedKey, setCopiedKey] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'ideas' | 'scripts' | 'seo'>('ideas');

  useEffect(() => {
    if (userId) {
      loadCreatorAssetStorage();
    }
  }, [userId]);

  const loadCreatorAssetStorage = async () => {
    try {
      const dbIdeas = await getSavedIdeas(userId!);
      if (dbIdeas && dbIdeas.length > 0) setIdeas(dbIdeas);

      const dbScripts = await getSavedScripts(userId!);
      if (dbScripts && dbScripts.length > 0) setScripts(dbScripts);

      const dbSEO = await getSavedSEOReports(userId!);
      if (dbSEO && dbSEO.length > 0) setSeoReports(dbSEO);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAsset = async (id: string, type: 'ideas' | 'scripts' | 'seo') => {
    try {
      if (type === 'ideas') {
        if (userId) await deleteIdea(userId, id);
        setIdeas(prev => prev.filter(i => i.id !== id));
      } else if (type === 'scripts') {
        if (userId) await deleteScript(userId, id);
        setScripts(prev => prev.filter(s => s.id !== id));
      } else {
        if (userId) await deleteSEOReport(userId, id);
        setSeoReports(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          📁 Saved Projects &amp; Creator Space
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Review, copy, or purge your library of saved drafts, visual script outlines, and high-CTR keyword reports.
        </p>
      </div>

      {/* Sub-navigation bar switcher */}
      <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5 text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('ideas')}
            className={`py-1.5 px-4 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ideas' 
                ? 'bg-red-650 text-white shadow' 
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Ideas ({ideas.length})
          </button>

          <button
            onClick={() => setActiveSubTab('scripts')}
            className={`py-1.5 px-4 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'scripts' 
                ? 'bg-red-650 text-white shadow' 
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            Scripts ({scripts.length})
          </button>

          <button
            onClick={() => setActiveSubTab('seo')}
            className={`py-1.5 px-4 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'seo' 
                ? 'bg-red-650 text-white shadow' 
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Tags className="h-4 w-4" />
            SEO Logs ({seoReports.length})
          </button>
        </div>

        <Folder className="h-4.5 w-4.5 text-gray-500 animate-pulse hidden sm:block" />
      </div>

      {/* List content dynamic frame */}
      <div className="space-y-4">
        
        {activeSubTab === 'ideas' && (
          <div className="space-y-3">
            {ideas.map((idObject, idx) => (
              <div 
                key={idObject.id || idx}
                className="glass-card rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/20">
                      Score: {idObject.viralPotential || 85}%
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Competition: {idObject.competition || 'Medium'}</span>
                  </div>
                  <h3 className="text-base font-black text-white hover:text-red-400 transition-colors">{idObject.title}</h3>
                  {idObject.hook && <p className="text-xs text-gray-400 bg-black/30 p-2.5 rounded-lg font-sans"><strong>Opening:</strong> &ldquo;{idObject.hook}&rdquo;</p>}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                  <button 
                    onClick={() => copyText(idObject.title, `idea-${idx}`)}
                    className={`p-2.5 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      copiedKey === `idea-${idx}` 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                        : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {copiedKey === `idea-${idx}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy idea</span>
                  </button>

                  <button 
                    onClick={() => handleDeleteAsset(idObject.id, 'ideas')}
                    className="p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/15 hover:text-red-400 text-gray-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {ideas.length === 0 && (
              <div className="rounded-xl border border-white/5 p-10 text-center space-y-2">
                <HelpCircle className="h-8 w-8 text-red-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-300">No saved ideas found.</h4>
                <p className="text-xs text-gray-400">Save viral title suggestions within the Video Idea Generator tab.</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'scripts' && (
          <div className="space-y-3">
            {scripts.map((scr, idx) => (
              <div 
                key={scr.id || idx}
                className="glass-card rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <span className="text-[9px] font-mono font-bold bg-purple-950/40 text-purple-300 px-1.5 py-0.5 rounded border border-purple-900/20">
                    Segmented Screenplay
                  </span>
                  <h3 className="text-base font-black text-white hover:text-purple-400 transition-colors">{scr.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 font-sans pt-1 leading-relaxed">{scr.content}</p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                  <button 
                    onClick={() => copyText(scr.content, `scr-${idx}`)}
                    className={`p-2.5 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      copiedKey === `scr-${idx}` 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                        : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {copiedKey === `scr-${idx}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy script</span>
                  </button>

                  <button 
                    onClick={() => handleDeleteAsset(scr.id, 'scripts')}
                    className="p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/15 hover:text-red-400 text-gray-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {scripts.length === 0 && (
              <div className="rounded-xl border border-white/5 p-10 text-center space-y-2">
                <HelpCircle className="h-8 w-8 text-red-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-300">No saved scripts found.</h4>
                <p className="text-xs text-gray-400">Save created scripts inside the AI Script Generator workspace.</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'seo' && (
          <div className="space-y-3">
            {seoReports.map((o, idx) => (
              <div 
                key={o.id || idx}
                className="glass-card rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold bg-emerald-950/40 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-900/20">
                      SEO Index Score: {o.seoScore}%
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Query: "{o.query}"</span>
                  </div>
                  <h3 className="text-base font-black text-white hover:text-emerald-400 transition-colors">
                    {o.titles && o.titles[0] ? o.titles[0] : 'Optimized title'}
                  </h3>
                  {o.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {o.tags.map((t: string) => (
                        <span key={t} className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                  <button 
                    onClick={() => copyText((o.titles ? o.titles.join('\n') : o.query), `seo-${idx}`)}
                    className={`p-2.5 text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                      copiedKey === `seo-${idx}` 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                        : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {copiedKey === `seo-${idx}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy titles</span>
                  </button>

                  <button 
                    onClick={() => handleDeleteAsset(o.id, 'seo')}
                    className="p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/15 hover:text-red-400 text-gray-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}

            {seoReports.length === 0 && (
              <div className="rounded-xl border border-white/5 p-10 text-center space-y-2">
                <HelpCircle className="h-8 w-8 text-red-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-300">No optimized reports found.</h4>
                <p className="text-xs text-gray-400">Save optimized title &amp; hashtag metrics in the SEO Generator workspace.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
