import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Tag, Monitor, Plus, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    gamesCount: 0,
    genresCount: 0,
    platformsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [gamesRes, genresRes, platformsRes] = await Promise.all([
          api.get('/Games?page=1'),
          api.get('/Genres'),
          api.get('/Platforms'),
        ]);

        setStats({
          gamesCount: gamesRes.data?.length || 0,
          genresCount: genresRes.data?.length || 0,
          platformsCount: platformsRes.data?.length || 0,
        });
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>System Overview</h1>
        <p className={styles.subtitle}>Welcome to the GameReviews administration panel</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Gamepad2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.gamesCount}</span>
            <span className={styles.statLabel}>Games (Page 1)</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Tag size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.genresCount}</span>
            <span className={styles.statLabel}>Total Genres</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Monitor size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.platformsCount}</span>
            <span className={styles.statLabel}>Total Platforms</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Management Actions</h2>
        <div className={styles.actionsGrid}>
          <Link to="/admin/games/new" className={styles.actionBtn}>
            <Plus size={18} /> Add New Game
          </Link>
          <Link to="/admin/games" className={styles.actionBtn}>
            <Gamepad2 size={18} /> Manage Games
          </Link>
          <Link to="/admin/genres" className={styles.actionBtn}>
            <Tag size={18} /> Manage Genres
          </Link>
          <Link to="/admin/platforms" className={styles.actionBtn}>
            <Monitor size={18} /> Manage Platforms
          </Link>
        </div>
      </div>
    </div>
  );
}
