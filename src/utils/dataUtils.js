// Utility functions for managing local storage data

// Import our mock data operations
import { getMissions as getMockMissions, getRewards as getMockRewards } from '../services/mockDataService';

// Generate unique ID by combining timestamp with random string
const generateUniqueId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Missions (Tasks) Management
export const saveMission = (mission) => {
  const missions = getMissions();
  if (mission.id) {
    // Update existing mission
    const index = missions.findIndex(m => m.id === mission.id);
    if (index !== -1) {
      missions[index] = mission;
    }
  } else {
    // Add new mission with generated ID
    mission.id = generateUniqueId();
    mission.createdAt = new Date().toISOString();
    missions.push(mission);
  }
  
  localStorage.setItem('tokenquest_missions', JSON.stringify(missions));
  return mission;
};

export const getMissions = () => {
  return getMockMissions();
};

export const getMissionById = (id) => {
  const missions = getMissions();
  return missions.find(mission => mission.id === id);
};

export const deleteMission = (id) => {
  const missions = getMissions();
  const updatedMissions = missions.filter(mission => mission.id !== id);
  localStorage.setItem('tokenquest_missions', JSON.stringify(updatedMissions));
};

export const completeMission = (missionId) => {
  const missions = getMissions();
  const missionIndex = missions.findIndex(mission => mission.id === missionId);
  
  if (missionIndex === -1) return null;
  
  const updatedMission = { ...missions[missionIndex], completed: true, completedAt: new Date().toISOString() };
  missions[missionIndex] = updatedMission;
  
  // Save updated missions
  localStorage.setItem('tokenquest_missions', JSON.stringify(missions));
  
  return updatedMission;
};

// Rewards Management
export const saveReward = (reward) => {
  const rewards = getRewards();
  if (reward.id) {
    // Update existing reward
    const index = rewards.findIndex(r => r.id === reward.id);
    if (index !== -1) {
      rewards[index] = reward;
    }
  } else {
    // Add new reward with generated ID
    reward.id = generateUniqueId();
    reward.createdAt = new Date().toISOString();
    rewards.push(reward);
  }
  
  localStorage.setItem('tokenquest_rewards', JSON.stringify(rewards));
  return reward;
};

export const getRewards = () => {
  return getMockRewards();
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

export const redeemReward = (rewardId) => {
  const rewards = getRewards();
  const rewardIndex = rewards.findIndex(reward => reward.id === rewardId);
  
  if (rewardIndex === -1) return null;
  
  const updatedReward = { ...rewards[rewardIndex], redeemed: true, redeemedAt: new Date().toISOString() };
  rewards[rewardIndex] = updatedReward;
  
  // Save updated rewards
  localStorage.setItem('tokenquest_rewards', JSON.stringify(rewards));
  
  return updatedReward;
};

// Journal Entries Management
export const saveJournalEntry = (entry) => {
  const entries = getJournalEntries();
  if (entry.id) {
    // Update existing entry
    const index = entries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      entries[index] = entry;
    }
  } else {
    // Add new entry with generated ID
    entry.id = generateUniqueId();
    entry.createdAt = new Date().toISOString();
    entries.push(entry);
  }
  
  localStorage.setItem('tokenquest_journal', JSON.stringify(entries));
  return entry;
};

export const getJournalEntries = () => {
  const entries = localStorage.getItem('tokenquest_journal');
  return entries ? JSON.parse(entries) : [];
};

export const getJournalEntryById = (id) => {
  const entries = getJournalEntries();
  return entries.find(entry => entry.id === id);
};

export const deleteJournalEntry = (id) => {
  const entries = getJournalEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('tokenquest_journal', JSON.stringify(updatedEntries));
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

// Reset missions to default ones
export const resetMissions = () => {
  // Elimina tutte le missioni esistenti rimuovendo la chiave dal localStorage
  localStorage.removeItem('tokenquest_missions');
  
  // Crea nuove missioni predefinite con i titoli fantasy
  const defaultMissions = [
    {
      id: generateUniqueId(),
      title: 'Studio del Tomo Antico',
      description: 'Una mezz\'ora passata a decifrare rune dimenticate.',
      energyReward: 1,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Apprendistato alla Torre',
      description: 'Mezza giornata di studio sotto l\'occhio vigile di un arcimago.',
      energyReward: 4,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Ritiro dell\'Erudito',
      description: 'Una giornata intera immersi nello studio dei segreti dell\'universo.',
      energyReward: 8,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Servizio al Castello',
      description: 'Giornata intera dedicata al lavoro presso la corte del re.',
      energyReward: 8,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Turno alla Locanda',
      description: 'Mezza giornata di lavoro tra taverne e viandanti.',
      energyReward: 4,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Addestramento del Cavaliere',
      description: '30 minuti di allenamento con la spada o arti marziali.',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Sfida della Forza',
      description: 'Un\'ora di allenamento sotto la guida dei guardiani del tempio.',
      energyReward: 5,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Pulizia della Tana',
      description: 'Lava i piatti e ripulisci gli angoli oscuri della cucina.',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Pozioni e Preparati',
      description: 'Cucina un pasto magico, degno di un banchetto elfico.',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Incantesimo di Detersione',
      description: '15 minuti per scacciare la polvere maledetta.',
      energyReward: 1,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Purificazione della Dimora',
      description: '30 minuti di pulizie profonde con spazzole incantate.',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Rituale della Lavatrice',
      description: 'Lava gli abiti infusi di magia quotidiana.',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Missione del Mercato',
      description: 'Spesa settimanale tra mercanti e spezie rare.',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Commissione dell\'Usignolo',
      description: 'Brevi missioni nella città (posta, consegne).',
      energyReward: 1,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Incarico della Gilda',
      description: 'Commissioni impegnative degne di un avventuriero navigato.',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  // Salva le missioni predefinite direttamente
  localStorage.setItem('tokenquest_missions', JSON.stringify(defaultMissions));
  return defaultMissions;
};

// Reset rewards to default ones
export const resetRewards = () => {
  // Elimina tutte le ricompense esistenti rimuovendo la chiave dal localStorage
  localStorage.removeItem('tokenquest_rewards');
  
  // Crea nuove ricompense predefinite con i titoli fantasy
  const defaultRewards = [
    {
      id: generateUniqueId(),
      title: 'Duello Virtuale',
      description: '1 ora di videogiochi tra magie e battaglie epiche.',
      energyCost: 3,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Lettura del Grimorio',
      description: '30 minuti di lettura tra storie leggendarie.',
      energyCost: 2,
      redeemed: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  // Salva le ricompense predefinite direttamente
  localStorage.setItem('tokenquest_rewards', JSON.stringify(defaultRewards));
  return defaultRewards;
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
