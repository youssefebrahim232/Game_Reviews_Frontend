import { Gamepad2 } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Gamepad2 size={20} className={styles.footerBrandIcon} />
          GameReviews
        </div>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} GameReviews. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
