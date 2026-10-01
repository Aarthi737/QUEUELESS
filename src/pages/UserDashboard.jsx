import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { QueueCard } from '../components/QueueCard';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import {
  PlusCircle,
  Clock,
  History,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { userQueue, leaveQueue, currentUser } = useQueue();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleConfirmLeave = () => {
    leaveQueue();
    setShowLeaveModal(false);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Customer'} 👋
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Track your active token, join queues nearby, and view your queue records.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/queues')}
            icon={<PlusCircle size={16} />}
          >
            Find a Queue
          </Button>
        </div>
      </div>

      {/* Current Queue Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Current Queue
          </h2>
          {userQueue && (
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Live Status Active
            </span>
          )}
        </div>

        {userQueue ? (
          <QueueCard
            queue={userQueue}
            onLeaveClick={() => setShowLeaveModal(true)}
          />
        ) : (
          <EmptyState
            title="No active queue"
            description="You are not currently in any waiting line. Browse available services to get a digital token."
            actionText="Find a Queue"
            onAction={() => navigate('/queues')}
          />
        )}
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Quick Actions
        </h2>

        <div className="quick-actions-grid">
          {/* Join a Queue */}
          <div className="action-card" onClick={() => navigate('/queues')}>
            <div className="action-card-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <PlusCircle size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Join a Queue
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Browse hospitals, banks & offices
              </p>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--text-subtle)' }} />
          </div>

          {/* My Current Queue */}
          <div className="action-card" onClick={() => navigate('/my-queue')}>
            <div className="action-card-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Clock size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                My Current Queue
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {userQueue ? `Token ${userQueue.tokenNumber} live tracking` : 'View active status'}
              </p>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--text-subtle)' }} />
          </div>

          {/* Queue History */}
          <div className="action-card" onClick={() => navigate('/history')}>
            <div className="action-card-icon" style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
              <History size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Queue History
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Review completed and past visits
              </p>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--text-subtle)' }} />
          </div>
        </div>
      </div>

      {/* Leave Queue Confirmation Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Leave Current Queue?"
        confirmText="Yes, Leave Queue"
        confirmVariant="danger"
        onConfirm={handleConfirmLeave}
      >
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Are you sure you want to leave this queue? If you leave, you will forfeit your token position (
          <strong style={{ color: 'var(--text-main)' }}>#{userQueue?.tokenNumber}</strong>) and will need to take a new token if you return.
        </p>
      </Modal>
    </div>
  );
};
