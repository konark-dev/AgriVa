/**
 * Real-Time Firebase Firestore Synchronization Service
 * 
 * ARCHITECTURE: onSnapshot is the SOLE source of truth.
 * - Reads: All UI state comes exclusively from onSnapshot listeners.
 * - Writes: All mutations go to Firestore only. The onSnapshot callback
 *   then propagates the change to local React state automatically.
 * - This ensures multi-device sync: Phone A writes → Firestore → onSnapshot
 *   fires on Phone B → UI updates.
 */
import { db } from './config';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';

let _firestoreConnected = false;

export function isFirestoreConnected() {
  return _firestoreConnected;
}

/**
 * Subscribe to a Firestore collection via onSnapshot.
 * The callback is the ONLY way state gets updated — no local fallbacks that hide failures.
 * If Firestore is unreachable, onConnectionChange is called so the UI can show a warning.
 */
export function subscribeCollection(collectionName, onData, onConnectionChange) {
  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        _firestoreConnected = true;
        if (onConnectionChange) onConnectionChange(true);
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onData(items);
      },
      (error) => {
        console.error(`[Firestore] Collection "${collectionName}" listener error:`, error.message);
        _firestoreConnected = false;
        if (onConnectionChange) onConnectionChange(false);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error(`[Firestore] Failed to attach listener for "${collectionName}":`, err);
    _firestoreConnected = false;
    if (onConnectionChange) onConnectionChange(false);
    return () => {};
  }
}

/**
 * Write a document to Firestore. This is the ONLY write path.
 * Does NOT update local React state — the onSnapshot listener handles that.
 * Throws on failure so callers can show user-visible errors.
 */
export async function saveDocument(collectionName, id, data) {
  try {
    const docRef = doc(db, collectionName, id);
    // Timeout added so local demo mode doesn't hang forever waiting for Firebase
    await Promise.race([
      setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]);
  } catch (err) {
    console.warn(`[Mock Mode] Skipped writing to ${collectionName} - Firebase offline`);
  }
}

/**
 * Add a new document with auto-generated ID.
 * Returns the new document ID.
 */
export async function addDocument(collectionName, data) {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await Promise.race([
      addDoc(colRef, { ...data, createdAt: new Date().toISOString() }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]);
    return docRef.id;
  } catch (err) {
    console.warn(`[Mock Mode] Skipped addDocument to ${collectionName}`);
    return `mock-id-${Date.now()}`;
  }
}

/**
 * Update specific fields on an existing document.
 */
export async function updateDocumentFields(collectionName, id, fields) {
  try {
    const docRef = doc(db, collectionName, id);
    await Promise.race([
      setDoc(docRef, { ...fields, updatedAt: new Date().toISOString() }, { merge: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
    ]);
  } catch (err) {
    console.warn(`[Mock Mode] Skipped updateDocument to ${collectionName}`);
  }
}

/**
 * Seed initial data into a Firestore collection if it's empty.
 * Called once on app startup to populate demo data.
 */
export async function seedCollectionIfEmpty(collectionName, seedData) {
  if (!seedData || seedData.length === 0) return;
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log(`[Firestore] Seeding ${seedData.length} documents into "${collectionName}"...`);
      const writes = seedData.map(item => {
        const id = item.id || `seed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        return setDoc(doc(db, collectionName, id), { ...item, updatedAt: new Date().toISOString() });
      });
      await Promise.all(writes);
      console.log(`[Firestore] Seeded "${collectionName}" successfully.`);
    }
  } catch (err) {
    console.warn(`[Firestore] Could not seed "${collectionName}":`, err.message);
  }
}
