import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search hospitals, banks or services...',
  className = '',
}) => {
  return (
    <div className={`search-wrapper ${className}`}>
      <Search className="search-icon" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '0.9rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
