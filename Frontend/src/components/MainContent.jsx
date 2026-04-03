import React from 'react';
import { Sparkles, Activity, BookOpen, Target, History, TrendingUp, Cpu, ShieldAlert } from 'lucide-react';
import './MainContent.css';

const MainContent = ({ inputText, setInputText, selectedLanguage, setSelectedLanguage, handleAnalyze, isLoading, errorHistory = [], userPatterns = [] }) => {
  const featureCards = [
    { icon: <Activity className="feature-icon-svg" size={20} />, title: "View Error Patterns", desc: "Identify recurring bugs in your logic" },
    { icon: <BookOpen className="feature-icon-svg" size={20} />, title: "Suggested Learning", desc: "Resources based on your weaknesses" },
    { icon: <Target className="feature-icon-svg" size={20} />, title: "Track Progress", desc: "Track your debugging improvement" },
    { icon: <History className="feature-icon-svg" size={20} />, title: "Recent Sessions", desc: `${errorHistory.length} snippets analyzed` },
  ];

  const frequentError = errorHistory.length > 0 
    ? (errorHistory[0].response?.error?.split(':')[0] || "Syntax Info") 
    : "None yet";
  
  const weakTopic = errorHistory.length > 0
    ? (errorHistory[0].response?.patternInsight || "Async / Await")
    : "Start coding to find out";

  return (
    <main className="main-content">
      
      {/* Welcome Section */}
      <section className="welcome">
        <h1 className="welcome-title">Welcome back, Harsh 👋</h1>
        <p className="welcome-subtitle">Your diagnostic neural workspace is ready.</p>
      </section>


      {/* Feature Cards Grid - Compact Layout */}
      <section className="features-grid">
        {featureCards.map((card, idx) => (
          <div key={idx} className="glass-panel feature-card">
            <div className="feature-icon-wrapper">
              {card.icon}
            </div>
            <div className="feature-content">
              <h3 className="feature-title">{card.title}</h3>
              <p className="feature-desc">{card.desc}</p>
            </div>
            <button className="feature-action-btn">Explore →</button>
          </div>
        ))}
      </section>

      {/* Debugging Analytics Section - Premium Visuals */}
      <section className="insights-section">
        <h2 className="insights-heading">
          <TrendingUp size={24} className="text-gold" style={{ filter: 'drop-shadow(0 0 5px var(--color-primary))' }} /> 
          Debugging Analytics
        </h2>
        
        <div className="insights-grid">
          
          <div className="glass-panel insight-card">
            <div className="insight-top-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="insight-label">Logical Hotspot</span>
              <ShieldAlert size={16} className="text-error" />
            </div>
            <h3 className="insight-value text-error" style={{ fontSize: '1.25rem', marginTop: '4px' }}>{frequentError}</h3>
            <p className="insight-meta" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Found in 84% of recent traces.</p>
            <div className="progress-bg">
              <div className="progress-fill bg-error" style={{ width: errorHistory.length > 0 ? '75%' : '0%' }}></div>
            </div>
          </div>
          
          <div className="glass-panel insight-card">
            <div className="insight-top-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="insight-label">Cognitive Focus</span>
              <Cpu size={16} className="text-gold" />
            </div>
            <h3 className="insight-value" style={{ fontSize: '1.15rem', marginTop: '4px' }}>{weakTopic}</h3>
            <p className="insight-meta" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Impact: -1.2s avg resolution time.</p>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: errorHistory.length > 0 ? '40%' : '0%' }}></div>
            </div>
          </div>

          <div className="glass-panel insight-card">
            <div className="insight-top-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="insight-label">System Performance</span>
              <TrendingUp size={16} className="text-success" />
            </div>
            <h3 className="insight-value text-success" style={{ fontSize: '1.5rem', marginTop: '4px' }}>+15% Growth</h3>
            <p className="insight-meta" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Accuracy gain over the last 7 days.</p>
            <div className="progress-bg">
              <div className="progress-fill bg-success" style={{ width: '85%' }}></div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default MainContent;
