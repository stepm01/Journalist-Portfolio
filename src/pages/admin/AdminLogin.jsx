import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { login, resetPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/studio');
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/studio');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(email);
    
    if (result.success) {
      setResetEmailSent(true);
      setError('');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }

  return (
    <div className="admin-login">
      <div className="login-bg">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-branding">
          <div className="brand-icon">
            <span>✦</span>
          </div>
          <h1>Studio</h1>
          <p>Content Management Portal</p>
        </div>

        <div className="login-card">
          {showForgotPassword ? (
            <>
              <div className="login-header">
                <h2>Reset Password</h2>
                <p>Enter your email to receive reset instructions</p>
              </div>

              {resetEmailSent ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <p>Password reset email sent! Check your inbox.</p>
                  <button 
                    className="back-to-login-btn"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? <span className="spinner-small"></span> : 'Send Reset Link'}
                  </button>

                  <button 
                    type="button"
                    className="forgot-link"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="login-header">
                <h2>Welcome Back</h2>
                <p>Sign in to manage your content</p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? <span className="spinner-small"></span> : 'Sign In'}
                </button>

                <button 
                  type="button"
                  className="forgot-link"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </button>
              </form>
            </>
          )}
        </div>

        <div className="login-footer">
          <Link to="/" className="back-to-site">
            <ArrowLeft size={18} />
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
