import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { getMissions, getRewards } from '../utils/dataUtils';

// Sincronizza le missioni per un utente
export const syncMissions = async (userId) => {
  try {
    // Ottieni le missioni locali
    const localMissions = getMissions();
    
    // Riferimento alla collezione delle missioni dell'utente
    const missionsCollection = collection(db, `users/${userId}/missions`);
    
    // Ottieni le missioni da Firestore
    const firestoreMissions = await getDocs(missionsCollection);
    
    if (firestoreMissions.empty) {
      // Se non ci sono missioni in Firestore, carichiamo quelle locali
      const batch = [];
      for (const mission of localMissions) {
        batch.push(setDoc(doc(missionsCollection, mission.id), mission));
      }
      await Promise.all(batch);
      return localMissions;
    } else {
      // Sincronizza le missioni da Firestore
      const missions = [];
      firestoreMissions.forEach(doc => {
        missions.push(doc.data());
      });
      // Salva in localStorage
      localStorage.setItem('missions', JSON.stringify(missions));
      return missions;
    }
  } catch (error) {
    console.error('Errore nella sincronizzazione delle missioni:', error);
    return getMissions(); // Fallback su dati locali
  }
};

// Sincronizza le ricompense per un utente
export const syncRewards = async (userId) => {
  try {
    // Ottieni le ricompense locali
    const localRewards = getRewards();
    
    // Riferimento alla collezione delle ricompense dell'utente
    const rewardsCollection = collection(db, `users/${userId}/rewards`);
    
    // Ottieni le ricompense da Firestore
    const firestoreRewards = await getDocs(rewardsCollection);
    
    if (firestoreRewards.empty) {
      // Se non ci sono ricompense in Firestore, carichiamo quelle locali
      const batch = [];
      for (const reward of localRewards) {
        batch.push(setDoc(doc(rewardsCollection, reward.id), reward));
      }
      await Promise.all(batch);
      return localRewards;
    } else {
      // Sincronizza le ricompense da Firestore
      const rewards = [];
      firestoreRewards.forEach(doc => {
        rewards.push(doc.data());
      });
      // Salva in localStorage
      localStorage.setItem('rewards', JSON.stringify(rewards));
      return rewards;
    }
  } catch (error) {
    console.error('Errore nella sincronizzazione delle ricompense:', error);
    return getRewards(); // Fallback su dati locali
  }
};

// Aggiorna una missione
export const updateMission = async (userId, mission) => {
  try {
    await setDoc(doc(db, `users/${userId}/missions`, mission.id), mission);
    return mission;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della missione:', error);
    throw error;
  }
};

// Aggiorna una ricompensa
export const updateReward = async (userId, reward) => {
  try {
    await setDoc(doc(db, `users/${userId}/rewards`, reward.id), reward);
    return reward;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della ricompensa:', error);
    throw error;
  }
};

// Ottieni statistiche utente
export const getUserStats = async (userId) => {
  try {
    const userData = await getDoc(doc(db, 'users', userId));
    if (!userData.exists()) {
      throw new Error('Utente non trovato');
    }
    
    const userDataObj = userData.data();
    
    // Ottieni tutte le missioni completate
    const missionsRef = collection(db, `users/${userId}/missions`);
    const completedMissionsQuery = query(missionsRef, where("completed", "==", true));
    const completedMissions = await getDocs(completedMissionsQuery);
    
    // Ottieni tutte le ricompense riscattate
    const rewardsRef = collection(db, `users/${userId}/rewards`);
    const redeemedRewardsQuery = query(rewardsRef, where("redeemed", "==", true));
    const redeemedRewards = await getDocs(redeemedRewardsQuery);
    
    // Calcola energia totale guadagnata dalle missioni
    let totalEnergyEarned = 0;
    completedMissions.forEach(doc => {
      const mission = doc.data();
      totalEnergyEarned += mission.energyReward || 0;
    });
    
    // Calcola energia totale spesa per le ricompense
    let totalEnergySpent = 0;
    redeemedRewards.forEach(doc => {
      const reward = doc.data();
      totalEnergySpent += reward.energyCost || 0;
    });
    
    // Aggiorna le statistiche dell'utente
    const updatedStats = {
      completedMissions: completedMissions.size,
      redeemedRewards: redeemedRewards.size,
      totalEnergyEarned: totalEnergyEarned + 10, // Include i 10 iniziali
      totalEnergySpent: totalEnergySpent
    };
    
    await updateDoc(doc(db, 'users', userId), updatedStats);
    
    return {
      ...userDataObj,
      ...updatedStats
    };
  } catch (error) {
    console.error('Errore nel recupero delle statistiche:', error);
    throw error;
  }
};
