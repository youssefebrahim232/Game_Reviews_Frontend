import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

/**
 * Star rating display (read-only or interactive).
 * @param {object} props
 * @param {number} props.rating - Current rating (0-10)
 * @param {number} [props.maxRating=10] - Max rating
 * @param {boolean} [props.interactive=false] - Allow clicking to set rating
 * @param {function} [props.onRate] - Callback when a star is clicked
 * @param {number} [props.size=16] - Star size
 */
export default function StarRating({ rating, maxRating = 10, interactive = false, onRate, size = 16 }) {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= rating;
    stars.push(
      <span
        key={i}
        className={`${styles.star} ${filled ? styles.filled : styles.empty} ${interactive ? styles.interactive : ''}`}
        onClick={() => interactive && onRate?.(i)}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? `Rate ${i}` : undefined}
      >
        <Star size={size} fill={filled ? 'currentColor' : 'none'} />
      </span>
    );
  }

  return <div className={styles.container}>{stars}</div>;
}
