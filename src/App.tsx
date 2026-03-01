import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { FeedPage } from './pages/FeedPage';
import { JamsPage } from './pages/JamsPage';
import { BandsPage } from './pages/BandsPage';
import { ShowsPage } from './pages/ShowsPage';
import { ShowDetailPage } from './pages/ShowDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { VenuesPage } from './pages/VenuesPage';
import { PhotographersPage } from './pages/PhotographersPage';
import { ArtistsPage } from './pages/ArtistsPage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <div className="app-layout">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/feed"
                  element={
                    <ProtectedRoute>
                      <FeedPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jams"
                  element={
                    <ProtectedRoute>
                      <JamsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bands"
                  element={
                    <ProtectedRoute>
                      <BandsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shows"
                  element={
                    <ProtectedRoute>
                      <ShowsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shows/:id"
                  element={
                    <ProtectedRoute>
                      <ShowDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/venues"
                  element={
                    <ProtectedRoute>
                      <VenuesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/photographers"
                  element={
                    <ProtectedRoute>
                      <PhotographersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/artists"
                  element={
                    <ProtectedRoute>
                      <ArtistsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/feed" replace />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}
