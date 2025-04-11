import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    characterClass: 'warrior' // Default class
  });
  const [error, setError] = useState('');
  const { registerUser, error: contextError, loading } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.displayName.trim() || !formData.email.trim() || !formData.password) {
      setError('Tutti i campi sono obbligatori');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri');
      return;
    }
    
    // Register the user
    try {
      await registerUser(formData.email, formData.password, formData.displayName);
      navigate('/dashboard');
    } catch (err) {
      // L'errore sarà gestito dal contesto
    }
  };

  const handleClassSelection = (classId) => {
    setFormData({
      ...formData,
      characterClass: classId
    });
  };

  const characterClasses = [
    {
      id: 'warrior',
      name: 'Guerriero',
      description: 'Specializzato in combattimento e disciplina personale.',
      icon: 'fa-sword'
    },
    {
      id: 'wizard',
      name: 'Mago',
      description: 'Maestro della conoscenza e dell\'apprendimento.',
      icon: 'fa-hat-wizard'
    },
    {
      id: 'ranger',
      name: 'Ranger',
      description: 'Abile nell\'esplorazione e nell\'equilibrio tra doveri e libertà.',
      icon: 'fa-bow-arrow'
    }
  ];

  return (
    <div className="register-page">
      <div className="register-form fade-in">
        <h2>Crea il tuo Account</h2>
        {(error || contextError) && <div className="alert alert-danger">{error || contextError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Nome Utente</label>
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
              placeholder="Crea una password sicura"
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
          <div className="form-group">
            <label>Classe del Personaggio</label>
            <div className="character-class-selection">
              {characterClasses.map((charClass) => (
                <label 
                  key={charClass.id}
                  className={`class-option ${formData.characterClass === charClass.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="characterClass"
                    value={charClass.id}
                    checked={formData.characterClass === charClass.id}
                    onChange={() => handleClassSelection(charClass.id)}
                    className="class-radio"
                  />
                  <div className="class-content">
                    <div className="class-icon">
                      <i className={`fas ${charClass.icon}`}></i>
                    </div>
                    <div className="class-details">
                      <h4>{charClass.name}</h4>
                      <p>{charClass.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrazione in corso...' : 'Inizia l\'Avventura'}
            </button>
            <p className="login-link">
              Hai già un account? <Link to="/login">Accedi</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
