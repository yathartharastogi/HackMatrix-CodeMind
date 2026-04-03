import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MainContent from './components/MainContent';
import AnalyzeCode from './pages/AnalyzeCode/AnalyzeCode';
import Profile from './pages/Profile/Profile';
import ErrorPatterns from './pages/ErrorPatterns/ErrorPatterns';
import Insights from './pages/Insights/Insights';
import History from './pages/History/History';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { analyzeCode } from './api';
import LandingPage from './pages/Landing/LandingPage';
import './App.css';

// Improved Dashboard Layout Structure: [Sidebar] + [MainWrapper (Topbar + Content)]
const DashboardLayout = ({ toggleSidebar, isSidebarOpen, isSidebarCollapsed }) => (
  <div className="app-container">
    <Sidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
    
    <div className="main-wrapper">
      <Topbar toggleSidebar={toggleSidebar} />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load history from local storage
  const [errorHistory, setErrorHistory] = useState(() => {
    const saved = localStorage.getItem('errorHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save history on change
  useEffect(() => {
    localStorage.setItem('errorHistory', JSON.stringify(errorHistory));
  }, [errorHistory]);

  const [userPatterns, setUserPatterns] = useState([]);
  
  // Auth Context session for general use
  const { session } = useAuth();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);

    const userId = session?.user?.id || 'guest-123';
    try {
      const result = await analyzeCode(inputText, selectedLanguage, userId);
      setIsLoading(false);
      setAiResponse(result);
      
      const status = Math.random() > 0.3 ? 'Resolved' : 'Needs Improvement';
      setErrorHistory(prev => [{ 
        code: inputText, 
        language: selectedLanguage, 
        response: result, 
        date: new Date().toISOString(),
        status: status
      }, ...prev]);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  return (
    <Routes>
      {/* Auth-based Root Redirection */}
      <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />
      
      {/* Dashboard Hierarchy */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout 
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
            isSidebarCollapsed={isSidebarCollapsed} 
          />
        </ProtectedRoute>
      }>
        <Route index element={
          <MainContent 
            inputText={inputText}
            setInputText={setInputText}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            handleAnalyze={handleAnalyze}
            isLoading={isLoading}
            errorHistory={errorHistory}
            userPatterns={userPatterns}
          />
        } />
        <Route path="analyze" element={
          <AnalyzeCode 
            inputText={inputText}
            setInputText={setInputText}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            handleAnalyze={handleAnalyze}
            isLoading={isLoading}
            aiResponse={aiResponse}
          />
        } />
        <Route path="profile" element={<Profile errorHistory={errorHistory} />} />
        <Route path="patterns" element={<ErrorPatterns errorHistory={errorHistory} />} />
        <Route path="insights" element={<Insights errorHistory={errorHistory} />} />
        <Route path="history" element={<History errorHistory={errorHistory} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
