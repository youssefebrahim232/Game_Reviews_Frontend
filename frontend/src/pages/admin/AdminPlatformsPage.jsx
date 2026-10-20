import { useState, useEffect } from 'react';
import { Monitor, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getImageUrl } from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import styles from './AdminPlatformsPage.module.css';

export default function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState([]);
  const [name, setName] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Platforms');
      setPlatforms(res.data || []);
    } catch {
      toast.error('Failed to load platforms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleAddPlatform = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append('Name', name.trim());
    if (iconFile) {
      formData.append('Icon', iconFile);
    }

    try {
      setSubmitting(true);
      await api.post('/Platforms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Platform added successfully!');
      setName('');
      setIconFile(null);
      // Reset file input
      const fileInput = document.getElementById('platformIconInput');
      if (fileInput) fileInput.value = '';
      fetchPlatforms();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to create platform';
      toast.error(typeof msg === 'string' ? msg : 'Error creating platform');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Platforms</h1>
        <p className={styles.subtitle}>Configure gaming systems (PC, PS5, Xbox, Switch, etc.)</p>
      </div>

      <div className={styles.addCard}>
        <h2 className={styles.addTitle}>Add New Platform</h2>
        <form onSubmit={handleAddPlatform} className={styles.addForm}>
          <div>
            <label htmlFor="platName" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Platform Name *
            </label>
            <input
              id="platName"
              className="input"
              placeholder="e.g. PlayStation 5, Steam Deck..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="platformIconInput" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Icon Image
            </label>
            <input
              id="platformIconInput"
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => setIconFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Plus size={16} /> {submitting ? 'Adding...' : 'Add Platform'}
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <div className={styles.grid}>
          {platforms.map((p) => {
            const iconUrl = getImageUrl(p.icon);
            return (
              <div key={p.id} className={styles.platformCard}>
                {iconUrl ? (
                  <img src={iconUrl} alt={p.name} className={styles.platformIcon} />
                ) : (
                  <div className={styles.fallbackIcon}>
                    <Monitor size={20} />
                  </div>
                )}
                <div className={styles.platformInfo}>
                  <span className={styles.platformName}>{p.name}</span>
                  <span className={styles.platformId}>ID #{p.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
