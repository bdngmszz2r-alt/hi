import { useState, useRef, useEffect, FormEvent } from 'react';
import { Sparkles, Send, MessageSquare, User, RefreshCw, Award, Target, HelpCircle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const coachPresetQuestions = [
  "Suggest a premium monetization plan for a tech channel",
  "Write an high-retention 3-second hook for a coding tutorial",
  "How do I optimize retention curves for long tutorials?",
  "Analyze current CTR click trends for June 2026"
];

export function AiCoachTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "👋 Salutations, Creator! I am **Growth Coach Pro**, your YouTube development director. Pitch me an idea, ask for monetization pacing, or tell me your current channel hurdles and I will deliver immediate action items. What are we building today?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsSending(true);

    try {
      const payloadHistory = [...messages, userMsg].map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        text: m.text
      }));

      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: payloadHistory })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err: any) {
      console.error(err);
      // Offline fallback
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "My live neural core is experiencing local latency in the sandbox. Here are standard guidelines: Boost caption contrast by 15%, split chapters exactly at retention flatlines, and pitch digital products in the opening 10 seconds!"
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          🤖 AI Creator Assistant Coach
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Engage with a world-class YouTube consultant trained on CTR maps, high-retention screenwriting formulas, and viral monetization programs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Coach Quick Commands Portal */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            
            <div className="flex gap-2 items-center text-xs font-bold text-yellow-400 uppercase tracking-wider font-mono">
              <Award className="h-4 w-4" />
              <span>Premium Coach Commands</span>
            </div>

            <p className="text-xs text-gray-400">
              Select any pre-configured core creator inquiry below to launch instant strategic diagnostics:
            </p>

            <div className="space-y-2">
              {coachPresetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-3 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/25 text-xs text-gray-300 hover:text-white transition-all hover:bg-black/20 flex gap-2"
                >
                  <Target className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </button>
              ))}
            </div>

          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold block">Status Checklist</span>
            <p className="text-xs text-gray-400 leading-normal">
              My core contains direct indexing guidelines for <strong>Education</strong>, <strong>SaaS Tutorial</strong>, <strong>Gaming</strong>, and <strong>Fintech</strong> niches.
            </p>
          </div>
        </div>

        {/* Right Side: Immersive Chat Canvas */}
        <div className="lg:col-span-8 flex flex-col h-[520px] glass-card rounded-2xl border border-white/10 overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-black/30 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bh-red-600 rounded-xl bg-gradient-to-tr from-purple-600 to-red-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Growth Coach Pro</span>
                <span className="text-[9px] text-emerald-400 font-mono block">● Online / Strategy Brain Activated</span>
              </div>
            </div>

            <button 
              onClick={() => setMessages([
                { role: 'model', text: "👋 Workspace restarted. What analytical challenges can we solve for your YouTube channel today?" }
              ])}
              className="text-[10px] font-mono text-gray-500 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5"
            >
              <RefreshCw className="h-3 w-3" />
              Clear Console
            </button>
          </div>

          {/* Messages window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] ${
                  m.role === 'user' 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gradient-to-br from-purple-600 to-red-600 text-white'
                }`}>
                  {m.role === 'user' ? <User className="h-4.5 w-4.5" /> : 'Coach'}
                </div>

                {/* Dialog body */}
                <div className={`rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                  m.role === 'user' 
                    ? 'bg-red-950/20 border border-red-500/10 text-white' 
                    : 'bg-white/5 border border-white/5 text-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center text-white text-[10px]">
                  Coach
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-2 text-xs text-gray-400">
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-500" />
                  <span>Growth Coach is drafting strategy benchmarks...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef}></div>
          </div>

          {/* Form sender text input */}
          <form onSubmit={handleSubmit} className="p-4 bg-black/40 border-t border-white/5 flex gap-2">
            <input 
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask Coach: 'How do I pitch digital planners?' or describe user concerns..."
              className="flex-1 bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500/50"
            />
            <button
              type="submit"
              disabled={isSending || !inputVal.trim()}
              className="px-5 bg-red-600 hover:bg-red-750 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="text-xs font-bold hidden sm:inline">Advise</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
