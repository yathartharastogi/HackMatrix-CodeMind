import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
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
import './App.css';

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

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);

    const result = await analyzeCode(inputText, selectedLanguage);
    
    setIsLoading(false);
    setAiResponse(result);
    // Randomize status for UI mockup purposes
    const status = Math.random() > 0.3 ? 'Resolved' : 'Needs Improvement';
    setErrorHistory(prev => [{ 
      code: inputText, 
      language: selectedLanguage, 
      response: result, 
      date: new Date().toISOString(),
      status: status
    }, ...prev]);
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  // Auth Context for rendering switches
  const { session, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#011025', color: '#c2e8ff' }}>Loading Session...</div>;
  }

  // We define the core authenticated workspace separately so the router can swap cleanly without Topbar/Sidebar bleeding into Login
  const AuthenticatedWorkspace = () => (
    <div className="app-layout">
      <Topbar toggleSidebar={toggleSidebar} />
      <div className="content-layout">
        <Sidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={
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
          <Route path="/analyze" element={
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
          <Route path="/profile" element={
            <Profile errorHistory={errorHistory} />
          } />
          <Route path="/patterns" element={
            <ErrorPatterns errorHistory={errorHistory} />
          } />
          <Route path="/insights" element={
            <Insights errorHistory={errorHistory} />
          } />
          <Route path="/history" element={
            <History errorHistory={errorHistory} />
          } />
        </Routes>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Workspace Trapper */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AuthenticatedWorkspace />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
