import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Home, FileText, Video, Settings, LogOut, Plus, ExternalLink, Edit, Star } from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
  const { logout, currentUser } = useAuth();
  const { blogs, projects, profile } = useData();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/studio-access');
  }

  const stats = [
    { label: 'Blog Posts', value: blogs?.length || 0, icon: <FileText size={24} />, link: '/studio/blog', color: 'coral' },
    { label: 'Projects', value: projects?.length || 0, icon: <Video size={24} />, link: '/studio/projects', color: 'teal' },
    { label: 'Featured', value: projects?.filter(p => p.featured)?.length || 0, icon: <Star size={24} />, link: '/studio/projects', color: 'purple' }
  ];

  const quickActions = [
    { title: 'New Blog Post', desc: 'Write and publish a new article', icon: <Plus size={20} />, link: '/studio/blog?new=true' },
    { title: 'Add Project', desc: 'Showcase your latest work', icon: <Plus size={20} />, link: '/studio/projects?new=true' },
    { title: 'Edit Profile', desc: 'Update your bio and info', icon: <Edit size={20} />, link: '/studio/settings' },
    { title: 'View Website', desc: 'See your public site', icon: <ExternalLink size={20} />, link: '/', external: true }
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/studio" className="sidebar-logo">
            <span>✦</span>
          </Link>
          <span className="sidebar-title">Studio</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/studio" className="nav-item active">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/studio/blog" className="nav-item">
            <FileText size={20} />
            <span>Blog Posts</span>
          </Link>
          <Link to="/studio/projects" className="nav-item">
            <Video size={20} />
            <span>Projects</span>
          </Link>
          <Link to="/studio/settings" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {currentUser?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{profile?.name || 'Admin'}</span>
              <span className="user-email">{currentUser?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!</h1>
            <p>Here's what's happening with your portfolio</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="view-site-btn">
            <ExternalLink size={18} />
            View Site
          </a>
        </header>

        <section className="stats-section">
          {stats.map((stat, index) => (
            <Link to={stat.link} key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              action.external ? (
                <a href={action.link} key={index} className="quick-action-card" target="_blank" rel="noopener noreferrer">
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-info">
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                </a>
              ) : (
                <Link to={action.link} key={index} className="quick-action-card">
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-info">
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                </Link>
              )
            ))}
          </div>
        </section>

        <section className="recent-section">
          <div className="recent-blogs">
            <div className="section-header">
              <h2>Recent Blog Posts</h2>
              <Link to="/studio/blog" className="view-all">View All</Link>
            </div>
            {blogs?.length > 0 ? (
              <div className="recent-list">
                {blogs.slice(0, 5).map(blog => (
                  <div key={blog.id} className="recent-item">
                    <div className="item-info">
                      <h4>{blog.title}</h4>
                      <span className="item-category">{blog.category}</span>
                    </div>
                    <Link to={`/studio/blog?edit=${blog.id}`} className="edit-link">Edit</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No blog posts yet</p>
                <Link to="/studio/blog?new=true" className="create-link">Create your first post</Link>
              </div>
            )}
          </div>

          <div className="recent-projects">
            <div className="section-header">
              <h2>Recent Projects</h2>
              <Link to="/studio/projects" className="view-all">View All</Link>
            </div>
            {projects?.length > 0 ? (
              <div className="recent-list">
                {projects.slice(0, 5).map(project => (
                  <div key={project.id} className="recent-item">
                    <div className="item-info">
                      <h4>{project.title}</h4>
                      <span className="item-category">{project.category}</span>
                    </div>
                    <Link to={`/studio/projects?edit=${project.id}`} className="edit-link">Edit</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No projects yet</p>
                <Link to="/studio/projects?new=true" className="create-link">Add your first project</Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
