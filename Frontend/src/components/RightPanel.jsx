import React from 'react';
import { Bot, Lightbulb, ShieldAlert, Cpu } from 'lucide-react';
import './RightPanel.css';

const RightPanel = ({ isLoading, aiResponse }) => {
  return (
    <aside className="ai-panel glass-panel">
      
      <div className="ai-header">
        <Bot size={28} className="ai-icon-main" />
        <h2 className="ai-title">AI Analysis</h2>
      </div>

      <div className="ai-content-scroll custom-scrollbar">
        
        {!isLoading && !aiResponse && (
          <div className="ai-empty-state">
            <Bot size={48} className="ai-empty-icon" />
            <p>Submit your code snippet to see AI insights.</p>
          </div>
        )}

        {isLoading && (
          <div className="ai-loading-state">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-icon pulse-bg"></div>
                  <div className="skeleton-title pulse-bg"></div>
                </div>
                <div className="skeleton-lines">
                  <div className="skeleton-line pulse-bg w-full"></div>
                  <div className="skeleton-line pulse-bg w-80"></div>
                  <div className="skeleton-line pulse-bg w-60"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && aiResponse && (
          <div className="ai-results fade-in">
            
            {/* Error Explanation */}
            <div className="ai-result-card group">
              <div className="result-header">
                <ShieldAlert size={18} className="result-icon icon-error" />
                <h3>Error Explanation</h3>
              </div>
              <p className="result-body">
                <span className="highlight-tag">{aiResponse.error || "Syntax or Logic Error"}</span>
                <br/><br/>
                {aiResponse.explanation || "An unexpected error occurred in your snippet."}
              </p>
            </div>

            {/* Pattern Insight */}
            <div className="ai-result-card group">
              <div className="result-header">
                <Cpu size={18} className="result-icon icon-pattern" />
                <h3>Pattern Insight</h3>
              </div>
              <p className="result-body">
                {aiResponse.patternInsight || "No recurring patterns detected yet."}
              </p>
            </div>

            {/* Learning Tip */}
            <div className="ai-result-card group">
              <div className="result-header">
                <Lightbulb size={18} className="result-icon icon-tip" />
                <h3>Learning Tip</h3>
              </div>
              <p className="result-body">
                {aiResponse.learningTip || "Review the basic principles of this concept."}
                <br/><br/>
                <a href="#" className="learning-link">Review related documentation →</a>
              </p>
            </div>

          </div>
        )}

      </div>

      <div className="ai-footer">
        <button 
           disabled={isLoading || !aiResponse}
           className={`practice-btn ${isLoading || !aiResponse ? 'disabled' : ''}`}
        >
          Practice Fix
        </button>
      </div>

    </aside>
  );
};

export default RightPanel;
