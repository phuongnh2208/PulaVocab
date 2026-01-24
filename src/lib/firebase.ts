import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  Auth,
  User,
} from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;
const appId = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined;
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined;

export const isFirebaseReady = Boolean(apiKey && authDomain && projectId && appId);

let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseReady) {
  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    appId,
    ...(measurementId ? { measurementId } : {}),
  };
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}


export type CloudUser = Pick<User, 'uid' | 'email' | 'displayName' | 'photoURL'>;

export const signInWithGoogle = async (): Promise<CloudUser | null> => {
  if (!auth) throw new Error('firebase-not-ready');
  const provider = new GoogleAuthProvider();
  
  // First check if there's a redirect result (after redirect login)
  try {
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult?.user) {
      const user = redirectResult.user;
      return { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
    }
  } catch (redirectError: any) {
    // If redirect result has error, throw it
    throw redirectError;
  }
  
  // Try popup login
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    return { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
  } catch (e: any) {
    if (
      e?.code === 'auth/popup-blocked' ||
      e?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      // Fallback to redirect when popups are blocked or environment doesn't support
      await signInWithRedirect(auth, provider);
      // Return null - the redirect will happen and we'll check result on next page load
      return null;
    }
    throw e; // bubble up other errors so UI can display code
  }
};

export const signOutFirebase = async () => {
  if (!auth) return;
  await signOut(auth);
};

export const checkRedirectResult = async (): Promise<CloudUser | null> => {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const user = result.user;
      return { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
    }
    return null;
  } catch (error) {
    // If there's an error, we'll let onAuthStateChanged handle it
    console.error('Redirect result error:', error);
    return null;
  }
};

export const onAuthChanged = (cb: (user: CloudUser | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (u) => {
    if (!u) cb(null);
    else cb({ uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL });
  });
};

const userCardsCollection = (uid: string) => collection(db!, 'users', uid, 'cards');

export const saveCardCloud = async (card: any, uid: string) => {
  if (!db) throw new Error('firebase-not-ready');
  const ref = doc(userCardsCollection(uid), String(card.id));
  await setDoc(ref, card, { merge: true });
};

export const listCardsCloud = async (uid: string): Promise<any[]> => {
  if (!db) throw new Error('firebase-not-ready');
  const snap = await getDocs(userCardsCollection(uid));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteCardCloud = async (id: string, uid: string) => {
  if (!db) throw new Error('firebase-not-ready');
  await deleteDoc(doc(userCardsCollection(uid), String(id)));
};
