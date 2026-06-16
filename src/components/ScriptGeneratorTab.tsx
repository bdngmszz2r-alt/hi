import { useState, useEffect, useRef, FormEvent } from 'react';
import { generateDynamicResponses } from '../data/mockData';
import { Sparkles, Copy, Check, Clock, PlayCircle, Minimize2, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface ScriptGeneratorTabProps {
  globalTopic: string;
  setGlobalTopic: (val: string) => void;
}

type ScriptFormat = 'shorts' | 'long';

export function ScriptGeneratorTab({ globalTopic, setGlobalTopic }: ScriptGeneratorTabProps) {
  const [topicInput, setTopicInput] = useState(globalTopic || '');
  const [activeFormat, setActiveFormat] = useState<ScriptFormat>('shorts');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Script text streams state
  const [visibleText, setVisibleText] = useState({
    shortsHook: '',
    shortsBody: '',
    shortsCta: '',
    longIntro: '',
    longPoint1: '',
    longPoint2: '',
    longPoint3: '',
    longOutro: ''
  });

  const [rawScriptData, setRawScriptData] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string>('');
  
  // Speed parameters for typing
  const [isTypingCompleted, setIsTypingCompleted] = useState(false);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (globalTopic) {
      setTopicInput(globalTopic);
      triggerScriptGeneration(globalTopic);
    }
  }, [globalTopic]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  const triggerScriptGeneration = (topic: string) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setIsGenerating(true);
    setIsTypingCompleted(false);

    // Clear visible text elements
    setVisibleText({
      shortsHook: '',
      shortsBody: '',
      shortsCta: '',
      longIntro: '',
      longPoint1: '',
      longPoint2: '',
      longPoint3: '',
      longOutro: ''
    });

    setTimeout(() => {
      const generated = generateDynamicResponses(topic);
      setRawScriptData(generated.scripts);
      setIsGenerating(false);

      // Start token typing stream
      simulateTypewriter(generated.scripts);
    }, 1200);
  };

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setGlobalTopic(topicInput.trim());
    triggerScriptGeneration(topicInput.trim());
  };

  // Typwriter loop simulating stream of tokens
  const simulateTypewriter = (scriptsObj: any) => {
    let timerQueue: Array<{ key: keyof typeof visibleText; text: string }> = [];

    // Queue depending on active fields
    timerQueue = [
      { key: 'shortsHook', text: scriptsObj.shorts.hook },
      { key: 'shortsBody', text: scriptsObj.shorts.body },
      { key: 'shortsCta', text: scriptsObj.shorts.cta },
      { key: 'longIntro', text: scriptsObj.long.intro },
      { key: 'longPoint1', text: scriptsObj.long.point1 },
      { key: 'longPoint2', text: scriptsObj.long.point2 },
      { key: 'longPoint3', text: scriptsObj.long.point3 },
      { key: 'longOutro', text: scriptsObj.long.outro }
    ];

    let currentItemIdx = 0;
    let charIdx = 0;
    let tempText = '';

    const typeNextChar = () => {
      if (currentItemIdx >= timerQueue.length) {
        setIsTypingCompleted(true);
        return;
      }

      const currentItem = timerQueue[currentItemIdx];
      const targetText = currentItem.text;

      if (charIdx < targetText.length) {
        // Type characters by speed chunks (2-3 characters at once to feel crisp and fast)
        const chunk = targetText.slice(charIdx, charIdx + 4);
        tempText += chunk;
        charIdx += chunk.length;

        setVisibleText(prev => ({
          ...prev,
          [currentItem.key]: tempText
        }));

        // Pacing (short pause on punctuations)
        const lastChar = chunk[chunk.length - 1];
        const delay = lastChar === '.' || lastChar === '!' || lastChar === '?' ? 75 : 12;
        typingTimer.current = setTimeout(typeNextChar, delay);
      } else {
        // Finished current element, move to next item queue
        currentItemIdx++;
        charIdx = 0;
        tempText = '';
        typingTimer.current = setTimeout(typeNextChar, 150);
      }
    };

    typeNextChar();
  };

  const skipTyping = () => {
    if (!rawScriptData) return;
    if (typingTimer.current) clearTimeout(typingTimer.current);

    setVisibleText({
      shortsHook: rawScriptData.shorts.hook,
      shortsBody: rawScriptData.shorts.body,
      shortsCta: rawScriptData.shorts.cta,
      longIntro: rawScriptData.long.intro,
      longPoint1: rawScriptData.long.point1,
      longPoint2: rawScriptData.long.point2,
      longPoint3: rawScriptData.long.point3,
      longOutro: rawScriptData.long.outro
    });
    setIsTypingCompleted(true);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey('');
    }, 2000);
  };

  // Dynamic Word count reading time
  const getReadTime = () => {
    if (!rawScriptData) return '0:00';
    if (activeFormat === 'shorts') {
      const words = (rawScriptData.shorts.hook + rawScriptData.shorts.body + rawScriptData.shorts.cta).split(' ').length;
      return `${Math.ceil((words / 150) * 60)} sec (Vertical Short)`;
    } else {
      const words = (rawScriptData.long.intro + rawScriptData.long.point1 + rawScriptData.long.point2 + rawScriptData.long.point3 + rawScriptData.long.outro).split(' ').length;
      const totalSec = Math.ceil((words / 140) * 60);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      return `${min}:${sec < 10 ? '0' : ''}${sec} min (Full Presentation)`;
    }
  };

  // Compile full script as copies
  const getCompiledScriptText = () => {
    if (!rawScriptData) return '';
    if (activeFormat === 'shorts') {
      return `[HOOK - 0:00]\n${rawScriptData.shorts.hook}\n\n[BODY - 0:10]\n${rawScriptData.shorts.body}\n\n[CTA - 0:50]\n${rawScriptData.shorts.cta}`;
    } else {
      return `[INTRO]\n${rawScriptData.long.intro}\n\n[POINT 1: THE BLUEPRINT]\n${rawScriptData.long.point1}\n\n[POINT 2: STRUCTURAL ANALYSIS]\n${rawScriptData.long.point2}\n\n[POINT 3: IMPLEMENTATION METRICS]\n${rawScriptData.long.point3}\n\n[OUTRO / CONCLUSION]\n${rawScriptData.long.outro}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro info */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          🧠 AI Script Generator
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Instantly formulate scripts. Synthesize vertical Shorts hooks, body points, or structured long-form visual descriptions layout.
        </p>
      </div>

      {/* Input topic summary */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold font-sans">
          Enter Your Script Subject or Video Concept
        </label>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. 5 steps to build an app in 10 minutes..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-sans"
          />

          <button 
            type="submit"
            disabled={isGenerating || !topicInput.trim()}
            className="glow-button bg-gradient-red-purple text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="h-4.5 w-4.5 text-white animate-spin" />
            ) : (
              <Sparkles className="h-4.5 w-4.5 text-yellow-300 animate-pulse" />
            )}
            {isGenerating ? 'Structuring Elements...' : 'Generate AI Screenplay'}
          </button>
        </form>
      </div>

      {/* Generating outline placeholders */}
      {isGenerating && (
        <div className="glass-card rounded-xl p-6 border border-white/5 animate-pulse space-y-4">
          <div className="h-6 bg-white/5 rounded-md w-1/4"></div>
          <div className="h-12 bg-white/5 rounded-md w-full"></div>
          <div className="h-24 bg-white/5 rounded-md w-full"></div>
          <div className="h-10 bg-white/5 rounded-md w-1/3"></div>
        </div>
      )}

      {/* Script Workspace */}
      {!isGenerating && rawScriptData && (
        <div className="space-y-6">
          
          {/* Controls toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Toggler formats */}
              <button
                onClick={() => {
                  setActiveFormat('shorts');
                }}
                className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeFormat === 'shorts'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Shorts Format (9:16)
              </button>
              <button
                onClick={() => {
                  setActiveFormat('long');
                }}
                className={`flex-1 sm:flex-initial py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeFormat === 'long'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Monitor className="h-4 w-4" />
                Long Video Format (16:9)
              </button>
            </div>

            {/* Read Time indicator */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>Estimated speaking duration:</span>
                <span className="text-white font-bold">{getReadTime()}</span>
              </div>

              {!isTypingCompleted && (
                <button
                  onClick={skipTyping}
                  className="text-xs bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-800/40 py-1.5 px-3 rounded-lg font-bold"
                >
                  Skip Typing
                </button>
              )}

              <button
                onClick={() => handleCopyText(getCompiledScriptText(), 'full-script')}
                className={`text-xs py-1.5 px-3 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  copiedKey === 'full-script'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40'
                    : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                {copiedKey === 'full-script' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Script
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Script Workspace Layout depending on selection */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Display outline (Shorts 9:16 or Long) Represented layout */}
            <div className="lg:col-span-8 space-y-6">
              
              {activeFormat === 'shorts' ? (
                // SHORTS FORMAT FLOW VIEW
                <div className="space-y-4">
                  {/* Hook outline */}
                  <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2 relative">
                    <span className="absolute top-4 right-4 text-[10px] uppercase text-red-500 tracking-wider font-bold">
                      0:00 - 0:08 (Fast Hook)
                    </span>
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Section 1: The Audience Magnet</h4>
                    <p className="text-base font-extrabold text-white leading-relaxed font-display">
                      {visibleText.shortsHook || <span className="text-gray-600">Thinking...</span>}
                      {!isTypingCompleted && <span className="inline-block w-2 h-4 ml-1 bg-red-500 animate-pulse"></span>}
                    </p>
                  </div>

                  {/* Body outline */}
                  <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2 relative">
                    <span className="absolute top-4 right-4 text-[10px] uppercase text-purple-400 tracking-wider font-bold">
                      0:08 - 0:45 (Exploration)
                    </span>
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Section 2: Body Delivery (Fast pacing)</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {visibleText.shortsBody || <span className="text-gray-600">Formatting content...</span>}
                      {!isTypingCompleted && visibleText.shortsHook && !visibleText.shortsBody && (
                        <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse"></span>
                      )}
                    </p>
                  </div>

                  {/* CTA outline */}
                  <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2 relative">
                    <span className="absolute top-4 right-4 text-[10px] uppercase text-emerald-400 tracking-wider font-bold">
                      0:45 - 0:60 (Retention Lock)
                    </span>
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Section 3: Subscription Hook &amp; Loop CTA</h4>
                    <p className="text-sm font-semibold text-emerald-300 leading-relaxed font-mono">
                      {visibleText.shortsCta || <span className="text-gray-600">Drafting CTA...</span>}
                      {!isTypingCompleted && visibleText.shortsBody && !visibleText.shortsCta && (
                        <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                // LONG FORMAT FLOW VIEW
                <div className="space-y-4">
                  {/* Intro segment */}
                  <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Part 1: The Intro &amp; Setting Stakes</h4>
                    <p className="text-base font-extrabold text-white leading-relaxed font-display">
                      {visibleText.longIntro || <span className="text-gray-600">Drafting hook outline...</span>}
                    </p>
                  </div>

                  {/* Body bullet points segments */}
                  <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Part 2: Multi-step Breakdown Outline</h4>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold block mb-1">
                          Key point 1: The Baseline Problem
                        </span>
                        <p className="text-sm text-gray-300">
                          {visibleText.longPoint1 || <span className="text-gray-600">Structuring core argument...</span>}
                        </p>
                      </div>

                      <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold block mb-1">
                          Key Point 2: The Core Optimization Method
                        </span>
                        <p className="text-sm text-gray-300">
                          {visibleText.longPoint2 || <span className="text-gray-600">Composing systematic workflows...</span>}
                        </p>
                      </div>

                      <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block mb-1">
                          Key Point 3: Future Outlook &amp; Metrics
                        </span>
                        <p className="text-sm text-gray-300">
                          {visibleText.longPoint3 || <span className="text-gray-600">Revising final advice guidelines...</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Outro segment */}
                  <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Part 3: Outro, Comment Loop &amp; Community Engagement</h4>
                    <p className="text-sm text-gray-300">
                      {visibleText.longOutro || <span className="text-gray-600">Synthesizing final outro...</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Vertically represented smartphone mock rendering on the right (Short format visualizer) */}
            <div className="lg:col-span-4 h-full flex flex-col justify-start">
              <div className="w-full max-w-[280px] mx-auto rounded-[36px] bg-[#121217] p-3 border-[6px] border-gray-800 shadow-2xl relative">
                {/* Speaker top details */}
                <div className="w-24 h-4 bg-gray-800 rounded-full mx-auto mb-3 relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                </div>

                <div className="aspect-[9/16] bg-black rounded-[24px] overflow-hidden p-4 relative flex flex-col justify-between">
                  {/* Floating particles */}
                  <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-transparent to-purple-600/20 z-0 pointer-events-none"></div>

                  {/* Top indicators */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-400">🎥 Creator Studio View</span>
                    <span className="text-[9px] font-bold text-red-500 animate-pulse">● LIVE</span>
                  </div>

                  {/* Icon overlays middle */}
                  <div className="relative z-10 my-auto text-center space-y-2">
                    <PlayCircle className="h-10 w-10 text-red-600 mx-auto animate-pulse" />
                    <span className="text-[9px] text-gray-400 block px-4 leading-normal">
                      Draft preview formatted to match average human reading tempo
                    </span>
                  </div>

                  {/* Title outline below overlay */}
                  <div className="relative z-10 space-y-2 bg-black/70 p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-white font-display line-clamp-2">
                      &ldquo;{topicInput || "Amazing Video Segment"}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="h-4 w-4 bg-purple-600 rounded-full flex items-center justify-center text-[8px] text-white">AI</span>
                      <span className="text-[8px] text-gray-400">Script timing is active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
