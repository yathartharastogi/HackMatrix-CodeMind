import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code, AlertTriangle, Lightbulb, Clock, Settings, Zap, Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, isCollapsed, toggleSidebar }) => {
  const { userProfile } = useAuth();
  
  const displayName = userProfile?.fullname || 'User';
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Code size={20} />, label: 'Analyze Code', path: '/analyze' },
    { icon: <AlertTriangle size={20} />, label: 'Error Patterns', path: '/patterns' },
    { icon: <Lightbulb size={20} />, label: 'Learning Insights', path: '/insights' },
    { icon: <Clock size={20} />, label: 'History', path: '/history' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* Native Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-group">
            <div className="sidebar-logo-icon">C</div>
            <span className="sidebar-logo-text">CodeMind AI</span>
          </div>
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => { if(window.innerWidth <= 768) toggleSidebar() }}
                  className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="icon-wrapper">
                    {item.icon}
                  </span>
                  <span className="menu-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Interactive Bottom Profile Block */}
        <NavLink to="/profile" className="sidebar-profile-block" title={isCollapsed ? "View Profile" : ''}>
          <div className="s-profile-avatar">
            <User size={20} color="var(--bg-main)" />
          </div>
          <div className="s-profile-info">
            <span className="s-profile-name">{displayName}</span>
            <span className="s-profile-role">Pro User</span>
          </div>
        </NavLink>
      </aside>
    </>
  );
};

export default Sidebar;
