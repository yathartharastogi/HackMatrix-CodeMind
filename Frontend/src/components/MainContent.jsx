import React from 'react';
import { Sparkles, UploadCloud, ChevronDown, Activity, BookOpen, Target, History, Loader2 } from 'lucide-react';
import './MainContent.css';

const MainContent = ({ inputText, setInputText, selectedLanguage, setSelectedLanguage, handleAnalyze, isLoading, errorHistory = [], userPatterns = [] }) => {
  const featureCards = [
    { icon: <Activity className="feature-icon-svg" size={24} />, title: "View Error Patterns", desc: "Identify recurring bugs in your logic" },
    { icon: <BookOpen className="feature-icon-svg" size={24} />, title: "Suggested Learning", desc: "Resources based on your weaknesses" },
    { icon: <Target className="feature-icon-svg" size={24} />, title: "Track Progress", desc: "Track your debugging improvement" },
    { icon: <History className="feature-icon-svg" size={24} />, title: "Recent Sessions", desc: `${errorHistory.length} snippets analyzed` },
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
        <p className="welcome-subtitle">Debug smarter with AI insights</p>
      </section>


      {/* Feature Cards Grid */}
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

      {/* Insights Section */}
      <section className="insights-section">
        <h2 className="insights-heading">
          <Target size={20} className="text-highlight"/> Your Debugging Analytics
        </h2>
        <div className="insights-grid">
          
          <div className="glass-panel insight-card">
            <span className="insight-label">Frequent Error</span>
            <h3 className="insight-value text-error">{frequentError}</h3>
            <div className="progress-bg mt-2">
              <div className="progress-fill bg-error" style={{ width: errorHistory.length > 0 ? '75%' : '0%' }}></div>
            </div>
          </div>
          
          <div className="glass-panel insight-card">
            <span className="insight-label">Weak Topic</span>
            <h3 className="insight-value" style={{ fontSize: '1rem' }}>{weakTopic}</h3>
            <div className="progress-bg mt-2">
              <div className="progress-fill" style={{ width: errorHistory.length > 0 ? '40%' : '0%' }}></div>
            </div>
          </div>

          <div className="glass-panel insight-card">
            <span className="insight-label">Learning Score</span>
            <h3 className="insight-value text-success">+15% Accuracy</h3>
            <div className="progress-bg mt-2">
              <div className="progress-fill bg-success" style={{ width: '85%' }}></div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default MainContent;
