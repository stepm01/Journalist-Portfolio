import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';

/* Admin is code-split so the public landing page stays lean & fast. */
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience'));
const AdminReels = lazy(() => import('./pages/admin/AdminReels'));
const AdminBylines = lazy(() => import('./pages/admin/AdminBylines'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const Fallback = () => (
  <div style={{
    minHeight: '100vh', display: 'grid', placeItems: 'center',
    background: 'var(--paper)', color: 'var(--muted)',
    fontFamily: 'var(--font-mono)', letterSpacing: '.15em', fontSize: 13
  }}>
    LOADING…
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Suspense fallback={<Fallback />}>
            <Routes>
              {/* Public: single landing page (nav + footer are built into Home) */}
              <Route path="/" element={<Home />} />

              {/* Admin */}
              <Route path="/studio-access" element={<AdminLogin />} />
              <Route path="/studio" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/studio/experience" element={<ProtectedRoute><AdminExperience /></ProtectedRoute>} />
              <Route path="/studio/reels" element={<ProtectedRoute><AdminReels /></ProtectedRoute>} />
              <Route path="/studio/bylines" element={<ProtectedRoute><AdminBylines /></ProtectedRoute>} />
              <Route path="/studio/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
