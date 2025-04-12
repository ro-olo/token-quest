import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Componenti
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Rewards from './pages/Rewards';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

// Contesto
import { UserProvider, useUser } from './context/UserContext';

// Utilità
import { initDefaultMissions, initDefaultRewards } from './utils/dataUtils';

// Componente AppContent per utilizzare useLocation
function AppContent() {
  const { user } = useUser(); // Changed from currentUser to user to match UserContext
  const location = useLocation();

  useEffect(() => {
    // Inizializza missioni e ricompense predefinite se non esistono
    initDefaultMissions();
    initDefaultRewards();
  }, []);

  // Mostra il footer solo nella dashboard
  const showFooter = user && location.pathname === '/dashboard';

  return (
    <div className="app">
      {/* Always show Navbar, but it will conditionally render content based on auth */}
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={!user ? <Welcome /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/missions" element={user ? <Missions /> : <Navigate to="/" />} />
          <Route path="/rewards" element={user ? <Rewards /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
