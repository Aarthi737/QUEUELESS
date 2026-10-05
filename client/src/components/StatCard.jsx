import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'var(--primary-light)',
  iconColor = 'var(--primary)',
  trend,
  className = '',
}) => {
  return (
    <div className={`card ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      {icon && (
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {title}
        </p>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, margin: '2px 0' }}>
          {value}
        </h4>
        {subtitle && (
          <p style={{ fontSize: '0.775rem', color: 'var(--text-subtle)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
