import { useState } from 'react'
import SpeechRecognition from "./components/Speechrecognition.jsx"
import Auth from "./components/Auth.jsx"
import './scrollbar.css'

function App() {
  // Initialize state based on localStorage
  const initializeAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      return {
        isAuthenticated: true,
        user: JSON.parse(userData),
        loading: false
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      loading: false
    };
  };

  const initialState = initializeAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);
  const [user, setUser] = useState(initialState.user);
  const [loading] = useState(initialState.loading);

  const handleAuthSuccess = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "#1E1E1E",
        color: "#FFFFFF"
      }}>
        Loading...
      </div>
    );
  }
  
  return (
    <>
      {isAuthenticated ? (
        <SpeechRecognition user={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  )
}

export default App
