// Script per inizializzare le missioni predefinite

// Funzione per generare un ID unico
const generateUniqueId = () => {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Funzione per inizializzare le missioni predefinite
const initializeMissions = () => {
  // Elimina tutte le missioni esistenti rimuovendo la chiave dal localStorage
  localStorage.removeItem('tokenquest_missions');
  
  // Crea le nuove missioni predefinite
  const defaultMissions = [
    {
      id: generateUniqueId(),
      title: 'Affrontare la Battaglia',
      description: 'Completa una giornata lavorativa',
      energyReward: 8,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: "Allenamento dell'Eroe",
      description: 'Fai 30 minuti di esercizio fisico',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Consultare i Tomi',
      description: 'Dedica mezz\'ora allo studio o alla lettura',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Purificare le Scodelle',
      description: 'Lava i piatti',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Preparare il Banchetto',
      description: 'Prepara un pasto completo',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Rituale di Purificazione',
      description: 'Completa un ciclo di lavaggio e stendi i panni',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Incantesimo di Detersione',
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

// Esegui la funzione
initializeMissions();

// Esporta la funzione per poterla utilizzare in altri file
//export default initializeMissions;
// In src/utils/initMissions.js
// Esporta le missioni predefinite per essere utilizzate in altri file
export const defaultMissions = [
  {
    title: 'Affrontare la Battaglia',
    description: 'Completa una giornata lavorativa',
    energyReward: 8,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: "Allenamento dell'Eroe",
    description: 'Fai 30 minuti di esercizio fisico',
    energyReward: 2,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Consultare i Tomi',
    description: 'Dedica mezz\'ora allo studio o alla lettura',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Purificare le Scodelle',
    description: 'Lava i piatti',
    energyReward: 2,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Preparare il Banchetto',
    description: 'Prepara un pasto completo',
    energyReward: 2,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Rituale di Purificazione',
    description: 'Completa un ciclo di lavaggio e stendi i panni',
    energyReward: 3,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Incantesimo di Detersione',
    description: 'Dedica un quarto d\'ora a pulire o riordinare casa',
    energyReward: 1,
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Esporta le ricompense predefinite
export const defaultRewards = [
  {
    title: 'Riposo dell\'Eroe',
    description: 'Concediti 30 minuti di pieno relax',
    energyCost: 2,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Meditazione Astrale',
    description: 'Concediti un episodio della tua serie preferita',
    energyCost: 3,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Visione dell\'Oracolo',
    description: 'Guarda un film a tua scelta',
    energyCost: 6,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Pausa del Viaggiatore',
    description: 'Prenditi 10 minuti di pausa extra',
    energyCost: 1,
    redeemed: false,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Festa al Villaggio',
    description: 'Organizza un\'uscita con gli amici',
    energyCost: 10,
    redeemed: false,
    createdAt: new Date().toISOString()
  }
];
