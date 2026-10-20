import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Check, X, Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/common/ReviewCard';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingReview, setEditingReview] = useState(null);
  const [editRate, setEditRate] = useState(10);
  const [editComment, setEditComment] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Reviews/User_Reviews');
      setReviews(res.data || []);
    } catch {
      toast.error('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const handleStartEdit = (review) => {
    setEditingReview(review);
    setEditRate(review.rate);
    setEditComment(review.comment || '');
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRate(10);
    setEditComment('');
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    try {
      setSubmittingEdit(true);
      await api.put(`/Reviews/${editingReview.id}`, {
        rate: parseInt(editRate, 10),
        comment: editComment.trim(),
      });
      toast.success('Review updated!');
      setEditingReview(null);
      fetchUserReviews();
    } catch {
      toast.error('Failed to update review');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handlePromptDelete = (id) => {
    setDeletingId(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/Reviews/${deletingId}`);
      toast.success('Review deleted');
      setConfirmDelete(false);
      setDeletingId(null);
      fetchUserReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <User size={28} color="var(--accent)" /> My Reviews
        </h1>
        <p className={styles.subtitle}>
          Logged in as <strong>{user}</strong>. You have submitted {reviews.length} review(s).
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
          <Spinner size="lg" />
        </div>
      ) : reviews.length > 0 ? (
        <div className={styles.reviewsGrid}>
          {reviews.map((rev) =>
            editingReview && editingReview.id === rev.id ? (
              <div key={rev.id} className={styles.editCard}>
                <div className={styles.editTitle}>Editing Review #{rev.id}</div>

                <div>
                  <label htmlFor={`edit-rate-${rev.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Rating: <span className={styles.ratingDisplay}>{editRate} / 10</span>
                  </label>
                  <div className={styles.sliderRow}>
                    <input
                      id={`edit-rate-${rev.id}`}
                      type="range"
                      min="1"
                      max="10"
                      value={editRate}
                      onChange={(e) => setEditRate(e.target.value)}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`edit-comment-${rev.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Comment
                  </label>
                  <textarea
                    id={`edit-comment-${rev.id}`}
                    className="input"
                    rows={3}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                </div>

                <div className={styles.editActions}>
                  <button className="btn btn-ghost btn-sm" onClick={handleCancelEdit} disabled={submittingEdit}>
                    <X size={14} /> Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveEdit} disabled={submittingEdit}>
                    <Check size={14} /> {submittingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <ReviewCard
                key={rev.id}
                review={rev}
                showActions={true}
                onEdit={handleStartEdit}
                onDelete={handlePromptDelete}
              />
            )
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Gamepad2 size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>You haven't reviewed any games yet</h2>
          <p className={styles.emptySubtitle}>
            Explore our collection and share your feedback on the games you've played!
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Games
          </Link>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <Modal
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          confirmText="Delete"
          danger={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setConfirmDelete(false);
            setDeletingId(null);
          }}
        />
      )}
    </div>
  );
}
