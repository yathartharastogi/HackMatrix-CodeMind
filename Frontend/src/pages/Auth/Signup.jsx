import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { AlertTriangle, Loader, CheckCircle } from 'lucide-react';
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
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Pre-emptive check to avoid "Failed to fetch" console errors with placeholder URL
    if (supabase.supabaseUrl.includes('placeholder.supabase.co')) {
      setErrorMsg("Configuration Required: Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the .env file.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create user in securely managed Supabase auth backend
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setErrorMsg(authError.message || 'Failed to securely create credential.');
        setLoading(false);
        return;
      }

      // Step 2: Attempt pushing mapping record to explicit structural Custom "Auth" profiling table
      if (authData?.user) {
        const { error: dbError } = await supabase
          .from('Auth')
          .insert({
            fullname: fullName,
            emailaddress: email,
            gender: gender,
          });

        if (dbError) {
          console.error("Profile insert block failed:", dbError);
          setErrorMsg('Auth succeeded, but profile mapping blocked depending on RLS. Routing anyway...');
        }
      }

      setSuccessMsg('Account created securely! Routing to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setErrorMsg("Network error: Could not connect to Supabase. Ensure your .env keys are properly configured.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout fade-in">
      <div className="auth-card">
        
        <div className="auth-header">
          <div className="auth-logo-icon">C</div>
          <h1 className="auth-title">Join CodeMind</h1>
          <p className="auth-subtitle">Create an account to start analyzing your code.</p>
        </div>

        {errorMsg && (
          <div className="auth-error-msg fade-in">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-error-msg fade-in" style={{ backgroundColor: 'rgba(72,187,120,0.1)', borderColor: 'rgba(72,187,120,0.3)', color: '#48bb78' }}>
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Neo Anderson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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
            <label className="form-label">Gender</label>
            <select 
              className="form-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
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
            {loading ? <Loader className="spinner" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
