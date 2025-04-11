/**
 * Sample data generator for Token Quest
 * This utility function populates the app with initial sample data
 */

import { saveMission, saveReward, saveJournalEntry } from './dataUtils';

export const populateSampleData = () => {
  // Check if data already exists
  const hasMissions = localStorage.getItem('tokenquest_missions');
  const hasRewards = localStorage.getItem('tokenquest_rewards');
  const hasJournal = localStorage.getItem('tokenquest_journal');
  
  // Only populate if no data exists
  if (!hasMissions && !hasRewards && !hasJournal) {
    // Sample missions
    const sampleMissions = [
      {
        title: 'Il Sentiero dello Studioso',
        description: 'Dedica 30 minuti allo studio di una nuova competenza o materia.',
        difficulty: 2,
        energyReward: 3,
        priority: 'medium',
        completed: false
      },
      {
        title: 'La Fortezza della Concentrazione',
        description: 'Completa un\'ora di lavoro profondo senza distrazioni.',
        difficulty: 3,
        energyReward: 5,
        priority: 'high',
        completed: false
      },
      {
        title: 'Incantesimo dell\'Ordine',
        description: 'Pulisci e organizza il tuo spazio di lavoro.',
        difficulty: 1,
        energyReward: 2,
        priority: 'low',
        completed: false
      },
      {
        title: 'La Danza del Viandante',
        description: 'Fai 30 minuti di attività fisica o una passeggiata rigenerante.',
        difficulty: 2,
        energyReward: 4,
        priority: 'medium',
        completed: false
      }
    ];
    
    // Sample rewards
    const sampleRewards = [
      {
        title: 'Pergamena di Svago',
        description: 'Concediti 30 minuti di serie TV o film preferito.',
        energyCost: 4,
        category: 'entertainment',
        icon: 'fa-tv',
        redeemed: false
      },
      {
        title: 'Pozione di Riposo',
        description: 'Prendi una pausa di 20 minuti per rilassarti.',
        energyCost: 3,
        category: 'rest',
        icon: 'fa-mug-hot',
        redeemed: false
      },
      {
        title: 'Amuleto del Gioco',
        description: 'Goditi un\'ora di videogiochi.',
        energyCost: 6,
        category: 'gaming',
        icon: 'fa-gamepad',
        redeemed: false
      },
      {
        title: 'Talismano del Dolce Peccato',
        description: 'Concediti un dolcetto o uno snack che ti piace.',
        energyCost: 2,
        category: 'food',
        icon: 'fa-cookie',
        redeemed: false
      }
    ];
    
    // Sample journal entry
    const sampleJournal = [
      {
        title: 'L\'inizio dell\'avventura',
        content: 'Oggi ho iniziato il mio viaggio con Token Quest. Ho deciso di utilizzare questo strumento perché voglio rendere le mie attività quotidiane più coinvolgenti e motivanti.\n\nHo completato due missioni oggi e mi sono sentito davvero soddisfatto. Il sistema di ricompense mi aiuta a bilanciare meglio il lavoro e il tempo libero.',
        mood: 'good'
      }
    ];
    
    // Save all sample data
    sampleMissions.forEach(mission => saveMission(mission));
    sampleRewards.forEach(reward => saveReward(reward));
    sampleJournal.forEach(entry => saveJournalEntry(entry));
    
    return true;
  }
  
  return false;
};
