import { useState, useEffect } from 'react';
import { TabType } from './types';
import { Sidebar } from './components/Sidebar';
import { DashboardTab } from './components/DashboardTab';
import { IdeaGeneratorTab } from './components/IdeaGeneratorTab';
import { SeoGeneratorTab } from './components/SeoGeneratorTab';
import { ScriptGeneratorTab } from './components/ScriptGeneratorTab';
import { ViralScoreTab } from './components/ViralScoreTab';
import { SubscriptionsTab } from './components/SubscriptionsTab';
import { ThumbnailAnalyzerTab } from './components/ThumbnailAnalyzerTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ContentPlannerTab } from './components/ContentPlannerTab';
import { TrendingTab } from './components/TrendingTab';
import { AiCoachTab } from './components/AiCoachTab';
import { SavedProjectsTab } from './components/SavedProjectsTab';
import { ProfileTab } from './components/ProfileTab';
import { AuthScreen } from './components/AuthScreen';
import { 
  Menu, 
  Bell, 
  HelpCircle, 
  Sparkles, 
  Info, 
  Tv, 
  Maximize2 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  googleSignInRedirect,
  logout, 
  fetchYouTubeChannelStats, 
  fetchYouTubeRecentVideos, 
  YouTubeChannelStats, 
  YouTubeVideo 
} from './lib/youtubeAuth';
import { getUserSettings, saveUserSettings } from './lib/firebaseStore';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [globalTopic, setGlobalTopic] = useState<string>('');
  const [ideasGeneratedCount, setIdeasGeneratedCount] = useState<number>(142);
  const [currentTier, setCurrentTier] = useState<string>('Creator Pro Level');
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to YouTube Growth AI Tool v4.1!",
    "Viral pattern matrices updated for June 2026.",
    "Pro AI generation cycles restored."
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Auth Initialization state
  const [isInitializingAuth, setIsInitializingAuth] = useState<boolean>(true);

  // YouTube OAuth states
  const [ytUser, setYtUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [channelStats, setChannelStats] = useState<YouTubeChannelStats | null>(null);
  const [recentVideos, setRecentVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingYT, setIsLoadingYT] = useState<boolean>(false);
  const [ytError, setYtError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setYtUser(user);
        setAccessToken(token);
        try {
          if (token) {
            await loadYouTubeData(token);
          } else {
            // Load persistent real user-input stats or initialize with zero
            await loadCustomUserStats(user);
          }
        } catch (e) {
          console.error("Error loading user credentials:", e);
        } finally {
          setIsInitializingAuth(false);
        }
      },
      () => {
        setYtUser(null);
        setAccessToken(null);
        setChannelStats(null);
        setRecentVideos([]);
        setIsInitializingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadCustomUserStats = async (user: User) => {
    setIsLoadingYT(true);
    setYtError(null);
    try {
      const savedSettings = await getUserSettings(user.uid);
      if (savedSettings && savedSettings.channelTitle !== undefined) {
        setChannelStats({
          title: savedSettings.channelTitle,
          customUrl: savedSettings.handle || `@${(user.displayName || user.email?.split('@')[0] || 'creator').toLowerCase().replace(/\s+/g, '')}`,
          thumbnail: savedSettings.thumbnail || user.photoURL || '',
          subscriberCount: Number(savedSettings.subscriberCount ?? 0),
          viewCount: Number(savedSettings.viewCount ?? 0),
          videoCount: Number(savedSettings.videoCount ?? 0),
        });
      } else {
        const initialTitle = user.displayName || user.email?.split('@')[0] || 'My Channel';
        const initialHandle = `@${initialTitle.toLowerCase().replace(/\s+/g, '')}`;
        const initialStats = {
          title: initialTitle,
          customUrl: initialHandle,
          thumbnail: user.photoURL || '',
          subscriberCount: 0,
          viewCount: 0,
          videoCount: 0,
        };
        setChannelStats(initialStats);
        
        await saveUserSettings(user.uid, {
          channelTitle: initialTitle,
          handle: initialHandle,
          subscriberCount: 0,
          viewCount: 0,
          videoCount: 0,
          darkMode: true,
          notificationsActive: true,
          weeklyTipsActive: true,
          thumbnail: user.photoURL || ''
        });
      }
    } catch (err) {
      console.error("Failed to load user custom stats:", err);
    } finally {
      setIsLoadingYT(false);
    }
  };

  const loadYouTubeData = async (token: string | null) => {
    if (!token) return;
    setIsLoadingYT(true);
    setYtError(null);
    try {
      const stats = await fetchYouTubeChannelStats(token);
      setChannelStats(stats);
      if (stats.uploadsPlaylistId) {
        const vids = await fetchYouTubeRecentVideos(token, stats.uploadsPlaylistId);
        setRecentVideos(vids);
      }
    } catch (err: any) {
      console.error("Failed to load YouTube data", err);
      setYtError(err?.message || "Could not retrieve YouTube channel statistics.");
    } finally {
      setIsLoadingYT(false);
    }
  };

  const handleLogin = async (mode: 'popup' | 'redirect' = 'popup') => {
    setIsLoadingYT(true);
    setYtError(null);
    try {
      if (mode === 'redirect') {
        setNotifications(prev => [
          "Initiating secure Google Redirect authentication...",
          ...prev
        ]);
        await googleSignInRedirect();
        return;
      }
      const result = await googleSignIn();
      if (result) {
        setYtUser(result.user);
        setAccessToken(result.accessToken);
        await loadYouTubeData(result.accessToken);
        setNotifications(prev => [
          "Successfully logged into YouTube! Real-time channel stats active.",
          ...prev
        ]);
      }
    } catch (err: any) {
      console.error("Sign-in captured issue:", err);
      const isIframe = window.self !== window.top;
      let userFriendlyMessage = err.message || "Sign-in failed.";
      if (err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup-closed-by-user')) {
        userFriendlyMessage = isIframe
          ? "The Google login popup was closed. Because of browser iframe security rules inside AI Studio, you must click the 'Use Secure Redirect Session' button or 'Open App in New Tab' to sign in successfully."
          : "The sign-in popup was closed before authentication could complete. Please try clicking 'Connect YouTube Metrics' again, or use the 'Use Secure Redirect Session' option.";
      } else if (err.code === 'auth/popup-blocked' || err.message?.includes('popup-blocked')) {
        userFriendlyMessage = "The login popup was blocked by your browser. Please allow popups or use the secure Google Redirect option.";
      }
      setYtError(userFriendlyMessage);
      setNotifications(prev => [
        `YouTube auth issue: ${err.message || 'Popup was closed.'}`,
        ...prev
      ]);
    } finally {
      setIsLoadingYT(false);
    }
  };

  const handleSimulateLogin = (customName?: string, customSubscribers?: number, customUrl?: string, keepCurrentSession = false, loggedInUserObj?: any) => {
    setIsLoadingYT(true);
    setYtError(null);
    const channelName = customName || loggedInUserObj?.displayName || ytUser?.displayName || "Tech Spark Studio";
    const handleUrl = customUrl || `@${channelName.toLowerCase().replace(/\s+/g, '_')}`;
    const subs = customSubscribers || 184500;

    setTimeout(() => {
      const activeUser = loggedInUserObj || ytUser;
      if (!keepCurrentSession && !activeUser) {
        setYtUser({
          uid: "demo-user-123",
          displayName: channelName,
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          email: "demo.creator@example.com",
        } as any);
      } else if (activeUser) {
        setYtUser({
          ...activeUser,
          photoURL: activeUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        });
      }
      setAccessToken("demo-jwt-token");
      setChannelStats({
        title: channelName + " (Simulated)",
        customUrl: handleUrl,
        thumbnail: activeUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        subscriberCount: subs,
        viewCount: Math.round(subs * 134.8),
        videoCount: 112,
        uploadsPlaylistId: "demo-uploads"
      });
      setRecentVideos([
        {
          id: "vid1",
          title: `How I Grew from 0 to ${subs >= 1000 ? (subs/1000).toFixed(0) + 'k' : subs} Subscribers on YouTube (Full Roadmap)`,
          publishedAt: "2026-06-12T14:00:20Z",
          thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=360&auto=format&fit=crop&q=80",
          views: Math.round(subs * 0.26),
          likes: Math.round(subs * 0.015),
          comments: Math.round(subs * 0.002)
        },
        {
          id: "vid2",
          title: "CRITICAL AI Video Trends You Can't Ignore Anymore!",
          publishedAt: "2026-06-08T09:30:15Z",
          thumbnail: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=360&auto=format&fit=crop&q=80",
          views: Math.round(subs * 0.16),
          likes: Math.round(subs * 0.01),
          comments: Math.round(subs * 0.001)
        },
        {
          id: "vid3",
          title: "Perfecting the 3-Second Hook: Retention Masterclass (Proven Samples)",
          publishedAt: "2026-06-02T16:15:00Z",
          thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=360&auto=format&fit=crop&q=80",
          views: Math.round(subs * 0.51),
          likes: Math.round(subs * 0.036),
          comments: Math.round(subs * 0.002)
        },
        {
          id: "vid4",
          title: "My Daily Workflow Routine as a Tech Creator 7 Days a Week",
          publishedAt: "2026-05-28T11:00:00Z",
          thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=360&auto=format&fit=crop&q=80",
          views: Math.round(subs * 0.08),
          likes: Math.round(subs * 0.005),
          comments: Math.round(subs * 0.0004)
        },
        {
          id: "vid5",
          title: "Title & Thumbnail Masterclass (Stop killing your CTR!)",
          publishedAt: "2026-05-20T15:45:10Z",
          thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=360&auto=format&fit=crop&q=80",
          views: Math.round(subs * 0.68),
          likes: Math.round(subs * 0.048),
          comments: Math.round(subs * 0.004)
        }
      ]);
      setNotifications(prev => [
        `Enabled YouTube Simulator for "${channelName}"! Beautiful custom preview loaded.`,
        ...prev
      ]);
      setIsLoadingYT(false);
    }, 400);
  };

  const handleLogout = async () => {
    setIsLoadingYT(true);
    try {
      await logout();
      setYtUser(null);
      setAccessToken(null);
      setChannelStats(null);
      setRecentVideos([]);
      setNotifications(prev => [
        "Logged out of YouTube channel connection.",
        ...prev
      ]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingYT(false);
    }
  };

  const handleNavigateFromHome = (tab: TabType) => {
    setCurrentTab(tab);
  };

  const handleSelectIdeaFromList = (title: string, tab: 'seo-gen' | 'script-gen' | 'viral-score') => {
    setGlobalTopic(title);
    setCurrentTab(tab);
  };

  const handleIncrementIdeas = () => {
    setIdeasGeneratedCount(prev => prev + 1);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleSetTier = (tier: string) => {
    setCurrentTier(tier);
    setNotifications(prev => [
      `[TIER CHANGE] Creator account upgraded/aligned to: ${tier}`,
      ...prev
    ]);
  };

  if (isInitializingAuth) {
    return (
      <div className="w-full min-h-screen bg-[#050505] text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glowing orb animations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="z-10 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-x-0 w-24 h-24 mx-auto bg-gradient-to-r from-red-600 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse"></div>
            {/* Spinning gradient border ring */}
            <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-red-550 border-r-purple-600 animate-spin flex items-center justify-center mx-auto bg-black/40 relative">
              <span className="text-2xl font-black text-white font-display">YT</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display font-black text-white tracking-wider">
              YouTube <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">Growth Pro</span>
            </h2>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase animate-pulse">
              Verifying Creator Session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!ytUser) {
    return (
      <AuthScreen 
        onAuthSuccess={async (user, token) => {
          setYtUser(user);
          setAccessToken(token);
          if (token) {
            await loadYouTubeData(token);
          } else {
            // Load real custom channel metrics from the user's Firestore profile
            await loadCustomUserStats(user);
          }
        }}
        isLoadingYT={isLoadingYT}
        setIsLoadingYT={setIsLoadingYT}
        setNotifications={setNotifications}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-slate-100 font-sans flex relative overflow-hidden">
      {/* Animated Gradient Blobs from Immersive Theme */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-50px] left-[200px] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none animate-float-delayed"></div>

      {/* Global Sidebar layout element */}
      <Sidebar 
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main viewport segment (offset for desktop sidebar) */}
      <div className="flex-1 min-h-screen flex flex-col lg:pl-72 w-full z-10 overflow-x-hidden">
        
        {/* Universal Top Nav Header */}
        <header className="w-full border-b border-white/5 bg-black/20 backdrop-blur-md px-6 sm:px-8 py-5 flex items-center justify-between sticky top-0 z-30">
          
          {/* Welcome Message container */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu toggle */}
            <button 
              onClick={() => setIsOpenMobile(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                Welcome back, <span className="text-red-500 underline decoration-red-500/30">{channelStats ? channelStats.title : 'Creator'}</span>
              </h1>
              <p className="text-slate-400 text-xs hidden sm:block">
                {channelStats ? `Connected to ${channelStats.customUrl}` : 'Connect your YouTube channel to view live stats.'}
              </p>
            </div>
          </div>

          {/* Quick Actions top-right */}
          <div className="flex items-center gap-3">
            
            {/* Quick stats indicator pill */}
            <button 
              onClick={() => setCurrentTab('subscriptions')}
              className="hidden md:flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/10 hover:border-red-500/40 transition-colors focus:outline-none cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span>{currentTier} Active</span>
            </button>

            {/* Notification alert center popover */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 sm:p-2.5 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:text-white hover:bg-white/10 relative transition-colors"
              >
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                <Bell className="h-4.5 w-4.5" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0c0c11] border border-white/10 p-4 shadow-2xl z-50 animate-fade-in text-xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Notifications</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleClearNotifications}
                        className="text-red-400 hover:text-red-300 text-[10px]"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No active warnings or alerts.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="flex gap-2 items-start py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                          <p className="text-gray-300 leading-normal">{notif}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile circle indicator */}
            <div className="flex items-center gap-2 border border-white/10 bg-white/5 pl-2 pr-3 py-1.5 rounded-full">
              {channelStats ? (
                <>
                  <img 
                    src={channelStats.thumbnail} 
                    alt={channelStats.title} 
                    referrerPolicy="no-referrer"
                    className="w-6 sm:w-7 h-6 sm:h-7 rounded-full border border-white/20 shrink-0 object-cover"
                  />
                  <span className="text-xs font-bold text-gray-300 hidden sm:inline max-w-[120px] truncate">
                    {channelStats.title}
                  </span>
                </>
              ) : ytUser ? (
                <>
                  {ytUser.photoURL ? (
                    <img 
                      src={ytUser.photoURL} 
                      alt={ytUser.displayName || 'Creator'} 
                      referrerPolicy="no-referrer"
                      className="w-6 sm:w-7 h-6 sm:h-7 rounded-full border border-white/20 shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-6 sm:w-7 h-6 sm:h-7 bg-purple-600 border border-white/20 rounded-full flex items-center justify-center font-display text-[10px] font-bold text-white shrink-0 shadow-lg shadow-purple-600/30">
                      {(ytUser.displayName || ytUser.email || 'CR').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-gray-300 hidden sm:inline max-w-[120px] truncate">
                    {ytUser.displayName || ytUser.email?.split('@')[0] || 'Authorized'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-6 sm:w-7 h-6 sm:h-7 bg-red-600 border border-white/20 rounded-full flex items-center justify-center font-display text-xs font-black text-white shrink-0 shadow-lg shadow-red-600/30">
                    CR
                  </div>
                  <span className="text-xs font-bold text-gray-300 hidden sm:inline">Guest Creator</span>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Inner Layout Body based on tab state */}
        <main className="flex-1 w-full px-6 sm:px-8 py-8 md:py-10 max-w-7xl mx-auto scroll-smooth">
          
          {/* Universal notification strip if active topics are locked */}
          {globalTopic && (
            <div className="mb-6 p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 flex items-center justify-between gap-3 text-xs text-purple-300 animate-slide-up">
              <div className="flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                <span>
                  Currently reviewing concept: <strong className="text-white">&ldquo;{globalTopic}&rdquo;</strong>. Switch tabs to construct scripts or SEO tags instantly!
                </span>
              </div>
              <button 
                onClick={() => setGlobalTopic('')}
                className="text-[10px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
              >
                Clear Focus
              </button>
            </div>
          )}

          {/* Render target tab with transition animations */}
          <div className="transition-all duration-300">
            {currentTab === 'dashboard' && (
              <DashboardTab 
                onNavigate={handleNavigateFromHome}
                ideasGeneratedCount={ideasGeneratedCount}
                ytUser={ytUser}
                accessToken={accessToken}
                channelStats={channelStats}
                recentVideos={recentVideos}
                isLoadingYT={isLoadingYT}
                ytError={ytError}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onSimulateLogin={handleSimulateLogin}
              />
            )}

            {currentTab === 'idea-gen' && (
              <IdeaGeneratorTab 
                onSelectIdea={handleSelectIdeaFromList}
                onIncrementIdeas={handleIncrementIdeas}
                globalTopic={globalTopic}
                setGlobalTopic={setGlobalTopic}
              />
            )}

            {currentTab === 'seo-gen' && (
              <SeoGeneratorTab 
                onSelectIdea={handleSelectIdeaFromList}
                globalTopic={globalTopic}
                setGlobalTopic={setGlobalTopic}
              />
            )}

            {currentTab === 'script-gen' && (
              <ScriptGeneratorTab 
                globalTopic={globalTopic}
                setGlobalTopic={setGlobalTopic}
              />
            )}

            {currentTab === 'viral-score' && (
              <ViralScoreTab 
                globalTopic={globalTopic}
                setGlobalTopic={setGlobalTopic}
              />
            )}

            {currentTab === 'thumbnail-analyzer' && (
              <ThumbnailAnalyzerTab />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsTab channelStats={channelStats} />
            )}

            {currentTab === 'content-planner' && (
              <ContentPlannerTab userId={ytUser?.uid} />
            )}

            {currentTab === 'trending' && (
              <TrendingTab />
            )}

            {currentTab === 'ai-coach' && (
              <AiCoachTab />
            )}

            {currentTab === 'saved-projects' && (
              <SavedProjectsTab userId={ytUser?.uid} />
            )}

            {currentTab === 'profile' && (
              <ProfileTab 
                userId={ytUser?.uid} 
                userEmail={ytUser?.email || undefined} 
                channelStats={channelStats}
                onUpdateStats={(newStats) => {
                  setChannelStats(newStats);
                  if (ytUser) {
                    setYtUser({ ...ytUser, displayName: newStats.title, photoURL: newStats.thumbnail } as any);
                  }
                }}
              />
            )}

            {currentTab === 'subscriptions' && (
              <SubscriptionsTab 
                currentTier={currentTier}
                onSetTier={handleSetTier}
              />
            )}
          </div>

        </main>

        {/* Footnotes copyright label block */}
        <footer className="w-full py-6 px-8 border-t border-white/5 text-center text-[11px] text-gray-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>&copy; 2026 YouTube Growth AI Tool. Developed under AI Studio Framework specifications.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-400 transition-colors">API Grounding System</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
