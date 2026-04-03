import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award, Zap, BookOpen, AlertCircle, Sparkles, Cpu } from 'lucide-react';
import './Insights.css';

const Insights = ({ errorHistory = [] }) => {
  const [learningScore, setLearningScore] = useState(0);
  const targetScore = 84;

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

  const weakestTopic = errorHistory.length > 0 ? (errorHistory[0].response?.category || "React Hooks") : "None Detected";
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
    <div className="insights-page animate-fade-up">
      <div className="insights-title-section">
        <h1 className="insights-title">Neural <span className="text-gold">Insights</span></h1>
        <p className="insights-subtitle">Performance Map of your Cognitive Progress</p>
      </div>

      <div className="insights-masonry-grid">
        <div className="insight-block glass-panel">
          <div className="insight-block-header">
             <div className="insight-icon-ring"><Target size={20} /></div>
             <h3 className="insight-block-title">Mastery Score</h3>
          </div>
          <div className="insight-metric-strip">
             <div className="metric-item">
                <span className="metric-val">{learningScore}%</span>
                <span className="metric-lbl">Neural Sync</span>
             </div>
             <div className="metric-item">
                <span className="metric-val">{improvementRate}</span>
                <span className="metric-lbl">Acceleration</span>
             </div>
          </div>
          <p className="insight-summary">Your neural mastery has increased by 18% since your last session. Focus is trending towards advanced logic.</p>
        </div>

        <div className="insight-block glass-panel">
          <div className="insight-block-header">
             <div className="insight-icon-ring"><Award size={20} /></div>
             <h3 className="insight-block-title">Cognitive Standing</h3>
          </div>
          <div className="insight-recommendation" style={{ fontStyle: 'normal' }}>
             Strongest Node: <strong className="text-gold">{strongestTopic}</strong><br />
             Weakest Node: <strong className="text-error">{weakestTopic}</strong>
          </div>
          <p className="insight-summary">The AI engine detects high confidence in layout patterns, but warns about potential reference leaks.</p>
        </div>
      </div>

      <div className="insights-masonry-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
         <div className="insight-block glass-panel">
           <div className="insight-block-header">
              <BookOpen size={20} className="text-gold" />
              <h3 className="insight-block-title">Recommended Nodes</h3>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{ padding: '20px', background: '#000', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: 800 }}>{rec.title}</h4>
                      <span className="prevalence-label">{rec.difficulty}</span>
                   </div>
                   <p className="insight-summary" style={{ fontSize: '0.85rem' }}>{rec.desc}</p>
                   <button className="cta-insight-btn" style={{ marginTop: '16px', padding: '8px 20px', fontSize: '0.7rem' }}>Sync Insight</button>
                </div>
              ))}
           </div>
         </div>

         <div className="insight-block glass-panel">
           <div className="insight-block-header">
              <Zap size={20} className="text-gold" />
              <h3 className="insight-block-title">Neural Flux Map</h3>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {progressBars.map((skill, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="prevalence-label">{skill.label}</span>
                      <span className="prevalence-rate">{skill.value}%</span>
                   </div>
                   <div className="progress-bg">
                      <div className="progress-fill" style={{ width: `${skill.value}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
         </div>
      </div>
    </div>
  );
};

export default Insights;
