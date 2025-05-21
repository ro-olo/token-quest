import React, { useState, useEffect } from 'react';
import { 
  getRewards, 
  saveReward, 
  redeemReward, 
  resetRewards, 
  initDefaultData
} from '../utils/dataUtils';
import { syncRewards } from '../services/dataService';
import { useUser } from '../context/UserContext';
import RewardModal from '../components/rewards/RewardModal';

const Rewards = () => {
  // State management
  const [rewards, setRewards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredRewards, setFilteredRewards] = useState([]);
  
  const { user, removeEnergy } = useUser();

  // Load rewards on component mount and user change
  useEffect(() => {
    if (user?.uid) {
      loadRewards();
    }
  }, [user]);

  // Apply filters when rewards or activeFilter change
  useEffect(() => {
    filterRewards(activeFilter);
  }, [rewards, activeFilter]);

  const loadRewards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Forza la sincronizzazione per essere sicuri di ottenere i dati predefiniti
      await syncRewards(user.uid);
      let loadedRewards = await getRewards(user.uid);
      
      // Se ancora non ci sono ricompense, ricarichiamo con reset forzato
      if (!loadedRewards || loadedRewards.length === 0) {
        // Prima proviamo con la sincronizzazione forzata
        await syncRewards(user.uid, true);
        loadedRewards = await getRewards(user.uid);
        
        // Se ancora non funziona, usiamo initDefaultData come fallback
        if (!loadedRewards || loadedRewards.length === 0) {
          await initDefaultData(user.uid);
          loadedRewards = await getRewards(user.uid);
        }
      }
      setRewards(loadedRewards);
    } catch (err) {
      console.error("Error loading rewards:", err);
      setError("Failed to load rewards. Please try again.");
      setRewards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRewards = (filter) => {
    switch(filter) {
      case 'redeemed':
        setFilteredRewards(rewards.filter(r => r.redeemed));
        break;
      case 'available':
        setFilteredRewards(rewards.filter(r => !r.redeemed));
        break;
      default:
        setFilteredRewards(rewards);
    }
  };

  const handleAddReward = () => {
    setCurrentReward(null);
    setModalOpen(true);
  };

  const handleEditReward = (reward) => {
    setCurrentReward(reward);
    setModalOpen(true);
  };

  const handleSaveReward = async (reward) => {
    try {
      const savedReward = await saveReward(reward, user.uid);
      setRewards(prev => 
        reward.id 
          ? prev.map(r => r.id === reward.id ? savedReward : r) 
          : [...prev, savedReward]
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving reward:", error);
      alert("Failed to save reward");
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward || reward.redeemed) return;
      
      if ((user?.energy || 0) < reward.energyCost) {
        alert('Not enough energy to redeem this reward');
        return;
      }

      await redeemReward(rewardId, user.uid);
      removeEnergy(reward.energyCost);
      loadRewards();
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("Failed to redeem reward");
    }
  };

  const handleReset = async () => {
    try {
      const confirmReset = window.confirm('Reset all rewards to defaults?');
      if (!confirmReset) return;
      
      const success = await resetRewards(user.uid);
      if (success) {
        loadRewards();
        alert('Rewards reset successfully!');
      }
    } catch (error) {
      console.error("Error resetting rewards:", error);
      alert('Failed to reset rewards');
    }
  };

  return (
    <div className="rewards-page">
      {isLoading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i> Loading rewards...
        </div>
      ) : error ? (
        <div className="error-state">
          {error} <button onClick={loadRewards}>Retry</button>
        </div>
      ) : (
        <div className="rewards-container">
          <div className="rewards-header">
            <h2>Ricompense</h2>
            <div className="filter-container">
              <div 
                className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('all')}
              >
                Tutte
              </div>
              <div 
                className={`filter-item ${activeFilter === 'available' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('available')}
              >
                Disponibili
              </div>
              <div 
                className={`filter-item ${activeFilter === 'redeemed' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('redeemed')}
              >
                Riscattate
              </div>
            </div>
          </div>

          <div className="actions-row">
            <button onClick={handleReset} className="btn btn-secondary">
              <i className="fas fa-sync-alt"></i> Ripristina Ricompense Predefinite
            </button>
          </div>
          
          {filteredRewards.length > 0 ? (
            <div className="reward-grid">
              {filteredRewards.map(reward => (
                <div 
                  key={reward.id} 
                  className={`reward ${reward.redeemed ? 'redeemed' : (user?.energy >= reward.energyCost ? '' : 'locked')}`}
                >
                  <div className="reward-header">
                    <h4 className="reward-title">{reward.title}</h4>
                  </div>
                  <p className="reward-description">{reward.description}</p>
                  <div className="reward-footer">
                    <div className="reward-cost">
                      <i className="fas fa-bolt"></i> {reward.energyCost || 0}
                    </div>
                    <div className="reward-actions">
                      {!reward.redeemed ? (
                        <>
                          <button 
                            onClick={() => handleRedeemReward(reward.id)}
                            className="btn btn-create"
                            disabled={user?.energy < reward.energyCost}
                          >
                            {user?.energy >= reward.energyCost ? 'Riscatta' : 'Insufficiente'}
                          </button>
                          <button 
                            onClick={() => handleEditReward(reward)}
                            className="btn btn-secondary"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </>
                      ) : (
                        <div className="badge badge-success">Riscattata</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-gem empty-icon"></i>
              <p className="empty-text">Nessuna ricompensa trovata</p>
              <button onClick={handleAddReward} className="btn btn-primary">
                Crea la tua prima ricompensa
              </button>
            </div>
          )}

          {/* Pulsante di aggiunta visibile solo quando il filtro è 'all' */}
          {activeFilter === 'all' && (
            <button onClick={handleAddReward} className="add-reward-button">
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      )}

      {/* Reward Modal - for adding/editing rewards */}
      {modalOpen && (
        <RewardModal
          reward={currentReward}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveReward}
        />
      )}
    </div>
  );
};

export default Rewards;
//   // Load rewards from localStorage
//   const loadRewards = () => {
//     const loadedRewards = getRewards();
//     setRewards(loadedRewards);
//   };
  
//   // Open modal to add new reward
//   const handleAddReward = () => {
//     setCurrentReward(null);
//     setModalOpen(true);
//   };
  
//   // Open modal to edit existing reward
//   const handleEditReward = (reward) => {
//     setCurrentReward(reward);
//     setModalOpen(true);
//   };
  
//   // Save reward from modal
//   const handleSaveReward = (rewardData) => {
//     const savedReward = saveReward(rewardData);
    
//     if (currentReward) {
//       // Update existing reward
//       setRewards(prevRewards => prevRewards.map(
//         r => r.id === savedReward.id ? savedReward : r
//       ));
//     } else {
//       // Add new reward
//       setRewards(prevRewards => [...prevRewards, savedReward]);
//     }
    
//     setModalOpen(false);
//   };

// const handleReset = async () => {
//   try {
//     const success = await resetRewards(user?.uid);
//     if (success) {
//       loadRewards();
//       alert('Rewards reset successfully!');
//     }
//   } catch (error) {
//     console.error("Error resetting rewards:", error);
//     alert('Failed to reset rewards.');
//   }
// };
  
//   // Handle reward redemption
//   const handleRedeemReward = async (rewardId) => {
//     const reward = rewards.find(r => r.id === rewardId);
//     if (!reward || reward.redeemed) return;
    
//     // Check if user has enough energy
//     if ((user?.energy || 0) < (reward.energyCost || 0)) {
//       alert('Non hai abbastanza Frammenti di Energia per riscattare questa ricompensa.');
//       return;
//     }
    
//     try {
//       // Remove energy from user (now using await since it's an async function)
//       await removeEnergy(reward.energyCost || 0);
      
//       // Update reward state
//       const updatedReward = redeemReward(rewardId);
      
//       if (updatedReward) {
//         // Update rewards list
//         setRewards(prevRewards => prevRewards.map(
//           r => r.id === rewardId ? {...r, redeemed: true, redeemedAt: new Date().toISOString()} : r
//         ));
        
//         // Show success notification
//         alert(`Ricompensa riscattata! Hai speso ${updatedReward.energyCost || 0} Frammenti di Energia.`);
//       }
//     } catch (err) {
//       console.error('Errore nel riscatto della ricompensa:', err);
//       alert(`Errore: ${err.message}`);
//     }
//   };
  
//   // Filter rewards based on selected filter
//   const filterRewards = (filter) => {
//     let filtered;
//     switch(filter) {
//       case 'available':
//         filtered = rewards.filter(reward => !reward.redeemed && user?.energy >= reward.energyCost);
//         break;
//       case 'redeemed':
//         filtered = rewards.filter(reward => reward.redeemed);
//         break;
//       default:
//         filtered = [...rewards];
//     }
    
//     // Sort rewards: first by redemption status, then by energy cost
//     filtered.sort((a, b) => {
//       // Redeemed rewards at the end
//       if (a.redeemed !== b.redeemed) return a.redeemed ? 1 : -1;
      
//       // Sort by energy cost (lowest first)
//       return a.energyCost - b.energyCost;
//     });
    
//     setFilteredRewards(filtered);
//   };

//   // Reset rewards to default ones
//   const handleResetRewards = () => {
//     if (window.confirm('Sei sicuro di voler ripristinare le ricompense predefinite? Tutte le ricompense esistenti verranno eliminate.')) {
//       const defaultRewards = resetRewards();
//       setRewards(defaultRewards);
//       // Ricarica la pagina per vedere le modifiche
//       window.location.reload();
//     }
//   };
  
//   return (
//     <div className="rewards-page">
//       <div className="rewards-container">
//         <div className="rewards-header">
//           <h2>Ricompense</h2>
          
//           <div className="filters-container">
//             <div 
//               className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`} 
//               onClick={() => setActiveFilter('all')}
//             >
//               Tutte
//             </div>
//             <div 
//               className={`filter-item ${activeFilter === 'available' ? 'active' : ''}`} 
//               onClick={() => setActiveFilter('available')}
//             >
//               Disponibili
//             </div>
//             <div 
//               className={`filter-item ${activeFilter === 'redeemed' ? 'active' : ''}`} 
//               onClick={() => setActiveFilter('redeemed')}
//             >
//               Riscattate
//             </div>
//           </div>
          
//           {/* Pulsante di aggiunta visibile solo quando il filtro è 'all' */}
//           {activeFilter === 'all' && (
//             <button onClick={handleAddReward} className="add-reward-button">
//               <i className="fas fa-plus"></i>
//             </button>
//           )}
//         </div>
        
//         <div className="actions-row">
//           <button onClick={handleResetRewards} className="btn btn-secondary">
//             <i className="fas fa-sync-alt"></i> Ripristina Ricompense Predefinite
//           </button>
//         </div>
        
//         {filteredRewards.length > 0 ? (
//           <div className="rewards-grid">
//             {filteredRewards.map((reward, index) => (
//               <div key={`reward-${reward.id}-${index}`} className={`reward-card ${reward.redeemed ? 'redeemed' : (user?.energy >= reward.energyCost ? '' : 'locked')}`}>
//                 <div className="reward-card-header">
//                   <h4 className="reward-card-title">{reward.title}</h4>
//                 </div>
                
//                 <p className="reward-card-description">{reward.description}</p>
                
//                 <div className="reward-card-footer">
//                   <div className="reward-left">
//                     <div className="reward-card-cost">
//                       <i className="fas fa-bolt"></i> {reward.energyCost || 0}
//                     </div>
//                   </div>
                  
//                   <div className="reward-actions">
//                     {!reward.redeemed ? (
//                       <>
//                         <button 
//                           onClick={() => handleRedeemReward(reward.id)}
//                           className="btn btn-create"
//                           disabled={user?.energy < reward.energyCost}
//                         >
//                           {user?.energy >= reward.energyCost ? 'Riscatta' : 'Insufficiente'}
//                         </button>
//                         <button 
//                           onClick={() => handleEditReward(reward)}
//                           className="btn btn-secondary"
//                           style={{ marginLeft: '0.5rem' }}
//                         >
//                           <i className="fas fa-edit"></i>
//                         </button>
//                       </>
//                     ) : (
//                       <div className="badge-success">Riscattata</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <i className="fas fa-gem empty-icon"></i>
//             <p className="empty-text">Non hai ancora creato nessuna ricompensa</p>
//             <button onClick={handleAddReward} className="btn btn-primary">
//               Crea la tua prima ricompensa
//             </button>
//           </div>
//         )}
        
//         {/* Reward Modal - for adding/editing rewards */}
//         {modalOpen && (
//           <RewardModal 
//             reward={currentReward}
//             onClose={() => setModalOpen(false)}
//             onSave={handleSaveReward}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Rewards;
