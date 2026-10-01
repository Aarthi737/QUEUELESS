import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Button } from '../components/Button';
import { Layers, Mail, Lock, User, Briefcase, Shield, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginAs, addToast } = useQueue();

  const [email, setEmail] = useState('aarthi.sharma@example.com');
  const [password, setPassword] = useState('password123');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    loginAs('customer');
    navigate('/dashboard');
  };

  const handleQuickLogin = (role) => {
    loginAs(role);
    if (role === 'staff') navigate('/staff');
    else if (role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="container" style={{ paddingTop: '3.5rem', maxWidth: '440px' }}>
      <div className="card" style={{ padding: '2.25rem 2rem' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <Layers size={24} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome to QueueLess
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Sign in to track your queue tokens and history
          </p>
        </div>

        {/* Quick Demo Login Switchers */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
            One-Click Demo Sign In
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('customer')}
              title="Customer Login"
            >
              <User size={13} />
              <span>Customer</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('staff')}
              title="Staff Login"
            >
              <Briefcase size={13} />
              <span>Staff</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickLogin('admin')}
              title="Admin Login"
            >
              <Shield size={13} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span>or continue with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>
                Forgot?
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth style={{ marginTop: '0.5rem' }}>
            Sign In
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
