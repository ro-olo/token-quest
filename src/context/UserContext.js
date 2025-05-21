import React, { createContext, useState, useContext, useEffect } from 'react';
// Import Firebase auth services
import { 
  registerUser as registerUserService, 
  loginUser as loginUserService, 
  logoutUser as logoutUserService, 
  updateUserData,
  getUserData,
  resetPassword
} from '../services/authService';
import { 
  syncMissions, 
  syncRewards, 
  updateMission,
  updateReward, 
  getUserStats,
  getMissions,
  getRewards,
  saveMission,
  saveReward,
  deleteMission,
  deleteReward
} from '../services/dataService';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ascolta cambiamenti nell'autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Ottieni i dati utente
          const userDataObj = await getUserData(user.uid);
          if (userDataObj) {
            setUserData(userDataObj);
          }
          
          // Sincronizza missioni e ricompense
          await syncMissions(user.uid);
          await syncRewards(user.uid);
        } catch (err) {
          console.error('Errore nel caricamento dei dati:', err);
          setError('Errore nel caricamento dei dati dell\'utente');
        }
      } else {
        // L'utente non è autenticato
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Registra un nuovo utente
  const registerUser = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      await registerUserService(email, password, displayName);
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Effettua il login
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await loginUserService(email, password);
    } catch (err) {
      setError(err.message || 'Errore durante il login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Effettua il logout
  const logoutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUserService();
      setCurrentUser(null);
      setUserData(null);
    } catch (err) {
      setError(err.message || 'Errore durante il logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Completa una missione
  const completeMission = async (mission) => {
    console.log('UserContext.completeMission chiamata con:', mission);
    if (!currentUser) {
      console.log('Nessun utente corrente');
      return;
    }
    
    try {
      // Aggiorna lo stato della missione in Firestore
      await updateMission(currentUser.uid, mission.id, true);
      
      // Aggiorna l'energia dell'utente
      if (userData) {
        const energyReward = mission.energyReward || 0;
        console.log('Aggiornamento energia:', userData.energy, '+', energyReward);
        const newEnergy = (userData.energy || 0) + energyReward;
        const newTotalEnergyEarned = (userData.totalEnergyEarned || 0) + energyReward;
        
        await updateUserData(currentUser.uid, { 
          energy: newEnergy,
          totalEnergyEarned: newTotalEnergyEarned,
          completedMissions: (userData.completedMissions || 0) + 1
        });
        
        // Aggiorna lo stato locale immediatamente per una migliore UX
        setUserData(prev => ({
          ...prev,
          energy: newEnergy,
          totalEnergyEarned: newTotalEnergyEarned,
          completedMissions: (prev.completedMissions || 0) + 1
        }));
        
        console.log('Energia aggiornata a:', newEnergy);
      }
      
      return true;
    } catch (err) {
      console.error('Errore durante il completamento della missione:', err);
      setError(err.message || 'Errore durante il completamento della missione');
      throw err;
    }
  };
  
  // Riscatta una ricompensa
  const redeemReward = async (reward) => {
    if (!currentUser) return;
    
    try {
      // Controlla se l'utente ha abbastanza energia
      if (userData.energy < reward.energyCost) {
        throw new Error('Energia insufficiente per riscattare questa ricompensa');
      }
      
      // Aggiorna lo stato della ricompensa in Firestore
      await updateReward(currentUser.uid, reward.id, true);
      
      // Aggiorna l'energia dell'utente
      const newEnergy = userData.energy - reward.energyCost;
      await updateUserData(currentUser.uid, { 
        energy: newEnergy,
        redeemedRewards: (userData.redeemedRewards || 0) + 1
      });
      
      // Aggiorna lo stato locale immediatamente
      setUserData(prev => ({
        ...prev,
        energy: newEnergy,
        redeemedRewards: (prev.redeemedRewards || 0) + 1
      }));
      
      return true;
    } catch (err) {
      console.error('Errore durante il riscatto della ricompensa:', err);
      setError(err.message || 'Errore durante il riscatto della ricompensa');
      throw err;
    }
  };
  
  // Aggiunge una nuova missione
  const addMission = async (missionData) => {
    if (!currentUser) return;
    
    try {
      const newMission = await saveMission(currentUser.uid, missionData);
      return newMission;
    } catch (err) {
      console.error('Errore durante l\'aggiunta della missione:', err);
      setError(err.message || 'Errore durante l\'aggiunta della missione');
      throw err;
    }
  };
  
  // Aggiunge una nuova ricompensa
  const addReward = async (rewardData) => {
    if (!currentUser) return;
    
    try {
      const newReward = await saveReward(currentUser.uid, rewardData);
      return newReward;
    } catch (err) {
      console.error('Errore durante l\'aggiunta della ricompensa:', err);
      setError(err.message || 'Errore durante l\'aggiunta della ricompensa');
      throw err;
    }
  };
  
  // Aggiunge energia all'utente
  const addEnergy = async (amount) => {
    console.log('addEnergy chiamata con:', amount);
    if (!currentUser || !userData) {
      console.log('addEnergy: nessun utente corrente o dati utente');
      return;
    }
    
    try {
      const newEnergy = (userData.energy || 0) + amount;
      const newTotalEnergyEarned = (userData.totalEnergyEarned || 0) + amount;
      
      console.log('addEnergy: aggiornamento energia da', userData.energy, 'a', newEnergy);
      
      await updateUserData(currentUser.uid, { 
        energy: newEnergy,
        totalEnergyEarned: newTotalEnergyEarned
      });
      
      // Update local state
      setUserData(prev => {
        console.log('addEnergy: stato precedente', prev, 'nuovo stato', {
          ...prev,
          energy: newEnergy,
          totalEnergyEarned: newTotalEnergyEarned
        });
        return {
          ...prev,
          energy: newEnergy,
          totalEnergyEarned: newTotalEnergyEarned
        };
      });
      
      return newEnergy;
    } catch (err) {
      console.error('Errore nell\'aggiunta di energia:', err);
      throw err;
    }
  };
  
  // Rimuove energia dall'utente
  const removeEnergy = async (amount) => {
    console.log('removeEnergy chiamata con:', amount);
    console.log('userData attuale:', userData);
    
    if (!currentUser) {
      console.error('removeEnergy: nessun utente corrente');
      throw new Error('Errore di autenticazione');
    }
    
    if (!userData) {
      console.error('removeEnergy: nessun dato utente disponibile');
      throw new Error('Dati utente non disponibili');
    }
    
    const currentEnergy = userData.energy || 0;
    console.log('Energia corrente:', currentEnergy, 'Richiesta:', amount);
    
    if (currentEnergy < amount) {
      console.error(`Energia insufficiente: ${currentEnergy} < ${amount}`);
      throw new Error(`Non hai abbastanza Frammenti di Energia (hai ${currentEnergy}, servono ${amount})`);
    }
    
    try {
      const newEnergy = currentEnergy - amount;
      console.log(`Aggiornamento energia da ${currentEnergy} a ${newEnergy}`);
      
      // Aggiorna i dati locali immediatamente per l'interfaccia utente
      setUserData(prev => {
        const updated = {
          ...prev,
          energy: newEnergy
        };
        console.log('Stato locale aggiornato:', updated);
        return updated;
      });
      
      // Poi aggiorna il database
      await updateUserData(currentUser.uid, { 
        energy: newEnergy
      });
      
      console.log('Energia rimossa con successo, nuovo valore:', newEnergy);
      return newEnergy;
    } catch (err) {
      console.error('Errore nella rimozione di energia:', err);
      throw err;
    }
  };
  
  const resetMissions = async () => {
    if (!currentUser) return;
    try {
      await syncMissions(currentUser.uid, true);
    } catch (err) {
      console.error('Errore nel reset delle missioni:', err);
      throw err;
    }
  };
  
  const resetRewards = async () => {
    if (!currentUser) return;
    try {
      await syncRewards(currentUser.uid, true);
    } catch (err) {
      console.error('Errore nel reset delle ricompense:', err);
      throw err;
    }
  };
  
  const value = {
    user: currentUser, // Add alias to maintain consistency with our components
    currentUser,
    userData,
    loading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    completeMission,
    redeemReward,
    addEnergy,
    removeEnergy,
    resetMissions,
    resetRewards,
    addMission,
    addReward
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
