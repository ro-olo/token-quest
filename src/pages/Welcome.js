import React, { useState, useEffect } from 'react';
import AuthPopup from '../components/ui/AuthPopup';

const Welcome = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    // Always show the popup for testing
    setShowAuthPopup(true);
    
    // Clear any previous popup visibility setting
    localStorage.removeItem('tokenquest_seen_popup');
  }, []);
  
  const handleClosePopup = () => {
    setShowAuthPopup(false);
    // Mark that the user has seen the popup
    localStorage.setItem('tokenquest_seen_popup', 'true');
  };

  return (
    <>
      {showAuthPopup && <AuthPopup onClose={handleClosePopup} />}
      <div className="welcome-page">
        <div className="welcome-content fade-in">
          <img src="/logo.png" alt="Token Quest" className="logo" />
          <h1>Token Quest</h1>
          <p>
            Trasforma le tue attività quotidiane in un'epica avventura fantasy. 
            Completa missioni, guadagna Frammenti di Energia e sblocca ricompense magiche.
          </p>
        </div>
      </div>
    </>
  );
};

export default Welcome;
