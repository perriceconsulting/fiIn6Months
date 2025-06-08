// filepath: src/lib/planService.ts
import { firestore } from './firebaseClient';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';

// Type for a single month entry (e.g. goals, notes)
export interface MonthEntry {
  completed: boolean;
  notes?: string;
}

// Type for full 6-month plan
export interface UserPlan {
  [month: number]: MonthEntry;
}

// Collection root: 'plans', document id = user.uid
const PLAN_COLLECTION = 'plans';

/**
 * Fetch the user's plan from Firestore. Returns null if none exists.
 */
export async function getUserPlan(uid: string): Promise<UserPlan | null> {
  const ref = doc(firestore, PLAN_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  return snap.data() as UserPlan;
}

/**
 * Initialize a new 6-month plan for the user with default entries.
 */
export async function createUserPlan(uid: string): Promise<void> {
  const ref = doc(firestore, PLAN_COLLECTION, uid);
  const defaultPlan: UserPlan = {};
  for (let i = 1; i <= 6; i++) {
    defaultPlan[i] = { completed: false, notes: '' };
  }
  await setDoc(ref, defaultPlan);
}

/**
 * Update a single month's entry in the user's plan.
 */
export async function updateUserPlanStep(
  uid: string,
  month: number,
  entry: Partial<MonthEntry>
): Promise<void> {
  const ref = doc(firestore, PLAN_COLLECTION, uid);
  const field = String(month);
  await updateDoc(ref, {
    [field + '.completed']: entry.completed,
    [field + '.notes']: entry.notes,
  } as DocumentData);
}
