import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', password: '', firstname: '', lastname: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userDTO = {
        username: form.username,
        password: form.password,
        firstname: form.firstname,
        lastname: form.lastname,
        role: 'USER'
      };
      await api.post('/api/users/register', userDTO);
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Sign up failed. Try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" name="username" className="form-control" placeholder="Username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="password" name="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="firstname" className="form-control" placeholder="First Name" value={form.firstname} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input type="text" name="lastname" className="form-control" placeholder="Last Name" value={form.lastname} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </div>
    </div>
  );
}

export default Signup;
