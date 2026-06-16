import { useState, useEffect, FormEvent } from 'react';
import { User, Settings, Bell, Lock, Shield, Check, RefreshCw, Sparkles, Users, Video, BarChart2, Image } from 'lucide-react';
import { saveUserSettings, getUserSettings } from '../lib/firebaseStore';
import { YouTubeChannelStats } from '../lib/youtubeAuth';

export function ProfileTab({ 
  userId, 
  userEmail, 
  channelStats, 
  onUpdateStats 
}: { 
  userId?: string; 
  userEmail?: string; 
  channelStats?: YouTubeChannelStats | null; 
  onUpdateStats?: (newStats: YouTubeChannelStats) => void;
}) {
  const [displayName, setDisplayName] = useState(channelStats?.title || 'My Channel');
  const [channelEmail, setChannelEmail] = useState(userEmail || 'creator@youtube-growth-pro.com');
  const [handle, setHandle] = useState(channelStats?.customUrl || '@mychannel');
  const [subscribers, setSubscribers] = useState<number>(channelStats?.subscriberCount ?? 0);
  const [views, setViews] = useState<number>(channelStats?.viewCount ?? 0);
  const [videos, setVideos] = useState<number>(channelStats?.videoCount ?? 0);
  const [avatarUrl, setAvatarUrl] = useState<string>(channelStats?.thumbnail || '');
  
  // Settings preferences
  const [darkMode, setDarkMode] = useState(true);
  const [notifActive, setNotifActive] = useState(true);
  const [weeklyTips, setWeeklyTips] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (channelStats) {
      setDisplayName(channelStats.title || '');
      setHandle(channelStats.customUrl || '');
      setSubscribers(channelStats.subscriberCount ?? 0);
      setViews(channelStats.viewCount ?? 0);
      setVideos(channelStats.videoCount ?? 0);
      setAvatarUrl(channelStats.thumbnail || '');
    }
  }, [channelStats]);

  useEffect(() => {
    if (userId) {
      loadSettings();
    }
  }, [userId]);

  const loadSettings = async () => {
    try {
      const conf = await getUserSettings(userId!);
      if (conf) {
        setDarkMode(conf.darkMode ?? true);
        setNotifActive(conf.notificationsActive ?? true);
        setWeeklyTips(conf.weeklyTipsActive ?? true);
        
        // Load custom fields to forms if present
        if (conf.channelTitle !== undefined) setDisplayName(conf.channelTitle);
        if (conf.handle !== undefined) setHandle(conf.handle);
        if (conf.subscriberCount !== undefined) setSubscribers(Number(conf.subscriberCount));
        if (conf.viewCount !== undefined) setViews(Number(conf.viewCount));
        if (conf.videoCount !== undefined) setVideos(Number(conf.videoCount));
        if (conf.thumbnail !== undefined) setAvatarUrl(conf.thumbnail);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;
      const updatedStats: YouTubeChannelStats = {
        title: displayName,
        customUrl: formattedHandle,
        thumbnail: avatarUrl,
        subscriberCount: Number(subscribers),
        viewCount: Number(views),
        videoCount: Number(videos),
        uploadsPlaylistId: channelStats?.uploadsPlaylistId,
      };

      if (onUpdateStats) {
        onUpdateStats(updatedStats);
      }

      if (userId) {
        await saveUserSettings(userId, {
          channelTitle: displayName,
          handle: formattedHandle,
          subscriberCount: Number(subscribers),
          viewCount: Number(views),
          videoCount: Number(videos),
          thumbnail: avatarUrl,
          darkMode,
          notificationsActive: notifActive,
          weeklyTipsActive: weeklyTips
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving user channel settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
          ⚙️ User Profile &amp; Channel Preferences
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
          Configure notification thresholds, change channel metadata, and maintain your persistent creator parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card left */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-white/10 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl"></div>

            <div className="relative mx-auto h-24 w-24 rounded-full border-4 border-red-500 overflow-hidden shadow-xl shadow-red-500/10 flex items-center justify-center bg-[#070707]">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-red-650 to-purple-650 flex items-center justify-center font-display text-3xl font-black text-white">
                  {(displayName || 'My').substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-white font-display">{displayName}</h3>
              <p className="text-xs text-red-400 font-mono font-bold">{handle}</p>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-[#ef4444]/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full mt-2 inline-block">
                Creator Level Pro active
              </span>
            </div>

            <div className="border-t border-white/5 pt-4 text-left text-xs space-y-2.5 text-gray-400">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-white text-[11px] truncate max-w-[140px]">{userId || "Guest_123456"}</span>
              </div>
              <div className="flex justify-between">
                <span>Subscribers:</span>
                <span className="text-white font-bold">{subscribers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Video Views:</span>
                <span className="text-white font-bold">{views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Subscription Rank:</span>
                <span className="text-yellow-400 font-bold">Creator Gold Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Forms right */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 border border-[#ffffff0c] space-y-6">
            
            <div className="space-y-4 text-xs">
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
                <Settings className="h-4 w-4 text-red-500" />
                Profile &amp; Channel Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider">Channel Title</label>
                  <input 
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider">Unique Channel Handle</label>
                  <input 
                    type="text"
                    required
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-500" />
                    Subscribers
                  </label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={subscribers}
                    onChange={e => setSubscribers(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <BarChart2 className="h-3 w-3 text-gray-500" />
                    Total Views
                  </label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={views}
                    onChange={e => setViews(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Video className="h-3 w-3 text-gray-500" />
                    Videos Count
                  </label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={videos}
                    onChange={e => setVideos(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Image className="h-3 w-3 text-gray-500" />
                  Custom Profile Picture URL (Optional)
                </label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-... or custom link"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider">Creator Contact Email</label>
                <input 
                  type="email"
                  disabled
                  value={channelEmail}
                  className="w-full bg-black/50 border border-white/5 rounded-xl p-3 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Custom preferences selectors */}
            <div className="space-y-4 text-xs font-sans pt-2">
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
                <Bell className="h-4 w-4 text-purple-400" />
                SaaS Notification Settings
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={notifActive}
                    onChange={e => setNotifActive(e.target.checked)}
                    className="h-4 w-4 accent-red-650 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-gray-200 font-bold block">In-app notifications active</span>
                    <span className="text-[10px] text-gray-500 block leading-normal">Trigger alert center chimes when script generation cycles conclude.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={weeklyTips}
                    onChange={e => setWeeklyTips(e.target.checked)}
                    className="h-4 w-4 accent-red-650 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-gray-200 font-bold block">Weekly Strategic Tips email</span>
                    <span className="text-[10px] text-gray-500 block leading-normal">Receive high-CTR, high-retention checklists curated by Growth Coach Pro each Friday.</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-red-purple text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 text-xs font-sans"
            >
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {isSaving ? 'Updating database settings...' : success ? 'Settings Saved Successfully!' : 'Save Profile Adjustments'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
