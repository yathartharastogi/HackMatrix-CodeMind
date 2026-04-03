import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, User, Menu, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const { userProfile, signOut } = useAuth();
  const displayName = userProfile?.fullname || 'User';
  const displayEmail = userProfile?.emailaddress || 'user@example.com';

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      
      {/* Left: Flex Spacer (Since Logo is in Sidebar now) */}
      <div className="topbar-left">
        {/* We keep this empty or minimally structured to ensure center/right alignment acts normally */}
        <button className="mobile-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>  
      </div>
      
      {/* Center: Empty for balancing */}
      <div className="topbar-center"></div>
      
      {/* Right: Actions */}
      <div className="topbar-right">
        <button className="action-btn">
          <Bell size={20} />
          <span className="dot"></span>
        </button>
        <div className="profile-container" ref={profileMenuRef}>
          <div 
            className="profile-combo-btn" 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="profile-avatar">
              <User size={18} />
            </div>
            <span className="profile-combo-name">{displayName}</span>
          </div>

          {/* Profile Dropdown */}
          <div className={`profile-dropdown ${isProfileMenuOpen ? 'open' : ''}`}>
            <div className="profile-dropdown-header">
              <div className="profile-info">
                <span className="profile-name">{displayName}</span>
                <span className="profile-email">{displayEmail}</span>
              </div>
              <span className="skill-badge-mini">Intermediate</span>
            </div>
            
            <div className="profile-quick-stats">
              <div className="stat-item">
                <span className="stat-val text-success">14</span>
                <span className="stat-label">Fixed</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">85%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </div>

            <div className="profile-dropdown-menu">
              <NavLink to="/profile" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                <User size={16} /> View Profile
              </NavLink>
              <button className="dropdown-item">
                <Settings size={16} /> Settings
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-error" onClick={() => { setIsProfileMenuOpen(false); signOut(); }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Topbar;
