import { TabType } from '../types';
import { 
  Tv, 
  Sparkles, 
  Tags, 
  FileText, 
  TrendingUp, 
  Menu, 
  X, 
  Youtube,
  Award,
  Image,
  BarChart2,
  Calendar,
  Flame,
  Bot,
  FolderOpen,
  User
} from 'lucide-react';

interface SidebarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export function Sidebar({ currentTab, onChangeTab, isOpenMobile, setIsOpenMobile }: SidebarProps) {
  
  const coreSuiteItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard Home', icon: Tv, desc: 'Channel metrics' },
    { id: 'idea-gen' as TabType, label: 'Video Idea Generator', icon: Sparkles, desc: 'Viral title concepts' },
    { id: 'seo-gen' as TabType, label: 'SEO Generator', icon: Tags, desc: 'Metadata copy box' },
    { id: 'script-gen' as TabType, label: 'AI Script Generator', icon: FileText, desc: 'Shorts & Long screens' },
  ];

  const auditingItems = [
    { id: 'viral-score' as TabType, label: 'Viral Analyzer', icon: TrendingUp, desc: 'CTR & Quality meter' },
    { id: 'thumbnail-analyzer' as TabType, label: 'Thumbnail CTR', icon: Image, desc: 'Balance & contrast' },
  ];

  const streamItems = [
    { id: 'analytics' as TabType, label: 'Advanced Analytics', icon: BarChart2, desc: 'Metric curves & pace' },
    { id: 'content-planner' as TabType, label: 'Release Planner', icon: Calendar, desc: 'Events checklists' },
    { id: 'trending' as TabType, label: 'Niches & Trends', icon: Flame, desc: 'High-velocity topics' },
    { id: 'ai-coach' as TabType, label: 'Growth AI Coach', icon: Bot, desc: '24/7 Strategic assistant' },
  ];

  const spaceItems = [
    { id: 'saved-projects' as TabType, label: 'Saved Space', icon: FolderOpen, desc: 'Asset repositories' },
    { id: 'profile' as TabType, label: 'Profile Settings', icon: User, desc: 'Channel configuration' },
    { id: 'subscriptions' as TabType, label: 'Pricing Licenses', icon: Award, desc: 'Licensing & upgrades' },
  ];

  const handleMenuClick = (tabId: TabType) => {
    onChangeTab(tabId);
    setIsOpenMobile(false);
  };

  const renderNavGroup = (title: string, items: typeof coreSuiteItems) => (
    <div className="space-y-1.5">
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-550 block px-3.5 mt-4 mb-2">
        {title}
      </span>
      <div className="space-y-1">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all group relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-red-650/10 via-purple-650/5 to-transparent border-l-4 border-red-500 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-red-500/5 blur-md pointer-events-none"></div>
              )}

              <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform ${
                isActive ? 'text-red-500 scale-110' : 'text-gray-500 group-hover:text-red-400 group-hover:scale-105'
              }`} />

              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold font-display block truncate">{item.label}</span>
                <span className="text-[9px] text-gray-550 font-mono italic block truncate leading-none mt-0.5">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 overflow-y-auto max-h-screen">
      
      <div className="space-y-3">
        {/* Logo Segment */}
        <div className="flex items-center gap-3 px-3.5 py-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-red-purple flex items-center justify-center shadow-lg shadow-red-500/25">
            <Youtube className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <span className="text-xs font-black tracking-wider text-white font-display block leading-none">
              YOUTUBE GROW
            </span>
            <span className="text-[9px] font-mono text-red-500 font-bold block uppercase mt-1 tracking-wider leading-none">
              AI PRO v4.1
            </span>
          </div>
        </div>

        {/* Navigation grouped streams */}
        <nav className="space-y-1.5 pb-6">
          {renderNavGroup('Core AI Suite', coreSuiteItems)}
          {renderNavGroup('Auditing & Quality', auditingItems)}
          {renderNavGroup('Stream Operations', streamItems)}
          {renderNavGroup('Creator Workspace', spaceItems)}
        </nav>
      </div>

      {/* Footer stats module */}
      <div className="space-y-3 pt-4 border-t border-white/5 mt-auto">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-950/20 to-purple-950/20 border border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-yellow-400 uppercase">
            <Award className="h-3.5 w-3.5" />
            <span>AI Growth Catalyst</span>
          </div>
          <p className="text-[10px] text-gray-405 mt-1 leading-snug">
            All tools sync directly to Firebase Cloud storage. Secure environment.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-655">
          <span>Secure Sandboxed Casing</span>
          <span className="text-red-500 animate-pulse">● Active</span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Permanent on left */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 bg-[#0c0c0f] border-r border-[#ffffff08] shadow-2xl z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Slide-out overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
          <aside className="w-64 h-full bg-[#0c0c0f] border-r border-white/10 shadow-2xl relative animate-slide-right">
            {/* Close Mobile button */}
            <button 
              onClick={() => setIsOpenMobile(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
