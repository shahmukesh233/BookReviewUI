import React, { useEffect, useState } from 'react';
import api from '../api';
import { Table, Button, Badge } from 'react-bootstrap';

function UserProfile() {
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId');

  // User info state
  const userObj = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
  const [profileForm, setProfileForm] = useState({
    firstname: userObj.firstname || '',
    lastname: userObj.lastname || '',
    password: ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      // Build full UserDTO object
      const payload = {
        id: userObj.id,
        username: userObj.username,
        password: profileForm.password || userObj.password || '',
        role: userObj.role,
        firstname: profileForm.firstname,
        lastname: profileForm.lastname
      };
      const res = await api.put(`/api/users/${userId}`, payload);
      // Update localStorage with response if available, else with payload
      const updatedUser = res.data ? res.data : { ...userObj, firstname: profileForm.firstname, lastname: profileForm.lastname };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfileMsg('Profile updated successfully!');
      setProfileForm({ ...profileForm, password: '' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setProfileMsg('Failed to update profile.');
    }
  };

  useEffect(() => {
    fetchUserReviews();
    fetchFavoriteBooks();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/user/${userId}`);
      setReviews(res.data || []);
    } catch (err) {
      setReviews([]);
    }
  };

  const fetchFavoriteBooks = async () => {
    try {
      const res = await api.get(`/api/users/${userId}/favorites`);
      setFavorites(res.data || []);
    } catch (err) {
      setFavorites([]);
    }
  };

  const handleFavoriteToggle = async (bookId, isFav) => {
    try {
      if (isFav) {
        await api.delete(`/api/users/${userId}/favorites/${bookId}`);
      } else {
        await api.post(`/api/users/${userId}/favorites`, { bookId });
      }
      fetchFavoriteBooks();
    } catch (err) {}
  };

  return (
    <div className="container py-4">
  <div className="card shadow mb-4" style={{ maxWidth: '1000px', margin: '0 auto', border: '2px solid #0d6efd', background: '#f7faff' }}>
        <div className="card-header bg-primary text-white">
          <h4 className="fw-bold mb-0">My Reviews</h4>
        </div>
        <div className="card-body">
          <Table striped bordered hover responsive className="shadow-sm" style={{ width: '100%', margin: '0 auto' }}>
            <thead className="table-dark">
              <tr>
                <th>Book Title</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No reviews found.</td></tr>
              ) : (
                reviews.map(r => (
                  <tr key={r.id}>
                    <td>{r.bookTitle || r.book?.title || <span className="text-muted">N/A</span>}</td>
                    <td><Badge bg="success">{r.rating} ⭐</Badge></td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-line' }}>{r.comment}</td>
                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
  <div className="card shadow mb-4" style={{ maxWidth: '1000px', margin: '0 auto', border: '2px solid #198754', background: '#f8fff8' }}>
        <div className="card-header bg-success text-white">
          <h4 className="fw-bold mb-0">Favourite Books</h4>
        </div>
        <div className="card-body">
          <Table striped bordered hover responsive className="shadow-sm" style={{ width: '100%', margin: '0 auto' }}>
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No favourite books found.</td></tr>
              ) : (
                favorites.map(book => {
                  const isFav = true; // All books in this table are favourites
                  return (
                    <tr key={book.id}>
                      <td>{book.bookTitle}</td>
                      <td>{book.bookAuthor}</td>
                      <td>{book.bookGenres}</td>
                      <td>
                        {isFav ? (
                          <Button variant="danger" size="sm" onClick={() => handleFavoriteToggle(book.bookId, true)}>
                            Unmark Favourite
                          </Button>
                        ) : (
                          <Button variant="success" size="sm" onClick={() => handleFavoriteToggle(book.bookId, false)}>
                            Mark Favourite
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Update Profile Section below tables */}
      <div className="card p-4 mt-5 shadow-sm" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h4 className="mb-3 text-info">Update Profile</h4>
        <form onSubmit={handleProfileSubmit}>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input type="text" name="firstname" className="form-control" value={profileForm.firstname} onChange={handleProfileChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastname" className="form-control" value={profileForm.lastname} onChange={handleProfileChange} required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">New Password</label>
              <input type="password" name="password" className="form-control" value={profileForm.password} onChange={handleProfileChange} placeholder="Enter new password" />
            </div>
            <div className="col-md-6 mb-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">Update Profile</button>
            </div>
          </div>
          {profileMsg && <div className={`mt-3 alert ${profileMsg.includes('success') ? 'alert-success' : 'alert-danger'}`}>{profileMsg}</div>}
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
