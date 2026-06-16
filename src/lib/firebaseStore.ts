import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

// Critical validation check on boot as requested by Firebase Integration Skill
export async function validateFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline. Checks will proceed locally.");
    }
  }
}
validateFirebaseConnection();

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId?: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: userId || 'anonymous',
      email: 'creator@youtube-growth-pro.com',
      emailVerified: true,
    },
    operationType,
    path
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --------------------------------------------------
// API Firestore Helpers
// --------------------------------------------------

// Users database utilities
export async function saveUserProfile(userId: string, profile: any) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getUserProfile(userId: string): Promise<any | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path, userId);
    return null;
  }
}

// Saved Ideas
export async function saveIdea(userId: string, idea: any) {
  const path = 'savedIdeas';
  try {
    const ideaId = idea.id || `idea_${Date.now()}`;
    await setDoc(doc(db, 'savedIdeas', ideaId), {
      ...idea,
      id: ideaId,
      userId,
      createdAt: new Date().toISOString()
    });
    return ideaId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getSavedIdeas(userId: string): Promise<any[]> {
  const path = 'savedIdeas';
  try {
    const q = query(collection(db, 'savedIdeas'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach(doc => {
      results.push(doc.data());
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, userId);
    return [];
  }
}

export async function deleteIdea(userId: string, ideaId: string) {
  const path = `savedIdeas/${ideaId}`;
  try {
    await deleteDoc(doc(db, 'savedIdeas', ideaId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, userId);
  }
}

// Scripts
export async function saveScript(userId: string, script: any) {
  const path = 'scripts';
  try {
    const scriptId = script.id || `script_${Date.now()}`;
    await setDoc(doc(db, 'scripts', scriptId), {
      ...script,
      id: scriptId,
      userId,
      createdAt: new Date().toISOString()
    });
    return scriptId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getSavedScripts(userId: string): Promise<any[]> {
  const path = 'scripts';
  try {
    const q = query(collection(db, 'scripts'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach(doc => {
      results.push(doc.data());
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, userId);
    return [];
  }
}

export async function deleteScript(userId: string, scriptId: string) {
  const path = `scripts/${scriptId}`;
  try {
    await deleteDoc(doc(db, 'scripts', scriptId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, userId);
  }
}

// SEO Reports
export async function saveSEOReport(userId: string, report: any) {
  const path = 'seoReports';
  try {
    const reportId = report.id || `seo_${Date.now()}`;
    await setDoc(doc(db, 'seoReports', reportId), {
      ...report,
      id: reportId,
      userId,
      createdAt: new Date().toISOString()
    });
    return reportId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getSavedSEOReports(userId: string): Promise<any[]> {
  const path = 'seoReports';
  try {
    const q = query(collection(db, 'seoReports'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach(doc => {
      results.push(doc.data());
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, userId);
    return [];
  }
}

export async function deleteSEOReport(userId: string, reportId: string) {
  const path = `seoReports/${reportId}`;
  try {
    await deleteDoc(doc(db, 'seoReports', reportId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, userId);
  }
}

// Content Calendar Planner
export async function saveCalendarEvent(userId: string, event: any) {
  const path = 'contentCalendar';
  try {
    const eventId = event.id || `event_${Date.now()}`;
    await setDoc(doc(db, 'contentCalendar', eventId), {
      ...event,
      id: eventId,
      userId,
      createdAt: new Date().toISOString()
    });
    return eventId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getCalendarEvents(userId: string): Promise<any[]> {
  const path = 'contentCalendar';
  try {
    const q = query(collection(db, 'contentCalendar'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach(doc => {
      results.push(doc.data());
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, userId);
    return [];
  }
}

export async function deleteCalendarEvent(userId: string, eventId: string) {
  const path = `contentCalendar/${eventId}`;
  try {
    await deleteDoc(doc(db, 'contentCalendar', eventId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, userId);
  }
}

// Settings Document
export async function saveUserSettings(userId: string, settings: any) {
  const path = `settings/${userId}`;
  try {
    await setDoc(doc(db, 'settings', userId), {
      ...settings,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getUserSettings(userId: string): Promise<any | null> {
  const path = `settings/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'settings', userId));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path, userId);
    return null;
  }
}

// Notifications / Milestone log
export async function addNotification(userId: string, notif: any) {
  const path = 'notifications';
  try {
    const notifId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    await setDoc(doc(db, 'notifications', notifId), {
      ...notif,
      id: notifId,
      userId,
      read: false,
      createdAt: new Date().toISOString()
    });
    return notifId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getNotifications(userId: string): Promise<any[]> {
  const path = 'notifications';
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach(doc => {
      results.push(doc.data());
    });
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, userId);
    return [];
  }
}

// Growth Reports (Viral Meter Analysis)
export async function saveGrowthReport(userId: string, report: any) {
  const path = 'growthReports';
  try {
    const reportId = report.id || `report_${Date.now()}`;
    await setDoc(doc(db, 'growthReports', reportId), {
      ...report,
      id: reportId,
      userId,
      createdAt: new Date().toISOString()
    });
    return reportId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, userId);
  }
}

export async function getGrowthReports(userId: string): Promise<any[]> {
  const path = 'growthReports';
  try {
    const q = query(collection(db, 'growthReports'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: any[] = [];
    snap.forEach(doc => {
      results.push(doc.data());
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, userId);
    return [];
  }
}
