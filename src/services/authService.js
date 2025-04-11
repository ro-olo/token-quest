import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Registrazione utente
export const registerUser = async (email, password, displayName) => {
  try {
    // Crea l'utente in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Aggiorna il profilo con il nome utente
    await updateProfile(user, { displayName });
    
    // Crea il documento dell'utente in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName,
      email,
      energy: 10,
      totalEnergyEarned: 10,
      completedMissions: 0,
      redeemedRewards: 0,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Login utente
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Aggiorna la data di ultimo accesso
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Logout utente
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Recupera dati utente da Firestore
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    throw error;
  }
};

// Aggiorna i dati dell'utente in Firestore
export const updateUserData = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return data;
  } catch (error) {
    throw error;
  }
};

// Invia email per reimpostare la password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};
