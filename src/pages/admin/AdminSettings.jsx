import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Home, FileText, Video, Settings, Upload, X, Save, Eye, EyeOff } from 'lucide-react';
import './AdminSettings.css';

function AdminSettings() {
  const { currentUser, updatePassword } = useAuth();
  const { profile, updateProfile, uploadFile } = useData();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      instagram: '',
      github: ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || currentUser?.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        profileImage: profile.profileImage || '',
        socialLinks: {
          twitter: profile.socialLinks?.twitter || '',
          linkedin: profile.socialLinks?.linkedin || '',
          instagram: profile.socialLinks?.instagram || '',
          github: profile.socialLinks?.github || ''
        }
      });
    }
  }, [profile, currentUser]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const result = await uploadFile(file, `profile/${Date.now()}-${file.name}`);
    
    if (result.success) {
      setProfileData({ ...profileData, profileImage: result.url });
      setMessage({ type: 'success', text: 'Image uploaded!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(profileData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  return (
    <div className="admin-settings">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/studio" className="sidebar-logo"><span>✦</span></Link>
          <span className="sidebar-title">Studio</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/studio" className="nav-item"><Home size={20} /><span>Dashboard</span></Link>
          <Link to="/studio/blog" className="nav-item"><FileText size={20} /><span>Blog Posts</span></Link>
          <Link to="/studio/projects" className="nav-item"><Video size={20} /><span>Projects</span></Link>
          <Link to="/studio/settings" className="nav-item active"><Settings size={20} /><span>Settings</span></Link>
        </nav>
      </aside>

      <main className="admin-main">
        {message.text && (
          <div className={`toast-message ${message.type}`}>{message.text}</div>
        )}

        <header className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your profile and account</p>
          </div>
        </header>

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="settings-form">
              <div className="form-section">
                <h3>Profile Photo</h3>
                <div className="photo-upload">
                  <div className="photo-preview">
                    {profileData.profileImage ? (
                      <>
                        <img src={profileData.profileImage} alt="Profile" />
                        <button 
                          type="button" 
                          className="remove-photo"
                          onClick={() => setProfileData({ ...profileData, profileImage: '' })}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="photo-placeholder">
                        {profileData.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div className="photo-actions">
                    <label className="upload-btn">
                      <Upload size={18} />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p>Recommended: Square image, at least 400×400px</p>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Professional Title</label>
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                      placeholder="e.g., Investigative Journalist"
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Write a brief bio about yourself..."
                    rows={5}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Social Links</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Twitter / X</label>
                    <input
                      type="url"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input
                      type="url"
                      value={profileData.socialLinks.linkedin}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="form-group">
                    <label>Instagram</label>
                    <input
                      type="url"
                      value={profileData.socialLinks.instagram}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub</label>
                    <input
                      type="url"
                      value={profileData.socialLinks.github}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, github: e.target.value }
                      })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn" disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="settings-form security-form">
              <div className="form-section">
                <h3>Change Password</h3>
                <p className="section-desc">Ensure your account stays secure by using a strong password.</p>
                
                <div className="password-fields">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                      />
                      <button 
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        required
                      />
                      <button 
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                      />
                      <button 
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminSettings;
