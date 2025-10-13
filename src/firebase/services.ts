import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './index';
import type { User, BloodBank, Request, Transaction } from './types';


/**
 * Creates a user profile in Firestore.
 * @param uid The user's unique ID from Firebase Auth.
 * @param data The user data to save.
 */
export const createUserProfile = (uid: string, data: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>) => {
  const userRef = doc(db, 'users', uid);
  return setDoc(userRef, {
    ...data,
    uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

/**
 * Creates a blood bank document. This should be called after creating an Auth user for the facility.
 * @param uid The facility user's uid (used as doc id).
 * @param data The blood bank data to save.
 */
export const createBloodBank = (uid: string, data: Omit<BloodBank, 'id' | 'createdAt' | 'updatedAt'>) => {
  const bankRef = doc(db, 'blood_banks', uid);
  return setDoc(bankRef, {
    ...data,
    id: uid,
    approved: data.approved ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

/**
 * Get a user's profile from Firestore.
 * @param uid The user's unique ID.
 */
export const getUserProfile = (uid: string) => {
  const userRef = doc(db, 'users', uid);
  return getDoc(userRef);
};


/**
 * Updates a blood bank's inventory in real-time.
 * @param facilityId The ID of the blood bank.
 * @param inventory The new inventory data.
 */
export const updateInventory = (facilityId: string, inventory: BloodBank['inventory']) => {
  const bankRef = doc(db, 'blood_banks', facilityId);
  return updateDoc(bankRef, { 
    inventory,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Listens for real-time updates to a specific blood bank.
 * @param facilityId The ID of the blood bank.
 * @param callback The function to call with the updated data.
 */
export const onBloodBankUpdate = (facilityId: string, callback: (data: BloodBank | undefined) => void) => {
  const bankRef = doc(db, 'blood_banks', facilityId);
  return onSnapshot(bankRef, (docSnap) => {
    callback((docSnap.exists() ? (docSnap.data() as BloodBank) : undefined));
  });
};

/**
 * Creates a new resource request.
 * @param requestData The data for the new request.
 */
export const createRequest = (requestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
  const requestsCollection = collection(db, 'requests');
  return addDoc(requestsCollection, {
    ...requestData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

/**
 * Listens for real-time updates to all requests for a user.
 * @param userId The ID of the user.
 * @param callback The function to call with the list of requests.
 */
export const onUserRequestsUpdate = (userId: string, callback: (requests: Request[]) => void) => {
  const requestsCollection = collection(db, 'requests');
  return onSnapshot(requestsCollection, (snapshot) => {
    const requests = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as any) } as Request));
    callback(requests.filter(req => req.userId === userId));
  });
};


/**
 * Creates a new transaction record.
 * @param transactionData The data for the new transaction.
 */
export const createTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
  const transactionsCollection = collection(db, 'transactions');
  return addDoc(transactionsCollection, {
    ...transactionData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};
