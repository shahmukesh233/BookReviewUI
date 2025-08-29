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
import React, { useState } from 'react';
import Books from './Books';
import Review from './Review';
import UserProfile from './UserProfile';

function Home() {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="text-primary">Book Review Home</h2>
      </div>
      <div className="mb-4 d-flex justify-content-center" style={{ width: '100%' }}>
        <div style={{
          background: 'linear-gradient(90deg, #0d6efd 0%, #6f42c1 50%, #198754 100%)',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          padding: '2px',
          maxWidth: '700px',
          width: '100%'
        }}>
          <ul className="nav nav-tabs justify-content-center" style={{ background: 'transparent', border: 'none', width: '100%', gap: '0', fontSize: '0.95rem' }}>
            <li className="nav-item" style={{ marginRight: '24px', position: 'relative' }}>
              <button className={`nav-link d-flex align-items-center fw-bold ${activeTab === 'books' ? 'active' : ''}`}
                style={{ color: activeTab === 'books' ? '#fff' : '#f8f9fa', fontSize: '1rem', border: 'none', background: 'none', padding: '16px 28px', borderRadius: '16px 0 0 16px', transition: 'background 0.3s' }}
                onClick={() => setActiveTab('books')}>
                <i className="bi bi-journal-bookmark me-2"></i> Books
              </button>
              <span style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', height: '32px', width: '2px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></span>
            </li>
            <li className="nav-item" style={{ marginRight: '24px', position: 'relative' }}>
              <button className={`nav-link d-flex align-items-center fw-bold ${activeTab === 'reviews' ? 'active' : ''}`}
                style={{ color: activeTab === 'reviews' ? '#fff' : '#f8f9fa', fontSize: '1rem', border: 'none', background: 'none', padding: '16px 28px', transition: 'background 0.3s' }}
                onClick={() => setActiveTab('reviews')}>
                <i className="bi bi-star-half me-2"></i> Reviews
              </button>
              <span style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', height: '32px', width: '2px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }}></span>
            </li>
            <li className="nav-item">
              <button className={`nav-link d-flex align-items-center fw-bold ${activeTab === 'profile' ? 'active' : ''}`}
                style={{ color: activeTab === 'profile' ? '#fff' : '#f8f9fa', fontSize: '1rem', border: 'none', background: 'none', padding: '16px 28px', borderRadius: '0 16px 16px 0', transition: 'background 0.3s' }}
                onClick={() => setActiveTab('profile')}>
                <i className="bi bi-person-circle me-2"></i> User Profile
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {activeTab === 'books' ? (
          <Books />
        ) : activeTab === 'reviews' ? (
          <Review />
        ) : (
          <UserProfile />
        )}
      </div>
    </div>
  );
}

export default Home;
