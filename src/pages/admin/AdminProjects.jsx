import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Home, FileText, Video, Settings, Plus, X, Upload, Eye, Trash2, Edit, Play } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminProjects.css';

function AdminProjects() {
  const { projects, categories, addProject, updateProject, deleteProject, addCategory, uploadFile } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    thumbnail: '',
    type: 'article',
    videoUrl: '',
    externalUrl: '',
    client: '',
    role: '',
    year: new Date().getFullYear().toString(),
    featured: false
  });

  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    const newProject = searchParams.get('new');
    const editId = searchParams.get('edit');
    
    if (newProject) {
      handleNewProject();
    } else if (editId) {
      const project = projects.find(p => p.id === editId);
      if (project) handleEdit(project);
    }
  }, [searchParams, projects]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote'],
      ['link'],
      ['clean']
    ]
  };

  function handleNewProject() {
    setFormData({
      title: '', excerpt: '', content: '', category: '', tags: '', thumbnail: '',
      type: 'article', videoUrl: '', externalUrl: '', client: '', role: '',
      year: new Date().getFullYear().toString(), featured: false
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  }

  function handleEdit(project) {
    setFormData({
      title: project.title || '',
      excerpt: project.excerpt || '',
      content: project.content || '',
      category: project.category || '',
      tags: project.tags?.join(', ') || '',
      thumbnail: project.thumbnail || '',
      type: project.type || 'article',
      videoUrl: project.videoUrl || '',
      externalUrl: project.externalUrl || '',
      client: project.client || '',
      role: project.role || '',
      year: project.year || '',
      featured: project.featured || false
    });
    setIsEditing(true);
    setEditingId(project.id);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setSearchParams({});
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const result = await uploadFile(file, `project-images/${Date.now()}-${file.name}`);
    
    if (result.success) {
      setFormData({ ...formData, thumbnail: result.url });
      setMessage({ type: 'success', text: 'Image uploaded!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    let result;
    if (isEditing) {
      result = await updateProject(editingId, projectData);
    } else {
      result = await addProject(projectData);
    }

    if (result.success) {
      setMessage({ type: 'success', text: isEditing ? 'Project updated!' : 'Project created!' });
      handleCancel();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return;
    
    setLoading(true);
    const result = await deleteProject(id);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Project deleted!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    const result = await addCategory({ name: newCategory.trim(), type: 'project' });
    if (result.success) {
      setNewCategory('');
      setShowCategoryForm(false);
      setMessage({ type: 'success', text: 'Category added!' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  return (
    <div className="admin-projects">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/studio" className="sidebar-logo"><span>✦</span></Link>
          <span className="sidebar-title">Studio</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/studio" className="nav-item"><Home size={20} /><span>Dashboard</span></Link>
          <Link to="/studio/blog" className="nav-item"><FileText size={20} /><span>Blog Posts</span></Link>
          <Link to="/studio/projects" className="nav-item active"><Video size={20} /><span>Projects</span></Link>
          <Link to="/studio/settings" className="nav-item"><Settings size={20} /><span>Settings</span></Link>
        </nav>
      </aside>

      <main className="admin-main">
        {message.text && (
          <div className={`toast-message ${message.type}`}>{message.text}</div>
        )}

        <header className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Showcase your portfolio work</p>
          </div>
          <button onClick={handleNewProject} className="primary-btn">
            <Plus size={18} />
            New Project
          </button>
        </header>

        {showForm ? (
          <div className="form-container">
            <div className="form-header">
              <h2>{isEditing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={handleCancel} className="close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-layout">
                <div className="form-main">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project title"
                      required
                      className="title-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief project summary"
                      rows={3}
                    />
                  </div>

                  <div className="form-group editor-group">
                    <label>Full Description</label>
                    <div className="editor-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        modules={quillModules}
                        placeholder="Detailed project description..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-sidebar">
                  <div className="form-group">
                    <label>Thumbnail</label>
                    <div className="image-upload">
                      {formData.thumbnail ? (
                        <div className="image-preview">
                          <img src={formData.thumbnail} alt="Thumbnail" />
                          <button type="button" onClick={() => setFormData({ ...formData, thumbnail: '' })} className="remove-image">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="upload-placeholder">
                          <Upload size={32} />
                          <span>Upload image</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Project Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="podcast">Podcast</option>
                      <option value="investigation">Investigation</option>
                      <option value="documentary">Documentary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {formData.type === 'video' && (
                    <div className="form-group">
                      <label>Video URL</label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="YouTube or Vimeo link"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Category</label>
                    <div className="category-select">
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="">Select category</option>
                        {categories.filter(c => c.type === 'project' || c.type === 'both').map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setShowCategoryForm(!showCategoryForm)} className="add-cat-btn">
                        <Plus size={18} />
                      </button>
                    </div>
                    {showCategoryForm && (
                      <div className="category-form">
                        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category" />
                        <button type="button" onClick={handleAddCategory}>Add</button>
                      </div>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Client/Publication</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        placeholder="e.g., The Times"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Lead Reporter"
                    />
                  </div>

                  <div className="form-group">
                    <label>External Link</label>
                    <input
                      type="url"
                      value={formData.externalUrl}
                      onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                      placeholder="Link to original article"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span>Featured project</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="secondary-btn">Cancel</button>
                    <button type="submit" className="primary-btn" disabled={loading}>
                      {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="projects-list">
            {projects?.length > 0 ? (
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="project-card">
                    <div className="project-image">
                      <img src={project.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'} alt={project.title} />
                      {project.type === 'video' && (
                        <div className="video-indicator"><Play size={20} /></div>
                      )}
                      {project.featured && <span className="featured-badge">Featured</span>}
                    </div>
                    <div className="project-content">
                      <div className="project-meta">
                        <span className="project-category">{project.category || 'Uncategorized'}</span>
                        <span className="project-year">{project.year}</span>
                      </div>
                      <h3>{project.title}</h3>
                      {project.excerpt && <p>{project.excerpt}</p>}
                      <div className="project-actions">
                        <button onClick={() => handleEdit(project)} className="edit-btn"><Edit size={16} /> Edit</button>
                        <a href={`/portfolio/${project.id}`} target="_blank" rel="noopener noreferrer" className="view-btn"><Eye size={16} /> View</a>
                        <button onClick={() => handleDelete(project.id)} className="delete-btn"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Video size={64} />
                <h3>No projects yet</h3>
                <p>Showcase your journalism work</p>
                <button onClick={handleNewProject} className="primary-btn">Add Your First Project</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminProjects;
