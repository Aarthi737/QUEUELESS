import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import {
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Building2,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const JoinQueuePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, userQueue, joinQueue, currentUser } = useQueue();

  const service = services.find((s) => s.id === id) || services[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedQueue, setIssuedQueue] = useState(null);
  const [notes, setNotes] = useState('');

  // Form fields synced with logged-in user
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');

  useEffect(() => {
    if (currentUser) {
      if (!userName) setUserName(currentUser.name || '');
      if (!userPhone) setUserPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleGetToken = async (e) => {
    if (e) e.preventDefault();
    if (!service) return;
    setIsSubmitting(true);
    try {
      const created = await joinQueue(service.id, notes, {
        name: userName || currentUser?.name || 'Customer',
        phone: userPhone || currentUser?.phone || '',
      });
      if (created) {
        setIssuedQueue(created);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already issued or just clicked "Get Digital Token", show the success confirmation state
  if (issuedQueue) {
    return (
      <div className="container" style={{ paddingTop: '3rem', maxWidth: '640px' }}>
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '2.5rem 2rem',
            border: '2px solid var(--primary)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Success Checkmark */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            You're in the queue!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {service.name} • {service.department}
          </p>

          {/* Large Token Display */}
          <div
            style={{
              background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
              border: '2px dashed var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem 1.5rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Token Number
            </div>
            <div
              style={{
                fontSize: '4.25rem',
                fontWeight: 900,
                color: 'var(--primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                margin: '0.25rem 0',
              }}
            >
              #{issuedQueue.tokenNumber}
            </div>
            <div>
              <StatusBadge status={issuedQueue.status} />
            </div>
          </div>

          {/* Metrics summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>People Ahead</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                {issuedQueue.peopleAhead}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estimated Wait</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                {issuedQueue.estimatedWait} minutes
              </div>
            </div>
          </div>

          {/* Button: Track My Queue */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/my-queue')}
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Track My Queue
          </Button>
        </div>
      </div>
    );
  }

  // Pre-join: Service Details and "Get Digital Token"
  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '680px' }}>
      {/* Back button */}
      <Link
        to="/queues"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
          fontWeight: 500,
        }}
      >
        <ChevronLeft size={16} />
        <span>Back to All Queues</span>
      </Link>

      {/* If user already has an active queue */}
      {userQueue && userQueue.serviceId !== service.id && (
        <div
          style={{
            backgroundColor: 'var(--warning-light)',
            border: '1px solid var(--warning-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.875rem', color: '#92400E' }}>
            <strong>Active Queue Notice:</strong> You currently have an active token (
            <strong>#{userQueue.tokenNumber}</strong> for {userQueue.serviceName}). Getting a new token here will replace your current active ticket.
          </div>
        </div>
      )}

      {/* Service Details Card */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-category">{service.category}</span>
            <StatusBadge status={service.status} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
            {service.name}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
            {service.department}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {service.description}
          </p>
        </div>

        {/* Live Queue Status Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            backgroundColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 0.75rem',
            marginBottom: '1.75rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Current Token
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {service.currentServing}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              People Waiting
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {service.peopleWaiting}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Estimated Wait
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {service.estimatedWait} min
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span><strong>Location:</strong> {service.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span><strong>Operating Hours:</strong> {service.operatingHours}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span><strong>Assigned Counter:</strong> {service.counterNumber}</span>
          </div>
        </div>

        {/* User confirmation form */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Your Token Details
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-input"
              placeholder="e.g. Aarthi Sharma"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number (For turn notification)</label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              className="form-input"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Purpose / Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
              placeholder="e.g. Annual health checkup or Cash deposit"
            />
          </div>
        </div>

        {/* Button: Get Digital Token */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={service.status === 'Paused'}
          onClick={handleGetToken}
        >
          {service.status === 'Paused' ? 'Queue Currently Paused' : 'Get Digital Token'}
        </Button>
      </div>
    </div>
  );
};
