import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { queuesAPI } from '../services/api';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import {
  Volume2,
  SkipForward,
  CheckCircle,
  Pause,
  Play,
  Users,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { generateUpcomingTokens } from '../data/queues';

export const StaffDashboard = () => {
  const {
    services,
    callNext,
    completeCurrent,
    skipCurrent,
    togglePauseQueue,
    userQueue,
  } = useQueue();

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [entriesList, setEntriesList] = useState([]);

  // Auto-select first service if none selected or not found
  useEffect(() => {
    if (services && services.length > 0) {
      if (!selectedServiceId || !services.find((s) => s.id === selectedServiceId)) {
        setSelectedServiceId(services[0].id);
      }
    }
  }, [services, selectedServiceId]);

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0] || {};

  const isPaused = currentService.status === 'Paused';

  // Fetch live upcoming entries from backend
  useEffect(() => {
    const fetchEntries = async () => {
      if (currentService.id) {
        try {
          const res = await queuesAPI.getEntries(currentService.id);
          if (res.success && Array.isArray(res.data)) {
            setEntriesList(res.data);
            return;
          }
        } catch (err) {
          // fallback to client generator
        }
      }
      setEntriesList(
        generateUpcomingTokens(
          currentService.codePrefix || 'A',
          currentService.currentNumber || 0,
          6
        )
      );
    };

    fetchEntries();
  }, [currentService.id, currentService.currentNumber, currentService.currentServing]);

  const upcomingTokens = entriesList.length > 0 ? entriesList : generateUpcomingTokens(
    currentService.codePrefix || 'A',
    currentService.currentNumber || 0,
    6
  );

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="role-switcher-badge">
              <Briefcase size={12} />
              Staff Calling Console
            </span>
            <StatusBadge status={currentService.status} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Counter Management
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Call waiting customers, advance tokens, and manage counter status in real time.
          </p>
        </div>

        {/* Service Switcher dropdown */}
        <div style={{ minWidth: '240px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Active Service Desk:
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="form-input"
            style={{ fontWeight: 600, cursor: 'pointer' }}
          >
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.name} - {svc.department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Staff Console Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Current Queue Console */}
        <div className="card" style={{ padding: '2rem', border: isPaused ? '2px solid #CBD5E1' : '2px solid #BFDBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {currentService.counterNumber}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentService.name}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {currentService.department}
              </p>
            </div>
            <StatusBadge status={isPaused ? 'Paused' : 'Active'} />
          </div>

          {/* Current Token Display */}
          <div
            style={{
              backgroundColor: isPaused ? '#F1F5F9' : '#F0F9FF',
              border: isPaused ? '1px solid var(--border-color)' : '2px solid var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isPaused ? 'var(--text-muted)' : 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CURRENT TOKEN
            </div>
            <div
              style={{
                fontSize: '4.5rem',
                fontWeight: 900,
                color: isPaused ? 'var(--text-muted)' : 'var(--primary)',
                lineHeight: 1.05,
                margin: '0.25rem 0',
                letterSpacing: '-0.04em',
              }}
            >
              #{currentService.currentServing}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {isPaused ? 'Queue is currently paused' : 'Now Serving at Desk'}
            </div>
          </div>

          {/* Metrics Row: People Waiting, Average Service Time */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '2rem',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>People Waiting</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentService.peopleWaiting}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Service Time</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                {currentService.avgWaitPerPerson} min
              </div>
            </div>
          </div>

          {/* Main Action Button: CALL NEXT */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isPaused}
              onClick={() => callNext(currentService.id)}
              icon={<Volume2 size={22} />}
              style={{
                padding: '1.1rem',
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              CALL NEXT
            </Button>
          </div>

          {/* Secondary Action Buttons: Skip, Complete, Pause Queue */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}
          >
            <Button
              variant="outline"
              disabled={isPaused}
              onClick={() => skipCurrent(currentService.id)}
              icon={<SkipForward size={16} />}
            >
              Skip
            </Button>

            <Button
              variant="success"
              disabled={isPaused}
              onClick={() => completeCurrent(currentService.id)}
              icon={<CheckCircle size={16} />}
            >
              Complete
            </Button>

            <Button
              variant={isPaused ? 'secondary' : 'outline'}
              onClick={() => togglePauseQueue(currentService.id)}
              icon={isPaused ? <Play size={16} /> : <Pause size={16} />}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        </div>

        {/* Right Column: Queue List */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Upcoming Queue List
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {currentService.peopleWaiting} in line
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {upcomingTokens.map((item, idx) => {
                const isFirst = idx === 0;
                const isUserToken = userQueue && userQueue.tokenNumber === item.token;

                return (
                  <div
                    key={item.token}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isFirst ? 'var(--primary-light)' : '#FFFFFF',
                      border: isFirst ? '1px solid #BFDBFE' : '1px solid var(--border-color)',
                      boxShadow: isFirst ? 'var(--shadow-xs)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: isFirst ? 'var(--primary)' : 'var(--text-main)',
                        }}
                      >
                        {item.token}
                      </span>

                      {isUserToken && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: '#FEF3C7',
                            color: '#B45309',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid #FDE68A',
                          }}
                        >
                          (Customer Demo)
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ~{item.waitTime} min
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note box */}
            <div
              style={{
                marginTop: '1.5rem',
                backgroundColor: 'var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              💡 <strong>Real-time interaction:</strong> Clicking <strong>CALL NEXT</strong> updates the current serving token across the entire application, including the customer's live tracking view.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
