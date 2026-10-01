import React, { useState, useMemo } from 'react';
import { useQueue } from '../context/QueueContext';
import { StatusBadge } from '../components/StatusBadge';
import { FilterButton } from '../components/FilterButton';
import { EmptyState } from '../components/EmptyState';
import { Calendar, Clock, MapPin, Building2, History, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const QueueHistoryPage = () => {
  const { queueHistory } = useQueue();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All'); // 'All' | 'Completed' | 'Cancelled'

  const filteredHistory = useMemo(() => {
    if (filter === 'All') return queueHistory;
    return queueHistory.filter((item) => item.status?.toLowerCase() === filter.toLowerCase());
  }, [queueHistory, filter]);

  const completedCount = queueHistory.filter((h) => h.status === 'Completed').length;
  const cancelledCount = queueHistory.filter((h) => h.status === 'Cancelled').length;

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Queue History
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            A log of all previous digital tokens and service visits.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => navigate('/queues')}>
          Join New Queue
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <FilterButton
          label="All"
          active={filter === 'All'}
          onClick={() => setFilter('All')}
          count={queueHistory.length}
        />
        <FilterButton
          label="Completed"
          active={filter === 'Completed'}
          onClick={() => setFilter('Completed')}
          count={completedCount}
        />
        <FilterButton
          label="Cancelled"
          active={filter === 'Cancelled'}
          onClick={() => setFilter('Cancelled')}
          count={cancelledCount}
        />
      </div>

      {/* History Items List / Cards */}
      {filteredHistory.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                padding: '1.25rem 1.5rem',
              }}
            >
              {/* Left Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {/* Token Badge */}
                <div
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid #BFDBFE',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 1rem',
                    textAlign: 'center',
                    minWidth: '72px',
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Token
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {item.tokenNumber}
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.serviceName}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {item.department} {item.counter ? `• ${item.counter}` : ''}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} />
                      {item.date}
                    </span>
                    {item.waitTime && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} />
                        {item.waitTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Status */}
              <div>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<History size={32} />}
          title={`No ${filter !== 'All' ? filter.toLowerCase() : ''} queues in history`}
          description="Your completed and cancelled queue tokens will show up here for easy tracking."
          actionText="Find a Queue"
          onAction={() => navigate('/queues')}
        />
      )}
    </div>
  );
};
