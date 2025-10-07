
// src/firebase/auth.ts
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './index';
import { User } from './types';

const auth = getAuth();

/**
 * Creates a new donor user.
 */
export const signUpDonor = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in a user (donor or blood bank).
 * For blood banks, it performs an additional check to ensure they are approved.
 */
export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Check the user's type from the Firestore 'users' collection
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data() as User;
    
    // If the user is a blood bank, check if they are approved
    if (userData.userType === 'bloodBank') {
      const bankDocRef = doc(db, 'blood_banks', user.uid);
      const bankDoc = await getDoc(bankDocRef);
      if (!bankDoc.exists() || !bankDoc.data().approved) {
        await firebaseSignOut(auth); // Sign out the user
        throw new Error('This blood bank account is not approved. Please contact an administrator.');
      }
    }
    return userCredential;
  } else {
    await firebaseSignOut(auth);
    throw new Error('User data not found.');
  }
};

/**
 * Signs out the current user.
 */
export const signOut = () => {
  return firebaseSignOut(auth);
};

/**
 * Listens for authentication state changes and retrieves user role.
 */
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        callback({ ...user, ...userDoc.data() });
      } else {
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};
