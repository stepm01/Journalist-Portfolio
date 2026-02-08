import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById } = useData();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      const data = await getProjectById(id);
      if (data) {
        setProject(data);
      } else {
        navigate('/portfolio');
      }
      setLoading(false);
    }
    fetchProject();
  }, [id, getProjectById, navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <main className="project-detail">
      <div className="project-nav">
        <div className="container">
          <Link to="/portfolio" className="back-link">
            <ArrowLeft size={20} />
            Back to Portfolio
          </Link>
        </div>
      </div>

      <section className="project-hero">
        <div className="container">
          <div className="project-meta">
            <span className="project-category">{project.category}</span>
            {project.year && (
              <span className="project-date">
                <Calendar size={14} />
                {project.year}
              </span>
            )}
          </div>
          <h1>{project.title}</h1>
          {project.excerpt && <p className="project-excerpt">{project.excerpt}</p>}
        </div>
      </section>

      <section className="project-media">
        <div className="container container-narrow">
          {project.type === 'video' && project.videoUrl ? (
            <div className="video-wrapper">
              {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={project.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : project.videoUrl.includes('vimeo') ? (
                <iframe
                  src={project.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  title={project.title}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video controls>
                  <source src={project.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          ) : (
            <div className="project-image">
              <img 
                src={project.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'} 
                alt={project.title}
              />
            </div>
          )}
        </div>
      </section>

      <section className="project-content">
        <div className="container container-narrow">
          {project.content && (
            <div 
              className="project-body"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          )}

          <div className="project-details">
            {project.client && (
              <div className="detail-item">
                <h4>Client / Publication</h4>
                <p>{project.client}</p>
              </div>
            )}
            
            {project.role && (
              <div className="detail-item">
                <h4>Role</h4>
                <p>{project.role}</p>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="detail-item">
                <h4>Topics</h4>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {project.externalUrl && (
              <a 
                href={project.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary external-link"
              >
                View Original
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="project-gallery">
              <h3>Gallery</h3>
              <div className="gallery-grid">
                {project.gallery.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={image} alt={`${project.title} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="project-navigation">
        <div className="container">
          <Link to="/portfolio" className="btn btn-secondary">
            <ArrowLeft size={18} />
            Back to All Projects
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProjectDetail;
