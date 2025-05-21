import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: ''
  });
  const { userData, currentUser, logoutUser, error, loading } = useUser();
  const navigate = useNavigate();

  // Carica i dati quando la pagina viene montata
  useEffect(() => {
    if (currentUser && userData) {
      setFormData({
        displayName: userData?.displayName || ''
      });
    }
  }, [currentUser, userData]);

  // Reindirizza alla pagina di login se l'utente non è autenticato
  useEffect(() => {
    if (!currentUser && !loading) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      return;
    }

    // Questa funzionalità sarà implementata in futuro
    alert('La modifica del profilo sarà disponibile in una versione futura!');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Errore durante il logout:', err);
    }
  };

  // Only show loading screen during initial loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">Caricamento profilo...</div>
        </div>
      </div>
    );
  }
  
  // Ensure we have a default userData object even if it's not fully loaded yet
  const userDataSafe = userData || { 
    displayName: currentUser?.displayName || 'Avventuriero',
    energy: 0,
    completedMissions: 0,
    redeemedRewards: 0,
    totalEnergyEarned: 0
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h2 className="page-title">Il Tuo Profilo Avventuriero</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="profile-grid">
          {/* Pannello profilo */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Informazioni Personaggio</h3>
              {!isEditing && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit"></i> Modifica
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="displayName">Nome Eroe</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Il tuo nome da avventuriero"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Salvataggio...' : 'Salva'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ displayName: userDataSafe.displayName || '' });
                    }}
                  >
                    Annulla
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    {userDataSafe.displayName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                </div>
                <div className="profile-details">
                  <h4 className="profile-name">{userDataSafe.displayName || 'Avventuriero'}</h4>
                  <p className="profile-email">{userDataSafe.email || currentUser?.email || 'Email non disponibile'}</p>
                  <p className="profile-member-since">
                    Registrato il: {userDataSafe.registrationDate ? new Date(userDataSafe.registrationDate).toLocaleDateString('it-IT') : 'Data non disponibile'}
                  </p>
                  <div className="profile-actions">
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-danger"
                    >
                      <i className="fas fa-sign-out-alt"></i> Esci dal Regno
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Statistiche */}
          <div className="stats-card">
            <div className="card-header">
              <h3>Statistiche Avventura</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-scroll"></i>
                </div>
                <div className="stat-value">{userDataSafe.completedMissions || 0}</div>
                <div className="stat-label">Missioni Completate</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <div className="stat-value">{userDataSafe.redeemedRewards || 0}</div>
                <div className="stat-label">Ricompense Ottenute</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="stat-value">{userDataSafe.totalEnergyEarned || 0}</div>
                <div className="stat-label">Frammenti Totali Accumulati</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-fire"></i>
                </div>
                <div className="stat-value">{userDataSafe.energy || 0}</div>
                <div className="stat-label">Frammenti Disponibili</div>
              </div>
            </div>
          </div>
          
          {/* Carte Impresa */}
          <div className="achievements-card">
            <div className="card-header">
              <h3>Imprese Leggendarie</h3>
            </div>
            <div className="achievements-list">
              {/* Le imprese possono essere sbloccate in base alle azioni dell'utente */}
              <div className={`achievement-item ${(userDataSafe.completedMissions >= 5) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-award"></i>
                </div>
                <div className="achievement-content">
                  <h4>Avventuriero Provetto</h4>
                  <p>Completa 5 missioni</p>
                  {(userDataSafe.completedMissions >= 5) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>
              
              <div className={`achievement-item ${(userDataSafe.completedMissions >= 10) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="achievement-content">
                  <h4>Maestro delle Missioni</h4>
                  <p>Completa 10 missioni</p>
                  {(userDataSafe.completedMissions >= 10) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.completedMissions >= 20) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-dragon"></i>
                </div>
                <div className="achievement-content">
                  <h4>Cacciatore di Draghi</h4>
                  <p>Completa 20 missioni</p>
                  {(userDataSafe.completedMissions >= 20) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.completedMissions >= 50) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="achievement-content">
                  <h4>Leggenda del Reame</h4>
                  <p>Completa 50 missioni eroiche</p>
                  {(userDataSafe.completedMissions >= 50) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>
              
              <div className={`achievement-item ${(userDataSafe.redeemedRewards >= 10) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-gem"></i>
                </div>
                <div className="achievement-content">
                  <h4>Collezionista di Tesori</h4>
                  <p>Ottieni 10 ricompense</p>
                  {(userDataSafe.redeemedRewards >= 10) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.redeemedRewards >= 25) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-coins"></i>
                </div>
                <div className="achievement-content">
                  <h4>Maestro delle Ricompense</h4>
                  <p>Ottieni 25 ricompense magiche</p>
                  {(userDataSafe.redeemedRewards >= 25) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>
              
              <div className={`achievement-item ${(userDataSafe.totalEnergyEarned >= 100) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="achievement-content">
                  <h4>Custode dei Frammenti</h4>
                  <p>Accumula 100 frammenti di energia</p>
                  {(userDataSafe.totalEnergyEarned >= 100) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.totalEnergyEarned >= 250) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-fire"></i>
                </div>
                <div className="achievement-content">
                  <h4>Artefice dell'Energia</h4>
                  <p>Accumula 250 frammenti di energia</p>
                  {(userDataSafe.totalEnergyEarned >= 250) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.completedMissions >= 10 && userDataSafe.redeemedRewards >= 5) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-balance-scale"></i>
                </div>
                <div className="achievement-content">
                  <h4>Equilibrio Arcano</h4>
                  <p>Completa 10 missioni e ottieni 5 ricompense</p>
                  {(userDataSafe.completedMissions >= 10 && userDataSafe.redeemedRewards >= 5) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.energy >= 20) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-battery-full"></i>
                </div>
                <div className="achievement-content">
                  <h4>Accumulatore di Potere</h4>
                  <p>Possiedi 20 frammenti di energia contemporaneamente</p>
                  {(userDataSafe.energy >= 20) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item ${(userDataSafe.completedMissions >= 7 && userDataSafe.redeemedRewards === 0) ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">
                  <i className="fas fa-hand-holding"></i>
                </div>
                <div className="achievement-content">
                  <h4>Spirito Ascetico</h4>
                  <p>Completa 7 missioni senza reclamare alcuna ricompensa</p>
                  {(userDataSafe.completedMissions >= 7 && userDataSafe.redeemedRewards === 0) && <span className="achievement-date">Sbloccato</span>}
                </div>
              </div>

              <div className={`achievement-item locked`}>
                <div className="achievement-icon">
                  <i className="fas fa-question"></i>
                </div>
                <div className="achievement-content">
                  <h4>Impresa Misteriosa</h4>
                  <p>Questa impresa leggendaria è ancora avvolta nel mistero...</p>
                </div>
              </div>

              <div className={`achievement-item locked`}>
                <div className="achievement-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="achievement-content">
                  <h4>Avventuriero Supremo</h4>
                  <p>Sblocca tutte le altre imprese leggendarie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
