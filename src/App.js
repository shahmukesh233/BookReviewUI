import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import api from './api';

function LogoutButton({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    try {
      await api.post('/api/users/logout');
    } catch (e) {}
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };
  // Hide on login page
  if (location.pathname === '/login') return null;
  // Get user info from localStorage
  let firstName = '';
  let lastName = '';
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userObj = JSON.parse(user);
      firstName = userObj.firstName || '';
      lastName = userObj.lastName || '';
    } catch {}
  }
  const displayName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'User';
  return (
    <div className="position-absolute top-0 end-0 p-3 d-flex align-items-center gap-3">
      <span style={{
        background: 'linear-gradient(90deg, #6dd5ed, #2193b0)',
        color: '#fff',
        padding: '8px 18px',
        fontSize: '1.15rem',
        borderRadius: '24px',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(33,147,176,0.15)'
      }}>
        {displayName}
      </span>
      <button className="btn btn-outline-danger" style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 18px' }} onClick={handleLogout}>Logout</button>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // Check localStorage for token
    return !!localStorage.getItem('token');
  });

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <LogoutButton setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
