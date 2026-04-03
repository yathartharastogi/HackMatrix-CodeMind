import React from 'react';
import { User, Mail, Award, Clock, Activity, Target, Settings, LogOut, Code, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ errorHistory = [] }) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const userStats = [
    { label: "Neural Score", value: "840", icon: <Activity size={20} /> },
    { label: "Sessions", value: errorHistory.length, icon: <Clock size={20} /> },
    { label: "Accuracy", value: "+18%", icon: <Target size={20} /> },
    { label: "Rank", value: "Elite", icon: <Award size={20} /> },
  ];

  return (
    <div className="profile-page animate-fade-up">
      <div className="profile-header glass-panel">
         <div className="profile-avatar-large">H</div>
         <div className="profile-main-info">
            <h1 className="profile-name-title">Harsh Vardhan</h1>
            <p className="profile-rank">PRO NODE • {session?.user?.email || 'harsh@codemind.ai'}</p>
         </div>
         <div style={{ display: 'flex', gap: '16px' }}>
            <button className="secondary-gold-btn" style={{ padding: '10px 20px', borderRadius: '10px' }}>
               <Settings size={18} style={{ marginRight: '8px' }} /> SETTINGS
            </button>
            <button className="secondary-gold-btn" onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: '10px', color: '#FF4D4D', borderColor: 'rgba(255, 77, 77, 0.2)' }}>
               <LogOut size={18} style={{ marginRight: '8px' }} /> DISCONNECT
            </button>
         </div>
      </div>

      <div className="profile-stats-grid">
         {userStats.map((stat, i) => (
           <div key={i} className="p-stat-card">
              <span className="p-stat-label">{stat.label}</span>
              <div className="p-stat-value">{stat.value}</div>
              <div className="p-stat-icon">{stat.icon}</div>
           </div>
         ))}
      </div>

      <div className="profile-performance">
         <div className="p-activity-card">
            <div className="perf-header">
               <Activity size={20} /> Neural Flux History
            </div>
            <div className="activity-list">
               {errorHistory.slice(0, 4).map((session, i) => (
                 <div key={i} className="activity-item">
                    <div className="activity-info">
                       <div className="activity-icon"><Code size={20} /></div>
                       <div className="activity-text">
                          <span className="activity-title">{session.language} Session</span>
                          <span className="activity-time">{new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </div>
                    <div className={`activity-status-badge ${session.status === 'Resolved' ? 'status-resolved' : 'status-pending'}`}>
                       {session.status}
                    </div>
                 </div>
               ))}
            </div>
            <button 
              className="primary-gold-btn" 
              style={{ width: '100%', marginTop: '32px', padding: '16px', borderRadius: '12px' }}
              onClick={() => navigate('/dashboard/history')}
            >
               VIEW ALL SESSIONS <ChevronRight size={18} />
            </button>
         </div>

         <div className="p-activity-card">
            <div className="perf-header">
               <Target size={20} /> Cognitive Mastery
            </div>
            <p className="activity-time" style={{ marginBottom: '24px' }}>Ranked in top 5% of neural explorers.</p>
            <div className="p-skills-list">
               <span className="skill-tag">Performance Logic</span>
               <span className="skill-tag">Asynchronous Patterns</span>
               <span className="skill-tag">Functional Integrity</span>
               <span className="skill-tag">High-Order Flow</span>
               <span className="skill-tag">Recursive Synthesis</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
