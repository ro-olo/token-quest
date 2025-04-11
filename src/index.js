import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import { populateSampleData } from './utils/sampleData';

// Funzione per generare un ID unico
function generateUniqueId() {
  return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
}

// Forza il reset dei dati all'avvio dell'applicazione
function forceResetData() {
  // Dati delle missioni con titoli fantasy
  const missionsData = [
    {
      id: generateUniqueId(),
      title: 'Affrontare la Battaglia del Giorno',
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
      title: 'Consultare gli Antichi Tomi',
      description: 'Dedica mezz\'ora allo studio o alla lettura',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Purificare gli Strumenti del Banchetto',
      description: 'Lava i piatti dopo un pasto',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Preparare il Banchetto del Viaggiatore',
      description: 'Prepara un pasto completo',
      energyReward: 2,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Rituale di Purificazione delle Vesti',
      description: 'Completa un ciclo di lavaggio e stendi i panni',
      energyReward: 3,
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Difendere il Reame dalla Polvere',
      description: 'Dedica un quarto d\'ora a pulire o riordinare casa',
      energyReward: 1,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Dati delle ricompense con titoli fantasy
  const rewardsData = [
    {
      id: generateUniqueId(),
      title: 'Avventura Virtuale nel Regno Digitale',
      description: 'Concediti del tempo per giocare ai tuoi videogiochi preferiti',
      energyCost: 4,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Visione delle Leggende Moderne',
      description: 'Guardati un film o un episodio della tua serie preferita',
      energyCost: 4,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Leggere il Tomo Antico',
      description: 'Dedica del tempo alla lettura di un libro che ti piace',
      energyCost: 3,
      redeemed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: generateUniqueId(),
      title: 'Creare Arte Arcana',
      description: 'Dedica del tempo a un hobby creativo come disegno, pittura o musica',
      energyCost: 3,
      redeemed: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Salva forzatamente i dati nel localStorage
  localStorage.setItem('tokenquest_missions', JSON.stringify(missionsData));
  localStorage.setItem('tokenquest_rewards', JSON.stringify(rewardsData));

  console.log('Token Quest: Database resettato con i titoli fantasy');
}

// Esegui il reset dei dati
forceResetData();

// Populate sample data on first run
populateSampleData();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
