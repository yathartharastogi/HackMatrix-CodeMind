import React, { useState } from 'react';
import { Target, Activity, AlertTriangle, ChevronDown, ChevronUp, Cpu, Lightbulb, TrendingUp } from 'lucide-react';
import './ErrorPatterns.css';

const ErrorPatterns = ({ errorHistory = [] }) => {
  const [filter, setFilter] = useState('All');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const totalErrors = errorHistory.length;
  const errorCounts = errorHistory.reduce((acc, session) => {
    const errType = session.response?.errorType || 'Logical Pattern';
    acc[errType] = (acc[errType] || 0) + 1;
    return acc;
  }, {});
  
  const mostFrequent = Object.keys(errorCounts).sort((a,b) => errorCounts[b] - errorCounts[a])[0] || 'None';
  const weakestTopic = errorHistory.length > 0 ? (errorHistory[0].response?.category || 'Concepts') : 'Start Coding';

  const mockPatterns = [
    {
      id: 1,
      type: "ReferenceError",
      count: errorCounts["ReferenceError"] || 5,
      explanation: "Attempting to access variables that have not been properly instantiated in memory.",
      suggestion: "Trace variable scope declarations and ensure they exist prior to invocation.",
      prevalence: "High",
      improvement: 45
    },
    {
      id: 2,
      type: "SyntaxError",
      count: errorCounts["SyntaxError"] || 3,
      explanation: "Broken compiler parsing due to missing brackets, commas, or string terminators.",
      suggestion: "Use Prettier formatting and double-check nested object declarations.",
      prevalence: "Medium",
      improvement: 80
    },
    {
      id: 3,
      type: "TypeError",
      count: errorCounts["TypeError"] || 2,
      explanation: "Operations performed on values of the wrong type (e.g., calling a string as a function).",
      suggestion: "Implement strict equality checks and consider TypeScript for type safety.",
      prevalence: "Low",
      improvement: 60
    }
  ];

  const filteredPatterns = mockPatterns.filter(p => filter === 'All' || p.type.includes(filter));

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <div className="patterns-page animate-fade-up">
      <div className="patterns-header">
        <h1 className="patterns-title">Neural <span className="text-gold">Patterns</span></h1>
        <p className="patterns-subtitle">CodeMind maps your logical blind spots to accelerate your neural growth.</p>
      </div>

      <div className="patterns-grid">
        <div className="pattern-card glass-panel group">
          <div className="pattern-header">
            <div className="pattern-icon"><Activity size={24} /></div>
            <span className="pattern-count">{totalErrors}</span>
          </div>
          <div className="pattern-content">
            <h3 className="pattern-title">Sessions Mapped</h3>
            <p className="pattern-desc">Total code structures analyzed by the neural engine.</p>
          </div>
        </div>

        <div className="pattern-card glass-panel group">
          <div className="pattern-header">
            <div className="pattern-icon"><AlertTriangle size={24} className="text-error" /></div>
            <span className="pattern-count text-error">!</span>
          </div>
          <div className="pattern-content">
            <h3 className="pattern-title">Frequent: {mostFrequent}</h3>
            <p className="pattern-desc">Your most recurring logical dissonance across all sessions.</p>
          </div>
        </div>

        <div className="pattern-card glass-panel group">
          <div className="pattern-header">
            <div className="pattern-icon"><Target size={24} /></div>
            <span className="pattern-count">{weakestTopic.charAt(0)}</span>
          </div>
          <div className="pattern-content">
            <h3 className="pattern-title">Weak Node: {weakestTopic}</h3>
            <p className="pattern-desc">The concept requiring the most immediate cognitive focus.</p>
          </div>
        </div>
      </div>

      <div className="insights-heading" style={{ marginTop: '20px' }}>
         Deep Diagnostic Report
      </div>

      <div className="patterns-grid" style={{ gridTemplateColumns: '1fr' }}>
        {filteredPatterns.map(pattern => (
          <div key={pattern.id} className="pattern-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => toggleExpand(pattern.id)}>
            <div className="pattern-header" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="pattern-icon"><Cpu size={20} /></div>
                <div>
                   <h3 className="pattern-title" style={{ marginBottom: '4px' }}>{pattern.type}</h3>
                   <span className="prevalence-label">PREVALENCE: <span className="prevalence-rate">{pattern.prevalence}</span></span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pattern-count" style={{ fontSize: '1.2rem', opacity: 1, color: 'var(--color-primary)' }}>{pattern.improvement}%</div>
                <span className="prevalence-label">MASTERY</span>
              </div>
            </div>

            {expandedCardId === pattern.id && (
              <div className="animate-fade-up" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div>
                       <span className="prevalence-label" style={{ display: 'block', marginBottom: '12px' }}>Cognitive Explanation</span>
                       <p className="pattern-desc" style={{ color: '#FFF' }}>{pattern.explanation}</p>
                    </div>
                    <div>
                       <span className="prevalence-label" style={{ display: 'block', marginBottom: '12px' }}>Neural Correction</span>
                       <p className="pattern-desc" style={{ color: 'var(--color-primary)' }}>{pattern.suggestion}</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorPatterns;
