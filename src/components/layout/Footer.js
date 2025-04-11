import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="copyright">
          &copy; {currentYear} Token Quest - Tutti i diritti riservati
        </div>
        <ul className="footer-links">
          <li className="footer-item">
            <Link to="/privacy" className="footer-link">Privacy</Link>
          </li>
          <li className="footer-item">
            <Link to="/terms" className="footer-link">Termini di Utilizzo</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
