import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Heart, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                QueueLess
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '320px' }}>
              Smart Digital Queue Management for modern healthcare, banking, education, and public service institutions.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>Zero paper waste. 100% digital token workflow.</span>
            </div>
          </div>

          {/* User Links */}
          <div>
            <h4 className="footer-heading">For Customers</h4>
            <ul className="footer-links">
              <li>
                <Link to="/queues" style={{ color: 'var(--text-muted)', transition: 'color 0.15s ease' }}>
                  Find a Queue
                </Link>
              </li>
              <li>
                <Link to="/my-queue" style={{ color: 'var(--text-muted)' }}>
                  Live Queue Tracking
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/history" style={{ color: 'var(--text-muted)' }}>
                  Queue History
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions / Staff */}
          <div>
            <h4 className="footer-heading">For Staff & Admin</h4>
            <ul className="footer-links">
              <li>
                <Link to="/staff" style={{ color: 'var(--text-muted)' }}>
                  Staff Calling Console
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--text-muted)' }}>
                  Admin Overview
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: 'var(--text-muted)' }}>
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-muted)' }}>
                  Sign In / Switch Roles
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="footer-heading">Sectors Supported</h4>
            <ul className="footer-links">
              <li>Hospitals & Clinics</li>
              <li>Retail & Commercial Banks</li>
              <li>College & University Offices</li>
              <li>Citizen Service Centers</li>
              <li>Diagnostic Laboratories</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} QueueLess Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
