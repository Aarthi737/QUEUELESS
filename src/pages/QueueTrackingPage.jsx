import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { TokenCard } from '../components/TokenCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import {
  Bell,
  LogOut,
  Sparkles,
  ArrowRight,
  FastForward,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';

export const QueueTrackingPage = () => {
  const navigate = useNavigate();
  const { userQueue, leaveQueue, callNext, addToast } = useQueue();
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const handleConfirmLeave = () => {
    leaveQueue();
    setShowLeaveModal(false);
  };

  const handleSimulateAdvance = () => {
    if (userQueue) {
      callNext(userQueue.serviceId);
    }
  };

  const handleShareToken = () => {
    if (navigator.clipboard && userQueue) {
      navigator.clipboard.writeText(
        `QueueLess Token: #${userQueue.tokenNumber} for ${userQueue.serviceName} (${userQueue.department}). Track live: ${window.location.href}`
      );
      addToast('Queue token link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '720px' }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Live Queue Tracking
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Real-time token position and estimated turn updates.
        </p>
      </div>

      {userQueue ? (
        <div>
          {/* Main Prominent Token Card */}
          <TokenCard
            tokenNumber={userQueue.tokenNumber}
            status={userQueue.status}
            peopleAhead={userQueue.peopleAhead}
            estimatedWait={userQueue.estimatedWait}
            currentServing={userQueue.currentServing}
            serviceName={userQueue.serviceName}
            department={userQueue.department}
            counterNumber={userQueue.counterNumber}
            showProgress={true}
            actionButton={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="danger-outline"
                  onClick={() => setShowLeaveModal(true)}
                  icon={<LogOut size={16} />}
                >
                  Leave Queue
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShareToken}
                  icon={<Share2 size={16} />}
                >
                  Share Token
                </Button>
              </div>
            }
          />

          {/* Interactive Simulation / Staff Link Helper Box */}
          <div
            className="card"
            style={{
              marginTop: '1.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1.25rem 1.5rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.925rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                <span>Queue Simulator Control</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Advance queue position to test real-time updates from #{userQueue.currentServing}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSimulateAdvance}
                icon={<FastForward size={14} />}
              >
                Advance Queue (+1)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/staff')}
              >
                Staff View
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No active queue to track"
          description="You do not have any active tokens. Join an available queue to start tracking your turn."
          actionText="Browse Available Queues"
          onAction={() => navigate('/queues')}
        />
      )}

      {/* Leave Queue Confirmation Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Are you sure you want to leave this queue?"
        confirmText="Confirm Leave"
        confirmVariant="danger"
        onConfirm={handleConfirmLeave}
      >
        <div style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '0.75rem' }}>
            If you leave now, you will lose your token position{' '}
            <strong style={{ color: 'var(--text-main)' }}>#{userQueue?.tokenNumber}</strong> for{' '}
            <strong>{userQueue?.serviceName}</strong>.
          </p>
          <p>
            This action will move this ticket to your history as <strong>Cancelled</strong>.
          </p>
        </div>
      </Modal>
    </div>
  );
};
