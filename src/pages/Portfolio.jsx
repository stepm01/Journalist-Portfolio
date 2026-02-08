import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Grid, List } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './Portfolio.css';

function Portfolio() {
  const { projects, loading } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="container">
          <span className="page-label">My Work</span>
          <h1>Portfolio</h1>
          <p>
            A collection of stories, investigations, and multimedia projects 
            that showcase my journey as a journalist.
          </p>
        </div>
      </section>

      <section className="portfolio-filters">
        <div className="container">
          <div className="filters-wrapper">
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio-content">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="no-projects">
              <p>No projects found in this category.</p>
            </div>
          ) : (
            <div className={`projects-container ${viewMode}`}>
              {filteredProjects.map((project, index) => (
                <Link 
                  to={`/portfolio/${project.id}`} 
                  key={project.id}
                  className="portfolio-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="portfolio-card-image">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'} 
                      alt={project.title}
                    />
                    {project.type === 'video' && (
                      <div className="play-overlay">
                        <Play size={28} />
                      </div>
                    )}
                    <div className="card-overlay">
                      <span className="view-project">View Project</span>
                    </div>
                  </div>
                  
                  <div className="portfolio-card-content">
                    <div className="card-meta">
                      <span className="card-category">{project.category}</span>
                      {project.year && <span className="card-year">{project.year}</span>}
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.excerpt}</p>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="card-tags">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Portfolio;
