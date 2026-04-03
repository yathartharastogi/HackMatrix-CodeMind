import React from 'react';
import { User, Activity, CheckCircle, TrendingUp, History, Zap } from 'lucide-react';
import './Profile.css';

const Profile = ({ errorHistory }) => {
  const totalSolved = errorHistory.length;
  // Mock logic for improved rate
  const improvementRate = totalSolved > 0 ? "+12%" : "0%";

  return (
    <div className="profile-dashboard fade-in">
      
      {/* Overview Card */}
      <section className="profile-overview-card glass-panel">
        <div className="profile-avatar-large">
          <User size={48} />
        </div>
        <div className="profile-details">
          <h1 className="profile-name-large">Harsh</h1>
          <p className="profile-email-large">harsh@codemind.ai</p>
          <div className="profile-badges">
            <span className="skill-badge-large"><Zap size={14} /> Intermediate Developer</span>
            <span className="achievement-badge"><CheckCircle size={14} /> Bug Squasher</span>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="profile-metrics-row">
        <div className="metric-card glass-panel group">
          <div className="metric-icon-wrapper">
            <Activity size={24} className="metric-icon code-teal" />
          </div>
          <div className="metric-data">
            <h3 className="metric-value">{totalSolved}</h3>
            <p className="metric-label">Total Errors Solved</p>
          </div>
        </div>
        <div className="metric-card glass-panel group">
          <div className="metric-icon-wrapper">
            <TrendingUp size={24} className="metric-icon code-blue" />
          </div>
          <div className="metric-data">
            <h3 className="metric-value text-success">{improvementRate}</h3>
            <p className="metric-label">Improvement Rate</p>
          </div>
        </div>
      </section>

      {/* Main Content Split */}
      <div className="profile-main-split">
        
        {/* Left: Progression */}
        <section className="progression-section glass-panel">
          <h2 className="section-title">Skill Progression</h2>
          <div className="progression-path">
            <div className="skill-track">
              <div className="skill-node completed">Beginner</div>
              <div className="skill-line completed"></div>
              <div className="skill-node current">Intermediate</div>
              <div className="skill-line pending"></div>
              <div className="skill-node pending">Advanced</div>
            </div>
            
            <div className="xp-container">
              <div className="xp-header">
                <span>Current XP: 3,450</span>
                <span>Next Rank: 5,000</span>
              </div>
              <div className="progress-bg mt-2">
                <div className="progress-fill bg-highlight" style={{ width: '69%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Recent Sessions */}
        <section className="recent-sessions-section glass-panel custom-scrollbar">
          <h2 className="section-title"><History size={18} /> Recent Sessions</h2>
          <div className="sessions-list">
            {errorHistory.length === 0 ? (
              <p className="empty-state-text">No recent coding sessions found.</p>
            ) : (
              errorHistory.slice(0, 5).map((session, idx) => (
                <div key={idx} className="session-item">
                  <div className="session-header">
                    <span className="session-lang">{session.language}</span>
                    <span className="session-date">{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="session-error">
                    {session.response?.error?.split(':')[0] || 'Syntax Error'}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Profile;
