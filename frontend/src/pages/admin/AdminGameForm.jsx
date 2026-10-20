import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getImageUrl } from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import styles from './AdminGameForm.module.css';

export default function AdminGameForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [name, setName] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState('');
  const [trailer, setTrailer] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([]);

  // Load available Genres, Platforms, and Game if editing
  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          api.get('/Genres'),
          api.get('/Platforms'),
        ]);

        if (!active) return;
        setGenres(genresRes.data || []);
        setPlatforms(platformsRes.data || []);

        if (isEdit) {
          const gameRes = await api.get(`/Games/${id}`);
          const game = gameRes.data;
          if (!active) return;

          setName(game.name || '');
          setReleaseYear(game.releaseYear || new Date().getFullYear());
          setDescription(game.description || '');
          setTrailer(game.trailer || '');
          if (game.poster) {
            setPosterPreview(getImageUrl(game.poster));
          }

          // Map genre names to ids
          if (game.genres && genresRes.data) {
            const matchedGenreIds = genresRes.data
              .filter((g) => game.genres.includes(g.name))
              .map((g) => g.id);
            setSelectedGenreIds(matchedGenreIds);
          }

          // Map platform names to ids
          if (game.platforms && platformsRes.data) {
            const matchedPlatformIds = platformsRes.data
              .filter((p) => game.platforms.includes(p.name))
              .map((p) => p.id);
            setSelectedPlatformIds(matchedPlatformIds);
          }
        }
      } catch (err) {
        toast.error('Failed to load form data');
      } finally {
        if (active) setFetching(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((i) => i !== genreId) : [...prev, genreId]
    );
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatformIds((prev) =>
      prev.includes(platformId) ? prev.filter((i) => i !== platformId) : [...prev, platformId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedGenreIds.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }
    if (selectedPlatformIds.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    const formData = new FormData();
    formData.append('Name', name.trim());
    formData.append('ReleaseYear', releaseYear);
    formData.append('Description', description.trim());
    formData.append('Trailer', trailer.trim());

    if (posterFile) {
      formData.append('Poster', posterFile);
    }

    // Append genre and platform IDs
    selectedGenreIds.forEach((genreId) => {
      formData.append('IdsOfGenres', genreId);
    });
    selectedPlatformIds.forEach((platformId) => {
      formData.append('IdsOfPlatforms', platformId);
    });

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/Games/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Game updated successfully!');
      } else {
        await api.post('/Games', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Game created successfully!');
      }
      navigate('/admin/games');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to save game';
      toast.error(typeof msg === 'string' ? msg : 'Error saving game');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 'var(--space-md)' }}
        onClick={() => navigate('/admin/games')}
      >
        <ArrowLeft size={16} /> Back to Games
      </button>

      <h1 className={styles.title}>{isEdit ? 'Edit Game' : 'Add New Game'}</h1>
      <p className={styles.subtitle}>
        {isEdit ? 'Update game details, media, and release metadata' : 'Fill in the details to publish a new game in the catalog'}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Game Title *</label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cyberpunk 2077"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="year">Release Year *</label>
            <input
              id="year"
              type="number"
              className="input"
              value={releaseYear}
              onChange={(e) => setReleaseYear(parseInt(e.target.value, 10))}
              min={1970}
              max={2035}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="trailer">YouTube Trailer URL</label>
          <input
            id="trailer"
            className="input"
            value={trailer}
            onChange={(e) => setTrailer(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Cover Poster</label>
          <div className={styles.posterUploadArea}>
            {posterPreview && (
              <img src={posterPreview} alt="Poster preview" className={styles.posterPreview} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              className={styles.fileInput}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Genres (select all that apply) *</label>
          <div className={styles.checkboxGrid}>
            {genres.map((g) => {
              const selected = selectedGenreIds.includes(g.id);
              return (
                <div
                  key={g.id}
                  className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                  onClick={() => toggleGenre(g.id)}
                >
                  {selected && <Check size={14} />}
                  {g.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Platforms (select all that apply) *</label>
          <div className={styles.checkboxGrid}>
            {platforms.map((p) => {
              const selected = selectedPlatformIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                  onClick={() => togglePlatform(p.id)}
                >
                  {selected && <Check size={14} />}
                  {p.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            className="input"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a synopsis or overview of the gameplay..."
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/games')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Game'}
          </button>
        </div>
      </form>
    </div>
  );
}
