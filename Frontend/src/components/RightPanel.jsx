import React from 'react';
import { Bot, Lightbulb, ShieldAlert, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
import './RightPanel.css';

const RightPanel = ({ isLoading, aiResponse }) => {
  return (
    <aside className="ai-panel glass-panel">
      
      <div className="ai-header">
        <Bot size={28} className="ai-icon-main" />
        <h2 className="ai-title">AI Agent Insights</h2>
      </div>

      <div className="ai-content-scroll custom-scrollbar">
        
        {!isLoading && !aiResponse && (
          <div className="ai-empty-state">
            <Bot size={48} className="ai-empty-icon" />
            <p>CodeMind Agent is ready. Paste your code and click Analyze.</p>
          </div>
        )}

        {isLoading && (
          <div className="ai-loading-state">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-icon pulse-bg"></div>
                  <div className="skeleton-title pulse-bg"></div>
                </div>
                <div className="skeleton-lines">
                  <div className="skeleton-line pulse-bg w-full"></div>
                  <div className="skeleton-line pulse-bg w-80"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && aiResponse && (
          <div className="ai-results">
            
            {/* Error Type & Analysis */}
            <div className="ai-result-card fade-in delay-1">
              <div className="result-header">
                <ShieldAlert size={18} className="result-icon icon-error" />
                <h3>Error Analysis</h3>
              </div>
              <div className="result-body">
                <div className="error-badge">{aiResponse.errorType || "Logical Pattern"}</div>
                <p className="explanation-text">
                  {aiResponse.explanation || "No major syntax errors detected, but logic optimization is possible."}
                </p>
              </div>
            </div>

            {/* Suggested Fix */}
            <div className="ai-result-card fade-in delay-2">
              <div className="result-header">
                <CheckCircle2 size={18} className="result-icon icon-fix" />
                <h3>Suggested Fix</h3>
              </div>
              <div className="result-body">
                <pre className="code-fix-block">
                  <code>{aiResponse.suggestedFix || "// Code looks solid!"}</code>
                </pre>
              </div>
            </div>

            {/* Learning Insight */}
            <div className="ai-result-card fade-in delay-3">
              <div className="result-header">
                <Lightbulb size={18} className="result-icon icon-tip" />
                <h3>Learning Insight</h3>
              </div>
              <div className="result-body">
                <p className="insight-text">
                  {aiResponse.learningInsight || "Keep practicing these concepts to master the language."}
                </p>
                {aiResponse.rootCause && (
                  <div className="root-cause-tag">
                    <strong>Root Cause:</strong> {aiResponse.rootCause}
                  </div>
                )}
              </div>
            </div>

            {/* Pattern Awareness */}
            {aiResponse.category && (
              <div className="ai-result-card fade-in delay-4 secondary-card">
                <div className="result-header">
                  <Cpu size={16} className="result-icon icon-pattern" />
                  <h3>Concept Category</h3>
                </div>
                <div className="result-body">
                  <span className="category-pill">{aiResponse.category}</span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      <div className="ai-footer">
        <button 
           disabled={isLoading || !aiResponse}
           className={`practice-btn ${isLoading || !aiResponse ? 'disabled' : ''}`}
        >
          <span>Deep Dive Study</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </aside>
  );
};

export default RightPanel;
