import { useState } from 'react';
import { UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/common/Spinner';
import styles from './AdminRegisterPage.module.css';

export default function AdminRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await api.post('/Auth/RegisterAdmin', { email, password });
      toast.success(`Admin account created for ${email}`);
      setEmail('');
      setPassword('');
    } catch (err) {
      const data = err.response?.data;
      if (Array.isArray(data)) {
        data.forEach((e) => toast.error(e.description || e.code || 'Registration error'));
      } else if (typeof data === 'string') {
        toast.error(data);
      } else {
        toast.error('Failed to create admin user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Register Administrator</h1>
        <p className={styles.subtitle}>SuperAdmin privilege: Grant administrative permissions to a user</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="adminEmail">Admin Email</label>
            <input
              id="adminEmail"
              type="email"
              className="input"
              placeholder="admin@gamereviews.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="adminPassword">Initial Password</label>
            <input
              id="adminPassword"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Shield size={16} /> {loading ? <Spinner size="sm" /> : 'Register Admin User'}
          </button>
        </form>
      </div>
    </div>
  );
}
