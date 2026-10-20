import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Game Level Not Found</h1>
      <p className={styles.desc}>
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} /> Back to Catalog
      </Link>
    </div>
  );
}
