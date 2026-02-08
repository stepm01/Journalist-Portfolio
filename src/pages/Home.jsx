import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, Play, Quote, Sparkles } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './Home.css';

function Home() {
  const { profile, blogs, projects, loading } = useData();

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const latestBlogs = blogs.slice(0, 3);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-mesh"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Journalist & Writer</span>
              </div>
              <h1 className="hero-title">
                {profile?.name || 'Anna Najarian'}
              </h1>
              <p className="hero-subtitle">
                {profile?.tagline || 'Stories that matter, voices that inspire. Bringing truth to light through compelling journalism.'}
              </p>
              
              <div className="hero-actions">
                <Link to="/portfolio" className="btn btn-primary">
                  View My Work
                  <ArrowRight size={18} />
                </Link>
                <a 
                  href="/assets/cv/resume.pdf" 
                  download 
                  className="btn btn-secondary"
                >
                  <Download size={18} />
                  Download CV
                </a>
              </div>
            </div>

            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <div className="hero-image-glow"></div>
                <div className="hero-image-border"></div>
                <img 
                  src={profile?.profileImage || '/assets/anna.png'} 
                  alt={profile?.name || 'Anna Najarian'}
                  className="hero-image"
                />
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{profile?.stats?.yearsExperience || '10'}+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profile?.stats?.articlesPublished || '500'}+</span>
                  <span className="stat-label">Stories Published</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-indicator"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="about section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-label">About Me</span>
              <h2 className="about-title">
                The Story Behind <br />
                <span className="gradient-text">The Stories</span>
              </h2>
              <div className="about-text">
                {profile?.bio ? (
                  profile.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      With over a decade of experience in investigative journalism, 
                      I've dedicated my career to uncovering truth and giving voice 
                      to the voiceless. My work spans political analysis, human 
                      interest stories, and cultural commentary.
                    </p>
                    <p>
                      From the newsrooms of major publications to the streets where 
                      stories unfold, I believe in the power of journalism to inform, 
                      inspire, and ignite change.
                    </p>
                  </>
                )}
              </div>

              <div className="expertise">
                <h4>Areas of Expertise</h4>
                <div className="expertise-tags">
                  {(profile?.expertise || ['Political Analysis', 'Investigative Reporting', 'Cultural Commentary', 'Human Interest']).map((item, index) => (
                    <span key={index} className="expertise-tag">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="about-quote">
              <div className="quote-icon-wrapper">
                <Quote size={32} />
              </div>
              <blockquote>
                {profile?.quote || "Journalism is the first rough draft of history. I write it with honesty, courage, and an unwavering commitment to truth."}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="featured-projects section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Selected Work</span>
              <h2 className="section-title">Featured Projects</h2>
            </div>

            <div className="projects-grid">
              {featuredProjects.map((project, index) => (
                <Link 
                  to={`/portfolio/${project.id}`} 
                  key={project.id}
                  className={`project-card ${index === 0 ? 'project-card-featured' : ''}`}
                >
                  <div className="project-thumbnail">
                    {project.type === 'video' && (
                      <div className="play-button">
                        <Play size={24} />
                      </div>
                    )}
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'} 
                      alt={project.title}
                    />
                    <div className="project-overlay"></div>
                  </div>
                  <div className="project-info">
                    <span className="project-category">{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.excerpt}</p>
                    <span className="view-link">
                      View Project <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="section-cta">
              <Link to="/portfolio" className="btn btn-secondary">
                View All Projects
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Blogs */}
      {latestBlogs.length > 0 && (
        <section className="latest-blogs section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">From the Blog</span>
              <h2 className="section-title">Latest Articles</h2>
            </div>

            <div className="blogs-grid">
              {latestBlogs.map((blog) => (
                <Link to={`/blog/${blog.id}`} key={blog.id} className="blog-card">
                  <div className="blog-image">
                    <img 
                      src={blog.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600'} 
                      alt={blog.title}
                    />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-category">{blog.category}</span>
                      <span className="blog-date">
                        {blog.createdAt?.toDate?.() 
                          ? new Date(blog.createdAt.toDate()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recent'
                        }
                      </span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <span className="read-more">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="section-cta">
              <Link to="/blog" className="btn btn-secondary">
                Read More Articles
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="cta-background"></div>
        <div className="container">
          <div className="cta-content">
            <span className="cta-badge">Let's Connect</span>
            <h2>Have a Story to Tell?</h2>
            <p>
              Whether you're looking for a dedicated journalist for your publication 
              or have a story that needs telling, I'd love to hear from you.
            </p>
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                Get in Touch
                <ArrowRight size={18} />
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
