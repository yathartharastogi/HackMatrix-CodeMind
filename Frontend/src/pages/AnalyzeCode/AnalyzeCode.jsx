import React, { useState } from 'react';
import { Sparkles, UploadCloud, ChevronDown, Loader2 } from 'lucide-react';
import RightPanel from '../../components/RightPanel';
import './AnalyzeCode.css';

const AnalyzeCode = ({
  inputText,
  setInputText,
  selectedLanguage,
  setSelectedLanguage,
  handleAnalyze,
  isLoading,
  aiResponse
}) => {
  const [showWarning, setShowWarning] = useState(false);

  const onAnalyzeClick = () => {
    if (!inputText.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    handleAnalyze();
  };

  return (
    <div className="analyze-workspace">
      {/* Left Panel: Interaction Hub */}
      <section className="analyze-left-panel">
        <div className="analyze-header">
          <h1 className="analyze-title">Ask CodeMind</h1>
          <p className="analyze-subtitle">Paste your code or describe your error in natural language.</p>
        </div>

        <div className="analyze-interaction-card glass-panel">
          <div className="interaction-header">
            <span className="lang-label">Language:</span>
            <div className="custom-select-wrapper">
              <select 
                className="elegant-lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isLoading}
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="TypeScript">TypeScript</option>
              </select>
              <ChevronDown className="select-icon" size={14} />
            </div>
          </div>

          <div className="interaction-body">
            <textarea
              className={`modern-textarea ${showWarning ? 'textarea-warning' : ''}`}
              placeholder="Paste your code or describe your error..."
              value={inputText}
              onChange={(e) => {
                if(showWarning) setShowWarning(false);
                setInputText(e.target.value);
              }}
              disabled={isLoading}
            ></textarea>
            {showWarning && (
              <span className="inline-warning fade-in">
                Please enter some code or a question to analyze.
              </span>
            )}
          </div>

          <div className="interaction-footer">
            <button className="hollow-btn upload-btn" disabled={isLoading}>
              <UploadCloud size={18} />
              <span>Upload File</span>
            </button>
            
            <button 
              className={`primary-cta-btn ${isLoading ? 'is-loading' : ''}`} 
              onClick={onAnalyzeClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="pulse-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze Code</span>
                </>
              )}
              {/* The glowing underlay */}
              <div className="btn-glow-pulse"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Right Panel: AI Response (reusing existing component but structured dynamically) */}
      <section className="analyze-right-panel">
        <RightPanel isLoading={isLoading} aiResponse={aiResponse} />
      </section>
    </div>
  );
};

export default AnalyzeCode;
