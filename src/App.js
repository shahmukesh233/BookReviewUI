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
  return (
    <div className="position-absolute top-0 end-0 p-3">
      <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
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
