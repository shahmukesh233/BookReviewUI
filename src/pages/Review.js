import React, { useEffect, useState } from 'react';
import api from '../api';
import { Card, Button, Modal, Form, Table } from 'react-bootstrap';

function Review() {
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ rating: '', comment: '' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const res = await api.get('/api/reviews/all');
      setReviews(res.data || []);
    } catch (err) {
      setReviews([]);
    }
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/reviews/${editReview.id}`, { ...editForm, userId });
      setShowEditModal(false);
      fetchAllReviews();
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await api.delete(`/api/reviews/${id}`);
      fetchAllReviews();
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mb-4" style={{ maxWidth: '1300px', margin: '0 auto', border: '2px solid #0d6efd', background: '#f7faff' }}>
        <div className="card-header bg-primary text-white">
          <h2 className="fw-bold mb-0 text-center">All Reviews</h2>
        </div>
        <div className="card-body">
          <Table striped bordered hover responsive className="shadow" style={{ width: '100%', margin: '0 auto' }}>
            <thead className="table-dark">
              <tr>
                <th>Book Title</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No reviews found.</td></tr>
              ) : (
                reviews.map(r => {
                  const isOwnReview = String(r.userId) === String(userId);
                  return (
                    <tr key={r.id}>
                      <td>{r.bookTitle || (r.book && r.book.title) || <span className="text-muted">N/A</span>}</td>
                      <td>{r.rating} ⭐</td>
                      <td>{r.comment}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(r)}
                          disabled={!isOwnReview}
                          style={!isOwnReview ? { backgroundColor: '#e0e0e0', color: '#888', borderColor: '#e0e0e0' } : {}}
                        >Edit</Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                          disabled={!isOwnReview}
                          style={!isOwnReview ? { backgroundColor: '#e0e0e0', color: '#888', borderColor: '#e0e0e0' } : {}}
                        >Delete</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit} className="p-3">
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control type="number" name="rating" min="1" max="5" value={editForm.rating} onChange={handleEditChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control as="textarea" name="comment" rows={3} value={editForm.comment} onChange={handleEditChange} required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">Update Review</Button>
        </Form>
      </Modal>
    </div>
  );
}

export default Review;
