import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

// Sincronizza le missioni dell'utente
export const syncMissions = async (userId) => {
  try {
    // Ottieni tutte le missioni dell'utente
    const missionsRef = collection(db, 'users', userId, 'missions');
    const snapshot = await getDocs(missionsRef);
    
    // Converti i documenti in array
    const missions = [];
    snapshot.forEach(doc => {
      missions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Salva le missioni in localStorage per accesso offline
    localStorage.setItem('missions', JSON.stringify(missions));
    
    return missions;
  } catch (error) {
    console.error('Errore durante la sincronizzazione delle missioni:', error);
    throw error;
  }
};

// Ottieni tutte le missioni dell'utente
export const getMissions = async (userId) => {
  try {
    // Prima controlla se ci sono missioni in localStorage
    const cachedMissions = localStorage.getItem('missions');
    if (cachedMissions) {
      return JSON.parse(cachedMissions);
    }
    
    // Se non ci sono, sincronizza con Firestore
    return await syncMissions(userId);
  } catch (error) {
    console.error('Errore durante il recupero delle missioni:', error);
    throw error;
  }
};

// Salva una missione
export const saveMission = async (userId, missionData) => {
  try {
    const { id, ...data } = missionData;
    const missionId = id || Math.random().toString(36).substring(2, 15);
    
    // Salva la missione in Firestore
    await setDoc(doc(db, 'users', userId, 'missions', missionId), {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Aggiorna la cache locale
    await syncMissions(userId);
    
    return { id: missionId, ...data };
  } catch (error) {
    console.error('Errore durante il salvataggio della missione:', error);
    throw error;
  }
};

// Aggiorna lo stato di una missione
export const updateMission = async (userId, missionId, completed = true) => {
  try {
    // Aggiorna la missione in Firestore
    await updateDoc(doc(db, 'users', userId, 'missions', missionId), {
      completed,
      completedAt: completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    });
    
    // Aggiorna la cache locale
    await syncMissions(userId);
    
    return { id: missionId, completed };
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della missione:', error);
    throw error;
  }
};

// Elimina una missione
export const deleteMission = async (userId, missionId) => {
  try {
    // Elimina la missione da Firestore
    await deleteDoc(doc(db, 'users', userId, 'missions', missionId));
    
    // Aggiorna la cache locale
    await syncMissions(userId);
    
    return { success: true };
  } catch (error) {
    console.error('Errore durante l\'eliminazione della missione:', error);
    throw error;
  }
};

// Sincronizza le ricompense dell'utente
export const syncRewards = async (userId) => {
  try {
    // Ottieni tutte le ricompense dell'utente
    const rewardsRef = collection(db, 'users', userId, 'rewards');
    const snapshot = await getDocs(rewardsRef);
    
    // Converti i documenti in array
    const rewards = [];
    snapshot.forEach(doc => {
      rewards.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Salva le ricompense in localStorage per accesso offline
    localStorage.setItem('rewards', JSON.stringify(rewards));
    
    return rewards;
  } catch (error) {
    console.error('Errore durante la sincronizzazione delle ricompense:', error);
    throw error;
  }
};

// Ottieni tutte le ricompense dell'utente
export const getRewards = async (userId) => {
  try {
    // Prima controlla se ci sono ricompense in localStorage
    const cachedRewards = localStorage.getItem('rewards');
    if (cachedRewards) {
      return JSON.parse(cachedRewards);
    }
    
    // Se non ci sono, sincronizza con Firestore
    return await syncRewards(userId);
  } catch (error) {
    console.error('Errore durante il recupero delle ricompense:', error);
    throw error;
  }
};

// Salva una ricompensa
export const saveReward = async (userId, rewardData) => {
  try {
    const { id, ...data } = rewardData;
    const rewardId = id || Math.random().toString(36).substring(2, 15);
    
    // Salva la ricompensa in Firestore
    await setDoc(doc(db, 'users', userId, 'rewards', rewardId), {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Aggiorna la cache locale
    await syncRewards(userId);
    
    return { id: rewardId, ...data };
  } catch (error) {
    console.error('Errore durante il salvataggio della ricompensa:', error);
    throw error;
  }
};

// Aggiorna lo stato di una ricompensa
export const updateReward = async (userId, rewardId, redeemed = true) => {
  try {
    // Aggiorna la ricompensa in Firestore
    await updateDoc(doc(db, 'users', userId, 'rewards', rewardId), {
      redeemed,
      redeemedAt: redeemed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    });
    
    // Aggiorna la cache locale
    await syncRewards(userId);
    
    return { id: rewardId, redeemed };
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della ricompensa:', error);
    throw error;
  }
};

// Elimina una ricompensa
export const deleteReward = async (userId, rewardId) => {
  try {
    // Elimina la ricompensa da Firestore
    await deleteDoc(doc(db, 'users', userId, 'rewards', rewardId));
    
    // Aggiorna la cache locale
    await syncRewards(userId);
    
    return { success: true };
  } catch (error) {
    console.error('Errore durante l\'eliminazione della ricompensa:', error);
    throw error;
  }
};

// Ottieni le statistiche dell'utente
export const getUserStats = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche dell\'utente:', error);
    throw error;
  }
};
