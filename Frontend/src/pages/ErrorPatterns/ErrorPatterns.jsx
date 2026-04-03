import React, { useState } from 'react';
import { Target, Activity, AlertTriangle, ChevronDown, ChevronUp, Cpu, Lightbulb } from 'lucide-react';
import './ErrorPatterns.css';

const ErrorPatterns = ({ errorHistory = [] }) => {
  const [filter, setFilter] = useState('All');
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Derive metrics
  const totalErrors = errorHistory.length;
  // Basic mock map for unique errors to count them
  const errorCounts = errorHistory.reduce((acc, session) => {
    const errType = session.response?.error?.split(':')[0] || 'Unknown Error';
    acc[errType] = (acc[errType] || 0) + 1;
    return acc;
  }, {});
  
  // Highest occurrence
  const mostFrequent = Object.keys(errorCounts).sort((a,b) => errorCounts[b] - errorCounts[a])[0] || 'None';
  
  // Weakest topic arbitrarily selected if not empty
  const weakestTopic = errorHistory.length > 0 ? (errorHistory[0].response?.patternInsight || 'Concepts') : 'Start Coding';

  const mockPatterns = [
    {
      id: 1,
      type: "ReferenceError",
      count: errorCounts["ReferenceError"] || 5,
      explanation: "You are attempting to access a variable or object property that has not been properly instantiated in memory.",
      suggestion: "Always trace variable scope declarations (let/const) and ensure they exist prior to invocation.",
      improvement: 45 // percent
    },
    {
      id: 2,
      type: "SyntaxError",
      count: errorCounts["SyntaxError"] || 3,
      explanation: "A missing bracket, comma, or undeclared string terminator is breaking the compiler parsing.",
      suggestion: "Make use of your IDE's formatting tools (Prettier) and double-check nested object declarations.",
      improvement: 80
    },
    {
      id: 3,
      type: "TypeError",
      count: errorCounts["TypeError"] || 2,
      explanation: "An operation was performed on a value of the wrong type (e.g., calling a localized string as a function).",
      suggestion: "Add types using TypeScript, or implement strict strict equality checks (typeof) before complex operations.",
      improvement: 60
    }
  ];

  const filteredPatterns = mockPatterns.filter(p => filter === 'All' || p.type.includes(filter));

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <div className="patterns-dashboard fade-in">
      <div className="patterns-header">
        <h1 className="patterns-title">Your Coding Patterns</h1>
        <p className="patterns-subtitle">CodeMind tracks your mistakes to uncover blind spots and accelerate your learning.</p>
      </div>

      <div className="patterns-metrics-grid">
        <div className="metric-box glass-panel">
          <Activity size={20} className="text-highlight mb-2" />
          <span className="metric-box-val">{totalErrors}</span>
          <span className="metric-box-label">Total Analyzed</span>
        </div>
        <div className="metric-box glass-panel text-center">
          <AlertTriangle size={20} className="text-error mb-2" />
          <span className="metric-box-val text-error">{mostFrequent}</span>
          <span className="metric-box-label">Most Frequent</span>
        </div>
        <div className="metric-box glass-panel">
          <Target size={20} className="code-blue mb-2" />
          <span className="metric-box-val" style={{fontSize: '1.2rem'}}>{weakestTopic}</span>
          <span className="metric-box-label">Weakest Topic</span>
        </div>
        <div className="metric-box glass-panel">
          <Activity size={20} className="text-success mb-2" />
          <span className="metric-box-val text-success">+24%</span>
          <span className="metric-box-label">Improvement Score</span>
        </div>
      </div>

      <div className="patterns-main glass-panel">
        <div className="patterns-controls">
          <div className="patterns-tabs">
            <button className={`p-tab ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
            <button className={`p-tab ${filter === 'Syntax' ? 'active' : ''}`} onClick={() => setFilter('Syntax')}>Syntax</button>
            <button className={`p-tab ${filter === 'Error' ? 'active' : ''}`} onClick={() => setFilter('Error')}>Logic Errors</button>
          </div>
          <div className="p-search">
            <input type="text" placeholder="Search patterns..." className="p-search-input" />
          </div>
        </div>

        <div className="patterns-list">
          {filteredPatterns.map(pattern => (
            <div key={pattern.id} className={`pattern-card ${expandedCardId === pattern.id ? 'expanded' : ''}`}>
              
              <div className="pattern-card-header" onClick={() => toggleExpand(pattern.id)}>
                <div className="pattern-title-group">
                  <h3 className="pattern-type">{pattern.type}</h3>
                  <span className="pattern-count">Occurred {pattern.count} times</span>
                </div>
                <div className="pattern-improvement">
                  <div className="imp-bar"><div className="imp-fill" style={{width: `${pattern.improvement}%`}}></div></div>
                  <span>{pattern.improvement}%</span>
                </div>
                <button className="expand-btn">
                  {expandedCardId === pattern.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {expandedCardId === pattern.id && (
                <div className="pattern-card-body fade-in">
                  <div className="pattern-insight">
                    <span className="insight-lbl"><Cpu size={14} className="icon-pattern"/> Explanation</span>
                    <p>{pattern.explanation}</p>
                  </div>
                  <div className="pattern-suggestion">
                    <span className="insight-lbl"><Lightbulb size={14} className="icon-tip"/> AI Suggestion</span>
                    <p>{pattern.suggestion}</p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPatterns;
