import React, { createContext, useState, useContext, useEffect } from 'react';
// Import mock auth services
import { 
  registerUser as registerUserService, 
  loginUser as loginUserService, 
  logoutUser as logoutUserService, 
  updateUserData,
  getUserData,
  setupAuthObserver
} from '../services/mockAuthService';
import { syncMissions, syncRewards, updateMission, updateReward, getUserStats } from '../services/mockDataService';

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
    const unsubscribe = setupAuthObserver(async (user) => {
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
    
    return unsubscribe;
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
      const updatedMission = { ...mission, completed: true };
      await updateMission(currentUser.uid, updatedMission);
      
      // Update user energy
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
        
        // Update local state immediately for better UX
        setUserData(prev => ({
          ...prev,
          energy: newEnergy,
          totalEnergyEarned: newTotalEnergyEarned,
          completedMissions: (prev.completedMissions || 0) + 1
        }));
        
        console.log('Energia aggiornata a:', newEnergy);
      }
      
      return updatedMission;
    } catch (err) {
      console.error('Errore nel completamento della missione:', err);
      throw err;
    }
  };
  
  // Riscatta una ricompensa
  const redeemReward = async (reward) => {
    if (!currentUser) return;
    
    try {
      // Check if user has enough energy
      if ((userData?.energy || 0) < (reward.energyCost || 0)) {
        throw new Error('Non hai abbastanza energia per riscattare questa ricompensa');
      }
      
      const updatedReward = { ...reward, redeemed: true };
      await updateReward(currentUser.uid, updatedReward);
      
      // Update user energy
      if (userData) {
        const newEnergy = (userData.energy || 0) - (reward.energyCost || 0);
        await updateUserData(currentUser.uid, { 
          energy: newEnergy,
          redeemedRewards: (userData.redeemedRewards || 0) + 1
        });
      }
      
      return updatedReward;
    } catch (err) {
      console.error('Errore nel riscatto della ricompensa:', err);
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
    resetRewards
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
