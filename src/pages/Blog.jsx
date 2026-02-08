import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ChevronDown } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './Blog.css';

function Blog() {
  const { blogs, loading } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(blogs.map(b => b.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (activeCategory !== 'All') {
      result = result.filter(b => b.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title?.toLowerCase().includes(query) ||
        b.excerpt?.toLowerCase().includes(query) ||
        b.category?.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'latest') {
      result = [...result].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateA - dateB;
      });
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) => 
        (a.title || '').localeCompare(b.title || '')
      );
    }

    return result;
  }, [blogs, activeCategory, searchQuery, sortBy]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Recent';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getReadTime = (content) => {
    if (!content) return '3 min';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading blog...</p>
      </div>
    );
  }

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="container">
          <span className="page-label">Insights & Stories</span>
          <h1>Blog</h1>
          <p>
            Thoughts on journalism, society, culture, and the stories 
            that shape our world.
          </p>
        </div>
      </section>

      <section className="blog-filters">
        <div className="container">
          <div className="filters-row">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sort-dropdown">
              <button 
                className="sort-trigger"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                Sort by: {sortBy === 'latest' ? 'Latest' : sortBy === 'oldest' ? 'Oldest' : 'Title'}
                <ChevronDown size={16} />
              </button>
              {showSortDropdown && (
                <div className="sort-options">
                  <button 
                    className={sortBy === 'latest' ? 'active' : ''}
                    onClick={() => { setSortBy('latest'); setShowSortDropdown(false); }}
                  >
                    Latest
                  </button>
                  <button 
                    className={sortBy === 'oldest' ? 'active' : ''}
                    onClick={() => { setSortBy('oldest'); setShowSortDropdown(false); }}
                  >
                    Oldest
                  </button>
                  <button 
                    className={sortBy === 'title' ? 'active' : ''}
                    onClick={() => { setSortBy('title'); setShowSortDropdown(false); }}
                  >
                    Title A-Z
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                {category !== 'All' && (
                  <span className="category-count">
                    {blogs.filter(b => b.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-content">
        <div className="container">
          {filteredBlogs.length === 0 ? (
            <div className="no-posts">
              <p>No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              {filteredBlogs.length > 0 && activeCategory === 'All' && !searchQuery && (
                <Link to={`/blog/${filteredBlogs[0].id}`} className="featured-post">
                  <div className="featured-image">
                    <img 
                      src={filteredBlogs[0].coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800'} 
                      alt={filteredBlogs[0].title}
                    />
                  </div>
                  <div className="featured-content">
                    <span className="featured-label">Latest Article</span>
                    <span className="post-category">{filteredBlogs[0].category}</span>
                    <h2>{filteredBlogs[0].title}</h2>
                    <p>{filteredBlogs[0].excerpt}</p>
                    <div className="post-meta">
                      <span>
                        <Calendar size={14} />
                        {formatDate(filteredBlogs[0].createdAt)}
                      </span>
                      <span>
                        <Clock size={14} />
                        {getReadTime(filteredBlogs[0].content)}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="posts-grid">
                {filteredBlogs.slice(activeCategory === 'All' && !searchQuery ? 1 : 0).map((post, index) => (
                  <Link 
                    to={`/blog/${post.id}`} 
                    key={post.id}
                    className="post-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="post-image">
                      <img 
                        src={post.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600'} 
                        alt={post.title}
                      />
                    </div>
                    <div className="post-content">
                      <div className="post-header">
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="post-footer">
                        <span className="read-more">Read Article →</span>
                        <span className="read-time">
                          <Clock size={12} />
                          {getReadTime(post.content)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Blog;
