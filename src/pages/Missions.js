import React, { useState, useEffect } from 'react';
import { 
  getMissions, 
  completeMission, 
  saveMission,
  initDefaultData
} from '../utils/dataUtils';
import { syncMissions } from '../services/dataService';
import { useUser } from '../context/UserContext';
import MissionModal from '../components/missions/MissionModal';

const Missions = () => {
  // State management
  const [missions, setMissions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredMissions, setFilteredMissions] = useState([]);
  
  const { user, addEnergy } = useUser();

  // Load missions on component mount and user change
  useEffect(() => {
    if (user?.uid) {
      loadMissions();
    }
  }, [user]);

  // Apply filters when missions or activeFilter change
  useEffect(() => {
    filterMissions(activeFilter);
  }, [missions, activeFilter]);

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Forza la sincronizzazione per essere sicuri di ottenere i dati predefiniti
      await syncMissions(user.uid);
      const loadedMissions = await getMissions(user.uid);
      
      // Se ancora non ci sono missioni, ricarichiamo con reset forzato
      if (!loadedMissions || loadedMissions.length === 0) {
        await syncMissions(user.uid, true);
        const resetMissions = await getMissions(user.uid);
        setMissions(resetMissions);
        return;
      }
      setMissions(loadedMissions);
      
      // Initialize default missions if none exist
      if (!loadedMissions.length) {
        await initDefaultData(user.uid);
        loadMissions(); // Reload after initialization
      }
    } catch (err) {
      console.error("Error loading missions:", err);
      setError("Failed to load missions. Please try again.");
      setMissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMissions = (filter) => {
    switch(filter) {
      case 'completed':
        setFilteredMissions(missions.filter(m => m.completed));
        break;
      case 'active':
        setFilteredMissions(missions.filter(m => !m.completed));
        break;
      default:
        setFilteredMissions(missions);
    }
  };

  const handleAddMission = () => {
    setCurrentMission(null);
    setModalOpen(true);
  };

  const handleEditMission = (mission) => {
    setCurrentMission(mission);
    setModalOpen(true);
  };

  const handleSaveMission = async (mission) => {
    try {
      const savedMission = await saveMission(mission, user.uid);
      setMissions(prev => 
        mission.id 
          ? prev.map(m => m.id === mission.id ? savedMission : m) 
          : [...prev, savedMission]
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving mission:", error);
      alert("Failed to save mission");
    }
  };

  const handleCompleteMission = async (missionId) => {
    try {
      const mission = missions.find(m => m.id === missionId);
      if (!mission || mission.completed) return;

      const completedMission = await completeMission(missionId, user.uid);
      if (completedMission?.energyReward) {
        addEnergy(completedMission.energyReward);
      }
      loadMissions();
    } catch (error) {
      console.error("Error completing mission:", error);
      alert("Failed to complete mission");
    }
  };

  const handleReset = async () => {
    try {
      const confirmReset = window.confirm('Reset all missions to defaults?');
      if (!confirmReset) return;
      await initDefaultData(user.uid);
      loadMissions();
      alert('Missions reset successfully!');
    } catch (error) {
      console.error("Error resetting missions:", error);
      alert('Failed to reset missions');
    }
  };

  return (
    <div className="missions-page">
      {isLoading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i> Loading missions...
        </div>
      ) : error ? (
        <div className="error-state">
          {error} <button onClick={loadMissions}>Retry</button>
        </div>
      ) : (
        <div className="missions-container">
          <div className="missions-header">
            <h2>Missioni</h2>
            <div className="filter-container">
              <div 
                className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('all')}
              >
                Tutte
              </div>
              <div 
                className={`filter-item ${activeFilter === 'active' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('active')}
              >
                In Sospeso
              </div>
              <div 
                className={`filter-item ${activeFilter === 'completed' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('completed')}
              >
                Completate
              </div>
            </div>
          </div>

          {filteredMissions.length > 0 ? (
            <div className="mission-grid">
              {filteredMissions.map(mission => (
                <div 
                  key={mission.id} 
                  className={`mission ${mission.completed ? 'completed' : ''}`}
                >
                  <div className="mission-header">
                    <h4 className="mission-title">{mission.title}</h4>
                  </div>
                  <p className="mission-description">{mission.description}</p>
                  <div className="mission-footer">
                    <div className="mission-reward">
                      <i className="fas fa-bolt"></i> {mission.energyReward || 1}
                    </div>
                    <div className="mission-actions">
                      {!mission.completed ? (
                        <>
                          <button 
                            onClick={() => handleCompleteMission(mission.id)}
                            className="btn btn-create"
                          >
                            Completa
                          </button>
                          <button 
                            onClick={() => handleEditMission(mission)}
                            className="btn btn-secondary"
                            style={{ marginLeft: '0.5rem' }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </>
                      ) : (
                        <div className="badge badge-success">Completata</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-scroll empty-icon"></i>
              <p className="empty-text">Nessuna missione trovata</p>
              <button onClick={handleAddMission} className="btn btn-primary">
                Crea la tua prima missione
              </button>
            </div>
          )}

          <div className="actions-row">
            <button onClick={handleReset} className="btn btn-secondary">
              <i className="fas fa-sync-alt"></i> Ripristina Missioni Predefinite
            </button>
          </div>

          {/* Pulsante di aggiunta visibile solo quando il filtro è 'all' */}
          {activeFilter === 'all' && (
            <button onClick={handleAddMission} className="add-mission-button">
              <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      )}

      {/* Mission Modal - for adding/editing missions */}
      {modalOpen && (
        <MissionModal
          mission={currentMission}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveMission}
        />
      )}
    </div>
  );
};

export default Missions;

// import React, { useState, useEffect } from 'react';
// import { 
//   getMissions, 
//   saveMission, 
//   completeMission,
//   initDefaultData
// } from '../utils/dataUtils';
// import { useUser } from '../context/UserContext';
// import MissionModal from '../components/missions/MissionModal';


// const Missions = () => {
//   const [missions, setMissions] = useState([]);
//   const [filteredMissions, setFilteredMissions] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentMission, setCurrentMission] = useState(null);
//   const { addEnergy, completeMission } = useUser();
  
//   // Load missions on component mount
//   useEffect(() => {
//     loadMissions();
//   }, []);
  
//   // Apply filter when missions or activeFilter change
//   useEffect(() => {
//     filterMissions(activeFilter);
//   }, [missions, activeFilter]);

//   const loadMissions = async () => {
//     try {
//       const loadedMissions = await getMissions(user.uid);
//       setMissions(loadedMissions);
//       await initDefaultData(user.uid); // Ensure defaults exist
//     } catch (error) {
//       console.error("Error loading missions:", error);
//     }
//   };
  
//   // Filter missions based on selected filter
//   const filterMissions = (filter) => {
//     let filtered;
//     switch(filter) {
//       case 'pending':
//         filtered = missions.filter(mission => !mission.completed);
//         break;
//       case 'completed':
//         filtered = missions.filter(mission => mission.completed);
//         break;
//       default:
//         filtered = [...missions];
//     }
    
//     // Sort missions: first by completion status, then by date
//     filtered.sort((a, b) => {
//       // Completed missions at the end
//       if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
//       // Sort by creation date (newest first)
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
    
//     setFilteredMissions(filtered);
//   };
  
//   // // Handle mission completion
//   // const handleCompleteMission = async (missionId) => {
//   //   console.log('handleCompleteMission chiamato con ID:', missionId);
//   //   const mission = missions.find(m => m.id === missionId);
//   //   if (!mission || mission.completed) {
//   //     console.log('Missione non trovata o già completata');
//   //     return;
//   //   }
    
//   //   console.log('Missione trovata:', mission);
    
//   //   try {
//   //     // Usa la funzione completeMission dal UserContext
//   //     const updatedMission = await completeMission(mission);
//   //     console.log('Missione completata con successo:', updatedMission);
      
//   //     // Mostra un messaggio all'utente
//   //     alert(`Missione completata! Hai guadagnato ${mission.energyReward || 1} Frammenti di Energia.`);
      
//   //     // Aggiorna la lista missioni localmente
//   //     setMissions(prevMissions => prevMissions.map(
//   //       m => m.id === missionId ? {...m, completed: true, completedAt: new Date().toISOString()} : m
//   //     ));
//   //   } catch (err) {
//   //     console.error('Errore nel completare la missione:', err);
//   //     alert('Si è verificato un errore nel completare la missione. Controlla la console per dettagli.');
//   //   }
//   // };
  
//   // Open modal to add new mission
//   const handleAddMission = () => {
//     setCurrentMission(null);
//     setModalOpen(true);
//   };
  
//   // Open modal to edit existing mission
//   const handleEditMission = (mission) => {
//     setCurrentMission(mission);
//     setModalOpen(true);
//   };
  
//   // Save mission from modal
//   const handleSaveMission = (missionData) => {
//     const savedMission = saveMission(missionData);
    
//     if (currentMission) {
//       // Update existing mission
//       setMissions(prevMissions => prevMissions.map(
//         m => m.id === savedMission.id ? savedMission : m
//       ));
//     } else {
//       // Add new mission
//       setMissions(prevMissions => [...prevMissions, savedMission]);
//     }
    
//     setModalOpen(false);
//   };

//   // In src/pages/Missions.js

// const handleCompleteMission = async (missionId) => {
//   try {
//     const completedMission = await completeMission(missionId, user.uid);
//     if (completedMission?.energyReward) {
//       addEnergy(completedMission.energyReward);
//     }
//     loadMissions();
//   } catch (error) {
//     console.error("Error completing mission:", error);
//   }
// };
  
//   // Reset missions to default ones
//   const handleResetMissions = () => {
//     if (window.confirm('Sei sicuro di voler ripristinare le missioni predefinite? Tutte le missioni esistenti verranno eliminate.')) {
//       const defaultMissions = initializeMissions();
//       setMissions(defaultMissions);
//       // Ricarica la pagina per vedere le modifiche
//       window.location.reload();
//     }
//   };
  
//   return (
//     <div className="missions-page">
//       <div className="missions-container">
//         <div className="missions-header">
//           <h2>Missioni</h2>
          
//           <div className="filter-container">
//             <div 
//               className={`filter-item ${activeFilter === 'all' ? 'active' : ''}`} 
//               onClick={() => setActiveFilter('all')}
//             >
//               Tutte
//             </div>
//             <div 
//               className={`filter-item ${activeFilter === 'pending' ? 'active' : ''}`} 
//               onClick={() => setActiveFilter('pending')}
//             >
//               In Sospeso
//             </div>
//             <div 
//               className={`filter-item ${activeFilter === 'completed' ? 'active' : ''}`} 
//               onClick={() => setActiveFilter('completed')}
//             >
//               Completate
//             </div>
//           </div>
//         </div>
        
//         <div className="actions-row">
//           <button onClick={handleResetMissions} className="btn btn-secondary">
//             <i className="fas fa-sync-alt"></i> Ripristina Missioni Predefinite
//           </button>
//         </div>
        
//         {filteredMissions.length > 0 ? (
//           <div className="mission-grid">
//             {filteredMissions.map(mission => (
//               <div 
//                 key={mission.id} 
//                 className={`mission ${mission.completed ? 'completed' : ''}`}
//               >
//                 <div className="mission-header">
//                   <h4 className="mission-title">{mission.title}</h4>
//                 </div>
                
//                 <p className="mission-description">{mission.description}</p>
                
//                 <div className="mission-footer">
//                   <div className="mission-reward">
//                     <i className="fas fa-bolt"></i> {mission.energyReward || 1}
//                   </div>
                  
//                   <div className="mission-actions">
//                     {!mission.completed ? (
//                       <>
//                         <button 
//                           onClick={() => handleCompleteMission(mission.id)}
//                           className="btn btn-create"
//                         >
//                           Completa
//                         </button>
//                         <button 
//                           onClick={() => handleEditMission(mission)}
//                           className="btn btn-secondary"
//                           style={{ marginLeft: '0.5rem' }}
//                         >
//                           <i className="fas fa-edit"></i>
//                         </button>
//                       </>
//                     ) : (
//                       <div className="badge badge-success">Completata</div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <i className="fas fa-scroll empty-icon"></i>
//             <p className="empty-text">Nessuna missione trovata</p>
//             <button onClick={handleAddMission} className="btn btn-primary">
//               Crea la tua prima missione
//             </button>
//           </div>
//         )}
        
//         {/* Pulsante di aggiunta visibile solo quando il filtro è 'all' */}
//         {activeFilter === 'all' && (
//           <button onClick={handleAddMission} className="add-mission-button">
//             <i className="fas fa-plus"></i>
//           </button>
//         )}
//       </div>
      
//       {/* Mission Modal - for adding/editing missions */}
//       {modalOpen && (
//         <MissionModal 
//           mission={currentMission}
//           onClose={() => setModalOpen(false)}
//           onSave={handleSaveMission}
//         />
//       )}
//     </div>
//   );
// };

// export default Missions;
