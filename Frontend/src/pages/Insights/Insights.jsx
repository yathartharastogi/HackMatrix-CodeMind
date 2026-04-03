import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, Zap, BookOpen, AlertCircle } from 'lucide-react';
import './Insights.css';

const Insights = ({ errorHistory = [] }) => {
  const [learningScore, setLearningScore] = useState(0);
  const targetScore = 84; // Mock score

  // Simple count up effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLearningScore(prev => {
        if (prev < targetScore) return prev + 2;
        clearInterval(timer);
        return targetScore;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  // Derive simple metrics from mock or history
  const weakestTopic = errorHistory.length > 0 ? "React Hooks" : "None Detected";
  const strongestTopic = "CSS Layouts";
  const improvementRate = "+18%";

  const progressBars = [
    { label: "Loops & Iteration", value: 90 },
    { label: "State Management", value: 65 },
    { label: "Error Handling", value: 45 },
    { label: "Recursion", value: 30 },
  ];

  const recommendations = [
    { title: "Mastering useEffect", desc: "Learn how to safely map dependencies to avoid infinite loops.", difficulty: "Intermediate" },
    { title: "Defensive Coding", desc: "Best practices for writing bulletproof error handling blocks.", difficulty: "Beginner" },
  ];

  return (
    <div className="insights-dashboard fade-in">
      <div className="insights-header">
        <h1 className="insights-title">Learning Insights</h1>
        <p className="insights-subtitle">Track your growth and improve your coding skills with AI guidance.</p>
      </div>

      <div className="insights-metrics-grid">
        <div className="insight-metric-card glass-panel group">
          <Target size={24} className="metric-icon text-success mb-3" />
          <h3 className="insight-metric-val">{strongestTopic}</h3>
          <span className="insight-metric-label">Strongest Topic</span>
        </div>
        
        <div className="insight-metric-card glass-panel group">
          <AlertCircle size={24} className="metric-icon text-error mb-3" />
          <h3 className="insight-metric-val text-error">{weakestTopic}</h3>
          <span className="insight-metric-label">Weakest Topic</span>
        </div>

        <div className="insight-metric-card glass-panel group">
          <Award size={24} className="metric-icon code-teal mb-3" />
          <h3 className="insight-metric-val code-teal">{learningScore}/100</h3>
          <span className="insight-metric-label">Overall Learning Score</span>
        </div>

        <div className="insight-metric-card glass-panel group">
          <TrendingUp size={24} className="metric-icon code-blue mb-3" />
          <h3 className="insight-metric-val code-blue">{improvementRate}</h3>
          <span className="insight-metric-label">Improvement Rate</span>
        </div>
      </div>

      <div className="insights-main-split">
        
        {/* Recommended Learning */}
        <div className="insights-section glass-panel recommended-section">
          <h2 className="insights-section-title"><BookOpen size={20} /> Recommended Learning</h2>
          <div className="rec-list">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="rec-card">
                <div className="rec-header">
                  <h4 className="rec-title">{rec.title}</h4>
                  <span className={`diff-badge ${rec.difficulty.toLowerCase()}`}>{rec.difficulty}</span>
                </div>
                <p className="rec-desc">{rec.desc}</p>
                <button className="primary-cta-btn sm-btn">Start Learning</button>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="insights-section glass-panel progress-section">
          <h2 className="insights-section-title"><Zap size={20} /> Skill Progress</h2>
          <div className="skill-bars-list">
            {progressBars.map((skill, idx) => (
              <div key={idx} className="skill-bar-wrapper">
                <div className="sb-header">
                  <span className="sb-label">{skill.label}</span>
                  <span className="sb-val">{skill.value}%</span>
                </div>
                <div className="sb-bg">
                  <div 
                    className="sb-fill" 
                    style={{ 
                      width: `${skill.value}%`, 
                      background: skill.value < 50 ? 'var(--error)' : skill.value < 80 ? 'var(--primary)' : '#48bb78'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="recent-improvement-highlight">
            <TrendingUp size={16} className="text-success" />
            <span>Reduced syntax errors by <strong>30%</strong> this week!</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;
