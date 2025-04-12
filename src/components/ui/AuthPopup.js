import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const AuthPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState('options'); // options, login, or register
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerUser, loginUser, user } = useUser();

  useEffect(() => {
    // Show popup immediately - no delay
    setIsVisible(true);
  }, []);

  // Watch for user authentication status and redirect when authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to dashboard');
      // Small timeout to ensure all state updates are processed
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await loginUser(formData.email, formData.password);
      // No need to navigate here, the useEffect will handle it
    } catch (err) {
      setError(err.message || 'Errore durante l\'accesso. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.displayName.trim() || !formData.email.trim() || !formData.password) {
      setError('Tutti i campi sono obbligatori per iniziare l\'avventura');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Le Pergamene della Password non corrispondono');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La Chiave Arcana deve contenere almeno 6 simboli magici');
      return;
    }
    
    setLoading(true);
    
    try {
      await registerUser(formData.email, formData.password, formData.displayName);
      // No need to navigate here, the useEffect will handle it
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <div className="auth-form">
            <h2 className="auth-popup-title">Accedi al Tuo Regno</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="La tua email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="La tua password segreta"
                  required
                />
              </div>
              <div className="auth-popup-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setMode('options')}>
                  Indietro
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'register':
        return (
          <div className="auth-form">
            <h2 className="auth-popup-title">Inizia l'Avventura</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="displayName">Nome Avventuriero</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Come vuoi essere chiamato"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="La tua email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crea una password segreta"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Conferma Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Conferma la tua password"
                  required
                />
              </div>
              
              <div className="auth-popup-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registrazione in corso...' : 'Registrati'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setMode('options')}>
                  Indietro
                </button>
              </div>
            </form>
          </div>
        );
        
      default: // options
        return (
          <div className="auth-options">
            <h2 className="auth-popup-title">Token Quest</h2>
            <p className="auth-popup-description">
              Trasforma le tue attività quotidiane in un'avventura fantasy.
            </p>
            
            <div className="auth-popup-features">
              <div className="feature">
                <i className="fas fa-scroll"></i>
                <span>Missioni personalizzate</span>
              </div>
              <div className="feature">
                <i className="fas fa-gem"></i>
                <span>Ricompense motivanti</span>
              </div>
              <div className="feature">
                <i className="fas fa-bolt"></i>
                <span>Sistema Token ed Energia</span>
              </div>
            </div>
            
            <div className="auth-popup-actions">
              <button className="btn btn-primary" onClick={() => setMode('register')}>
                <i className="fas fa-user-plus"></i> Registrati
              </button>
              <button className="btn btn-secondary" onClick={() => setMode('login')}>
                <i className="fas fa-sign-in-alt"></i> Accedi
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`auth-popup-overlay ${isVisible ? 'visible' : ''}`} style={{zIndex: 9999}}>
      <div className="auth-popup-container">
        <div className="auth-popup-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
