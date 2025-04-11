// Script da copiare e incollare nella console del browser

// Funzione per generare un ID unico
function generateUniqueId() {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}

// Missioni predefinite
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

// Ricompense predefinite
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

// Resetta le missioni
function resetMissions() {
  localStorage.setItem('tokenquest_missions', JSON.stringify(defaultMissions));
  console.log('Missioni resettate con successo!');
}

// Resetta le ricompense
function resetRewards() {
  localStorage.setItem('tokenquest_rewards', JSON.stringify(defaultRewards));
  console.log('Ricompense resettate con successo!');
}

// Resetta tutto
function resetAll() {
  resetMissions();
  resetRewards();
  console.log('Tutti i dati sono stati resettati con successo!');
}

// Esegui il reset di tutto
resetAll();

// Ricarica la pagina per vedere le modifiche
alert('Dati resettati con successo! La pagina verrà ricaricata per applicare le modifiche.');
window.location.reload();
