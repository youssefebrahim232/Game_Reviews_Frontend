import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGamesPage from './pages/admin/AdminGamesPage';
import AdminGameForm from './pages/admin/AdminGameForm';
import AdminGenresPage from './pages/admin/AdminGenresPage';
import AdminPlatformsPage from './pages/admin/AdminPlatformsPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="games" element={<AdminGamesPage />} />
            <Route path="games/new" element={<AdminGameForm />} />
            <Route path="games/:id/edit" element={<AdminGameForm />} />
            <Route path="genres" element={<AdminGenresPage />} />
            <Route path="platforms" element={<AdminPlatformsPage />} />
            <Route
              path="register-admin"
              element={
                <ProtectedRoute requireSuperAdmin={true}>
                  <AdminRegisterPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
