import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB2YCgWbBJ3gsgwAKi6zwhH6kS6VHQ-2Vc",
  authDomain: "token-quest-f329a.firebaseapp.com",
  projectId: "token-quest-f329a",
  storageBucket: "token-quest-f329a.firebasestorage.app",
  messagingSenderId: "987500565644",
  appId: "1:987500565644:web:69d2ba8bbdc33e7ddb17a9",
  measurementId: "G-3E7K9R7NBV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };