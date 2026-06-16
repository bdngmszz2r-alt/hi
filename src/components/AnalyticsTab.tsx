import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Users, Eye, Play, Award, Calculator, Clock, Check } from 'lucide-react';

const subscriberHistoryData = [
  { month: 'Jan', subscribers: 110000, views: 240000 },
  { month: 'Feb', subscribers: 124000, views: 310000 },
  { month: 'Mar', subscribers: 139000, views: 360000 },
  { month: 'Apr', subscribers: 152000, views: 420000 },
  { month: 'May', subscribers: 168000, views: 490000 },
  { month: 'Jun', subscribers: 184500, views: 610000 },
];

const videoPerformanceData = [
  { seq: 'Vid 1', retention: 56, ctr: 8.9 },
  { seq: 'Vid 2', retention: 41, ctr: 7.2 },
  { seq: 'Vid 3', retention: 62, ctr: 11.4 },
  { seq: 'Vid 4', retention: 34, ctr: 5.1 },
  { seq: 'Vid 5', retention: 68, ctr: 12.8 },
];

export function AnalyticsTab({ channelStats }: { channelStats: any }) {
  const currentSubs = channelStats?.subscriberCount || 184500;
  const currentViews = channelStats?.viewCount || 24870000;
  
  // Goal calculator state
  const [targetSubs, setTargetSubs] = useState<number>(200000);
  const [dailyGrowth, setDailyGrowth] = useState<number>(550);

  // Watch Time calculator state
  const [calcViews, setCalcViews] = useState<number>(50000);
  const [calcDuration, setCalcDuration] = useState<number>(10); // in minutes
  const [calcRetention, setCalcRetention] = useState<number>(45); // in %

  const daysToGoal = Math.max(0, Math.ceil((targetSubs - currentSubs) / dailyGrowth));

  // Calculated watch hours = Views * (Duration in minutes * retention%) / 60
  const calculatedWatchHours = Math.round(calcViews * (calcDuration * (calcRetention / 100)) / 60);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          📈 YouTube Creator Metrics &amp; Projections
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Track verified historical growth trajectories, model viral content pacing, and calculate critical subscriber milestones.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Subscribers (Pace)</span>
            <Users className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {currentSubs.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <span>+16.5% vs Last Period</span>
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Total Views Analyzed</span>
            <Eye className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {currentViews.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">
            Pacing above benchmark average
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-600/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Core Watch Time (Avg)</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {Math.round(currentViews * 0.08).toLocaleString()}h
          </div>
          <p className="text-[10px] text-purple-300 font-mono">
            Retention peak is 54.2%
          </p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/10 space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-600/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Channel Power Rating</span>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-black text-white font-display text-yellow-400 font-display">
            Level 14 Pro
          </div>
          <p className="text-[10px] text-gray-400 font-mono">
            Creator tier active
          </p>
        </div>

      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscriber History Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-red-500" />
            Subscriber Growth Velocity
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subscriberHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area type="monotone" dataKey="subscribers" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSubs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Individual Video Performance stats */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Play className="h-4.5 w-4.5 text-purple-400 animate-pulse" />
            Recent Upload Retention vs CTR ratios
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={videoPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="seq" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="retention" fill="#a855f7" name="Retention (%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ctr" fill="#ef4444" name="CTR (%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Projection Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Milestone Goal Calculator */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="h-4.5 w-4.5 text-yellow-500" />
            Milestone Acquisition Goal Calculator
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Target subscribers milestone</label>
              <input 
                type="number"
                value={targetSubs}
                onChange={e => setTargetSubs(parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Predicted daily acquisition</label>
              <input 
                type="number"
                value={dailyGrowth}
                onChange={e => setDailyGrowth(parseInt(e.target.value) || 1)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          <div className="p-4 bg-[#ef4444]/5 border border-red-500/10 rounded-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-gray-400 text-xs block">Estimated days remaining:</span>
              <strong className="text-xl font-bold text-white font-display">{daysToGoal} days</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-xs block">Estimated complete date:</span>
              <strong className="text-sm font-bold text-red-400 font-mono">
                {new Date(Date.now() + daysToGoal * 24 * 3600 * 1000).toDateString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Watch Time calculator */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-purple-400" />
            Watch Hours Optimizer Predictor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Target Views</label>
              <input 
                type="number"
                value={calcViews}
                onChange={e => setCalcViews(parseInt(e.target.value) || 0)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Avg duration (Min)</label>
              <input 
                type="number"
                value={calcDuration}
                onChange={e => setCalcDuration(parseInt(e.target.value) || 1)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Avg Retention %</label>
              <input 
                type="number"
                value={calcRetention}
                onChange={e => setCalcRetention(parseInt(e.target.value) || 1)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>

          <div className="p-4 bg-[#a855f7]/5 border border-purple-500/10 rounded-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-gray-400 text-xs block">Estimated watch hours payoff:</span>
              <strong className="text-lg font-black text-white font-display">+{calcViews.toLocaleString()} views</strong>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-xs block">Watch Hours gained:</span>
              <strong className="text-lg font-black text-purple-400 font-display">~{calculatedWatchHours.toLocaleString()} Hrs</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
