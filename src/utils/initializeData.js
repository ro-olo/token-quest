import { saveMission, getRewards, saveReward, getMissions } from './dataUtils';

// Funzione per inizializzare le missioni predefinite
export const initializeMissions = () => {
  // Elimina tutte le missioni esistenti rimuovendo la chiave dal localStorage
  localStorage.removeItem('tokenquest_missions');
  
  // Crea le nuove missioni predefinite
  const defaultMissions = [
    {
      title: 'Completa una giornata di lavoro',
      description: 'Completa una giornata lavorativa di 8 ore',
      energyReward: 8,
      completed: false
    },
    {
      title: "Mezz'ora di attività fisica",
      description: 'Fai 30 minuti di esercizio fisico',
      energyReward: 2,
      completed: false
    },
    {
      title: '30 minuti di studio',
      description: 'Dedica mezz\'ora allo studio o alla lettura',
      energyReward: 3,
      completed: false
    },
    {
      title: 'Lavare i piatti',
      description: 'Lava i piatti dopo un pasto',
      energyReward: 2,
      completed: false
    },
    {
      title: 'Cucinare',
      description: 'Prepara un pasto completo',
      energyReward: 2,
      completed: false
    },
    {
      title: 'Fare una lavatrice',
      description: 'Completa un ciclo di lavaggio e stendi i panni',
      energyReward: 3,
      completed: false
    },
    {
      title: '15 minuti di faccende domestiche',
      description: 'Dedica un quarto d\'ora a pulire o riordinare casa',
      energyReward: 1,
      completed: false
    }
  ];
  
  // Salva ogni missione nel localStorage
  defaultMissions.forEach(mission => {
    saveMission(mission);
  });
  
  return getMissions();
};

// Funzione per verificare se ci sono missioni esistenti
export const checkAndInitializeMissions = () => {
  const missions = getMissions();
  if (missions.length === 0) {
    return initializeMissions();
  }
  return missions;
};

// Funzione per sovrascrivere tutte le missioni esistenti con quelle predefinite
export const resetMissions = () => {
  return initializeMissions();
};
