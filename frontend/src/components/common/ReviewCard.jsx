import { Star, Pencil, Trash2 } from 'lucide-react';
import styles from './ReviewCard.module.css';

/**
 * @param {object} props
 * @param {object} props.review - { id, rate, comment, userName }
 * @param {boolean} [props.showActions] - Show edit/delete buttons
 * @param {function} [props.onEdit] - Edit callback
 * @param {function} [props.onDelete] - Delete callback
 * @param {number} [props.index] - For staggered animation
 */
export default function ReviewCard({ review, showActions = false, onEdit, onDelete, index = 0 }) {
  const initial = review.userName ? review.userName.charAt(0).toUpperCase() : '?';

  return (
    <div className={styles.reviewCard} style={{ animationDelay: `${index * 50}ms` }}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initial}</div>
          <span className={styles.userName}>{review.userName || 'Anonymous'}</span>
        </div>
        <div className={styles.ratingDisplay}>
          <Star size={16} fill="currentColor" />
          {review.rate}/10
        </div>
      </div>

      {review.comment && (
        <p className={styles.comment}>{review.comment}</p>
      )}

      {showActions && (
        <div className={styles.actions}>
          <button className="btn btn-secondary btn-sm" onClick={() => onEdit?.(review)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(review.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
