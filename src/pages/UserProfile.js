import React, { useEffect, useState } from 'react';
import api from '../api';
import { Table, Button, Badge } from 'react-bootstrap';

function UserProfile() {
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId');

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
      <h2 className="mb-4 text-center text-primary">User Profile</h2>
      <div className="mb-5">
        <h4 className="mb-3">My Reviews</h4>
        <Table striped bordered hover responsive className="shadow-sm">
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
      <div>
        <h4 className="mb-3">Favourite Books</h4>
        <Table striped bordered hover responsive className="shadow-sm">
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
  );
}

export default UserProfile;
