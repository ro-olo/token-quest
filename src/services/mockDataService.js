// Mock Data Service for missions and rewards
import { v4 as uuidv4 } from 'uuid';

// Storage keys
const MISSIONS_STORAGE_KEY = 'tokenquest_mock_missions';
const REWARDS_STORAGE_KEY = 'tokenquest_mock_rewards';

// Default fantasy-themed missions with energy values
const DEFAULT_MISSIONS = [
  {
    id: uuidv4(),
    title: 'Studio del Tomo Antico',
    description: 'Una mezz\'ora passata a decifrare rune dimenticate.',
    energyReward: 1,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Apprendistato alla Torre di Cristallo',
    description: 'Mezza giornata di studio sotto l\'occhio vigile di un arcimago.',
    energyReward: 4,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Ritiro dell\'Erudito Supremo',
    description: 'Una giornata intera immersi nello studio dei segreti dell\'universo.',
    energyReward: 8,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Servizio al Castello Reale',
    description: 'Giornata intera dedicata al lavoro presso la corte del re.',
    energyReward: 8,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Turno alla Locanda del Drago',
    description: 'Mezza giornata di lavoro tra taverne e viandanti.',
    energyReward: 4,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Addestramento del Cavaliere Errante',
    description: '30 minuti di allenamento con la spada o arti marziali.',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Sfida della Forza Celeste',
    description: 'Un\'ora di allenamento sotto la guida dei guardiani del tempio.',
    energyReward: 5,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Pulizia della Tana del Goblin',
    description: 'Lava i piatti e ripulisci gli angoli oscuri della cucina.',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Pozioni e Preparati',
    description: 'Cucina un pasto magico, degno di un banchetto elfico.',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Incantesimo di Detersione Rapida',
    description: '15 minuti per scacciare la polvere maledetta.',
    energyReward: 1,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Purificazione della Dimora',
    description: '30 minuti di pulizie profonde con spazzole incantate.',
    energyReward: 2,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Rituale della Lavatrice Sacra',
    description: 'Lava gli abiti infusi di magia quotidiana.',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Missione del Mercato di Mezzanotte',
    description: 'Spesa settimanale tra mercanti e spezie rare.',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Commissione dell\'Usignolo',
    description: 'Brevi missioni nella città (posta, consegne).',
    energyReward: 1,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Incarico della Corporazione',
    description: 'Commissioni impegnative degne di un avventuriero navigato.',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Default fantasy-themed rewards with energy costs
const DEFAULT_REWARDS = [
  {
    id: uuidv4(),
    title: 'Duello Virtuale nell\'Arena delle Ombre',
    description: '1 ora di videogiochi tra magie e battaglie epiche.',
    energyCost: 3,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Consiglio dei Meeples',
    description: '1 ora di giochi da tavolo con altri avventurieri.',
    energyCost: 3,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Visione dell\'Oracolo',
    description: 'Guarda un film o una serie custodita negli archivi proibiti (2 ore).',
    energyCost: 6,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Lettura del Grimorio Incantato',
    description: '30 minuti di lettura tra storie leggendarie.',
    energyCost: 2,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: '🎖️ Bonus Massimo: Regalati Qualcosa!',
    description: 'Premiati con qualcosa di leggendario!',
    energyCost: 100,
    redeemed: false,
    createdAt: new Date().toISOString()
  }
];

// Helper functions for user-specific storage
const getUserMissionsKey = (userId) => `${MISSIONS_STORAGE_KEY}_${userId}`;
const getUserRewardsKey = (userId) => `${REWARDS_STORAGE_KEY}_${userId}`;

// Get user missions from storage
const getUserMissions = (userId) => {
  const key = getUserMissionsKey(userId);
  const missionsJson = localStorage.getItem(key);
  return missionsJson ? JSON.parse(missionsJson) : [];
};

// Save user missions to storage
const saveUserMissions = (userId, missions) => {
  const key = getUserMissionsKey(userId);
  localStorage.setItem(key, JSON.stringify(missions));
  return missions;
};

// Get user rewards from storage
const getUserRewards = (userId) => {
  const key = getUserRewardsKey(userId);
  const rewardsJson = localStorage.getItem(key);
  return rewardsJson ? JSON.parse(rewardsJson) : [];
};

// Save user rewards to storage
const saveUserRewards = (userId, rewards) => {
  const key = getUserRewardsKey(userId);
  localStorage.setItem(key, JSON.stringify(rewards));
  return rewards;
};

// Sync missions for a user
export const syncMissions = async (userId, reset = false) => {
  try {
    // Check if the user has missions or reset is requested
    let missions = reset ? [] : getUserMissions(userId);
    
    if (missions.length === 0) {
      // If no missions exist or reset requested, initialize with defaults
      missions = DEFAULT_MISSIONS.map(mission => ({
        ...mission,
        id: uuidv4() // Ensure unique IDs
      }));
      saveUserMissions(userId, missions);
    }
    
    return missions;
  } catch (error) {
    console.error('Errore nella sincronizzazione delle missioni:', error);
    return []; // Return empty array on error
  }
};

// Sync rewards for a user
export const syncRewards = async (userId, reset = false) => {
  try {
    // Check if the user has rewards or reset is requested
    let rewards = reset ? [] : getUserRewards(userId);
    
    if (rewards.length === 0) {
      // If no rewards exist or reset requested, initialize with defaults
      rewards = DEFAULT_REWARDS.map(reward => ({
        ...reward,
        id: uuidv4() // Ensure unique IDs
      }));
      saveUserRewards(userId, rewards);
    }
    
    return rewards;
  } catch (error) {
    console.error('Errore nella sincronizzazione delle ricompense:', error);
    return []; // Return empty array on error
  }
};

// Update a mission
export const updateMission = async (userId, mission) => {
  try {
    const missions = getUserMissions(userId);
    const index = missions.findIndex(m => m.id === mission.id);
    
    if (index !== -1) {
      missions[index] = mission;
      saveUserMissions(userId, missions);
    }
    
    return mission;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della missione:', error);
    throw error;
  }
};

// Update a reward
export const updateReward = async (userId, reward) => {
  try {
    const rewards = getUserRewards(userId);
    const index = rewards.findIndex(r => r.id === reward.id);
    
    if (index !== -1) {
      rewards[index] = reward;
      saveUserRewards(userId, rewards);
    }
    
    return reward;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della ricompensa:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async (userId) => {
  try {
    const missions = getUserMissions(userId);
    const rewards = getUserRewards(userId);
    
    // Calculate completed missions
    const completedMissions = missions.filter(m => m.completed).length;
    
    // Calculate redeemed rewards
    const redeemedRewards = rewards.filter(r => r.redeemed).length;
    
    // Calculate total energy earned
    const earnedEnergy = missions
      .filter(m => m.completed)
      .reduce((total, mission) => total + (mission.energyReward || 0), 0);
    
    // Calculate total energy spent
    const spentEnergy = rewards
      .filter(r => r.redeemed)
      .reduce((total, reward) => total + (reward.energyCost || 0), 0);
    
    return {
      completedMissions,
      redeemedRewards,
      totalEnergyEarned: earnedEnergy + 10, // Include initial 10 energy
      totalEnergySpent: spentEnergy
    };
  } catch (error) {
    console.error('Errore nel recupero delle statistiche:', error);
    throw error;
  }
};

// Additional utility functions
export const getMissions = () => {
  // For backward compatibility with dataUtils
  const currentUser = JSON.parse(localStorage.getItem('tokenquest_user'));
  if (currentUser && currentUser.uid) {
    return getUserMissions(currentUser.uid);
  }
  return [];
};

export const getRewards = () => {
  // For backward compatibility with dataUtils
  const currentUser = JSON.parse(localStorage.getItem('tokenquest_user'));
  if (currentUser && currentUser.uid) {
    return getUserRewards(currentUser.uid);
  }
  return [];
};

// Reset missions to defaults
export const resetMissions = (userId) => {
  const missions = DEFAULT_MISSIONS.map(mission => ({
    ...mission,
    id: uuidv4() // Ensure unique IDs
  }));
  saveUserMissions(userId, missions);
  return missions;
};

// Reset rewards to defaults
export const resetRewards = (userId) => {
  const rewards = DEFAULT_REWARDS.map(reward => ({
    ...reward,
    id: uuidv4() // Ensure unique IDs
  }));
  saveUserRewards(userId, rewards);
  return rewards;
};
