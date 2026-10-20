import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Tag, Monitor, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { role, isSuperAdmin } = useAuth();

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarTitle}>
            <Shield size={20} /> Admin Control
          </div>
          <span className={styles.sidebarBadge}>{role || 'Admin'}</span>
        </div>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/games"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Gamepad2 size={18} /> Games
        </NavLink>

        <NavLink
          to="/admin/genres"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Tag size={18} /> Genres
        </NavLink>

        <NavLink
          to="/admin/platforms"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Monitor size={18} /> Platforms
        </NavLink>

        {isSuperAdmin && (
          <NavLink
            to="/admin/register-admin"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <UserPlus size={18} /> Register Admin
          </NavLink>
        )}
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
