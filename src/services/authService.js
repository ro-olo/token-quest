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
      registrationDate: new Date('2025-01-01').toISOString(), // Data fissa per profilo locale
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
      // Invece di generare un errore, creiamo un oggetto utente predefinito
      console.log('Utente non trovato su Firestore, creazione di un profilo locale temporaneo');
      return {
        displayName: auth.currentUser?.displayName || 'Avventuriero',
        email: auth.currentUser?.email || '',
        registrationDate: new Date('2025-01-01').toISOString(), // Data fissa per profilo locale
        energy: 0,
        completedMissions: 0,
        redeemedRewards: 0,
        totalEnergyEarned: 0
      };
    }
  } catch (error) {
    console.warn('Errore nel recupero dei dati utente, utilizzo profilo locale:', error);
    // Ancora, restituiamo un oggetto utente predefinito in caso di errore
    return {
      displayName: auth.currentUser?.displayName || 'Avventuriero',
      email: auth.currentUser?.email || '',
      registrationDate: new Date('2025-01-01').toISOString(), // Data fissa per profilo locale
      energy: 0,
      completedMissions: 0,
      redeemedRewards: 0,
      totalEnergyEarned: 0
    };
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
