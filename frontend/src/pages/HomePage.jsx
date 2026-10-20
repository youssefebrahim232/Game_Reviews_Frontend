import { useState, useEffect, useCallback } from 'react';
import { Search, Gamepad2 } from 'lucide-react';
import api from '../api/axios';
import GameCard from '../components/common/GameCard';
import Spinner from '../components/common/Spinner';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGames = useCallback(async (pageNum, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const { data } = await api.get('/Games', { params: { page: pageNum } });

      if (data.length < 15) setHasMore(false);

      setGames((prev) => (append ? [...prev, ...data] : data));
    } catch (err) {
      console.error('Failed to fetch games:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchGames(1);
  }, [fetchGames]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGames(nextPage, true);
  };

  const filteredGames = search
    ? games.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : games;

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover & Review Your Favorite Games</h1>
          <p className={styles.heroSubtitle}>
            Browse thousands of games, read honest reviews, and share your own gaming experiences with the community.
          </p>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>All Games</h2>
          <span className={styles.gameCount}>{filteredGames.length} games</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size={36} />
          </div>
        ) : filteredGames.length > 0 ? (
          <>
            <div className={styles.grid}>
              {filteredGames.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>

            {hasMore && !search && (
              <div className={styles.loadMoreWrapper}>
                <button className="btn btn-secondary btn-lg" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? <Spinner size={18} /> : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <Gamepad2 size={56} className={styles.emptyIcon} />
            <p className={styles.emptyText}>No games found</p>
            <p className={styles.emptySubtext}>
              {search ? 'Try a different search term' : 'Check back later for new additions'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
