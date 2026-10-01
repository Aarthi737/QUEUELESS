import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Edit3,
  Shield,
  Briefcase,
} from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout, switchUser } = useQueue();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    preferredLocation: currentUser?.preferredLocation || '',
  });

  const handleEditClick = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      preferredLocation: currentUser?.preferredLocation || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    updateProfile(formData);
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '480px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>You are logged out</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Please log in or sign up to view and manage your queue profile.
          </p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '640px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          User Profile
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Manage your personal details and contact preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Header Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '1.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #BFDBFE',
            }}
          >
            {currentUser.avatar || currentUser.name.charAt(0)}
          </div>

          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentUser.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span className="role-switcher-badge">
                {currentUser.role === 'admin' ? (
                  <Shield size={12} />
                ) : currentUser.role === 'staff' ? (
                  <Briefcase size={12} />
                ) : (
                  <User size={12} />
                )}
                {currentUser.role}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Member since {currentUser.memberSince || '2025'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <User size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentUser.name}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Mail size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentUser.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Phone size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phone Number</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentUser.phone}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <MapPin size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Preferred Location</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentUser.preferredLocation}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            onClick={handleEditClick}
            icon={<Edit3 size={16} />}
          >
            Edit Profile
          </Button>

          <Button
            variant="danger-outline"
            onClick={handleLogout}
            icon={<LogOut size={16} />}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        confirmText="Save Changes"
        onConfirm={handleSaveProfile}
      >
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Location</label>
          <input
            type="text"
            value={formData.preferredLocation}
            onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
            className="form-input"
          />
        </div>
      </Modal>
    </div>
  );
};
