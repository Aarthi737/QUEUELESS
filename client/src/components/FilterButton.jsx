import React from 'react';

export const FilterButton = ({
  label,
  active = false,
  onClick,
  count,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`category-filter-btn ${active ? 'active' : ''} ${className}`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          style={{
            marginLeft: '6px',
            fontSize: '0.75rem',
            opacity: active ? 0.9 : 0.7,
            backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'var(--border-subtle)',
            color: active ? '#FFFFFF' : 'var(--text-muted)',
            padding: '1px 6px',
            borderRadius: '9999px',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};
