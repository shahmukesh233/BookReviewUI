import React, { useState } from 'react';
import Books from './Books';
import Review from './Review';
import UserProfile from './UserProfile';

function Home() {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary">Book Review Home</h2>
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
