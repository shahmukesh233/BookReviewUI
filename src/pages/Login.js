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
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="username" className="form-control" placeholder="Email or Username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <div className="text-center mt-3">
          <span>New user? <a href="/signup">Sign up here</a></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
