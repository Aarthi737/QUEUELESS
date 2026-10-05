import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { FindQueuePage } from './pages/FindQueuePage';
import { JoinQueuePage } from './pages/JoinQueuePage';
import { QueueTrackingPage } from './pages/QueueTrackingPage';
import { QueueHistoryPage } from './pages/QueueHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <QueueProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer Flow */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/queues" element={<FindQueuePage />} />
              <Route path="/queue/:id" element={<JoinQueuePage />} />
              <Route path="/my-queue" element={<QueueTrackingPage />} />
              <Route path="/history" element={<QueueHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Staff & Admin Dashboards */}
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </QueueProvider>
  );
}

export default App;
