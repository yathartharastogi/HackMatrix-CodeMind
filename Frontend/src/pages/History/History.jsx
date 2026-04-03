import React, { useState } from 'react';
import { History as HistoryIcon, Search, Code, Clock, CheckCircle2, AlertCircle, FileText, Filter } from 'lucide-react';
import './History.css';

const History = ({ errorHistory = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = errorHistory.filter(item => 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.response?.errorType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-page animate-fade-up">
      <div className="insights-title-section">
        <h1 className="history-page-title">Neural <span className="text-gold">Sessions</span></h1>
        <p className="insights-subtitle">Complete chronological trace of your logical evolution</p>
      </div>

      <div className="history-controls glass-panel">
         <div className="search-container">
           <Search size={18} className="text-gold" />
           <input 
             type="text" 
             placeholder="Search session clusters..." 
             className="search-input"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <button className="secondary-gold-btn" style={{ padding: '8px 20px', borderRadius: '10px' }}>
           <Filter size={16} style={{ marginRight: '8px' }} /> ADVANCED FILTER
         </button>
      </div>

      <div className="history-table-container">
        {filteredHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th><Clock size={14} /> Timestamp</th>
                <th><Code size={14} /> Node Structure</th>
                <th><FileText size={14} /> Classification</th>
                <th><CheckCircle2 size={14} /> Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((session, index) => (
                <tr key={index}>
                  <td style={{ color: 'var(--color-primary)', fontWeight: 800 }}>
                    {new Date(session.date).toLocaleDateString()}
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 500 }}>
                      {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <span className="lang-badge" style={{ verticalAlign: 'middle', marginRight: '12px' }}>{session.language}</span>
                    <span style={{ fontSize: '0.85rem', color: '#BBB' }}>{session.code.substring(0, 40)}...</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>
                    {session.response?.errorType || "Logical Optimized"}
                  </td>
                  <td>
                    <div className={`status-cell ${session.status === 'Resolved' ? 'status-resolved' : 'status-needs-improvement'}`}>
                      <div className="status-dot"></div>
                      {session.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-history-state">
            <HistoryIcon size={64} className="empty-icon" />
            <p>No neural sessions detected. Initiate your first analysis to begin tracking.</p>
            <button className="primary-gold-btn" style={{ marginTop: '32px' }}>Initiate Scan</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
