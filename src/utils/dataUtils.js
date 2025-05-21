import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { defaultMissions, defaultRewards } from './initMissions';

export const initDefaultData = async (userId) => {
  const missionsRef = collection(db, `users/${userId}/missions`);
  const rewardsRef = collection(db, `users/${userId}/rewards`);
  
  const missionsSnapshot = await getDocs(missionsRef);
  if (missionsSnapshot.empty) {
    await Promise.all(defaultMissions.map(mission => addDoc(missionsRef, mission)));
  }

  const rewardsSnapshot = await getDocs(rewardsRef);
  if (rewardsSnapshot.empty) {
    await Promise.all(defaultRewards.map(reward => addDoc(rewardsRef, reward)));
  }
};

export const getMissions = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/missions`));
    
    // Converti i documenti in array anche se vuoto
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) || []; // Fallback esplicito ad array vuoto
    
  } catch (error) {
    console.error("Error getting missions:", error);
    return []; // Ritorna sempre array anche in caso di errore
  }
};

export const saveMission = async (mission, userId) => {
  const missionsRef = collection(db, `users/${userId}/missions`);
  const docRef = await addDoc(missionsRef, mission);
  return { id: docRef.id, ...mission };
};

export const completeMission = async (missionId, userId) => {
  const missionRef = doc(db, `users/${userId}/missions/${missionId}`);
  await updateDoc(missionRef, { completed: true });
};

// Rewards
export const getRewards = async (userId) => {
  const rewardsRef = collection(db, `users/${userId}/rewards`);
  const snapshot = await getDocs(rewardsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveReward = async (reward, userId) => {
  const rewardsRef = collection(db, `users/${userId}/rewards`);
  const docRef = await addDoc(rewardsRef, reward);
  return { id: docRef.id, ...doc.data() };
};

export const redeemReward = async (rewardId, userId) => {
  const rewardRef = doc(db, `users/${userId}/rewards/${rewardId}`);
  await updateDoc(rewardRef, { redeemed: true });
};

export const getRewardById = (id) => {
  const rewards = getRewards();
  return rewards.find(reward => reward.id === id);
};

export const deleteReward = (id) => {
  const rewards = getRewards();
  const updatedRewards = rewards.filter(reward => reward.id !== id);
  localStorage.setItem('tokenquest_rewards', JSON.stringify(updatedRewards));
};

export const resetRewards = async (userId) => {
  try {
    const rewardsRef = collection(db, `users/${userId}/rewards`);
    const snapshot = await getDocs(rewardsRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    await initDefaultData(userId);
    return true;
  } catch (error) {
    console.error("Error resetting rewards:", error);
    return false;
  }
};

export const saveJournalEntry = async (entry, userId) => {
  const entriesRef = collection(db, `users/${userId}/journal`);
  
  if (entry.id) {
    // Update existing entry
    const entryRef = doc(entriesRef, entry.id);
    await updateDoc(entryRef, entry);
    return { id: entry.id, ...entry };
  } else {
    // Add new entry with generated ID
    entry.createdAt = new Date().toISOString();
    const docRef = await addDoc(entriesRef, entry);
    return { id: docRef.id, ...entry };
  }
};

export const getJournalEntries = async (userId) => {
  const entriesRef = collection(db, `users/${userId}/journal`);
  const snapshot = await getDocs(entriesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteJournalEntry = async (entryId, userId) => {
  const entriesRef = collection(db, `users/${userId}/journal`);
  const entryRef = doc(entriesRef, entryId);
  await deleteDoc(entryRef);
};

// Inizializza missioni predefinite
export const initDefaultMissions = () => {
  // This is now handled by mockDataService
  return [];
};

// Inizializza ricompense predefinite
export const initDefaultRewards = () => {
  // This is now handled by mockDataService
  return [];
};

// Date utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get days streak (consecutive days with completed missions)
export const calculateStreak = () => {
  const missions = getMissions();
  const completedMissions = missions.filter(mission => mission.completed);
  
  if (completedMissions.length === 0) {
    return 0;
  }
  
  // Sort completed missions by completedAt date
  const sortedCompletedMissions = completedMissions
    .filter(mission => mission.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  
  if (sortedCompletedMissions.length === 0) {
    return 0;
  }
  
  // Check if there's a mission completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const latestCompletionDate = new Date(sortedCompletedMissions[0].completedAt);
  latestCompletionDate.setHours(0, 0, 0, 0);
  
  // If latest mission is not from today, streak is broken
  if (latestCompletionDate.getTime() !== today.getTime()) {
    return 0;
  }
  
  // Count the streak
  let streak = 1;
  let currentDate = today;
  
  for (let i = 1; i < sortedCompletedMissions.length; i++) {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    
    const missionDate = new Date(sortedCompletedMissions[i].completedAt);
    missionDate.setHours(0, 0, 0, 0);
    
    if (missionDate.getTime() === previousDay.getTime()) {
      streak++;
      currentDate = previousDay;
    } else if (missionDate.getTime() < previousDay.getTime()) {
      // Skip this date since we're looking for consecutive days
      continue;
    } else {
      // Streak is broken
      break;
    }
  }
  
  return streak;
};
