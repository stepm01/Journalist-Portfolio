import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Briefcase, Video, Newspaper, Settings, LogOut, ExternalLink } from 'lucide-react';
import './AdminLayout.css';

const NAV = [
  { to: '/studio', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/studio/experience', label: 'Experience', icon: Briefcase },
  { to: '/studio/reels', label: 'Reels', icon: Video },
  { to: '/studio/bylines', label: 'Published', icon: Newspaper },
  { to: '/studio/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, title, subtitle, action }) {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function handleLogout() {
    await logout();
    navigate('/studio-access');
  }

  const isActive = (item) => item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/studio" className="sidebar-logo">&#10022;</Link>
          <span className="sidebar-title">Studio</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={isActive(item) ? 'nav-item active' : 'nav-item'}>
                <Icon size={19} /><span>{item.label}</span>
              </Link>
            );
          })}
          <a href="/" className="nav-item" target="_blank" rel="noreferrer">
            <ExternalLink size={19} /><span>View site</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{currentUser?.email?.[0]?.toUpperCase() || 'A'}</div>
            <div className="user-details">
              <span className="user-name">Admin</span>
              <span className="user-email">{currentUser?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} aria-label="Log out"><LogOut size={18} /></button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
