import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useData } from '../../contexts/DataContext';
import { Briefcase, Video, Newspaper, Plus, Settings } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { experience, reels, bylines, profile } = useData();

  const stats = [
    { label: 'Experience', value: experience.length, icon: Briefcase, to: '/studio/experience' },
    { label: 'Reels', value: reels.length, icon: Video, to: '/studio/reels' },
    { label: 'Bylines', value: bylines.length, icon: Newspaper, to: '/studio/bylines' },
  ];
  const actions = [
    { title: 'Add a role', desc: 'Extend the experience timeline', to: '/studio/experience', icon: Plus },
    { title: 'Add a reel', desc: 'Showcase a new video', to: '/studio/reels', icon: Plus },
    { title: 'Add a byline', desc: 'Link a published article', to: '/studio/bylines', icon: Plus },
    { title: 'Edit profile', desc: 'Name, bio, contact, links', to: '/studio/settings', icon: Settings },
  ];

  return (
    <AdminLayout title={`Welcome${profile?.name ? ', ' + profile.name.split(' ')[0] : ''}`} subtitle="Everything on your landing page, in one place.">
      <div className="dash-stats">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link to={s.to} className="stat-card" key={s.label}>
              <div className="stat-icon"><Icon size={22} /></div>
              <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </Link>
          );
        })}
      </div>

      <h2 className="dash-h">Quick actions</h2>
      <div className="dash-actions">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link to={a.to} className="action-card" key={a.title}>
              <div className="action-icon"><Icon size={18} /></div>
              <div><h3>{a.title}</h3><p>{a.desc}</p></div>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}
