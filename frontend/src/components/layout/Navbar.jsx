import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, Sun, Moon, LogIn, UserPlus, LogOut, User, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoIcon}><Gamepad2 size={26} /></span>
          GameReviews
        </Link>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.navLinksOpen : ''}`}>
          {isAuthenticated && (
            <NavLink
              to="/profile"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={closeMenu}
            >
              <User size={16} /> My Reviews
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={closeMenu}
            >
              <Shield size={16} /> Admin
            </NavLink>
          )}

          <div className={styles.userMenu}>
            <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <span className={styles.userEmail}>{user}</span>
                <button className={`btn btn-ghost btn-sm`} onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`btn btn-ghost btn-sm`} onClick={closeMenu}>
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/register" className={`btn btn-primary btn-sm`} onClick={closeMenu}>
                  <UserPlus size={16} /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
