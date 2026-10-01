import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { Clock, Users, ArrowRight, ArrowUpRight } from 'lucide-react';

export const QueueCard = ({ queue, onLeaveClick }) => {
  const navigate = useNavigate();

  if (!queue) return null;

  return (
    <div
      className="card"
      style={{
        border: '1.5px solid #BFDBFE',
        backgroundColor: '#FFFFFF',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Queue
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {queue.serviceName}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {queue.department} • {queue.counterNumber}
          </p>
        </div>
        <StatusBadge status={queue.status} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Token Number</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
            {queue.tokenNumber}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Current Serving</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {queue.currentServing}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>People Ahead</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: queue.status === 'Now Serving' ? 'var(--success)' : 'var(--text-main)', marginTop: '2px' }}>
            {queue.status === 'Now Serving' ? '0 (You)' : queue.peopleAhead}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estimated Wait</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {queue.status === 'Now Serving' ? '0 min' : `${queue.estimatedWait} min`}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onLeaveClick ? (
          <Button variant="ghost" size="sm" onClick={onLeaveClick} style={{ color: 'var(--error)' }}>
            Leave Queue
          </Button>
        ) : <div />}

        <Button
          variant="primary"
          onClick={() => navigate('/my-queue')}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          View Queue
        </Button>
      </div>
    </div>
  );
};
