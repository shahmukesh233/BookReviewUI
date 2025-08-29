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
      <ul className="nav nav-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>Books</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>User Profile</button>
        </li>
      </ul>
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
