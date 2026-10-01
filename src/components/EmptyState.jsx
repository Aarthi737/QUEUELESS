import React from 'react';
import { Inbox, CalendarX, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title = 'No active queue',
  description = 'You currently have no active queues. Explore available services to get a digital token.',
  actionText = 'Find a Queue',
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        {icon || <Inbox size={32} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
