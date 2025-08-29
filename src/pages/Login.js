import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Setup axios interceptor for token
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.interceptors.request.use(
        config => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        error => Promise.reject(error)
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('username', form.username);
      params.append('password', form.password);
      const res = await axios.post('http://localhost:8080/api/users/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('userId', res.data.user.id);
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', position: 'relative', overflow: 'hidden' }}>
      <img src="/assets/images/default-book-cover.jpg" alt="Banner" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxHeight: '220px', objectFit: 'cover', zIndex: 0, opacity: 0.25 }} />
      <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: '100%', borderRadius: '24px', background: 'rgba(255,255,255,0.95)', border: 'none', zIndex: 1, fontSize: '0.95rem' }}>
        <h2 className="text-center mb-4" style={{ color: '#2575fc', fontWeight: 700, letterSpacing: '1px', fontSize: '1.3rem' }}>
          <i className="bi bi-person-circle me-2" style={{ fontSize: '1.1rem' }}></i>Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="username" className="form-control" placeholder="Email or Username" value={form.username} onChange={handleChange} required style={{ borderRadius: '12px', border: '1px solid #2575fc', boxShadow: '0 1px 4px rgba(38,117,252,0.08)', fontSize: '0.95rem' }} />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required style={{ borderRadius: '12px', border: '1px solid #2575fc', boxShadow: '0 1px 4px rgba(38,117,252,0.08)', fontSize: '0.95rem' }} />
          </div>
          <button type="submit" className="btn w-100" style={{ background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', fontWeight: 600, borderRadius: '12px', boxShadow: '0 2px 8px rgba(38,117,252,0.12)', border: 'none', fontSize: '1rem' }}>Login</button>
        </form>
        {error && <div className="alert alert-danger mt-3" style={{ borderRadius: '12px', fontSize: '0.95rem' }}>{error}</div>}
        <div className="text-center mt-3">
          <span style={{ color: '#6a11cb', fontWeight: 500, fontSize: '0.95rem' }}>New user? <a href="/signup" style={{ color: '#2575fc', fontWeight: 600, textDecoration: 'underline', fontSize: '0.95rem' }}>Sign up here</a></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
