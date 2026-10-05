import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, MapPin, ChevronRight, Stethoscope, Landmark, GraduationCap, FileBadge, Activity, Smartphone } from 'lucide-react';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'healthcare':
      return <Stethoscope size={18} className="text-blue-600" />;
    case 'banking':
      return <Landmark size={18} className="text-emerald-600" />;
    case 'college':
      return <GraduationCap size={18} className="text-amber-600" />;
    case 'government':
      return <FileBadge size={18} className="text-indigo-600" />;
    case 'services':
      return <Smartphone size={18} className="text-sky-600" />;
    default:
      return <Activity size={18} className="text-gray-600" />;
  }
};

export const ServiceCard = ({ service, onJoin }) => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    if (onJoin) {
      onJoin(service);
    } else {
      navigate(`/queue/${service.id}`);
    }
  };

  const isPaused = service.status === 'Paused';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getCategoryIcon(service.category)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.25 }}>
              {service.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {service.department}
            </p>
          </div>
        </div>
        <span className="badge badge-category">{service.category}</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1 }}>
        {service.description}
      </p>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 0.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
          gap: '0.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Token
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
            {service.currentServing}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Waiting
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {service.peopleWaiting}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Est. Wait
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {service.estimatedWait} min
          </div>
        </div>
      </div>

      {/* Location / Counter footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        <MapPin size={14} style={{ flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {service.location}
        </span>
      </div>

      {/* Action Button */}
      <Button
        variant={isPaused ? 'secondary' : 'primary'}
        fullWidth
        disabled={isPaused}
        onClick={handleJoinClick}
        icon={<ChevronRight size={16} />}
        iconPosition="right"
      >
        {isPaused ? 'Queue Paused' : 'Join Queue'}
      </Button>
    </div>
  );
};
