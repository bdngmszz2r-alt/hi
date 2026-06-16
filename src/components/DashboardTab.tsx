import { useState, useEffect, FormEvent } from 'react';
import { MetricCounter } from './MetricCounter';
import { CreatorChecklistItem } from '../types';
import { 
  Sparkles, 
  Tv, 
  TrendingUp, 
  Flame, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  Award, 
  HelpCircle,
  ThumbsUp,
  Share2,
  Bookmark,
  Eye,
  MessageSquare,
  LogOut,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { User } from 'firebase/auth';
import { YouTubeChannelStats, YouTubeVideo } from '../lib/youtubeAuth';

interface DashboardTabProps {
  onNavigate: (tab: 'dashboard' | 'idea-gen' | 'seo-gen' | 'script-gen' | 'viral-score') => void;
  ideasGeneratedCount: number;
  ytUser: User | null;
  accessToken: string | null;
  channelStats: YouTubeChannelStats | null;
  recentVideos: YouTubeVideo[];
  isLoadingYT: boolean;
  ytError: string | null;
  onLogin: (mode?: 'popup' | 'redirect') => Promise<void>;
  onLogout: () => Promise<void>;
  onSimulateLogin: (customName?: string, customSubscribers?: number, customUrl?: string) => void;
}

export function DashboardTab({ 
  onNavigate, 
  ideasGeneratedCount,
  ytUser,
  accessToken,
  channelStats,
  recentVideos,
  isLoadingYT,
  ytError,
  onLogin,
  onLogout,
  onSimulateLogin
}: DashboardTabProps) {
  // Stats and checklist items
  const [checklist, setChecklist] = useState<CreatorChecklistItem[]>([
    { id: '1', text: 'Film a high-energy hook in the first 7 seconds', completed: true, priority: 'high' },
    { id: '2', text: 'Implement visual text layers for complex concepts', completed: false, priority: 'medium' },
    { id: '3', text: 'Analyze viral scores of generated title concepts', completed: false, priority: 'high' },
    { id: '4', text: 'Design custom high-contrast thumbnails', completed: false, priority: 'low' },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Channel metrics
  const [subscribers, setSubscribers] = useState(142500);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostMessage, setBoostMessage] = useState('');

  // Custom simulation state
  const [simName, setSimName] = useState('Tech Spark Studio');
  const [simSubs, setSimSubs] = useState(184500);
  const [showSimConfig, setShowSimConfig] = useState(false);
  const [connType, setConnType] = useState<'real' | 'sim'>('sim');

  useEffect(() => {
    if (ytUser?.displayName) {
      setSimName(ytUser.displayName);
    } else if (ytUser?.email) {
      setSimName(ytUser.email.split('@')[0]);
    }
  }, [ytUser]);

  useEffect(() => {
    if (channelStats) {
      setSubscribers(channelStats.subscriberCount);
    } else {
      setSubscribers(142500);
    }
  }, [channelStats]);

  // Svg dynamic chart coordinate generator (mapped proportionally to subscribers)
  const activeSeries = isBoosting 
    ? [0.14, 0.25, 0.32, 0.53, 0.77, 1.12, 1.68].map(ratio => Math.round(subscribers * ratio / 1000) || 1)
    : [0.14, 0.20, 0.27, 0.39, 0.51, 0.69, 1.0].map(ratio => Math.round(subscribers * ratio / 1000) || 1);

  // Format array to SVG points sequence
  const svgWidth = 500;
  const svgHeight = 120;
  const points = activeSeries.map((val, idx) => {
    const x = (idx / (activeSeries.length - 1)) * svgWidth;
    // Map val from 0-250 to SVG coordinate space
    const y = svgHeight - (val / 250) * svgHeight - 8;
    return `${x},${y}`;
  }).join(' ');

  const handleAddChecklist = (e: FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem: CreatorChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistText.trim(),
      completed: false,
      priority: newPriority
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistText('');
  };

  const toggleChecklist = (id: string) => {
    setChecklist(
      checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleChannelBoost = () => {
    if (isBoosting) return;
    setIsBoosting(true);
    setBoostMessage("Initiating Premium Viral Boost sequence...");
    
    setTimeout(() => {
      setSubscribers(prev => prev + 12850);
      setBoostMessage("Boom! Gain of +12,850 subscribers simulated live!");
    }, 1500);

    setTimeout(() => {
      setIsBoosting(false);
      setBoostMessage("");
    }, 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Grow Your YouTube Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(255,0,51,0.2)] bg-gradient-to-r from-[rgba(15,15,20,1)] via-[rgba(30,15,40,0.85)] to-[rgba(15,15,20,1)] p-6 sm:p-10 shadow-2xl">
        {/* Abstract glowing backgrounds */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-yt-red opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 w-80 h-80 bg-accent-purple opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-yt-red/30 bg-yt-red/10 px-3 py-1 text-xs font-semibold text-red-400">
              <Sparkles className="h-3 md:h-4 w-3 md:w-4 animate-pulse" />
              <span>Next-Gen YouTube Blueprint Launchpad</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              Grow Your YouTube <br className="hidden sm:inline" />
              <span className="text-gradient-red-purple">Channel With AI</span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-400">
              Unlock the metrics secret. Automate complex descriptions, generate high-retention video outlines, and study competitor metrics with advanced interactive algorithms.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => onNavigate('idea-gen')}
                className="glow-button flex items-center gap-2 rounded-xl bg-gradient-red-purple px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Zap className="h-4 w-4" />
                Generate Ideas Now
              </button>
              <button 
                onClick={() => onNavigate('viral-score')}
                className="flex items-center gap-2 rounded-xl border border-gray-700 bg-white/5 backdrop-blur-md px-5 py-3 text-sm font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <TrendingUp className="h-4 w-4" />
                Analyze Title Score
              </button>
            </div>
          </div>

          {/* YouTube Widget Mockup Card */}
          <div className="w-full max-w-sm glass-card rounded-2xl p-5 border border-white/10 flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block p-1 bg-red-600 rounded-lg text-white font-black text-xs">YT</span>
                <span className="text-sm font-semibold tracking-wide text-gray-300">Channel Monitor</span>
              </div>
              <span className={`h-2 w-2 rounded-full ${channelStats ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`}></span>
            </div>

            {!channelStats ? (
              <div className="space-y-4 py-2">
                {/* Connection Type Tabs */}
                <div className="flex p-0.5 bg-white/5 border border-white/10 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setConnType('real')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                      connType === 'real' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    🚀 Real YouTube
                  </button>
                  <button 
                    type="button"
                    onClick={() => setConnType('sim')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                      connType === 'sim' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    🧪 Simulator
                  </button>
                </div>

                {connType === 'real' ? (
                  <div className="space-y-3 py-1">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-red-500 tracking-wider">Secure Google OAuth</div>
                      <h4 className="text-sm font-bold text-white">Connect Real Channel</h4>
                      <p className="text-xs text-slate-400 leading-relaxed text-left">
                        Securely authenticate using Google Login with read-only access to query and display your active subscriber count, total views, and recent uploads.
                      </p>
                    </div>

                    {ytError && (
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-300 leading-normal text-left">
                        {ytError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <button 
                        type="button"
                        onClick={() => onLogin('popup')}
                        disabled={isLoadingYT}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:translate-y-0 shadow-lg shadow-red-600/10 disabled:opacity-50"
                      >
                        <svg className="h-3.5 w-3.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.619 4.545 1.765l2.45-2.45C17.51 1.83 14.975 1 12.24 1c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.782 0 10-4.068 10-10 0-.68-.08-1.31-.22-1.715H12.24z"/>
                        </svg>
                        {isLoadingYT ? 'Connecting to Google...' : 'Connect via Google Popup'}
                      </button>

                      <button 
                        type="button"
                        onClick={() => onLogin('redirect')}
                        disabled={isLoadingYT}
                        className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:translate-y-0 disabled:opacity-50"
                      >
                        <svg className="h-3.5 w-3.5 text-red-500 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.619 4.545 1.765l2.45-2.45C17.51 1.83 14.975 1 12.24 1c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.782 0 10-4.068 10-10 0-.68-.08-1.31-.22-1.715H12.24z"/>
                        </svg>
                        {isLoadingYT ? 'Connecting to Google...' : 'Use Secure Redirect Session'}
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-gray-500 mt-1 leading-normal">
                      Note: If browser iframe settings block the login popup, please click <strong>&quot;Use Secure Redirect Session&quot;</strong> or <strong>&quot;Open App in New Tab&quot;</strong> to sign in successfully.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 py-1">
                    <div className="space-y-1">
                      <div className="text-xs font-mono uppercase text-red-500 tracking-wider">Simulator Terminal</div>
                      <h4 className="text-sm font-bold text-white">Simulated Channel Monitor</h4>
                      <p className="text-xs text-gray-400 leading-relaxed text-left">
                        Set your channel properties below to launch simulated metrics tracking and preview your personalized YouTube Analytics.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="border border-white/5 bg-white/5 p-3 rounded-xl space-y-2.5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-gray-400 font-bold">SANDBOX SIMULATOR OPTIONS</span>
                          <button 
                            type="button"
                            onClick={() => setShowSimConfig(!showSimConfig)}
                            className="text-[10px] underline text-red-400 hover:text-red-300 transition-colors"
                          >
                            {showSimConfig ? 'Hide Config' : 'Customize Channel Info'}
                          </button>
                        </div>

                        {showSimConfig ? (
                          <div className="space-y-2 text-left animate-fade-in">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-mono mb-1">
                                Simulated Channel Name
                              </label>
                              <input 
                                type="text" 
                                value={simName}
                                onChange={(e) => setSimName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                                placeholder="e.g. Preeti Joshi Tech"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-mono mb-1">
                                  Subscriber Count
                                </label>
                                <input 
                                  type="number" 
                                  value={simSubs || ''}
                                  onChange={(e) => setSimSubs(Number(e.target.value))}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                                  placeholder="e.g. 184500"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-mono mb-1">
                                  Handle
                                </label>
                                <input 
                                  type="text" 
                                  value={simName ? `@${simName.toLowerCase().replace(/\s+/g, '_')}` : ''}
                                  disabled
                                  className="w-full bg-black/20 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-gray-500 focus:outline-none cursor-not-allowed font-mono"
                                />
                              </div>
                            </div>

                            <button 
                              type="button"
                              onClick={() => onSimulateLogin(simName, simSubs)}
                              disabled={isLoadingYT}
                              className="w-full mt-1 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Sparkles className="h-3 w-3" />
                              {isLoadingYT ? 'Launching...' : 'Launch Simulation'}
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => onSimulateLogin(simName, simSubs)}
                            disabled={isLoadingYT}
                            className="w-full py-2.5 px-3 bg-red-950/20 text-red-400 hover:bg-red-500/20 border border-red-500/10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                            {isLoadingYT ? 'Launching...' : `Quick Simulated Load (${simName})`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                  <img 
                    src={channelStats.thumbnail} 
                    alt={channelStats.title} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-red-500/30 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{channelStats.title}</div>
                    <div className="text-[10px] text-red-500 font-mono font-medium">{channelStats.customUrl}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Total Subscribers</div>
                  <div className="text-3xl font-black text-white font-display">
                    {subscribers.toLocaleString()}
                    <span className="text-xs text-emerald-400 font-medium ml-2">▲ Live Sync</span>
                  </div>
                </div>

                {/* Quick Micro-progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400 animate-pulse">
                    <span>Active uploads count:</span>
                    <span>{channelStats.videoCount} videos</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="w-full py-2 px-3 bg-red-950/20 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border-dashed"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Disconnect YouTube Channel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-red-600/10 p-3 rounded-bl-2xl">
            <TrendingUp className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <MetricCounter 
            value={subscribers} 
            prefix="" 
            suffix="" 
            label="Total Subscribers" 
          />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded">
              {channelStats ? 'Live Active' : '+14,640 new days'}
            </span>
            <span className="text-xs text-gray-500">vs. previous period</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-purple-600/10 p-3 rounded-bl-2xl">
            <Sparkles className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <MetricCounter 
            value={channelStats ? channelStats.videoCount : (ideasGeneratedCount || 342)} 
            prefix="" 
            suffix="" 
            label={channelStats ? "Live Uploaded Videos" : "AI Video Ideas Brainstormed"} 
          />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded">
              {channelStats ? 'Real Channel' : 'Ready'}
            </span>
            <span className="text-xs text-gray-500">{channelStats ? 'Total metrics pulled live' : 'Interactive workspace assets'}</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-[#34A853]/10 p-3 rounded-bl-2xl">
            <Award className="h-6 w-6 text-[#34A853] group-hover:scale-110 transition-transform" />
          </div>
          <MetricCounter 
            value={channelStats ? channelStats.viewCount : 94.8} 
            prefix="" 
            suffix={channelStats ? "" : "%"} 
            label={channelStats ? "Total Channel Views" : "Average SEO Success Rating"} 
          />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded">
              {channelStats ? 'Live Statistics' : 'Grade A Master Rank'}
            </span>
            <span className="text-xs text-gray-500">{channelStats ? 'Aggregated viewer count' : 'Advanced algorithmic analysis'}</span>
          </div>
        </div>
      </div>

      {/* SVG Trajectory Chart & Daily Checklist panel (Bento style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SVG subscriber slope chart */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Subscribers Velocity Slope</h3>
              <p className="text-xs text-gray-400">Comparing manual workflows vs AI tool enhancements</p>
            </div>
            <span className="text-xs bg-red-950/30 text-red-400 border border-red-500/25 px-2 py-1 rounded">
              {isBoosting ? 'AI Dynamic Peak' : 'Active Growth'}
            </span>
          </div>

          <div className="h-40 w-full relative flex items-end">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF0033" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2={svgWidth} y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2={svgWidth} y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Area under the line */}
              <path
                d={`M 0,${svgHeight} L ${points} L ${svgWidth},${svgHeight} Z`}
                fill="url(#chartGradient)"
                className="transition-all duration-1000 ease-in-out"
              />

              {/* Main Line */}
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3.5"
                points={points}
                className="transition-all duration-1000 ease-in-out"
              />

              {/* Gradient on the line itself */}
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF0055" />
                <stop offset="50%" stopColor="#FF3300" />
                <stop offset="100%" stopColor="#8A2BE2" />
              </linearGradient>

              {/* Interactive Points circles */}
              {activeSeries.map((val, idx) => {
                const x = (idx / (activeSeries.length - 1)) * svgWidth;
                const y = svgHeight - (val / 250) * svgHeight - 8;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={idx === activeSeries.length - 1 ? 6 : 4}
                    fill={idx === activeSeries.length - 1 ? '#FF0033' : '#8A2BE2'}
                    stroke="white"
                    strokeWidth="1.5"
                    className="hover:scale-150 transition-transform cursor-pointer"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-gray-500 pt-2 border-t border-white/5">
            <span>Day 1 (Base)</span>
            <span>Day 10 (Idea Test)</span>
            <span>Day 20 (SEO Applied)</span>
            <span>Current (Viral Output)</span>
          </div>
        </div>

        {/* Creator Checklist panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display">Creator Tasks Checklist</h3>
              <p className="text-xs text-gray-400">Optimize workflows on your absolute path to viral success</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/40 text-purple-400">
              {checklist.filter(item => item.completed).length}/{checklist.length} Done
            </span>
          </div>

          {/* List Box */}
          <div className="flex-1 space-y-2 max-h-48 overflow-y-auto mb-4 pr-1 scrollbar-thin">
            {checklist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-gray-500">Perfect! No tasks remain on your desk.</p>
              </div>
            ) : (
              checklist.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    item.completed 
                      ? 'bg-white/5 border-white/5 opacity-50' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleChecklist(item.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <CheckCircle2 className={`h-5 w-5 ${item.completed ? 'text-emerald-400 fill-emerald-900/30' : 'text-gray-600'}`} />
                    </button>
                    <span className={`text-xs text-gray-200 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      item.priority === 'high' 
                        ? 'bg-red-950/40 text-red-400 border border-red-900/40' 
                        : item.priority === 'medium' 
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.priority}
                    </span>
                    <button 
                      onClick={() => deleteChecklistItem(item.id)}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Form */}
          <form onSubmit={handleAddChecklist} className="flex flex-col sm:flex-row gap-2 mt-auto">
            <input 
              type="text" 
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="e.g. Find 3 background songs"
              className="flex-1 bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-red-500/40"
            />
            
            <div className="flex gap-2">
              <select 
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-lg text-xs py-2 px-1 text-gray-300 focus:outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Live YouTube Recent Uploads Feed */}
      {channelStats && (
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Tv className="text-red-500 h-5 w-5" />
                Live Video Performance Insights
              </h3>
              <p className="text-xs text-gray-400">Direct real-time metrics for your last 5 uploads</p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Channel Feed Stable
            </div>
          </div>

          {recentVideos.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-500">No uploads found or playlist is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {recentVideos.map((video) => (
                <div 
                  key={video.id}
                  className="rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video w-full relative overflow-hidden bg-black flex items-center justify-center">
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Tv className="h-8 w-8 text-white/20" />
                    )}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-gray-300 font-semibold">
                      Upload
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-200 line-clamp-2 leading-snug group-hover:text-white transition-colors" title={video.title}>
                        {video.title}
                      </h4>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {new Date(video.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 pt-2.5 border-t border-white/5 text-[11px] font-mono text-gray-400">
                      <div className="flex flex-col items-center py-1 rounded bg-black/20" title="Views">
                        <Eye className="h-3 w-3 text-red-500 mb-0.5" />
                        <span className="font-bold text-white text-[10px] mt-0.5 truncate max-w-full">
                          {video.views >= 1000 ? `${(video.views/1000).toFixed(1)}k` : video.views}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center py-1 rounded bg-black/20" title="Likes">
                        <ThumbsUp className="h-3 w-3 text-teal-400 mb-0.5" />
                        <span className="font-bold text-white text-[10px] mt-0.5 truncate max-w-full">
                          {video.likes >= 1000 ? `${(video.likes/1000).toFixed(1)}k` : video.likes}
                        </span>
                      </div>

                      <div className="flex flex-col items-center py-1 rounded bg-black/20" title="Comments">
                        <MessageSquare className="h-3 w-3 text-purple-400 mb-0.5" />
                        <span className="font-bold text-white text-[10px] mt-0.5 truncate max-w-full">
                          {video.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick guide tips banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Tv className="text-red-500 h-5 w-5" />
          Best Growth Strategies Recommended by AI
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <Flame className="h-4 w-4" />
              <span>Retention Priming</span>
            </div>
            <p className="text-xs text-gray-400">
              Cut out breathing pauses in the editing room. Start speaking instantly instead of saying &quot;welcome back to my channel&quot;. Give user 100% immediate value context.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-400">
              <Zap className="h-4 w-4" />
              <span>Double-Click CTR</span>
            </div>
            <p className="text-xs text-gray-400">
              Let the title build up tension that the picture completes. Do not write the exact title on the thumbnail; use short secondary punchlines on your graphics instead.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <Award className="h-4 w-4" />
              <span>Niche Anchoring</span>
            </div>
            <p className="text-xs text-gray-400">
              Stick to single macro topics for consecutive outputs. If writing about Coding metrics, follow up with structural code framework guides before changing to General Finance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
