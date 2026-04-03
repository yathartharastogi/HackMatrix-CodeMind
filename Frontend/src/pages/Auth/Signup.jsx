import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AlertTriangle, Loader2 } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('All cognitive nodes required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    if (supabase.supabaseUrl.includes('placeholder.supabase.co')) {
      setErrorMsg("Configuration Required: .env keys missing.");
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        setErrorMsg(authError.message || 'Failed to initialize session.');
        setLoading(false);
        return;
      }

      if (authData?.user) {
        await supabase
          .from('Auth')
          .insert({
            fullname: fullName,
            emailaddress: email,
            gender: gender,
          });
      }

      setSuccessMsg('Session initialized. Accessing dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err) {
      setErrorMsg("Trace failed: Handshake timed out.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container animate-fade-up">
        
        <div className="auth-header">
          <div className="auth-logo">Join CodeMind</div>
          <span className="auth-subtitle">CREATE YOUR NODE</span>
        </div>

        {errorMsg && (
          <div className="auth-error animate-fade-up">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-error animate-fade-up" style={{ backgroundColor: 'rgba(0,255,204,0.05)', color: '#00FFCC', borderColor: 'rgba(0,255,204,0.1)' }}>
            <span>{successMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="operator.name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <label className="form-label">Sequence (Password)</label>
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Initialize Node'}
          </button>
        </form>

        <div className="auth-footer">
          Existing node? <Link to="/login" className="auth-link">Establish Session</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
