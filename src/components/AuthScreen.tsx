import { useState, FormEvent, Dispatch, SetStateAction } from 'react';
import { 
  emailSignIn, 
  emailSignUp, 
  googleSignIn, 
  googleSignInRedirect 
} from '../lib/youtubeAuth';
import { Mail, Lock, Sparkles, LogIn, UserPlus, Youtube, AlertCircle, RefreshCw } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: (user: any, token: string | null) => void;
  isLoadingYT: boolean;
  setIsLoadingYT: (loading: boolean) => void;
  setNotifications: Dispatch<SetStateAction<string[]>>;
}

export function AuthScreen({ 
  onAuthSuccess, 
  isLoadingYT, 
  setIsLoadingYT, 
  setNotifications 
}: AuthScreenProps) {
  const [activeTab, setActiveTab ] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);

    if (!email || !password) {
      setError('Please fill in all email and password parameters.');
      setLocalLoading(false);
      return;
    }

    if (activeTab === 'signup' && !displayName) {
      setError('Please provide your initial Creator/Channel name.');
      setLocalLoading(false);
      return;
    }

    try {
      if (activeTab === 'signin') {
        const user = await emailSignIn(email, password);
        setNotifications(prev => [
          `Logged into secure Workspace successfully! Welcome back, ${user.displayName || user.email}.`,
          ...prev
        ]);
        onAuthSuccess(user, null);
      } else {
        const user = await emailSignUp(email, password, displayName);
        setNotifications(prev => [
          `Creator space initialized! Private database created for ${email}.`,
          ...prev
        ]);
        onAuthSuccess(user, null);
      }
    } catch (err: any) {
      console.error('Email authentication error:', err);
      let friendlyError = err.message || 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        friendlyError = `Email/Password authentication provider is not enabled in Firebase yet!
        
👉 To enable it instantly:
1. Go to your Firebase Console (for project study-tool-b87bd).
2. Navigate to Authentication > Sign-in method.
3. Click "Add new provider" (or select "Email/Password").
4. Toggle "Enable" and press Save.
5. Then click "Generate Creator Workspace" or "Connect Private Workspace" again!`;
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email account is already registered! Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        friendlyError = 'Invalid email or password combination. If you do not have an account, please switch to the "Create Account" tab first to sign up!';
      }
      setError(friendlyError);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleSocial = async () => {
    setError(null);
    setIsLoadingYT(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setNotifications(prev => [
          `Authenticated cleanly via Google Workspace OAuth for ${result.user.displayName || result.user.email}!`,
          ...prev
        ]);
        onAuthSuccess(result.user, result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Popup sign in failed:', err);
      const isIframe = window.self !== window.top;
      let friendlyError = err.message || 'Google pop-up login failed.';
      
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        friendlyError = `Firebase Authorized Domain Error: This app's domain is not authorized in your Firebase project (study-tool-b87bd) for Google Authentication. 
        
👉 To fix this:
1. Go to Firebase Console > Authentication > Settings.
2. Select "Authorized domains" on the left menu.
3. Click "Add domain" and add these two domains:
   • ais-dev-e3xwvzaupnfv2zwz3evazb-917204625753.asia-east1.run.app
   • ais-pre-e3xwvzaupnfv2zwz3evazb-917204625753.asia-east1.run.app
   
💡 Alternatively, you can use standard "Creator Sign In" or "Create Account" using your email and password above to log in instantly!`;
      } else if (err.code === 'auth/popup-closed-by-user' || err.message?.includes('popup-closed-by-user')) {
        friendlyError = isIframe
          ? "Popup block: Because of browser iframe security rules inside AI Studio, you must use the secure redirect button below."
          : "Popup was closed before authentication could finish.";
      }
      setError(friendlyError);
    } finally {
      setIsLoadingYT(false);
    }
  };

  const handleGoogleRedirect = async () => {
    setError(null);
    setIsLoadingYT(true);
    try {
      await googleSignInRedirect();
    } catch (err: any) {
      let friendlyError = err.message || 'Redirect initialization failed.';
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        friendlyError = `Firebase Authorized Domain Error: This domain must be authorized in your Firebase project (study-tool-b87bd).
        
👉 Please add these domains in Firebase Console under Authentication > Settings > Authorized Domains:
   • ais-dev-e3xwvzaupnfv2zwz3evazb-917204625753.asia-east1.run.app
   • ais-pre-e3xwvzaupnfv2zwz3evazb-917204625753.asia-east1.run.app
   
💡 Alternatively, create a secure account instantly with your email and password above!`;
      }
      setError(friendlyError);
      setIsLoadingYT(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050507] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Immersive ambient decoration blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Logo & Headline */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-red-600 to-purple-600 shadow-xl shadow-red-650/10 border border-white/10 shrink-0">
            <Youtube className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              YOUTUBE <span className="text-red-500">GROWTH PRO</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Securely authenticate your Creator Space. Connect your real channel or experiment inside our fully features sandbox simulator.
            </p>
          </div>
        </div>

        {/* Dynamic Card */}
        <div className="glass-card bg-[#0b0c11]/80 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'signin' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Creator Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(null); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'signup' 
                  ? 'bg-[#121217] text-white shadow-md border border-white/10' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-2xl text-xs text-red-300 flex gap-2.5 items-start mb-5 animate-fade-in text-left">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-normal">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'signup' && (
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Initial Channel / Creator Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black/45 border border-white/10 rounded-2xl p-3.5 pl-10 text-xs text-white focus:outline-none focus:border-red-500/50"
                    placeholder="e.g. Preeti Joshi Tech"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/45 border border-white/10 rounded-2xl p-3.5 pl-10 text-xs text-white focus:outline-none focus:border-red-500/50"
                  placeholder="name@creator.com"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/45 border border-white/10 rounded-2xl p-3.5 pl-10 text-xs text-white focus:outline-none focus:border-red-500/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={localLoading || isLoadingYT}
              className="w-full py-3.5 bg-gradient-to-r from-red-650 to-red-500 hover:from-red-550 hover:to-red-400 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-600/10 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {localLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : activeTab === 'signin' ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Connect Private Workspace
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Generate Creator Workspace
                </>
              )}
            </button>
          </form>

          {/* Social connection divider */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              Or Social Access
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Google Sign In option */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleSocial}
              disabled={localLoading || isLoadingYT}
              className="w-full py-3 px-4 bg-[#14151a] hover:bg-[#1b1c24] border border-white/10 rounded-2xl text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="h-3.5 w-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.619 4.545 1.765l2.45-2.45C17.51 1.83 14.975 1 12.24 1c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.782 0 10-4.068 10-10 0-.68-.08-1.31-.22-1.715H12.24z" />
              </svg>
              <span>Verify quickly with Google Popup</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleRedirect}
              disabled={localLoading || isLoadingYT}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-gray-400 hover:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              🔥 Browser popup blocked? Use Google Redirect
            </button>
          </div>

        </div>

        {/* Ambient footnote */}
        <p className="text-[10px] text-gray-500 font-mono text-center">
          Powered securely by SSL TLS and Firebase Project study-tool-b87bd.
        </p>

      </div>
    </div>
  );
}
