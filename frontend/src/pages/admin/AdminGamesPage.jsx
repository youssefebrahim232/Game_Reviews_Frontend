import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Star, Gamepad2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getImageUrl } from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import styles from './AdminGamesPage.module.css';

export default function AdminGamesPage() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchGames = async (pageNum) => {
    try {
      setLoading(true);
      const res = await api.get('/Games', { params: { page: pageNum } });
      setGames(res.data || []);
    } catch {
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(page);
  }, [page]);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Game Catalog</h1>
        <Link to="/admin/games/new" className="btn btn-primary">
          <Plus size={18} /> Add New Game
        </Link>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
            <Spinner size="lg" />
          </div>
        ) : games.length > 0 ? (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => {
                    const posterUrl = getImageUrl(game.poster);
                    return (
                      <tr key={game.id}>
                        <td style={{ width: 60 }}>
                          {posterUrl ? (
                            <img src={posterUrl} alt={game.name} className={styles.posterThumb} />
                          ) : (
                            <div className={styles.posterPlaceholder}>
                              <Gamepad2 size={20} />
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={styles.gameName}>{game.name}</span>
                        </td>
                        <td>
                          <span className={styles.ratingCell}>
                            <Star size={14} fill="currentColor" />
                            {typeof game.rate === 'number' ? game.rate.toFixed(1) : '0.0'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link to={`/admin/games/${game.id}/edit`} className="btn btn-secondary btn-sm">
                            <Pencil size={14} /> Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className={styles.pageNumber}>Page {page}</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={games.length < 15}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)', color: 'var(--text-secondary)' }}>
            No games found on this page.
          </div>
        )}
      </div>
    </div>
  );
}
