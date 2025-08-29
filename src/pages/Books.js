import React, { useState, useEffect } from 'react';
import api from '../api';

function getUserRole() {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const role = JSON.parse(user).role;
      return role === 'ADMIN' ? 'ADMIN' : 'USER';
    } catch {}
  }
  return 'USER';
}

function Books() {
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1); // default page 1
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genres: '',
    publishedYear: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBookId, setReviewBookId] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [editBookId, setEditBookId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', author: '', description: '', coverImage: '', genres: '', publishedYear: '' });
  const userRole = getUserRole();

  useEffect(() => {
    fetchBooks();
    fetchFavorites();
    // eslint-disable-next-line
  }, [page, search]);

  const userId = localStorage.getItem('userId');
  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/users/${userId}/favorites`);
      setFavorites(res.data || []);
    } catch {
      setFavorites([]);
    }
  };

  // Fetch paginated books
  const fetchBooks = async () => {
    let res;
    const pageParam = page || 1;
    const sizeParam = 5;
    if (search && search.length >= 3) {
      res = await api.get('/api/books/search', { params: { keyword: search, page: pageParam, size: sizeParam } });
    } else {
      res = await api.get('/api/books/page', { params: { page: pageParam, size: sizeParam } });
    }
    setBooks(res.data.content || []);
    setTotalPages(res.data.totalPages || 1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create book
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/api/books', form);
    setForm({ title: '', author: '', description: '', coverImage: '', genres: '', publishedYear: '' });
    setShowForm(false);
    fetchBooks();
  };

  // Edit book
  const handleEditClick = (book) => {
    setEditBookId(book.id);
    setEditForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      coverImage: book.coverImage || '',
      genres: book.genres || '',
      publishedYear: book.publishedYear || ''
    });
    setShowForm(false);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/api/books/${editBookId}`, editForm);
    setEditBookId(null);
    setEditForm({ title: '', author: '', description: '', coverImage: '', genres: '', publishedYear: '' });
    fetchBooks();
  };

  // Delete book
  const handleDelete = async (id) => {
    await api.delete(`/api/books/${id}`);
    fetchBooks();
  };

  // Get single book (example usage)
  const getBook = async (id) => {
    const res = await api.get(`/api/books/${id}`);
    return res.data;
  };

  return (
    <div className="container-fluid books-page min-vh-100" style={{ background: '#f7faff', padding: '10px' }}>
      <div className="d-flex justify-content-center align-items-center mb-3" style={{ width: '100%', padding: '10px' }}>
        {userRole === 'ADMIN' ? (
          <button className="btn btn-primary me-3" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : 'Add New Book'}
          </button>
        ) : (
          <button className="btn btn-primary me-3" disabled style={{ backgroundColor: '#e0e0e0', color: '#888', borderColor: '#e0e0e0' }}>
            {showForm ? 'Close' : 'Add New Book'}
          </button>
        )}
        <label htmlFor="searchInput" className="me-2 fw-bold">Search:</label>
        <input
          id="searchInput"
          type="text"
          className="form-control"
          style={{ maxWidth: 300 }}
          placeholder="Search by title or author"
          value={search}
          onChange={handleSearch}
        />
      </div>
      {showForm && (
        <form className="card p-4 mb-4 shadow" style={{ maxWidth: 800, margin: '0 auto' }} onSubmit={handleSubmit}>
          <h3 className="mb-3 text-primary">Add a New Book</h3>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input name="title" className="form-control" placeholder="Title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <input name="author" className="form-control" placeholder="Author" value={form.author} onChange={handleChange} required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input name="publishedYear" className="form-control" placeholder="Published Year" value={form.publishedYear} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-2">
              <input name="genres" className="form-control" placeholder="Genres (comma separated)" value={form.genres} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 mb-2">
              <input name="coverImage" className="form-control" placeholder="Cover Image URL" value={form.coverImage} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 mb-2">
              <textarea name="description" className="form-control" placeholder="Description" value={form.description} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">Create Book</button>
        </form>
      )}
      {editBookId && (
        <form className="card p-4 mb-4 shadow" style={{ maxWidth: 800, margin: '0 auto' }} onSubmit={handleEditSubmit}>
          <h3 className="mb-3 text-primary">Edit Book</h3>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input name="title" className="form-control" placeholder="Title" value={editForm.title} onChange={handleEditFormChange} required />
            </div>
            <div className="col-md-6 mb-2">
              <input name="author" className="form-control" placeholder="Author" value={editForm.author} onChange={handleEditFormChange} required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input name="publishedYear" className="form-control" placeholder="Published Year" value={editForm.publishedYear} onChange={handleEditFormChange} />
            </div>
            <div className="col-md-6 mb-2">
              <input name="genres" className="form-control" placeholder="Genres (comma separated)" value={editForm.genres} onChange={handleEditFormChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 mb-2">
              <input name="coverImage" className="form-control" placeholder="Cover Image URL" value={editForm.coverImage} onChange={handleEditFormChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 mb-2">
              <textarea name="description" className="form-control" placeholder="Description" value={editForm.description} onChange={handleEditFormChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Update Book</button>
          <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => setEditBookId(null)}>Cancel</button>
        </form>
      )}
      <div className="table-responsive d-flex justify-content-center" style={{ padding: '30px', margin: '30px auto', maxWidth: '1400px' }}>
        <table className="table table-bordered table-hover bg-white shadow" style={{ width: '90%', tableLayout: 'auto', margin: '0 auto' }}>
          <thead className="table-primary">
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Description</th>
              <th>Genres</th>
              <th>Published Year</th>
              <th>Avg Rating</th>
              <th>Review Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...books].sort((a, b) => (a.title || '').localeCompare(b.title || '')).map(book => {
              const isFav = favorites.some(fav => fav.bookId === book.id);
              return (
                <tr key={book.id}>
                  <td style={{ width: 110 }}>
                    <img
                      src={book.coverImage && book.coverImage.trim() !== '' ? book.coverImage : '/assets/images/default-book-cover.jpg'}
                      alt={book.title}
                      style={{ width: 90, height: 120, objectFit: 'cover', display: 'block', margin: '0 auto' }}
                      onError={e => { e.target.onerror = null; e.target.src = '/assets/images/default-book-cover.jpg'; }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.description}</td>
                  <td>{book.genres}</td>
                  <td>{book.publishedYear}</td>
                  <td>{book.avgRating !== undefined && book.avgRating !== null ? book.avgRating.toFixed(1) : '-'}</td>
                  <td>{book.reviewCount !== undefined && book.reviewCount !== null ? book.reviewCount : '-'}</td>
                  <td>
                    <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                      {userRole === 'ADMIN' ? (
                        <>
                          <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(book)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.id)}>Delete</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-warning btn-sm" disabled style={{ backgroundColor: '#e0e0e0', color: '#888', borderColor: '#e0e0e0' }}>Edit</button>
                          <button className="btn btn-danger btn-sm" disabled style={{ backgroundColor: '#e0e0e0', color: '#888', borderColor: '#e0e0e0' }}>Delete</button>
                        </>
                      )}
                      <button className="btn btn-info btn-sm" onClick={() => { setReviewBookId(book.id); setShowReviewModal(true); }}>Review</button>
                      {isFav ? (
                        <button className="btn btn-danger btn-sm" onClick={async () => {
                          await api.delete(`/api/users/${userId}/favorites/${book.id}`);
                          fetchFavorites();
                        }}>Unmark Favourite</button>
                      ) : (
                        <button className="btn btn-success btn-sm" onClick={async () => {
                          await api.post(`/api/users/${userId}/favorites`, { bookId: book.id });
                          fetchFavorites();
                        }}>Mark Favourite</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
        <button className="btn btn-primary" onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-primary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Review</h5>
                <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                let userId = localStorage.getItem('userId');
                if (!userId) {
                  const user = localStorage.getItem('user');
                  if (user) {
                    try {
                      userId = JSON.parse(user).id;
                    } catch {}
                  }
                }
                await api.post('/api/reviews', {
                  rating: review.rating,
                  comment: review.comment,
                  bookId: reviewBookId,
                  userId: userId
                });
                setShowReviewModal(false);
                setReview({ rating: 0, comment: '' });
                fetchBooks();
              }}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Rating:</label>
                    <div>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ cursor: 'pointer', color: star <= review.rating ? '#ffc107' : '#e4e5e9', fontSize: 24 }}
                          onClick={() => setReview({ ...review, rating: star })}>
                          &#9733;
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment:</label>
                    <textarea className="form-control" value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Submit Review</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
