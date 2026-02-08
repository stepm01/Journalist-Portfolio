import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo / Name */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <div className="logo-text-wrap">
            <span className="logo-text">{profile?.name || 'Anna Najarian'}</span>
            <span className="logo-tagline">Journalist & Writer</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className={isActive('/portfolio') ? 'active' : ''}>
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/blog" className={isActive('/blog') ? 'active' : ''}>
              Blog
            </Link>
          </li>
          <li>
            <a href={`mailto:${profile?.email || 'hello@example.com'}`} className="nav-contact-btn">
              Get in Touch
            </a>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <ul className="mobile-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className={isActive('/portfolio') ? 'active' : ''}>
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/blog" className={isActive('/blog') ? 'active' : ''}>
              Blog
            </Link>
          </li>
          <li>
            <a href={`mailto:${profile?.email || 'hello@example.com'}`} className="mobile-contact-btn">
              Get in Touch
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
