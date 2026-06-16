import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider Config with YouTube Scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/youtube.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener and capture redirect results
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  // Check if we arrived here from a Google Auth redirect
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
          localStorage.setItem('yt_oauth_access_token', credential.accessToken);
          if (onAuthSuccess) {
            onAuthSuccess(result.user, credential.accessToken);
          }
        }
      }
    })
    .catch((error) => {
      console.error('Redirect sign-in error:', error);
    });

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const storedToken = cachedAccessToken || localStorage.getItem('yt_oauth_access_token');
      if (storedToken) {
        cachedAccessToken = storedToken;
        if (onAuthSuccess) onAuthSuccess(user, storedToken);
      } else {
        // Logged in with email-password or token not yet fetched
        if (onAuthSuccess) onAuthSuccess(user, null);
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('yt_oauth_access_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign up with standard Email and Password
export const emailSignUp = async (email: string, password: string, displayName?: string): Promise<User> => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName });
      await cred.user.reload();
    }
    return auth.currentUser || cred.user;
  } catch (error) {
    console.error('Email sign up error:', error);
    throw error;
  }
};

// Sign in with standard Email and Password
export const emailSignIn = async (email: string, password: string): Promise<User> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (error) {
    console.error('Email sign in error:', error);
    throw error;
  }
};

// Sign in with Google Popup (standard option)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve YouTube access token from Google Auth.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Sign in with Google Redirect (robust fallback for iframe environments)
export const googleSignInRedirect = async (): Promise<void> => {
  isSigningIn = true;
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Redirect error:', error);
    isSigningIn = false;
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// YouTube Video Interface
export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
}

// YouTube Channel Stats Interface
export interface YouTubeChannelStats {
  title: string;
  customUrl: string;
  thumbnail: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  uploadsPlaylistId: string;
}

// Fetch YouTube Channel Details
export async function fetchYouTubeChannelStats(accessToken: string): Promise<YouTubeChannelStats> {
  const url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true';
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`YouTube API returned status ${response.status}`);
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('No YouTube channel found for this Google account.');
  }

  const channel = data.items[0];
  const statistics = channel.statistics;
  const snippet = channel.snippet;
  const contentDetails = channel.contentDetails;

  return {
    title: snippet.title,
    customUrl: snippet.customUrl || '@creator',
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
    subscriberCount: parseInt(statistics.subscriberCount) || 0,
    viewCount: parseInt(statistics.viewCount) || 0,
    videoCount: parseInt(statistics.videoCount) || 0,
    uploadsPlaylistId: contentDetails.relatedPlaylists?.uploads || ''
  };
}

// Fetch Recent YouTube Videos & Statistics
export async function fetchYouTubeRecentVideos(accessToken: string, uploadsPlaylistId: string): Promise<YouTubeVideo[]> {
  if (!uploadsPlaylistId) return [];

  // 1. Get playlist items (video IDs and titles)
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=5&playlistId=${uploadsPlaylistId}`;
  const playlistResponse = await fetch(playlistUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!playlistResponse.ok) {
    throw new Error('Failed to retrieve recent uploads playlist.');
  }

  const playlistData = await playlistResponse.json();
  if (!playlistData.items || playlistData.items.length === 0) {
    return [];
  }

  const videos: any[] = playlistData.items.map((item: any) => ({
    id: item.contentDetails.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    views: 0,
    likes: 0,
    comments: 0
  }));

  const videoIds = videos.map(v => v.id).join(',');

  // 2. Get metrics for these video IDs
  try {
    const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`;
    const statsResponse = await fetch(videoStatsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      const statsMap = new Map<string, any>();
      statsData.items?.forEach((item: any) => {
        statsMap.set(item.id, item.statistics);
      });

      videos.forEach(v => {
        const stats = statsMap.get(v.id);
        if (stats) {
          v.views = parseInt(stats.viewCount) || 0;
          v.likes = parseInt(stats.likeCount) || 0;
          v.comments = parseInt(stats.commentCount) || 0;
        }
      });
    }
  } catch (error) {
    console.error('Failed to augment video statistics:', error);
  }

  return videos;
}
