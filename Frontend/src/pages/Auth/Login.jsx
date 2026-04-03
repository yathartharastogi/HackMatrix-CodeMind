import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AlertTriangle, Loader2 } from 'lucide-react';
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

    if (supabase.supabaseUrl.includes('placeholder.supabase.co')) {
      setErrorMsg("Configuration Required: Please set your VITE_SUPABASE_URL and ANON_KEY.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message || 'Invalid logical credentials.');
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg("Neural link failed: Network trace interrupted.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container animate-fade-up">
        
        <div className="auth-header">
          <div className="auth-logo">CodeMind</div>
          <span className="auth-subtitle">DECODE YOUR POTENTIAL</span>
        </div>

        {errorMsg && (
          <div className="auth-error animate-fade-up">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Node</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="operator@codemind.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Access Sequence</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn-primary" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Establish Session'}
          </button>
        </form>

        <div className="auth-footer">
          New node? <Link to="/signup" className="auth-link">Initialize Account</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
