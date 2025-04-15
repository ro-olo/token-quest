import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { resetUserDatabase } from '../../services/mockAuthService';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userData, currentUser, logoutUser } = useUser();
  const location = useLocation();
  const isLoggedIn = !!currentUser;

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Gestisce il logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Errore durante il logout:', err);
    }
  };

  // Reset del database utente
  const handleResetDatabase = () => {
    try {
      resetUserDatabase();
      window.location.href = '/';
    } catch (err) {
      console.error('Errore durante il reset del database:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <NavLink to={isLoggedIn ? "/dashboard" : "/"} className="logo">
          <span className="logo-text">Token Quest</span>
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
          {isLoggedIn ? (
            <>  {/* Logged in navigation */}
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link">
                  <i className="fas fa-home"></i>Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/missions" className="nav-link">
                  <i className="fas fa-scroll"></i>Missioni
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/rewards" className="nav-link">
                  <i className="fas fa-gem"></i>Ricompense
                </NavLink>
              </li>
            </>
          ) : null}  {/* Don't show any nav-links for anonymous users */}
        </ul>

        <div className="navbar-right">
          {isLoggedIn && (
            <>  {/* Logged in status */}
              <NavLink to="/profile" className="user-greeting">
                <span>Salve, {userData?.displayName || 'Avventuriero'}!</span>
              </NavLink>
              
              {/* Energy Display */}
              <div className="energy-display">
                <i className="fas fa-bolt energy-icon"></i>
                <span className="energy-amount">{userData?.energy || 0}</span>
              </div>
            </>
          )}

          {/* Reset Database button */}
          <button 
            className="reset-button" 
            onClick={handleResetDatabase}
            title="Reset utenti per nuovo accesso"
          >
            <i className="fas fa-redo-alt"></i>
          </button>
          
          {/* Mobile Menu Toggle - always visible */}
          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <ul className="nav-links">
            {isLoggedIn ? (
              <>  {/* Logged in mobile navigation */}
                <li className="nav-item">
                  <NavLink to="/dashboard" className="nav-link">
                    <i className="fas fa-home"></i>Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/missions" className="nav-link">
                    <i className="fas fa-scroll"></i>Missioni
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/rewards" className="nav-link">
                    <i className="fas fa-gem"></i>Ricompense
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/profile" className="nav-link">
                    <i className="fas fa-user"></i>Profilo
                  </NavLink>
                </li>
              </>
            ) : (
              <>  {/* Non-logged in mobile navigation */}
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    <i className="fas fa-sign-in-alt"></i>Accedi
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    <i className="fas fa-user-plus"></i>Registrati
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
