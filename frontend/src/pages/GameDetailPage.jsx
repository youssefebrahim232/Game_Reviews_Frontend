import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, MessageSquare, Play, Send, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getImageUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getYouTubeId } from '../utils/youtube';
import ReviewCard from '../components/common/ReviewCard';
import Spinner from '../components/common/Spinner';
import styles from './GameDetailPage.module.css';

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [game, setGame] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [loadingGame, setLoadingGame] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review submission state
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newRating, setNewRating] = useState(8);
  const [newComment, setNewComment] = useState('');
  const [newPlatformId, setNewPlatformId] = useState('');

  // Fetch Game Details & Platforms
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoadingGame(true);
        const [gameRes, platformsRes] = await Promise.all([
          api.get(`/Games/${id}`),
          api.get('/Platforms'),
        ]);

        if (isMounted) {
          setGame(gameRes.data);
          setPlatforms(platformsRes.data || []);
          if (platformsRes.data && platformsRes.data.length > 0) {
            setSelectedPlatformId(platformsRes.data[0].id);
            setNewPlatformId(platformsRes.data[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          toast.error('Game not found or failed to load');
          navigate('/');
        }
      } finally {
        if (isMounted) setLoadingGame(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Fetch Reviews when selectedPlatformId or reviewPage changes
  const fetchReviews = useCallback(
    async (platformId, page, append = false) => {
      if (!platformId) return;
      try {
        setLoadingReviews(true);
        const res = await api.get('/Reviews', {
          params: {
            page,
            gameId: id,
            platformId,
          },
        });
        const data = res.data || [];
        setReviews((prev) => (append ? [...prev, ...data] : data));
        setHasMoreReviews(data.length >= 10);
      } catch {
        // Silently catch or handle error
      } finally {
        setLoadingReviews(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (selectedPlatformId) {
      setReviewPage(1);
      fetchReviews(selectedPlatformId, 1, false);
    }
  }, [selectedPlatformId, fetchReviews]);

  const handleLoadMoreReviews = () => {
    const nextPage = reviewPage + 1;
    setReviewPage(nextPage);
    fetchReviews(selectedPlatformId, nextPage, true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newPlatformId) {
      toast.error('Please select a platform');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post('/Reviews', {
        gameId: parseInt(id, 10),
        platformId: parseInt(newPlatformId, 10),
        rate: parseFloat(newRating),
        comment: newComment.trim(),
      });

      toast.success('Review posted successfully!');
      setNewComment('');
      // If the current tab is the platform posted to, refresh reviews
      if (parseInt(newPlatformId, 10) === selectedPlatformId) {
        setReviewPage(1);
        fetchReviews(selectedPlatformId, 1, false);
      } else {
        setSelectedPlatformId(parseInt(newPlatformId, 10));
      }

      // Re-fetch game info to update average score and count
      const updatedGame = await api.get(`/Games/${id}`);
      setGame(updatedGame.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit review. You might have already reviewed on this platform.';
      toast.error(typeof msg === 'string' ? msg : 'Review submission failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingGame) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!game) return null;

  const posterUrl = getImageUrl(game.poster);
  const trailerId = getYouTubeId(game.trailer);

  return (
    <div className={`container ${styles.page}`}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Games
      </button>

      {/* Hero / Game Info Header */}
      <section className={styles.hero}>
        <div className={styles.posterWrapper}>
          {posterUrl ? (
            <img src={posterUrl} alt={game.name} className={styles.poster} />
          ) : (
            <div className={styles.posterFallback}>No Poster Available</div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.header}>
            <h1 className={styles.title}>{game.name}</h1>
            <div className={styles.scoreBadge} title="Community Score">
              <Star size={22} fill="currentColor" />
              <span>{typeof game.rate === 'number' ? game.rate.toFixed(1) : '0.0'}/10</span>
            </div>
          </div>

          <div className={styles.metaRow}>
            {game.releaseYear && (
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>Released: {game.releaseYear}</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <MessageSquare size={16} />
              <span>{game.reviewsCount || 0} Reviews</span>
            </div>
          </div>

          {game.genres && game.genres.length > 0 && (
            <div>
              <span className={styles.descriptionTitle}>Genres</span>
              <div className={styles.tagGroup}>
                {game.genres.map((g, idx) => (
                  <span key={idx} className={styles.genreTag}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <div>
              <span className={styles.descriptionTitle}>Platforms</span>
              <div className={styles.tagGroup}>
                {game.platforms.map((p, idx) => (
                  <span key={idx} className={styles.platformTag}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {game.description && (
            <div className={styles.descriptionSection}>
              <span className={styles.descriptionTitle}>About</span>
              <p className={styles.description}>{game.description}</p>
            </div>
          )}
        </div>
      </section>

      {/* Trailer Section */}
      {trailerId && (
        <section className={styles.trailerSection}>
          <h2 className={styles.sectionTitle}>
            <Film size={22} color="var(--accent)" /> Official Trailer
          </h2>
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerId}`}
              title={`${game.name} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className={styles.reviewsSection}>
        <div className={styles.tabsRow}>
          <h2 className={styles.sectionTitle}>
            <MessageSquare size={22} color="var(--accent)" /> Player Reviews
          </h2>

          <div className={styles.platformTabs}>
            {platforms.map((plat) => (
              <button
                key={plat.id}
                className={`${styles.tabBtn} ${selectedPlatformId === plat.id ? styles.tabBtnActive : ''}`}
                onClick={() => setSelectedPlatformId(plat.id)}
              >
                {plat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Write Review Form or Login Prompt */}
        {isAuthenticated ? (
          <div className={styles.reviewFormCard}>
            <h3 className={styles.reviewFormTitle}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="reviewPlatform">Select Platform</label>
                  <select
                    id="reviewPlatform"
                    className="input"
                    value={newPlatformId}
                    onChange={(e) => setNewPlatformId(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose a platform
                    </option>
                    {platforms.map((plat) => (
                      <option key={plat.id} value={plat.id}>
                        {plat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reviewRate">
                    Your Rating: <span className={styles.ratingDisplay}>{newRating} / 10</span>
                  </label>
                  <div className={styles.sliderRow}>
                    <input
                      id="reviewRate"
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginBottom: 'var(--space-md)' }}>
                <label htmlFor="reviewComment">Your Thoughts (Optional)</label>
                <textarea
                  id="reviewComment"
                  className="input"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience playing this game..."
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                <Send size={16} /> {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.loginPrompt}>
            <p>
              Want to share your rating? <Link to="/login">Sign in</Link> or{' '}
              <Link to="/register">Create an account</Link> to write a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        {loadingReviews && reviewPage === 1 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
            <Spinner />
          </div>
        ) : reviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {reviews.map((rev, idx) => (
              <ReviewCard key={rev.id || idx} review={rev} index={idx} />
            ))}
          </div>
        ) : (
          <div className={styles.noReviews}>
            <p>No reviews yet for this platform. Be the first to review it!</p>
          </div>
        )}

        {hasMoreReviews && reviews.length > 0 && (
          <div className={styles.loadMoreWrapper}>
            <button
              className="btn btn-secondary"
              onClick={handleLoadMoreReviews}
              disabled={loadingReviews}
            >
              {loadingReviews ? <Spinner size="sm" /> : 'Load More Reviews'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
