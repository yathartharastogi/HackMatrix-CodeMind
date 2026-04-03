import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AlertTriangle, Loader } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please explicitly enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Pre-emptive check to avoid "Failed to fetch" console errors with placeholder URL
    if (supabase.supabaseUrl.includes('placeholder.supabase.co')) {
      setErrorMsg("Configuration Required: Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the .env file.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid email or password.');
        setLoading(false);
      } else {
        // Upon success, AuthContext triggers an update natively,
        // we navigate directly
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error: Could not connect to Supabase. Ensure your .env keys are valid.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout fade-in">
      <div className="auth-card">
        
        <div className="auth-header">
          <div className="auth-logo-icon">C</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to your CodeMind UI workspace</p>
        </div>

        {errorMsg && (
          <div className="auth-error-msg fade-in">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="primary-cta-btn" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? <Loader className="spinner" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
