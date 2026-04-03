import React, { useState } from 'react';
import { Search, Filter, Clock, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import './History.css';

const History = ({ errorHistory = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const toggleExpand = (index) => {
    setExpandedRowId(expandedRowId === index ? null : index);
  };

  // Filter Logic
  const filteredHistory = errorHistory.filter(session => {
    const matchesSearch = session.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (session.response?.error || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLang === 'All' || session.language === filterLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="history-dashboard fade-in">
      <div className="history-header">
        <h1 className="history-title">Analysis History</h1>
        <p className="history-subtitle">Review your past sessions and track your debugging journey.</p>
      </div>

      <div className="history-controls glass-panel">
        <div className="h-search-box">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search past sessions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-search-input"
          />
        </div>
        <div className="h-filters">
          <Filter size={18} className="text-muted" />
          <select 
            className="h-select" 
            value={filterLang} 
            onChange={(e) => setFilterLang(e.target.value)}
          >
            <option value="All">All Languages</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
          </select>
        </div>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-history-state glass-panel">
            <Clock size={32} className="text-muted mb-3" />
            <p>No analysis history found matching your filters.</p>
          </div>
        ) : (
          filteredHistory.map((session, idx) => {
            const isExpanded = expandedRowId === idx;
            const errorType = session.response?.error?.split(':')[0] || 'Unknown Error';
            const shortCode = session.code.substring(0, 60) + (session.code.length > 60 ? '...' : '');
            const isResolved = session.status === 'Resolved';

            return (
              <div key={idx} className={`history-card glass-panel ${isExpanded ? 'expanded' : ''}`}>
                <div className="h-card-header" onClick={() => toggleExpand(idx)}>
                  <div className="h-card-meta">
                    <span className="h-lang-badge">{session.language}</span>
                    <span className="h-time"><Clock size={14} /> {new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="h-card-main-info">
                    <div className="h-error-col">
                      <span className="h-err-lbl">Detected Issue</span>
                      <span className="h-err-val">{errorType}</span>
                    </div>
                    <div className="h-code-col">
                      <span className="h-code-snippet">{shortCode}</span>
                    </div>
                  </div>
                  <div className="h-card-actions">
                    <div className={`h-status ${isResolved ? 'resolved' : 'needs-work'}`}>
                      {isResolved ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      <span>{session.status}</span>
                    </div>
                    <button className="h-expand-btn">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="h-card-body fade-in">
                    <div className="h-details-grid">
                      <div className="h-detail-block">
                        <span className="h-block-title">Original Input</span>
                        <pre className="h-code-block">{session.code}</pre>
                      </div>
                      <div className="h-detail-block">
                        <span className="h-block-title">AI Explanation</span>
                        <p className="h-text-block">{session.response?.explanation || 'No explanation available.'}</p>
                      </div>
                      <div className="h-detail-block">
                        <span className="h-block-title">Suggested Fix</span>
                        <pre className="h-code-block fix">{session.response?.fix || 'No fix available.'}</pre>
                      </div>
                      <div className="h-detail-block">
                        <span className="h-block-title">Learning Tip</span>
                        <p className="h-text-block tip">{session.response?.learningTip || 'Keep coding to uncover tips!'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
