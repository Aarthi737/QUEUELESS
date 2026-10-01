import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  Layers,
  Users,
  Clock,
  CheckCircle2,
  Shield,
  Briefcase,
  Play,
  Pause,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { services, togglePauseQueue, queueHistory } = useQueue();

  // Compute live overview counts
  const totalWaiting = services.reduce((acc, s) => acc + s.peopleWaiting, 0);
  const activeQueuesCount = services.filter((s) => s.status === 'Active').length;
  const peopleServedCount = 124 + queueHistory.filter((h) => h.status === 'Completed').length;
  const avgWaitTime = Math.round(
    services.reduce((acc, s) => acc + s.estimatedWait, 0) / (services.length || 1)
  );

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="role-switcher-badge">
              <Shield size={12} />
              Admin Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            System Overview
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            High-level metrics across all connected departments and facilities.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/staff')}
          icon={<Briefcase size={16} />}
        >
          Open Staff Calling Console
        </Button>
      </div>

      {/* Today's Overview: 4 essential statistics */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Today's Overview
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <StatCard
            title="Active Queues"
            value={activeQueuesCount}
            subtitle={`${services.length} registered departments`}
            icon={<Layers size={24} />}
            iconBg="var(--primary-light)"
            iconColor="var(--primary)"
          />

          <StatCard
            title="People Served"
            value={peopleServedCount}
            subtitle="Completed today across counters"
            icon={<CheckCircle2 size={24} />}
            iconBg="var(--success-light)"
            iconColor="var(--success)"
          />

          <StatCard
            title="People Waiting"
            value={totalWaiting}
            subtitle="Active customers in queues"
            icon={<Users size={24} />}
            iconBg="var(--warning-light)"
            iconColor="var(--warning)"
          />

          <StatCard
            title="Average Wait Time"
            value={`${avgWaitTime} min`}
            subtitle="Estimated average per visitor"
            icon={<Clock size={24} />}
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
          />
        </div>
      </div>

      {/* Active Services Table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Active Services
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {services.length} services
          </span>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--border-subtle)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>Current Token</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>Waiting</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.9rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc, idx) => (
                  <tr
                    key={svc.id}
                    style={{
                      borderBottom: idx < services.length - 1 ? '1px solid var(--border-color)' : 'none',
                      backgroundColor: '#FFFFFF',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{svc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {svc.department} • <span className="badge badge-category" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>{svc.category}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>
                        {svc.currentServing}
                      </span>
                    </td>

                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {svc.peopleWaiting} people
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ~{svc.estimatedWait} min wait
                      </div>
                    </td>

                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <StatusBadge status={svc.status} />
                    </td>

                    <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePauseQueue(svc.id)}
                          icon={svc.status === 'Paused' ? <Play size={14} /> : <Pause size={14} />}
                        >
                          {svc.status === 'Paused' ? 'Resume' : 'Pause'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/staff')}
                          icon={<ArrowUpRight size={14} />}
                          iconPosition="right"
                        >
                          Manage
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
