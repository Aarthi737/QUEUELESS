import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import {
  Layers,
  Search,
  Clock,
  History,
  User,
  Shield,
  Briefcase,
  Menu,
  X,
  LogOut,
  RotateCcw,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from './Button';

export const Navbar = () => {
  const { userQueue, currentUser, logout, switchUser, resetDemo } = useQueue();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Quick Demo Switcher Top Bar */}
      <div className="demo-banner">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="demo-banner-content">
            <span style={{ fontWeight: 600, color: '#94A3B8' }}>Demo Role:</span>
            <button
              type="button"
              className={`demo-banner-role-btn ${currentUser?.role === 'customer' ? 'active' : ''}`}
              onClick={() => {
                switchUser('user-1');
                navigate('/dashboard');
              }}
            >
              Customer (Aarthi)
            </button>
            <button
              type="button"
              className={`demo-banner-role-btn ${currentUser?.role === 'staff' ? 'active' : ''}`}
              onClick={() => {
                switchUser('staff-1');
                navigate('/staff');
              }}
            >
              Staff (Dr. Rajesh)
            </button>
            <button
              type="button"
              className={`demo-banner-role-btn ${currentUser?.role === 'admin' ? 'active' : ''}`}
              onClick={() => {
                switchUser('admin-1');
                navigate('/admin');
              }}
            >
              Admin (Vikram)
            </button>
          </div>

          <button
            type="button"
            onClick={resetDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#94A3B8',
              fontSize: '0.75rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: '2px 6px',
            }}
            title="Reset mock data to initial defaults"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="logo-wrapper" onClick={closeMobile}>
            <div className="logo-icon">
              <Layers size={22} strokeWidth={2.5} />
            </div>
            <span>QueueLess</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/queues" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Find Queue
            </NavLink>
            <NavLink to="/my-queue" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span>My Queue</span>
              {userQueue && (
                <span className="nav-badge" title="Active Token">
                  {userQueue.tokenNumber}
                </span>
              )}
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              History
            </NavLink>

            {/* Staff / Admin Quick Access */}
            <span style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 4px' }} />

            <NavLink to="/staff" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Briefcase size={16} />
              <span>Staff</span>
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Shield size={16} />
              <span>Admin</span>
            </NavLink>
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="nav-actions">
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#FFFFFF',
                    transition: 'border-color 0.15s ease',
                  }}
                  title="View Profile"
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {currentUser.avatar || currentUser.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <Link to="/" className="mobile-nav-link" onClick={closeMobile}>
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobile}>
              <span>Dashboard</span>
            </Link>
            <Link to="/queues" className="mobile-nav-link" onClick={closeMobile}>
              <span>Find Queue</span>
            </Link>
            <Link to="/my-queue" className="mobile-nav-link" onClick={closeMobile}>
              <span>My Queue</span>
              {userQueue && <span className="nav-badge">{userQueue.tokenNumber}</span>}
            </Link>
            <Link to="/history" className="mobile-nav-link" onClick={closeMobile}>
              <span>Queue History</span>
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />
            <Link to="/staff" className="mobile-nav-link" onClick={closeMobile}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={16} /> Staff Dashboard
              </span>
            </Link>
            <Link to="/admin" className="mobile-nav-link" onClick={closeMobile}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} /> Admin Dashboard
              </span>
            </Link>
            <Link to="/profile" className="mobile-nav-link" onClick={closeMobile}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} /> Profile
              </span>
            </Link>
          </div>
        )}
      </header>
    </>
  );
};
