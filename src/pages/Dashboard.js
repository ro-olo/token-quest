import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getMissions, getRewards, completeMission, redeemReward } from '../utils/dataUtils';
import Popup from '../components/ui/Popup';

const Dashboard = () => {
  const { user, addEnergy, removeEnergy } = useUser();
  const [missions, setMissions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'default'
  });

  // Load dashboard data
  const loadData = () => {
    const loadedMissions = getMissions();
    const loadedRewards = getRewards();
    
    // Sort missions: pending first, then by priority
    const sortedMissions = [...loadedMissions].sort((a, b) => {
      // Completed missions at the end
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      // Sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    setMissions(sortedMissions);
    
    // Get available rewards sorted by energy cost
    const sortedRewards = [...loadedRewards]
      .filter(r => !r.redeemed)
      .sort((a, b) => a.energyCost - b.energyCost);
    
    setRewards(sortedRewards);
  };

  useEffect(() => {
    // Carica i dati all'inizio
    loadData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show a popup notification
  const showPopup = (title, message, type = 'default') => {
    setPopup({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Close popup
  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // Handle mission completion directly from dashboard
  const handleCompleteMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;
    
    // Update mission state
    const updatedMission = completeMission(missionId);
    
    if (updatedMission) {
      // Add energy reward to user
      addEnergy(updatedMission.energyReward || 1);
      
      // Update missions list and reload data
      loadData();
      
      // Show success popup
      showPopup(
        'Missione Completata!', 
        `Hai guadagnato ${updatedMission.energyReward || 1} Frammenti di Energia.`,
        'success'
      );
    }
  };

  // Handle reward redemption directly from dashboard
  const handleRedeemReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.redeemed) return;
    
    // Check if user has enough energy
    if ((user?.energy || 0) < (reward.energyCost || 0)) {
      showPopup(
        'Energia Insufficiente', 
        'Non hai abbastanza Frammenti di Energia per riscattare questa ricompensa.',
        'danger'
      );
      return;
    }
    
    // Remove energy from user
    const success = removeEnergy(reward.energyCost || 0);
    
    if (success) {
      // Update reward state
      const updatedReward = redeemReward(rewardId);
      
      if (updatedReward) {
        // Reload data
        loadData();
        
        // Show success popup
        showPopup(
          'Ricompensa Riscattata!', 
          `Hai speso ${updatedReward.energyCost || 0} Frammenti di Energia.`,
          'success'
        );
      }
    }
  };

  // Mission carousel navigation - una card alla volta
  const nextMission = () => {
    if (currentMissionIndex < missions.length) {
      setCurrentMissionIndex(currentMissionIndex + 1);
    }
  };

  const prevMission = () => {
    if (currentMissionIndex > 0) {
      setCurrentMissionIndex(currentMissionIndex - 1);
    }
  };

  // Reward carousel navigation - una card alla volta
  const nextReward = () => {
    if (currentRewardIndex < rewards.length) {
      setCurrentRewardIndex(currentRewardIndex + 1);
    }
  };

  const prevReward = () => {
    if (currentRewardIndex > 0) {
      setCurrentRewardIndex(currentRewardIndex - 1);
    }
  };

  return (
    <div className="page-container dashboard-page">
      <Popup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={closePopup}
      />
      
      <div className="container dashboard-container">
        
        {/* Horizontal Missions Carousel */}
        <div className="dashboard-section missions-section" style={{padding: '2rem 0'}}>
          <div className="section-header">
            <h3 className="section-title">Le tue Missioni</h3>
            <Link to="/missions" className="section-link">Vedi tutte <i className="fas fa-arrow-right"></i></Link>
          </div>
          
          {missions.length > 0 ? (
            <div className="horizontal-carousel">
              <button 
                onClick={prevMission}
                className="carousel-button prev"
                disabled={currentMissionIndex === 0}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="horizontal-carousel-container">
                <div 
                  className="horizontal-carousel-items" 
                  style={{ transform: `translateX(calc(-${currentMissionIndex * 33.333}% - ${currentMissionIndex}rem))` }}
                >
                  {missions.map((mission, index) => (
                    <div key={`mission-${mission.id}-${index}`} className={`mission-card ${mission.completed ? 'completed' : ''}`}>
                      <div className="mission-card-header">
                        <h4 className="mission-card-title">{mission.title}</h4>
                      </div>
                      
                      <p className="mission-card-description">{mission.description}</p>
                      
                      <div className="mission-card-footer">
                        <div className="mission-energy">
                          <i className="fas fa-bolt"></i> {mission.energyReward || 1}
                        </div>
                        
                        {!mission.completed ? (
                          <button 
                            onClick={() => handleCompleteMission(mission.id)}
                            className="btn btn-create"
                          >
                            Completa
                          </button>
                        ) : (
                          <div className="badge-success">Completata</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Card per aggiungere una nuova missione */}
                  <div className="mission-card add-card">
                    <div className="add-card-content">
                      <i className="fas fa-plus-circle add-icon"></i>
                      <h4 className="add-card-title">Aggiungi una Missione</h4>
                      <Link to="/missions/new" className="btn btn-create">Crea</Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={nextMission}
                className="carousel-button next"
                disabled={currentMissionIndex >= missions.length}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>Non hai ancora creato nessuna missione.</p>
              <Link to="/missions" className="btn btn-create">Crea la tua prima missione</Link>
            </div>
          )}
        </div>
        
        <div className="fantasy-separator"></div>
        
        {/* Horizontal Rewards Carousel */}
        <div className="dashboard-section rewards-section" style={{padding: '2rem 0'}}>
          <div className="section-header">
            <h3 className="section-title">Ricompense Disponibili</h3>
            <Link to="/rewards" className="section-link">Vedi tutte <i className="fas fa-arrow-right"></i></Link>
          </div>
          
          {rewards.length > 0 ? (
            <div className="horizontal-carousel">
              <button 
                onClick={prevReward}
                className="carousel-button prev"
                disabled={currentRewardIndex === 0}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="horizontal-carousel-container">
                <div 
                  className="horizontal-carousel-items" 
                  style={{ transform: `translateX(calc(-${currentRewardIndex * 33.333}% - ${currentRewardIndex}rem))` }}
                >
                  {rewards.map((reward, index) => (
                    <div key={`reward-${reward.id}-${index}`} className={`reward-card ${user?.energy >= reward.energyCost ? '' : 'locked'}`}>
                      <div className="reward-card-header">
                        <h4 className="reward-card-title">{reward.title}</h4>
                      </div>
                      
                      <p className="reward-card-description">{reward.description}</p>
                      
                      <div className="reward-card-footer">
                        <div className="reward-card-cost">
                          <i className="fas fa-bolt"></i> {reward.energyCost}
                        </div>
                        <div className="button-container">
                          <button 
                            onClick={() => handleRedeemReward(reward.id)}
                            className="btn btn-create"
                            disabled={user?.energy < reward.energyCost}
                          >
                            {user?.energy >= reward.energyCost ? 'Riscatta' : 'Energia insufficiente'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Card per aggiungere una nuova ricompensa */}
                  <div className="reward-card add-card">
                    <div className="add-card-content">
                      <i className="fas fa-plus-circle add-icon"></i>
                      <h4 className="add-card-title">Aggiungi una Ricompensa</h4>
                      <Link to="/rewards/new" className="btn btn-create">Crea</Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={nextReward}
                className="carousel-button next"
                disabled={currentRewardIndex >= rewards.length}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>Non hai ancora creato nessuna ricompensa.</p>
              <Link to="/rewards" className="btn btn-create">Crea la tua prima ricompensa</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
