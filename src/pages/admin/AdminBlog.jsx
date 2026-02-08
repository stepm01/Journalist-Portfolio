import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Home, FileText, Video, Settings, Plus, X, Upload, Eye, Trash2, Edit } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminBlog.css';

function AdminBlog() {
  const { blogs, categories, addBlog, updateBlog, deleteBlog, addCategory, uploadFile } = useData();
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
    coverImage: '',
    featured: false
  });

  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    const newPost = searchParams.get('new');
    const editId = searchParams.get('edit');
    
    if (newPost) {
      handleNewPost();
    } else if (editId) {
      const blog = blogs.find(b => b.id === editId);
      if (blog) handleEdit(blog);
    }
  }, [searchParams, blogs]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  function handleNewPost() {
    setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', coverImage: '', featured: false });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  }

  function handleEdit(blog) {
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || '',
      tags: blog.tags?.join(', ') || '',
      coverImage: blog.coverImage || '',
      featured: blog.featured || false
    });
    setIsEditing(true);
    setEditingId(blog.id);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setSearchParams({});
    setFormData({ title: '', excerpt: '', content: '', category: '', tags: '', coverImage: '', featured: false });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const result = await uploadFile(file, `blog-images/${Date.now()}-${file.name}`);
    
    if (result.success) {
      setFormData({ ...formData, coverImage: result.url });
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

    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    let result;
    if (isEditing) {
      result = await updateBlog(editingId, blogData);
    } else {
      result = await addBlog(blogData);
    }

    if (result.success) {
      setMessage({ type: 'success', text: isEditing ? 'Blog updated!' : 'Blog created!' });
      handleCancel();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this blog post?')) return;
    
    setLoading(true);
    const result = await deleteBlog(id);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Blog deleted!' });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    const result = await addCategory({ name: newCategory.trim(), type: 'blog' });
    if (result.success) {
      setNewCategory('');
      setShowCategoryForm(false);
      setMessage({ type: 'success', text: 'Category added!' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }

  return (
    <div className="admin-blog">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/studio" className="sidebar-logo"><span>✦</span></Link>
          <span className="sidebar-title">Studio</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/studio" className="nav-item"><Home size={20} /><span>Dashboard</span></Link>
          <Link to="/studio/blog" className="nav-item active"><FileText size={20} /><span>Blog Posts</span></Link>
          <Link to="/studio/projects" className="nav-item"><Video size={20} /><span>Projects</span></Link>
          <Link to="/studio/settings" className="nav-item"><Settings size={20} /><span>Settings</span></Link>
        </nav>
      </aside>

      <main className="admin-main">
        {message.text && (
          <div className={`toast-message ${message.type}`}>{message.text}</div>
        )}

        <header className="page-header">
          <div>
            <h1>Blog Posts</h1>
            <p>Manage your articles and stories</p>
          </div>
          <button onClick={handleNewPost} className="primary-btn">
            <Plus size={18} />
            New Post
          </button>
        </header>

        {showForm ? (
          <div className="form-container">
            <div className="form-header">
              <h2>{isEditing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={handleCancel} className="close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="blog-form">
              <div className="form-layout">
                <div className="form-main">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter post title"
                      required
                      className="title-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description for preview"
                      rows={3}
                      className="excerpt-input"
                    />
                  </div>

                  <div className="form-group editor-group">
                    <label>Content *</label>
                    <div className="editor-wrapper">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        modules={quillModules}
                        placeholder="Write your post content here... This editor is designed for comfortable writing with plenty of space."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-sidebar">
                  <div className="form-group">
                    <label>Cover Image</label>
                    <div className="image-upload">
                      {formData.coverImage ? (
                        <div className="image-preview">
                          <img src={formData.coverImage} alt="Cover" />
                          <button type="button" onClick={() => setFormData({ ...formData, coverImage: '' })} className="remove-image">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="upload-placeholder">
                          <Upload size={32} />
                          <span>Click to upload</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <div className="category-select">
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="">Select category</option>
                        {categories.filter(c => c.type === 'blog' || c.type === 'both').map(cat => (
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

                  <div className="form-group">
                    <label>Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                    />
                    <small>Separate with commas</small>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span>Featured post</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="secondary-btn">Cancel</button>
                    <button type="submit" className="primary-btn" disabled={loading}>
                      {loading ? 'Saving...' : (isEditing ? 'Update' : 'Publish')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="posts-list">
            {blogs?.length > 0 ? (
              <div className="posts-grid">
                {blogs.map(blog => (
                  <div key={blog.id} className="post-card">
                    {blog.coverImage && (
                      <div className="post-image">
                        <img src={blog.coverImage} alt={blog.title} />
                        {blog.featured && <span className="featured-badge">Featured</span>}
                      </div>
                    )}
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-category">{blog.category || 'Uncategorized'}</span>
                        <span className="post-date">{blog.createdAt?.toDate?.()?.toLocaleDateString() || 'Draft'}</span>
                      </div>
                      <h3>{blog.title}</h3>
                      {blog.excerpt && <p>{blog.excerpt}</p>}
                      <div className="post-actions">
                        <button onClick={() => handleEdit(blog)} className="edit-btn"><Edit size={16} /> Edit</button>
                        <a href={`/blog/${blog.id}`} target="_blank" rel="noopener noreferrer" className="view-btn"><Eye size={16} /> View</a>
                        <button onClick={() => handleDelete(blog.id)} className="delete-btn"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={64} />
                <h3>No blog posts yet</h3>
                <p>Start sharing your stories and insights</p>
                <button onClick={handleNewPost} className="primary-btn">Create Your First Post</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminBlog;
