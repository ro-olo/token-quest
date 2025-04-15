import React, { useState, useEffect } from 'react';
import { getRewards, saveReward, redeemReward, resetRewards } from '../utils/dataUtils';
import { useUser } from '../context/UserContext';
import RewardModal from '../components/rewards/RewardModal';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const { user, removeEnergy } = useUser();
  
  // Filtri per le ricompense
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredRewards, setFilteredRewards] = useState([]);

  // Load rewards on component mount
  useEffect(() => {
    loadRewards();
  }, []);

  // Apply filter when rewards or activeFilter change
  useEffect(() => {
    filterRewards(activeFilter);
  }, [rewards, activeFilter]);

  // Load rewards from localStorage
  const loadRewards = () => {
    const loadedRewards = getRewards();
    setRewards(loadedRewards);
  };
  
  // Open modal to add new reward
  const handleAddReward = () => {
    setCurrentReward(null);
    setModalOpen(true);
  };
  
  // Open modal to edit existing reward
  const handleEditReward = (reward) => {
    setCurrentReward(reward);
    setModalOpen(true);
  };
  
  // Save reward from modal
  const handleSaveReward = (rewardData) => {
    const savedReward = saveReward(rewardData);
    
    if (currentReward) {
      // Update existing reward
      setRewards(prevRewards => prevRewards.map(
        r => r.id === savedReward.id ? savedReward : r
      ));
    } else {
      // Add new reward
      setRewards(prevRewards => [...prevRewards, savedReward]);
    }
    
    setModalOpen(false);
  };
  
  // Handle reward redemption
  const handleRedeemReward = async (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.redeemed) return;
    
    // Check if user has enough energy
    if ((user?.energy || 0) < (reward.energyCost || 0)) {
      alert('Non hai abbastanza Frammenti di Energia per riscattare questa ricompensa.');
      return;
    }
    
    try {
      // Remove energy from user (now using await since it's an async function)
      await removeEnergy(reward.energyCost || 0);
      
      // Update reward state
      const updatedReward = redeemReward(rewardId);
      
      if (updatedReward) {
        // Update rewards list
        setRewards(prevRewards => prevRewards.map(
          r => r.id === rewardId ? {...r, redeemed: true, redeemedAt: new Date().toISOString()} : r
        ));
        
        // Show success notification
        alert(`Ricompensa riscattata! Hai speso ${updatedReward.energyCost || 0} Frammenti di Energia.`);
      }
    } catch (err) {
      console.error('Errore nel riscatto della ricompensa:', err);
      alert(`Errore: ${err.message}`);
    }
  };
  
  // Filter rewards based on selected filter
  const filterRewards = (filter) => {
    let filtered;
    switch(filter) {
      case 'available':
        filtered = rewards.filter(reward => !reward.redeemed && user?.energy >= reward.energyCost);
        break;
      case 'redeemed':
        filtered = rewards.filter(reward => reward.redeemed);
        break;
      default:
        filtered = [...rewards];
    }
    
    // Sort rewards: first by redemption status, then by energy cost
    filtered.sort((a, b) => {
      // Redeemed rewards at the end
      if (a.redeemed !== b.redeemed) return a.redeemed ? 1 : -1;
      
      // Sort by energy cost (lowest first)
      return a.energyCost - b.energyCost;
    });
    
    setFilteredRewards(filtered);
  };

  // Reset rewards to default ones
  const handleResetRewards = () => {
    if (window.confirm('Sei sicuro di voler ripristinare le ricompense predefinite? Tutte le ricompense esistenti verranno eliminate.')) {
      const defaultRewards = resetRewards();
      setRewards(defaultRewards);
      // Ricarica la pagina per vedere le modifiche
      window.location.reload();
    }
  };
  
  return (
    <div className="rewards-page">
      <div className="rewards-container">
        <div className="rewards-header">
          <h2>Ricompense</h2>
          
          <div className="filters-container">
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
          
          {/* Pulsante di aggiunta visibile solo quando il filtro è 'all' */}
          {activeFilter === 'all' && (
            <button onClick={handleAddReward} className="add-reward-button">
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
        
        <div className="actions-row">
          <button onClick={handleResetRewards} className="btn btn-secondary">
            <i className="fas fa-sync-alt"></i> Ripristina Ricompense Predefinite
          </button>
        </div>
        
        {filteredRewards.length > 0 ? (
          <div className="missions-grid">
            {filteredRewards.map((reward, index) => (
              <div key={`reward-${reward.id}-${index}`} className={`reward-card ${reward.redeemed ? 'redeemed' : (user?.energy >= reward.energyCost ? '' : 'locked')}`}>
                <div className="reward-card-header">
                  <h4 className="reward-card-title">{reward.title}</h4>
                </div>
                
                <p className="reward-card-description">{reward.description}</p>
                
                <div className="reward-card-footer">
                  <div className="reward-left">
                    <div className="reward-card-cost">
                      <i className="fas fa-bolt"></i> {reward.energyCost || 0}
                    </div>
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
                      <div className="badge-success">Riscattata</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-gem empty-icon"></i>
            <p className="empty-text">Non hai ancora creato nessuna ricompensa</p>
            <button onClick={handleAddReward} className="btn btn-primary">
              Crea la tua prima ricompensa
            </button>
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
    </div>
  );
};

export default Rewards;
