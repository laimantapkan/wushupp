import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppState } from '../types';
import { initialAppState } from '../data/initialData';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const STATE_DOC_REF = doc(db, 'app', 'state');

export class FirebaseService {
  private static listeners: Array<(state: AppState) => void> = [];
  private static statusListeners: Array<(connected: boolean) => void> = [];
  private static currentState: AppState = initialAppState;
  private static isInitialized = false;

  static init(onStateChange: (state: AppState) => void, onStatusChange?: (connected: boolean) => void) {
    this.listeners.push(onStateChange);
    if (onStatusChange) {
      this.statusListeners.push(onStatusChange);
      onStatusChange(true);
    }

    if (!this.isInitialized) {
      this.isInitialized = true;
      this.subscribeToRealtimeStore();
    } else if (this.currentState) {
      onStateChange(this.currentState);
    }
  }

  static removeListener(onStateChange: (state: AppState) => void) {
    this.listeners = this.listeners.filter((l) => l !== onStateChange);
  }

  private static subscribeToRealtimeStore() {
    // Listen to real-time changes in Firestore
    onSnapshot(
      STATE_DOC_REF,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as AppState;
          if (data && JSON.stringify(data) !== JSON.stringify(this.currentState)) {
            this.currentState = data;
            this.notifyListeners(data);
          }
        } else {
          // Document does not exist yet in cloud Firestore, save initial state
          this.updateState(initialAppState);
        }
        this.notifyStatus(true);
      },
      (error) => {
        console.error('Firestore Snapshot Error:', error);
        this.notifyStatus(false);
      }
    );

    // Test Connection
    getDocFromServer(STATE_DOC_REF).catch((err) => {
      console.warn('Firestore initial fetch error:', err);
    });
  }

  private static notifyListeners(state: AppState) {
    this.listeners.forEach((listener) => listener(state));
  }

  private static notifyStatus(connected: boolean) {
    this.statusListeners.forEach((listener) => listener(connected));
  }

  static async updateState(newState: AppState) {
    newState.lastUpdated = new Date().toISOString();
    this.currentState = newState;
    this.notifyListeners(newState);

    try {
      await setDoc(STATE_DOC_REF, newState);
    } catch (err) {
      console.error('Failed to update state in Firestore:', err);
    }
  }

  static async resetData() {
    const resetState = { ...initialAppState, lastUpdated: new Date().toISOString() };
    this.currentState = resetState;
    this.notifyListeners(resetState);
    try {
      await setDoc(STATE_DOC_REF, resetState);
    } catch (err) {
      console.error('Failed to reset state in Firestore:', err);
    }
  }
}
