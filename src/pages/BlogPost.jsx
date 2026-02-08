import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import './BlogPost.css';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, blogs, profile } = useData();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const data = await getBlogById(id);
      if (data) {
        setPost(data);
      } else {
        navigate('/blog');
      }
      setLoading(false);
    }
    fetchPost();
  }, [id, getBlogById, navigate]);

  const relatedPosts = post ? blogs
    .filter(b => b.id !== post.id && b.category === post.category)
    .slice(0, 3) : [];

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <main className="blog-post">
      <div className="post-nav">
        <div className="container">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>

      <header className="post-header">
        <div className="container container-narrow">
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">
              <Calendar size={14} />
              {formatDate(post.createdAt)}
            </span>
            <span className="post-read-time">
              <Clock size={14} />
              {getReadTime(post.content)}
            </span>
          </div>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          
          <div className="post-author">
            <img 
              src={profile?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'} 
              alt={profile?.name || 'Author'}
              className="author-image"
            />
            <div className="author-info">
              <span className="author-name">{profile?.name || 'Author'}</span>
              <span className="author-title">Journalist & Writer</span>
            </div>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="post-cover">
          <div className="container">
            <img src={post.coverImage} alt={post.title} />
          </div>
        </div>
      )}

      <article className="post-content">
        <div className="container container-narrow">
          <div 
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              <span className="tags-label">Topics:</span>
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="post-share">
            <span className="share-label">Share this article:</span>
            <div className="share-buttons">
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                <Twitter size={18} />
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                <Linkedin size={18} />
              </button>
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                <Facebook size={18} />
              </button>
              <button onClick={copyLink} className="share-btn copy">
                <LinkIcon size={18} />
                {copied && <span className="copied-tooltip">Copied!</span>}
              </button>
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <div className="container">
            <h3>Related Articles</h3>
            <div className="related-grid">
              {relatedPosts.map((relatedPost) => (
                <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="related-card">
                  <div className="related-image">
                    <img 
                      src={relatedPost.coverImage || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400'} 
                      alt={relatedPost.title}
                    />
                  </div>
                  <div className="related-content">
                    <span className="related-category">{relatedPost.category}</span>
                    <h4>{relatedPost.title}</h4>
                    <span className="related-date">{formatDate(relatedPost.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="post-navigation">
        <div className="container">
          <Link to="/blog" className="btn btn-secondary">
            <ArrowLeft size={18} />
            Back to All Articles
          </Link>
        </div>
      </section>
    </main>
  );
}

export default BlogPost;
