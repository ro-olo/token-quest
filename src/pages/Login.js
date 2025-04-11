import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { loginUser, error: contextError, loading } = useUser();
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
    if (!formData.email.trim() || !formData.password) {
      setError('Inserisci email e password');
      return;
    }
    
    // Login the user
    try {
      await loginUser(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // L'errore sarà gestito dal contesto
    }
  };

  return (
    <div className="login-page">
      <div className="login-form fade-in">
        <h2>Accedi alla tua Avventura</h2>
        {(error || contextError) && <div className="alert alert-danger">{error || contextError}</div>}
        <form onSubmit={handleSubmit}>
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
              placeholder="La tua password"
              required
            />
          </div>
          <div className="form-footer">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
            <p className="register-link">
              Non hai un account? <Link to="/register">Registrati</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
