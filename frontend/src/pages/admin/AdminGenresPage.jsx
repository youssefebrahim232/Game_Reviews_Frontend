import { useState, useEffect } from 'react';
import { Tag, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import styles from './AdminGenresPage.module.css';

export default function AdminGenresPage() {
  const [genres, setGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Genres');
      setGenres(res.data || []);
    } catch {
      toast.error('Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddGenre = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    try {
      setSubmitting(true);
      await api.post('/Genres', { name: newGenreName.trim() });
      toast.success('Genre added successfully!');
      setNewGenreName('');
      fetchGenres();
    } catch {
      toast.error('Failed to create genre');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Genres</h1>
        <p className={styles.subtitle}>Define categories to organize games in the catalog</p>
      </div>

      <div className={styles.addCard}>
        <h2 className={styles.addTitle}>Add New Genre</h2>
        <form onSubmit={handleAddGenre} className={styles.addForm}>
          <div className={styles.inputGroup}>
            <input
              className="input"
              placeholder="e.g. Action RPG, Roguelike, Strategy..."
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Plus size={16} /> {submitting ? 'Adding...' : 'Add Genre'}
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <div className={styles.grid}>
          {genres.map((g) => (
            <div key={g.id} className={styles.genreCard}>
              <span className={styles.genreName}>{g.name}</span>
              <span className={styles.genreId}>#{g.id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
