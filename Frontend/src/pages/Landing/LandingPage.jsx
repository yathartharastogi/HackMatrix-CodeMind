import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Code, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCtaClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="landing-container dot-grid">
      {/* Interactive Mouse Glow */}
      <div 
        className="mouse-glow" 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }} 
      />

      {/* Floating Gradient Orbs */}
      <div className="orb orb-gold"></div>
      <div className="orb orb-dark"></div>

      {/* Navigation */}
      <nav className="nav-wrapper">
        <div className="pill-navbar">
          <div className="nav-brand-group" onClick={() => navigate('/')}>
            <div className="logo-img">M</div>
            <span className="brand-name">CodeMind</span>
          </div>
          
          <div className="nav-auth-center">
            {session ? (
              <button className="signup-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            ) : (
              <>
                <button className="login-link" onClick={() => navigate('/login')}>Login</button>
                <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content animate-fade-up">
          <div className="neural-badge">
            <div className="pulse-dot"></div>
            <span>Neural Engine Live</span>
          </div>
          <h1 className="hero-title">
            Master Your <span className="gradient-text">Code Mind</span>
          </h1>
          <p className="hero-subtitle">
            The next-generation AI debugger that maps your logic, predicts failures, 
            and optimizes your execution paths in real-time.
          </p>
          <div className="hero-actions">
            <button className="signup-btn" style={{ padding: '16px 48px', fontSize: '1rem' }} onClick={handleCtaClick}>
              Explore Neural Nodes <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mockup-window">
            <div className="window-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
              <span className="window-title">main.js — CodeMind</span>
            </div>
            <div className="window-content">
              <pre className="code-display">
                <code>
{`async function analyze(data) {
  const result = await processInput(data);
  
  // Logical flaw detected here
  if (result.status === "error") {`}
<span className="highlighted-line">    return result.propagate();</span>
{`  }
  
  return result.finalize();
}`}
                </code>
              </pre>
              
              {/* Floating AI Insight Card */}
              <div className="ai-insight-popup">
                <div className="insight-header">
                  <Sparkles size={16} className="text-gold" />
                  <span>AI Insight</span>
                </div>
                <p>Propagate() leads to a recursive loop in concurrent environments.</p>
                <button className="mini-action-btn">Analyze Logic Path</button>
                <div className="connector-line"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Neural Architecture (Bento Grid) */}
      <section id="features" className="features-section animate-fade-up">
        <h2 className="section-title">Neural Architecture</h2>
        <div className="bento-grid">
          {/* Card 1: Data Viz (Large) */}
          <div className="bento-card card-large">
            <div className="card-header">
              <BarChart3 className="text-gold" />
              <h3>Logic Pattern Analysis</h3>
            </div>
            <div className="graph-mockup">
              <div className="bar-group">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar highlight" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '40%' }}></div>
                <div className="bar" style={{ height: '75%' }}></div>
              </div>
              <div className="graph-labels">
                <span>RECURSION</span>
                <span>CONCURRENCY</span>
                <span>MEM_LEAK</span>
              </div>
            </div>
            <p className="card-desc">Identify anti-patterns before they reach production clusters.</p>
          </div>

          {/* Card 2: Interactive Toggle */}
          <div className="bento-card card-small">
            <div className="card-header">
              <Cpu className="text-gold" />
              <h3>Execution Engine</h3>
            </div>
            <div className="toggle-preview">
              <div className="toggle-track">
                <div className="toggle-thumb" style={{ marginLeft: 'auto' }}></div>
              </div>
              <div className="toggle-labels">
                <span>FIX</span>
                <span className="text-gold">LEARN</span>
              </div>
            </div>
            <p className="card-desc">Switch between auto-healing and guided learning paths.</p>
          </div>

          {/* Card 3: Shield */}
          <div className="bento-card card-small">
            <div className="card-header">
              <ShieldCheck className="text-gold" />
              <h3>74% Prevented</h3>
            </div>
            <div className="stat-circle">
              <div className="circle-bg"></div>
              <div className="circle-fill"></div>
              <span className="stat-num">74%</span>
            </div>
            <p className="card-desc">Reduction in critical production outages observed across neural nodes.</p>
          </div>

          {/* Card 4: Terminal */}
          <div className="bento-card card-medium">
            <div className="card-header">
              <Terminal className="text-gold" />
              <h3>Real-time Logs</h3>
            </div>
            <div className="terminal-mini">
              <code>{`> Analysing heap...`}</code>
              <code>{`> Stack trace mapped.`}</code>
              <code>{`> Optimization found.`}</code>
            </div>
            <p className="card-desc">Continuous feedback loop directly in your workspace.</p>
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="final-cta-section animate-fade-up">
        <div className="cta-container">
          <div className="cta-glow"></div>
          <h2>Ready to evolve?</h2>
          <p>Join the thousands of developers building resilient code with CodeMind.</p>
          <button className="signup-btn" style={{ padding: '20px 60px', fontSize: '1.1rem' }} onClick={handleCtaClick}>
            Join Node Access <ArrowRight size={22} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-brand-group">
              <div className="logo-img" style={{ width: '44px', height: '44px', fontSize: '1.5rem' }}>M</div>
              <span className="brand-name" style={{ fontSize: '1.8rem' }}>CodeMind</span>
            </div>
            <p>Evolving the future of logical execution at scale.</p>
          </div>
          
          <div className="footer-column">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#docs">Documentation</a>
            <a href="#pricing">Enterprise</a>
          </div>
          
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
          </div>
          
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>&copy; 2026 CodeMind AI. Built for the next billion logic nodes.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
