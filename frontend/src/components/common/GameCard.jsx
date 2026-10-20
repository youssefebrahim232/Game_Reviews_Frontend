import { useNavigate } from 'react-router-dom';
import { Star, Gamepad2 } from 'lucide-react';
import { getImageUrl } from '../../api/axios';
import styles from './GameCard.module.css';

export default function GameCard({ game, index = 0 }) {
  const navigate = useNavigate();
  const posterUrl = getImageUrl(game.poster);

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/games/${game.id}`)}
      style={{ animationDelay: `${index * 60}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/games/${game.id}`)}
    >
      <div className={styles.posterWrapper}>
        {posterUrl ? (
          <img src={posterUrl} alt={game.name} className={styles.poster} loading="lazy" />
        ) : (
          <div className={styles.posterFallback}>
            <Gamepad2 size={48} />
          </div>
        )}
        <div className={styles.ratingBadge}>
          <Star size={14} fill="currentColor" />
          {typeof game.rate === 'number' ? game.rate.toFixed(1) : '0.0'}
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name} title={game.name}>{game.name}</h3>
      </div>
    </div>
  );
}
