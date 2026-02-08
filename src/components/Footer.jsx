import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Linkedin, Instagram, Heart } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './Footer.css';

function Footer() {
  const { profile } = useData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-gradient"></div>
      
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-icon">✦</span>
              <h3 className="footer-name">{profile?.name || 'Anna Najarian'}</h3>
            </div>
            <p className="footer-tagline">
              Stories that matter, voices that inspire. Bringing truth to light through compelling journalism.
            </p>
            
            {/* Social Links */}
            <div className="footer-social">
              {profile?.socialLinks?.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              )}
              {profile?.socialLinks?.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4>Get in Touch</h4>
            <p>
              Interested in working together?<br />
              I'd love to hear from you.
            </p>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="footer-email-btn">
                Send an Email
              </a>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} {profile?.name || 'Anna Najarian'}. All rights reserved.</p>
          <p className="footer-credit">
            Made with <Heart size={14} className="heart-icon" /> and lots of coffee
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
