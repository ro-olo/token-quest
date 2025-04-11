/**
 * Questo file contiene funzioni per resettare i dati dell'applicazione Token Quest
 * con valori predefiniti per missioni e ricompense.
 */

// Funzione per generare un ID unico
const generateUniqueId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Funzione per inizializzare le missioni predefinite
export const resetMissions = () => {
  // Elimina tutte le missioni esistenti rimuovendo la chiave dal localStorage
  localStorage.removeItem('tokenquest_missions');
  
  // Crea le nuove missioni predefinite
  const defaultMissions = [
    {
      id: generateUniqueId(),
      title: 'Completa una giornata di lavoro',
      description: 'Completa una giornata lavorativa di 8 ore',
      energyReward: 8,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: "Mezz'ora di attivitu00e0 fisica",
      description: 'Fai 30 minuti di esercizio fisico',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: '30 minuti di studio',
      description: 'Dedica mezz\'ora allo studio o alla lettura',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Lavare i piatti',
      description: 'Lava i piatti dopo un pasto',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Cucinare',
      description: 'Prepara un pasto completo',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Fare una lavatrice',
      description: 'Completa un ciclo di lavaggio e stendi i panni',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: '15 minuti di faccende domestiche',
      description: 'Dedica un quarto d\'ora a pulire o riordinare casa',
      energyReward: 1,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  // Salva le missioni nel localStorage
  localStorage.setItem('tokenquest_missions', JSON.stringify(defaultMissions));
  
  console.log('Missioni predefinite inizializzate con successo!');
  return defaultMissions;
};

// Funzione per inizializzare le ricompense predefinite
export const resetRewards = () => {
  // Elimina tutte le ricompense esistenti rimuovendo la chiave dal localStorage
  localStorage.removeItem('tokenquest_rewards');
  
  // Crea le nuove ricompense predefinite
  const defaultRewards = [
    {
      id: generateUniqueId(),
      title: 'Sessione di gioco',
      description: 'Concediti del tempo per giocare ai tuoi videogiochi preferiti',
      energyCost: 4,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Film o serie tv',
      description: 'Guardati un film o un episodio della tua serie preferita',
      energyCost: 4,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Leggere',
      description: 'Dedica del tempo alla lettura di un libro che ti piace',
      energyCost: 3,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Attivitu00e0 creative',
      description: 'Dedica del tempo a un hobby creativo come disegno, pittura o musica',
      energyCost: 3,
      redeemed: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  // Salva le ricompense nel localStorage
  localStorage.setItem('tokenquest_rewards', JSON.stringify(defaultRewards));
  
  console.log('Ricompense predefinite inizializzate con successo!');
  return defaultRewards;
};

// Funzione per resettare tutti i dati dell'applicazione
export const resetAllData = () => {
  resetMissions();
  resetRewards();
  console.log('Tutti i dati sono stati resettati con successo!');
};

// Esporta le funzioni per poterle utilizzare in altri file
export default {
  resetMissions,
  resetRewards,
  resetAllData
};
