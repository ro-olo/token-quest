import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthPopup from '../components/ui/AuthPopup';

const Welcome = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuthClose = () => {
    // User cannot close the auth popup if not logged in
    // This is a fallback in case the button is clicked somehow
    if (!user) {
      return;
    }
    
    // If user is logged in, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="welcome-page dark-bg">
      {/* Auth popup is always visible on the welcome page */}
      <AuthPopup onClose={handleAuthClose} />
    </div>
  );
};

export default Welcome;
