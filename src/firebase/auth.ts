import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getIdTokenResult } from 'firebase/auth';
import { db } from './index';
import type { User, BloodBank } from './types';
import { createUserProfile, createBloodBank } from './services';

const auth = getAuth();

export const signUpDonor = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signUpDonorProfile = async (
  email: string,
  password: string,
  profileData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  try {
    await createUserProfile(uid, profileData);
    return userCredential;
  } catch (err) {
    try {
      await deleteUser(userCredential.user);
    } catch (delErr) {
      console.error('Failed to delete auth user after profile write failure', delErr);
    }
    throw err;
  }
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data() as User;

    const normalizedType = (userData.userType || '').toString().toLowerCase();

    if (normalizedType === 'bloodbank') {
      const bankDocRef = doc(db, 'blood_banks', user.uid);
      const bankDoc = await getDoc(bankDocRef);
      const bankData = bankDoc.exists() ? (bankDoc.data() as any) : null;

      if (!bankDoc.exists() || !bankData.approved) {
        await firebaseSignOut(auth);
        throw new Error('This blood bank account is not approved. Please contact an administrator.');
      }

      if (bankData.status === 'rejected') {
        await firebaseSignOut(auth);
        throw new Error('This account has been revoked. Contact an administrator.');
      }
    }

    return userCredential;
  } else {
    await firebaseSignOut(auth);
    throw new Error('User data not found.');
  }
};

export const signUpBloodBank = async (
  email: string,
  password: string,
  userProfileData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>,
  bloodBankData: Omit<BloodBank, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  try {
    await createUserProfile(uid, userProfileData);
    await createBloodBank(uid, bloodBankData);
    return userCredential;
  } catch (err) {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      console.warn('Failed to delete users doc during rollback', e);
    }
    try {
      await deleteDoc(doc(db, 'blood_banks', uid));
    } catch (e) {
      console.warn('Failed to delete blood_banks doc during rollback', e);
    }
    try {
      await deleteUser(userCredential.user);
    } catch (delErr) {
      console.error('Failed to delete auth user during rollback', delErr);
    }
    throw err;
  }
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const authStateListener = (
  callback: (user: (Partial<User> & { uid: string; userType: string; claims?: any }) | null) => void
) => {
  let unsubBank: (() => void) | null = null;

  const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    let claims: Record<string, any> = {};
    try {
      const idResult = await getIdTokenResult(firebaseUser);
      claims = idResult.claims || {};
    } catch (e) {
      console.warn('Failed to fetch ID token result', e);
    }

    const base: Partial<User> & { uid: string; email?: string } = {
      ...(userDoc.exists() ? (userDoc.data() as Partial<User>) : {}),
      uid: firebaseUser.uid,
      email: firebaseUser.email || undefined,
    };

    let rawType = (base.userType || '').toString().toLowerCase();
    const isSuperAdmin = claims.superAdmin || claims.superadmin;
    const normalizedType = isSuperAdmin
      ? 'superadmin'
      : rawType.includes('blood')
        ? 'bloodbank'
        : rawType.includes('admin')
          ? 'superadmin'
          : 'donor';

    try {
      if (normalizedType === 'bloodbank') {
        const bankRef = doc(db, 'blood_banks', firebaseUser.uid);
        const bankSnap = await getDoc(bankRef);
        const bankData = bankSnap.exists() ? bankSnap.data() : {};
        callback({ ...base, userType: normalizedType, claims, ...bankData });

        unsubBank = onSnapshot(bankRef, (snap) => {
          const bd = snap.exists() ? snap.data() : {};
          callback({ ...base, userType: normalizedType, claims, ...bd });
        });

        return;
      }
    } catch (e) {
      console.warn('Failed to attach bank doc listener', e);
    }

    // Default (donor / superadmin)
    callback({ ...base, userType: normalizedType, claims });
  });

  // Cleanup
  return () => {
    try {
      unsubAuth();
      if (unsubBank) unsubBank();
    } catch (e) {}
  };
};
